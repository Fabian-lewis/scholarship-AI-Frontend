# scraper/utils/cleaner.py
import re
from datetime import datetime
import dateparser

def clean_text(text: str) -> str:
    if not text:
        return ""
    # remove excessive whitespace and weird chars
    text = re.sub(r"\xa0", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text

def parse_date_flex(date_str: str):
    """
    Attempt to parse many date formats, return ISO date string or None.
    Uses dateparser for robustness.
    """
    if not date_str:
        return None
    date_str = clean_text(date_str)
    dt = dateparser.parse(date_str)
    if not dt:
        # attempt simple fallback formats
        for fmt in ("%B %d, %Y", "%d %B %Y", "%Y-%m-%d"):
            try:
                dt = datetime.strptime(date_str, fmt)
                break
            except Exception:
                continue
    if dt:
        return dt.date().isoformat()
    return None
