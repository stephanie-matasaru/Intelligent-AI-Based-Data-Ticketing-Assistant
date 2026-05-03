from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from fastapi.responses import JSONResponse
from services.file_parser_service import parse_uploaded_file
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

    allowed_extensions = ("xlsx", "xls", "csv", "pdf", "docx")
    ext = file.filename.lower().split(".")[-1]

    if ext not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: .{ext}. Please upload a .xlsx, .xls, .csv, .pdf, or .docx file."
        )

    try:
        file_bytes = await file.read()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not read file: {str(e)}")

    try:
        parsed = parse_uploaded_file(file.filename, file_bytes)
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"File parsing error: {str(e)}")

    parsed["filename"] = file.filename
    parsed["extension"] = ext

    row_count = parsed.get("row_count")
    page_count = parsed.get("page_count")
    paragraph_count = parsed.get("paragraph_count")

    if row_count is not None:
        readable_count = f"{row_count} rows"
    elif page_count is not None:
        readable_count = f"{page_count} pages"
    elif paragraph_count is not None:
        readable_count = f"{paragraph_count} paragraphs"
    else:
        readable_count = "parsed content"

    save_message(
        user_id=user_id,
        sender="user",
        message=f"Uploaded file: {file.filename} ({readable_count})",
        status="Success",
        group_id=group_id
    )

    return JSONResponse(content={
        "message": f"File uploaded and parsed successfully: {file.filename}",
        "filename": file.filename,
        "parsed_file": parsed,
        "group_id": group_id
    })


@router.get("/health")
def upload_health():
    return {"status": "ok", "message": "Upload service running"}