import os
import json
from ai_client import get_ai_client
from utils.json_utils import clean_json_block

VISUALIZER_PROMPT = """
You are a data visualization assistant for a ticketing system.

You receive:
- The user's question
- A list of query results (JSON rows)

Your job is to decide how to best visualize this data and return a chart specification.

SUPPORTED CHART TYPES: bar, line, pie

OUTPUT FORMAT (MANDATORY):
Return ONLY valid JSON inside a ```json code block, exactly like this:
```json
{
  "chart_type": "bar",
  "title": "...",
  "x_key": "column_name_for_x_axis",
  "y_key": "column_name_for_y_axis",
  "data": [...]
}
```

RULES:
- chart_type must be one of: bar, line, pie
- x_key and y_key must be exact column names present in the data
- For pie charts, use x_key for the label and y_key for the value
- data must be the same rows received as input, unchanged
- title must be a short, descriptive string in English
- Do NOT include explanations or any text outside the JSON block
- If the data cannot be visualized, return:
```json
{"error": "Data is not suitable for visualization"}
```
"""

def generate_chart_spec(question: str, results: list):
    client = get_ai_client()

    def serialize(obj):
        from datetime import datetime, date
        if isinstance(obj, (datetime, date)):
            return obj.isoformat()
        return obj

    serialized_results = [
        {k: serialize(v) for k, v in row.items()}
        for row in results
    ]

    messages = [
        {"role": "system", "content": VISUALIZER_PROMPT},
        {
            "role": "user",
            "content": f"User question: {question}\n\nQuery results: {json.dumps(serialized_results)}"
        }
    ]

    response = client.chat.completions.create(
        model=os.getenv("AZURE_OPENAI_MODEL"),
        messages=messages,
        max_completion_tokens=1000
    )

    content = response.choices[0].message.content.strip()
    cleaned = clean_json_block(content)

    try:
        chart_spec = json.loads(cleaned)
    except json.JSONDecodeError:
        raise ValueError(f"Invalid JSON returned by visualizer agent: {content}")

    tokens_used = response.usage.total_tokens
    return chart_spec, tokens_used