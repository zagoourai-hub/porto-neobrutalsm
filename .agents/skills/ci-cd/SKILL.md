---
name: ci-cd
description: Generate CI/CD pipeline GitHub Actions untuk lint, typecheck, test, build, dan deploy ke Coolify. Gunakan saat diminta setup CI/CD, GitHub Actions workflow, automated testing pipeline, atau deployment otomatis. Auto-jalan saat diminta setup pipeline untuk project yang sudah punya struktur frontend/backend.
allowed-tools: Read Write Bash(npx *) Bash(npm *) Bash(find *) Bash(cat *)
argument-hint: "setup | frontend | backend | full  target: all | nama-service"
---

# CI/CD Skill — GitHub Actions + Coolify

Generate pipeline CI/CD: lint → typecheck → test → build → deploy. Terintegrasi dengan stack standar (Vitest, Playwright, Prisma migrate) dan deploy ke Coolify via webhook.

## Tech Stack

- **CI:** GitHub Actions
- **Deploy target:** Coolify (webhook trigger)
- **Test runner:** Vitest (unit + e2e backend), Playwright (E2E frontend)
- **Cache:** `actions/cache` untuk `node_modules`/`.next`/Playwright browser

## Alur Pipeline Standar

```
push/PR → lint → typecheck → unit test → build → (main only) → deploy Coolify
                                              └── e2e test (opsional, paralel)
```

## Mode: `setup` — Workflow Dasar (Lint + Typecheck + Test + Build)

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  frontend:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./frontend
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
          cache-dependency-path: frontend/package-lock.json

      - name: Install
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Typecheck
        run: npm run typecheck

      - name: Build
        run: npm run build

  backend:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./backend
    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: test_db
        ports: ["5432:5432"]
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
          cache-dependency-path: backend/package-lock.json

      - name: Install
        run: npm ci

      - name: Prisma Generate
        run: npx prisma generate

      - name: Prisma Migrate (test DB)
        run: npx prisma migrate deploy
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/test_db

      - name: Lint
        run: npm run lint

      - name: Typecheck
        run: npm run typecheck

      - name: Unit Test
        run: npm run test

      - name: Build
        run: npm run build
```

> Sesuaikan nama script (`lint`, `typecheck`, `test`, `build`) dengan yang ada di `package.json` masing-masing service — cek dulu sebelum generate, jangan asumsi nama script.

## Mode: `full` — Tambah E2E Test (Playwright)

```yaml
# job tambahan di ci.yml, jalan setelah backend & frontend build sukses
  e2e:
    runs-on: ubuntu-latest
    needs: [frontend, backend]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22

      - name: Install root deps
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium

      - name: Start services
        run: docker compose -f docker/docker-compose.yml up -d --build

      - name: Wait for services
        run: npx wait-on http://localhost:3000 http://localhost:3001/api/health

      - name: Run E2E
        run: npm run test:e2e

      - name: Upload report on failure
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 7

      - name: Teardown
        if: always()
        run: docker compose -f docker/docker-compose.yml down -v
```

## Mode: `full` — Deploy ke Coolify (main branch only)

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    uses: ./.github/workflows/ci.yml   # reuse CI, deploy hanya jalan kalau CI hijau

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Coolify Deploy
        run: |
          curl -X GET "${{ secrets.COOLIFY_WEBHOOK_URL }}" \
            -H "Authorization: Bearer ${{ secrets.COOLIFY_API_TOKEN }}" \
            --fail
```

> `COOLIFY_WEBHOOK_URL` dan `COOLIFY_API_TOKEN` disimpan di GitHub Secrets (Settings → Secrets and variables → Actions), TIDAK PERNAH hardcode di workflow file.

## Mode: `setup` — Prisma Migration Guard (opsional, untuk project dengan schema aktif berubah)

```yaml
# job tambahan: cegah migration drift ke production
  migration-check:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./backend
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci
      - name: Check migration drift
        run: npx prisma migrate diff --from-migrations ./prisma/migrations --to-schema-datamodel ./prisma/schema.prisma --exit-code
```

## Optimasi Cache

```yaml
      - name: Cache Playwright browsers
        uses: actions/cache@v4
        with:
          path: ~/.cache/ms-playwright
          key: playwright-${{ runner.os }}-${{ hashFiles('**/package-lock.json') }}
```

Node modules sudah otomatis di-cache lewat `actions/setup-node@v4` dengan opsi `cache: npm` — tidak perlu setup manual terpisah.

## Struktur File yang Dihasilkan

```
.github/
└── workflows/
    ├── ci.yml         # lint + typecheck + test + build (tiap push/PR)
    └── deploy.yml      # deploy ke Coolify (main branch, setelah CI hijau)
```

## Larangan

- JANGAN hardcode secret/token/webhook URL di file YAML — selalu GitHub Secrets.
- JANGAN deploy tanpa CI hijau dulu (`needs: test` wajib ada di job deploy).
- JANGAN asumsi nama script `package.json` — cek dulu isi `scripts` sebelum generate workflow.
- JANGAN jalankan migration `prisma migrate deploy` ke database production dari workflow CI biasa — pisahkan job migration production dengan approval manual kalau perlu.
- JANGAN skip service `postgres`/`redis` di job yang butuh database — test tanpa DB nyata sering menyembunyikan bug integrasi.

## Task

$ARGUMENTS
