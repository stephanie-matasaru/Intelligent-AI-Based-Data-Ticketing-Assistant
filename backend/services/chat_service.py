from db import get_connection
import uuid

def save_message(user_id, sender, message, query=None, tokens=None, status="pending", group_id=None):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO chat_messages 
                (group_id, user_id, sender, message, query, request_tokens, response_status)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            str(group_id) if group_id else str(uuid.uuid4()),
            user_id,
            sender,
            message,
            query,
            tokens,
            status
        ))
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"Warning: could not save message to DB: {e}")


def get_chat_history_by_user(user_id: int):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT group_id, sender, message, query, response_status, date_added
        FROM chat_messages
        WHERE user_id = ? AND delete_flag = 0
        ORDER BY date_added ASC
    """, (user_id,))
    rows = cursor.fetchall()
    columns = [col[0] for col in cursor.description]
    history = [dict(zip(columns, row)) for row in rows]
    conn.close()
    return history