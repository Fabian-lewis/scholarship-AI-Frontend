# Orchestrates all scraping and saving
from scraper.sources.opportunities_for_africans import scrape_opprtunities_for_africans
from scraper.utils.cleaning import delete_expired_scholarships
from scraper.utils.supabase_client import supabase
from datetime import date

DB_COLUMNS = [
    "name", "description", "country_tags",
    "level_tags", "field_tags", "deadline",
    "posted_at", "link"
]

def map_scholarship_to_db(sch):
    return {
        "name": sch.get("title") or "",
        "description": sch.get("description") or "",
        "country_tags": sch.get("countries", []),  # must be list
        "level_tags": sch.get("levels", []),
        "field_tags": sch.get("fields", []),
        "deadline": sch.get("deadline").isoformat() if isinstance(sch.get("deadline"), date) else sch.get("deadline"),  # Should be YYYY-MM-DD
        "posted_at": date.today().isoformat(),  # Or scraped date if available
        "link": sch.get("link") or ""
    }

def run_all_scrapes():
    all_scholarships = []

    # Add sources
    scraped = scrape_opprtunities_for_africans()
    all_scholarships.extend(scraped)

    if all_scholarships:
        clean_scholarships = [map_scholarship_to_db(s) for s in all_scholarships]
        supabase.table("scholarships").insert(clean_scholarships).execute()
        print(f"[SUCCESS] Inserted {len(clean_scholarships)} scholarships into DB.")
    else:
        print("[WARNING] No scholarships found to insert")

if __name__ == "__main__":
    delete_expired_scholarships()
    run_all_scrapes()
