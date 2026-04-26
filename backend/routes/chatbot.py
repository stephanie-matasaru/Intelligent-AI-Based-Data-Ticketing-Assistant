from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from agents.orchestrator_agent import generate_plan
from agents.query_agent import generate_sql
from agents.response_agent import generate_explanation
from utils.sql_utils import is_safe_sql
from services.chat_service import save_message, get_chat_history_by_user
from services.sql_service import execute_query
from agents.visualizer_agent import generate_chart_spec
from services.graph_service import process_chart_spec
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

    try:
        plan, orchestration_tokens = generate_plan(data.question, data.history)
    except Exception as e:
        save_message(
            user_id=data.user_id,
            sender="agent",
            message=str(e),
            status="Error",
            group_id=group_id
        )
        raise HTTPException(status_code=500, detail=f"Orchestration error: {str(e)}")

    context = {
        "question": data.question,
        "history": data.history,
        "sql_query": None,
        "results": None,
        "explanation": None,
        "chart_spec": None
    }

    total_tokens = orchestration_tokens

    for step in plan["steps"]:
        step_type = step["type"]
        step_name = step["name"]

        if step_type == "agent" and step_name == "query_agent":
            sql_query, used_tokens = generate_sql(
                context["question"],
                context["history"]
            )

            context["sql_query"] = sql_query
            total_tokens += used_tokens

            if sql_query.strip() == "NOT_RELATED":
                explanation, used_tokens = generate_explanation(
                question=context["question"],
                history=context["history"],
                results=None,
                final_output_type="I can only answer questions about the ticketing system data."
            )
            context["explanation"] = explanation
            total_tokens += used_tokens
            break

            if not is_safe_sql(sql_query):
                save_message(
                    user_id=data.user_id,
                    sender="agent",
                    message="Invalid or unsafe SQL query generated.",
                    query=sql_query,
                    status="Error",
                    tokens=total_tokens,
                    group_id=group_id
                )
                raise HTTPException(status_code=400, detail="Invalid or unsafe SQL query generated.")

        elif step_type == "service" and step_name == "sql_service":
            try:
                context["results"] = execute_query(context["sql_query"])
            except Exception as e:
                save_message(
                    user_id=data.user_id,
                    sender="agent",
                    message=str(e),
                    query=context["sql_query"],
                    status="Error",
                    tokens=total_tokens,
                    group_id=group_id
                )
                raise HTTPException(status_code=500, detail=f"SQL error: {str(e)}")

        elif step_type == "agent" and step_name == "response_agent":
            if context["explanation"] is None:
                explanation, used_tokens = generate_explanation(
                    question=context["question"],
                    history=context["history"],
                    results=context["results"],
                    final_output_type=plan["final_output"],
                    chart_spec=context["chart_spec"]
                )
            context["explanation"] = explanation
            total_tokens += used_tokens

        elif step_type == "agent" and step_name == "visualizer_agent":
            chart_spec, used_tokens = generate_chart_spec(
                context["question"],
                context["results"]
            )
            context["chart_spec"] = chart_spec
            total_tokens += used_tokens

        elif step_type == "service" and step_name == "graph_service":
            try:
                context["chart_spec"] = process_chart_spec(context["chart_spec"])
            except ValueError as e:
                save_message(
                    user_id=data.user_id,
                    sender="agent",
                    message=str(e),
                    status="Error",
                    tokens=total_tokens,
                    group_id=group_id
                )
                raise HTTPException(status_code=500, detail=f"Chart processing error: {str(e)}")
        else:
            save_message(
                user_id=data.user_id,
                sender="agent",
                message=f"Step not implemented yet: {step_name}",
                status="Error",
                tokens=total_tokens,
                group_id=group_id
            )
            raise HTTPException(status_code=501, detail=f"Step not implemented yet: {step_name}")

    sql_query = context["sql_query"]
    results = context["results"]
    explanation = context["explanation"]
    chart_spec = context["chart_spec"]

    is_single_value = bool(results) and len(results) == 1 and len(results[0]) == 1

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
        "chart_spec": chart_spec,
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