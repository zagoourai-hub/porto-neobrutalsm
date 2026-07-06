---
name: execute-prd
description: Eksekusi PRD menjadi task list terlacak lalu implement bertahap. Gunakan saat diberi file PRD (docs/PRD-*.md) dan diminta kerjakan/implement/bangun dari PRD, ubah PRD jadi task, atau lanjutkan implementasi PRD. Parse atomic task → buat todo list → eksekusi per fase dengan verifikasi.
allowed-tools: Read Write Bash(npx *) Bash(npm *) Bash(pnpm *) Bash(node *) Bash(pip *) Bash(python3 *) Bash(git *) Bash(docker *) Bash(cat *) Bash(find *)
argument-hint: "path PRD (mis. docs/PRD-rentease.md) [fase tertentu, mis. phase 2]"
---

# Execute PRD — Parse, Track, Build

Ubah PRD terstruktur menjadi task list yang terlacak, lalu implement bertahap dengan verifikasi tiap langkah. Dirancang untuk PRD format Zagoour (phase → feature group → atomic task, tag `[FE]/[BE]/[AI]/[OPS]`).

## Prinsip Inti

1. **Selalu buat task list dulu** — jangan langsung coding tanpa daftar terlacak.
2. **Eksekusi BERURUTAN** — satu task → verifikasi → tandai selesai → lanjut. Bukan paralel buta.
3. **Checkpoint per fase** — lapor progres, berhenti di keputusan ambigu.
4. **Jangan jalankan 100+ task sekaligus** — bertahap, hemat context, error tidak menumpuk.
5. **Patuhi standar global** (CLAUDE.md/AGENTS.md): stack, struktur folder, no `any`, Prisma v7, pattern NestJS.

## Alur Kerja

```
1. PARSE     → baca PRD, ekstrak semua atomic task + tag + dependency antar fase
2. PLAN      → buat task list di todo system (TodoWrite/Tasks), urut per fase
3. PRE-CHECK → cek prasyarat fase (env, dependency, file dasar sudah ada?)
4. EXECUTE   → implement task satu per satu
5. VERIFY    → tiap task: build/typecheck/lint; tiap fitur: test bila ada
6. CHECKPOINT→ akhir fase: ringkas progres, tanya kalau perlu keputusan
7. REPORT    → status akhir: selesai / blocked / butuh input
```

---

## Step 1 — PARSE PRD

Baca file PRD. Ekstrak struktur:

```
Untuk setiap FASE:
  - nama fase + tujuan
  Untuk setiap FEATURE GROUP:
    Untuk setiap ATOMIC TASK:
      - deskripsi (1 file / 1 function / 1 config)
      - tag layer: [FE] [BE] [AI] [OPS]
      - dependency (task lain yang harus selesai dulu)
      - acceptance (kalau disebut di PRD)
```

Validasi cepat sebelum lanjut:
- Task benar-benar atomik? Kalau ada task gemuk ("buat seluruh auth"), pecah dulu jadi sub-task di task list.
- Ada dependency lintas fase? Catat urutannya.
- Ada ambiguitas (versi library tidak disebut, business logic tidak jelas)? **Tanya bigboss SEBELUM mulai**, jangan asumsi.

> Kalau PRD belum ada / belum solid → arahkan ke skill `analyze-prd` dulu untuk review & validasi.

## Step 2 — PLAN (buat task list terlacak)

Masukkan SEMUA task ke todo system agent (TodoWrite di Claude Code, Tasks/plan di Antigravity/Codex). Struktur:

```
[ ] Phase 1: Setup & Foundation
    [ ] [OPS] Init project structure (frontend/ backend/ ai-service/)
    [ ] [OPS] Setup prisma.config.ts + schema.prisma (Prisma v7)
    [ ] [BE]  PrismaModule + PrismaService (driver adapter)
    ...
[ ] Phase 2: Auth
    [ ] [BE]  DTO login + register
    [ ] [BE]  AuthService (bcrypt + JWT)
    ...
```

