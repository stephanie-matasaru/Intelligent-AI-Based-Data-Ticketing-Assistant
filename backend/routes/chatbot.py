from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from agents.query_agent import generate_sql
from agents.response_agent import generate_explanation
from utils.sql_utils import is_safe_sql
from services.chat_service import save_message, get_chat_history_by_user
from services.sql_service import execute_query
import uuid
from typing import Optional

router = APIRouter()

class ChatRequest(BaseModel):
    question: str
    history: list = []
    user_id: int = None
    group_id: Optional[str] = None


@router.post("/")
def ask_chatbot(data: ChatRequest):
    group_id = data.group_id or str(uuid.uuid4())

    save_message(
        user_id=data.user_id,
        sender="user",
        message=data.question,
        status="pending",
        group_id=group_id
    )

    sql_query, tokens_used = generate_sql(data.question, data.history)

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

    try:
        results = execute_query(sql_query)
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

    explanation, explanation_tokens = generate_explanation(
        data.question,
        data.history,
        results
    )

    total_tokens = tokens_used + explanation_tokens

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
        history = get_chat_history_by_user(user_id)
        return {"user_id": user_id, "history": history}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB error: {str(e)}")


@router.get("/health")
def chatbot_health():
    try:
        return {"status": "ok", "message": "Service running"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")