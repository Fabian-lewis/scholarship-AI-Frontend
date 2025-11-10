import requests
from fastapi import HTTPException
import os
from dotenv import load_dotenv

# Load env variables
load_dotenv()

HF_SPACE_URL = os.getenv("HF_SPACE_URL")

def transform(text: str):
    try:
        payload = {"text": text}
        response = requests.post(HF_SPACE_URL, json=payload, timeout=30)
        if response.status_code != 200:
            raise HTTPException(status_code=500, detail=f"HF space error: {response.text}")

        data = response.json()
        summary = data.get("summary")
        embedding = data.get("embedding")

        if not summary or not embedding:
            raise HTTPException(status_code=500, detail="HF space returned invalid data")

        return summary, embedding

    except Exception as e:
        print("🔥 Unexpected error during transforming:", str(e))
        raise HTTPException(status_code=500, detail=str(e))


