import os
import json
from ai_client import get_ai_client
from utils.json_utils import clean_json_block


FILE_AGENT_PROMPT = """
You are a file context extraction agent for an AI-based ticketing assistant.

Your job is to read parsed content from an uploaded file and extract only the information
that is relevant to the user's question.

The uploaded file may be:
- CSV / Excel structured data
- PDF text split by pages
- Word document paragraphs and tables

You must NOT generate SQL.
You must NOT invent information.
You must NOT answer the user directly.
You only prepare useful context for the next agent.

OUTPUT FORMAT (MANDATORY):
Return ONLY valid JSON inside a ```json code block, exactly like this:
```json
{
  "document_context": "Concise relevant information extracted from the uploaded file.",
  "file_summary": "Brief summary of what the uploaded file contains.",
  "relevant": true,
  "warnings": []
}
```

Rules:
- If the file is not relevant to the user's question, set relevant to false.
- Keep document_context concise.
- Include exact numbers, dates, policy names, SLA rules, ticket IDs, priorities, statuses, or people when relevant.
- Preserve important details from tables.
- Mention parser warnings if they affect reliability.
- Do NOT include explanations or any text outside the JSON block.
- Always return valid JSON inside the markdown JSON block.
"""


def generate_document_context(question: str, history: list, parsed_files: list) -> tuple[str, int]:
    """
    Args:
        question: user's question
        history: chat history
        parsed_files: list of parsed file dicts from file_parsing_service

    Returns:
        (document_context: str, tokens_used: int)
    """

    if not parsed_files:
        return "", 0

    client = get_ai_client()

    files_to_send = []

    for index, parsed_file in enumerate(parsed_files, start=1):
        compact_file = {
            "file_index": index,
            "type": parsed_file.get("type", "structured"),
            "columns": parsed_file.get("columns"),
            "row_count": parsed_file.get("row_count"),
            "warnings": parsed_file.get("warnings", [])
        }

        if "rows" in parsed_file:
            compact_file["rows"] = parsed_file["rows"][:50]
            compact_file["truncated"] = parsed_file.get("row_count", 0) > 50

        if "pages" in parsed_file:
            compact_file["pages"] = parsed_file["pages"][:10]
            compact_file["truncated"] = len(parsed_file["pages"]) > 10

        if "paragraphs" in parsed_file:
            compact_file["paragraphs"] = parsed_file["paragraphs"][:80]
            compact_file["tables"] = parsed_file.get("tables", [])[:10]
            compact_file["truncated"] = (
                len(parsed_file.get("paragraphs", [])) > 80
                or len(parsed_file.get("tables", [])) > 10
            )

        files_to_send.append(compact_file)

    user_content = f"""
User question:
{question}

Conversation history:
{json.dumps(history, indent=2, default=str)}

Parsed uploaded files:
{json.dumps(files_to_send, indent=2, default=str)}
"""

    response = client.chat.completions.create(
        model=os.getenv("AZURE_OPENAI_MODEL"),
        messages=[
            {"role": "system", "content": FILE_AGENT_PROMPT},
            {"role": "user", "content": user_content}
        ],
        max_completion_tokens=2000
    )

    content = response.choices[0].message.content.strip()
    cleaned = clean_json_block(content)
    tokens_used = response.usage.total_tokens

    try:
        result = json.loads(cleaned)
    except json.JSONDecodeError:
        return "The uploaded file was parsed, but its contents could not be reliably summarized.", tokens_used

    if not result.get("relevant", True):
        return "", tokens_used

    document_context = result.get("document_context", "")

    warnings = result.get("warnings", [])
    if warnings:
        document_context += "\n\nFile warnings: " + "; ".join(warnings)

    return document_context, tokens_used