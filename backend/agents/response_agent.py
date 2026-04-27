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
 
Rules:
- Start with a summary: how many rows are ready, how many were skipped.
- If all rows are valid, confirm this positively.
- If there are skipped rows, explain why each was skipped clearly.
- If there are row issues (warnings, defaults applied), list them clearly.
- If there are unmapped columns (extra columns in the file), mention them.
- If there are missing columns (expected but not found), mention them and what defaults were used.
- If the file is completely wrong format (0 valid rows), explain what is wrong and what the expected format is.
- Be concise but thorough. Use plain English, no technical jargon.
- Do NOT mention SQL, INSERT statements, or technical implementation details.
- End with a clear instruction: if there are valid rows, tell the user they can preview and download the script below. If there are no valid rows, tell them to fix the file and try again.
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