from db import get_connection

def execute_query(sql_query: str):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(sql_query)
    rows = cursor.fetchall()
    columns = [col[0] for col in cursor.description]
    results = [dict(zip(columns, row)) for row in rows]
    conn.close()
    return results