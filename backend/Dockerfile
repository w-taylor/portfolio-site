FROM python:3.12-slim AS base
ENV PYTHONUNBUFFERED=1
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

# Production
FROM base AS production
CMD ["sh", "-c", "exec uvicorn app.main:app --host 0.0.0.0 --port ${BACKEND_PORT:-3000}"]

# Development (hot reload)
FROM base AS development
CMD ["sh", "-c", "exec uvicorn app.main:app --host 0.0.0.0 --port ${BACKEND_PORT:-3000} --reload"]
