SUPPORTED_CHART_TYPES = {"bar", "line", "pie"}

def process_chart_spec(chart_spec: dict) -> dict:
    if "error" in chart_spec:
        return chart_spec

    missing = [
        field for field in ("chart_type", "title", "x_key", "y_key", "data")
        if field not in chart_spec
    ]
    if missing:
        raise ValueError(f"Chart spec missing fields: {missing}")

    if chart_spec["chart_type"] not in SUPPORTED_CHART_TYPES:
        raise ValueError(f"Unsupported chart type: {chart_spec['chart_type']}")

    if not isinstance(chart_spec["data"], list) or len(chart_spec["data"]) == 0:
        raise ValueError("Chart spec data must be a non-empty list")

    first_row = chart_spec["data"][0]
    for key in ("x_key", "y_key"):
        if chart_spec[key] not in first_row:
            raise ValueError(
                f"Key '{chart_spec[key]}' not found in data columns: {list(first_row.keys())}"
            )

    return chart_spec