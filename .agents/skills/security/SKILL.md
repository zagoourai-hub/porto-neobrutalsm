---
name: security
description: Implementasi dan audit keamanan aplikasi. Gunakan saat diminta setup security, hardening, CORS, rate limiting, CSRF protection, enkripsi, audit keamanan, atau perbaikan vulnerability.
allowed-tools: Read Write Bash(npx *) Bash(npm *) Bash(pip *) Bash(grep *) Bash(find *)
disable-model-invocation: true
argument-hint: "audit | setup | fix  target: frontend | backend | ai-service | all"
---

# Security Skill — Full Stack Protection

## Tech Stack

- **Helmet:** HTTP security headers (NestJS)
- **CORS:** Cross-Origin Resource Sharing config (origin eksplisit, bukan `*`)
- **Rate Limiting:** `@nestjs/throttler` (backend), SlowAPI (FastAPI)
- **CSRF:** Double-submit cookie pattern (BUKAN `csurf` — package itu sudah deprecated/archived)
- **Password:** bcryptjs (salt rounds: 12)
- **API Key Encryption:** AES-256-GCM (authenticated) + BLAKE2b keyed hash
- **JWT:** httpOnly + Secure + SameSite cookies, access token pendek + refresh token rotation
- **Input Sanitization:** class-validator (NestJS), Pydantic (FastAPI), Zod (Frontend)

## Security Checklist

### Backend (NestJS)

#### 1. Helmet Setup
```typescript
// main.ts
import helmet from "helmet";
app.use(helmet());
```

#### 2. CORS Config
```typescript
app.enableCors({
  origin: [process.env.FRONTEND_URL], // JANGAN "*" di production
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
});
```

#### 3. Rate Limiting
```typescript
// app.module.ts
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";

@Module({
  imports: [
    ThrottlerModule.forRoot([
      { name: "short", ttl: 1000, limit: 3 },     // 3 req/sec
      { name: "medium", ttl: 10000, limit: 20 },  // 20 req/10sec
      { name: "long", ttl: 60000, limit: 100 },   // 100 req/min
    ]),
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
```

#### 4. JWT httpOnly Cookie (access + refresh)
```typescript
// auth.service.ts
// Access token: pendek (15 menit). Refresh token: panjang (7 hari), rotasi tiap pakai.
const accessToken = this.jwtService.sign(payload, { expiresIn: "15m" });
response.cookie("access_token", accessToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 15 * 60 * 1000,
  path: "/",
});

response.cookie("refresh_token", refreshToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/api/auth/refresh", // dibatasi hanya ke endpoint refresh
});
```

> Simpan hash refresh token di DB (tabel `Session`) agar bisa di-revoke. Saat refresh, validasi + rotasi (keluarkan token baru, invalidate yang lama).

#### 5. Password Hashing
```typescript
import * as bcrypt from "bcryptjs";

const hashed = await bcrypt.hash(password, 12);
const isMatch = await bcrypt.compare(password, hashed);
```

#### 6. Input Validation (Global Pipe)
```typescript
// main.ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,            // strip unknown properties
    forbidNonWhitelisted: true, // tolak property tak dikenal
    transform: true,
    transformOptions: { enableImplicitConversion: false },
  }),
);
```

#### 7. CSRF Protection (Double-Submit Cookie)
```typescript
// Generate CSRF token saat login/refresh
import * as crypto from "node:crypto";

const csrfToken = crypto.randomBytes(32).toString("hex");
response.cookie("csrf_token", csrfToken, {
  httpOnly: false, // frontend perlu membacanya dan mengirim balik via header
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/",
});

// Verifikasi di guard (constant-time compare untuk hindari timing attack)
import { timingSafeEqual } from "node:crypto";

const cookieToken = request.cookies["csrf_token"];
const headerToken = request.headers["x-csrf-token"];

function safeEqual(a?: string, b?: string): boolean {
  if (!a || !b || a.length !== b.length) return false;
  return timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

if (!safeEqual(cookieToken, headerToken)) {
  throw new ForbiddenException("CSRF validation failed");
}
```

