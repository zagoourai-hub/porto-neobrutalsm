# Design Analysis Report — Portfolio & Admin Dashboard

Sumber:

- `design/DESIGN.md`
- `design/landing.png`
- `design/admin.png`

Tanggal analisis: 2026-07-05

## Ringkasan

Desain sudah kuat sebagai referensi visual MVP. Arah Neobrutalism Light konsisten: background terang, border hitam tebal, hard shadow, warna aksen cerah, typography bold, dan layout card-based. `landing.png` dan `admin.png` cukup detail untuk dijadikan sumber kebenaran UI awal.

Status kesiapan:

- Visual direction: siap implementasi.
- Design token: siap implementasi.
- Landing page: siap implementasi statis, lalu connect DB.
- Admin dashboard: siap implementasi sebagai dashboard overview.
- Admin CRUD detail pages: belum divisualkan lengkap.

## Kesesuaian Dengan PRD

| Area | Status | Catatan |
|------|--------|---------|
| Tema Neobrutalism Light | Match | Warna, border, shadow, sticker label sesuai PRD. |
| Landing sections | Match | Navbar, Hero, Trusted By, About, Work, Services, Timeline, Testimonials, Contact, Footer ada. |
| Admin dashboard | Match sebagian | Dashboard overview sesuai, tetapi PRD juga butuh page CRUD terpisah. |
| Design tokens | Match | Token warna, shadow, radius sudah jelas. |
| Responsive rules | Match | Ada aturan desktop/tablet/mobile. |
| Accessibility | Match sebagian | Aturan ada, tetapi screenshot belum cukup membuktikan contrast/focus/aria. |
| Data-driven content | Match | Design support project/timeline/testimonial/message/content, perlu mapping DB. |
| MVP scope | Perlu trim | Page views, recent activity, image upload, analytics berpotensi di luar MVP. |

## Temuan Landing Page

### Yang Sudah Bagus

1. Hierarki hero sangat jelas: headline besar, role badge, copy singkat, CTA utama/secondary.
2. Navbar fixed pill kuat dan sesuai design personality.
3. Trusted-by strip memperkuat trust tanpa mengganggu hero.
4. About + stats mudah discan.
5. Featured Work jelas: thumbnail, badge kategori, title, desc, CTA icon.
6. Services section padat dan readable.
7. Timeline horizontal desktop terlihat ekspresif dan jelas.
8. Contact section punya conversion path lengkap: headline, CTA, form, info kontak, social links.
9. Footer lengkap: logo, nav, layanan, social, kontak.

### Risiko / Gap

1. `NestJS` muncul di trusted-by, padahal project ini Next.js fullstack tanpa backend NestJS. Jika hanya skill/tech personal, boleh. Jika stack app, hapus atau ganti.
2. Hero CTA `Unduh CV` belum ada di PRD MVP. Perlu task file/static asset CV atau ubah jadi `Hubungi Saya`.
3. Project card "clickable" bisa memicu project detail page, padahal PRD future scope. Untuk MVP, click arahkan ke demo/repository.
4. Timeline copy menyebut "integrasi AI"; aman sebagai narasi layanan, bukan fitur app.
5. Banyak decorative elements. Pada mobile perlu hide sebagian supaya tidak penuh.
6. Testimonial avatar di screenshot butuh source asset. Untuk MVP bisa external URL/fallback initials.

## Temuan Admin Dashboard

### Yang Sudah Bagus

1. Admin tetap satu visual system dengan landing page.
2. Top nav jelas: Dashboard, Projects, Timeline, Testimonials, Messages, Content, Settings.
3. Stats cards kuat dan mudah dibaca.
4. Project table sudah punya status badge, edit/delete action, dan CTA add.
5. Timeline panel punya list milestone dan action edit/delete.
6. Messages panel cocok untuk inbox ringkas.
7. Testimonials panel sudah punya rating, status, edit/delete.
8. Content editor punya field nyata dan char counter.
9. Recent activity secara visual bagus untuk dashboard overview.

### Risiko / Gap

