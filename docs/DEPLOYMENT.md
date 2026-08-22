# 🚀 Impact-IQ Production Deployment Guide

This guide covers step-by-step instructions for deploying **Impact-IQ** across:
1. **[Vercel](#1-deploying-frontend-to-vercel)** (Recommended for Next.js Frontend)
2. **[Render](#2-deploying-backend--fullstack-to-render)** (Fastest for FastAPI Backend)
3. **[Amazon Web Services (AWS)](#3-deploying-to-amazon-web-services-aws)** (App Runner, ECS Fargate, EC2)

---

## 🏗 Recommended Architecture

```mermaid
graph LR
    User([Users & Browsers]) -->|Next.js App| Vercel[Vercel Frontend]
    Vercel -->|REST API Calls| RenderBackend[Render / AWS FastAPI API]
    RenderBackend -->|GraphQL / DB| Nhost[(Nhost Postgres DB)]
    RenderBackend -->|OAuth & Repos| GitHub[GitHub API]
```

* **Frontend**: Next.js 15 on **Vercel** (Global CDN Edge caching, Instant builds)
* **Backend**: FastAPI Python on **Render** or **AWS App Runner**
* **Database & Auth**: PostgreSQL & Hasura GraphQL on **Nhost**
* **Git Provider**: **GitHub OAuth 2.0**

---

## 1. Deploying Frontend to Vercel

Vercel provides the fastest and cleanest hosting for Next.js.

### Option A: Via Vercel Dashboard (Easiest)
1. Go to [vercel.com/new](https://vercel.com/new) and connect your GitHub repository.
2. Select your repository: `Impact-IQ`.
3. In **Project Settings**:
   * **Framework Preset**: Next.js
   * **Root Directory**: `frontend` (Click Edit and choose `frontend`)
4. Add **Environment Variables**:
   ```env
   NEXT_PUBLIC_API_URL=https://your-backend-service.onrender.com
   NEXT_PUBLIC_NHOST_SUBDOMAIN=ieoqkrnezzpfxpsugifg
   NEXT_PUBLIC_NHOST_REGION=ap-south-1
   NEXT_PUBLIC_NHOST_GRAPHQL_URL=https://ieoqkrnezzpfxpsugifg.graphql.ap-south-1.nhost.run/v1/graphql
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-google-app-password
   SMTP_FROM="ImpactIQ Security" <your-email@gmail.com>
   ```
5. Click **Deploy**.

### Option B: Via Vercel CLI
```bash
cd frontend
npm install -g vercel
vercel login
vercel --prod
```

---

## 2. Deploying Backend to Render

Render is the simplest and most reliable host for the Python FastAPI backend.

### Option A: Render Blueprints (One-Click Setup)
The repository includes a ready-to-use [`render.yaml`](../render.yaml) blueprint:
1. Log in to [dashboard.render.com](https://dashboard.render.com).
2. Click **New +** > **Blueprint**.
3. Select your `Impact-IQ` repository.
4. Render automatically parses `render.yaml` and configures the FastAPI Web Service.
5. Fill in the required environment variables:
   * `DATABASE_URL`: Your PostgreSQL connection string (from Nhost or Render Postgres)
   * `GITHUB_CLIENT_ID`: Your GitHub OAuth App Client ID
   * `GITHUB_CLIENT_SECRET`: Your GitHub OAuth App Client Secret
   * `GITHUB_REDIRECT_URI`: `https://<YOUR-RENDER-BACKEND-NAME>.onrender.com/api/auth/github/callback`
   * `FRONTEND_URL`: `https://<YOUR-VERCEL-FRONTEND-NAME>.vercel.app`
   * `ALLOWED_ORIGINS`: `https://<YOUR-VERCEL-FRONTEND-NAME>.vercel.app,http://localhost:3000`
6. Click **Apply**.

### Option B: Manual Web Service on Render
1. Go to **Dashboard** > **New +** > **Web Service**.
2. Connect your Git repository.
3. Configure settings:
   * **Name**: `impactiq-backend`
   * **Root Directory**: `backend`
   * **Environment**: `Python 3`
   * **Build Command**: `pip install -r requirements.txt`
   * **Start Command**: `python -m uvicorn main:app --host 0.0.0.0 --port $PORT`
   * **Health Check Path**: `/api/health`
4. Add the environment variables listed in [`backend/.env.example`](../backend/.env.example).
5. Click **Create Web Service**.

---

## 3. Deploying to Amazon Web Services (AWS)

### Method 1: AWS App Runner (Recommended Containerized AWS Option)
AWS App Runner is a fully managed container service with automatic load balancing, TLS certificates, and zero infrastructure maintenance.

1. **Push Backend Docker Image to Amazon ECR**:
   ```bash
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com
   docker build -t impactiq-backend ./backend
   docker tag impactiq-backend:latest <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/impactiq-backend:latest
   docker push <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/impactiq-backend:latest
   ```
2. **Create App Runner Service**:
   * Source: **Container registry** > **Amazon ECR**
   * Select `impactiq-backend:latest`
   * Deployment trigger: **Automatic**
   * Port: `8000`
   * Set environment variables (`FRONTEND_URL`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `SECRET_KEY`, `DATABASE_URL`).
3. App Runner will generate an HTTPS endpoint (e.g. `https://xyz123.us-east-1.awsapprunner.com`).

---

### Method 2: AWS EC2 / Lightsail with Docker Compose & Nginx
To run both frontend and backend on a single self-hosted AWS EC2 instance:

1. Launch an Ubuntu 22.04 LTS EC2 instance with ports `80` and `443` open in the Security Group.
2. Connect to the EC2 instance:
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-public-ip
   ```
3. Install Docker & Docker Compose:
   ```bash
   sudo apt-get update
   sudo apt-get install -y docker.io docker-compose
   sudo usermod -aG docker $USER
   ```
4. Clone the repository and configure `.env`:
   ```bash
   git clone https://github.com/your-username/Impact-IQ.git
   cd Impact-IQ
   cp backend/.env.example .env
   # Edit .env with your credentials
   nano .env
   ```
5. Launch all production services:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d --build
   ```
6. Check logs:
   ```bash
   docker-compose -f docker-compose.prod.yml logs -f
   ```

---

## 4. 🔑 GitHub OAuth 2.0 Configuration for Cloud

When deploying to production, update your GitHub OAuth App settings so login redirects work properly:

1. Go to [GitHub Developer Settings > OAuth Apps](https://github.com/settings/developers).
2. Select your Impact-IQ application.
3. Set **Homepage URL**:
   ```
   https://your-frontend.vercel.app
   ```
4. Set **Authorization callback URL**:
   ```
   https://your-backend.onrender.com/api/auth/github/callback
   ```
   *(Or `https://api.yourdomain.com/api/auth/github/callback` for AWS)*

---

## 5. 📋 Environment Variables Reference

### Frontend (`frontend/.env.local` or Vercel Environment Variables)
| Variable | Description | Example |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | Base URL of the backend API | `https://impactiq-backend.onrender.com` |
| `NEXT_PUBLIC_NHOST_SUBDOMAIN` | Nhost project subdomain | `ieoqkrnezzpfxpsugifg` |
| `NEXT_PUBLIC_NHOST_REGION` | Nhost datacenter region | `ap-south-1` |
| `NEXT_PUBLIC_NHOST_GRAPHQL_URL` | Nhost GraphQL endpoint | `https://ieoqkrnezzpfxpsugifg.graphql.ap-south-1.nhost.run/v1/graphql` |
| `SMTP_HOST` | SMTP server host | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP server port | `587` |
| `SMTP_USER` | SMTP email address | `your-email@gmail.com` |
| `SMTP_PASS` | SMTP application password | `app-password` |
| `SMTP_FROM` | Sender name and email header | `"ImpactIQ Security" <your-email@gmail.com>` |

### Backend (`backend/.env` or Render / AWS Environment Variables)
| Variable | Description | Example |
| :--- | :--- | :--- |
| `DEBUG` | Debug mode | `False` |
| `PORT` | Web server port | `8000` *(Render sets automatically)* |
| `DATABASE_URL` | PostgreSQL connection string | `postgres://user:pass@host:5432/db` |
| `GITHUB_CLIENT_ID` | GitHub OAuth client ID | `Ov23lihBMPfQQKkX7N7N` |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth client secret | `90c9bf87373...` |
| `GITHUB_REDIRECT_URI` | Backend callback URI | `https://impactiq-backend.onrender.com/api/auth/github/callback` |
| `FRONTEND_URL` | Production frontend URL | `https://impact-iq.vercel.app` |
| `ALLOWED_ORIGINS` | Comma-separated CORS origins | `https://impact-iq.vercel.app,http://localhost:3000` |
| `SECRET_KEY` | JWT / session signing key | `secure-random-secret-key-32-chars` |
