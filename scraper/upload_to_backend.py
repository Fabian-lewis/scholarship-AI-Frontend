## upload_to_backend.py

import requests
import json
from pathlib import Path


## Define the URL
URL = "http://127.0.0.1:8000/upload_scholarships"

# Load your scraped JSON data
json_path = Path("data/opportunitiesforafricans_scholarships.json")
with open(json_path, "r", encoding="utf-8") as f:
    data = json.load(f)

# POST to your FastAPI backend
response = requests.post(URL, json=data)

print(response.status_code)
print(response.json())
