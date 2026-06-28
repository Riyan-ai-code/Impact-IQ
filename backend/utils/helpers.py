# Helper Functions

from datetime import datetime

def format_date(dt: datetime) -> str:
    return dt.strftime("%Y-%m-%d %H:%M")

def truncate(text: str, length: int = 100) -> str:
    return text[:length] + "..." if len(text) > length else text
