from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from fastapi.responses import JSONResponse
from services.file_parser_service import parse_uploaded_file
from agents.file_agent import generate_document_context
from agents.response_agent import generate_upload_explanation
from services.chat_service import save_message
from typing import Optional
import uuid

router = APIRouter()

@router.post("/")
async def upload_file(
    file: UploadFile = File(...),
    user_id: Optional[int] = Form(None),
    group_id: Optional[str] = Form(None)
):
    group_id = group_id or str(uuid.uuid4())

    # Validate file type
    allowed_extensions = ("xlsx", "xls", "csv")
    ext = file.filename.lower().split(".")[-1]
    if ext not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: .{ext}. Please upload a .xlsx or .csv file."
        )

    # Read file bytes
    try:
        file_bytes = await file.read()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not read file: {str(e)}")

    # Step 1: Parse the file
    try:
        parsed = parse_uploaded_file(file.filename, file_bytes)
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"File parsing error: {str(e)}")

    if parsed["row_count"] == 0:
        raise HTTPException(status_code=422, detail="The uploaded file has no data rows.")

    # Log user upload action
    save_message(
        user_id=user_id,
        sender="user",
        message=f"Uploaded file: {file.filename} ({parsed['row_count']} rows)",
        status="pending",
        group_id=group_id
    )

    # Step 2: Generate SQL INSERT script + validation report
    try:
        sql_script, validation_report, script_tokens = generate_sql_script(parsed)
    except Exception as e:
        save_message(
            user_id=user_id,
            sender="agent",
            message=str(e),
            status="Error",
            group_id=group_id
        )
        raise HTTPException(status_code=500, detail=f"Script generation error: {str(e)}")

    # Step 3: Response agent explains the results in natural language
    try:
        explanation, response_tokens = generate_upload_explanation(file.filename, validation_report)
        if not explanation:
            explanation = f"File processed: {validation_report.get('valid_rows', 0)} rows ready, {validation_report.get('skipped_rows', 0)} skipped."
    except Exception as e:
        explanation = f"File processed: {validation_report.get('valid_rows', 0)} rows ready, {validation_report.get('skipped_rows', 0)} skipped."
        response_tokens = 0
        
    total_tokens = script_tokens + response_tokens

    # Log agent response
    save_message(
        user_id=user_id,
        sender="agent",
        message=explanation,
        tokens=total_tokens,
        status="Success",
        group_id=group_id
    )

    script_filename = file.filename.rsplit(".", 1)[0] + "_import.sql"

    return JSONResponse(content={
        "explanation": explanation,
        "sql_script": sql_script,
        "script_filename": script_filename,
        "validation_report": validation_report,
        "group_id": group_id
    })


@router.get("/health")
def upload_health():
    return {"status": "ok", "message": "Upload service running"}