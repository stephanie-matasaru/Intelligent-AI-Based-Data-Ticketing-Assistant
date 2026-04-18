from fastapi import APIRouter, Query
from db import get_connection
from typing import Optional, Literal
from datetime import datetime

router = APIRouter()

# Frontend: BarChart "Tickets by Priority" (Critical, High, Medium, Low)
# Returns: [{"name": "Critical", "count": 72}, ...]
@router.get("/by-priority")
def tickets_by_priority(
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    priority: Optional[Literal["Critical", "High", "Medium", "Low"]] = Query(None),
    status: Optional[Literal["Open", "In Progress", "Pending", "Resolved", "Closed"]] = Query(None),
    team: Optional[str] = Query(None)
):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("EXEC dbo.GetTicketsByPriority @StartDate=?, @EndDate=?, @Priority=?, @Status=?, @Team=?",
        (start_date, end_date, priority, status, team)
        )
    rows = cursor.fetchall()
    conn.close()
    return [{"name": row[0], "count": row[1]} for row in rows]

# Frontend: BarChart "Tickets by Status" (Open, In Progress, Pending, Resolved, Closed)
# Returns: [{"name": "Open", "count": 45}, ...]
@router.get("/by-status")
def tickets_by_status(
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    priority: Optional[Literal["Critical", "High", "Medium", "Low"]] = Query(None),
    status: Optional[Literal["Open", "In Progress", "Pending", "Resolved", "Closed"]] = Query(None),
    team: Optional[str] = Query(None)
):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("EXEC dbo.GetTicketsByStatus @StartDate=?, @EndDate=?, @Priority=?, @Status=?, @Team=?",
        (start_date, end_date, priority, status, team)
    )
    rows = cursor.fetchall()
    conn.close()
    return [{"name": row[0], "count": row[1]} for row in rows]

# Frontend: PieChart (Donut) "SLA Compliance" (SLA Met vs SLA Breached)
# Returns: {"sla_met": 590, "sla_breached": 48}
@router.get("/sla")
def sla_compliance(
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    priority: Optional[Literal["Critical", "High", "Medium", "Low"]] = Query(None),
    status: Optional[Literal["Open", "In Progress", "Pending", "Resolved", "Closed"]] = Query(None),
    team: Optional[str] = Query(None)
):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("EXEC dbo.GetSLACompliance @StartDate=?, @EndDate=?, @Priority=?, @Status=?, @Team=?",
        (start_date, end_date, priority, status, team)
    )
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
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    priority: Optional[Literal["Critical", "High", "Medium", "Low"]] = Query(None),
    status: Optional[Literal["Open", "In Progress", "Pending", "Resolved", "Closed"]] = Query(None),
    team: Optional[str] = Query(None)
):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("EXEC dbo.GetTicketsOverTime @StartDate=?, @EndDate=?, @Priority=?, @Status=?, @Team=?",
        (start_date, end_date, priority, status, team)
        )
    rows = cursor.fetchall()
    conn.close()
    return [{"day": str(row[0]), "count": row[1]} for row in rows]