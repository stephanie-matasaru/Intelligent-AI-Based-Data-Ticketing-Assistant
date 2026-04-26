import csv
import io
from typing import Any

def parse_uploaded_file(filename: str, file_bytes: bytes) -> dict:
    """
    Reads an uploaded .xlsx or .csv file and returns normalized structured data.
    The agent receives this output, never the raw file.

    Returns:
        {
            "columns": ["col1", "col2", ...],
            "rows": [{"col1": val, "col2": val, ...}, ...],
            "row_count": int,
            "warnings": ["..."]
        }
    """
    ext = filename.lower().split(".")[-1]

    if ext == "csv":
        return _parse_csv(file_bytes)
    elif ext in ("xlsx", "xls"):
        return _parse_excel(file_bytes)
    else:
        raise ValueError(f"Unsupported file type: .{ext}. Please upload a .xlsx or .csv file.")


def _parse_csv(file_bytes: bytes) -> dict:
    warnings = []

    try:
        text = file_bytes.decode("utf-8")
    except UnicodeDecodeError:
        text = file_bytes.decode("latin-1")
        warnings.append("File encoding detected as latin-1 instead of UTF-8.")

    reader = csv.DictReader(io.StringIO(text))
    columns = reader.fieldnames or []
    rows = []

    for i, row in enumerate(reader):
        normalized = _normalize_row(dict(row))
        rows.append(normalized)

    if not rows:
        warnings.append("The file appears to be empty or has no data rows.")

    return {
        "columns": list(columns),
        "rows": rows,
        "row_count": len(rows),
        "warnings": warnings
    }


def _parse_excel(file_bytes: bytes) -> dict:
    try:
        import openpyxl
    except ImportError:
        raise ImportError("openpyxl is required for Excel parsing. Run: pip install openpyxl")

    warnings = []

    workbook = openpyxl.load_workbook(io.BytesIO(file_bytes), data_only=True)
    sheet = workbook.active

    rows_raw = list(sheet.iter_rows(values_only=True))

    if not rows_raw:
        return {"columns": [], "rows": [], "row_count": 0, "warnings": ["The file is empty."]}

    headers = [str(cell).strip() if cell is not None else f"column_{i}" for i, cell in enumerate(rows_raw[0])]

    rows = []
    for row in rows_raw[1:]:
        if all(cell is None for cell in row):
            continue
        row_dict = {headers[i]: _coerce_value(cell) for i, cell in enumerate(row)}
        normalized = _normalize_row(row_dict)
        rows.append(normalized)

    if not rows:
        warnings.append("The file has headers but no data rows.")

    return {
        "columns": headers,
        "rows": rows,
        "row_count": len(rows),
        "warnings": warnings
    }


def _normalize_row(row: dict) -> dict:
    normalized = {}
    for key, value in row.items():
        normalized_key = str(key).strip()
        normalized[normalized_key] = _coerce_value(value)
    return normalized


def _coerce_value(value: Any) -> Any:
    if value is None:
        return None
    if isinstance(value, str):
        stripped = value.strip()
        return stripped if stripped else None
    if hasattr(value, "isoformat"):
        return value.isoformat()
    return value