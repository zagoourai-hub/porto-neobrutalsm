---
name: security-scan
description: Deteksi celah keamanan & potensi kebocoran data sebelum production. Gunakan saat diminta scan keamanan, audit pre-production, cari secret/API key bocor, deteksi data sensitif bocor ke response/log, cek dependency vulnerable (CVE), atau temukan endpoint tanpa auth. Mode default scan + lapor + auto-fix.
allowed-tools: Read Write Bash(grep *) Bash(rg *) Bash(find *) Bash(npm *) Bash(npx *) Bash(pip *) Bash(git *) Bash(cat *) Bash(jq *)
disable-model-invocation: true
argument-hint: "scan | fix | report  target: frontend | backend | ai-service | docker | all"
---

# Security Leak Scanner — Pre-Production Hardening

Skill audit keamanan menyeluruh untuk project web menjelang production. Deteksi 4 kelas kerentanan utama lintas semua layer, beri severity, lalu **auto-fix** yang aman.

> Manual-only (`disable-model-invocation: true`). Skill ini punya akses scan & ubah file — jalankan hanya saat diminta eksplisit.

## Alur Kerja

```
1. SCAN     → grep/rg pattern di seluruh codebase + audit dependency
2. TRIAGE   → klasifikasi temuan: severity + confidence + lokasi
3. REPORT   → tabel temuan (file:line, severity, fix yang disarankan)
4. AUTO-FIX → terapkan perbaikan aman; yang berisiko → tampilkan + minta konfirmasi
5. VERIFY   → re-scan untuk pastikan temuan tertutup
```

Aturan auto-fix:
- **Aman → langsung fix** (mis. pindah secret ke `.env`, tambah `.gitignore`, redact log).
- **Berisiko/ambigu → JANGAN auto-apply.** Tampilkan diff + alasan, minta konfirmasi bigboss (mis. menambah auth guard yang bisa memutus alur, hapus field dari response).
- Setiap fix: jelaskan APA + KENAPA dalam 1 baris.
- Jangan pernah commit otomatis. Biar bigboss yang commit.

---

## FOKUS 1 — Secret / API Key Bocor di Kode

### Pattern scan

```bash
# Cari hardcoded secret di seluruh source (kecuali node_modules, .git, build)
rg -n --no-heading -i \
  -e 'api[_-]?key\s*[:=]\s*["'\''][A-Za-z0-9_\-]{16,}' \
  -e 'secret\s*[:=]\s*["'\''][^"'\'' ]{8,}' \
  -e 'password\s*[:=]\s*["'\''][^"'\'' ]{6,}' \
  -e 'token\s*[:=]\s*["'\''][A-Za-z0-9_\-\.]{20,}' \
  -e 'bearer\s+[A-Za-z0-9_\-\.]{20,}' \
  --glob '!node_modules' --glob '!.git' --glob '!dist' --glob '!.next' --glob '!generated'

# Format spesifik provider (high-confidence — hampir pasti secret asli)
rg -n --no-heading \
  -e 'sk-[A-Za-z0-9]{20,}' \                  # OpenAI
  -e 'sk-or-v1-[A-Za-z0-9]{32,}' \            # OpenRouter
  -e 'AIza[0-9A-Za-z_\-]{35}' \               # Google/Gemini
  -e 'gsk_[A-Za-z0-9]{20,}' \                 # Groq
  -e 'ghp_[A-Za-z0-9]{36}' \                  # GitHub PAT
  -e 'xox[baprs]-[A-Za-z0-9\-]{10,}' \        # Slack
  -e 'AKIA[0-9A-Z]{16}' \                     # AWS Access Key
  -e '-----BEGIN [A-Z ]*PRIVATE KEY-----' \   # Private key
  --glob '!node_modules' --glob '!.git'

# .env yang ter-commit ke git (CRITICAL)
git ls-files | rg -n '\.env$|\.env\.(local|production|development)$'

# Secret di git history (pernah commit lalu dihapus — masih bisa diakses)
git log --all --full-history -p -- '*.env' 2>/dev/null | rg -i 'key|secret|password|token' | head
```

