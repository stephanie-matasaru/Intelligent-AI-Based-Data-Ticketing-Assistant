from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from db import get_connection
import json

router = APIRouter()

class WorkspaceItem(BaseModel):
    user_id: int
    type: str
    label: str
    chart_spec: Optional[dict] = None
    excel_spec: Optional[dict] = None

@router.get("/{user_id}")
def get_workspace_items(user_id: int):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, type, label, chart_spec, excel_spec, saved_at
            FROM workspace_items
            WHERE user_id = ?
            ORDER BY saved_at DESC
        """, (user_id,))
        rows = cursor.fetchall()
        conn.close()
        return [
            {
                "id": row[0],
                "type": row[1],
                "label": row[2],
                "chart_spec": json.loads(row[3]) if row[3] else None,
                "excel_spec": json.loads(row[4]) if row[4] else None,
                "savedAt": str(row[5])
            }
            for row in rows
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/")
def save_workspace_item(item: WorkspaceItem):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO workspace_items (user_id, type, label, chart_spec, excel_spec)
            VALUES (?, ?, ?, ?, ?)
        """, (
            item.user_id,
            item.type,
            item.label,
            json.dumps(item.chart_spec) if item.chart_spec else None,
            json.dumps(item.excel_spec) if item.excel_spec else None,
        ))
        conn.commit()
        cursor.execute("SELECT @@IDENTITY")
        new_id = cursor.fetchone()[0]
        conn.close()
        return {"id": int(new_id), "status": "saved"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{item_id}")
def delete_workspace_item(item_id: int):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM workspace_items WHERE id = ?", (item_id,))
        conn.commit()
        conn.close()
        return {"status": "deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))