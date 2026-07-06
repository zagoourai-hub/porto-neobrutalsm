# Design.md — Portfolio & Admin Dashboard Neobrutalism Light

## 1. Konsep Utama

**Nama konsep:** `Bright Brutal Portfolio System`

Design ini menggunakan gaya **Neobrutalism Light**: terang, tegas, ekspresif, dan mudah dikenali. Fokus visualnya ada pada kombinasi **background putih/krem**, **border hitam tebal**, **shadow keras**, **warna aksen cerah**, dan **typography bold**.

Tujuan desain:

* Menampilkan personal brand sebagai developer/designer yang kreatif.
* Membuat portfolio terasa modern, fun, dan profesional.
* Menonjolkan project, skill, timeline perjalanan, testimoni, dan kontak.
* Menyediakan halaman admin untuk mengelola konten portfolio tanpa mengubah style utama.
* Cocok untuk freelancer, developer portfolio, UI/UX designer, creative developer, dan personal branding.

---

## 2. Design Personality

### Karakter Visual

* Bold
* Playful
* Clean
* High contrast
* Geometris
* Editorial
* Modern brutalist
* Tidak terlalu gelap
* Tidak terlalu corporate

### Kesan yang ingin dibangun

Website harus terasa seperti:

> “Portfolio developer kreatif yang berani, profesional, dan punya karakter kuat.”

Bukan seperti dashboard SaaS biasa, bukan juga portfolio minimalis generik.

---

## 3. Visual Direction

### Style

* Neobrutalism light
* Floating navigation
* Thick black borders
* Hard drop shadow
* Sticker-like UI
* Card-based layout
* Bright accent colors
* Decorative doodles
* Section labels seperti tag/sticker
* Grid layout yang rapi tapi tetap ekspresif

### Hindari

* Glassmorphism berlebihan
* Gradient pastel terlalu soft
* Dark mode dominan
* UI terlalu corporate
* Shadow blur halus
* Border tipis tanpa karakter
* Typography terlalu elegan/serif

---

## 4. Color Tokens

### Primary Palette

| Token             |       Hex | Fungsi                   |
| ----------------- | --------: | ------------------------ |
| `--color-bg`      | `#FFFDF4` | Background utama         |
| `--color-surface` | `#FFFFFF` | Card, navbar, panel      |
| `--color-ink`     | `#0A0A0A` | Text utama, border utama |
| `--color-muted`   | `#5F5F5F` | Text secondary           |
| `--color-border`  | `#111111` | Border brutalist         |

### Accent Palette

| Token            |       Hex | Fungsi                           |
| ---------------- | --------: | -------------------------------- |
| `--color-yellow` | `#FFF200` | CTA utama, active nav, highlight |
| `--color-cyan`   | `#35DCE8` | Section tag, icon, highlight     |
| `--color-pink`   | `#FF4FA3` | Badge, alert, decorative         |
| `--color-purple` | `#9B5CFF` | Sticker, admin action, timeline  |
| `--color-green`  | `#8CFF63` | Success status                   |
| `--color-red`    | `#FF4D4D` | Delete/error action              |

### Neutral Palette

| Token              |       Hex | Fungsi              |
| ------------------ | --------: | ------------------- |
| `--color-gray-50`  | `#FAFAFA` | Soft surface        |
| `--color-gray-100` | `#F1F1F1` | Input background    |
| `--color-gray-300` | `#D7D7D7` | Divider ringan      |
| `--color-gray-700` | `#3D3D3D` | Secondary dark text |

### CSS Variables

```css
:root {
  --color-bg: #fffdf4;
  --color-surface: #ffffff;
  --color-ink: #0a0a0a;
  --color-muted: #5f5f5f;
  --color-border: #111111;

  --color-yellow: #fff200;
  --color-cyan: #35dce8;
  --color-pink: #ff4fa3;
  --color-purple: #9b5cff;
  --color-green: #8cff63;
  --color-red: #ff4d4d;

  --shadow-hard-sm: 3px 3px 0 #111111;
  --shadow-hard-md: 5px 5px 0 #111111;
  --shadow-hard-lg: 8px 8px 0 #111111;

  --radius-none: 0px;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 18px;
  --radius-pill: 999px;
}
```

---

## 5. Typography

### Font Direction

Gunakan font sans-serif yang tebal dan modern.

Rekomendasi:

