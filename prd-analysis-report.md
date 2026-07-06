# PRD Analysis Report — Zagoour Portfolio System

Sumber analisis: `PRD.md`
Mode: `all` (`review` + `validate` + `gap`)
Tanggal analisis: 2026-07-05

## PRD Review Report

### Kelengkapan Struktur

| Section | Status | Catatan |
|---------|--------|---------|
| Overview & tujuan produk | Ada | Ringkasan produk, background, goals, dan final product statement sudah jelas. |
| Target user & persona | Ada | Ada admin dan visitor, tetapi persona visitor masih berbasis tipe umum, belum ada persona prioritas. |
| Business model | Kurang | Tujuan lead generation dan reusable system ada, tetapi model monetisasi belum eksplisit. |
| Feature list dengan prioritas | Ada | MVP scope, future scope, functional requirements, dan phase sudah tersedia. |
| Tech stack | Ada, perlu sinkron | Tech stack ada, tetapi belum sinkron penuh dengan standar project di `AGENTS.md`. |
| Task list atomik | Kurang | Ada development phases dan implementation order, tetapi belum berupa task atomik bertag `[FE]`, `[BE]`, `[AI]`, `[OPS]`. |
| Non-functional requirements | Ada | Performance, SEO, security, accessibility, responsive sudah dicakup. |
| Out of scope | Ada | Non-goals dan future scope sudah jelas. |
| Success metrics / KPI | Ada | Product metrics dan business metrics ada, tetapi beberapa belum punya metode tracking. |
| Timeline / milestone | Ada | Phase 1-6 ada, tetapi belum ada estimasi durasi atau dependency detail per task. |

### Ambiguitas Ditemukan

1. **[Baris 21]** "AI integration" disebut sebagai jasa yang ditargetkan.
   Saran: Jelaskan apakah AI integration hanya bagian layanan yang ditampilkan di portfolio atau fitur aplikasi yang harus dibangun. Saat ini AI chatbot masuk non-goals, tetapi AI integration juga muncul sebagai service.

2. **[Baris 130-132]** "Shadcn UI optional" dan "Framer Motion optional".
   Saran: Sinkronkan dengan standar project. Untuk repo ini, gunakan `shadcn/ui` sebagai default, Motion hanya untuk animasi ringan yang jelas manfaat UX-nya.

3. **[Baris 139]** "NextAuth/Auth.js atau custom session auth".
   Saran: Kunci menjadi Auth.js credential provider sesuai rekomendasi PRD dan standar keamanan, agar implementer tidak memilih ulang.

4. **[Baris 148-154]** "Local upload atau external image URL" lalu beberapa provider production.
   Saran: Untuk MVP tetapkan external image URL saja, karena upload image sudah masuk future scope dan risk mitigation.

5. **[Baris 507]** "Total page views optional".
   Saran: Hapus dari MVP atau tetapkan cara tracking. Tanpa analytics storage/event tracking, metric ini akan menambah scope.

6. **[Baris 669]** "FCP di bawah 2 detik pada koneksi normal".
   Saran: Definisikan profil pengujian, misalnya Lighthouse mobile default atau Chrome desktop local, supaya acceptance tidak subjektif.

7. **[Baris 703]** "Sanitize input rich text jika ada".
   Saran: Karena rich text editor masuk future scope, MVP sebaiknya hanya plain text/textarea tanpa HTML.

8. **[Baris 878-888]** Prisma schema draft masih memakai pola Prisma lama.
   Saran: Ubah ke Prisma v7 project standard: `provider = "prisma-client"` dengan output eksplisit, dan pindahkan `DATABASE_URL` ke `prisma.config.ts`.

9. **[Baris 1187-1282]** API contract hanya mencakup contact dan project create/list.
   Saran: Tambahkan minimal contract untuk auth, timeline, testimonials, messages, content, settings, dan public read endpoints.

10. **[Baris 1518-1536]** Business metrics disebutkan tetapi belum ada event/source data.
    Saran: Tentukan apakah metrics hanya manual dari database atau butuh tracking event. Untuk MVP, batasi ke jumlah contact messages dan CTA clicks jika tracking dibuat.

### Missing Edge Case

