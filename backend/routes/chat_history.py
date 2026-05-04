from fastapi import APIRouter
from db import get_connection

router = APIRouter()

@router.get("/sessions/{user_id}")
def get_sessions(user_id: int):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT cm.group_id, MIN(cm.date_added) as started_at, COUNT(*) as message_count,
               MAX(CASE WHEN cm.sender = 'user' THEN cm.message END) as first_user_message
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
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT sender, message, date_added
        FROM chat_messages
        WHERE group_id = ?
        ORDER BY date_added ASC
    """, group_id)
    rows = cursor.fetchall()
    return [
        {
            "sender": row[0],
            "message": row[1],
            "date_added": str(row[2])
        }
        for row in rows
    ]