* Heading: `Archivo Black`, `Anton`, `Bebas Neue`, atau `Space Grotesk`
* Body: `Inter`, `Geist Sans`, atau `DM Sans`
* Label/Button: `Space Grotesk` atau `Inter Tight`

### Type Scale

| Token        |   Size | Line Height | Weight | Fungsi                |
| ------------ | -----: | ----------: | -----: | --------------------- |
| `display-xl` | `96px` |       `0.9` |  `900` | Hero headline desktop |
| `display-lg` | `72px` |       `0.9` |  `900` | Hero headline tablet  |
| `display-md` | `48px` |         `1` |  `900` | Hero mobile           |
| `heading-xl` | `40px` |      `1.05` |  `900` | Section besar         |
| `heading-lg` | `32px` |       `1.1` |  `800` | Card title besar      |
| `heading-md` | `24px` |       `1.2` |  `800` | Section title         |
| `body-lg`    | `18px` |       `1.6` |  `500` | Paragraph utama       |
| `body-md`    | `16px` |       `1.6` |  `400` | Body normal           |
| `body-sm`    | `14px` |       `1.5` |  `400` | Caption               |
| `label`      | `13px` |         `1` |  `800` | Button, badge, nav    |

### Heading Style

```css
.heading-brutal {
  font-family: "Archivo Black", sans-serif;
  font-weight: 900;
  letter-spacing: -0.05em;
  text-transform: uppercase;
  color: var(--color-ink);
}
```

---

## 6. Layout System

### Container

```css
.container {
  width: min(100% - 32px, 1280px);
  margin-inline: auto;
}
```

### Section Spacing

| Area                | Desktop | Mobile |
| ------------------- | ------: | -----: |
| Hero padding top    | `120px` | `96px` |
| Hero padding bottom |  `72px` | `48px` |
| Section vertical    |  `80px` | `48px` |
| Card gap            |  `24px` | `16px` |
| Grid gap            |  `24px` | `16px` |

### Grid

Desktop:

* 12-column layout
* Gap `24px`
* Max width `1280px`

Tablet:

* 6-column layout
* Gap `20px`

Mobile:

* 1-column stacked layout
* Gap `16px`

---

## 7. Core UI Style

### Brutalist Card

Semua card utama memakai:

* Background putih
* Border hitam `2px`
* Shadow keras
* Radius kecil sampai medium
* Tidak memakai blur shadow

```css
.brutal-card {
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  box-shadow: var(--shadow-hard-md);
  border-radius: var(--radius-md);
}
```

### Section Label

Label section berbentuk seperti sticker.

```css
.section-label {
  display: inline-flex;
  align-items: center;
  padding: 10px 16px;
  border: 2px solid var(--color-border);
  box-shadow: var(--shadow-hard-sm);
  background: var(--color-yellow);
  font-size: 13px;
  font-weight: 900;
  text-transform: uppercase;
}
```

Variasi warna label:

* About: cyan
* Featured Work: pink
* Services: yellow
* Timeline: purple
* Testimonials: cyan
* Contact: yellow

---

## 8. Floating Navbar

### Desktop Navbar

Navbar dibuat melayang di atas halaman.

Karakter:

* Fixed top
* Centered container
* White background
* Thick border
* Pill radius
* Hard shadow
* Active menu warna kuning
* CTA kanan berwarna kuning

Struktur menu:

* Home
* About
* Work
* Services
* Timeline
* Contact
* CTA: Let’s Talk

```css
.floating-navbar {
  position: fixed;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 50;
  width: min(100% - 32px, 1180px);
  height: 72px;
  background: var(--color-surface);
  border: 3px solid var(--color-border);
  border-radius: var(--radius-pill);
  box-shadow: var(--shadow-hard-lg);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 18px 0 28px;
}
```

### Mobile Navbar

Mobile menggunakan:

* Top floating pill
* Logo kiri
* Menu button kanan
* Optional bottom floating navigation untuk shortcut

Mobile menu terbuka sebagai full-screen drawer dengan style brutalist.

---

## 9. Buttons

### Primary Button

```css
.btn-primary {
  background: var(--color-yellow);
  color: var(--color-ink);
  border: 2px solid var(--color-border);
  box-shadow: var(--shadow-hard-sm);
  padding: 14px 22px;
  font-size: 14px;
  font-weight: 900;
  text-transform: uppercase;
}
```

Hover:

* Translate `-2px -2px`
* Shadow membesar
* Background tetap kuning

```css
.btn-primary:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0 #111111;
}
```

