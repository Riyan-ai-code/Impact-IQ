# ImpactIQ — AI-Powered Deployment Risk Analysis Platform

ImpactIQ is a cloud-native platform that automatically evaluates GitHub Pull Requests before merge and deployment. It combines 6 static analysis engines (Code, Dependency, Security, API, Docker, CI/CD) and Generative AI (LangChain + Gemini/GPT-4) to compute linear risk scores and generate release checklists.

![ImpactIQ System Architecture](docs/images/architecture_diagram.jpg)

---

## ⚡ Key Features

- **Automated GitHub Webhooks:** Listens to `pull_request` events to analyze code diffs in real time.
- **6-Tier Static Analysis Engine:**
  - **Code Analysis:** Measures complexity, churn, lines added/deleted, and modified functions.
  - **Dependency Analysis:** Audits `package.json` & `requirements.txt` for version conflicts and vulnerabilities.
  - **Security Analysis:** Scans for hardcoded secrets, API tokens, auth changes, and permission edits.
  - **API Analysis:** Detects breaking REST API contract edits and parameter changes.
  - **Docker Analysis:** Validates `Dockerfile` base tags, healthchecks, root user, and exposed ports.
  - **CI/CD Analysis:** Validates `.github/workflows` YAML configuration and security steps.
- **Deterministic Risk Engine:** Computes an objective 0–100% Risk Score & Severity Level (Low, Medium, High, Critical).
- **Generative AI Reports:** Uses LangChain and LLMs to produce Executive Summaries, Risk Explanations, Testing Strategies, and Deployment Checklists.
- **Containerized Stack:** Complete multi-service orchestration with Docker & Docker Compose.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS, Radix UI
- **Backend:** FastAPI, Python 3.12, Pydantic v2, SQLAlchemy, JWT Authentication
- **Database:** Supabase, PostgreSQL 15 (SQLite fallback for local dev)
- **Generative AI:** LangChain, Google Gemini API / OpenAI GPT-4
- **DevOps:** Docker, Docker Compose, Nginx, GitHub Actions

---

## 🚀 Quick Start (Local Development)

### 1. Clone & Run with Docker Compose
```bash
docker-compose up --build
```
- **Frontend App:** `http://localhost:3000`
- **Backend API:** `http://localhost:8000`
- **API Documentation:** `http://localhost:8000/docs`

### 2. Run Services Separately

#### Backend
```bash
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m fastapi dev main.py
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 📖 Architecture & Diagrams

For full technical specifications, sequence flows, and entity-relationship diagrams, see [ARCHITECTURE.md](ARCHITECTURE.md).
