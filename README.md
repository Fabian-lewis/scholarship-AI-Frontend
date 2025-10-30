###
Supabase table schemas (recommended)

Create these tables in Supabase (SQL or dashboard). I’ll include core columns and suggested types.

users

id (uuid) — primary key (default gen_random_uuid())

name (text)

email (text) — unique

country (text)

level (text) — e.g., "Undergraduate", "Postgraduate"

interests (text[]) — array of keywords

created_at (timestamp) — default now()

scholarships

id (uuid) — primary key

name (text)

origin_url (text) — unique index (source post page)

link (text) — application link (external)

description (text)

provider (text)

amount (text)

deadline (date)

published (date)

country_tags (text[]) — country/region list

level_tags (text[]) — levels (Undergraduate, Postgraduate, PhD)

field_tags (text[]) — subject fields

tags (text[]) — raw tags from post

source (text) — site domain

created_at (timestamp) — default now()

embedding (vector) — optional (if using vector search)

Add indices on origin_url (unique) and deadline (for sorting).

user_interactions (optional)

id, user_id, scholarship_id, action (saved/applied/viewed), created_at

###

```
scholarship_ai_agent/
│
├── backend/
│   ├── app.py                     # FastAPI app entrypoint
│   ├── routes.py                  # APIRouter with endpoints
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── utils/
│   │   ├── __init__.py
│   │   ├── supabase_client.py     # supabase wrapper (init client + helper functions)
│   │   ├── llama_grok_client.py   # LLM wrapper (analyze_scholarship_with_grok)
│   │   ├── db_helpers.py          # helpers for inserts/queries, dedupe, bulk upsert
│   │   └── logger.py
│   └── tests/
│       └── test_routes.py
│
├── scraper/
│   ├── main.py                    # orchestrates scrapers, dedupe, saves JSON, optionally POSTs to backend
│   ├── requirements.txt
│   ├── data/                      # saved JSONs (gitignored)
│   │   └── opportunitiesforafricans_YYYYMMDD.json
│   ├── sources/
│   │   ├── __init__.py
│   │   └── opportunitiesforafricans.py
│   └── utils/
│       ├── __init__.py
│       ├── cleaner.py
│       └── save_data.py
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── api/                 # 🔌 All API calls (connects to FastAPI)
│   │   ├── index.ts
│   │   └── user.ts
│   │   └── scholarships.ts
│   │
│   ├── components/            # 🧩 Reusable UI components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── Loader.tsx
│   │   ├── ScholarshipCard.tsx
│   │   └── FormInput.tsx
│   │
│   ├── pages/                # 📄 App pages (routed via React Router)
│   │   ├── Home.tsx
│   │   ├── Register.tsx
│   │   ├── Scholarships.tsx
│   │   ├── ScholarshipDetail.tsx
│   │   ├── About.tsx
│   │   └── NotFound.tsx
│   │
│   ├── hooks/               # 🪝 Custom React hooks
│   │   └── useFetch.ts
│   │
│   ├── context/             # 🌐 App-wide state (auth, user)
│   │   └── UserContext.tsx
│   │
│   ├── styles/              # 🎨 Tailwind extensions or custom CSS
│   │   └── globals.css
│   │
│   ├── utils/               # ⚙️ Helpers (formatting, constants)
│   │   ├── formatDate.ts
│   │   └── constants.ts
│   │
│   ├── App.tsx              # 🚀 Main app entry (routes defined here)
│   ├── main.tsx             # React root
│   └── vite-env.d.ts
│
├── infra/
│   ├── docker-compose.yml
│   └── nginx/                        # optional reverse proxy config
│
├── .env.example
├── README.md
└── LICENSE

```