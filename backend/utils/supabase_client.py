## Utility functions for the backend

import os
from dotenv import load_dotenv
from supabase import create_client, Client

## Load environment variables
load_dotenv()

## Initialize Supabase client
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
supabase_service_role_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

supabase = create_client(supabase_url, supabase_key)

# for admin functions
supabase_admin = create_client(supabase_url, supabase_service_role_key)