#### 8. Authorization (RBAC)
```typescript
// Selalu cek OWNERSHIP, bukan cuma authentication.
// Contoh: user hanya boleh akses resource miliknya sendiri.
if (resource.userId !== currentUser.id && currentUser.role !== "ADMIN") {
  throw new ForbiddenException("Tidak punya akses ke resource ini");
}
```

### AI Service (FastAPI)

#### 1. API Key Encryption (AES-256-GCM + BLAKE2b)
```python
# Lihat ai-service skill → core/security.py
# Key WAJIB dienkripsi (AES-256-GCM, authenticated) sebelum disimpan ke database.
# Key TIDAK PERNAH ditampilkan di response (hanya keyed-hash untuk verifikasi).
```

#### 2. Rate Limiting (SlowAPI)
```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

@router.post("/chat")
@limiter.limit("10/minute")
async def chat(request: Request):
    ...
```

#### 3. Prompt Injection Protection
```python
# 5 Layer Protection (lihat ai-service → prompt_guard.py):
# Layer 1: Regex pattern matching (heuristik, mudah dibypass — bukan andalan)
# Layer 2: Input length enforcement (max 10000 chars)
# Layer 3: System/user prompt isolation (PERTAHANAN UTAMA — message terpisah)
# Layer 4: Output validation (cek kebocoran data)
# Layer 5: Rate limiting (per-user, per-IP)
```

### Frontend (Next.js)

#### 1. Environment Variables
```typescript
// NEXT_PUBLIC_ prefix = client-visible. Tanpa prefix = server-only.
// .env.local
// NEXT_PUBLIC_API_URL=http://localhost:3001/api   // OK - public
// JWT_SECRET=supersecret                          // server only, JANGAN beri prefix
```

#### 2. Zod Input Validation
```typescript
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
});
// Validasi client-side hanya UX. Backend WAJIB validasi ulang.
```

#### 3. XSS Prevention
```typescript
// Next.js auto-escape JSX. Hindari dangerouslySetInnerHTML.
// Jika terpaksa render HTML, sanitasi dulu:
import DOMPurify from "dompurify";
const clean = DOMPurify.sanitize(dirtyHtml);
```

#### 4. CSRF Token di Axios
```typescript
// lib/axios.ts
api.interceptors.request.use((config) => {
  if (typeof document !== "undefined") {
    const csrfToken = getCookie("csrf_token");
    if (csrfToken) config.headers["X-CSRF-Token"] = csrfToken;
  }
  return config;
});
```

## Audit Mode

Saat dipanggil dengan argumen `audit`, lakukan langkah berikut:

1. **Scan dependencies** — `npm audit` / `pip-audit`
2. **Check env files** — pastikan tidak ada secret hardcoded; `.env` tidak ter-commit
3. **Verify CORS** — origin tidak wildcard `*` di production
4. **Check JWT config** — httpOnly, Secure, SameSite, access token pendek + refresh rotation
5. **Verify rate limits** — semua endpoint publik ada rate limit
6. **Check input validation** — semua endpoint punya DTO/schema validation
7. **Check authorization** — ada ownership/RBAC check, bukan cuma authentication
8. **Scan for SQL injection** — pakai parameterized query (Prisma default safe)
9. **Check file upload** — size limit, type validation (magic bytes), nama file di-sanitasi
10. **Verify error handling** — tidak leak stack trace ke client
11. **Check logging** — tidak log sensitive data (password, API key, token)
12. **Check encryption** — key sensitif pakai AES-256-GCM (authenticated)

Output audit dalam format tabel:

```
| # | Kategori         | Status | Severity | Detail                    |
|---|------------------|--------|----------|---------------------------|
| 1 | Dependencies     | ✅/❌  | HIGH     | npm audit found 0 issues  |
| 2 | Env Variables    | ✅/❌  | CRITICAL | .env committed to git     |
```

## Task

$ARGUMENTS
