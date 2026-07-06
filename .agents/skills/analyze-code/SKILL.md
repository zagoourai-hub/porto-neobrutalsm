---
name: analyze-code
description: Analisis menyeluruh seluruh codebase. Gunakan saat diminta review kode, cari tech debt, dead code, duplikasi, masalah performa, N+1 query, re-render berlebih, atau audit kualitas kode secara keseluruhan.
allowed-tools: Read Write Bash(find *) Bash(grep *) Bash(cat *) Bash(wc *) Bash(npm *) Bash(npx *)
argument-hint: "review | debt | perf | all  target: frontend | backend | ai-service | all"
---

# Code Analysis Skill — Full Stack

## Mode Analisis

| Argumen | Mode | Keterangan |
|---------|------|-----------|
| `review` | Code Review | Kualitas, naming, clean code, best practice |
| `debt` | Tech Debt & Dead Code | Unused, duplikasi, TODOs, complexity |
| `perf` | Performa | N+1, bundle size, re-render, bottleneck |
| `all` | Semua Mode | Jalankan ketiganya, simpan ke `code-analysis-report.md` |

Target layer: `frontend`, `backend`, `ai-service`, atau `all`

Contoh: `all all` → analisis semua mode, semua layer

---

## Langkah Awal — Scan Struktur Project

Sebelum analisis, selalu scan struktur terlebih dahulu:

```bash
# Struktur folder
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.py" \) \
  | grep -v node_modules \
  | grep -v .next \
  | grep -v generated \
  | grep -v dist \
  | grep -v __pycache__ \
  | sort

# Hitung total file per layer
echo "=== Frontend ===" && find frontend/src -type f -name "*.ts" -o -name "*.tsx" | grep -v node_modules | wc -l
echo "=== Backend ===" && find backend/src -type f -name "*.ts" | grep -v node_modules | wc -l
echo "=== AI Service ===" && find ai-service/app -type f -name "*.py" | wc -l
```

---

## Mode 1: Code Review

### 1.1 Frontend (Next.js / React / TypeScript)

#### Naming Convention
```
✅ Component   → PascalCase  (UserCard, LoginForm)
✅ Hook        → camelCase + use prefix (useAuth, useProducts)
✅ Service     → camelCase + Service suffix (authService, userService)
✅ Store       → camelCase + Store suffix (useAuthStore, useSidebarStore)
✅ Type/Interface → PascalCase (UserDto, ApiResponse)
✅ File        → kebab-case (login-form.tsx, user-card.tsx)
✅ Const       → SCREAMING_SNAKE_CASE untuk constants global
```

#### Clean Code Checklist
```
[ ] Tidak ada `any` tanpa alasan kuat
[ ] Tidak ada console.log yang tertinggal
[ ] Tidak ada hardcoded string (URL, warna, ukuran)
[ ] Tidak ada magic number tanpa named constant
[ ] Component tidak lebih dari 200 baris
[ ] Function tidak lebih dari 50 baris
[ ] Tidak ada nested ternary lebih dari 2 level
[ ] Tidak ada useEffect untuk data fetching (harus TanStack Query)
[ ] Tidak ada fetch/axios langsung di component (harus via service)
[ ] Tidak ada server state di Zustand (hanya UI state)
[ ] Semua form pakai React Hook Form + Zod
[ ] Semua error state ditangani (loading, error, empty state)
```

#### Scan Otomatis
```bash
# Cari penggunaan `any`
grep -rn ": any" frontend/src --include="*.ts" --include="*.tsx"

# Cari console.log
grep -rn "console\." frontend/src --include="*.ts" --include="*.tsx"

# Cari hardcoded URL
grep -rn "http://\|https://" frontend/src --include="*.ts" --include="*.tsx" | grep -v ".env\|comment\|placeholder"

# Cari magic number
grep -rn "[^a-zA-Z_][0-9]\{3,\}[^a-zA-Z_]" frontend/src --include="*.ts" --include="*.tsx"

# Cari fetch langsung di component
grep -rn "fetch(\|axios\." frontend/src/app --include="*.tsx"

# Cari useEffect dengan fetch
grep -rn "useEffect" frontend/src --include="*.tsx" -A 5 | grep -A 5 "fetch\|axios"
```

### 1.2 Backend (NestJS / TypeScript)

#### Architecture Checklist
```
[ ] Business logic di Service, bukan Controller
[ ] Controller hanya terima request, delegasi ke Service
[ ] Semua input via DTO + class-validator
[ ] Tidak ada Prisma query langsung di Controller
[ ] Tidak ada password/sensitive field di response (pakai select/omit)
[ ] Semua endpoint protected kecuali yang explicit @Public()
[ ] Error handling pakai NestJS built-in exceptions
[ ] Tidak ada try/catch kosong (swallowing errors)
[ ] ConfigModule untuk semua env variable
[ ] Tidak ada hardcoded credentials
```

