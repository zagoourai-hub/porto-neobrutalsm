---
name: schema
description: Generate dan design Prisma schema. Gunakan saat diminta membuat database schema, model Prisma, relasi antar tabel, ERD planning, atau validasi schema yang sudah ada.
allowed-tools: Read Write Bash(npx *) Bash(cat *)
argument-hint: "generate | validate | erd | migrate  deskripsi bisnis atau nama file schema"
---

# Schema Skill — Prisma v7 Database Design

## Standar Wajib (Prisma 7 Stable)

```prisma
// Selalu gunakan ini — TIDAK BOLEH berbeda
generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
}

datasource db {
  provider = "postgresql"
  // PENTING: di Prisma 7, `url` TIDAK ditulis di sini.
  // Connection string dikonfigurasi di prisma.config.ts.
}
```

> ⚠️ **Breaking change Prisma 7:** menulis `url = env("DATABASE_URL")` di dalam `datasource` block akan menghasilkan error `P1012`. URL wajib dipindah ke `prisma.config.ts`.

---

## Mode: `generate` — Generate Schema dari Deskripsi Bisnis

Saat diminta generate schema, ikuti langkah berikut:

### Langkah 1 — Identifikasi Entitas

Dari deskripsi bisnis, ekstrak:
```
- Siapa aktor utamanya? (User, Admin, Merchant, dll)
- Apa resource/data utamanya? (Product, Order, Invoice, dll)
- Apa relasi antar entitas? (User punya banyak Order, dll)
- Apa status/enum yang ada? (OrderStatus, UserRole, dll)
```

### Langkah 2 — Design Relasi

```
One-to-Many   : User → Orders (satu user punya banyak order)
Many-to-Many  : Product ↔ Category (pakai explicit join table)
One-to-One    : User → Profile (satu user satu profil)
Self-relation : Category → SubCategory (kategori punya sub-kategori)
```

### Langkah 3 — Field Standards

```prisma
// ID — selalu pakai cuid() untuk semua model
id        String   @id @default(cuid())

// Timestamps — selalu ada di semua model
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

// Soft delete — tambahkan jika data tidak boleh dihapus permanen
deletedAt DateTime?

// Enum — selalu definisikan di luar model
enum UserRole {
  USER
  ADMIN
  SUPER_ADMIN
}

// Boolean — selalu ada default value
isActive   Boolean @default(true)
isVerified Boolean @default(false)

// String optional — pakai ? untuk nullable
phone     String?
avatar    String?

// Decimal untuk uang — JANGAN Float (floating point error)
price     Decimal  @db.Decimal(10, 2)
```

### Langkah 4 — Naming Convention

```
Model      → PascalCase singular  (User, Product, OrderItem)
Field      → camelCase            (firstName, createdAt, isActive)
Enum       → PascalCase           (UserRole, OrderStatus)
Enum value → SCREAMING_SNAKE_CASE (SUPER_ADMIN, IN_PROGRESS)
Table name → @@map("snake_case")  (@@map("order_items"))
Index      → @@index([field1, field2])
Unique     → @@unique([field1, field2])
```

### Template Schema Lengkap

