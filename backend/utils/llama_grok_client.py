import requests
import os

## Load the API KEY from the environment variable
GROK_API_KEY = os.getenv("GROK_API_KEY")
GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions"
LLAMA_MODEL = "llama3-8b-8192"  # You can change to "mixtral-8x7b-32768"

def analyze_scholarship_with_grok(prompt_text):
    if not GROK_API_KEY:
        raise ValueError("GROK_API_KEY is not set in the environment variables.")
    
    payload = {
        "model": LLAMA_MODEL,
        "messages": [
            {"role": "system", "content": "You are a helpful assistant that analyzes scholarship descriptions to determine suitability for users"},
            {"role": "user", "content": prompt_text}
        ],
        "max_tokens": 100,
        "temperature": 0.0
    }
    headers = {
        "Authorization": f"Bearer {GROK_API_KEY}",
        "Content-Type": "application/json"
    }

    response = requests.post(GROQ_ENDPOINT, json=payload, headers=headers)

    if response.status_code == 200:
        content = response.json()['choices'][0]['message']['content'] # Extract the content from the response
        return content.strip()  # Return the analyzed content
    else:
        raise ValueError(f"Error {response.status_code}: {response.text}")