#### Scan Otomatis
```bash
# Cari `any`
grep -rn ": any" backend/src --include="*.ts"

# Cari query Prisma di Controller
grep -rn "this\.prisma\." backend/src --include="*.controller.ts"

# Cari password di select (harusnya tidak ada)
grep -rn "password" backend/src --include="*.ts" | grep "select\|return\|res\."

# Cari hardcoded credentials
grep -rn "password\s*=\s*['\"]" backend/src --include="*.ts"

# Cari console.log
grep -rn "console\." backend/src --include="*.ts"

# Cari endpoint tanpa guard
grep -rn "@Get\|@Post\|@Put\|@Patch\|@Delete" backend/src --include="*.controller.ts" -B 2 | grep -v "Guard\|Public\|@"
```

### 1.3 AI Service (FastAPI / Python)

#### Architecture Checklist
```
[ ] Semua input via Pydantic schema
[ ] Tidak ada API key di log/response
[ ] Provider factory dipakai (tidak instantiate provider langsung)
[ ] Error handling ada di semua endpoint
[ ] Tidak ada business logic di endpoint (harus di service)
[ ] Prompt injection protection aktif
[ ] Rate limiting aktif
[ ] Tidak ada hardcoded model/provider name di endpoint
```

#### Scan Otomatis
```bash
# Cari API key exposure
grep -rn "api_key\|API_KEY" ai-service/app --include="*.py" | grep -v "os.getenv\|environ\|config\|encrypt\|hash"

# Cari hardcoded model
grep -rn "gpt-4\|gemini-pro\|claude-" ai-service/app --include="*.py" | grep -v "config\|default\|comment"

# Cari bare except
grep -rn "except:" ai-service/app --include="*.py"

# Cari print() yang tertinggal
grep -rn "^    print(\|^print(" ai-service/app --include="*.py"

# Cari logic di endpoint langsung
grep -rn "^async def \|^def " ai-service/app/api --include="*.py"
```

### Output Format Mode Review

```markdown
## Code Review Report — [Layer]

### 🔴 Critical (harus difix sebelum production)
| # | File | Baris | Issue | Saran |
|---|------|-------|-------|-------|
| 1 | `src/app/dashboard/page.tsx` | 45 | Fetch langsung di component | Pindah ke service + TanStack Query |

### 🟡 Warning (sebaiknya difix)
| # | File | Baris | Issue | Saran |
|---|------|-------|-------|-------|

### 🔵 Info (nice to have)
| # | File | Baris | Issue | Saran |
|---|------|-------|-------|-------|

### 📊 Skor Code Quality — [Layer]
- Naming Convention: X/10
- Clean Code: X/10
- Architecture: X/10
- **Total: X/30**
```

---

## Mode 2: Tech Debt & Dead Code

### 2.1 Unused Imports & Variables
```bash
# Frontend — unused imports (via TypeScript compiler)
cd frontend && npx tsc --noEmit 2>&1 | grep "is declared but"

# Cari import yang tidak dipakai (pattern)
grep -rn "^import" frontend/src --include="*.ts" --include="*.tsx" | grep -v "from '@\|from \"@\|from './"

# Backend
cd backend && npx tsc --noEmit 2>&1 | grep "is declared but"

# AI Service — unused imports
grep -rn "^import\|^from" ai-service/app --include="*.py" | head -50
```

### 2.2 Dead Code
```bash
# Fungsi yang tidak pernah dipanggil
grep -rn "export function\|export const\|export default" frontend/src --include="*.ts" --include="*.tsx" \
  | sed 's/.*export //' | awk '{print $2}' \
  | while read fn; do
      count=$(grep -rn "$fn" frontend/src --include="*.ts" --include="*.tsx" | wc -l)
      [ "$count" -le 1 ] && echo "Potentially unused: $fn"
    done

# File yang tidak di-import manapun
find frontend/src/components -name "*.tsx" | while read f; do
  name=$(basename $f .tsx)
  count=$(grep -rn "$name" frontend/src --include="*.ts" --include="*.tsx" | wc -l)
  [ "$count" -le 1 ] && echo "Potentially unused component: $f"
done
```

### 2.3 Duplikasi Kode
```bash
# Cari pola yang mirip (fungsi dengan nama berbeda tapi logic sama)
# Manual review — cari file dengan ukuran dan struktur serupa
find frontend/src backend/src -name "*.ts" -o -name "*.tsx" \
  | xargs wc -l | sort -n | grep -v total

# Cari TODO/FIXME/HACK yang tertinggal
grep -rn "TODO\|FIXME\|HACK\|XXX\|TEMP\|temp\|temporary" \
  frontend/src backend/src ai-service/app \
  --include="*.ts" --include="*.tsx" --include="*.py"
```

### 2.4 Complexity Analysis
```bash
# File terpanjang (kandidat refactor)
find frontend/src backend/src ai-service/app \
  -name "*.ts" -o -name "*.tsx" -o -name "*.py" \
  | grep -v node_modules \
  | xargs wc -l 2>/dev/null \
  | sort -rn | head -20
```

### Output Format Mode Debt

