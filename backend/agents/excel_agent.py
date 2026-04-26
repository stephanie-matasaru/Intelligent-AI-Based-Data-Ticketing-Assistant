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
"""
def generate_excel_spec(question: str, results: list):
    client = get_ai_client()

    messages = [
        {"role": "system", "content": EXCEL_PROMPT},
        {
            "role": "user",
            "content": f"User request: {question}\n\nQuery results (first 2 rows for schema): {json.dumps(results[:2], default=str)}"
        }
    ]

    response = client.chat.completions.create(
        model=os.getenv("AZURE_OPENAI_MODEL"),
        messages=messages,
        max_completion_tokens=500
    )

    content = response.choices[0].message.content.strip()
    cleaned = clean_json_block(content)

    try:
        excel_spec = json.loads(cleaned)
    except json.JSONDecodeError:
        raise ValueError(f"Invalid JSON returned by excel agent: {content}")

    tokens_used = response.usage.total_tokens
    return excel_spec, tokens_used