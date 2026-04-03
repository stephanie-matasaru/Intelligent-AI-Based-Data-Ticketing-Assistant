# This script connects to the database and inserts two users into it
# this is used because passwords should be stored in a hashed format, so manual insertion isn't the best way to go about it
import bcrypt
from backend.db import get_connection

users = [
    ("admin", "admin123"),
    ("test", "test123"),
]

conn = get_connection()
cursor = conn.cursor()
for username, plain_password in users:
    hashed = bcrypt.hashpw(plain_password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
    cursor.execute(
        "INSERT INTO users (username, password) VALUES (?, ?)",
        (username, hashed)
    )
conn.commit()
conn.close()