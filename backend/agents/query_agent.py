import os
from ai_client import get_ai_client
from utils.sql_utils import clean_sql
import json
import re

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
If exact ticket numbers are available in the uploaded file context, use ONLY them with IN (...).
Do NOT add any LIKE keyword searches on top of ticket number filters.
Semantic LIKE searches are a fallback ONLY when no ticket numbers are present.

UPLOADED FILE CONTEXT RULES:
- If uploaded file extracted context is provided as JSON, use database_filters as the source of truth.
- For services, companies, projects, teams, statuses, priorities, categories, ticket numbers, and people extracted from the file, filter using those exact values.
- If multiple services are extracted and the user asks about tickets related to them, use OR logic:
  service LIKE '%Service A%' OR service LIKE '%Service B%'
- For multiple ticket numbers, use IN (...).
- For multiple statuses, priorities, teams, companies, or projects, use IN (...) when exact values are available.
- Use extracted file filters only when they are relevant to what the user is asking. 
  If the user's question is specific (e.g., find by ticket number), do not add unrelated filters from the file.
- Do not invent filters that are not present in the user question or uploaded file context.
- If only keywords are available, search them in description, notes, service, cat_t1, cat_t2, cat_t3 using LIKE.
- IMPORTANT: Only apply filters that are relevant to the user's specific question.
  If the user asks for tickets by ticket number, use ONLY the ticket numbers — do not add 
  extra filters for company, date, status, or team unless the user explicitly asked for them.
  The file context is a reference, not a mandatory filter set to apply in full.

FILTERING RULES:
- If a name contains multiple words (e.g., "John Smith"):
  Split into words and match EACH word using LIKE with AND.
  Example: (assigned_person LIKE '%John%' AND assigned_person LIKE '%Smith%')
- When a user asks to filter by a status, priority, or team (e.g., "open", "resolved", "high priority", "backend"), you MUST use exact literal string matches in your SQL (e.g., `WHERE status = 'Open'`). Never group, bundle, or assume related categories (e.g., do not bundle 'Pending' or 'In Progress' into 'Open') unless the user explicitly asks you to combine them.
- IMPORTANT FOR SERVICES: Users often append the word "service" to their prompt (e.g., "the API Service" or "Gateway service"). The database usually only stores the core name (e.g., "API" or "Gateway"). Always use LIKE for services and omit the word "service" (e.g., `WHERE service LIKE '%API%'`).

CONVERSATIONAL CONTEXT RULES:
- You are part of an ongoing conversation. You will receive chat history.
- If the user makes a follow-up request (e.g., "export them", "download an excel", "show me the details", "group them"), you MUST use the EXACT same WHERE clauses from the previous interaction. 
- Do NOT generate an unfiltered `SELECT *` query unless the user explicitly asks for "all tickets in the database".

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

OUTPUT FORMAT (MANDATORY):
- Return ONLY the SQL query inside a code block, exactly like this:
```sql
SELECT ...
```
- Do NOT return explanations, comments, or any extra text outside the SQL block.
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

    base_prompt_without_sql_rule = INPUT_PROMPT.split("OUTPUT FORMAT (MANDATORY):")[0]

    override_prompt = base_prompt_without_sql_rule + """
    CRITICAL RULE FOR raw_data_query:
    raw_data_query MUST ALWAYS return individual ticket rows. NEVER use COUNT, SUM, or any aggregate in raw_data_query.
    Even if the user asks "how many", raw_data_query must still return the actual rows.
    raw_data_query must ALWAYS follow this exact structure:
    SELECT TOP 100 tickets.ticket_number, tickets.status, tickets.company, tickets.team, tickets.service, tickets.assigned_person, tickets.submit_datetime, tickets.resolved_datetime, tickets.description, priorities.priority_name
    FROM tickets LEFT JOIN priorities ON tickets.priority_id = priorities.priority_id
    WHERE [exact same WHERE clause as primary_query]

    OUTPUT FORMAT (MANDATORY):
    You MUST output ONLY a valid JSON object. Do not include any conversational text or ```sql blocks.
    
    Format:
    {
      "primary_query": "The SQL query that perfectly answers the user's request (e.g., COUNT, SUM, etc).",
      "raw_data_query": "SELECT TOP 100 tickets.ticket_number, tickets.status ... WHERE [same WHERE clause]"
    }
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
        match = re.search(r'\{.*\}', raw_content, re.DOTALL)
        if match:
            json_str = match.group(0)
        else:
            json_str = raw_content.replace("```json", "").replace("```", "").strip()
        sql_dict = json.loads(json_str)
        
        primary_query = clean_sql(sql_dict.get("primary_query", ""))
        raw_data_query = clean_sql(sql_dict.get("raw_data_query", ""))
    except Exception as e:
        print(f"DEBUG JSON Parse Error: {e}")
        primary_query = clean_sql(raw_content)
        raw_data_query = primary_query

    tokens_used = response.usage.total_tokens
    return primary_query, raw_data_query, tokens_used