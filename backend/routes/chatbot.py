from multiprocessing import context

from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from agents.orchestrator_agent import generate_plan
from agents.query_agent import generate_sql
from agents.response_agent import generate_explanation
from utils.sql_utils import is_safe_sql
from services.chat_service import save_message, get_chat_history_by_user
from services.sql_service import execute_query
from agents.visualizer_agent import generate_chart_spec
from services.graph_service import process_chart_spec
from agents.excel_agent import generate_excel_spec
from agents.file_agent import generate_document_context
from services.excel_service import process_excel_spec
from db import get_connection
import uuid
from typing import Optional, List
import json
from services.file_parser_service import parse_uploaded_file


router = APIRouter()

ALLOWED_EXTENSIONS = {"xlsx", "xls", "csv", "pdf", "docx"}


async def parse_chat_files(files: Optional[List[UploadFile]]) -> list:
    parsed_files = []

    if not files:
        return parsed_files

    for file in files:
        ext = file.filename.lower().split(".")[-1]

        if ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file type: .{ext}."
            )

        file_bytes = await file.read()
        parsed = parse_uploaded_file(file.filename, file_bytes)

        parsed["filename"] = file.filename
        parsed["extension"] = ext
        parsed_files.append(parsed)

    return parsed_files


def force_file_agent_if_needed(plan: dict, has_files: bool) -> dict:
    if not has_files:
        return plan

    steps = plan.get("steps", [])

    if plan.get("final_output") == "unrelated":
        plan["final_output"] = "text"
        plan["steps"] = [
            {"type": "agent",   "name": "file_agent",    "task": "Extract context from uploaded file"},
            {"type": "agent",   "name": "query_agent",   "task": "Generate SQL using file context"},
            {"type": "service", "name": "sql_service",   "task": "Execute the SQL query"},
            {"type": "agent",   "name": "response_agent","task": "Generate the final answer"},
        ]
        return plan

    if any(step.get("name") == "file_agent" for step in steps):
        return plan

    query_index = next(
        (i for i, step in enumerate(steps) if step.get("name") == "query_agent"),
        None
    )

    if query_index is not None:
        steps.insert(query_index, {
            "type": "agent",
            "name": "file_agent",
            "task": "Extract context from uploaded file"
        })
    else:
        response_index = next(
            (i for i, step in enumerate(steps) if step.get("name") == "response_agent"),
            len(steps)
        )
        steps.insert(response_index, {
            "type": "agent",
            "name": "file_agent",
            "task": "Extract context from uploaded file"
        })

    plan["steps"] = steps
    return plan

@router.post("/")
async def ask_chatbot(
    question: str = Form(...),
    history: str = Form("[]"),
    user_id: Optional[int] = Form(None),
    group_id: Optional[str] = Form(None),
    files: Optional[List[UploadFile]] = File(None)
):
    is_new_group = not group_id
    group_id = group_id or str(uuid.uuid4())

    try:
        parsed_history = json.loads(history)
    except json.JSONDecodeError:
        parsed_history = []

    parsed_files = await parse_chat_files(files)
    save_message(
        user_id=user_id,
        sender="user",
        message=question,
        status="pending",
        group_id=group_id,
        attached_file_name=parsed_files[0]["filename"] if parsed_files else None
    )

    if is_new_group:
        from routes.chat_history import generate_title
        title = generate_title(question)
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE chat_messages SET title = ? WHERE group_id = ?
        """, title, group_id)
        conn.commit()
        conn.close()

    try:
        planning_question = question

        if parsed_files:
            filenames = ", ".join(f["filename"] for f in parsed_files)
            planning_question += "\n\nUploaded files are present: {filenames}"

        plan, orchestration_tokens = generate_plan(planning_question, parsed_history)
        plan = force_file_agent_if_needed(plan, bool(parsed_files))
        print("DEBUG PLAN:", json.dumps(plan, indent=2))
        print("DEBUG FINAL STEPS:", [s["name"] for s in plan["steps"]])
    except Exception as e:
        save_message(
            user_id=user_id,
            sender="agent",
            message=str(e),
            status="Error",
            group_id=group_id
        )
        raise HTTPException(status_code=500, detail=f"Orchestration error: {str(e)}")

    context = {
        "question": question,
        "history": parsed_history,
        "sql_query": None,
        "results": None,
        "explanation": None,
        "chart_spec": None,
        "excel_spec": None,
        "document_context": None
    }

    total_tokens = orchestration_tokens

    for step in plan["steps"]:
        step_type = step["type"]
        step_name = step["name"]

        if step_type == "agent" and step_name == "query_agent":
            question_for_sql = context["question"]

            if context.get("document_context"):
                try:
                    doc = json.loads(context["document_context"])
                    
                    slim_context = {
                        "file_summary": doc.get("file_summary", ""),
                        "database_filters": doc.get("database_filters", {}),
                        "semantic_clues": doc.get("semantic_clues", {}),
                    }

                    # document_context can be very long for PDFs/Word docs - truncate it
                    narrative = doc.get("document_context", "")
                    if len(narrative) > 500:
                        slim_context["document_context"] = narrative[:500] + "... [truncated]"
                    else:
                        slim_context["document_context"] = narrative

                    # ticket records capped at 50
                    records = doc.get("file_ticket_records", [])
                    if records:
                        slim_context["file_ticket_records"] = records[:50]
                        if len(records) > 50:
                            slim_context["file_ticket_records_truncated"] = True

                    slim_context_str = json.dumps(slim_context, indent=2)
                except Exception:
                    slim_context_str = context["document_context"]

                question_for_sql = f"""User question: {context["question"]}

