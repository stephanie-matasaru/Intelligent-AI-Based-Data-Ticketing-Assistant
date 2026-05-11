import os
from ai_client import get_ai_client
from utils.sql_utils import clean_sql
import json

INPUT_PROMPT = """
You are a SQL assistant for a ticketing system using Microsoft SQL Server.
You must generate a valid T-SQL SELECT query based on the user's question.

DATA SOURCE:
- Query ONLY from the tickets and priorities tables.
- tickets: ticket_id, ticket_number, status, priority_id, company, project,
  team, assigned_person, service, description, notes, resolution,
  cat_t1, cat_t2, cat_t3, submit_datetime, resolved_datetime, closed_datetime,
  last_modified, estimated_resolution, resolution_category, pending_duration
- priorities: priority_id, priority_name, max_minutes
  (JOIN tickets ON priority_id)

RULES:
- SLA breach = resolved_datetime > estimated_resolution
- Resolution time = DATEDIFF(minute, submit_datetime, resolved_datetime)
- Always use proper T-SQL syntax.
- Do NOT include unnecessary columns unless requested.
- For SLA breach queries, use:
  WHERE resolved_datetime > estimated_resolution
  OR (resolved_datetime IS NULL AND estimated_resolution < GETDATE())
If uploaded file context is provided and the user asks for related, similar, matching, or associated tickets, you MUST generate a SELECT query.
Do NOT return an empty response.
Do NOT return NOT_RELATED if the request involves uploaded file context and ticket data.
If exact ticket numbers are available, use them.
If semantic clues are available, search them using LIKE against description, notes, resolution, service, cat_t1, cat_t2, and cat_t3.

UPLOADED FILE CONTEXT RULES:
- If uploaded file extracted context is provided as JSON, use database_filters as the source of truth.
- For services, companies, projects, teams, statuses, priorities, categories, ticket numbers, and people extracted from the file, filter using those exact values.
- If multiple services are extracted and the user asks about tickets related to them, use OR logic:
  service LIKE '%Service A%' OR service LIKE '%Service B%'
- For multiple ticket numbers, use IN (...).
- For multiple statuses, priorities, teams, companies, or projects, use IN (...) when exact values are available.
- Do not ignore extracted file filters.
- Do not invent filters that are not present in the user question or uploaded file context.
- If only keywords are available, search them in description, notes, service, cat_t1, cat_t2, cat_t3 using LIKE.

OUTPUT FORMAT (MANDATORY):
- Return ONLY the SQL query inside a code block, exactly like this:
```sql
SELECT ...
```
- Do NOT return explanations, comments, or any extra text outside the SQL block.

FILTERING RULES:
- If a name contains multiple words (e.g., "John Smith"):
  Split into words and match EACH word using LIKE with AND.
  Example: (assigned_person LIKE '%John%' AND assigned_person LIKE '%Smith%')
- When a user asks to filter by a status, priority, or team (e.g., "open", "resolved", "high priority", "backend"), you MUST use exact literal string matches in your SQL (e.g., `WHERE status = 'Open'`). Never group, bundle, or assume related categories (e.g., do not bundle 'Pending' or 'In Progress' into 'Open') unless the user explicitly asks you to combine them.

TEMPORAL RULES:
- If the user says "recent" or "recently", default to the last 7 days:
  WHERE submit_datetime >= DATEADD(day, -7, GETDATE())
- If the user says "this month", use:
  WHERE MONTH(submit_datetime) = MONTH(GETDATE()) AND YEAR(submit_datetime) = YEAR(GETDATE())
- If the user says "today", use:
  WHERE CAST(submit_datetime AS DATE) = CAST(GETDATE() AS DATE)
- If the user says "this week", use:
  WHERE submit_datetime >= DATEADD(day, -7, GETDATE())
- If the user says "soon" or "upcoming", use estimated_resolution:
  WHERE estimated_resolution >= GETDATE()

IMPORTANT: If the user message contains "Uploaded file context (JSON):", you MUST generate a SELECT query using the filters provided. Never return NOT_RELATED in this case.
    
If the question is not related to ticketing data, respond with exactly:
NOT_RELATED
"""

def generate_sql(question: str, history: list):
    client = get_ai_client()

    messages = [
        {"role": "system", "content": INPUT_PROMPT},
        *history,
        {"role": "user", "content": question}
    ]

    response = client.chat.completions.create(
        model=os.getenv("AZURE_OPENAI_MODEL"),
        messages=messages,
        max_completion_tokens=5000
    )

    print("DEBUG finish_reason:", response.choices[0].finish_reason)
    print("DEBUG raw content repr:", repr(response.choices[0].message.content))

    raw_content = response.choices[0].message.content
    print("RAW QUERY AGENT OUTPUT:", raw_content)

    sql_query = clean_sql(raw_content)
    print("CLEANED SQL:", sql_query)
    tokens_used = response.usage.total_tokens

    return sql_query, tokens_used


def generate_dual_sql(question: str, history: list):
    """
    A dedicated function for the Chatbot that returns both an aggregate query 
    and a raw data query in JSON format.
    """
    client = get_ai_client()

    override_prompt = INPUT_PROMPT + """
    
    *** OVERRIDE OUTPUT FORMAT ***
    Ignore the previous output format rule. You must ALWAYS return a valid JSON object inside a ```json code block containing exactly two keys:
    1. "primary_query": The SQL query that perfectly answers the user's request.
    2. "raw_data_query": A 'SELECT TOP 100 tickets.*, priorities.priority_name FROM tickets LEFT JOIN priorities ON tickets.priority_id = priorities.priority_id' query using the EXACT same WHERE clauses from the primary query.
    """

    messages = [
        {"role": "system", "content": override_prompt},
        *history,
        {"role": "user", "content": question}
    ]

    response = client.chat.completions.create(
        model=os.getenv("AZURE_OPENAI_MODEL"),
        messages=messages,
        max_completion_tokens=5000
    )

    raw_content = response.choices[0].message.content
    
    if "NOT_RELATED" in raw_content:
        return "NOT_RELATED", "NOT_RELATED", response.usage.total_tokens

    try:
        cleaned_response = raw_content.replace("```json", "").replace("```", "").strip()
        sql_dict = json.loads(cleaned_response)
        
        primary_query = clean_sql(sql_dict.get("primary_query", ""))
        raw_data_query = clean_sql(sql_dict.get("raw_data_query", ""))
    except Exception as e:
        print(f"DEBUG JSON Parse Error: {e}")
        primary_query = clean_sql(raw_content)
        raw_data_query = primary_query

    tokens_used = response.usage.total_tokens
    return primary_query, raw_data_query, tokens_used