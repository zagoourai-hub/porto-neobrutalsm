# PRD.md — Portfolio Website & Admin Dashboard

## 1. Ringkasan Produk

### Nama Produk

**Zagoour Portfolio System**

### Deskripsi Singkat

Zagoour Portfolio System adalah website portfolio personal dengan tema **Neobrutalism Light** yang dilengkapi **admin dashboard** untuk mengelola konten portfolio secara mandiri.

Website ini dibuat menggunakan **Next.js Full Stack** dengan **Prisma ORM** sebagai layer database. Sistem ini memungkinkan pemilik portfolio mengelola project, timeline perjalanan, testimoni, pesan masuk, konten profil, dan pengaturan website tanpa perlu mengubah source code secara manual.

### Tujuan Utama

Membangun portfolio personal yang:

* Menampilkan personal branding secara kuat.
* Memiliki desain unik dengan gaya Neobrutalism Light.
* Bisa digunakan untuk menarik client jasa web development, UI/UX, dan AI integration.
* Dapat dikelola melalui halaman admin.
* Siap dikembangkan menjadi produk reusable untuk client lain.

---

## 2. Background

Banyak portfolio developer terlihat terlalu generik, hanya menampilkan nama, skill, dan project tanpa karakter visual yang kuat. Untuk freelancer atau developer yang ingin menjual jasa, portfolio harus berfungsi sebagai **sales page**, bukan hanya halaman profil.

Project ini akan menggabungkan:

* Landing page portfolio modern.
* Admin dashboard untuk manajemen konten.
* Contact form untuk lead/client.
* SEO-friendly page structure.
* Desain Neobrutalism Light yang kuat secara visual.

---

## 3. Target User

### 3.1 Primary User

#### Portfolio Owner / Admin

Pemilik website yang ingin mengelola isi portfolio tanpa edit kode langsung.

Kebutuhan:

* Mengubah headline dan bio.
* Menambah atau menghapus project.
* Mengelola timeline perjalanan.
* Mengelola testimoni.
* Membaca pesan dari calon client.
* Mengatur social media dan kontak.
* Melihat statistik dasar website.

### 3.2 Visitor

Orang yang mengunjungi portfolio.

Tipe visitor:

* Calon client.
* Recruiter.
* Business owner.
* UMKM.
* Startup founder.
* Sesama developer/designer.

Kebutuhan:

* Melihat profil singkat.
* Melihat project yang pernah dibuat.
* Memahami jasa yang ditawarkan.
* Melihat testimoni.
* Menghubungi pemilik portfolio dengan mudah.

---

## 4. Product Goals

### Goal 1 — Personal Branding

Website harus langsung menunjukkan karakter pemilik portfolio sebagai developer kreatif dan profesional.

### Goal 2 — Lead Generation

Website harus membantu visitor menghubungi pemilik portfolio melalui contact form dan CTA yang jelas.

### Goal 3 — Content Management

Admin harus bisa mengelola konten utama tanpa perlu deploy ulang.

### Goal 4 — Performance & SEO

Website harus cepat, SEO-friendly, responsive, dan mudah diindex mesin pencari.

### Goal 5 — Reusable System

Struktur project harus cukup modular agar bisa dipakai ulang untuk client lain.

---

## 5. Non-Goals

Untuk versi awal, project ini tidak mencakup:

* Multi-user admin.
* Payment gateway.
* Blog CMS lengkap.
* AI chatbot.
* Marketplace template.
* Real-time collaboration.
* Role-based access control kompleks.
* Analytics advanced seperti heatmap.

Fitur-fitur tersebut bisa masuk ke versi lanjutan.

---

## 6. Tech Stack

### Frontend

* Next.js 16 App Router
* TypeScript
* Tailwind CSS v4
* shadcn/ui
* Lucide React Icons
* Motion untuk animasi ringan yang jelas manfaat UX-nya

### Backend

* Next.js Route Handler
* Server Actions jika dibutuhkan
* Zod untuk validation
* Auth.js credential provider

