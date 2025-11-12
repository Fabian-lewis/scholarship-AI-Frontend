## Route Handlers for the backend
# File: backend/routes.py
from fastapi import APIRouter, HTTPException, Query, Request
from utils.supabase_client import supabase, supabase_admin
from utils.llama_grok_client import analyze_scholarship_with_grok
import asyncio
from pathlib import Path
from models.userProfile import UserProfile
from datetime import datetime
from sentenceTransformers.transform import transform
import requests
import numpy as np


HF_SPACE_URL = "https://annkabura-scholar-transform-service.hf.space/embed_user"


routes = APIRouter()

## Register Route to handle user registration and onboarding
@routes.post('/users/onboarding')
async def save_onboarding(profile: UserProfile):
    try:
        data = {
            "id": profile.id,
            "first_name": profile.first_name,
            "last_name": profile.last_name,
            "email": profile.email,
            "country": profile.country,
            "level": profile.level,
            "interests": profile.interests,
            "goals": profile.goals,
            "onboarded": profile.onboarded,
            "created_at": datetime.utcnow().isoformat(),
        }

        #print("🧠 Data being saved:", data)
        response = supabase.table("users").upsert(data).execute()

        if getattr(response, "error", None):
            raise HTTPException(status_code=400, detail=response.error.message)

        # ✅ Update Supabase Auth user metadata
        supabase_admin.auth.admin.update_user_by_id(profile.id, {
            "user_metadata": {"onboarded": True}
        })

        return {"message": "user Profile saved successfully", "data": response.data}
    
    except Exception as e:
        #print("🔥 Unexpected error:", str(e))
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



# ==== Upload scholarships to database ====
@routes.post("/upload_scholarships")
async def upload_scholarships(request: Request):
    """Upload scraped scholarship data to Supabase."""
    try:
        data = await request.json()
        if not isinstance(data, list):
            raise HTTPException(status_code=400, detail="Expected a list of scholarship objects")

        clean_records = []

        for item in data:
            if not all(k in item for k in ["title", "origin_url", "description"]):
                print("Skipping incomplete item:", item.get("title"))
                continue

            # ✅ Create summary + embedding
            summary, embedding = transform(item.get("description", ""))

            clean_records.append({
                "name": item.get("title"),
                "description": summary,
                "embedding": embedding,
                "provider": item.get("provider"),
                "level_tags": item.get("level"),
                "country_tags": item.get("country"),
                "amount": item.get("amount"),
                "posted_at": item.get("published"),
                "source": item.get("source"),
                "link": item.get("origin_url"),
                "deadline": item.get("deadline"),
                "field_tags": item.get("field")
            })

        # ✅ Bulk insert for better performance
        if clean_records:
            supabase.table("scholarships").insert(clean_records).execute()

        return {"message": f"Uploaded {len(clean_records)} scholarships successfully."}

    except Exception as e:
        print("🔥 Unexpected error:", str(e))
        raise HTTPException(status_code=500, detail=str(e))


# ====== Get Recent Scholarships =====
@routes.get("/scholarships/recent")
async def get_recent_scholarships(limit: int=Query(10, ge=1, le=100)):
    """
    Return the most recently posted scholarships
    Query param: ?limit=10
    """

    try:
        resp = (
            supabase.table("scholarships")
            .select(
                "id,name,provider,deadline,posted_at,link,description,"
                "field_tags,country_tags,level_tags,amount,source"
            )
            .order("posted_at", desc=True)
            .limit(limit)
            .execute()
        )

        # Handle possible empty or bad response
        data = getattr(resp, "data", None)
        if not data:
            raise HTTPException(status_code=404, detail="No scholarships found")

        return {"scholarships": data}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============ Recommend Scholarships   ========================
@routes.get("/recommend_scholarships/{user_id}")
async def recommend_scholarships(user_id: str):
    try:
        # Get User Data
        user_res = supabase.table("users").select("*").eq("id", user_id).single().execute()
        user = user_res.data

        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # ✅ Combine text fields for embedding
        combined_text = f"Goals: {user['goals']}. Interests: {', '.join(user['interests']) if isinstance(user['interests'], list) else user['interests']}."

        # ✅ Send correct JSON payload
        payload = {"text": combined_text}
        r = requests.post(HF_SPACE_URL, json=payload)
        r.raise_for_status()

        user_embedding = np.array(r.json()["embedding"])

        # Get All scholarship embeddings
        scholarships = supabase.table("scholarships").select(
            "id,name,provider,deadline,posted_at,link,description,field_tags,country_tags,level_tags,amount,source,embedding"
        ).execute().data

        # Compute similarity
        results = []
        for s in scholarships:
            emb = np.array(s["embedding"])
            similarity = np.dot(user_embedding, emb) / (np.linalg.norm(user_embedding) * np.linalg.norm(emb))
            results.append({
               "id": s.get("id"),
                "name": s.get("name"),
                "provider": s.get("provider"),
                "deadline": s.get("deadline"),
                "posted_at": s.get("posted_at"),
                "link": s.get("link"),
                "description": s.get("description"),
                "field_tags": s.get("field_tags"),
                "country_tags": s.get("country_tags"),
                "level_tags": s.get("level_tags"),
                "amount": s.get("amount"),
                "source": s.get("source"),
                "score": round(similarity*100,2),
            })

        # 5️⃣ Sort by similarity score
        results.sort(key=lambda x: x["score"], reverse=True)
        top_matches = results[:15]

        # Return top N matches (say 10)
        return {"scholarships": top_matches}

    except Exception as e:
        print("🔥 Error generating recommendations:", str(e))
        raise HTTPException(status_code=500, detail=str(e))