### Secondary Button

```css
.btn-secondary {
  background: #ffffff;
  color: var(--color-ink);
  border: 2px solid var(--color-border);
  box-shadow: var(--shadow-hard-sm);
}
```

### Danger Button

Dipakai di admin untuk delete.

```css
.btn-danger {
  background: #ffffff;
  color: var(--color-red);
  border: 2px solid var(--color-red);
}
```

---

## 10. Portfolio Landing Page Structure

## 10.1 Hero Section

### Tujuan

Menjelaskan siapa pemilik portfolio, apa keahliannya, dan langsung memberi CTA.

### Layout Desktop

Kiri:

* Large headline:

  * `HI, I'M`
  * `ZAGOOOUR`
* Role badge:

  * `FULLSTACK DEVELOPER & UI/UX DESIGNER`
* Short description
* CTA:

  * `Lihat Karya Saya`
  * `Unduh CV`

Kanan:

* Portrait image bergaya cutout
* Background yellow block
* Cyan geometric shape
* Sticker text:

  * `BUILDING DIGITAL IMPACT`
* Info cards:

  * Based in Indonesia
  * 4+ Years Experience

### Content Example

```txt
HI, I'M ZAGOOOUR

FULLSTACK DEVELOPER & UI/UX DESIGNER

Saya membangun produk digital yang fungsional, estetis, dan berdampak untuk membantu bisnis tumbuh lebih cepat.
```

### Visual Notes

* Headline sangat besar.
* Nama diberi underline cyan atau highlight kuning.
* Tambahkan doodle arrow, star, lightning, dan dot pattern.
* Image harus terlihat seperti sticker/cutout.

---

## 10.2 Trusted By Section

### Tujuan

Membangun trust melalui stack/brand yang familiar.

### Isi

* Next.js
* TypeScript
* NestJS
* Prisma
* PostgreSQL
* Docker
* Vercel

### Style

* Horizontal strip
* Border hitam
* White background
* Shadow keras
* Logo grayscale atau hitam
* Label kiri: `TRUSTED BY`

---

## 10.3 About Section

### Tujuan

Menjelaskan value personal secara singkat.

### Layout

* Card about di kiri
* Statistic cards di kanan

### Cards

1. About card

   * Section label: `Tentang Saya`
   * Icon smile/star
   * Short paragraph
   * CTA: `Selengkapnya`

2. Stats cards

   * `40+ Project Selesai`
   * `20+ Klien Puas`
   * `4+ Tahun Pengalaman`
   * `10+ Teknologi Dipahami`

### Style

* Setiap stats card memakai angka besar.
* Accent underline berbeda warna.
* Icon bulat dengan warna cerah.

---

## 10.4 Featured Work Section

### Tujuan

Menampilkan project terbaik secara visual.

### Layout

Desktop:

* 3-column project cards

Mobile:

* Horizontal scroll atau stacked cards

### Project Card Structure

* Thumbnail
* Category badge
* Project title
* Short description
* Arrow button
* Tags optional

### Example Projects

#### Project Management App

Kategori: `Web App`

Deskripsi:

```txt
Aplikasi manajemen proyek dengan fitur task, timeline, dan kolaborasi tim.
```

#### SaaS Landing Page

Kategori: `Landing Page`

Deskripsi:

```txt
Landing page modern untuk produk SaaS dengan fokus konversi tinggi.
```

#### E-Commerce Website

Kategori: `E-Commerce`

Deskripsi:

```txt
Website e-commerce lengkap dengan keranjang, pembayaran, dan admin panel.
```

### Hover Behavior

* Card naik sedikit
* Shadow membesar
* Arrow button berubah warna kuning
* Thumbnail scale kecil `1.03`

---

## 10.5 Services Section

### Tujuan

Menjelaskan jasa yang ditawarkan.

### Layout

4 cards horizontal desktop, stacked mobile.

### Services

1. Web Development
2. UI/UX Design
3. API & Integration
4. Performance Optimization

### Card Content

Setiap card berisi:

* Icon besar
* Title
* Short description
* Arrow mini button

### Copy

```txt
Web Development
Membangun website dan web app modern, cepat, dan scalable.

UI/UX Design
Merancang antarmuka yang menarik, intuitif, dan berorientasi pada pengguna.

API & Integration
Membuat dan mengintegrasikan RESTful API untuk berbagai kebutuhan.

Performance Optimization
Mengoptimalkan performa website agar lebih cepat dan SEO friendly.
```

