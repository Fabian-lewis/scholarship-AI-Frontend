## 🎓 Scholarship AI
Scholarship AI is an intelligent platform that helps students discover, apply for, and manage scholarships effortlessly through personalized AI assistance.
It leverages machine learning and natural language understanding to match users with relevant opportunities, streamline application workflows, and provide guidance throughout the scholarship journey.

### 🚀 Overview

Finding scholarships can be overwhelming — scattered opportunities, lengthy forms, and eligibility confusion.
Scholarship AI simplifies this process by acting as your personal scholarship assistant:

- Discover relevant scholarships using AI-driven recommendations.
- Manage deadlines and applications in one place.
- Receive tailored feedback on essays, eligibility, and next steps.
- Learn strategies to improve your chances — directly from the assistant.

### 🧩 Tech Stack

| Layer            | Technologies                                                         |
| ---------------- | -------------------------------------------------------------------- |
| **Frontend**     | React, TypeScript, TailwindCSS, shadcn/ui, React Query, React Router |
| **Backend**      | Node.js / Express (planned), integrated with OpenAI API              |
| **Database**     | Supabase (auth + data)                                               |
| **AI Layer**     | GPT-based scholarship discovery, essay review, and chat guidance     |
| **State & Data** | React Query, Context API                                             |
| **Routing**      | React Router DOM                                                     |


### 🛠️ Installation
1. Clone the repository
```
git clone https://github.com/Fabian-lewis/scholarship-AI-Frontend
cd scholarship-AI-Frontend

```
2. Install dependencies
```
npm install

```
3. Create your environment file
```
cp .env.example .env

```
4. Run the development server
```
npm run dev

```

### 📁 Folder Structure
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

### 📊 Database Schema (Supabase)

Create these tables in Supabase using SQL or the dashboard.
Below are the core tables and recommended fields.

```
🧍‍♀️ users

| Column       | Type        | Notes                                 |
| ------------ | ----------- | ------------------------------------- |
| `id`         | `uuid`      | Primary key (`gen_random_uuid()`)     |
| `name`       | `text`      |                                       |
| `email`      | `text`      | Unique                                |
| `country`    | `text`      |                                       |
| `level`      | `text`      | e.g., "Undergraduate", "Postgraduate" |
| `interests`  | `text[]`    | Array of keywords                     |
| `created_at` | `timestamp` | Default `now()`                       |


🎓 scholarships

| Column         | Type        | Notes                                     |
| -------------- | ----------- | ----------------------------------------- |
| `id`           | `uuid`      | Primary key                               |
| `name`         | `text`      |                                           |
| `origin_url`   | `text`      | Unique index (source post page)           |
| `link`         | `text`      | Application link (external)               |
| `description`  | `text`      |                                           |
| `provider`     | `text`      |                                           |
| `amount`       | `text`      |                                           |
| `deadline`     | `date`      |                                           |
| `published`    | `date`      |                                           |
| `country_tags` | `text[]`    | List of eligible countries/regions        |
| `level_tags`   | `text[]`    | Levels (Undergraduate, Postgraduate, PhD) |
| `field_tags`   | `text[]`    | Subject or discipline tags                |
| `tags`         | `text[]`    | Raw extracted tags                        |
| `source`       | `text`      | Origin site domain                        |
| `created_at`   | `timestamp` | Default `now()`                           |
| `embedding`    | `vector`    | Optional (for vector search)              |


📈 user_interactions (optional)

| Column           | Type        | Notes                                    |
| ---------------- | ----------- | ---------------------------------------- |
| `id`             | `uuid`      | Primary key                              |
| `user_id`        | `uuid`      | Foreign key → `users.id`                 |
| `scholarship_id` | `uuid`      | Foreign key → `scholarships.id`          |
| `action`         | `text`      | e.g., `"saved"`, `"applied"`, `"viewed"` |
| `created_at`     | `timestamp` | Default `now()`                          |

```


### 🧠 AI Capabilities

- Scholarship AI uses GPT-based reasoning and structured prompts to:
- Understand user goals and eligibility
- Rank scholarships based on fit and priority
- Offer essay and application feedback
- Help draft personalized statements

### 🤝 Contributing

Contributions are welcome!
To contribute:

1. Fork this repo
2. Create a new branch (feature/your-feature-name)
3. Commit and push your changes
4. Open a Pull Request

### 🧾 License

This project is licensed under the MIT License — see the LICENSE
 file for details.