The user has uploaded a file. Use the extracted context below to build your SQL query.
Do NOT return NOT_RELATED — this is a ticketing data question that requires database filtering based on the file.

Uploaded file context (JSON):
{slim_context_str}"""
            print("DEBUG question_for_sql length:", len(question_for_sql))
            print("DEBUG question_for_sql preview:", question_for_sql[:300])
            sql_query, used_tokens = generate_sql(
                question_for_sql,
                []
            )            

            context["sql_query"] = sql_query
            total_tokens += used_tokens

            if sql_query.strip() == "NOT_RELATED":
                if context.get("document_context"):
                    # file context was provided — don't treat as unrelated, fail gracefully instead
                    context["explanation"] = "I couldn't generate a query from the uploaded file context. Please try rephrasing your question."
                    break
                explanation, used_tokens = generate_explanation(
                    question=context["question"],
                    history=context["history"],
                    results=None,
                    final_output_type="unrelated"
                )
                print("DEBUG EXPLANATION RESULT:", explanation)
                print("DEBUG EXPLANATION TOKENS:", used_tokens)
                context["explanation"] = explanation
                total_tokens += used_tokens
                break

            if not is_safe_sql(sql_query):
                print("REJECTED SQL:", sql_query)
                save_message(
                    user_id=user_id,
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
                    user_id=user_id,
                    sender="agent",
                    message=str(e),
                    query=context["sql_query"],
                    status="Error",
                    tokens=total_tokens,
                    group_id=group_id
                )
                raise HTTPException(status_code=500, detail=f"SQL error: {str(e)}")
            
        elif step_type == "agent" and step_name == "excel_agent":
            if context.get("results") and len(context["results"]) > 0: # only trigger excel_agent if the SQL query found data
                excel_spec, used_tokens = generate_excel_spec(
                    context["question"],
                    context["results"]
                )
                context["excel_spec"] = excel_spec
                total_tokens += used_tokens

        elif step_type == "service" and step_name == "excel_service":
            if context.get("excel_spec"): # only trigger excel_service if the agent successfully made a blueprint
                try:
                    context["excel_spec"]["data"] = context["results"]
                    context["excel_spec"] = process_excel_spec(context["excel_spec"])
                except ValueError as e:
                    save_message(
                        user_id=user_id,
                        sender="agent",
                        message=str(e),
                        status="Error",
                        tokens=total_tokens,
                        group_id=group_id
                    )
                    raise HTTPException(status_code=500, detail=f"Excel processing error: {str(e)}")

        elif step_type == "agent" and step_name == "response_agent":
            if not context.get("results") or len(context["results"]) == 0: # if the excel has 0 rows the plan goes back to only text
                context["excel_spec"] = None
                if plan.get("final_output") == "text_and_excel":
                    plan["final_output"] = "text"

            if context["explanation"] is None:
                explanation, used_tokens = generate_explanation(
                    question=context["question"],
                    history=context["history"],
                    results=context["results"],
                    final_output_type=plan["final_output"],
                    chart_spec=context["chart_spec"],
                    excel_spec=context["excel_spec"],
                    document_context=context["document_context"]
                )
                print("DEBUG EXPLANATION RESULT:", explanation)
                print("DEBUG EXPLANATION TOKENS:", used_tokens)
                context["explanation"] = explanation
                total_tokens += used_tokens
                if plan["final_output"] == "text_and_excel" and context.get("excel_spec"):
                    context["explanation"] = context["explanation"] + " [ACTION: DOWNLOAD_EXCEL]"

            print("DEBUG: response_agent step reached")
            print("DEBUG results:", context["results"])
            print("DEBUG explanation before:", context["explanation"])

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
                    user_id=user_id,
                    sender="agent",
                    message=str(e),
                    status="Error",
                    tokens=total_tokens,
                    group_id=group_id
                )
                raise HTTPException(status_code=500, detail=f"Chart processing error: {str(e)}")
            
        elif step_type == "agent" and step_name == "file_agent":
            document_context, used_tokens = generate_document_context(
                context["question"],
                context["history"],
                parsed_files)
            context["document_context"] = document_context
            total_tokens += used_tokens        

        else:
            save_message(
                user_id=user_id,
                sender="agent",
                message=f"Step not implemented yet: {step_name}",
                status="Error",
                tokens=total_tokens,
                group_id=group_id
            )
            raise HTTPException(status_code=501, detail=f"Step not implemented yet: {step_name}")

    sql_query = context["sql_query"]
    results = context["results"]
    explanation = context.get("explanation") or "I'm sorry, I could not generate a response."
    chart_spec = context["chart_spec"]
    excel_spec = context["excel_spec"]

    is_single_value = bool(results) and len(results) == 1 and len(results[0]) == 1

    save_message(
        user_id=user_id,
        sender="agent",
        message=explanation,
        query=sql_query,
        tokens=total_tokens,
        status="Success",
        group_id=group_id,
        export_file_path=excel_spec.get("file_path") if excel_spec else None,
        chart_spec=chart_spec,
        excel_spec=excel_spec
    )

    return {
        "question": question,
        "sql": sql_query,
        "results": results,
        "explanation": explanation,
        "is_single_value": is_single_value,
        "chart_spec": chart_spec,
        "excel_spec": excel_spec,
        "document_context": context["document_context"],
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