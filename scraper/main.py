# scraper/main.py
from sources.opportunities_for_africans import scrape_all
from utils.save_data import save_to_json, post_to_backend
import logging
import sys
from pathlib import Path

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def main():
    # Adjust pages and delay as required
    pages = 5
    delay = 1.0

    logger.info("Starting scraper for opportunitiesforafricans")
    data = scrape_all(pages=pages, delay=delay)
    logger.info("Scraped %d items", len(data))

    # Deduplicate by origin_url
    unique = {}
    for item in data:
        key = item.get("origin_url") or item.get("link")
        if key and key not in unique:
            unique[key] = item
    unique_list = list(unique.values())
    logger.info("Unique items after dedupe: %d", len(unique_list))

    # Save locally
    out_path = save_to_json(unique_list, filename="opportunitiesforafricans_scholarships.json")
    logger.info("Saved scraped data to %s", out_path)

    # Optionally post to backend (uncomment if you have endpoint)
    # resp = post_to_backend(unique_list)
    # logger.info("Backend response: %s", resp)

if __name__ == "__main__":
    main()
