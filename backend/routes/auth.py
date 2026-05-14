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

class RegisterRequest(BaseModel):
    username: str
    password: str

class ChangeUsernameRequest(BaseModel):
    new_username: str

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str

def parse_expires_at(expires_at):
    """Safely parse expires_at whether it's already a datetime or a string."""
    if isinstance(expires_at, datetime):
        if expires_at.tzinfo is None:
            return expires_at.replace(tzinfo=timezone.utc)
        return expires_at
    for fmt in ("%Y-%m-%d %H:%M:%S.%f", "%Y-%m-%d %H:%M:%S"):
        try:
            return datetime.strptime(str(expires_at), fmt).replace(tzinfo=timezone.utc)
        except ValueError:
            continue
    raise ValueError(f"Cannot parse expires_at: {expires_at!r}")

def get_current_user(session_id: str):
    if not session_id:
        raise HTTPException(status_code=401, detail="Not authenticated")

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT user_id, username, expires_at FROM sessions WHERE session_id = ?",
        (session_id,)
    )
    row = cursor.fetchone()

    if not row:
        conn.close()
        raise HTTPException(status_code=401, detail="Invalid session")

    user_id, username, expires_at = row

    try:
        expires_dt = parse_expires_at(expires_at)
    except ValueError:
        conn.close()
        raise HTTPException(status_code=401, detail="Malformed session expiry")

    if datetime.now(timezone.utc) > expires_dt:
        cursor.execute("DELETE FROM sessions WHERE session_id = ?", (session_id,))
        conn.commit()
        conn.close()
        raise HTTPException(status_code=401, detail="Session expired")

    conn.close()
    return user_id, username


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

    return {"success": True, "user": {"user_id": user_id, "username": username}}


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

@router.post("/register")
def register(data: RegisterRequest):
    username = data.username.strip()

    if len(username) < 3:
        raise HTTPException(status_code=400, detail="Username must be at least 3 characters")

    if len(data.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT user_id FROM users WHERE username = ?", (username,))
    existing_user = cursor.fetchone()

    if existing_user:
        conn.close()
        raise HTTPException(status_code=409, detail="Username already exists")

    hashed = bcrypt.hashpw(
        data.password.encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")

    cursor.execute(
        "INSERT INTO users (username, password) VALUES (?, ?)",
        (username, hashed)
    )

    conn.commit()
    conn.close()

    return {"success": True, "message": "User registered successfully"}

@router.put("/change-username")
def change_username(data: ChangeUsernameRequest, session_id: str = Cookie(None)):
    user_id, old_username = get_current_user(session_id)

    new_username = data.new_username.strip()

    if len(new_username) < 3:
        raise HTTPException(status_code=400, detail="Username must be at least 3 characters")

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT user_id FROM users WHERE username = ?", (new_username,))
    existing_user = cursor.fetchone()

    if existing_user:
        conn.close()
        raise HTTPException(status_code=409, detail="Username already exists")

    cursor.execute(
        "UPDATE users SET username = ? WHERE user_id = ?",
        (new_username, user_id)
    )

    cursor.execute(
        "UPDATE sessions SET username = ? WHERE user_id = ?",
        (new_username, user_id)
    )

    conn.commit()
    conn.close()

    return {
        "success": True,
        "message": "Username changed successfully",
        "user": {
            "user_id": user_id,
            "username": new_username
        }
    }

@router.put("/change-password")
def change_password(data: ChangePasswordRequest, session_id: str = Cookie(None)):
    user_id, username = get_current_user(session_id)

    if len(data.new_password) < 6:
        raise HTTPException(status_code=400, detail="New password must be at least 6 characters")

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT password FROM users WHERE user_id = ?",
        (user_id,)
    )
    row = cursor.fetchone()

    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="User not found")

    stored_hash = row[0]

    if not bcrypt.checkpw(data.current_password.encode("utf-8"), stored_hash.encode("utf-8")):
        conn.close()
        raise HTTPException(status_code=401, detail="Current password is incorrect")

    new_hash = bcrypt.hashpw(
        data.new_password.encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")

    cursor.execute(
        "UPDATE users SET password = ? WHERE user_id = ?",
        (new_hash, user_id)
    )

    conn.commit()
    conn.close()

    return {"success": True, "message": "Password changed successfully"}
