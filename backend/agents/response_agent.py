import os
from ai_client import get_ai_client

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
- Do NOT suggest graphical representation or file export to the user.
"""

def generate_explanation(question: str, history: list, results: list):
    client = get_ai_client()

    explain_response = client.chat.completions.create(
        model=os.getenv("AZURE_OPENAI_MODEL"),
        messages=[
            {"role": "system", "content": OUTPUT_PROMPT},
            *history,
            {"role": "user", "content": f"User question: {question}\n\nData: {results}"}
        ],
        max_completion_tokens=1000
    )

    explanation = explain_response.choices[0].message.content.strip()
    tokens_used = explain_response.usage.total_tokens

    return explanation, tokens_used