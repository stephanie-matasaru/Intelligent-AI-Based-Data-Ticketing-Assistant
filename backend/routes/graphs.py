from fastapi import APIRouter, Query
from db import get_connection
from typing import Optional

router = APIRouter()

def build_filters(start_date, end_date, priority, status, team):
    conditions = []
    params = []

    if start_date:
        conditions.append("t.submit_datetime >= ?")
        params.append(start_date)
    if end_date:
        conditions.append("t.submit_datetime <= ?")
        params.append(end_date)
    if priority and priority != "all":
        conditions.append("p.priority_name = ?")
        params.append(priority)
    if status and status != "all":
        conditions.append("t.status = ?")
        params.append(status)
    if team and team != "all":
        conditions.append("t.team = ?")
        params.append(team)

    where_clause = "WHERE " + " AND ".join(conditions) if conditions else ""
    return where_clause, params

# Frontend: BarChart "Tickets by Priority" (Critical, High, Medium, Low)
# Returns: [{"name": "Critical", "count": 72}, ...]
@router.get("/by-priority")
def tickets_by_priority(
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    team: Optional[str] = Query(None)
):
    where_clause, params = build_filters(start_date, end_date, priority, status, team)
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(f"""
        SELECT p.priority_name as name, COUNT(*) as count
        FROM tickets t
        JOIN priorities p ON t.priority_id = p.priority_id
        {where_clause}
        GROUP BY p.priority_name
    """, params)
    rows = cursor.fetchall()
    conn.close()
    return [{"name": row[0], "count": row[1]} for row in rows]

# Frontend: BarChart "Tickets by Status" (Open, In Progress, Pending, Resolved, Closed)
# Returns: [{"name": "Open", "count": 45}, ...]
@router.get("/by-status")
def tickets_by_status(
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    team: Optional[str] = Query(None)
):
    where_clause, params = build_filters(start_date, end_date, priority, status, team)
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(f"""
        SELECT t.status as name, COUNT(*) as count
        FROM tickets t
        JOIN priorities p ON t.priority_id = p.priority_id
        {where_clause}
        GROUP BY t.status
    """, params)
    rows = cursor.fetchall()
    conn.close()
    return [{"name": row[0], "count": row[1]} for row in rows]

# Frontend: PieChart (Donut) "SLA Compliance" (SLA Met vs SLA Breached)
# Returns: {"sla_met": 590, "sla_breached": 48}
@router.get("/sla")
def sla_compliance(
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    team: Optional[str] = Query(None)
):
    where_clause, params = build_filters(start_date, end_date, priority, status, team)
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(f"""
        SELECT 
            SUM(CASE WHEN t.resolved_datetime <= t.estimated_resolution THEN 1 ELSE 0 END) as sla_met,
            SUM(CASE WHEN t.resolved_datetime > t.estimated_resolution THEN 1 ELSE 0 END) as sla_breached
        FROM tickets t
        JOIN priorities p ON t.priority_id = p.priority_id
        {where_clause}
    """, params)
    row = cursor.fetchone()
    conn.close()
    return {
        "sla_met": row[0] or 0,
        "sla_breached": row[1] or 0
    }

# Frontend: LineChart "Tickets Created Over Time" (daily timeline)
# Returns: [{"day": "2024-03-01", "count": 16}, ...]
@router.get("/timeline")
def tickets_timeline(
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    team: Optional[str] = Query(None)
):
    where_clause, params = build_filters(start_date, end_date, priority, status, team)
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(f"""
        SELECT CAST(t.submit_datetime as DATE) as day, COUNT(*) as count
        FROM tickets t
        JOIN priorities p ON t.priority_id = p.priority_id
        {where_clause}
        GROUP BY CAST(t.submit_datetime as DATE)
        ORDER BY day
    """, params)
    rows = cursor.fetchall()
    conn.close()
    return [{"day": str(row[0]), "count": row[1]} for row in rows]