1. **Admin login**: Belum ada handling akun tidak ditemukan, password salah, brute force/rate limit login, session expiry, dan redirect setelah login.
2. **Auth/session**: Belum ada definisi cookie attributes, CSRF strategy, refresh/session duration, dan behavior logout dari beberapa tab.
3. **Project CRUD**: Belum ada handling slug duplikat, slug auto-generation conflict, project delete saat masih published, URL tidak valid, tags terlalu banyak, dan sort order bentrok.
4. **Timeline CRUD**: Belum ada aturan jika dua item punya sort order sama, accent color invalid, icon tidak tersedia, atau year bukan format yang diinginkan.
5. **Testimonials**: Belum ada handling rating di luar 1-5 dari payload API, testimonial kosong, spam content, avatar URL invalid, dan status transition.
6. **Contact form**: Belum ada rate limit detail, anti-spam/honeypot, email domain invalid, pesan duplikat, payload terlalu panjang, dan network timeout UX.
7. **Messages admin**: Belum ada bulk action, pagination limit, konfirmasi delete, detail view untuk pesan yang sudah dihapus, dan mark-as-read race condition.
8. **Content/settings editor**: Belum ada aturan validasi untuk social links JSON, canonical URL invalid, metadata terlalu panjang, fallback jika setting kosong, dan concurrent edit.
9. **Public data fetch**: Belum ada fallback ketika database down, empty state untuk project/testimoni/timeline kosong, dan cache/revalidation strategy.
10. **Deployment**: Belum ada aturan migration failure, env var missing, seed hanya dev, dan Vercel build-time Prisma generate.

### Scope Creep Risk

1. **Stats dashboard**: "Total page views" butuh analytics/event tracking yang belum dirancang.
2. **Recent activity**: Butuh activity log model atau audit trail, belum ada di data model.
3. **Image upload**: PRD menyebut provider production, tetapi MVP risk mitigation menyarankan image URL. Jangan implement upload di MVP.
4. **Reusable system untuk client lain**: Bisa melebar ke theme customization, multi-tenant, dan handoff mode. PRD sudah menaruh beberapa di future scope, tetapi implementasi MVP perlu tetap single-site.
5. **AI Integration sebagai layanan**: Aman sebagai konten service, tetapi jangan berubah menjadi fitur AI app karena AI chatbot/generator masuk non-goals/future scope.
6. **Project detail / case study**: Featured card "bisa diklik" dapat mengimplikasikan detail page, padahal project detail masuk future scope.
7. **Dynamic sitemap**: SEO menyebut sitemap, future scope menyebut sitemap dynamic. Untuk MVP perlu diputuskan sitemap statis atau dynamic minimal.
8. **Admin settings data profil admin**: Bisa melebar ke profile management/password change, belum ada requirement rinci.

### Skor Kelengkapan PRD

- Struktur: 8/10
- Kejelasan: 7/10
- Edge Case Coverage: 5/10
- **Total: 20/30**

## Task List Validation Report

Status: task list sudah diperbaiki menjadi atomik, bertag, dan diurutkan sesuai dependency. Tidak ada task `[AI]` untuk MVP karena fitur AI berada di future scope/non-goals.

### Fixed Atomic Task List

#### Phase 0 — Requirement Lock

1. `[OPS]` Kunci stack MVP di PRD: Next.js 16, TypeScript, Tailwind v4, shadcn/ui, Prisma v7, PostgreSQL 16, Auth.js credential provider.
2. `[OPS]` Tetapkan MVP image strategy: external image URL only, tanpa upload provider.
3. `[OPS]` Tetapkan MVP analytics strategy: exclude page views/recent activity kecuali activity log dibuat.
4. `[OPS]` Tetapkan API response envelope untuk success/error semua Route Handler.
5. `[OPS]` Tetapkan acceptance command: `npm run typecheck`, `npm run lint`, `npm run build`, Prisma validate/generate/migrate.

#### Phase 1 — Project Bootstrap

1. `[FE]` Inisialisasi Next.js 16 App Router TypeScript di root project.
2. `[OPS]` Tambahkan `package.json` scripts: `dev`, `build`, `start`, `lint`, `typecheck`.
3. `[FE]` Konfigurasi Tailwind v4 dan import global styles.
4. `[FE]` Setup shadcn/ui base config.
5. `[OPS]` Tambahkan `.env.example` untuk DB, auth, admin seed, dan upload mode.
6. `[OPS]` Tambahkan Docker Compose PostgreSQL 16 di `docker/`.
7. `[FE]` Buat root layout dengan metadata default.
8. `[FE]` Buat design tokens Neobrutalism Light di global styles.
9. `[FE]` Buat `brutal-card` component.
10. `[FE]` Buat `brutal-button` component.
11. `[FE]` Buat `brutal-input` component.
12. `[FE]` Buat `brutal-textarea` component.
13. `[FE]` Buat `section-label` component.
14. `[FE]` Buat `status-badge` component.
15. `[FE]` Buat `floating-navbar` component.
16. `[FE]` Buat `footer` component.

