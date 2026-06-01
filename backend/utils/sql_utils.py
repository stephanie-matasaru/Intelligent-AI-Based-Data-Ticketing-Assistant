import re

FORBIDDEN = r"(delete|insert|update|drop|alter|truncate)"
ALLOWED = r"^(select|declare|with)"

def clean_sql(sql: str) -> str:
    sql = re.sub(r"```sql|```", "", sql)
    if sql.endswith(";"):
        sql = sql[:-1]
    return sql.strip()

def is_safe_sql(sql: str) -> bool:
    return (
        bool(re.match(ALLOWED, sql.strip(), re.IGNORECASE)) and
        not re.search(FORBIDDEN, sql, re.IGNORECASE)
    )
