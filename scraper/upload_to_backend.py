## upload_to_backend.py

import requests
import json
from pathlib import Path
import os
from dotenv import load_dotenv

## Load environment variables
load_dotenv()

## Load the Bachend URL
backend_url = os.getenv("BACKEND_URL")


## Define the URL
URL = f"{backend_url}/upload_scholarships"

# Load your scraped JSON data
json_path = Path("data/opportunitiesforafricans_scholarships.json")
with open(json_path, "r", encoding="utf-8") as f:
    data = json.load(f)

# POST to your FastAPI backend
response = requests.post(URL, json=data)

print(response.status_code)
print(response.json())
