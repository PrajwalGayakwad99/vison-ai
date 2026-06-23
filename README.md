# Vision AI

Modular monorepo — Next.js 15 frontend + FastAPI backend + Docker sandbox.

## Structure

| Path | Owner | Description |
|------|-------|-------------|
| `frontend/` | Rahul | Next.js 15 App Router + Tailwind + Monaco + React Flow |
| `backend/app/` | Prajwal | FastAPI, LangGraph AI, Supabase, WebSockets |
| `backend/sandbox/` | Prajwal | Isolated Docker containers for code execution |
| `.github/` | Both | CI/CD pipelines |

## Getting Started

### Frontend
```bash
cd frontend
npm install
npm run dev         # http://localhost:3000
```

### Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload  # http://localhost:8000
```

## Requirements
- Node.js 18+
- Python 3.11+
- Docker & Docker Compose
