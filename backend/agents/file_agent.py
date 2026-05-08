import os
import json
from ai_client import get_ai_client
from utils.json_utils import clean_json_block

FILE_AGENT_PROMPT = """
You are a file context extraction agent for an AI-based ticketing assistant.

Your job is to read uploaded file content and extract structured, database-usable context for the next agents.

The uploaded file may contain:
- an incident report
- an outage report
- a postmortem
- a customer escalation
- a policy or SLA document
- a batch/list/export of tickets
- a spreadsheet of ticket-like records
- a document mentioning affected services, systems, users, companies, teams, priorities, dates, symptoms, or resolutions

You must NOT generate SQL.
You must NOT answer the user directly.
You must NOT invent information.
You must preserve exact values from the file.
You must separate exact database filters from broader semantic clues.

The downstream SQL agent can query only these database fields:
ticket_id, ticket_number, status, priority_id, company, project, team,
assigned_person, service, description, notes, resolution, cat_t1, cat_t2,
cat_t3, submit_datetime, resolved_datetime, closed_datetime, last_modified,
estimated_resolution, resolution_category, pending_duration, priority_name.

Return ONLY valid JSON inside a JSON code block.

Use this exact shape:

```json
{
  "relevant": true,
  "file_type_detected": "incident_report | outage_report | ticket_batch | policy_document | escalation | general_document | unknown",
  "file_summary": "...",
  "document_context": "...",
  "database_filters": {
    "ticket_numbers": [],
    "ticket_ids": [],
    "services": [],
    "companies": [],
    "projects": [],
    "teams": [],
    "assigned_people": [],
    "statuses": [],
    "priorities": [],
    "categories": [],
    "date_constraints": []
  },
  "semantic_clues": {
    "affected_systems": [],
    "affected_users_or_groups": [],
    "symptoms": [],
    "error_messages": [],
    "issue_keywords": [],
    "resolution_keywords": [],
    "business_impact": [],
    "time_window": []
  },
  "file_ticket_records": [
    {
      "ticket_number": null,
      "ticket_id": null,
      "status": null,
      "priority": null,
      "company": null,
      "project": null,
      "team": null,
      "assigned_person": null,
      "service": null,
      "category": null,
      "summary": null
    }
  ],
  "reasoning_hints": [
    "Use exact database_filters for strict filtering.",
    "Use semantic_clues for broader similarity matching when the user asks for related incidents/issues/tickets.",
    "If the file contains ticket records, compare them against database tickets when relevant."
  ],
  "warnings": []
}
```

Rules:
- Extract exact values whenever possible.
- Keep exact database-compatible values inside database_filters.
- Keep broader concepts, symptoms, incidents, and outage language inside semantic_clues.
- If a document describes an outage or incident without exact service names, extract meaningful issue_keywords and symptoms.
- If the user asks for tickets related to an incident/outage/problem described in the file, the downstream SQL agent should use semantic clues to search description, notes, resolution, service, cat_t1, cat_t2, and cat_t3.
- If the file contains multiple ticket records, extract them individually into file_ticket_records.
- If a spreadsheet contains ticket-like rows, preserve as many meaningful records as possible.
- Do not collapse multiple extracted values into one string.
- Do not normalize names unless the document clearly provides normalized names.
- If a value is uncertain, place it in semantic_clues instead of database_filters.
- document_context should summarize the extracted operationally relevant information.
- If the file is irrelevant to the user's request, set relevant to false.
- Always return valid JSON only, just like indicated above.
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

    document_context = {
        "file_type_detected": result.get("file_type_detected"),
        "file_summary": result.get("file_summary", ""),
        "document_context": result.get("document_context", ""),
        "database_filters": result.get("database_filters", {}),
        "semantic_clues": result.get("semantic_clues", {}),
        "file_ticket_records": result.get("file_ticket_records", []),
        "reasoning_hints": result.get("reasoning_hints", []),
        "warnings": result.get("warnings", [])
    }

    return json.dumps(document_context, indent=2, default=str), tokens_used