-- =============================================================
-- ImpactIQ Database Schema (Supabase / PostgreSQL)
-- =============================================================

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255),
    github_id VARCHAR(100),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Repositories Table
CREATE TABLE IF NOT EXISTS repositories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    owner VARCHAR(255) NOT NULL,
    full_name VARCHAR(500) NOT NULL,
    is_private BOOLEAN DEFAULT FALSE,
    default_branch VARCHAR(100) DEFAULT 'main',
    language VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    repository_id INT REFERENCES repositories(id) ON DELETE SET NULL,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    default_branch VARCHAR(100) DEFAULT 'main',
    security_analysis_enabled BOOLEAN DEFAULT TRUE,
    dependency_analysis_enabled BOOLEAN DEFAULT TRUE,
    api_analysis_enabled BOOLEAN DEFAULT TRUE,
    docker_analysis_enabled BOOLEAN DEFAULT TRUE,
    cicd_analysis_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Analyses Table
CREATE TABLE IF NOT EXISTS analyses (
    id SERIAL PRIMARY KEY,
    project_id INT REFERENCES projects(id) ON DELETE CASCADE,
    commit_sha VARCHAR(100),
    branch VARCHAR(100),
    pull_request_number INT,
    status VARCHAR(50) DEFAULT 'pending', -- pending, running, completed, failed
    risk_score INT DEFAULT 0,              -- 0 - 100
    severity VARCHAR(50) DEFAULT 'Low',   -- Low, Medium, High, Critical
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- 5. Reports Table
CREATE TABLE IF NOT EXISTS reports (
    id SERIAL PRIMARY KEY,
    analysis_id INT REFERENCES analyses(id) ON DELETE CASCADE,
    executive_summary TEXT,
    risk_explanation TEXT,
    code_findings JSONB DEFAULT '[]'::jsonb,
    dependency_findings JSONB DEFAULT '[]'::jsonb,
    security_findings JSONB DEFAULT '[]'::jsonb,
    api_findings JSONB DEFAULT '[]'::jsonb,
    docker_findings JSONB DEFAULT '[]'::jsonb,
    cicd_findings JSONB DEFAULT '[]'::jsonb,
    recommendations JSONB DEFAULT '[]'::jsonb,
    deployment_checklist JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Integrations Table
CREATE TABLE IF NOT EXISTS integrations (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(100) NOT NULL, -- e.g., 'github'
    access_token TEXT NOT NULL,
    webhook_secret TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
