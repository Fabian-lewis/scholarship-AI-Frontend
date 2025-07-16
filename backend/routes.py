## Route Handlers for the backend
# File: backend/routes.py
from flask import Blueprint, request, jsonify
import os
from utils.supabase_client import supabase
from utils.llama_grok_client import analyze_scholarship_with_grok
import time
import gc


routes = Blueprint('routes', __name__)

## Register Route to handle user registration
@routes.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    country = data.get("country")
    level = data.get("level")
    interests = data.get("interests") # An array of interests
    if not all([name, email, country, level, interests]):
        return jsonify({"error": "Missing required fields"}), 400
    

    # Insert the user into the database
    try:
        result = supabase.table("users").insert({
            "name": name,
            "email": email,
            "country": country,
            "level": level,
            "interests": interests
        }).execute()

        return jsonify({"message": "User registered successfully", "data": result.data}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

## Route to get scholarships based on user interests
@routes.route('/scholarships', methods=['GET'])
def get_scholarships():
    email = request.args.get('email')
    if not email:
        return jsonify({"error": "Email parameter is required"}), 400
    
    # Get user by email
    user_response = supabase.table("users").select("*").eq("email", email).execute()
    if not user_response.data:
        return jsonify({"error": "User not found"}), 404
    
    user = user_response.data[0] # Assuming only one user with the email exists
    user_country = user["country"].lower()
    user_level = user["level"].lower()
    user_interests = [i.lower() for i in user["interests"]]

    # Fetch all scholarships
    scholarships_response = supabase.table("scholarships").select("*").execute()
    if not scholarships_response.data:
        return jsonify({"error": "No scholarships found"}), 404
    
    scholarships = scholarships_response.data

    # Filter scholarships based on user country, level, and interests
    matches = []
    added = set()  # To avoid duplicates
    BATCH_SIZE = 3  # Number of scholarships to process in one batch

    for batch in chunk_list(scholarships, BATCH_SIZE):
        for sch in batch:
            if not sch.get("country_tags") or not sch.get("level_tags") or not sch.get("field_tags"):
                continue # Skip scholarships without tags
            if not sch.get("description"):
                continue

            sch_name = sch.get("name").lower()
            if sch_name in added:
                continue

            try:
                if ai_scholarship_match(user_country, user_level, user_interests, sch["description"]):
                    added.add(sch_name)
                    matches.append(format_scholarship(sch))
            except Exception as e:
                print(f"Error processing scholarship {sch_name}: {e}")
        
        #pause after each batch to avoid rate limiting
        time.sleep(10)
        gc.collect() # Free up memory after each batch
    if not matches:
        return jsonify({"message": "No matching scholarships found"}), 404
    
    return jsonify({"scholarships": matches}), 200


def ai_scholarship_match(user_country, user_level, user_interests, description):
    try:
        prompt = f"""
User Profile:
 - Country: {user_country}
- Level: {user_level}
- Interests: {', '.join(user_interests)}
Scholarship Description:
{description}

Question: 
Is this scholarship suitable for this user? Respond only with "YES" or "NO".
"""
        response = analyze_scholarship_with_grok(prompt)
        print(f"AI Response: {response}")  # Debugging line to see the AI response
        return "YES" in response.upper()
    except Exception as e:
        if "rate limit" in str(e).lower():
            print("Rate limit exceeded, retrying after 5 seconds...")
            time.sleep(15)
        print(f"AI Matching Error: {str(e)}")
        return False
    
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