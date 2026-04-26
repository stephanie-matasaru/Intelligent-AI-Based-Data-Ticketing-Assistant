import pandas as pd
import os
import uuid

def process_excel_spec(excel_spec: dict) -> dict:
    # --- STEP 1: THE GATEKEEPER (Validation) ---
    if "error" in excel_spec:
        return excel_spec

    # Check if the AI Agent forgot to include any required fields
    missing = [
        field for field in ("filename", "sheet_name", "columns_to_include", "data")
        if field not in excel_spec
    ]
    if missing:
        raise ValueError(f"Excel spec missing fields: {missing}")

    # Check if the SQL service actually found any data
    if not isinstance(excel_spec["data"], list) or len(excel_spec["data"]) == 0:
        raise ValueError("Excel spec data must be a non-empty list")

    # Double-check the AI's homework: Do the columns it wants to export actually exist in the data?
    first_row = excel_spec["data"][0]
    for col in excel_spec["columns_to_include"]:
        if col not in first_row:
            raise ValueError(
                f"Column '{col}' not found in data columns: {list(first_row.keys())}"
            )

    # --- STEP 2: THE MUSCLE (File Generation) ---
    # Load the validated data into pandas and filter it to only the requested columns
    df = pd.DataFrame(excel_spec["data"])
    df = df[excel_spec["columns_to_include"]]

    # Create a unique filename so multiple users don't overwrite each other's exports
    safe_filename = f"{uuid.uuid4().hex[:8]}_{excel_spec['filename']}"
    
    # Ensure the static/exports directory exists
    export_dir = os.path.join(os.getcwd(), "static", "exports")
    os.makedirs(export_dir, exist_ok=True)

    # Save the physical .xlsx file to the server
    file_path = os.path.join(export_dir, safe_filename)
    with pd.ExcelWriter(file_path, engine='openpyxl') as writer:
        df.to_excel(writer, index=False, sheet_name=excel_spec['sheet_name'])

    # --- STEP 3: THE HANDOFF ---
    # Add the download URL to the spec so the response_agent knows where the file is
    excel_spec["download_url"] = f"/static/exports/{safe_filename}"
    
    # Remove the massive block of raw data from the dictionary so we don't 
    # waste memory passing thousands of rows back to the orchestrator
    del excel_spec["data"]

    return excel_spec