### Database

* PostgreSQL 16
* Prisma ORM v7

### Storage

Untuk MVP:

* External image URL only.
* Tidak ada local upload atau upload provider di MVP.

Untuk production:

* Cloudinary, UploadThing, Supabase Storage, atau S3-compatible storage.

### Deployment

* Vercel untuk frontend/fullstack Next.js
* Supabase/Neon/Railway untuk PostgreSQL
* Prisma migration untuk database versioning

---

## 7. Design Direction

### Theme

**Neobrutalism Light**

### Visual Rules

* Background terang.
* Border hitam tebal.
* Hard shadow.
* Typography bold.
* Warna aksen cerah.
* Card-based layout.
* Floating navbar.
* Sticker-style section label.
* Timeline visual yang ekspresif.

### Main Colors

* Background: `#FFFDF4`
* Surface: `#FFFFFF`
* Ink: `#0A0A0A`
* Border: `#111111`
* Yellow: `#FFF200`
* Cyan: `#35DCE8`
* Pink: `#FF4FA3`
* Purple: `#9B5CFF`
* Green: `#8CFF63`
* Red: `#FF4D4D`

---

## 8. Core Pages

## 8.1 Public Landing Page

Path:

```txt
/
```

### Sections

1. Floating Navbar
2. Hero Section
3. Trusted By / Tech Stack
4. About Section
5. Featured Work Section
6. Services Section
7. Timeline Section
8. Testimonials Section
9. Contact Section
10. Footer

---

## 8.2 Admin Dashboard

Path:

```txt
/admin
```

### Sections

1. Admin Navbar
2. Dashboard Overview
3. Stats Cards
4. Recent Projects
5. Messages Overview
6. Quick Actions

---

## 8.3 Admin Projects Page

Path:

```txt
/admin/projects
```

Fungsi:

* Melihat daftar project.
* Menambah project.
* Mengubah project.
* Menghapus project.
* Mengubah status project.
* Mengatur featured project.

---

## 8.4 Admin Timeline Page

Path:

```txt
/admin/timeline
```

Fungsi:

* Menambah milestone.
* Mengubah milestone.
* Menghapus milestone.
* Mengatur urutan timeline.
* Mengatur warna/icon milestone.

---

## 8.5 Admin Testimonials Page

Path:

```txt
/admin/testimonials
```

Fungsi:

* Menambah testimoni.
* Mengubah testimoni.
* Menghapus testimoni.
* Mengubah status testimoni.
* Menampilkan/menyembunyikan testimoni.

---

## 8.6 Admin Messages Page

Path:

```txt
/admin/messages
```

Fungsi:

* Melihat pesan masuk.
* Membaca detail pesan.
* Menandai pesan sebagai sudah dibaca.
* Menghapus pesan.
* Membalas via email manual.

---

## 8.7 Admin Content Page

Path:

```txt
/admin/content
```

Fungsi:

* Mengubah hero headline.
* Mengubah subheadline.
* Mengubah bio/about.
* Mengubah CTA.
* Mengubah email kontak.
* Mengubah nomor WhatsApp.
* Mengubah social media links.

---

## 8.8 Admin Settings Page

Path:

```txt
/admin/settings
```

Fungsi:

* Mengatur metadata website.
* Mengatur SEO title.
* Mengatur SEO description.
* Mengatur favicon/logo.
* Mengubah data profil admin.

---

## 9. Functional Requirements

# 9.1 Public Website

## FR-001 — Visitor dapat melihat hero section

Hero section harus menampilkan:

* Nama pemilik portfolio.
* Role utama.
* Deskripsi singkat.
* CTA utama.
* CTA secondary.
* Visual profile/illustration.

Acceptance Criteria:

* Headline tampil jelas di desktop dan mobile.
* CTA mengarah ke section project atau contact.
* Layout responsive.

---

## FR-002 — Visitor dapat melihat daftar project

Featured work section harus menampilkan project yang berstatus `PUBLISHED`.

