from db import get_connection
from ai_client import get_ai_client
from dotenv import load_dotenv
import os

load_dotenv() 

client = get_ai_client()

conn = get_connection()
cursor = conn.cursor()

cursor.execute("""
    SELECT group_id, (
        SELECT TOP 1 message 
        FROM chat_messages cm2 
        WHERE cm2.group_id = cm.group_id 
          AND cm2.sender = 'user'
        ORDER BY cm2.date_added ASC
    ) as first_message
    FROM chat_messages cm
    WHERE cm.title IS NULL OR cm.title = ''
    GROUP BY cm.group_id
""")

sessions = cursor.fetchall()
print(f"Found {len(sessions)} sessions to backfill...")

for group_id, first_message in sessions:
    if not first_message:
        continue

    response = client.chat.completions.create(
        model=os.getenv("AZURE_OPENAI_MODEL"),
        messages=[
            {"role": "user", "content": f"Generate a very short title (max 5 words) for a chat that started with this message. Return ONLY the title, nothing else. Message: {first_message}"}
        ],
        max_completion_tokens=500
    )
    title = response.choices[0].message.content.strip()
    print(f"  '{first_message[:40]}' → '{title}'")

    cursor.execute("UPDATE chat_messages SET title = ? WHERE group_id = ?", (title, str(group_id)))
    conn.commit()

conn.close()
print("Done")