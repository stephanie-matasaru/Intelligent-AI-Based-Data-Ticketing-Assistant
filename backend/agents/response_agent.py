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
You will receive a validation report and must explain the results clearly and concisely.

STRICT FORMATTING RULES (apply to every scenario):
- Maximum 8 lines total.
- Never use headers like "What went wrong" or "Next steps".
- Never use nested bullet points.
- Use short, direct sentences.
- Always start with a one-line summary.
- Always end with a single action line telling the user what to do next.
- Never mention SQL, INSERT statements, databases, or technical terms.

SCENARIO 1 - Perfect file (valid_rows > 0, no issues, no defaults, no skipped rows):
Summary line: "X rows validated successfully — ready to import."
Then: one sentence confirming everything looks good.
End: "You can preview and download the script below."

SCENARIO 2 - Wrong format file (valid_rows = 0):
Summary line: "0 rows ready — the file doesn't appear to be in the correct format."
Then: one sentence saying none of the columns matched ticket fields.
Then: one line listing minimum required columns: ticket_number, status, priority, company, project, team, service, description, submit_datetime.
End: "Please fix the file and re-upload."

SCENARIO 3 - Partial success (valid_rows > 0, skipped_rows > 0):
Summary line: "X rows ready, Y rows skipped."
Then: one bullet per skipped row explaining why it was skipped (max one sentence each).
Then: one sentence saying the script only includes the valid rows.
End: "Fix the skipped rows and re-upload to include them."

SCENARIO 4 - Warnings/defaults applied (valid_rows > 0, row_issues not empty):
Summary line: "X rows ready — some values were not recognized and were defaulted."
Then: one bullet per affected row listing the issue and what it defaulted to.
End: "Please review the script carefully before running it."

SCENARIO 5 - Extra unmapped columns:
Add one line after the summary: "The following columns were not recognized and were ignored: [list them]."
Then continue with the rest of the relevant scenario above.

SCENARIO 6 - Missing columns with defaults:
Add one line after the summary: "These expected columns were missing and defaults were applied: [list them with their defaults]."
Then continue with the rest of the relevant scenario above.
"""

def generate_explanation(question: str, history: list, results: list, final_output_type: str = None, chart_spec=None, excel_spec=None):
    client = get_ai_client()

    system_prompt = UNRELATED_PROMPT if final_output_type == "unrelated" else OUTPUT_PROMPT

    # data fix: only send the first 3 rows
    safe_results = results[:3] if isinstance(results, list) else results
    total_rows = len(results) if isinstance(results, list) else 0

    user_content = f"User question: {question}\n\nTotal rows found: {total_rows}\nData Sample: {safe_results}"

    explain_response = client.chat.completions.create(
        model=os.getenv("AZURE_OPENAI_MODEL"),
        messages=[
            {"role": "system", "content": system_prompt},
            *history,
            {"role": "user", "content": user_content}
        ],
        max_completion_tokens=1000
    )

    #  debugging: check what the AI does
    content = explain_response.choices[0].message.content
    
    print("\n--- RESPONSE AGENT DIAGNOSTICS ---")
    print(f"Finish Reason: {explain_response.choices[0].finish_reason}")
    print(f"Raw Output: {content}")
    print("----------------------------------\n")

    # failsafe: If the AI drops the response (content filter), manually build the text
    if not content:
        content = f"I found {total_rows} tickets matching your request."

    # inject the hidden action tag if base64 data exists from the Excel agent
    if excel_spec and "file_data_base64" in excel_spec:
        content += "\n\n[ACTION: DOWNLOAD_EXCEL]"

    tokens_used = explain_response.usage.total_tokens

    return content.strip(), tokens_used


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