Data project:

* Thumbnail.
* Judul.
* Kategori.
* Deskripsi singkat.
* Tags.
* Link demo.
* Link repository optional.

Acceptance Criteria:

* Hanya project published yang muncul.
* Featured project diprioritaskan tampil di atas.
* Card project bisa diklik.

---

## FR-003 — Visitor dapat melihat layanan

Services section harus menampilkan daftar layanan yang ditawarkan.

Contoh layanan:

* Web Development.
* UI/UX Design.
* API Integration.
* AI Integration.
* Performance Optimization.

Acceptance Criteria:

* Setiap service memiliki title, description, dan icon.
* Service tampil responsive.

---

## FR-004 — Visitor dapat melihat timeline

Timeline section menampilkan perjalanan pemilik portfolio berdasarkan data dari admin.

Data timeline:

* Tahun.
* Judul.
* Deskripsi.
* Icon.
* Accent color.
* Urutan.

Acceptance Criteria:

* Timeline desktop bisa horizontal.
* Timeline mobile menjadi vertical.
* Data tampil berdasarkan urutan.

---

## FR-005 — Visitor dapat melihat testimoni

Testimonial section menampilkan testimoni berstatus `APPROVED`.

Data testimonial:

* Nama.
* Role/company.
* Avatar optional.
* Rating.
* Isi testimoni.

Acceptance Criteria:

* Hanya testimoni approved yang tampil.
* Rating maksimal 5.
* Layout responsive.

---

## FR-006 — Visitor dapat mengirim pesan

Contact form harus memungkinkan visitor mengirim pesan.

Fields:

* Nama.
* Email.
* Subjek.
* Pesan.

Validation:

* Nama wajib.
* Email valid.
* Subjek wajib.
* Pesan minimal 10 karakter.

Acceptance Criteria:

* Data tersimpan ke database.
* Setelah submit berhasil, tampil success state.
* Jika gagal, tampil error state.
* Form tidak reload full page.

---

# 9.2 Admin Dashboard

## FR-007 — Admin dapat login

Admin harus login sebelum mengakses halaman `/admin`.

Acceptance Criteria:

* User tidak login diarahkan ke `/login`.
* Session disimpan secara aman.
* Password tidak disimpan plain text.
* Logout tersedia.

---

## FR-008 — Admin dapat melihat statistik dashboard

Dashboard menampilkan statistik:

* Total project.
* Total pesan masuk.
* Total testimoni.
* Pesan unread.
* Project draft.

Acceptance Criteria:

* Statistik dihitung dari database.
* Data tampil dalam brutalist stats card.
* Loading state tersedia.
* Page views tidak masuk MVP kecuali activity/analytics model ditambahkan di fase lanjutan.

---

## FR-009 — Admin dapat CRUD project

Admin dapat:

* Create project.
* Read project list.
* Update project.
* Delete project.
* Publish/unpublish project.
* Mark project as featured.

Project fields:

* Title.
* Slug.
* Description.
* Content optional.
* Thumbnail.
* Category.
* Tags.
* Demo URL.
* Repository URL.
* Status.
* Featured flag.
* Sort order.

Acceptance Criteria:

* Slug harus unique.
* Title wajib.
* Description wajib.
* Status default `DRAFT`.
* Delete membutuhkan confirmation.
* Project published tampil di landing page.

---

## FR-010 — Admin dapat CRUD timeline

Admin dapat mengelola milestone timeline.

Timeline fields:

* Year.
* Title.
* Description.
* Icon.
* Accent color.
* Sort order.

Acceptance Criteria:

* Timeline tampil berdasarkan sort order.
* Year wajib.
* Title wajib.
* Sort order bisa diubah.

---

## FR-011 — Admin dapat CRUD testimonial

Admin dapat mengelola testimoni.

Testimonial fields:

* Name.
* Role.
* Company.
* Avatar.
* Rating.
* Content.
* Status.

Acceptance Criteria:

