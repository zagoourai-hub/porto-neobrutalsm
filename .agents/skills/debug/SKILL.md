---
name: debug
description: Root cause analysis dan fix error. Gunakan saat ada bug, error, exception, test gagal, runtime crash, atau perilaku yang tidak sesuai ekspektasi di frontend, backend, atau AI service.
allowed-tools: Read Write Bash(find *) Bash(grep *) Bash(cat *) Bash(npm *) Bash(npx *) Bash(node *) Bash(python3 *)
argument-hint: "paste error message atau deskripsi bug"
---

# Debug Skill — Root Cause Analysis

## Proses Debug (Selalu Ikuti Urutan Ini)

```
1. BACA error message dengan teliti
2. IDENTIFIKASI layer (FE / BE / AI / OPS)
3. TRACE root cause (bukan symptom)
4. HIPOTESIS penyebab (minimal 2)
5. VERIFIKASI hipotesis
6. FIX + test
7. PREVENT recurrence
```

---

## Layer 1: Frontend Errors (Next.js / React / TypeScript)

### Kategori Error & Fix

#### Hydration Error
```
Error: Hydration failed because the initial UI does not match what was rendered on the server.
```
**Root cause:** Perbedaan HTML antara server render dan client render.
```tsx
// ❌ Penyebab umum — Date/random value berbeda di server vs client
<p>{new Date().toLocaleDateString()}</p>
<p>{Math.random()}</p>

// ✅ Fix — pakai useEffect + state
const [date, setDate] = useState("");
useEffect(() => {
  setDate(new Date().toLocaleDateString());
}, []);
<p>{date}</p>

// ✅ Fix alternatif — suppressHydrationWarning (hati-hati)
<p suppressHydrationWarning>{new Date().toLocaleDateString()}</p>

// ✅ Fix — dynamic import untuk komponen yang tidak perlu SSR
import dynamic from "next/dynamic";
const ClientOnlyComponent = dynamic(() => import("./Component"), { ssr: false });
```

#### Cannot read properties of undefined/null
```
TypeError: Cannot read properties of undefined (reading 'map')
TypeError: Cannot read properties of null (reading 'id')
```
**Root cause:** Data belum tersedia saat render.
```tsx
// ❌
{data.items.map(...)}

// ✅ Optional chaining + nullish coalescing
{data?.items?.map(...) ?? []}

// ✅ Loading state dari TanStack Query
const { data, isLoading, error } = useQuery(...)
if (isLoading) return <Skeleton />
if (error) return <ErrorState />
if (!data) return null
```

#### Module not found
```
Module not found: Can't resolve '@/components/...'
```
**Root cause:** Path alias salah atau file tidak ada.
```bash
# Cek tsconfig.json paths
cat tsconfig.json | grep -A 10 '"paths"'

# Cek file exists
find . -name "ComponentName*" -not -path "*/node_modules/*"
```

#### TanStack Query / Data Fetching
```
Error: No QueryClient set, use QueryClientProvider
```
```tsx
// ✅ Pastikan QueryClientProvider di layout.tsx root
import { QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

export default function RootLayout({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

#### Zod Validation Error
```
ZodError: [{ "code": "invalid_type", "expected": "string", "received": "undefined" }]
```
```tsx
// Debug — print error detail
form.formState.errors  // di React Hook Form
// atau
const result = schema.safeParse(data)
if (!result.success) console.log(result.error.format())
```

---

## Layer 2: Backend Errors (NestJS / Prisma)

### Kategori Error & Fix

#### Prisma Connection Error
```
Error: Can't reach database server at localhost:5432
PrismaClientInitializationError: Unable to open a TLS connection
```
```bash
# Cek DATABASE_URL di .env
cat .env | grep DATABASE_URL

# Cek PostgreSQL running
docker compose ps postgres
docker compose logs postgres

# Test koneksi manual
npx prisma db pull
```

#### Prisma Record Not Found
```
PrismaClientKnownRequestError: No record found
Error code: P2025
```
```typescript
// ✅ Handle di service
const user = await this.prisma.user.findUnique({ where: { id } });
if (!user) throw new NotFoundException("User tidak ditemukan");
```

#### Prisma Unique Constraint Failed
```
PrismaClientKnownRequestError: Unique constraint failed on the fields: (`email`)
Error code: P2002
```
```typescript
// ✅ Cek dulu sebelum create
const exists = await this.prisma.user.findUnique({ where: { email } });
if (exists) throw new ConflictException("Email sudah terdaftar");
```

#### NestJS Dependency Injection Error
```
Nest can't resolve dependencies of the UserService (?). 
Please make sure that the PrismaModule is imported in UserModule
```
```typescript
// ✅ Pastikan PrismaModule di-import di module yang butuh
@Module({
  imports: [PrismaModule],  // <-- wajib ada
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
```

#### JWT / Auth Error
```
JsonWebTokenError: invalid signature
TokenExpiredError: jwt expired
UnauthorizedException: Unauthorized
```
```typescript
// Debug JWT
import * as jwt from "jsonwebtoken";
const decoded = jwt.decode(token); // tanpa verify
console.log(decoded);

// Cek JWT_SECRET sama antara sign dan verify
// Cek cookie httpOnly dikirim dengan credentials: true di frontend
```

#### Validation Pipe Error
```
BadRequestException: Validation failed (field: ...)
```
```typescript
// Debug — lihat detail error
// Response body sudah include field yang gagal validasi
// Cek DTO dan decorator class-validator

// Pastikan global validation pipe ada di main.ts
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,
  transform: true,
}));
```

#### Prisma Migration Error
```
Error: P3006 Migration failed to apply cleanly
Error: P1001 Can't reach database server
```
```bash
# Reset migration (dev only!)
npx prisma migrate reset

