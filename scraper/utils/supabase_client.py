from dotenv import load_dotenv
import os
from supabase import create_client

# Load variables from .env
load_dotenv()

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")

if not supabase_url or not supabase_key:
    raise ValueError("Supabase credentials are missing. Check your .env file.")

supabase = create_client(supabase_url, supabase_key)