---

## 10.6 Timeline Section

### Tujuan

Menampilkan perjalanan karier/project secara ringkas.

### Layout

Horizontal timeline desktop.

Mobile:

* Vertical timeline

### Timeline Items

#### 2021 — Start Freelance

```txt
Memulai perjalanan sebagai freelancer dan membangun proyek pertama.
```

#### 2022 — First 10 Clients

```txt
Mendapatkan 10 klien pertama dan membangun kepercayaan.
```

#### 2023 — Build SaaS Projects

```txt
Mulai membangun produk SaaS dan fokus pada solusi digital.
```

#### 2024 — Expand Services

```txt
Memperluas layanan ke web development dan integrasi AI.
```

#### 2025 — Product & Automation

```txt
Fokus pada product building dan otomasi untuk efisiensi bisnis.
```

### Style

* Timeline line hitam
* Dot setiap milestone
* Dot punya warna berbeda
* Card milestone memakai border hitam dan shadow keras
* Icon sticker-style

---

## 10.7 Testimonials Section

### Tujuan

Menambah kredibilitas.

### Layout

Desktop:

* 2 testimonial cards horizontal

Mobile:

* Slider atau stacked

### Testimonial Card

Berisi:

* Avatar
* Quote icon
* Testimonial text
* Rating stars
* Name
* Role/company

### Example

```txt
Zagoour sangat profesional dan memahami kebutuhan bisnis kami. Hasil akhirnya melebihi ekspektasi.
```

---

## 10.8 Contact Section

### Tujuan

Mengubah visitor menjadi lead/client.

### Layout

Kiri:

* Big headline:

  * `PUNYA PROJEK MENARIK?`
* Short paragraph
* CTA button:

  * `Ayo Berkolaborasi`

Tengah:

* Contact form:

  * Nama Lengkap
  * Email
  * Subjek
  * Pesan Anda
  * Button: `Kirim Pesan`

Kanan:

* Contact info
* Social links

### Style

* Section besar dengan border hitam
* Left panel bisa memakai yellow background
* Form tetap putih
* Social icons memakai square brutalist buttons

---

## 10.9 Footer

### Structure

* Logo
* Short description
* Navigation links
* Services links
* Social links
* Contact info
* Copyright

### Footer Style

* White surface
* Top border hitam
* Grid 4 columns desktop
* Stacked mobile

---

# 11. Admin Dashboard Design

## 11.1 Admin Concept

Admin dashboard harus tetap satu visual system dengan landing page.

Karakter:

* Tidak seperti dashboard SaaS abu-abu biasa.
* Tetap memakai brutalist card, warna cerah, dan typography bold.
* Fokus untuk mengelola konten portfolio dengan cepat.

---

## 11.2 Admin Navbar

### Menu

* Dashboard
* Projects
* Timeline
* Testimonials
* Messages
* Content
* Settings
* CTA: Publish Changes

### Style

* Floating navbar sama seperti landing page
* Active menu kuning
* Messages memiliki notification badge pink
* Publish button warna kuning

---

## 11.3 Admin Hero

### Content

Headline:

```txt
HALAMAN ADMIN
```

Description:

```txt
Kelola dan perbarui konten portfolio ZAGOOOUR. Semua perubahan akan tampil di website utama.
```

Kanan:

* Portrait visual
* Info cards:

  * Based in Indonesia
  * 4+ Years Experience

---

## 11.4 Admin Stats Cards

### Cards

1. Total Projects

   * `40+`
   * `↑ 12% dari bulan lalu`

2. Pesan Baru

   * `20+`
   * `↑ 8% dari minggu lalu`

3. Testimoni

   * `25+`
   * `↑ 15% dari bulan lalu`

4. Page Views

   * `12.5K`
   * `↑ 18% dari bulan lalu`

### Style

* 4-column desktop
* 2-column tablet
* 1-column mobile
* Icon circle warna cerah
* Number besar dan bold

---

## 11.5 Project Management Panel

### Tujuan

Mengelola daftar project portfolio.

### Table Columns

* Project
* Kategori
* Status
* Terakhir Diupdate
* Aksi

### Row Data Example

| Project                | Kategori     | Status    |
| ---------------------- | ------------ | --------- |
| Project Management App | Web App      | Published |
| SaaS Landing Page      | Landing Page | Published |
| E-Commerce Website     | E-Commerce   | Draft     |
| Portfolio V2           | Portfolio    | Published |
| API Dashboard          | Web App      | Archived  |

