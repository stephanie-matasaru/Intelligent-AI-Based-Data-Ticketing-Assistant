import json

from db import get_connection
from routes.chat_history import generate_title
import uuid

def save_message(user_id, sender, message, query=None, tokens=None, status="pending", group_id=None, export_file_path=None, chart_spec=None, excel_spec=None):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        title = None
        if sender == "user":
            cursor.execute("SELECT COUNT(*) FROM chat_messages WHERE group_id = ?", (str(group_id),))
            count = cursor.fetchone()[0]
            if count == 0:
                title = generate_title(message)
        cursor.execute("""
            INSERT INTO chat_messages 
                (group_id, user_id, sender, message, query, request_tokens, response_status, title, export_file_path, json_chart, json_export)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            str(group_id) if group_id else str(uuid.uuid4()),
            user_id,
            sender,
            message,
            query,
            tokens,
            status,
            title,
            export_file_path,
            json.dumps(chart_spec) if chart_spec else None,
            json.dumps(excel_spec) if excel_spec else None,
        ))
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"Warning: could not save message to DB: {e}")


def get_chat_history_by_user(user_id: int):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT group_id, sender, message, query, response_status, date_added, export_file_path
        FROM chat_messages
        WHERE user_id = ? AND delete_flag = 0
        ORDER BY date_added ASC
    """, (user_id,))
    rows = cursor.fetchall()
    columns = [col[0] for col in cursor.description]
    history = [dict(zip(columns, row)) for row in rows]
    conn.close()
    return history