* Rating antara 1 sampai 5.
* Status default `PENDING`.
* Hanya status `APPROVED` tampil di landing page.

---

## FR-012 — Admin dapat membaca pesan masuk

Admin dapat melihat pesan dari contact form.

Message fields:

* Name.
* Email.
* Subject.
* Message.
* Read status.
* Created date.

Acceptance Criteria:

* Pesan baru memiliki status unread.
* Admin bisa mark as read.
* Admin bisa delete pesan.
* Admin bisa melihat detail pesan.

---

## FR-013 — Admin dapat mengubah konten landing page

Admin dapat mengubah konten utama website:

* Hero headline.
* Hero subheadline.
* About text.
* CTA label.
* CTA URL.
* Contact email.
* Phone number.
* Social links.

Acceptance Criteria:

* Konten tersimpan di database.
* Perubahan tampil di public landing page.
* Input divalidasi.

---

## FR-014 — Admin dapat mengatur SEO

Admin dapat mengatur:

* Site title.
* Meta description.
* Open Graph title.
* Open Graph description.
* Open Graph image.
* Favicon.
* Canonical URL.

Acceptance Criteria:

* Metadata digunakan di halaman public.
* Jika belum diatur, gunakan default metadata.

---

## 10. Non-Functional Requirements

## 10.1 Performance

Target:

* Lighthouse Performance minimal 90.
* First Contentful Paint di bawah 2 detik pada koneksi normal.
* Image harus dioptimasi dengan `next/image`.
* Font loading harus optimal.

Implementation Notes:

* Gunakan Server Components untuk data public.
* Gunakan pagination untuk admin table.
* Gunakan lazy loading untuk image non-critical.
* Hindari client component berlebihan.

---

## 10.2 SEO

Website harus:

* Memiliki metadata dinamis.
* Memiliki semantic heading.
* Memiliki Open Graph image.
* Memiliki sitemap.
* Memiliki robots.txt.
* Memiliki slug project yang SEO-friendly.

---

## 10.3 Security

Wajib:

* Password admin di-hash menggunakan bcrypt/argon2.
* Route admin protected.
* API mutation protected.
* Validasi input dengan Zod.
* Sanitize input rich text jika ada.
* Rate limit contact form.
* CSRF protection jika menggunakan cookie-based auth.
* Environment variable tidak diekspos ke client.

---

## 10.4 Accessibility

Wajib:

* Contrast minimal WCAG AA.
* Form input memiliki label.
* Button memiliki focus state.
* Icon-only button memiliki `aria-label`.
* Decorative element menggunakan `aria-hidden`.
* Jangan hanya menggunakan warna untuk status.

---

## 10.5 Responsive

Website harus optimal di:

* Mobile: 360px ke atas.
* Tablet: 768px ke atas.
* Desktop: 1024px ke atas.
* Large desktop: 1440px ke atas.

---

## 11. Data Model

## 11.1 User

Untuk admin login.

Fields:

* id
* name
* email
* passwordHash
* role
* createdAt
* updatedAt

Role:

* `ADMIN`

---

## 11.2 Project

Fields:

* id
* title
* slug
* description
* content
* thumbnailUrl
* category
* tags
* demoUrl
* repositoryUrl
* status
* isFeatured
* sortOrder
* createdAt
* updatedAt

Status:

* `DRAFT`
* `PUBLISHED`
* `ARCHIVED`

---

## 11.3 TimelineItem

Fields:

* id
* year
* title
* description
* icon
* accentColor
* sortOrder
* createdAt
* updatedAt

---

## 11.4 Testimonial

Fields:

* id
* name
* role
* company
* avatarUrl
* rating
* content
* status
* createdAt
* updatedAt

Status:

* `PENDING`
* `APPROVED`
* `HIDDEN`

---

## 11.5 ContactMessage

Fields:

* id
* name
* email
* subject
* message
* isRead
* createdAt
* updatedAt

---

## 11.6 SiteContent

Fields:

