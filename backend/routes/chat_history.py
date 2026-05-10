from fastapi import APIRouter
from db import get_connection
from ai_client import get_ai_client
import os

router = APIRouter()

def generate_title(first_message: str) -> str:
    try:
        client = get_ai_client()
        response = client.chat.completions.create(
            model=os.getenv("AZURE_OPENAI_MODEL"),
            messages=[
                {
                    "role": "user",
                    "content": f"Generate a very short title (max 5 words) for a technical support chatbot conversation that started with this message. The title must describe the specific topic, not be generic like 'Support Request'. Return ONLY the title. Message: {first_message}"
                },
            ],
            max_completion_tokens=500
        )
        title = response.choices[0].message.content.strip()
        print(f"DEBUG generate_title result: '{title}'")
        if not title or title.lower() == 'none':
            return first_message[:50]
        return title
    except Exception as e:
        print(f"Title generation error: {e}")
        return first_message[:50]

@router.get("/sessions/{user_id}")
def get_sessions(user_id: int):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT cm.group_id, MIN(cm.date_added) as started_at, COUNT(*) as message_count,
               MAX(cm.title) as title
        FROM chat_messages cm
        WHERE cm.user_id = ?
        GROUP BY cm.group_id
        ORDER BY started_at DESC
    """, user_id)
    rows = cursor.fetchall()
    return [
        {
            "group_id": str(row[0]),
            "started_at": str(row[1]),
            "message_count": row[2],
            "title": str(row[3])[:50] if row[3] else "Untitled Chat"
        }
        for row in rows
    ]

@router.get("/messages/{group_id}")
def get_messages(group_id: str):
    import json
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT sender, message, date_added, json_chart, json_export, export_file_path, attached_file_name
        FROM chat_messages
        WHERE group_id = ?
        ORDER BY date_added ASC
    """, group_id)
    rows = cursor.fetchall()
    conn.close()
    return [
        {
            "sender": row[0],
            "message": row[1],
            "date_added": str(row[2]),
            "chart_spec": json.loads(row[3]) if row[3] else None,
            "excel_spec": json.loads(row[4]) if row[4] else None,
            "export_file_path": row[5] if row[5] else None,
            "attached_file_name": row[6] if row[6] else None,
        }
        for row in rows
    ]