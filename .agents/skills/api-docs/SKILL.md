---
name: api-docs
description: Generate dokumentasi API dari endpoint NestJS. Gunakan saat diminta bikin dokumentasi API, setup Swagger/OpenAPI, tambah dokumentasi endpoint, contoh request/response, atau membuat API reference. Auto-jalan saat controller/DTO baru dibuat dan diminta didokumentasikan.
allowed-tools: Read Write Bash(npx *) Bash(npm *) Bash(grep *) Bash(find *)
argument-hint: "setup | endpoint | full  target: nama-module | all"
---

# API Docs Skill — Swagger/OpenAPI untuk NestJS

Generate dan lengkapi dokumentasi API otomatis dari endpoint NestJS pakai `@nestjs/swagger`. Tidak menggantikan logic — hanya menambah decorator dokumentasi + contoh request/response di atas kode yang sudah ada.

## Tech Stack

- `@nestjs/swagger` (OpenAPI 3.0)
- `swagger-ui-express` (bundled dengan `@nestjs/swagger`)
- Decorator: `@ApiTags`, `@ApiOperation`, `@ApiResponse`, `@ApiProperty`, `@ApiBearerAuth`

## Mode: `setup` — Setup Awal Swagger

### 1. Install

```bash
npm install @nestjs/swagger
```

### 2. Bootstrap di `main.ts`

```typescript
// main.ts
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ... setup lain (helmet, cors, validation pipe, dst — tidak diubah)

  const config = new DocumentBuilder()
    .setTitle(process.env.APP_NAME ?? "API")
    .setDescription("API documentation")
    .setVersion("1.0")
    .addBearerAuth() // JWT httpOnly cookie tetap didokumentasikan sebagai bearer untuk testing di Swagger UI
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  await app.listen(process.env.PORT ?? 3001);
}
```

> Swagger UI otomatis tersedia di `/api/docs`. JANGAN expose di production tanpa proteksi (lihat bagian **Keamanan** di bawah).

## Mode: `endpoint` — Dokumentasi per Endpoint/Module

Tambahkan decorator ke DTO dan Controller yang SUDAH ADA — tidak mengubah logic.

### DTO — `@ApiProperty`

```typescript
// dto/create-user.dto.ts
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";

export class CreateUserDto {
  @ApiProperty({ example: "budi@example.com", description: "Email aktif user" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "Budi Santoso" })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ example: "SecurePass123!", minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;
}
```

### Controller — `@ApiTags`, `@ApiOperation`, `@ApiResponse`

```typescript
// user.controller.ts
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";

@ApiTags("users")
@ApiBearerAuth()
@Controller("users")
export class UserController {
  @Post()
  @ApiOperation({ summary: "Buat user baru" })
  @ApiResponse({ status: 201, description: "User berhasil dibuat" })
  @ApiResponse({ status: 409, description: "Email sudah terdaftar" })
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @Get(":id")
  @ApiOperation({ summary: "Ambil detail user by ID" })
  @ApiResponse({ status: 200, description: "Detail user" })
  @ApiResponse({ status: 404, description: "User tidak ditemukan" })
  findById(@Param("id") id: string) {
    return this.userService.findById(id);
  }
}
```

### Response DTO (opsional, untuk response shape yang jelas)

```typescript
// dto/user-response.dto.ts
import { ApiProperty } from "@nestjs/swagger";

export class UserResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() email: string;
  @ApiProperty() name: string;
  @ApiProperty() createdAt: Date;
  // password TIDAK didokumentasikan — field sensitif tidak boleh muncul di response shape
}
```

> Response DTO harus konsisten dengan `select`/`omit` Prisma yang sudah ada di skill `backend` — JANGAN dokumentasikan field yang memang tidak pernah dikembalikan.

## Mode: `full` — Scan Seluruh Backend & Lengkapi Otomatis

1. Scan semua `*.controller.ts` di `backend/src/modules/`.
2. Untuk tiap endpoint yang BELUM ada `@ApiOperation`/`@ApiResponse` → tambahkan berdasarkan nama method + DTO yang dipakai (inferensi dari kode, bukan asumsi kosong).
3. Untuk tiap DTO yang BELUM ada `@ApiProperty` → tambahkan berdasarkan validator yang sudah ada (`@IsEmail` → contoh email, `@IsString` → contoh string relevan dari nama field).
4. Tambahkan `@ApiTags` per controller kalau belum ada (nama tag = nama module).
5. Laporkan ringkasan: berapa endpoint/DTO yang dilengkapi, endpoint mana yang butuh review manual (ambigu, contoh tidak jelas).

## Keamanan (WAJIB dicek)

- Swagger UI di production **HARUS diproteksi** — JANGAN biarkan `/api/docs` publik tanpa auth. Opsi:
  ```typescript
  if (process.env.NODE_ENV === "production") {
    app.use("/api/docs", basicAuth({ users: { admin: process.env.SWAGGER_PASSWORD } }));
  }
  ```
  atau matikan sepenuhnya di production dan hanya aktif di `development`/`staging`.
- JANGAN masukkan contoh (`example`) yang berisi data sensitif asli (API key, password asli, PII asli) — selalu pakai data dummy jelas (`user@example.com`, `********`).
- Endpoint internal/admin sebaiknya dikelompokkan tag terpisah (`@ApiTags("admin")`) agar mudah dibedakan saat proteksi.

## Larangan

- JANGAN ubah logic controller/service — hanya tambah decorator dokumentasi.
- JANGAN dokumentasikan field sensitif (password, token, secret) di response schema.
- JANGAN biarkan Swagger UI publik tanpa proteksi di production.
- JANGAN buat contoh dengan data production asli.
- JANGAN skip endpoint yang sudah ada dokumentasinya — hanya lengkapi yang kosong (mode `full`).

## Task

$ARGUMENTS
