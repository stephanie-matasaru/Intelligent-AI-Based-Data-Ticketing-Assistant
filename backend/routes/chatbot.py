from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from db import get_connection
from agents.query_agent import generate_sql
from agents.response_agent import generate_explanation
from utils.sql_utils import is_safe_sql
import uuid
from typing import Optional

router = APIRouter()

class ChatRequest(BaseModel):
    question: str
    history: list = []
    user_id: int = None
    group_id: Optional[str] = None


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
    group_id = data.group_id or str(uuid.uuid4())

    # Save user message
    save_message(
        user_id=data.user_id,
        sender="user",
        message=data.question,
        status="pending",
        group_id=group_id
    )

    # 1. Generate SQL using agent
    sql_query, tokens_used = generate_sql(data.question, data.history)

    # Not related
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

    # 3. Generate explanation using agent
    explanation, explanation_tokens = generate_explanation(
        data.question,
        data.history,
        results
    )

    total_tokens = tokens_used + explanation_tokens

    # Save agent response
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
        # just check DB + basic import works
        return {"status": "ok", "message": "Service running"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")