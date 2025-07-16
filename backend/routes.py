## Route Handlers for the backend
# File: backend/routes.py
from flask import Blueprint, request, jsonify
import os
from utils.supabase_client import supabase


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
    for sch in scholarships:
        if not sch.get("country_tags") or not sch.get("level_tags") or not sch.get("field_tags"):
            continue # Skip scholarships without tags

        # Match logic: at least one match in each category
        country_match = user_country in [c.lower() for c in sch["country_tags"]]
        level_match = user_level in [l.lower() for l in sch["level_tags"]]
        field_match = any(f.lower() in user_interests for f in sch["field_tags"])

        if country_match or level_match and field_match:
            # Ensure we don't add duplicates
            sch_name = sch.get("name").lower()
            if sch_name not in added:
                added.add(sch_name)
                matches.append({
                    "name": sch["name"],
                    "link": sch["link"],
                    "description": sch["description"],
                    "country_tags": sch["country_tags"],
                    "level_tags": sch["level_tags"],
                    "field_tags": sch["field_tags"],
                    "deadline": sch.get("deadline")
            })
    if not matches:
        return jsonify({"message": "No matching scholarships found"}), 404
    
    return jsonify({"scholarships": matches}), 200