# scraper/utils/save_data.py
import json
from pathlib import Path
from datetime import datetime
import requests
import logging

logger = logging.getLogger(__name__)

def save_to_json(data, filename=None):
    filename = filename or f"scholarships_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    path = Path(filename)
    with path.open("w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    logger.info("Saved %d items to %s", len(data), filename)
    return str(path.resolve())

def post_to_backend(data, endpoint="http://127.0.0.1:8000/api/scholarships/bulk"):
    """
    Example: POST the scraped data to your backend.
    Endpoint should accept a list of scholarships in JSON.
    """
    try:
        resp = requests.post(endpoint, json=data, timeout=30)
        resp.raise_for_status()
        return resp.json()
    except Exception as e:
        logger.exception("Failed to post to backend: %s", e)
        return None