### Yang dicek tambahan
- `NEXT_PUBLIC_` prefix dipakai untuk secret (frontend → terekspos ke browser). WAJIB flag.
- Secret di komentar kode, file contoh (`config.example.ts`) berisi nilai asli (bukan placeholder).
- Connection string lengkap (`postgresql://user:pass@host`) hardcoded.

### Auto-fix
- Pindahkan secret → `.env`, ganti di kode dengan `process.env.X` / `os.environ["X"]`.
- Tambah entri ke `.env.example` (placeholder, bukan nilai asli).
- Pastikan `.env*` ada di `.gitignore` (tambah kalau belum):
  ```
  .env
  .env.local
  .env.*.local
  ```
- Kalau `.env` sudah ter-commit: instruksikan `git rm --cached .env` + peringatkan **rotate semua key** (yang sudah masuk history dianggap bocor permanen).
- Kalau secret pakai `NEXT_PUBLIC_`: pindah ke server-only env + akses via API route/server action, bukan client.

---

## FOKUS 2 — Data Sensitif Bocor ke Response / Log

### Pattern scan

```bash
# Backend (NestJS/Prisma) — return user object tanpa select/omit (bisa bawa password/hash)
rg -n --no-heading \
  -e 'findUnique\(|findFirst\(|findMany\(' \
  --glob '!node_modules' backend/ \
  | rg -v 'select|omit'   # query tanpa select/omit = suspect bocor field

# Field sensitif yang muncul di DTO response / serializer
rg -n --no-heading -i \
  -e 'password|passwordHash|hashedPassword|salt|refreshToken|resetToken|mfaSecret|ssn|creditCard|cvv' \
  --glob '!node_modules' --glob '!*.spec.ts' --glob '!*.test.ts'

# Log yang membocorkan data sensitif
rg -n --no-heading -i \
  -e 'console\.(log|error|warn|debug)\(.*(password|token|secret|apikey|api_key|authorization|cookie)' \
  -e '(logger|log)\.(info|error|warn|debug)\(.*(password|token|secret|apikey|authorization)' \
  -e 'print\(.*(password|token|secret|api_key)' \
  --glob '!node_modules'

# Log seluruh request/body/headers (sering bawa Authorization & cookie)
rg -n --no-heading \
  -e 'console\.log\(req\)|console\.log\(request\)|log.*req\.headers|log.*req\.body' \
  --glob '!node_modules'

# Error handling yang bocorkan stack trace ke client
rg -n --no-heading \
  -e 'res\.(status|json).*err\.stack|res.*error\.stack|detail.*str\(e\)|detail=str\(exc\)' \
  --glob '!node_modules'
```

### Yang dicek tambahan
- Response API kembalikan seluruh entity Prisma (tanpa `select`/`omit`) → password hash ikut terkirim.
- NestJS: tidak pakai `ClassSerializerInterceptor` + `@Exclude()` pada field sensitif.
- AI service: API key user terkirim balik di response config.
- Stack trace / SQL error mentah dikirim ke client di mode production.
- PII (email, phone, NIK) di-log tanpa masking.

### Auto-fix
- Tambahkan `select` eksplisit (whitelist field aman) atau `omit: { password: true }` ke query Prisma.
- NestJS: tambah `@Exclude()` pada field sensitif di entity + aktifkan `ClassSerializerInterceptor` global.
- Redact log: ganti `console.log(token)` → log tanpa nilai sensitif, atau masking (`token.slice(0,4)+"***"`).
- Error handler production: kirim pesan generik ke client, log detail di server (lihat skill `ai-service`/`backend`).
- Hapus `console.log(req)` / log headers-body penuh.

---

## FOKUS 3 — Dependency Vulnerable (CVE)

### Pattern scan

```bash
# Node (frontend, backend, ai-service Node)
npm audit --audit-level=moderate --json 2>/dev/null | jq '{vulnerabilities: .metadata.vulnerabilities}'
npm audit --audit-level=high          # ringkas, fokus high/critical

# Python (ai-service FastAPI)
pip install pip-audit --quiet 2>/dev/null && pip-audit 2>/dev/null
# atau: pip-audit -r requirements.txt

# Cek package yang outdated jauh (sering = rentan)
npm outdated 2>/dev/null

# Lockfile ada? (tanpa lockfile, audit tidak akurat)
find . -maxdepth 3 -name 'package-lock.json' -o -name 'pnpm-lock.yaml' -o -name 'yarn.lock' | rg -v node_modules
```