* id
* key
* value
* type
* createdAt
* updatedAt

Type:

* `TEXT`
* `JSON`
* `IMAGE`
* `URL`

---

## 11.7 SiteSetting

Fields:

* id
* siteTitle
* siteDescription
* ogTitle
* ogDescription
* ogImage
* faviconUrl
* contactEmail
* phoneNumber
* whatsappNumber
* socialLinks
* createdAt
* updatedAt

---

## 12. Prisma Schema Draft

```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}

enum UserRole {
  ADMIN
}

enum ProjectStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

enum TestimonialStatus {
  PENDING
  APPROVED
  HIDDEN
}

enum SiteContentType {
  TEXT
  JSON
  IMAGE
  URL
}

model User {
  id           String   @id @default(cuid())
  name         String
  email        String   @unique
  passwordHash String
  role         UserRole @default(ADMIN)

  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model Project {
  id            String        @id @default(cuid())
  title         String
  slug          String        @unique
  description   String
  content       String?
  thumbnailUrl  String?
  category      String
  tags          String[]      @default([])
  demoUrl       String?
  repositoryUrl String?
  status        ProjectStatus @default(DRAFT)
  isFeatured    Boolean       @default(false)
  sortOrder     Int           @default(0)

  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt

  @@index([status])
  @@index([isFeatured])
  @@index([sortOrder])
}

model TimelineItem {
  id          String   @id @default(cuid())
  year        String
  title       String
  description String
  icon        String?
  accentColor String?
  sortOrder   Int      @default(0)

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([sortOrder])
}

model Testimonial {
  id        String            @id @default(cuid())
  name      String
  role      String?
  company   String?
  avatarUrl String?
  rating    Int               @default(5)
  content   String
  status    TestimonialStatus @default(PENDING)

  createdAt DateTime          @default(now())
  updatedAt DateTime          @updatedAt

  @@index([status])
}

model ContactMessage {
  id        String   @id @default(cuid())
  name      String
  email     String
  subject   String
  message   String
  isRead    Boolean  @default(false)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([isRead])
  @@index([createdAt])
}

model SiteContent {
  id        String          @id @default(cuid())
  key       String          @unique
  value     String
  type      SiteContentType @default(TEXT)

  createdAt DateTime        @default(now())
  updatedAt DateTime        @updatedAt
}

model SiteSetting {
  id             String   @id @default(cuid())
  siteTitle      String
  siteDescription String
  ogTitle        String?
  ogDescription  String?
  ogImage        String?
  faviconUrl     String?
  contactEmail   String?
  phoneNumber    String?
  whatsappNumber String?
  socialLinks    Json?

  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}
```

Catatan Prisma v7:

* `DATABASE_URL` tidak ditulis di `schema.prisma`.
* URL database wajib dikonfigurasi di `prisma.config.ts` root dengan `defineConfig` dan `env("DATABASE_URL")`.
* Prisma Client memakai driver adapter PostgreSQL saat service layer dibuat.

---

## 12.1 API Response Envelope

Semua Route Handler MVP menggunakan envelope konsisten.

Response success:

```json
{
  "success": true,
  "data": {},
  "message": "Operasi berhasil."
}
```

Response error:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Input tidak valid.",
    "details": {}
  }
}
```

---

## 13. Route Structure

```txt
src/
  app/
    page.tsx
    login/
      page.tsx
    admin/
      layout.tsx
      page.tsx
      projects/
        page.tsx
        new/
          page.tsx
        [id]/
          edit/
            page.tsx
      timeline/
        page.tsx
      testimonials/
        page.tsx
      messages/
        page.tsx
        [id]/
          page.tsx
      content/
        page.tsx
      settings/
        page.tsx
    api/
      auth/
        route.ts
      contact/
        route.ts
      admin/
        projects/
          route.ts
          [id]/
            route.ts
        timeline/
          route.ts
          [id]/
            route.ts
        testimonials/
          route.ts
          [id]/
            route.ts
        messages/
          route.ts
          [id]/
            route.ts
        content/
          route.ts
        settings/
          route.ts