```prisma
generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
}

datasource db {
  provider = "postgresql"
  // url dikonfigurasi di prisma.config.ts (Prisma 7)
}

// ===== ENUMS =====

enum UserRole {
  USER
  ADMIN
  SUPER_ADMIN
}

enum OrderStatus {
  PENDING
  CONFIRMED
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
  REFUNDED
}

enum PaymentStatus {
  UNPAID
  PAID
  FAILED
  REFUNDED
}

// ===== MODELS =====

model User {
  id          String    @id @default(cuid())
  email       String    @unique
  password    String
  name        String
  phone       String?
  avatar      String?
  role        UserRole  @default(USER)
  isActive    Boolean   @default(true)
  isVerified  Boolean   @default(false)
  verifiedAt  DateTime?
  lastLoginAt DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  deletedAt   DateTime?

  // Relations
  profile     Profile?
  orders      Order[]
  sessions    Session[]

  @@index([role])
  @@map("users")
}

model Profile {
  id        String   @id @default(cuid())
  bio       String?
  address   String?
  city      String?
  country   String?
  zipCode   String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  userId    String   @unique
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("profiles")
}

model Session {
  id        String   @id @default(cuid())
  token     String   @unique
  expiresAt DateTime
  createdAt DateTime @default(now())

  // Relations
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@map("sessions")
}

model Category {
  id          String     @id @default(cuid())
  name        String     @unique
  slug        String     @unique
  description String?
  image       String?
  isActive    Boolean    @default(true)
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  // Self-relation (sub-category)
  parentId    String?
  parent      Category?  @relation("CategoryToSubCategory", fields: [parentId], references: [id])
  children    Category[] @relation("CategoryToSubCategory")

  // Relations
  products    ProductCategory[]

  @@map("categories")
}

model Product {
  id          String    @id @default(cuid())
  name        String
  slug        String    @unique
  description String?
  price       Decimal   @db.Decimal(10, 2)
  stock       Int       @default(0)
  images      String[]
  isActive    Boolean   @default(true)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  deletedAt   DateTime?

  // Relations
  categories  ProductCategory[]
  orderItems  OrderItem[]

  @@index([isActive])
  @@map("products")
}

// Explicit many-to-many join table
model ProductCategory {
  productId  String
  categoryId String
  assignedAt DateTime @default(now())

  product    Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  category   Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)

  @@id([productId, categoryId])
  @@index([categoryId])
  @@map("product_categories")
}

model Order {
  id            String        @id @default(cuid())
  orderNumber   String        @unique
  status        OrderStatus   @default(PENDING)
  paymentStatus PaymentStatus @default(UNPAID)
  subtotal      Decimal       @db.Decimal(10, 2)
  discount      Decimal       @default(0) @db.Decimal(10, 2)
  tax           Decimal       @default(0) @db.Decimal(10, 2)
  total         Decimal       @db.Decimal(10, 2)
  notes         String?
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt

  // Relations
  userId        String
  user          User          @relation(fields: [userId], references: [id])
  items         OrderItem[]
  payment       Payment?

  @@index([userId])
  @@index([status])
  @@map("orders")
}

model OrderItem {
  id        String  @id @default(cuid())
  quantity  Int
  price     Decimal @db.Decimal(10, 2)
  subtotal  Decimal @db.Decimal(10, 2)

  // Relations
  orderId   String
  productId String
  order     Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  product   Product @relation(fields: [productId], references: [id])

  @@index([orderId])
  @@index([productId])
  @@map("order_items")
}

model Payment {
  id         String        @id @default(cuid())
  amount     Decimal       @db.Decimal(10, 2)
  status     PaymentStatus @default(UNPAID)
  method     String?
  externalId String?       @unique
  paidAt     DateTime?
  createdAt  DateTime      @default(now())
  updatedAt  DateTime      @updatedAt

  // Relations
  orderId    String        @unique
  order      Order         @relation(fields: [orderId], references: [id])

  @@map("payments")
}
```

> Catatan: field yang sudah `@unique` (mis. `email`, `slug`) sudah otomatis ter-index — tidak perlu `@@index` lagi untuk field tunggal itu. `orderNumber` di-generate di application layer (mis. `ORD-` + nanoid), bukan `@default(cuid())`, agar human-readable.

---

## Mode: `validate` — Validasi Schema yang Ada

Cek file `prisma/schema.prisma` yang ada dan validasi:

```
✅ Generator config benar (provider = "prisma-client", output = "../generated/prisma")
✅ `url` TIDAK ada di datasource block (Prisma 7)
✅ Semua model punya id, createdAt, updatedAt
✅ Tidak ada Float untuk field uang (harus Decimal)
✅ Relasi punya onDelete action yang tepat
✅ Ada @@index untuk foreign key & field yang sering di-query (hindari index ganda di field @unique)
✅ Naming convention konsisten
✅ Enum didefinisikan di luar model
✅ Many-to-many pakai explicit join table
✅ Soft delete (deletedAt?) untuk data penting
```

Verifikasi via CLI:
```bash
npx prisma validate
npx prisma format
```

---

## Mode: `erd` — Generate ERD Text

Buat Entity Relationship Diagram dalam format text:

```
┌─────────────┐       ┌──────────────┐
│    User     │       │    Profile   │
├─────────────┤  1:1  ├──────────────┤
│ id (PK)     │◄──────│ id (PK)      │
│ email       │       │ userId (FK)  │
│ password    │       │ bio          │
│ name        │       └──────────────┘
│ role        │
└──────┬──────┘
       │ 1:N
       ▼
┌─────────────┐       ┌──────────────┐
│    Order    │  1:N  │  OrderItem   │
├─────────────┤◄──────├──────────────┤
│ id (PK)     │       │ id (PK)      │
│ userId (FK) │       │ orderId (FK) │
│ status      │       │ productId(FK)│
│ total       │       │ quantity     │
└─────────────┘       └──────────────┘
```

---

## Mode: `migrate` — Migration Planning

```bash
# Development — buat migration baru
npx prisma migrate dev --name init
npx prisma migrate dev --name add_payment_table

# Generate Prisma client
npx prisma generate

# Push schema langsung (dev only, tanpa file migration)
npx prisma db push

# Production — apply migration
npx prisma migrate deploy

# Reset database (dev only)
npx prisma migrate reset

# Cek status migration
npx prisma migrate status

# Seed data
npx prisma db seed
```

### prisma.config.ts (WAJIB ada di root — Prisma 7)

```typescript
// prisma.config.ts
import "dotenv/config"; // WAJIB — Prisma 7 tidak auto-load .env
import path from "node:path";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: path.join(__dirname, "prisma", "schema.prisma"),
  migrations: {
    path: path.join(__dirname, "prisma", "migrations"),
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
```

### seed.ts (pakai adapter yang sama dengan runtime)

```typescript
// prisma/seed.ts
import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  // seed data di sini
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
```

## Task

$ARGUMENTS
