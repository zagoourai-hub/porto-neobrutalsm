import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not defined in env variables.");
}

const pool = new Pool({ connectionString });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  console.log("Cleaning DB...");
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE "users", "projects", "timeline_items", "testimonials", "contact_messages", "site_contents", "site_settings" CASCADE;`);

  console.log("Seeding default admin...");
  const adminEmail = process.env.ADMIN_DEFAULT_EMAIL || "admin@riszdev.dev";
  const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD || "password123";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.create({
    data: {
      name: "RiszDev Admin",
      email: adminEmail,
      passwordHash,
      role: "ADMIN",
    },
  });

  console.log("Seeding projects...");
  await prisma.project.createMany({
    data: [
      {
        title: "Project Management App",
        slug: "project-management-app",
        description: "Aplikasi manajemen proyek dengan fitur task, timeline, dan kolaborasi tim.",
        category: "Web App",
        tags: ["Next.js", "TypeScript", "TailwindCSS", "Prisma"],
        demoUrl: "https://demo.project-app.local",
        repositoryUrl: "https://github.com/riszdev/project-app",
        status: "PUBLISHED",
        isFeatured: true,
        sortOrder: 1,
      },
      {
        title: "SaaS Landing Page",
        slug: "saas-landing-page",
        description: "Landing page modern untuk produk SaaS dengan fokus konversi tinggi.",
        category: "Landing Page",
        tags: ["React", "TailwindCSS", "Framer Motion"],
        demoUrl: "https://demo.saas-landing.local",
        repositoryUrl: "https://github.com/riszdev/saas-landing",
        status: "PUBLISHED",
        isFeatured: true,
        sortOrder: 2,
      },
      {
        title: "E-Commerce Website",
        slug: "e-commerce-website",
        description: "Website e-commerce lengkap dengan keranjang, pembayaran, dan admin panel.",
        category: "E-Commerce",
        tags: ["Next.js", "PostgreSQL", "Stripe"],
        demoUrl: "https://demo.ecommerce.local",
        repositoryUrl: "https://github.com/riszdev/ecommerce",
        status: "PUBLISHED",
        isFeatured: true,
        sortOrder: 3,
      },
    ],
  });

  console.log("Seeding timeline items...");
  await prisma.timelineItem.createMany({
    data: [
      {
        year: "2021",
        title: "Start Freelance",
        description: "Memulai perjalanan sebagai freelancer dan membangun proyek pertama.",
        icon: "Flag",
        accentColor: "cyan",
        sortOrder: 1,
      },
      {
        year: "2022",
        title: "First 10 Clients",
        description: "Mendapatkan 10 klien pertama dan membangun kepercayaan.",
        icon: "Users",
        accentColor: "pink",
        sortOrder: 2,
      },
      {
        year: "2023",
        title: "Build SaaS Projects",
        description: "Mulai membangun produk SaaS dan fokus pada solusi digital.",
        icon: "Code2",
        accentColor: "yellow",
        sortOrder: 3,
      },
      {
        year: "2024",
        title: "Expand Services",
        description: "Memperluas layanan ke web development dan integrasi AI.",
        icon: "Gauge",
        accentColor: "cyan",
        sortOrder: 4,
      },
      {
        year: "2025",
        title: "Product & Automation",
        description: "Fokus pada product building dan otomasi untuk efisiensi bisnis.",
        icon: "Target",
        accentColor: "purple",
        sortOrder: 5,
      },
    ],
  });

  console.log("Seeding testimonials...");
  await prisma.testimonial.createMany({
    data: [
      {
        name: "Dimas Pratama",
        role: "CEO",
        company: "TechNova",
        rating: 5,
        content: "RiszDev sangat profesional dan memahami kebutuhan bisnis kami. Hasil akhirnya melebihi ekspektasi!",
        status: "APPROVED",
      },
      {
        name: "Rani Putri",
        role: "Product Manager",
        company: "EduSmart",
        rating: 5,
        content: "Desain yang dibuat modern dan user-friendly. Komunikasi lancar dan selalu on-time.",
        status: "APPROVED",
      },
    ],
  });

  console.log("Seeding site settings...");
  await prisma.siteSetting.create({
    data: {
      siteTitle: "RiszDev - Fullstack Developer & UI/UX Designer",
      siteDescription: "Portfolio fullstack developer dan UI/UX designer Indonesia yang membantu bisnis membangun website, aplikasi, dan produk digital modern.",
      ogTitle: "RiszDev Portfolio",
      ogDescription: "Membangun produk digital modern dengan Neobrutalism UI.",
      contactEmail: "hello@riszdev.dev",
      phoneNumber: "+6281234567890",
      whatsappNumber: "6281234567890",
      socialLinks: {
        github: "https://github.com/riszdev",
        linkedin: "https://linkedin.com/in/riszdev",
        twitter: "https://twitter.com/riszdev",
      },
    },
  });

  console.log("Seeding site contents...");
  await prisma.siteContent.createMany({
    data: [
      { key: "hero.title", value: "Membangun Produk Digital Yang Berdampak", type: "TEXT" },
      { key: "hero.subtitle", value: "Saya membuat aplikasi web berkinerja tinggi yang menggabungkan desain fungsional dengan kode bersih.", type: "TEXT" },
      { key: "about.bio", value: "Halo! Saya RiszDev, seorang pengembang full-stack dan desainer UI/UX. Saya suka membangun solusi digital interaktif yang tidak hanya terlihat menarik secara visual dengan estetika Neobrutalism, tetapi juga memiliki fondasi teknis yang solid.", type: "TEXT" },
    ],
  });

  console.log("Seed complete.");
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
