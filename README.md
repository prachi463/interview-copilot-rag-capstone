# Interview Copilot — Full-Stack RAG + Three.js

Capstone Project: Advanced RAG with a 3D-animated React + Flask frontend.

**Architecture:**
- **Backend:** Flask API wrapping the RAG chain (hybrid retrieval, query routing, LLM generation)
- **Frontend:** React + Three.js with smooth animations and a scrollable chat interface
- **Deployment:** Flask on Render, React on Vercel (or both on Render if preferred)

## Project Structure

```
interview-copilot-rag/
├── backend/
│   ├── api.py                   # Flask API endpoints
│   ├── app.py → removed        # (old Streamlit app, replaced by api.py)
│   ├── retriever.py            # Hybrid FAISS + BM25 retrieval
│   ├── rag_chain.py            # Query routing, prompt construction, generation
│   ├── embeddings.py           # Pluggable embedding backends
│   ├── llm_backends.py         # Groq / OpenAI / extractive fallback
│   ├── ingest.py               # Document ingestion pipeline
│   ├── knowledge_base/         # Your docs (resume, reports, etc.)
│   ├── vector_store/           # Pre-built FAISS + BM25 indexes
│   ├── requirements.txt
│   ├── .env.example
│   └── .streamlit/
├── frontend/
│   ├── src/
│   │   ├── App.jsx             # Main React component
│   │   ├── main.jsx            # Entry point
│   │   ├── index.css           # Global styles
│   │   ├── components/
│   │   │   ├── ThreeBackground.jsx    # Animated 3D scene
│   │   │   ├── ChatInterface.jsx      # Chat UI + API calls
│   │   │   └── SourceCard.jsx         # Citation cards
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .env.example
└── README.md (this file)
```

## Local Setup & Testing

### Backend

```bash
cd backend
pip install -r requirements.txt

# Set up API keys (optional, but recommended)
cp .env.example .env
# Edit .env and add GROQ_API_KEY or OPENAI_API_KEY

# Start Flask API
python api.py
# Runs on http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install

# Start dev server (proxies /api calls to Flask backend)
npm run dev
# Opens http://localhost:3000
```

**Both must be running locally for the full stack to work.**

## Features

- **Hybrid Retrieval:** Dense (FAISS cosine) + Sparse (BM25 keyword) search merged with Reciprocal Rank Fusion
- **Query Router:** Classifies questions (project_technical / resume_fact / behavioral) and adjusts retrieval depth
- **3D Background:** Three.js animated geometries, particles, smooth rotations
- **Smooth Animations:** Framer Motion transitions on messages, buttons, and transitions
- **Source Citation:** Every answer shows which document chunks it came from, with confidence scores
- **Graceful Fallback:** Works with no API key — extractive mode shows retrieved chunks directly
- **Responsive Design:** Works on desktop; mobile support included

## Deployment

### Option A: Separate Services (Recommended for free tier)

**Backend on Render:**
1. Push the `backend/` folder to a GitHub repo
2. On render.com, create a new Web Service
   - Repository: your repo
   - Root Directory: `backend`
   - Build command: `pip install -r requirements.txt`
   - Start command: `gunicorn api:app`
3. Add environment secrets: `GROQ_API_KEY`, `OPENAI_API_KEY`
4. Deploy — get your backend URL, e.g., `https://interview-copilot-backend.onrender.com`

**Frontend on Vercel:**
1. Push the `frontend/` folder to GitHub (or the whole repo, with frontend as a directory)
2. On vercel.com, import the project
   - Root Directory: `frontend`
   - Build command: `npm run build`
   - Output directory: `dist`
3. Add environment variable: `VITE_API_URL=https://interview-copilot-backend.onrender.com`
4. Deploy — get your live link

### Option B: Both on Render (Single repo)

1. Push entire repo to GitHub
2. Create a Web Service on Render
   - Build command: `cd frontend && npm install && npm run build && cd ../backend && pip install -r requirements.txt`
   - Start command: `cd backend && gunicorn api:app`
3. Set public files path to `frontend/dist`
4. Add environment secrets

**Note:** For production, you'll need to handle static file serving (Render can serve the built React app from the backend).

## Adding Your Docs

Replace the placeholder files in `backend/knowledge_base/` with your actual resume, internship reports, and project docs:
- Supported formats: `.md`, `.txt`, `.pdf`, `.docx`
- After adding docs, run `python ingest.py` to rebuild the search indexes
- Commit `vector_store/` to GitHub (it's already indexed)

## Video Demo Script

1. **Problem (30s):** Interview prep is repetitive. Built an AI assistant trained on my own resume/projects to rehearse live.
2. **Architecture (1m):** Show the backend RAG pipeline (hybrid retrieval, query router) and the React frontend with Three.js.
3. **Live Demo (3m):**
   - Ask 3–4 questions (one technical, one factual, one behavioral)
   - Show source citations expanding
   - Mention the confidence scores and retrieved chunk names
4. **Results (1m):** Show retrieved chunk count, model accuracy metrics, and the 3D animated background
5. **Learnings (1m):** Why hybrid retrieval matters (exact terms + semantics), why graceful fallback matters (no API key = still works)

## Troubleshooting

**Frontend can't reach backend:**
- Check Flask is running on `localhost:5000`
- Check CORS is enabled (it should be — `CORS(app)` in `api.py`)
- Check `VITE_API_URL` env var in Vercel matches your Render backend URL

**"Knowledge base not ready":**
- Run `python ingest.py` in the backend folder to rebuild indexes

**LLM responses are slow:**
- Groq free tier has rate limits; fallback mode will still work
- Check your GROQ_API_KEY is valid

**React app won't build:**
- Check `npm install` ran successfully
- Clear node_modules and package-lock.json, reinstall

## Deployment Links (Example)

- **Backend:** `https://interview-copilot-backend.onrender.com`
- **Frontend:** `https://interview-copilot.vercel.app`
- **GitHub:** `https://github.com/prachi463/interview-copilot-rag`

---

Built with Flask, React, Three.js, and LangChain RAG. Deployed on Render + Vercel.
