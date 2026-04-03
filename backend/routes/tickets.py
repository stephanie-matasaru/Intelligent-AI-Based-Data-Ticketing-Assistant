from fastapi import APIRouter, Query
from db import get_connection

router = APIRouter()

@router.get("/")
def get_tickets(
    page: int = Query(1, ge=1),
    page_size: int = Query(25, ge=1, le=100)
):
    offset = (page - 1) * page_size
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM tickets")
    total = cursor.fetchone()[0]
    cursor.execute(
        """
        SELECT * FROM tickets
        ORDER BY submit_datetime DESC, ticket_id DESC
        OFFSET ? ROWS FETCH NEXT ? ROWS ONLY
        """,
        (offset, page_size)
    )
    rows = cursor.fetchall()
    columns = [col[0] for col in cursor.description]
    items = [dict(zip(columns, row)) for row in rows]
    conn.close()
    return {
        "items": items,
        "page": page,
        "page_size": page_size,
        "total": total
    }