### Actions

* Edit
* Delete
* View

### Status Badge

| Status    | Color  |
| --------- | ------ |
| Published | Green  |
| Draft     | Yellow |
| Archived  | Gray   |

### Empty State

Jika belum ada project:

```txt
Belum ada project. Tambahkan project pertama untuk mulai membangun portfolio.
```

CTA:

```txt
Tambah Project Baru
```

---

## 11.6 Timeline Management Panel

### Tujuan

Mengelola milestone perjalanan.

### Fields

* Year
* Title
* Description
* Icon
* Accent color
* Order

### Actions

* Edit milestone
* Delete milestone
* Add milestone
* Reorder milestone

### Layout

* Timeline vertical di panel kanan
* Setiap milestone sebagai card horizontal
* Button `Tambah Milestone` di bawah

---

## 11.7 Messages Panel

### Tujuan

Melihat pesan masuk dari contact form.

### Card Content

* Avatar
* Sender name
* Company/role
* Message snippet
* Date/time
* Unread indicator

### Actions

* View detail
* Mark as read
* Reply
* Delete

### Visual

* Unread message diberi dot pink
* Panel menggunakan label `Pesan Masuk`
* CTA: `Lihat Semua Pesan`

---

## 11.8 Testimonials Panel

### Tujuan

Mengelola testimonial client.

### Data

* Name
* Role/company
* Avatar
* Rating
* Testimonial text
* Status

### Status

* Approved
* Pending
* Hidden

### Actions

* Approve
* Edit
* Delete

### CTA

```txt
Tambah Testimoni
```

---

## 11.9 Content Editor Panel

### Tujuan

Quick edit konten utama landing page.

### Editable Fields

* Hero Headline
* Subheadline
* About excerpt
* CTA text
* Contact email
* Phone number
* Social links

### UI

* Input text
* Textarea
* Character counter
* Save Draft button
* Preview button

### Buttons

* `Simpan Draft`
* `Preview`

---

## 11.10 Recent Activity Section

### Tujuan

Menampilkan aktivitas terakhir admin.

### Activity Examples

* Project “SaaS Landing Page” berhasil dipublish.
* Konten “About Me” diperbarui.
* Testimoni baru dari Dimas Pratama.
* Pesan baru dari Nadia Putri.
* Pengaturan SEO diperbarui.

### Style

* Horizontal activity cards desktop
* Vertical list mobile
* Icon circle
* Timestamp kecil

---

# 12. Component Guidelines

## 12.1 Card

```ts
type BrutalCardVariant =
  | "default"
  | "yellow"
  | "cyan"
  | "pink"
  | "purple"
  | "success"
  | "danger";
```

Default card:

* `background: white`
* `border: 2px solid black`
* `box-shadow: 5px 5px 0 black`
* `border-radius: 8px`

---

## 12.2 Badge

Badge digunakan untuk:

* Category
* Status
* Skill
* Notification
* Active state

```css
.badge {
  display: inline-flex;
  align-items: center;
  border: 2px solid var(--color-border);
  padding: 5px 10px;
  font-size: 11px;
  font-weight: 900;
  text-transform: uppercase;
}
```

---

## 12.3 Form Input

```css
.input-brutal {
  width: 100%;
  background: #ffffff;
  border: 2px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 12px 14px;
  font-size: 14px;
  box-shadow: 2px 2px 0 #111111;
}
```

Focus:

```css
.input-brutal:focus {
  outline: none;
  border-color: var(--color-purple);
  box-shadow: 4px 4px 0 #111111;
}
```

---

## 12.4 Icon Style

Gunakan icon:

* Stroke tebal
* Simple
* Monochrome atau warna aksen
* Cocok dengan border hitam

Rekomendasi icon library:

* Lucide React
* Phosphor Icons
* Tabler Icons

---

# 13. Decorative Elements

Gunakan dekorasi secukupnya.

Elemen yang dipakai:

* Star doodle
* Lightning bolt
* Arrow hand-drawn
* Dot pattern
* Grid pattern
* Smile icon
* Sticker label
* Circular text badge
* Abstract square/rectangle

Aturan:

* Jangan mengganggu readability.
* Jangan terlalu banyak pada mobile.
* Decorative element harus `aria-hidden="true"`.

---

# 14. Motion & Interaction

### Hover

