import os
import json
from ai_client import get_ai_client
from utils.json_utils import clean_json_block

EXCEL_PROMPT = """
You are an Excel export assistant for a ticketing system.

You receive:
- The user's export request
- A list of query results (JSON rows)

Your job is to determine the structure of the Excel file to be generated.

OUTPUT FORMAT (MANDATORY):
Return ONLY valid JSON inside a ```json code block, exactly like this:
```json
{
  "filename": "suggested_file_name.xlsx",
  "sheet_name": "Sheet1",
  "columns_to_include": ["col_name_1", "col_name_2"]
}
RULES:
-filename must end in .xlsx and use underscores instead of spaces.
-sheet_name should be a short, readable name (max 31 characters).
-columns_to_include must be a list of exact dictionary keys found in the JSON rows.
-only include columns that are relevant to the user's specific request. If they didn't specify, include all logical columns.
-do NOT include explanations or any text outside the JSON block.
"""
def generate_excel_spec(question: str, results: list):
    client = get_ai_client()

    messages = [
        {"role": "system", "content": EXCEL_PROMPT},
        {
            "role": "user",
            "content": f"User request: {question}\n\nAvailable Columns: {list(results[0].keys()) if results else []}"
        }
    ]

    response = client.chat.completions.create(
        model=os.getenv("AZURE_OPENAI_MODEL"),
        messages=messages,
        max_completion_tokens=1000
    )

    print("\n ---AI DIAGNOSTICS ---")
    print(f"Finish Reason: {response.choices[0].finish_reason}")
    print(f"Raw Message: {response.choices[0].message}")
    print("-------------------------\n")

    content = response.choices[0].message.content
    
    if not content:
        raise ValueError(f"Azure OpenAI returned an empty response. Finish reason: {response.choices[0].finish_reason}")
        
    content = content.strip()
        

    print("\n--- RAW EXCEL AGENT RESPONSE ---")
    print(content)
    print("--------------------------------\n")

    cleaned = clean_json_block(content)

    if not cleaned:
        cleaned = content

    try:
        excel_spec = json.loads(cleaned)
    except json.JSONDecodeError:
        raise ValueError(f"AI returned invalid JSON formatting. Raw output was: \n{content}")

    tokens_used = response.usage.total_tokens
    return excel_spec, tokens_used