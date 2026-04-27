import pandas as pd
import os
import uuid

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
    with pd.ExcelWriter(file_path, engine='openpyxl') as writer:
        df.to_excel(writer, index=False, sheet_name=excel_spec['sheet_name'])

    excel_spec["download_url"] = f"/static/exports/{safe_filename}"
    
    del excel_spec["data"]

    return excel_spec