# Deploy ulang migration
npx prisma migrate deploy

# Cek status
npx prisma migrate status

# Manual resolve
npx prisma migrate resolve --applied "migration_name"
```

---

## Layer 3: AI Service Errors (FastAPI / Python)

### Kategori Error & Fix

#### Pydantic Validation Error
```
422 Unprocessable Entity
pydantic.error_wrappers.ValidationError: field required
```
```python
# Debug — print request body
@router.post("/chat")
async def chat(request: Request):
    body = await request.json()
    print(body)  # cek structure

# Pastikan schema match dengan request body
class ChatRequest(BaseModel):
    message: str  # required
    provider: str = "gemini"  # optional dengan default
```

#### Provider / API Key Error
```
AuthenticationError: Invalid API key
RateLimitError: Rate limit exceeded
```
```python
# Debug provider
try:
    result = await provider.generate(prompt)
except Exception as e:
    print(type(e).__name__, str(e))

# Cek env variable
import os
print(os.getenv("GEMINI_API_KEY", "NOT SET"))

# Fallback ke provider lain
providers_order = ["gemini", "openrouter", "ollama"]
```

#### Import Error
```
ModuleNotFoundError: No module named 'xxx'
ImportError: cannot import name 'xxx' from 'yyy'
```
```bash
# Cek requirements.txt
cat requirements.txt

# Install ulang
pip install -r requirements.txt

# Cek virtual env aktif
which python  # harus ke venv, bukan system python
```

#### Async Error
```
RuntimeError: This event loop is already running
RuntimeError: coroutine was never awaited
```
```python
# ❌
result = some_async_function()  # lupa await

# ✅
result = await some_async_function()

# Pastikan endpoint adalah async def
@router.post("/chat")
async def chat(request: ChatRequest):  # async wajib
    ...
```

---

## Layer 4: Docker / Infrastructure Errors

### Kategori Error & Fix

#### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3000
```
```bash
# Cari proses yang pakai port
netstat -ano | findstr :3000    # Windows
lsof -i :3000                   # Linux/Mac

# Kill proses
taskkill /PID <pid> /F          # Windows
kill -9 <pid>                   # Linux/Mac

# Atau ganti port di .env
FRONTEND_PORT=3002
```

#### Container Won't Start
```
Error: Cannot start service backend: port is already allocated
```
```bash
# Stop semua container
docker compose down

# Cek container yang masih jalan
docker ps -a

# Remove container yang stuck
docker rm -f container_name

# Rebuild
docker compose up -d --build
```

#### Environment Variable Tidak Terbaca
```
Error: DATABASE_URL is not set
TypeError: Cannot read properties of undefined
```
```bash
# Cek .env ada dan terisi
cat .env

# Cek env masuk ke container
docker compose exec backend printenv | grep DATABASE

# Pastikan .env tidak ter-gitignore tapi ada
ls -la | grep .env
```

---

## Template Output Debug

Selalu beri output dalam format ini:

```markdown
## Debug Report

### 🔍 Error Identification
- **Layer:** Frontend / Backend / AI Service / Docker
- **Type:** TypeError / ValidationError / NetworkError / dll
- **Message:** [pesan error lengkap]

### 🎯 Root Cause
[Penjelasan MENGAPA error terjadi, bukan hanya apa yang error]

### 🔧 Fix

**File:** `path/to/file.ts`

[kode fix]

### ✅ Verification
[cara verifikasi fix berhasil]

### 🛡️ Prevention
[cara mencegah error ini terulang]
```

---

## Quick Debug Commands

```bash
# Frontend — TypeScript check
cd frontend && npx tsc --noEmit

# Frontend — lint
cd frontend && npx eslint src --ext .ts,.tsx

# Backend — TypeScript check
cd backend && npx tsc --noEmit

# Backend — test endpoint
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test1234"}'

# AI Service — health check
curl http://localhost:8000/api/v1/health

# Docker — lihat semua logs
docker compose logs --tail=50 -f

# Prisma — validate schema
npx prisma validate
```

## Task

$ARGUMENTS
