from datetime import datetime
import re

def parse_deadline(text):
    """
    Extracts and parses a date from a string into ISO format (YYYY-MM-DD).
    Returns None if no valid date is found.
    """
    if not text:
        return None

    # Normalize text
    text = text.strip().lower()

    # Handle common non-date responses
    if any(word in text for word in ["ongoing", "varies", "open", "rolling"]):
        return None

    # Remove "deadline:" or similar words
    text = re.sub(r"deadline[:\s]*", "", text, flags=re.IGNORECASE)

    # Possible date formats we might encounter
    date_formats = [
        "%B %d, %Y",   # January 5, 2025
        "%d %B %Y",    # 5 January 2025
        "%b %d, %Y",   # Jan 5, 2025
        "%d %b %Y",    # 5 Jan 2025
        "%Y-%m-%d",    # 2025-01-05
        "%d/%m/%Y",    # 05/01/2025
        "%m/%d/%Y",    # 01/05/2025
    ]

    # Try each format until one works
    for fmt in date_formats:
        try:
            return datetime.strptime(text, fmt).date().isoformat()
        except ValueError:
            continue

    # Try regex to extract a date from messy text
    date_match = re.search(r"(\d{1,2}\s+\w+\s+\d{4})", text)
    if date_match:
        try:
            return datetime.strptime(date_match.group(1), "%d %B %Y").date().isoformat()
        except ValueError:
            pass

    # If nothing works
    return None