### Yang dicek tambahan
- Tidak ada lockfile → versi dependency tidak ter-pin, audit tidak reliable.
- `package.json` pakai range longgar (`^`, `*`, `latest`) untuk package keamanan-kritis.
- Dependency abandoned (tidak update > 2 tahun) di area sensitif (auth, crypto, parsing).

### Auto-fix
- High/Critical yang punya patch non-breaking → `npm audit fix` (TANPA `--force`, agar tidak ganti major).
- Yang butuh major bump (breaking) → JANGAN auto. Tampilkan: package, versi sekarang, versi aman, CVE, dan risiko upgrade. Minta konfirmasi.
- Python: tampilkan output `pip-audit` + versi fix yang disarankan per package.
- Tambahkan lockfile kalau belum ada (`npm install` untuk generate `package-lock.json`).

---

## FOKUS 4 — Endpoint Tanpa Auth / Authorization

### Pattern scan

```bash
# NestJS — controller method tanpa guard
# Cari @Get/@Post/@Put/@Patch/@Delete yang TIDAK didahului @UseGuards / tidak di controller ber-guard
rg -n --no-heading -B3 \
  -e '@(Get|Post|Put|Patch|Delete)\(' \
  --glob '!node_modules' backend/ \
  | rg -v 'UseGuards|@Public|health'   # sisakan yang patut dicurigai

# Endpoint yang ditandai @Public (pastikan memang sengaja publik)
rg -n --no-heading -e '@Public\(\)' --glob '!node_modules' backend/

# Cek apakah ada global guard (APP_GUARD) — kalau tidak ada, semua endpoint terbuka
rg -n --no-heading -e 'APP_GUARD|ThrottlerGuard|JwtAuthGuard' --glob '!node_modules' backend/src/app.module.ts

# FastAPI — route tanpa Depends(auth)
rg -n --no-heading -B2 \
  -e '@router\.(get|post|put|patch|delete)\(' \
  --glob '!node_modules' ai-service/ \
  | rg -v 'Depends|health'

# IDOR — endpoint pakai :id tapi tidak cek ownership
rg -n --no-heading -A8 \
  -e '@(Get|Patch|Delete)\([^)]*:id' \
  --glob '!node_modules' backend/ \
  | rg -v 'userId|ownerId|currentUser|req\.user'   # tidak ada cek pemilik = potensi IDOR
```

### Yang dicek tambahan
- Tidak ada global `APP_GUARD` → endpoint default terbuka tanpa auth.
- Endpoint mutasi data (`POST/PUT/DELETE`) tanpa auth sama sekali.
- Resource per-user (`/orders/:id`) tanpa cek ownership (`resource.userId === currentUser.id`) → IDOR.
- Role check hilang di endpoint admin.
- CORS `origin: "*"` + `credentials: true` (kombinasi berbahaya).
- Rate limit tidak ada di endpoint auth (brute-force) / endpoint mahal (AI).
- Mass assignment: `@Body()` langsung ke Prisma tanpa DTO whitelist.

### Auto-fix
- Tambah `@UseGuards(JwtAuthGuard)` ke controller/endpoint yang jelas butuh auth → **konfirmasi dulu** (bisa memutus alur publik yang disengaja).
- Tambah cek ownership di service untuk endpoint `:id` (IDOR):
  ```typescript
  if (resource.userId !== currentUser.id && currentUser.role !== "ADMIN") {
    throw new ForbiddenException("Tidak punya akses ke resource ini");
  }
  ```
- Tambah global `APP_GUARD` + `ThrottlerGuard` kalau belum ada.
- Perbaiki CORS: ganti `*` dengan origin eksplisit saat `credentials: true`.
- Tambah rate limit ke endpoint auth & AI.

---

## FOKUS 5 (Bonus) — Docker / Infra Leak

