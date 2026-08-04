# ImpactIQ — Visual Architectural Flowcharts & Diagrams

This document contains visual diagrams, sequence flows, and system component maps for the ImpactIQ platform.

---

## 1. System Architecture Infographic

![ImpactIQ System Architecture Diagram](images/architecture_diagram.jpg)

---

## 2. Complete End-to-End System Workflow

The diagram below shows the flow of data from GitHub Webhook triggers down to FastAPI execution, static analyzers, Risk calculation, Generative AI, and Dashboard persistence:

```mermaid
flowchart TD
    subgraph Trigger [1. Trigger Phase]
        PR["Developer Opens / Updates Pull Request on GitHub"]
        Webhook["GitHub Webhook Event (pull_request)"]
        PR --> Webhook
    end

    subgraph Ingestion [2. Ingestion & Pre-processing]
        FastAPI["FastAPI Webhook Receiver (/api/github/webhooks)"]
        FetchDiff["Download PR Code Diff & File Metadata"]
        Webhook --> FastAPI
        FastAPI --> FetchDiff
    end

    subgraph Analyzers [3. 6-Tier Static Analysis Engine]
        CodeAnal["Code Analyzer\n(LOC, Complexity, Modified Functions)"]
        DepAnal["Dependency Analyzer\n(package.json, requirements.txt, Vulns)"]
        SecAnal["Security Analyzer\n(Hardcoded Secrets, Auth Edits)"]
        APIAnal["API Analyzer\n(REST Breaking Changes, Endpoint Edits)"]
        DockerAnal["Docker Analyzer\n(Base Tags, Healthcheck, Root User)"]
        CICDAnal["CI/CD Analyzer\n(.github/workflows, Test Steps)"]

        FetchDiff --> CodeAnal
        FetchDiff --> DepAnal
        FetchDiff --> SecAnal
        FetchDiff --> APIAnal
        FetchDiff --> DockerAnal
        FetchDiff --> CICDAnal
    end

    subgraph RiskCalc [4. Deterministic Risk Engine]
        Facts["Aggregate Static Findings into JSON Fact Payload"]
        Score["Compute Linear Weighted Risk Score (0-100%)"]
        Severity["Assign Severity Level (Low, Medium, High, Critical)"]

        CodeAnal --> Facts
        DepAnal --> Facts
        SecAnal --> Facts
        APIAnal --> Facts
        DockerAnal --> Facts
        CICDAnal --> Facts

        Facts --> Score
        Score --> Severity
    end

    subgraph AIEngine [5. Generative AI Synthesis]
        LangChain["LangChain Prompt Engine"]
        LLM["Google Gemini API / OpenAI GPT-4"]
        GenOutputs["Generate:\n• Executive Summary\n• Risk Explanation\n• Testing Advice\n• Deployment Checklist"]

        Severity --> LangChain
        LangChain --> LLM
        LLM --> GenOutputs
    end

    subgraph StorageUI [6. Storage & UI Dashboard]
        DB[("Supabase / PostgreSQL\n(Store Report & Metrics)")]
        UI["Next.js React Dashboard\n(Display Risk & AI Report)"]

        GenOutputs --> DB
        DB --> UI
    end

    style Trigger fill:#1e1b4b,stroke:#6366f1,color:#ffffff
    style Ingestion fill:#0f172a,stroke:#38bdf8,color:#ffffff
    style Analyzers fill:#064e3b,stroke:#34d399,color:#ffffff
    style RiskCalc fill:#451a03,stroke:#fbbf24,color:#ffffff
    style AIEngine fill:#311042,stroke:#c084fc,color:#ffffff
    style StorageUI fill:#1e293b,stroke:#94a3b8,color:#ffffff
```

---

## 3. Pull Request Webhook Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    participant Dev as Developer
    participant GH as GitHub REST / Webhook
    participant API as FastAPI Backend
    participant Engine as Static Analyzers
    participant Risk as Risk Calculator
    participant AI as Generative AI (LangChain)
    participant DB as Supabase Database
    participant Web as Next.js Dashboard

    Dev->>GH: Push commit or open Pull Request
    GH->>API: POST /api/github/webhooks (PR event payload)
    API->>GH: GET /repos/{owner}/{repo}/pulls/{number}/files
    GH-->>API: Return changed files diff
    API->>Engine: Run static code, sec, api, docker & ci checks
    Engine-->>Risk: Return structured vulnerability JSON
    Risk->>Risk: Calculate Risk Score (e.g., 84% - High Severity)
    Risk->>AI: Send factual metrics to LLM Prompt Engine
    AI->>AI: Generate Executive Summary & Release Checklist
    AI-->>API: Return generated AI report JSON
    API->>DB: INSERT INTO analyses & INSERT INTO reports
    API-->>Web: Notify client / Update Dashboard State
    Web-->>Dev: View Deployment Readiness & AI Insights
```

---

## 4. Database Entity-Relationship (ER) Diagram

```mermaid
erDiagram
    USERS ||--o{ PROJECTS : "creates"
    USERS ||--o{ INTEGRATIONS : "connects"
    PROJECTS ||--|| REPOSITORIES : "linked to"
    PROJECTS ||--o{ ANALYSES : "triggers"
    ANALYSES ||--|| REPORTS : "generates"

    USERS {
        int id PK
        string email
        string username
        string github_id
    }

    PROJECTS {
        int id PK
        string name
        int repository_id FK
        int user_id FK
        string default_branch
    }

    REPOSITORIES {
        int id PK
        string name
        string owner
        string full_name
        string language
    }

    ANALYSES {
        int id PK
        int project_id FK
        string commit_sha
        int pull_request_number
        int risk_score
        string severity
    }

    REPORTS {
        int id PK
        int analysis_id FK
        text executive_summary
        jsonb findings_json
        jsonb deployment_checklist
    }

    INTEGRATIONS {
        int id PK
        int user_id FK
        string provider
        string access_token
    }
```
