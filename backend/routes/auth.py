from fastapi import APIRouter, HTTPException, Response, Cookie
from pydantic import BaseModel
import bcrypt
import uuid
from datetime import datetime, timedelta, timezone
from db import get_connection

router = APIRouter()

SESSION_EXPIRE_HOURS = 24

class LoginRequest(BaseModel):
    username: str
    password: str

def parse_expires_at(expires_at):
    """Safely parse expires_at whether it's already a datetime or a string."""
    if isinstance(expires_at, datetime):
        return expires_at
    for fmt in ("%Y-%m-%d %H:%M:%S.%f", "%Y-%m-%d %H:%M:%S"):
        try:
            return datetime.strptime(str(expires_at), fmt).replace(tzinfo=timezone.utc)
        except ValueError:
            continue
    raise ValueError(f"Cannot parse expires_at: {expires_at!r}")

@router.post("/login")
def login(data: LoginRequest, response: Response):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT user_id, username, password FROM users WHERE username = ?",
        (data.username,)
    )
    row = cursor.fetchone()
    
    if not row:
        conn.close()
        raise HTTPException(status_code=401, detail="Invalid username or password")
    user_id, username, stored_hash = row

    if not bcrypt.checkpw(data.password.encode("utf-8"), stored_hash.encode("utf-8")):
        conn.close()
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    cursor.execute("DELETE FROM sessions WHERE user_id = ?", (user_id,))
    
    session_id = str(uuid.uuid4())
    expires_at = datetime.now(timezone.utc) + timedelta(hours=SESSION_EXPIRE_HOURS)

    cursor.execute(
        "INSERT INTO sessions (session_id, user_id, username, expires_at) VALUES (?, ?, ?, ?)",
        (session_id, user_id, username, expires_at)
    )
    conn.commit()
    conn.close()

    response.set_cookie(
        key="session_id",
        value=session_id,
        httponly=True,
        secure=False,        
        samesite="lax",
        max_age=SESSION_EXPIRE_HOURS * 60 * 60
    )

    return {"success": True, "user": {"username": username}}


@router.post("/logout")
def logout(response: Response, session_id: str = Cookie(None)):
    if session_id:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM sessions WHERE session_id = ?", (session_id,))
        conn.commit()
        conn.close()

    response.delete_cookie("session_id")
    return {"success": True, "message": "Logged out"}


@router.get("/me")
def get_me(session_id: str = Cookie(None)):
    if not session_id:
        raise HTTPException(status_code=401, detail="Not authenticated")

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT user_id, username, expires_at FROM sessions WHERE session_id = ?",
        (session_id,)
    )
    row = cursor.fetchone()
    conn.close()

    if not row:
        raise HTTPException(status_code=401, detail="Invalid session")

    user_id, username, expires_at = row

    # check if session is expired
    try:
        expires_dt = parse_expires_at(expires_at)
    except ValueError:
        raise HTTPException(status_code=401, detail="Malformed session expiry")

    if datetime.now(timezone.utc) > expires_dt:
        raise HTTPException(status_code=401, detail="Session expired")

    return {
        "success": True,
        "user": {
            "user_id": user_id,
            "username": username
        }
    }