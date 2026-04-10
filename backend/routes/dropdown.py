from fastapi import APIRouter
from db import get_connection

router = APIRouter()


@router.get("/projects")
def get_projects():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT DISTINCT project
        FROM tickets
        WHERE project IS NOT NULL
        ORDER BY project
        """
    )
    rows = cursor.fetchall()
    conn.close()
    return {"items": [row[0] for row in rows]}


@router.get("/services")
def get_services():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT DISTINCT service
        FROM tickets
        WHERE service IS NOT NULL
        ORDER BY service
        """
    )
    rows = cursor.fetchall()
    conn.close()
    return {"items": [row[0] for row in rows]}


@router.get("/assignees")
def get_assignees():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT DISTINCT assigned_person
        FROM tickets
        WHERE assigned_person IS NOT NULL
        ORDER BY assigned_person
        """
    )
    rows = cursor.fetchall()
    conn.close()
    return {"items": [row[0] for row in rows]}