# FastAPI Backend Dockerfile
FROM python:3.12-slim

WORKDIR /app

# Prevent Python from writing bytecode & enable UTF-8 mode
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PYTHONUTF8=1

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements & install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY . .

# Expose port (default 8000, overridable by Render/AWS App Runner PORT env)
ENV PORT=8000
EXPOSE 8000

# Start server using uvicorn with dynamic PORT support
CMD ["sh", "-c", "python -m uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]

