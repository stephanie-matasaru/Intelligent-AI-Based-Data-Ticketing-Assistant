import os
import json
from ai_client import get_ai_client

SCRIPT_GENERATOR_PROMPT = """
You are a SQL script generator and data validator for a ticketing system using Microsoft SQL Server.

Your job is to receive structured rows from an uploaded file, validate them thoroughly,
and generate valid T-SQL INSERT statements for the tickets table.

TARGET SCHEMA:
tickets table columns:
- ticket_number VARCHAR(20) NOT NULL UNIQUE
- status NVARCHAR(30) NOT NULL
- priority_id INT NOT NULL  -- map priority names: Critical=1, High=2, Medium=3, Low=4
- company NVARCHAR(100) NOT NULL
- project NVARCHAR(100) NOT NULL
- team NVARCHAR(100) NOT NULL
- assigned_person NVARCHAR(100) NULL
- service NVARCHAR(100) NOT NULL
- description NVARCHAR(255) NOT NULL
- notes NVARCHAR(1000) NULL
- resolution NVARCHAR(1000) NULL
- cat_t1 NVARCHAR(50) NULL
- cat_t2 NVARCHAR(50) NULL
- cat_t3 NVARCHAR(50) NULL
- submit_datetime DATETIME2 NOT NULL
- resolved_datetime DATETIME2 NULL
- closed_datetime DATETIME2 NULL
- estimated_resolution DATETIME2 NULL
- resolution_category NVARCHAR(100) NULL
- pending_duration INT NOT NULL DEFAULT 0

VALIDATION RULES:
Required columns (must exist in file or have a default):
- ticket_number: must be non-empty and unique within the file
- status: must be one of Open, In Progress, Pending, Resolved, Closed. If missing default to 'Open'.
- priority: must map to Critical/High/Medium/Low or P1/P2/P3/P4. If unrecognized default to Medium.
- company, project, team, service, description: must be non-empty. Default to 'Unknown' or 'Imported ticket' if missing.
- submit_datetime: must be a valid datetime. If missing or invalid, flag the row.

Flag these issues per row:
- Missing required field (ticket_number, submit_datetime)
- Unrecognized priority value (note what was found, what it defaulted to)
- Unrecognized status value (note what was found, what it defaulted to)
- Duplicate ticket_number within the file
- Date fields in unexpected formats
- Values that are too long for their column (e.g. description > 255 chars)
- Extra columns in the file that do not map to any schema column
- Columns that were expected but not found in the file

MAPPING RULES:
- Map file columns to schema columns by closest name match (case-insensitive, ignore spaces/underscores)
- Examples: "Ticket ID" -> ticket_number, "Priority Level" -> priority, "Assigned To" -> assigned_person
- priority_id mapping: Critical/P1=1, High/P2=2, Medium/P3=3, Low/P4=4
- Escape all single quotes by doubling them ('')
- For NULL values use NULL (no quotes)
- Datetime format: 'YYYY-MM-DDTHH:MM:SS'

OUTPUT FORMAT - return ONLY this JSON structure, no other text:
{
  "sql_script": "USE TicketingSystem;\\nGO\\n\\nINSERT INTO tickets (...) VALUES\\n(...);\\nGO",
  "valid_rows": 8,
  "skipped_rows": 2,
  "total_rows": 10,
  "column_mapping": {
    "ticket_number": "ticket_number",
    "Ticket ID": "ticket_number"
  },
  "unmapped_columns": ["extra_col1"],
  "missing_columns": ["submit_datetime"],
  "row_issues": [
    {
      "row": 3,
      "ticket_number": "INC003",
      "issues": ["Priority 'Urgent' not recognized, defaulted to Medium"]
    }
  ],
  "skipped_row_details": [
    {
      "row": 7,
      "ticket_number": null,
      "reason": "ticket_number is missing and cannot be defaulted"
    }
  ],
  "defaults_applied": ["status defaulted to Open for 2 rows", "company defaulted to Unknown for 1 row"],
  "truncated": false
}

IMPORTANT:
- If sql_script has no valid rows, set it to null.
- Only include rows with valid ticket_number and submit_datetime in the SQL.
- Always return valid JSON. No markdown, no code blocks, no extra text.
"""

def generate_sql_script(parsed_file: dict) -> tuple[str, dict, int]:
    """
    Takes the output of file_parser_service, validates rows, and generates a SQL INSERT script.

    Args:
        parsed_file: dict with keys: columns, rows, row_count, warnings

    Returns:
        (sql_script: str or None, validation_report: dict, tokens_used: int)
    """
    client = get_ai_client()

    rows_to_send = parsed_file["rows"][:100]
    truncated = parsed_file["row_count"] > 100

    user_content = f"""
File columns: {parsed_file['columns']}
Row count: {parsed_file['row_count']}
{"Note: Only the first 100 rows are shown due to size limits." if truncated else ""}
Parser warnings: {parsed_file['warnings']}

Rows:
{json.dumps(rows_to_send, indent=2, default=str)}
"""

    response = client.chat.completions.create(
        model=os.getenv("AZURE_OPENAI_MODEL"),
        messages=[
            {"role": "system", "content": SCRIPT_GENERATOR_PROMPT},
            {"role": "user", "content": user_content}
        ],
        max_completion_tokens=4000
    )

    content = response.choices[0].message.content.strip()
    tokens_used = response.usage.total_tokens

    try:
        result = json.loads(content)
    except json.JSONDecodeError:
        return None, {
            "valid_rows": 0,
            "skipped_rows": parsed_file["row_count"],
            "total_rows": parsed_file["row_count"],
            "row_issues": [],
            "skipped_row_details": [],
            "unmapped_columns": [],
            "missing_columns": [],
            "defaults_applied": [],
            "error": "Agent returned malformed output. Please try again."
        }, tokens_used

    sql_script = result.get("sql_script") or None
    validation_report = {k: v for k, v in result.items() if k != "sql_script"}

    return sql_script, validation_report, tokens_used