Aturan task list:
- Satu task = satu unit kerja yang bisa diverifikasi.
- Pertahankan tag `[FE]/[BE]/[AI]/[OPS]` agar jelas layer-nya.
- Tandai dependency: task yang block task lain dikerjakan lebih dulu.
- HANYA satu task berstatus `in_progress` dalam satu waktu.

## Step 3 — PRE-CHECK per Fase

Sebelum eksekusi fase, pastikan prasyarat siap:
- Dependency npm/pip yang dibutuhkan fase ini sudah terinstall? Kalau belum, install dulu (jadikan task).
- File/folder dasar yang jadi pondasi sudah ada?
- Env var yang dipakai sudah di `.env`/`.env.example`?
- **Fetch docs library** yang relevan (aturan global) sebelum nulis kode dengan API yang versinya kritikal (Prisma v7, Next 16, dll).

## Step 4 & 5 — EXECUTE + VERIFY (loop per task)

Untuk SETIAP task:

```
1. Set status → in_progress
2. Implement (ikuti skill domain: frontend/backend/ai-service/schema/docker)
3. Verifikasi sesuai layer:
   [BE]  → npx tsc --noEmit (typecheck); npx prisma validate kalau ubah schema
   [FE]  → npx tsc --noEmit; cek import & client/server boundary
   [AI]  → typecheck (Node) / python -c import (Python)
   [OPS] → docker compose config; validasi syntax
4. Kalau verifikasi GAGAL → fix dulu, jangan lanjut task berikut
5. Set status → completed
6. Lanjut task berikutnya
```

Aturan kualitas saat implement:
- Production-ready, no `any`, file < 200 baris (pecah kalau lebih).
- Ikuti pattern: NestJS (DTO/Service/Controller/Guard), Next (service → TanStack Query hook → komponen).
- Jangan bikin file di luar scope task yang sedang dikerjakan.
- Kalau menemukan task PRD yang ternyata salah/kurang → catat, beri tahu bigboss, jangan diam-diam menyimpang.

## Step 6 — CHECKPOINT per Fase

Di akhir tiap fase, JANGAN langsung lanjut fase berikutnya. Lapor:

```
✅ Phase 2 (Auth) selesai — 8/8 task
   - Dibuat: auth.module, auth.service, dto, jwt.strategy, jwt-auth.guard, ...
   - Verifikasi: typecheck pass, prisma validate pass
   - Catatan: [kalau ada] endpoint refresh token belum di PRD, saya tambahkan? 
   
Lanjut ke Phase 3 (Products)? [tunggu konfirmasi kalau ada keputusan; lanjut kalau jelas]
```

Berhenti & tanya kalau:
- Ada keputusan desain yang tidak ada di PRD.
- Butuh kredensial/API key/akses eksternal.
- Ada konflik antara PRD dan standar global.
- Fase berikutnya butuh sesuatu yang belum tersedia.

## Step 7 — REPORT Akhir

```
## Eksekusi PRD: <nama> — Status

Selesai: Phase 1-4 (42/58 task)
Blocked: Phase 5 — butuh Midtrans API key
Skipped: 2 task (alasan: ...)

Berikutnya: [apa yang perlu bigboss lakukan / keputusan]
```

---

## Mode Parsial

- `execute-prd docs/PRD-x.md` → seluruh PRD, bertahap per fase.
- `execute-prd docs/PRD-x.md phase 3` → hanya fase 3 (lanjutan kerja sebelumnya).
- `execute-prd docs/PRD-x.md [FE]` → hanya task layer frontend.
- Resume: kalau task list sudah ada dari sesi sebelumnya, lanjutkan dari task `pending` pertama, jangan ulang yang `completed`.

## Larangan

- JANGAN eksekusi semua fase sekaligus tanpa task list terlacak.
- JANGAN lebih dari satu task `in_progress` bersamaan.
- JANGAN lanjut task berikut kalau verifikasi task sekarang gagal.
- JANGAN asumsi detail yang tidak ada di PRD — tanya dulu.
- JANGAN menyimpang dari PRD diam-diam — kalau PRD keliru, lapor.
- JANGAN commit otomatis — serahkan ke bigboss.
- JANGAN langgar standar global (no `any`, Prisma v7, struktur folder) demi mengejar task cepat.

## Task

$ARGUMENTS
