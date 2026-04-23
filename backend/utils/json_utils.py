import re

def clean_json_block(text: str) -> str:
    match = re.search(r"```JSON(.*?)```", text, re.DOTALL | re.IGNORECASE)
    if match:
        return match.group(1).strip()
    return text.strip()