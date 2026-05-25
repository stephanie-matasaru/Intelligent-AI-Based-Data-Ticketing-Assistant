from fastapi import APIRouter, Query
from db import get_connection
from typing import Optional, Literal
from enum import Enum

router = APIRouter()


class StatusEnum(str, Enum):
    all = "all"
    open = "Open"
    in_progress = "In Progress"
    pending = "Pending"
    resolved = "Resolved"
    closed = "Closed"


class PriorityEnum(str, Enum):
    all = "all"
    critical = "Critical"
    high = "High"
    medium = "Medium"
    low = "Low"


@router.get("/")
def get_tickets(
    page: int = Query(1, ge=1),
    page_size: int = Query(25, ge=1, le=5000),
    search: Optional[str] = Query(None),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    status: StatusEnum = Query(StatusEnum.all),
    priority: PriorityEnum = Query(PriorityEnum.all),
    project: Optional[str] = Query(None),
    service: Optional[str] = Query(None),
    assignee: Optional[str] = Query(None),
    team: Optional[str] = Query(None),
    cat_t1: Optional[str] = Query(None),
    sla_status: Optional[Literal["met", "breached"]] = Query(None)
):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        EXEC dbo.GetTicketsFiltered
            @Page = ?,
            @PageSize = ?,
            @Search = ?,
            @StartDate = ?,
            @EndDate = ?,
            @Status = ?,
            @Priority = ?,
            @Project = ?,
            @Service = ?,
            @Assignee = ?,
            @Team = ?,
            @CatT1 = ?,
            @SlaStatus = ?
        """,
        (
            page,
            page_size,
            search,
            start_date,
            end_date,
            status.value,
            priority.value,
            project,
            service,
            assignee,
            team,
            cat_t1,
            sla_status
        )
    )

    rows = cursor.fetchall()
    columns = [col[0] for col in cursor.description]
    items = [dict(zip(columns, row)) for row in rows]

    total = items[0]["total_count"] if items else 0

    # Remove total_count from each item before returning
    for item in items:
        item.pop("total_count", None)

    conn.close()

    return {
        "items": items,
        "page": page,
        "page_size": page_size,
        "total": total
    }