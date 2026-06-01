import os
from dotenv import load_dotenv
from mssql_python import connect

load_dotenv()

def get_connection():
    return connect(
        f"Server={os.getenv('DB_SERVER')};"
        f"Database={os.getenv('DB_NAME')};"
        "Trusted_Connection=yes;"
        "Encrypt=yes;"
        "TrustServerCertificate=yes;"
    )