#### Phase 2 — Prisma & Data Layer

1. `[BE]` Buat `prisma/schema.prisma` dengan enum dan model MVP.
2. `[BE]` Set Prisma v7 generator: `provider = "prisma-client"` dan output ke `../src/generated/prisma`.
3. `[BE]` Hapus `url` dari `datasource db` di schema.
4. `[BE]` Buat `prisma.config.ts` di root dengan `env("DATABASE_URL")`.
5. `[BE]` Tambahkan Prisma Client singleton memakai `@prisma/adapter-pg` dan `pg`.
6. `[BE]` Buat migration awal untuk PostgreSQL.
7. `[BE]` Buat `prisma/seed.ts` untuk admin user, projects, timeline, testimonials, site setting, dan site content.
8. `[BE]` Hash password admin seed dengan bcryptjs salt rounds 12.
9. `[BE]` Buat Zod schema `contact.schema.ts`.
10. `[BE]` Buat Zod schema `project.schema.ts`.
11. `[BE]` Buat Zod schema `timeline.schema.ts`.
12. `[BE]` Buat Zod schema `testimonial.schema.ts`.
13. `[BE]` Buat Zod schema `content.schema.ts`.
14. `[BE]` Buat Zod schema `settings.schema.ts`.
15. `[BE]` Buat `project.service.ts`.
16. `[BE]` Buat `timeline.service.ts`.
17. `[BE]` Buat `testimonial.service.ts`.
18. `[BE]` Buat `message.service.ts`.
19. `[BE]` Buat `content.service.ts`.
20. `[BE]` Buat `setting.service.ts`.
21. `[BE]` Buat helper `slugify.ts`.
22. `[BE]` Buat helper `format-date.ts`.

#### Phase 3 — Public Landing Page UI

1. `[FE]` Buat `src/app/page.tsx` dengan section order final.
2. `[FE]` Buat hero section responsive.
3. `[FE]` Buat trusted-by/tech-stack section.
4. `[FE]` Buat about section.
5. `[FE]` Buat featured work section dengan dummy fallback.
6. `[FE]` Buat services section static.
7. `[FE]` Buat timeline section dengan dummy fallback.
8. `[FE]` Buat testimonials section dengan dummy fallback.
9. `[FE]` Buat contact form UI.
10. `[FE]` Sambungkan CTA hero ke project/contact anchors.
11. `[FE]` Pastikan responsive layout untuk 360px, 768px, 1024px, 1440px.
12. `[FE]` Pastikan form labels, focus states, dan icon-only `aria-label`.

#### Phase 4 — Public Data & Contact API

1. `[BE]` Buat public data loader untuk site content/settings.
2. `[BE]` Buat public data loader untuk published featured projects.
3. `[BE]` Buat public data loader untuk timeline sorted by `sortOrder`.
4. `[BE]` Buat public data loader untuk approved testimonials.
5. `[FE]` Connect landing page sections ke public data loader.
6. `[BE]` Buat `POST /api/contact` Route Handler.
7. `[BE]` Validasi `POST /api/contact` dengan Zod.
8. `[BE]` Tambahkan rate limit untuk `POST /api/contact`.
9. `[FE]` Connect contact form ke `POST /api/contact`.
10. `[FE]` Tambahkan loading, success, dan error state contact form.
11. `[FE]` Tambahkan empty state untuk projects, timeline, testimonials.

#### Phase 5 — Admin Auth

1. `[BE]` Setup Auth.js credential provider.
2. `[BE]` Buat password verification dengan bcryptjs.
3. `[BE]` Tambahkan rate limit untuk login.
4. `[BE]` Konfigurasi session/cookie secure defaults.
5. `[FE]` Buat `/login` page.
6. `[FE]` Buat login form dengan field errors dan loading state.
7. `[BE]` Protect `/admin` routes via middleware/layout guard.
8. `[BE]` Protect semua `/api/admin/*` Route Handlers.
9. `[FE]` Buat logout action/button.
10. `[FE]` Redirect unauthenticated admin ke `/login`.

#### Phase 6 — Admin Dashboard

