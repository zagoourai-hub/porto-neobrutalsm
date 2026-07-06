---
name: docker
description: Generate dan setup Docker configuration. Gunakan saat diminta membuat Dockerfile, docker-compose, setup Coolify, konfigurasi container, environment docker, atau troubleshoot masalah Docker.
allowed-tools: Read Write Bash(docker *) Bash(find *) Bash(cat *)
argument-hint: "setup | coolify | compose | dockerfile | env  target: frontend | backend | ai-service | all"
---

# Docker Skill — Full Stack Container Setup

## Folder Structure Standard

```
docker/
├── frontend/
│   └── Dockerfile
├── backend/
│   └── Dockerfile
├── ai-service/
│   └── Dockerfile
└── docker-compose.yml

# Root level
.env
.env.example
.dockerignore
```

---

## Mode: `setup` — Full Docker Setup

Generate semua file Docker untuk project dari nol.

### docker-compose.yml

```yaml
# docker/docker-compose.yml
# Catatan: atribut `version` SUDAH OBSOLETE di Compose v2 — sengaja tidak ditulis.

services:
  postgres:
    image: postgres:16-alpine
    container_name: ${PROJECT_NAME}-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "${POSTGRES_PORT:-5432}:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - app_network

  redis:
    image: redis:7-alpine
    container_name: ${PROJECT_NAME}-redis
    restart: unless-stopped
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "--no-auth-warning", "-a", "${REDIS_PASSWORD}", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - app_network

  backend:
    build:
      context: ../backend
      dockerfile: ../docker/backend/Dockerfile
    container_name: ${PROJECT_NAME}-backend
    restart: unless-stopped
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
      REDIS_URL: redis://:${REDIS_PASSWORD}@redis:6379
      JWT_SECRET: ${JWT_SECRET}
      FRONTEND_URL: ${FRONTEND_URL}
    ports:
      - "${BACKEND_PORT:-3001}:3001"
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3001/api/health"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 20s
    networks:
      - app_network

  ai-service:
    build:
      context: ../ai-service
      dockerfile: ../docker/ai-service/Dockerfile
    container_name: ${PROJECT_NAME}-ai-service
    restart: unless-stopped
    environment:
      REDIS_URL: redis://:${REDIS_PASSWORD}@redis:6379
      ENCRYPTION_KEY: ${ENCRYPTION_KEY}
      HASH_PEPPER: ${HASH_PEPPER}
      GEMINI_API_KEY: ${GEMINI_API_KEY}
      OPENROUTER_API_KEY: ${OPENROUTER_API_KEY}
    ports:
      - "${AI_SERVICE_PORT:-8000}:8000"
    depends_on:
      redis:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "python", "-c", "import urllib.request; urllib.request.urlopen('http://localhost:8000/api/v1/health')"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 15s
    networks:
      - app_network

  frontend:
    build:
      context: ../frontend
      dockerfile: ../docker/frontend/Dockerfile
      args:
        NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL}
    container_name: ${PROJECT_NAME}-frontend
    restart: unless-stopped
    environment:
      NODE_ENV: production
    ports:
      - "${FRONTEND_PORT:-3000}:3000"
    depends_on:
      backend:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3000"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 20s
    networks:
      - app_network

volumes:
  postgres_data:
  redis_data:

networks:
  app_network:
    driver: bridge
```

### Dockerfile Frontend (Next.js 16, standalone)

```dockerfile
# docker/frontend/Dockerfile
FROM node:22-alpine AS base

# Dependencies — install SEMUA deps (devDeps dibutuhkan untuk build Next.js)
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# Runner — image minimal, hanya output standalone
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

> **next.config.ts WAJIB:** `output: "standalone"`.
> Catatan bug lama: JANGAN pakai `npm ci --only=production` di stage deps frontend — build Next.js butuh devDependencies (typescript, tailwind, @types). Stage runner sudah ramping karena hanya menyalin output `standalone`.

### Dockerfile Backend (NestJS + Prisma 7)

```dockerfile
# docker/backend/Dockerfile
FROM node:22-alpine AS base

# Dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate   # generate client ke ../generated/prisma
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
RUN apk add --no-cache openssl

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY package.json ./

USER nestjs

EXPOSE 3001

CMD ["node", "dist/main.js"]
```

> Migration dijalankan terpisah saat deploy (lihat mode `coolify`), bukan di dalam image.

### Dockerfile AI Service (FastAPI)

```dockerfile
# docker/ai-service/Dockerfile
FROM python:3.12-slim AS base
WORKDIR /app

# Dependencies
FROM base AS deps
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip \
  && pip install --no-cache-dir -r requirements.txt

# Runner
FROM base AS runner
WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN addgroup --system --gid 1001 appgroup
RUN adduser --system --uid 1001 --ingroup appgroup appuser

COPY --from=deps /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=deps /usr/local/bin /usr/local/bin
COPY --chown=appuser:appgroup . .

USER appuser

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]
```

### .dockerignore

```
# Root .dockerignore
node_modules
.next
.git
.env*
!.env.example
dist
generated
__pycache__
*.pyc
.pytest_cache
coverage
.nyc_output
*.log
README.md
```

---

## Mode: `env` — Environment Config

### .env.example

```env
# Project
PROJECT_NAME=myapp

# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=changeme_strong_password
POSTGRES_DB=myapp_db
POSTGRES_PORT=5432
DATABASE_URL=postgresql://postgres:changeme_strong_password@localhost:5432/myapp_db

# Redis
REDIS_PASSWORD=changeme_redis_password
REDIS_PORT=6379
REDIS_URL=redis://:changeme_redis_password@localhost:6379

# Backend
BACKEND_PORT=3001
JWT_SECRET=changeme_jwt_secret_min_32_chars
FRONTEND_URL=http://localhost:3000

# Frontend
FRONTEND_PORT=3000
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# AI Service (AES-256-GCM)
AI_SERVICE_PORT=8000
ENCRYPTION_KEY=changeme_32byte_base64url_key
HASH_PEPPER=changeme_random_pepper_string
GEMINI_API_KEY=your_gemini_api_key
OPENROUTER_API_KEY=your_openrouter_api_key
OPENAI_API_KEY=your_openai_api_key
GROQ_API_KEY=your_groq_api_key
```

> Generate `ENCRYPTION_KEY` (32 byte / 256-bit, base64url):
> ```bash
> python3 -c "import os,base64; print(base64.urlsafe_b64encode(os.urandom(32)).decode())"
> ```

---

## Mode: `coolify` — Coolify Deployment

### Checklist Deploy ke Coolify

```
[ ] Semua Dockerfile sudah ada di docker/ folder
[ ] docker-compose.yml valid (test local: docker compose config)
[ ] .env diisi lengkap di Coolify environment (termasuk ENCRYPTION_KEY, HASH_PEPPER)
[ ] next.config.ts punya output: "standalone"
[ ] Health check endpoint ada: backend GET /api/health, ai-service GET /api/v1/health
[ ] Domain di-point ke server Coolify
[ ] SSL/HTTPS aktif di Coolify
[ ] Prisma migrate dijalankan sebelum/saat deploy (release command)
```

### Health Check Endpoint (Backend)

```typescript
// backend: src/modules/health/health.controller.ts
import { Controller, Get } from "@nestjs/common";

@Controller("health")
export class HealthController {
  @Get()
  check() {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
```

### Prisma Migration (jalankan saat release)

```bash
docker compose exec backend npx prisma migrate deploy
docker compose exec backend npx prisma db seed   # jika perlu
```

---

## Useful Commands

```bash
# Development
docker compose up -d
docker compose down
docker compose down -v                  # stop + hapus volume
docker compose logs -f backend
docker compose exec backend sh
docker compose config                   # validasi compose file

# Build ulang
docker compose up -d --build backend
docker compose up -d --build frontend
docker compose up -d --build ai-service

# Prisma
docker compose exec backend npx prisma migrate deploy
docker compose exec backend npx prisma studio

# Database
docker compose exec postgres psql -U postgres -d myapp_db
```

## Task

$ARGUMENTS
