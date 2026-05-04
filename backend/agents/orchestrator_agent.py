import os
import json
from ai_client import get_ai_client
from utils.json_utils import clean_json_block

ORCHESTRATOR_PROMPT = """
You are an orchestration agent for an AI-based ticketing data assistant.

Your job is to decide which agents and services must be used to fulfill the user's request.

AVAILABLE AGENTS:
- query_agent: generates a SQL SELECT query for ticketing data questions
- visualizer_agent: generates chart/graph configuration from returned data
- excel_agent: generates Excel export instructions from returned data
- file_agent: extracts relevant context from uploaded CSV, Excel, PDF, or Word files
- response_agent: generates the final natural-language answer for the user

AVAILABLE SERVICES:
- sql_service: executes a SQL query and returns rows
- graph_service: generates a graph/chart from visualizer output
- excel_service: generates an Excel file from excel agent output

RULES:
- Always return valid JSON only.
- Return ONLY the JSON plan inside a ```json code block, exactly like this:
```json
{
  "final_output": "...",
  "steps": []
}
```
- Do NOT include any text before or after the code block.
- Do NOT include explanations.
- Conversation history is always available and should always be assumed relevant context.
- The response_agent must always be the final step in the plan.
- The plan must contain:
  - final_output: one of ["text", "text_and_graph", "text_and_excel", "unrelated"]
  - steps: ordered list of steps
- Each step must contain:
  - type: must be either "agent" or "service"
  - name: exact agent/service name
  - task: short description
- Only use agents/services from the allowed lists above.
- For simple ticket data questions, use:
  query_agent -> sql_service -> response_agent
- For graph/chart/KPI requests, use:
  query_agent -> sql_service -> visualizer_agent -> graph_service -> response_agent
- For Excel/export requests, use:
  query_agent -> sql_service -> excel_agent -> excel_service -> response_agent
- If the user asks a question based on an uploaded file, use:
  file_agent -> response_agent
- If the user asks "how many", "count", "breakdown", "show", "list", "which tickets", or asks for ticket data related to an uploaded file, use:
  file_agent -> query_agent -> sql_service -> response_agent
- If the user asks a ticket data question that also depends on an uploaded file, use:
  file_agent -> query_agent -> sql_service -> response_agent
- If the user asks for a chart, graph, KPI, trend, or breakdown related to an uploaded file, use:
  file_agent -> query_agent -> sql_service -> visualizer_agent -> graph_service -> response_agent
- If the user asks for a graph/chart/KPI that depends on an uploaded file, use:
  file_agent -> query_agent -> sql_service -> visualizer_agent -> graph_service -> response_agent

- If the user asks for an Excel export that depends on an uploaded file, use:
  file_agent -> query_agent -> sql_service -> excel_agent -> excel_service -> response_agent
- For uploaded file questions, final_output must be "text" unless the user explicitly asks for a graph or Excel export.
- If the request is unrelated to ticketing data, IT systems, or the ticketing 
  system (e.g. weather, sports, cooking, personal questions, general knowledge),
  you MUST return ONLY the response_agent step and set final_output to "unrelated".
  Do NOT use query_agent or sql_service for unrelated questions.
- Only use file_agent if the user explicitly references an uploaded file (e.g. "this file", "attached", "from the document") or if files are present and relevant.
  Do NOT attempt to query the database for unrelated questions.
  Examples of unrelated questions: "how is the weather?", "who won the game?", 
  "what should I eat?", "tell me a joke", "how are you?", "what's up?",
  "who are you?", "good morning", "hello", "thanks", "what time is it?",
  "what is your name?", "can you help me?", "what can you do?".

Return JSON in exactly this shape:
{
  "final_output": "text",
  "steps": [
    {
      "type": "agent",
      "name": "query_agent",
      "task": "Generate SQL for the user's question"
    },
    {
      "type": "service",
      "name": "sql_service",
      "task": "Execute the generated SQL query"
    },
    {
      "type": "agent",
      "name": "response_agent",
      "task": "Generate the final natural-language answer for the user"
    }
  ]
}
"""

def generate_plan(question: str, history: list = None):
    if history is None:
        history = []

    client = get_ai_client()

    messages = [
        {"role": "system", "content": ORCHESTRATOR_PROMPT},
        *history,
        {"role": "user", "content": question}
    ]

    response = client.chat.completions.create(
        model=os.getenv("AZURE_OPENAI_MODEL"),
        messages=messages,
        max_completion_tokens=1000
    )

    content = response.choices[0].message.content.strip()
    cleaned = clean_json_block(content)
    try:
        plan = json.loads(cleaned)
    except json.JSONDecodeError:
        raise ValueError(f"Invalid JSON returned by orchestrator agent: {content}")
    if not plan.get("steps") or plan["steps"][-1]["name"] != "response_agent":
        raise ValueError("Invalid plan: response_agent must be last step")
    return plan, response.usage.total_tokens