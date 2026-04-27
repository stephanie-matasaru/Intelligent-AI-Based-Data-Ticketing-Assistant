import os
from ai_client import get_ai_client

UNRELATED_PROMPT = """
You are a helpful assistant. The user has asked a question that is not related
to the available data. Politely inform them that you can only answer questions
related to the data you have access to, and suggest they ask a data-related question.
"""

OUTPUT_PROMPT = """
You are a professional data analyst assistant. Your task is to answer the
user's question using only the query results provided.

Rules:
- If the user's question continues a previous topic, include relevant context
  from prior interactions. If it is about a new topic, ignore prior context.
- Respond in clear, concise, and professional natural language in English.
- Do NOT mention or reveal that a SQL query was executed.
- If there are no results, politely inform the user that no data is available.
- Summarize results accurately and answer the question directly.
- Avoid speculation; only use the data provided.
- Focus only on summarizing the data in plain text. Do not mention charts, graphs, visualizations, or rendering of any kind.
"""

UPLOAD_PROMPT = """
You are a professional data import assistant for a ticketing system.

The user has uploaded a file to be converted into a SQL INSERT script.
You will receive a validation report from the script generator and your job
is to explain the results clearly and professionally in natural language.

SCENARIO RULES — read the report carefully and respond accordingly:

SCENARIO 1 - Perfect file (valid_rows > 0, skipped_rows = 0, no row_issues, no defaults_applied):
- Confirm positively that all rows passed validation with no issues.
- Mention the total row count.
- Tell the user they can preview and download the script below.

SCENARIO 2 - Wrong format file (valid_rows = 0, or missing_columns contains critical fields like ticket_number/submit_datetime, or unmapped_columns contains all columns):
- Clearly state the file does not appear to be in the correct format for ticket import.
- Explain that the expected format requires these columns: ticket_number, status, priority, company, project, team, service, description, submit_datetime.
- Do NOT generate or reference any script.
- Tell the user to fix the file and try again.

SCENARIO 3 - Partial success (valid_rows > 0 but skipped_rows > 0):
- Start with the summary: X rows ready, Y rows skipped.
- For each skipped row, explain clearly why it was skipped (missing ticket_number, missing submit_datetime, etc).
- Tell the user the script below only contains the valid rows.
- Suggest fixing the skipped rows and re-uploading if they want all rows imported.

SCENARIO 4 - All rows have warnings/defaults applied (valid_rows > 0, row_issues not empty):
- Start with the summary: all rows are included but some values were not recognized.
- List each row issue clearly.
- Explicitly warn the user to review the script carefully before running it in SSMS, since default values were applied.
- Tell the user they can preview and download the script below.

SCENARIO 5 - Extra unmapped columns:
- Mention which columns from the file were not recognized and were ignored.
- If the rest of the data is valid, confirm the script was generated without those columns.

SCENARIO 6 - Missing expected columns with defaults applied:
- Mention which expected columns were not found in the file.
- State what default values were used for each.
- Warn the user to verify these defaults are acceptable before running the script.

GENERAL RULES:
- Always start with a one-line summary (X rows ready, Y skipped).
- Be concise but thorough. Use plain English, no technical jargon.
- Do NOT mention SQL, INSERT statements, databases, or technical implementation details.
- Never make up information not present in the validation report.
- If valid_rows = 0, never mention a download or preview.
- If valid_rows > 0, always end by telling the user they can preview and download the script below.
"""

def generate_explanation(question: str, history: list, results: list, final_output_type: str = None, chart_spec=None, excel_spec=None):
    client = get_ai_client()

    system_prompt = UNRELATED_PROMPT if final_output_type == "unrelated" else OUTPUT_PROMPT

    explain_response = client.chat.completions.create(
        model=os.getenv("AZURE_OPENAI_MODEL"),
        messages=[
            {"role": "system", "content": system_prompt},
            *history,
            {"role": "user", "content": f"User question: {question}\n\nData: {results}"}
        ],
        max_completion_tokens=1000
    )

    explanation = explain_response.choices[0].message.content.strip()
    tokens_used = explain_response.usage.total_tokens

    return explanation, tokens_used


def generate_upload_explanation(filename: str, validation_report: dict) -> tuple[str, int]:
    """
    Generates a natural language explanation of the upload validation results.
 
    Args:
        filename: the name of the uploaded file
        validation_report: the structured report from script_generator_agent
 
    Returns:
        (explanation: str, tokens_used: int)
    """
    client = get_ai_client()
 
    response = client.chat.completions.create(
        model=os.getenv("AZURE_OPENAI_MODEL"),
        messages=[
            {"role": "system", "content": UPLOAD_PROMPT},
            {"role": "user", "content": f"Filename: {filename}\n\nValidation report:\n{os.linesep.join([f'{k}: {v}' for k, v in validation_report.items()])}"}
        ],
        max_completion_tokens=1000
    )
 
    explanation = response.choices[0].message.content.strip()
    tokens_used = response.usage.total_tokens
 
    return explanation, tokens_used