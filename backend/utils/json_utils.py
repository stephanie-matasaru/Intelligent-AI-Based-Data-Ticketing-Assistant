import re

def clean_json_block(text: str) -> str:
    match = re.search(r"```(?:json)?(.*?)```", text, re.DOTALL | re.IGNORECASE)
    if match:
        return match.group(1).strip()
    
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if match:
        return match.group(0).strip()
    
    return ""