1. `Page Views` butuh analytics. PRD menyebut optional, jadi MVP sebaiknya exclude atau tampil sebagai placeholder non-functional.
2. `Recent Activity` butuh activity log model. Belum ada di PRD data model. Untuk MVP, exclude atau buat derived static/recent changes.
3. `Publish Changes` mengimplikasikan draft/publish workflow global. PRD belum mendefinisikan workflow ini. MVP cukup save langsung.
4. Dashboard screenshot all-in-one, tetapi PRD butuh page terpisah untuk projects, timeline, testimonials, messages, content, settings.
5. Table mobile belum divisualkan. PRD mewajibkan mobile card view.
6. Delete action perlu confirmation dialog, belum divisualkan.
7. Admin auth/login page belum ada visual reference.
8. Settings page belum ada visual reference.

## Design-to-Implementation Decisions

1. Gunakan `DESIGN.md` + PNG sebagai UI source of truth.
2. Implement landing page sesuai screenshot dulu dengan dummy fallback.
3. Connect public sections ke DB setelah Prisma/service layer siap.
4. Implement admin dashboard sebagai overview; CRUD pages mengikuti komponen visual yang sama.
5. MVP tidak implement upload image. Pakai URL/fallback image.
6. MVP tidak implement page views/recent activity kecuali ditambah model tracking.
7. `Publish Changes` diganti menjadi direct save atau disembunyikan sampai draft workflow ada.
8. `NestJS` di trusted-by hanya tampil jika dimaknai tech skill personal, bukan stack app.

## Atomic UI Task Additions

### Landing Design Tasks

1. `[FE]` Implement floating navbar sesuai `landing.png`.
2. `[FE]` Implement hero layout dengan portrait cutout, yellow block, cyan shape, dan info cards.
3. `[FE]` Implement decorative doodles dengan `aria-hidden="true"`.
4. `[FE]` Implement trusted-by strip.
5. `[FE]` Implement about + stats card grid.
6. `[FE]` Implement featured work cards sesuai screenshot.
7. `[FE]` Implement services cards dengan icon square brutalist.
8. `[FE]` Implement desktop horizontal timeline.
9. `[FE]` Implement mobile vertical timeline.
10. `[FE]` Implement testimonials strip/cards.
11. `[FE]` Implement contact conversion section.
12. `[FE]` Implement footer grid.
13. `[FE]` Hide/reduce decorative elements on mobile.
14. `[FE]` Verify screenshot match against `design/landing.png` with Playwright.

### Admin Design Tasks

1. `[FE]` Implement admin floating navbar sesuai `admin.png`.
2. `[FE]` Implement admin hero header.
3. `[FE]` Implement stats cards grid.
4. `[FE]` Implement dashboard project panel.
5. `[FE]` Implement dashboard timeline panel.
6. `[FE]` Implement dashboard messages panel.
7. `[FE]` Implement dashboard testimonials panel.
8. `[FE]` Implement dashboard content editor preview.
9. `[FE]` Implement recent activity only if tracking model exists.
10. `[FE]` Implement mobile card view for admin tables.
11. `[FE]` Implement delete confirmation dialog pattern.
12. `[FE]` Verify screenshot match against `design/admin.png` with Playwright.

## Token Implementation Notes

Use exact tokens from `DESIGN.md`:

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
}
```

Typography recommendation:

- Heading: `Archivo Black` or `Space Grotesk` with `font-black`.
- Body: `Inter` or `Geist Sans`.
- Avoid negative tracking beyond readability on mobile.

## Acceptance Criteria For UI Match

1. Landing desktop visually close to `design/landing.png`.
2. Admin desktop visually close to `design/admin.png`.
3. Mobile layout does not overflow at 360px.
4. No text clipping in cards/buttons/nav.
5. Decorative elements hidden/reduced on mobile.
6. All form fields have labels.
7. All icon-only actions have `aria-label`.
8. Focus state visible on buttons, links, inputs.
9. Delete actions use confirmation dialog.
10. `npm run typecheck`, `npm run lint`, and `npm run build` pass after implementation.

## Skor Design Readiness

- Visual clarity: 9/10
- PRD alignment: 8/10
- Implementation detail: 8/10
- Mobile specificity: 6/10
- Admin CRUD coverage: 6/10
- **Total: 37/50**

Kesimpulan: design folder siap jadi sumber kebenaran visual MVP. Gap utama: admin subpages, mobile detail, auth/settings visual, analytics/recent activity scope, dan stack mismatch kecil seperti `NestJS` di trusted-by.
