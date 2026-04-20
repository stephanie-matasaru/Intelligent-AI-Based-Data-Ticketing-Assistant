from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from db import get_connection
from ai_client import get_ai_client
import os
import re
import uuid

router = APIRouter()

class ChatRequest(BaseModel):
    question: str
    history: list = []
    user_id: int = None
    group_id: str = None  

INPUT_PROMPT = """
You are a SQL assistant for a ticketing system using Microsoft SQL Server.
You must generate a valid T-SQL SELECT query based on the user's question.

DATA SOURCE:
- Query ONLY from the tickets and priorities tables.
- tickets: ticket_id, ticket_number, status, priority_id, company, project,
  team, assigned_person, service, description, notes, resolution,
  cat_t1, cat_t2, cat_t3, submit_datetime, resolved_datetime, closed_datetime,
  last_modified, estimated_resolution, resolution_category, pending_duration
- priorities: priority_id, priority_name, max_minutes
  (JOIN tickets ON priority_id)

RULES:
- SLA breach = resolved_datetime > estimated_resolution
- Resolution time = DATEDIFF(minute, submit_datetime, resolved_datetime)
- Always use proper T-SQL syntax.
- Do NOT include unnecessary columns unless requested.

OUTPUT FORMAT (MANDATORY):
- Return ONLY the SQL query inside a code block, exactly like this:
```sql
SELECT ...
```
- Do NOT return explanations, comments, or any extra text outside the SQL block.

FILTERING RULES:
- If a name contains multiple words (e.g., "John Smith"):
  Split into words and match EACH word using LIKE with AND.
  Example: (assigned_person LIKE '%John%' AND assigned_person LIKE '%Smith%')

If the question is not related to ticketing data, respond with exactly:
NOT_RELATED
"""

OUTPUT_PROMPT = """
You are a professional data analyst assistant. Your task is to answer the
user's question using only the query results provided.

Rules:
- If the user's question continues a previous topic, include relevant context
  from prior interactions. If it is about a new topic, ignore prior context.
- Respond in clear, concise, and professional natural language in English.
- Do NOT mention or reveal that a SQL query was executed.
- If there are no results, politely inform the user that no data is available.
- Summarize results accurately and answer the question directly.
- Avoid speculation; only use the data provided.
- Do NOT suggest graphical representation or file export to the user.
"""

def clean_sql(sql: str) -> str:
    sql = re.sub(r"```sql|```", "", sql)
    return sql.strip()

FORBIDDEN = r"(delete|insert|update|drop|alter|truncate)"
ALLOWED   = r"^(select|declare|with)"

def is_safe_sql(sql: str) -> bool:
    return (
        bool(re.match(ALLOWED, sql.strip(), re.IGNORECASE)) and
        not re.search(FORBIDDEN, sql, re.IGNORECASE)
    )

def save_message(user_id, sender, message, query=None, tokens=None, status="pending", group_id=None):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO chat_messages 
                (group_id, user_id, sender, message, query, request_tokens, response_status)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            str(group_id) if group_id else str(uuid.uuid4()),
            user_id,
            sender,
            message,
            query,
            tokens,
            status
        ))
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"Warning: could not save message to DB: {e}")

@router.post("/")
def ask_chatbot(data: ChatRequest):
    client = get_ai_client()

    # use existing group_id or create a new one for this session
    group_id = data.group_id or str(uuid.uuid4())

    # save user question
    save_message(
        user_id=data.user_id,
        sender="user",
        message=data.question,
        status="pending",
        group_id=group_id
    )

    # 1. Generate SQL
    messages = [
        {"role": "system", "content": INPUT_PROMPT},
        *data.history,
        {"role": "user", "content": data.question}
    ]

    response = client.chat.completions.create(
        model=os.getenv("AZURE_OPENAI_MODEL"),
        messages=messages,
        max_completion_tokens=1000
    )

    sql_query = clean_sql(response.choices[0].message.content)
    tokens_used = response.usage.total_tokens

    # Question not related to ticketing data
    if sql_query.strip() == "NOT_RELATED":
        explanation = "I can only answer questions about the ticketing system data."
        save_message(
            user_id=data.user_id,
            sender="agent",
            message=explanation,
            status="Success",
            tokens=tokens_used,
            group_id=group_id
        )
        return {
            "question": data.question,
            "explanation": explanation,
            "sql": None,
            "results": None,
            "group_id": group_id
        }

    # Validate SQL
    if not is_safe_sql(sql_query):
        save_message(
            user_id=data.user_id,
            sender="agent",
            message="Invalid or unsafe SQL query generated.",
            query=sql_query,
            status="Error",
            tokens=tokens_used,
            group_id=group_id
        )
        raise HTTPException(status_code=400, detail="Invalid or unsafe SQL query generated.")

    # 2. Execute SQL
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute(sql_query)
        rows = cursor.fetchall()
        columns = [col[0] for col in cursor.description]
        results = [dict(zip(columns, row)) for row in rows]
        conn.close()
    except Exception as e:
        save_message(
            user_id=data.user_id,
            sender="agent",
            message=str(e),
            query=sql_query,
            status="Error",
            tokens=tokens_used,
            group_id=group_id
        )
        raise HTTPException(status_code=500, detail=f"SQL error: {str(e)}")

    is_single_value = len(results) == 1 and len(results[0]) == 1

    # 3. Explain result in natural language
    explain_response = client.chat.completions.create(
        model=os.getenv("AZURE_OPENAI_MODEL"),
        messages=[
            {"role": "system", "content": OUTPUT_PROMPT},
            *data.history,
            {"role": "user", "content": f"User question: {data.question}\n\nData: {results}"}
        ],
        max_completion_tokens=1000
    )

    explanation = explain_response.choices[0].message.content.strip()
    total_tokens = tokens_used + explain_response.usage.total_tokens

    # save agent response
    save_message(
        user_id=data.user_id,
        sender="agent",
        message=explanation,
        query=sql_query,
        tokens=total_tokens,
        status="Success",
        group_id=group_id
    )

    return {
        "question": data.question,
        "sql": sql_query,
        "results": results,
        "explanation": explanation,
        "is_single_value": is_single_value,
        "group_id": group_id
    }

@router.get("/history/{user_id}")
def get_chat_history(user_id: int):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT group_id, sender, message, query, response_status, date_added
            FROM chat_messages
            WHERE user_id = ? AND delete_flag = 0
            ORDER BY date_added ASC
        """, (user_id,))
        rows = cursor.fetchall()
        columns = [col[0] for col in cursor.description]
        history = [dict(zip(columns, row)) for row in rows]
        conn.close()
        return {"user_id": user_id, "history": history}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB error: {str(e)}")

@router.get("/health")
def chatbot_health():
    try:
        client = get_ai_client()
        if client:
            return {"status": "ok", "message": "AI client connected"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI client error: {str(e)}")