from fastapi import APIRouter, Query
from db import get_connection
from typing import Optional

router = APIRouter()

@router.get("/")
def get_tickets(
    page: int = Query(1, ge=1),
    page_size: int = Query(25, ge=1, le=100),
    status: Optional[str] = Query("all"),
    priority: Optional[str] = Query("all")
):
    offset = (page - 1) * page_size

    conditions = []
    params = []

    if status and status != "all":
        conditions.append("t.status =  ?")
        params.append(status)

    if priority and priority != "all":
        conditions.append("p.priority_name = ?")
        params.append(priority)

    #join the conditions together
    where_clause = "WHERE " + " AND ".join(conditions) if conditions else ""

    conn = get_connection()
    cursor = conn.cursor()

    #total count for react's footer
    count_query = f"""
        SELECT COUNT(*)
        FROM tickets t
        LEFT JOIN priorities p ON t.priority_id = p.priority_id
        {where_clause}
    """

    cursor.execute(count_query, params)
    total = cursor.fetchone()[0]

    #get the paginated data
    data_query = f"""
        SELECT t.* FROM tickets t
        LEFT JOIN priorities p ON t.priority_id = p.priority_id
        {where_clause}
        ORDER BY t.submit_datetime DESC, t.ticket_id DESC
        OFFSET ? ROWS FETCH NEXT ? ROWS ONLY
    """

    data_params = params.copy()
    data_params.extend([offset, page_size])
    
    cursor.execute(data_query, data_params)
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