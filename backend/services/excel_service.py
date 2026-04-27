import pandas as pd
import io
import base64
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

    sheet_name = excel_spec["sheet_name"]

    buffer = io.BytesIO()

    with pd.ExcelWriter(buffer, engine='openpyxl') as writer:
        df.to_excel(writer, sheet_name=sheet_name, index=False)
        
        worksheet = writer.sheets[sheet_name]
        
        for idx, col in enumerate(df.columns):
            max_len = max(df[col].astype(str).map(len).max(), len(str(col))) + 2
            col_letter = get_column_letter(idx + 1)
            worksheet.column_dimensions[col_letter].width = max_len

    excel_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')

    excel_spec["file_data_base64"] = excel_base64
    
    del excel_spec["data"]

    return excel_spec