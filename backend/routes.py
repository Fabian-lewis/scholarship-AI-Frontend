## Route Handlers for the backend
# File: backend/routes.py
from fastapi import APIRouter, HTTPException, Query, Request
from utils.supabase_client import supabase
from utils.llama_grok_client import analyze_scholarship_with_grok
import asyncio



routes = APIRouter()

## Register Route to handle user registration
@routes.post('/register')
async def register(request: Request):
    data = await request.json()
    name = data.get("name")
    email = data.get("email")
    country = data.get("country")
    level = data.get("level")
    interests = data.get("interests")

    if not all([name, email, country, level, interests]):
        raise HTTPException(status_code=400, detail="Missing required fields")

    try:
        result = supabase.table("users").insert({
            "name": name,
            "email": email,
            "country": country,
            "level": level,
            "interests": interests
        }).execute()
        return {"message": "User registered successfully", "data": result.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

## Route to get scholarships based on user interests
@routes.get('/scholarships') # This is a GET request
async def get_scholarships(email: str = Query(...)): # Email is required as a query parameter
    user_response = supabase.table('users').select("*").eq("email", email).execute()
    if not user_response.data:
        raise HTTPException(status_code=404, detail="User not found")
    if not email:
        raise HTTPException(status_code=400, detail="Email parameter is required")


    user = user_response.data[0] # Assuming only one user with the email exists
    user_country = user["country"].lower()
    user_level = user["level"].lower()
    user_interests = [i.lower() for i in user["interests"]]

    # Fetch all scholarships
    scholarships_response = supabase.table("scholarships").select("*").execute()
    if not scholarships_response.data:
        raise HTTPException(status_code=404, detail="No scholarships found")

    scholarships = scholarships_response.data

    # Filter scholarships based on user country, level, and interests
    matches = []
    added = set()  # To avoid duplicates
    BATCH_SIZE = 2  # Number of scholarships to process in one batch

    for batch in chunk_list(scholarships, BATCH_SIZE):
        tasks = []
        for sch in batch:
            if not sch.get("country_tags") or not sch.get("level_tags") or not sch.get("field_tags"):
                continue # Skip scholarships without tags
            if not sch.get("description"):
                continue

            sch_name = sch.get("name").lower()
            if sch_name in added:
                continue

            tasks.append(process_scholarship(sch, user_country, user_level, user_interests, matches, added))

        # Process all tasks concurrently
        await asyncio.gather(*tasks)
        # Sleep to avoid rate limiting
        await asyncio.sleep(5)

    if not matches:
        raise HTTPException(status_code=404, detail="No matching scholarships found")

    return {"scholarships": matches}

async def process_scholarship(sch, user_country, user_level, user_interests, matches, added):
    try:
        prompt = f"""
User Profile:
 - Country: {user_country}
- Level: {user_level}
- Interests: {', '.join(user_interests)}
Scholarship Description:
{sch['description']}

Question: 
Is this scholarship suitable for this user? Respond only with "YES" or "NO".
"""
        response = analyze_scholarship_with_grok(prompt)
        if "YES" in response.upper():
            added.add(sch["name"].lower())
            matches.append(format_scholarship(sch))
    except Exception as e:
        print(f"Error processing {sch.get('name')}: {e}")
    
def format_scholarship(sch):
    return {
        "name": sch.get("name"),
        "link": sch.get("link"),
        "description": sch.get("description"),
        "country_tags": sch.get("country_tags"),
        "level_tags": sch.get("level_tags"),
        "field_tags": sch.get("field_tags"),
        "deadline": sch.get("deadline")
    }

def chunk_list(data, chunk_size):
    """Yield successive n-sized chunks from data."""
    for i in range(0, len(data), chunk_size):
        yield data[i:i + chunk_size]