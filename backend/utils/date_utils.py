import dateparser

def parse_deadline(text):
    """
    Extract and convert the first date from a deadline string to YYYY-MM-DD.
    Example: "Application Deadline: October 5, 2025" → "2025-10-05"
    """
    if not text:
        return None
    date = dateparser.parse(text)
    if date:
        return date.strftime("%Y-%m-%d")
    return None