```markdown
## Tech Debt Report

### 🔴 Dead Code
| File | Item | Tipe | Action |
|------|------|------|--------|
| `components/OldCard.tsx` | `OldCard` | Component | Hapus |

### 🟡 TODO/FIXME Tertinggal
| File | Baris | Pesan |
|------|-------|-------|

### 🟠 Duplikasi Kode
| File A | File B | Duplikasi | Saran |
|--------|--------|-----------|-------|

### 🔵 Kompleksitas Tinggi (kandidat refactor)
| File | Baris | Masalah |
|------|-------|---------|

### 📊 Debt Score
- Dead Code: X item
- TODO tertinggal: X item
- File > 200 baris: X file
- **Estimasi waktu cleanup: X jam**
```

---

## Mode 3: Performa

### 3.1 Frontend Performance
```bash
# Cari re-render berlebih
grep -rn "useState\|useEffect" frontend/src --include="*.tsx" -l \
  | while read f; do
      count=$(grep -c "useState\|useEffect" "$f")
      [ "$count" -gt 5 ] && echo "Heavy hooks ($count): $f"
    done

# Cari komponen yang tidak di-memo padahal menerima props kompleks
grep -rn "export default function\|export function\|export const" \
  frontend/src/components --include="*.tsx" | grep -v "memo\|useMemo\|useCallback"

# Cari inline object/array di JSX (menyebabkan re-render)
grep -rn "={{" frontend/src --include="*.tsx" | grep -v "style=\|className="

# Cari image tanpa next/image
grep -rn "<img " frontend/src --include="*.tsx"

# Cari missing key di list render
grep -rn "\.map(" frontend/src --include="*.tsx" -A 2 | grep -v "key="
```

### 3.2 Backend Performance (N+1 Query)
```bash
# Cari query Prisma di dalam loop
grep -rn "for\|forEach\|map\|Promise\.all" backend/src --include="*.ts" -A 5 \
  | grep -B 3 "this\.prisma\."

# Cari query tanpa select (ambil semua field)
grep -rn "this\.prisma\." backend/src --include="*.ts" \
  | grep -v "select:\|include:\|where:\|orderBy:\|take:\|skip:"

# Cari findMany tanpa pagination
grep -rn "\.findMany(" backend/src --include="*.ts" \
  | grep -v "take:\|skip:\|cursor:"

# Cari query nested tanpa include (N+1 candidate)
grep -rn "\.findMany\|\.findFirst\|\.findUnique" backend/src --include="*.service.ts"
```

### 3.3 AI Service Performance
```bash
# Cari request tanpa timeout
grep -rn "httpx\|requests\|aiohttp" ai-service/app --include="*.py" \
  | grep -v "timeout"

# Cari response yang tidak di-cache
grep -rn "async def generate\|async def chat\|async def analyze" \
  ai-service/app --include="*.py" -A 10 | grep -v "cache\|redis"

# Cari stream yang tidak dipakai (blocking large response)
grep -rn "await.*generate\|await.*complete" ai-service/app --include="*.py" \
  | grep -v "stream"
```

### Output Format Mode Perf

```markdown
## Performance Report

### 🔴 Critical Performance Issues
| Layer | File | Issue | Impact | Fix |
|-------|------|-------|--------|-----|
| BE | `user.service.ts` | N+1 query di findAll | High | Tambah `include` atau batch query |

### 🟡 Re-render Issues (Frontend)
| File | Issue | Fix |
|------|-------|-----|
| `Dashboard.tsx` | Inline object di props | Pindah ke useMemo |

### 🟠 Missing Optimization
| Layer | File | Issue | Fix |
|-------|------|-------|-----|
| FE | `ProductList.tsx` | `<img>` bukan `<Image>` | Ganti dengan next/image |
| BE | `product.service.ts` | findMany tanpa pagination | Tambah take/skip |
| AI | `chat_service.py` | Response tidak di-cache | Tambah Redis cache |

### 📊 Performance Score
- Frontend Re-render Risk: X/10
- Backend Query Efficiency: X/10
- AI Service Optimization: X/10
- **Total: X/30**
```

---

## Mode: All

Jalankan semua mode untuk semua layer yang ditentukan, lalu:

1. Gabungkan semua output
2. Buat **Executive Summary** di bagian atas:

```markdown
## Executive Summary — Code Analysis

| Mode | Score | Issues Ditemukan |
|------|-------|-----------------|
| Code Review | X/30 | X critical, X warning |
| Tech Debt | - | X dead code, X TODO |
| Performance | X/30 | X critical, X warning |

### Top 5 Priority Fix
1. [CRITICAL] ...
2. [CRITICAL] ...
3. [WARNING] ...
4. [WARNING] ...
5. [INFO] ...
```

3. Simpan ke `code-analysis-report.md` di root project

---

## Larangan

- JANGAN modifikasi kode saat mode analisis — hanya baca dan laporkan
- JANGAN skip layer yang diminta meski foldernya kosong — laporkan "belum ada implementasi"
- JANGAN hanya list masalah tanpa saran fix yang konkret
- JANGAN buat laporan lebih dari yang diminta argumen

## Task

$ARGUMENTS
