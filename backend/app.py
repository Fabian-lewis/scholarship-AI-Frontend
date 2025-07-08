from flask import Flask, request, jsonify
from dotenv import load_dotenv
import os
from supabase import create_client, Client
from routes import routes

from flask_cors import CORS


## Load environment variables
load_dotenv()

## Initialize Supabase client
url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(url, key)
app = Flask(__name__)
CORS(app) # Enable CORS for all routes

# Register Blueprint
app.register_blueprint(routes)

@app.route('/')
def index():
    return jsonify({"message": "Welcome to the Scholarship AI Agent Backend!"})

if __name__ == '__main__':
    port = int(os.getenv("PORT", 5000))
    app.run(debug=True)