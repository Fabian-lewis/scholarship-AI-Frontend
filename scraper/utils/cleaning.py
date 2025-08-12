from datetime import date
from scraper.utils.supabase_client import supabase

def delete_expired_scholarships():
    today = date.today().isoformat() # Get today's date in ISO format
    response = supabase.table("scholarships").delete().lt("deadline", today).execute()
    print(f"[INFO] Deleted {len(response.data)} expired scholarships from the database.")