1. `[FE]` Buat `src/app/admin/layout.tsx`.
2. `[FE]` Buat admin navbar/sidebar.
3. `[BE]` Buat dashboard stats service.
4. `[FE]` Buat admin dashboard overview page.
5. `[FE]` Buat stats cards.
6. `[FE]` Buat recent projects panel.
7. `[FE]` Buat messages overview panel.
8. `[FE]` Buat quick actions panel.
9. `[FE]` Tambahkan loading state dashboard.
10. `[FE]` Tambahkan empty state dashboard.

#### Phase 7 — Admin Projects CRUD

1. `[BE]` Buat `GET /api/admin/projects` dengan pagination/filter.
2. `[BE]` Buat `POST /api/admin/projects`.
3. `[BE]` Buat `GET /api/admin/projects/[id]`.
4. `[BE]` Buat `PATCH /api/admin/projects/[id]`.
5. `[BE]` Buat `DELETE /api/admin/projects/[id]`.
6. `[BE]` Handle unique slug conflict.
7. `[FE]` Buat `/admin/projects` page.
8. `[FE]` Buat projects table desktop.
9. `[FE]` Buat projects card view mobile.
10. `[FE]` Tambahkan search/filter/pagination.
11. `[FE]` Buat project create page/form.
12. `[FE]` Buat project edit page/form.
13. `[FE]` Tambahkan publish/unpublish control.
14. `[FE]` Tambahkan featured toggle.
15. `[FE]` Tambahkan delete confirmation dialog.
16. `[FE]` Tambahkan loading/error/empty states.

#### Phase 8 — Admin Timeline CRUD

1. `[BE]` Buat `GET /api/admin/timeline`.
2. `[BE]` Buat `POST /api/admin/timeline`.
3. `[BE]` Buat `PATCH /api/admin/timeline/[id]`.
4. `[BE]` Buat `DELETE /api/admin/timeline/[id]`.
5. `[BE]` Sort timeline by `sortOrder`.
6. `[FE]` Buat `/admin/timeline` page.
7. `[FE]` Buat timeline manager list.
8. `[FE]` Buat timeline create/edit form.
9. `[FE]` Tambahkan sort order input.
10. `[FE]` Tambahkan delete confirmation dialog.
11. `[FE]` Tambahkan loading/error/empty states.

#### Phase 9 — Admin Testimonials CRUD

1. `[BE]` Buat `GET /api/admin/testimonials`.
2. `[BE]` Buat `POST /api/admin/testimonials`.
3. `[BE]` Buat `PATCH /api/admin/testimonials/[id]`.
4. `[BE]` Buat `DELETE /api/admin/testimonials/[id]`.
5. `[BE]` Validasi rating 1 sampai 5.
6. `[FE]` Buat `/admin/testimonials` page.
7. `[FE]` Buat testimonials table desktop.
8. `[FE]` Buat testimonials card view mobile.
9. `[FE]` Buat testimonial create/edit form.
10. `[FE]` Tambahkan status control `PENDING`, `APPROVED`, `HIDDEN`.
11. `[FE]` Tambahkan delete confirmation dialog.
12. `[FE]` Tambahkan loading/error/empty states.

#### Phase 10 — Admin Messages

1. `[BE]` Buat `GET /api/admin/messages` dengan pagination/filter unread.
2. `[BE]` Buat `GET /api/admin/messages/[id]`.
3. `[BE]` Buat `PATCH /api/admin/messages/[id]` untuk mark as read.
4. `[BE]` Buat `DELETE /api/admin/messages/[id]`.
5. `[FE]` Buat `/admin/messages` page.
6. `[FE]` Buat messages table desktop.
7. `[FE]` Buat messages card view mobile.
8. `[FE]` Buat message detail page.
9. `[FE]` Tambahkan mark as read action.
10. `[FE]` Tambahkan delete confirmation dialog.
11. `[FE]` Tambahkan mailto reply action.
12. `[FE]` Tambahkan loading/error/empty states.

#### Phase 11 — Admin Content & Settings

1. `[BE]` Buat `GET /api/admin/content`.
2. `[BE]` Buat `PATCH /api/admin/content`.
3. `[BE]` Buat `GET /api/admin/settings`.
4. `[BE]` Buat `PATCH /api/admin/settings`.
5. `[BE]` Validasi social links JSON.
6. `[BE]` Validasi canonical URL dan metadata length.
7. `[FE]` Buat `/admin/content` page.
8. `[FE]` Buat content editor form.
9. `[FE]` Buat `/admin/settings` page.
10. `[FE]` Buat settings form.
11. `[FE]` Tambahkan save/cancel/loading/success/error states.
12. `[FE]` Connect public metadata ke site settings.

