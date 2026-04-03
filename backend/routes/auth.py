from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import bcrypt
from db import get_connection

router = APIRouter()

class LoginRequest(BaseModel):
    username: str
    password: str

@router.post("/login")
def login(data: LoginRequest):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT user_id, username, password FROM users WHERE username = ?",
        (data.username,)
    )
    row = cursor.fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    user_id, username, stored_hash = row
    if not bcrypt.checkpw(data.password.encode("utf-8"), stored_hash.encode("utf-8")):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    return {
        "success": True,
        "user": {
            "user_id": user_id,
            "username": username
        }
    }