* Card naik `-2px`
* Shadow membesar
* Button bergerak sedikit
* Arrow bergeser ke kanan

```css
.interactive-brutal {
  transition:
    transform 160ms ease,
    box-shadow 160ms ease,
    background-color 160ms ease;
}

.interactive-brutal:hover {
  transform: translate(-2px, -2px);
  box-shadow: 7px 7px 0 #111111;
}
```

### Page Load

Gunakan animasi ringan:

* Fade up
* Slide from bottom
* Stagger cards
* No excessive bounce

### Scroll

* Smooth scroll ke section
* Navbar active berdasarkan section
* Timeline item muncul bertahap

---

# 15. Responsive Rules

## Desktop

* Max width `1280px`
* Hero 2 columns
* Project 3 columns
* Services 4 columns
* Timeline horizontal
* Admin panels mixed grid

## Tablet

* Hero tetap 2 columns jika cukup
* Project 2 columns
* Services 2 columns
* Stats 2 columns
* Timeline mulai wrap

## Mobile

* Navbar compact
* Hero stacked
* Headline max `48px`
* Project stacked
* Services stacked
* Timeline vertical
* Admin table berubah jadi cards
* Hide decorative elements yang terlalu ramai

---

# 16. Accessibility

Wajib:

* Contrast text minimal AA
* Button punya focus state
* Semua icon button punya aria-label
* Decorative elements pakai `aria-hidden`
* Form input punya label
* Error form jelas
* Jangan hanya mengandalkan warna untuk status

Focus style:

```css
:focus-visible {
  outline: 3px solid var(--color-purple);
  outline-offset: 3px;
}
```

---

# 17. SEO & Content Notes

Landing page harus punya struktur heading rapi:

```txt
H1: Hi, I'm Zagoour
H2: Tentang Saya
H2: Featured Work
H2: Layanan Saya
H2: Perjalanan Saya
H2: Apa Kata Klien
H2: Punya Projek Menarik?
```

Metadata rekomendasi:

```txt
Title:
Zagoour — Fullstack Developer & UI/UX Designer

Description:
Portfolio fullstack developer dan UI/UX designer Indonesia yang membantu bisnis membangun website, aplikasi, dan produk digital modern.
```

---

# 18. Suggested Next.js Structure

```txt
src/
  app/
    page.tsx
    admin/
      page.tsx
  components/
    layout/
      floating-navbar.tsx
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
      timeline-manager.tsx
      messages-panel.tsx
      testimonials-panel.tsx
      content-editor.tsx
      recent-activity.tsx
    ui/
      brutal-card.tsx
      brutal-button.tsx
      section-label.tsx
      badge.tsx
      input.tsx
  lib/
    data/
      projects.ts
      timeline.ts
      testimonials.ts
```

---

# 19. Tailwind Design Mapping

Jika memakai Tailwind, mapping token:

```ts
const colors = {
  bg: "#FFFDF4",
  surface: "#FFFFFF",
  ink: "#0A0A0A",
  muted: "#5F5F5F",
  yellow: "#FFF200",
  cyan: "#35DCE8",
  pink: "#FF4FA3",
  purple: "#9B5CFF",
  green: "#8CFF63",
  red: "#FF4D4D",
};
```

Utility class utama:

```txt
border-2 border-black
shadow-[5px_5px_0_#111]
rounded-md
bg-[#FFFDF4]
font-black
uppercase
tracking-tight
```

---

# 20. Implementation Priority

## Phase 1 — Landing Page Static

* Floating navbar
* Hero section
* Trusted by
* About + stats
* Featured work
* Services
* Timeline
* Testimonials
* Contact
* Footer

## Phase 2 — Admin UI Static

* Admin navbar
* Stats cards
* Project table
* Timeline manager
* Messages panel
* Testimonials panel
* Content editor
* Recent activity

## Phase 3 — Admin Functional

* CRUD projects
* CRUD timeline
* CRUD testimonials
* Contact message inbox
* Draft/preview content
* Publish changes

## Phase 4 — Production

* Database integration
* Auth admin
* Image upload
* SEO metadata
* Analytics
* Deployment

---

# 21. Final Design Rule

Setiap halaman harus mengikuti prinsip berikut:

```txt
Bright background.
Black border.
Hard shadow.
Bold typography.
Clear CTA.
Fun but structured.
```

Desain ini harus terasa ekspresif, tetapi tetap mudah digunakan dan siap dikembangkan menjadi aplikasi production.