#### Phase 12 — SEO, Accessibility, Production Polish

1. `[BE]` Buat dynamic metadata fallback dari site settings.
2. `[BE]` Buat `sitemap.ts` minimal untuk public routes.
3. `[BE]` Buat `robots.ts`.
4. `[FE]` Audit semantic heading landing page.
5. `[FE]` Audit WCAG AA contrast untuk palette.
6. `[FE]` Audit responsive public page untuk 360px, 768px, 1024px, 1440px.
7. `[FE]` Audit responsive admin pages untuk mobile card view.
8. `[FE]` Tambahkan global not-found/error boundaries.
9. `[OPS]` Jalankan Prisma validate/generate/migrate.
10. `[OPS]` Jalankan `npm run typecheck`.
11. `[OPS]` Jalankan `npm run lint`.
12. `[OPS]` Jalankan `npm run build`.
13. `[OPS]` Dokumentasikan env dan deploy steps untuk Vercel.

### Fixed Dependency Order

1. Requirement lock sebelum bootstrap.
2. Bootstrap/env/Docker sebelum Prisma migration.
3. Prisma schema/service/Zod sebelum Route Handler.
4. Public UI boleh pakai dummy fallback sebelum DB connect.
5. Auth sebelum semua `/admin` page dan `/api/admin/*`.
6. CRUD backend sebelum admin UI integration.
7. SEO/polish setelah data flow stabil.

### Skor Task List Setelah Fix

- Atomik: 9/10
- Tag Compliance: 10/10
- Logical Order: 9/10
- Completeness: 9/10
- **Total: 37/40**

## Gap Analysis Report

### Implementasi Aktual

Struktur repo saat analisis:

- `PRD.md` ada.
- `AGENTS.md` dan `CLAUDE.md` ada.
- `.agents/skills/*` ada.
- `design/DESIGN.md` ada.
- `src/` tidak ada.
- `package.json` tidak ada.
- `prisma/` tidak ada.
- `prisma.config.ts` tidak ada.

Kesimpulan: kode aplikasi belum dimulai di repo ini. Gap analysis menilai semua fitur produk sebagai `Not Started`.

### Feature Coverage

| Fitur | PRD | Implementasi | Status | Catatan |
|-------|-----|---------------|--------|---------|
| Public landing page `/` | Ada | Tidak ada | Not Started | Belum ada `src/app/page.tsx`. |
| Floating navbar | Ada | Tidak ada | Not Started | Belum ada komponen layout. |
| Hero section | Ada | Tidak ada | Not Started | Belum ada komponen section. |
| Trusted By / Tech Stack | Ada | Tidak ada | Not Started | Belum ada komponen section. |
| About section | Ada | Tidak ada | Not Started | Belum ada komponen section. |
| Featured work | Ada | Tidak ada | Not Started | Belum ada data model, service, atau UI. |
| Services section | Ada | Tidak ada | Not Started | Belum ada komponen/data. |
| Timeline section | Ada | Tidak ada | Not Started | Belum ada schema/service/UI. |
| Testimonials section | Ada | Tidak ada | Not Started | Belum ada schema/service/UI. |
| Contact section/form | Ada | Tidak ada | Not Started | Belum ada UI atau `POST /api/contact`. |
| Footer | Ada | Tidak ada | Not Started | Belum ada komponen footer. |
| Login `/login` | Ada | Tidak ada | Not Started | Belum ada Auth.js/custom auth. |
| Admin dashboard `/admin` | Ada | Tidak ada | Not Started | Belum ada protected admin route. |
| Stats cards | Ada | Tidak ada | Not Started | Belum ada database/service. |
| Admin projects CRUD | Ada | Tidak ada | Not Started | Belum ada route handler/table/form. |
| Admin timeline CRUD | Ada | Tidak ada | Not Started | Belum ada route handler/manager. |
| Admin testimonials CRUD | Ada | Tidak ada | Not Started | Belum ada route handler/table/form. |
| Admin messages management | Ada | Tidak ada | Not Started | Belum ada route handler/page. |
| Admin content editor | Ada | Tidak ada | Not Started | Belum ada route handler/form. |
| Admin settings editor | Ada | Tidak ada | Not Started | Belum ada route handler/form. |
| Prisma schema | Ada draft | Tidak ada | Not Started | Draft PRD belum sesuai Prisma v7 project standard. |
| Prisma config root | Perlu | Tidak ada | Not Started | `prisma.config.ts` belum ada. |
| Seed data | Ada requirement | Tidak ada | Not Started | `prisma/seed.ts` belum ada. |
| Zod validation | Ada | Tidak ada | Not Started | Belum ada validation schemas. |
| SEO metadata | Ada | Tidak ada | Not Started | Belum ada Next metadata/sitemap/robots. |
| Rate limit contact | Ada | Tidak ada | Not Started | Belum ada implementation. |
| Responsive UI | Ada | Tidak ada | Not Started | Belum ada aplikasi UI. |
| Docker/local DB setup | Implied by standards | Tidak ada | Not Started | Tidak ada `docker/` atau compose file. |