```

---

## 14. Recommended Folder Structure

Implementasi repo ini membungkus aplikasi Next.js di folder `frontend/`. Tidak ada folder `backend/`; backend logic tetap memakai Next.js Route Handlers, Server Actions, dan service layer di dalam `frontend/src/server`.

```txt
frontend/
  src/
    app/
    components/
      layout/
        floating-navbar.tsx
        admin-navbar.tsx
        footer.tsx
      sections/
        hero-section.tsx
        trusted-by-section.tsx
        about-section.tsx
        featured-work-section.tsx
        services-section.tsx
        timeline-section.tsx
        testimonials-section.tsx
        contact-section.tsx
      admin/
        admin-stats.tsx
        project-table.tsx
        project-form.tsx
        timeline-manager.tsx
        testimonial-table.tsx
        messages-panel.tsx
        content-editor.tsx
        settings-form.tsx
      ui/
        brutal-card.tsx
        brutal-button.tsx
        brutal-input.tsx
        brutal-textarea.tsx
        section-label.tsx
        status-badge.tsx
    server/
      services/
    lib/
      prisma.ts
      auth.ts
      validations/
        project.schema.ts
        timeline.schema.ts
        testimonial.schema.ts
        contact.schema.ts
        content.schema.ts
        settings.schema.ts
      utils/
        slugify.ts
        format-date.ts
    generated/
      prisma/
  prisma/
    schema.prisma
    seed.ts
  prisma.config.ts
docker/
```

---

## 15. Validation Rules

Gunakan Zod untuk semua form dan API mutation.

### Project Validation

* title: required, min 3
* slug: required, lowercase, unique
* description: required, min 10
* category: required
* tags: array string
* demoUrl: valid URL optional
* repositoryUrl: valid URL optional
* status: enum

### Contact Validation

* name: required, min 2
* email: required, valid email
* subject: required, min 3
* message: required, min 10

### Testimonial Validation

* name: required
* content: required, min 10
* rating: number 1-5
* status: enum

### Timeline Validation

* year: required
* title: required
* description: required
* sortOrder: number

---

## 16. API Contract

## 16.1 Submit Contact Message

Endpoint:

```txt
POST /api/contact
```

Request:

```json
{
  "name": "Dimas Pratama",
  "email": "dimas@example.com",
  "subject": "Butuh Landing Page",
  "message": "Saya ingin membuat landing page untuk bisnis saya."
}
```

Response Success:

```json
{
  "success": true,
  "message": "Pesan berhasil dikirim."
}
```

---

## 16.2 Get Admin Projects

Endpoint:

```txt
GET /api/admin/projects
```

Query optional:

```txt
?status=PUBLISHED&page=1&limit=10
```

Response:

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

---

## 16.3 Create Project

Endpoint:

```txt
POST /api/admin/projects
```

Request:

```json
{
  "title": "SaaS Landing Page",
  "slug": "saas-landing-page",
  "description": "Landing page modern untuk produk SaaS.",
  "category": "Landing Page",
  "tags": ["Next.js", "Tailwind", "SEO"],
  "demoUrl": "https://example.com",
  "repositoryUrl": null,
  "status": "DRAFT",
  "isFeatured": true
}
```

Response:

```json
{
  "success": true,
  "data": {
    "id": "project_id"
  }
}
```

---

## 17. Admin UX Requirements

### 17.1 Dashboard

Admin dashboard harus langsung memberi overview:

* Jumlah project.
* Pesan belum dibaca.
* Testimoni pending.
* Quick action button.

### 17.2 Form UX

Setiap form harus memiliki:

* Label jelas.
* Placeholder singkat.
* Error message per field.
* Save button.
* Cancel button.
* Loading state.
* Success toast.
* Confirmation dialog untuk delete.

### 17.3 Table UX

Table admin harus memiliki:

* Search.
* Filter status.
* Pagination.
* Empty state.
* Action menu.
* Responsive card view di mobile.

---

## 18. Public UX Requirements

### 18.1 CTA

CTA utama:

```txt
Lihat Karya Saya
```

CTA secondary:

```txt
Hubungi Saya
```

CTA contact:

```txt
Ayo Berkolaborasi
```

### 18.2 Visitor Flow

Flow utama visitor:

```txt
Open Landing Page
→ Read Hero
→ View Featured Work
→ Check Services
→ Read Testimonials
→ Submit Contact Form
```

### 18.3 Conversion Points

Website harus punya CTA di:

* Hero section.
* Featured work section.
* Services section.
* Contact section.
* Footer.

---

## 19. Authentication Requirement

Untuk MVP, gunakan single admin authentication.

### Option A — NextAuth/Auth.js

Kelebihan:

* Lebih standar.
* Session handling matang.
* Bisa tambah OAuth nanti.

Kekurangan:

* Setup sedikit lebih kompleks.

### Option B — Custom Credential Auth

Kelebihan:

* Lebih sederhana untuk single admin.
* Kontrol penuh.

Kekurangan:

* Harus hati-hati dengan security.

### Recommendation

Gunakan **Auth.js credential provider** untuk production-friendly setup.

---

## 20. Database Seed Requirement

Seed data wajib tersedia untuk development.

Seed harus membuat:

* 1 admin user.
* 3 project sample.
* 5 timeline sample.
* 3 testimonial sample.
* 1 site setting.
* Beberapa site content default.

Contoh admin development:

```txt
email: admin@zagoour.dev
password: password123
```

Password wajib di-hash di seed.

---

## 21. Environment Variables

```env
DATABASE_URL="postgresql://user:password@localhost:5432/zagoour_portfolio"

NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"

ADMIN_DEFAULT_EMAIL="admin@zagoour.dev"
ADMIN_DEFAULT_PASSWORD="password123"

UPLOAD_PROVIDER="external_url"
```

Untuk production:

```env
NEXTAUTH_URL="https://yourdomain.com"
DATABASE_URL="production-database-url"
NEXTAUTH_SECRET="strong-random-secret"
```

---

## 22. MVP Scope

### Public

* Landing page.
* Hero section.
* About section.
* Featured projects.
* Services section.
* Timeline section.
* Testimonials section.
* Contact form.
* Footer.

### Admin

* Login/logout.
* Dashboard overview.
* CRUD project.
* CRUD timeline.
* CRUD testimonial.
* View/delete messages.
* Edit basic site content.
* Edit basic site settings.

### Technical

* Prisma schema.
* PostgreSQL database.
* Seed data.
* Zod validation.
* Protected admin routes.
* Responsive UI.
* SEO metadata.

---

## 23. Future Scope

### Version 1.1

* Image upload.
* Rich text editor for project case study.
* Project detail page.
* Blog section.
* Sitemap dynamic.
* Better analytics.

### Version 1.2

* AI bio generator.
* AI project description generator.
* AI SEO metadata generator.
* AI testimonial summarizer.

### Version 2.0

* Multi-user admin.
* Role-based access control.
* Multi-portfolio support.
* Theme customization.
* Client handoff mode.
* Template marketplace mode.

---

## 24. Success Metrics

### Product Metrics

* Visitor dapat memahami jasa dalam kurang dari 10 detik.
* Contact form submission berhasil tanpa error.
* Admin dapat publish project baru tanpa edit kode.
* Website responsive di mobile dan desktop.
* Lighthouse SEO minimal 90.
* Lighthouse Accessibility minimal 90.
* Lighthouse Performance minimal 90.

### Business Metrics

* Jumlah pesan masuk dari contact form.
* Jumlah klik CTA WhatsApp/email.
* Jumlah view project.
* Jumlah visitor landing page.
* Conversion rate visitor ke lead.

---

## 25. Risks & Mitigation

### Risk 1 — Desain terlalu ramai

Mitigation:

* Batasi decorative elements.
* Gunakan spacing konsisten.
* Pastikan hierarchy text jelas.

### Risk 2 — Admin terlalu kompleks untuk MVP

Mitigation:

* Prioritaskan CRUD utama.
* Tunda analytics advanced.
* Tunda rich text editor.

### Risk 3 — Upload image menambah kompleksitas

Mitigation:

* MVP gunakan image URL.
* Tambahkan upload provider di phase berikutnya.

### Risk 4 — Security admin kurang kuat

Mitigation:

* Gunakan Auth.js.
* Hash password.
* Protect route handler.
* Validasi semua input.
* Rate limit endpoint contact.

---

## 26. Development Phases

## Phase 1 — Project Setup

Deliverables:

* Next.js project.
* Tailwind setup.
* Prisma setup.
* PostgreSQL connection.
* Base layout.
* Design tokens.
* Reusable UI components.

Checklist:

* `brutal-card`
* `brutal-button`
* `brutal-input`
* `section-label`
* `floating-navbar`

---

## Phase 2 — Public Landing Page

Deliverables:

* Hero section.
* Trusted by section.
* About section.
* Featured work section.
* Services section.
* Timeline section.
* Testimonials section.
* Contact section.
* Footer.

---

## Phase 3 — Database & Prisma

Deliverables:

* Prisma schema.
* Migration.
* Seed data.
* Prisma client singleton.
* Service layer.

---

## Phase 4 — Admin Auth

Deliverables:

* Login page.
* Logout.
* Protected admin layout.
* Session handling.
* Admin middleware.

---

## Phase 5 — Admin CRUD

Deliverables:

* Projects CRUD.
* Timeline CRUD.
* Testimonials CRUD.
* Messages management.
* Content editor.
* Settings editor.

---

## Phase 6 — Production Polish

Deliverables:

* SEO metadata.
* Sitemap.
* Robots.txt.
* Loading states.
* Error states.
* Empty states.
* Responsive optimization.
* Performance optimization.

---

## 27. Acceptance Criteria MVP

MVP dianggap selesai jika:

* Public landing page tampil sesuai tema Neobrutalism Light.
* Website responsive di mobile dan desktop.
* Admin bisa login.
* Admin bisa CRUD project.
* Admin bisa CRUD timeline.
* Admin bisa CRUD testimonial.
* Contact form bisa menyimpan pesan ke database.
* Admin bisa melihat pesan masuk.
* Admin bisa mengubah konten utama landing page.
* Data public berasal dari database.
* Prisma migration berjalan tanpa error.
* Seed data berhasil dijalankan.
* Website bisa dideploy ke Vercel.
* Tidak ada TypeScript error.
* Tidak ada route admin yang bisa diakses tanpa login.
* `npm run typecheck` sukses tanpa TypeScript error.
* `npm run lint` sukses tanpa blocking issue.
* `npm run build` sukses.
* Prisma validate/generate/migrate sukses saat Phase 3 dijalankan.

---

## 28. Recommended Implementation Order

Urutan pengerjaan paling aman:

```txt
1. Setup Next.js + Tailwind + Prisma
2. Buat design tokens dan komponen UI brutalist
3. Buat Prisma schema dan seed data
4. Buat public landing page pakai data dummy
5. Connect public landing page ke database
6. Buat auth admin
7. Buat admin dashboard
8. Buat CRUD project
9. Buat CRUD timeline
10. Buat CRUD testimonial
11. Buat contact form dan messages page
12. Buat content/settings editor
13. Polish responsive, SEO, loading, empty state
14. Deploy production
```

---

## 29. Final Product Statement

Zagoour Portfolio System adalah website portfolio fullstack berbasis Next.js dan Prisma yang menggabungkan landing page personal branding dengan admin dashboard. Produk ini dirancang untuk membantu developer/freelancer menampilkan karya, membangun kredibilitas, dan mendapatkan calon client melalui tampilan Neobrutalism Light yang kuat, modern, dan mudah dikelola.
