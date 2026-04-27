import pandas as pd
import os
import uuid
from openpyxl.utils import get_column_letter

def process_excel_spec(excel_spec: dict) -> dict:
    if "error" in excel_spec:
        return excel_spec

    missing = [
        field for field in ("filename", "sheet_name", "columns_to_include", "data")
        if field not in excel_spec
    ]
    if missing:
        raise ValueError(f"Excel spec missing fields: {missing}")

    if not isinstance(excel_spec["data"], list) or len(excel_spec["data"]) == 0:
        raise ValueError("Excel spec data must be a non-empty list")

    first_row = excel_spec["data"][0]
    for col in excel_spec["columns_to_include"]:
        if col not in first_row:
            raise ValueError(
                f"Column '{col}' not found in data columns: {list(first_row.keys())}"
            )

    df = pd.DataFrame(excel_spec["data"])
    df = df[excel_spec["columns_to_include"]]

    safe_filename = f"{uuid.uuid4().hex[:8]}_{excel_spec['filename']}"
    
    export_dir = os.path.join(os.getcwd(), "static", "exports")
    os.makedirs(export_dir, exist_ok=True)

    file_path = os.path.join(export_dir, safe_filename)

    sheet_name = excel_spec["sheet_name"]

    with pd.ExcelWriter(file_path, engine='openpyxl') as writer:
        df.to_excel(writer, sheet_name=sheet_name, index=False)
    
        worksheet = writer.sheets[sheet_name]
    
        for idx, col in enumerate(df.columns):
            max_len = max(df[col].astype(str).map(len).max(), len(str(col))) + 2
        
            col_letter = get_column_letter(idx + 1)
        
            worksheet.column_dimensions[col_letter].width = max_len

    excel_spec["download_url"] = f"/static/exports/{safe_filename}"
    
    del excel_spec["data"]

    return excel_spec