### API Contract Validation

| Endpoint PRD | Implementasi | Status | Catatan |
|--------------|--------------|--------|---------|
| `POST /api/contact` | Tidak ada | Not Started | Contract success ada, error response belum didefinisikan. |
| `GET /api/admin/projects` | Tidak ada | Not Started | Contract list ada. Auth requirement belum eksplisit di API contract. |
| `POST /api/admin/projects` | Tidak ada | Not Started | Contract create ada. Error response dan unique slug handling belum didefinisikan. |
| Auth endpoint/session | Tidak ada | Missing Contract | Route structure menyebut `src/app/api/auth/route.ts`, tetapi detail Auth.js route/session belum jelas. |
| Timeline CRUD | Tidak ada | Missing Contract | Ada route structure, belum ada request/response contract. |
| Testimonials CRUD | Tidak ada | Missing Contract | Ada route structure, belum ada request/response contract. |
| Messages read/delete | Tidak ada | Missing Contract | Ada route structure, belum ada request/response contract. |
| Content/settings | Tidak ada | Missing Contract | Ada route structure, belum ada request/response contract. |
| Public data endpoints/server fetch | Tidak ada | Missing Contract | PRD belum menjelaskan apakah public data lewat Route Handler atau server service langsung. |

### Fitur Undocumented

Tidak ada fitur undocumented di kode karena aplikasi belum ada. File yang ada hanya dokumen, desain, dan skill agent.

### Progress Summary

- Total fitur utama di PRD: 25
- Implemented: 0 (0%)
- Partial: 0 (0%)
- Not Started: 25 (100%)
- Undocumented: 0

## Rekomendasi Revisi PRD Sebelum Implementasi

1. Sinkronkan Prisma section dengan Prisma v7 standar project:
   - `generator client { provider = "prisma-client"; output = "../src/generated/prisma" }`
   - `datasource db { provider = "postgresql" }`
   - `DATABASE_URL` pindah ke `prisma.config.ts`
   - PrismaClient memakai `@prisma/adapter-pg` dan `pg`

2. Kunci pilihan auth:
   - Pakai Auth.js credential provider.
   - Tetapkan protected route strategy untuk `/admin` dan `/api/admin/*`.
   - Tambahkan rate limit login dan contact.

3. Development phases sudah diperbaiki menjadi task atomik bertag:
   - Semua task memakai `[FE]`, `[BE]`, atau `[OPS]`.
   - `[AI]` tidak dipakai di MVP karena fitur AI aktual berada di future scope/non-goals.

4. Perjelas MVP data flow:
   - Public page baca database lewat Server Components/service layer.
   - Admin mutations lewat Route Handlers dengan Zod validation.
   - TanStack Query dipakai untuk server state di admin UI.

5. Batasi MVP agar tidak melebar:
   - Image upload, rich text editor, analytics advanced, project detail page, blog, dan AI generator tetap future scope.
   - Jika card project harus clickable di MVP, arahkan ke demo URL atau repository URL, bukan membuat project detail page.

6. Tambahkan API contract minimal untuk semua resource admin:
   - Method, path, query/body, success response, error response, auth requirement.

7. Tambahkan acceptance criteria teknis:
   - `npm run typecheck` zero error.
   - `npm run lint` zero blocking issue.
   - `npm run build` sukses.
   - Prisma validate/generate/migrate sukses.
   - Admin routes tidak bisa diakses tanpa login.

## Skor Akhir

- PRD Review: 20/30
- Task List Validation: 37/40
- Gap Progress: 0% implemented

Kesimpulan: PRD sudah kuat sebagai product brief, dan task list di report ini sudah diperbaiki menjadi urutan kerja atomik yang bisa dieksekusi. Prioritas berikutnya adalah menerapkan task list fixed ke `PRD.md` jika PRD utama juga ingin disinkronkan.