```bash
# Secret hardcoded di Dockerfile / compose (bukan via env/secret)
rg -n --no-heading -i -e 'ENV .*(KEY|SECRET|PASSWORD|TOKEN)\s*=\s*\S' docker/ Dockerfile* 2>/dev/null
rg -n --no-heading -i -e '(password|secret|key):\s*["'\'']?[^$\s]' docker/docker-compose*.yml 2>/dev/null

# Port database/redis ter-expose ke publik (0.0.0.0) di production compose
rg -n --no-heading -e '"0\.0\.0\.0:(5432|6379)|^\s*-\s*"?(5432|6379):' docker/ 2>/dev/null

# Image jalan sebagai root (tidak ada USER non-root)
for f in $(find docker -name 'Dockerfile' 2>/dev/null); do rg -L -q 'USER ' "$f" && echo "ROOT: $f (tidak ada USER non-root)"; done

# .dockerignore tidak ada → .env bisa ikut ter-copy ke image
find . -maxdepth 2 -name '.dockerignore' | rg . || echo "MISSING .dockerignore (CRITICAL — .env bisa masuk image)"
```

### Auto-fix
- Pindah secret di Dockerfile/compose ke `.env` + referensi `${VAR}`.
- Tambah `.dockerignore` (sertakan `.env`, `node_modules`, `.git`).
- Tambah `USER` non-root ke Dockerfile.
- Tutup expose port DB/Redis ke publik (hapus mapping `ports` untuk service internal, andalkan network internal).

---

## Format Output (REPORT)

Selalu output tabel ringkas dulu, urut by severity:

```
## 🔒 Security Scan Report — <target> (<tanggal>)

Ringkasan: 🔴 CRITICAL: 2  🟠 HIGH: 3  🟡 MEDIUM: 5  🔵 LOW: 4

| # | Severity | Kategori          | Lokasi                      | Temuan                          | Auto-fix |
|---|----------|-------------------|-----------------------------|---------------------------------|----------|
| 1 | 🔴 CRIT  | Secret bocor      | backend/src/main.ts:14      | OpenAI key hardcoded            | ✅ ready |
| 2 | 🔴 CRIT  | .env di git       | .env (tracked)              | .env ter-commit                 | ⚠️ manual|
| 3 | 🟠 HIGH  | Data leak         | user.service.ts:42          | findUnique tanpa select         | ✅ ready |
| 4 | 🟠 HIGH  | No auth           | orders.controller.ts:30     | DELETE :id tanpa ownership      | ⚠️ konfirmasi |
| 5 | 🟡 MED   | CVE               | lodash@4.17.20              | Prototype pollution (CVE-xxxx)  | ✅ ready |
```

Severity:
- 🔴 **CRITICAL** — secret asli bocor, .env di git, endpoint mutasi tanpa auth, RCE/injection.
- 🟠 **HIGH** — data sensitif di response/log, IDOR, CVE high pada dependency aktif.
- 🟡 **MEDIUM** — CORS longgar, rate limit hilang, CVE medium, stack trace bocor.
- 🔵 **LOW** — hardening minor, dependency outdated tanpa CVE aktif.

Setelah tabel: kelompokkan auto-fix jadi **"✅ Aman (akan diterapkan)"** vs **"⚠️ Perlu konfirmasi"**, lalu eksekusi yang aman dan tanyakan yang berisiko.

## Larangan

- JANGAN tampilkan nilai secret PENUH di output — selalu redact (`sk-or-***`). Cukup tunjukkan lokasi & jenis.
- JANGAN auto-apply fix yang bisa memutus fungsi (tambah auth, hapus field response, major version bump) tanpa konfirmasi.
- JANGAN `npm audit fix --force` otomatis (bisa ganti major version & merusak build).
- JANGAN commit perubahan otomatis — serahkan ke bigboss.
- JANGAN anggap clean kalau scan tidak menemukan apa-apa — sebut keterbatasan (regex tidak menangkap semua, secret ter-obfuscate bisa lolos).
- JANGAN lewati verifikasi — selalu re-scan setelah fix.

## Mode

- `scan` → deteksi + report tabel saja (read-only, tidak ubah file).
- `fix` → scan + report + terapkan auto-fix aman + konfirmasi yang berisiko.
- `report` → scan + tulis laporan lengkap ke `docs/security-report.md`.
- Default (tanpa mode): `fix`.

## Task

$ARGUMENTS
