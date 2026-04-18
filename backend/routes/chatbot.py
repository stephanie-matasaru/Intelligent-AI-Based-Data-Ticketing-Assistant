from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from db import get_connection
from ai_client import get_ai_client
import os
import re
import uuid
from datetime import datetime

router = APIRouter()

class ChatRequest(BaseModel):
    question: str
    history: list = []
    group_id: str =  None

#the prompt needs to be revised and improved!!! this is only a starting point. 
# tests need to be done to see how the model responds.


SYSTEM_PROMPT = """
You are a SQL assistant for a ticketing system using Microsoft SQL Server.
You help users query incident ticket data by generating SQL queries.

Tables:
- tickets: ticket_id, ticket_number, status, priority_id, company, project, 
  team, assigned_person, service, description, notes, resolution,
  cat_t1, cat_t2, cat_t3, submit_datetime, resolved_datetime, closed_datetime,
  last_modified, estimated_resolution, resolution_category, pending_duration

- priorities: priority_id, priority_name, max_minutes
  (joined with tickets on priority_id)

Rules:
- SLA breach = resolved_datetime > estimated_resolution
- Resolution time = DATEDIFF(minute, submit_datetime, resolved_datetime)
- Always use proper SQL Server syntax
- Generate ONLY the SQL query, nothing else, no explanations, no markdown
- Only generate SELECT queries, never INSERT, UPDATE, DELETE or DROP

If the question is not related to the ticketing data, respond with exactly:
NOT_RELATED
"""

def clean_sql(sql: str) -> str:
    sql = re.sub(r"```sql|```", "", sql)
    return sql.strip()

FORBIDDEN = ["DROP", "DELETE", "UPDATE", "INSERT", "ALTER", "EXEC", "TRUNCATE"]

def is_safe_sql(sql: str) -> bool:
    sql_upper = sql.upper()
    return not any(word in sql_upper for word in FORBIDDEN)

def save_message(group_id, user_id, sender, message, query=None, json_chart=None, request_tokens=None, response_status="success"):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute(
            """INSERT INTO chat_messages 
            (group_id, user_id, sender, message, query, json_chart, request_tokens, response_status, date_added)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (group_id, user_id, sender, message, query, json_chart, request_tokens, response_status, datetime.utcnow())
        )
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"Failed to save message: {e}")

@router.post("/")
def ask_chatbot(data: ChatRequest):
    client = get_ai_client()

    # get user_id from session
    user_id = None
    if session_id:
        try:
            conn = get_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT user_id FROM sessions WHERE session_id = ?", (session_id,))
            row = cursor.fetchone()
            conn.close()
            if row:
                user_id = row[0]
        except:
            pass

    # use existing group_id or create new one
    group_id = data.group_id or str(uuid.uuid4())

    # save user message
    save_message(
        group_id=group_id,
        user_id=user_id,
        sender="user",
        message=data.question
    )

    # 1. generate SQL
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        *data.history,
        {"role": "user", "content": data.question}
    ]

    response = client.chat.completions.create(
        model=os.getenv("AZURE_OPENAI_MODEL"),
        messages=messages
    )

    sql_query = clean_sql(response.choices[0].message.content)
    request_tokens = response.usage.total_tokens if response.usage else None

    # question not related to ticketing data
    if sql_query == "NOT_RELATED":
        save_message(
            group_id=group_id,
            user_id=user_id,
            sender="agent",
            message="I can only answer questions about the ticketing system data.",
            response_status="not_related",
            request_tokens=request_tokens
        )
        return {
            "group_id": group_id,
            "question": data.question,
            "explanation": "I can only answer questions about the ticketing system data.",
            "sql": None,
            "results": None
        }

    # validate SQL 
    if not sql_query.strip().upper().startswith("SELECT"):
        raise HTTPException(status_code=400, detail="Only SELECT queries are allowed")

    if not is_safe_sql(sql_query):
        raise HTTPException(status_code=400, detail="Unsafe SQL query detected")

    # 2. execute SQL on DB
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute(sql_query)
        rows = cursor.fetchall()
        columns = [col[0] for col in cursor.description]
        results = [dict(zip(columns, row)) for row in rows]
        conn.close()
    except Exception as e:
        save_message(group_id=group_id, user_id=user_id, sender="agent",
                    message=str(e), response_status="failed")
        raise HTTPException(status_code=500, detail=f"SQL error: {str(e)}")
    
    # detect response type
    is_single_value = len(results) == 1 and len(results[0]) == 1

    # 3. explain result in natural language
    explain_response = client.chat.completions.create(
        model=os.getenv("AZURE_OPENAI_MODEL"),
        messages=[
            {"role": "system", "content": "You are a helpful assistant. Explain the following data in natural language in English. Be concise."},
            {"role": "user", "content": f"Question: {data.question}\nData: {results}"}
        ]
    )

    explanation = explain_response.choices[0].message.content.strip()
    explain_tokens = explain_response.usage.total_tokens if explain_response.usage else None

    save_message(
        group_id=group_id,
        user_id=user_id,
        sender="agent",
        message=explanation,
        query=sql_query,
        request_tokens=(request_tokens or 0) + (explain_tokens or 0),
        response_status="success"
    )

    return {
        "group_id": group_id,
        "question": data.question,
        "sql": sql_query,
        "results": results,
        "explanation": explanation,
        "is_single_value": is_single_value,
    }

@router.get("/health")
def chatbot_health():
    try:
        client = get_ai_client()
        if client:
            return {"status": "ok", "message": "AI client connected"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI client error: {str(e)}")