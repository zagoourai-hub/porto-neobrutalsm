import {
  CalendarDays,
  Code2,
  Flag,
  Gauge,
  Layers3,
  PencilRuler,
  Plug,
  Rocket,
  Smile,
  Star,
  Target,
  Users,
} from "lucide-react";

export const trustedStack = [
  "Next.js",
  "TypeScript",
  "Prisma",
  "PostgreSQL",
  "Docker",
  "Vercel",
];

export const stats = [
  { value: "40+", label: "Project Selesai", accent: "yellow", Icon: Code2 },
  { value: "20+", label: "Klien Puas", accent: "cyan", Icon: Users },
  { value: "4+", label: "Tahun Pengalaman", accent: "pink", Icon: CalendarDays },
  { value: "10+", label: "Teknologi Dipahami", accent: "purple", Icon: Code2 },
] as const;

export const projects = [
  {
    title: "Project Management App",
    category: "Web App",
    description:
      "Aplikasi manajemen proyek dengan fitur task, timeline, dan kolaborasi tim.",
    accent: "purple",
    gradient: "from-purple/30 via-surface to-purple/10",
  },
  {
    title: "SaaS Landing Page",
    category: "Landing Page",
    description:
      "Landing page modern untuk produk SaaS dengan fokus konversi tinggi.",
    accent: "cyan",
    gradient: "from-cyan/30 via-surface to-blue-100",
  },
  {
    title: "E-Commerce Website",
    category: "E-Commerce",
    description:
      "Website e-commerce lengkap dengan keranjang, pembayaran, dan admin panel.",
    accent: "pink",
    gradient: "from-pink/30 via-surface to-red/10",
  },
] as const;

export const services = [
  {
    title: "Web Development",
    description: "Membangun website dan web app modern, cepat, dan scalable.",
    Icon: Code2,
    color: "cyan",
  },
  {
    title: "UI/UX Design",
    description:
      "Merancang antarmuka yang menarik, intuitif, dan berorientasi pengguna.",
    Icon: PencilRuler,
    color: "pink",
  },
  {
    title: "API & Integration",
    description: "Membuat dan mengintegrasikan RESTful API untuk berbagai kebutuhan.",
    Icon: Plug,
    color: "purple",
  },
  {
    title: "Performance Optimization",
    description: "Mengoptimalkan performa website agar lebih cepat dan SEO friendly.",
    Icon: Rocket,
    color: "yellow",
  },
] as const;

export const timelineItems = [
  {
    year: "2021",
    title: "Start Freelance",
    description: "Memulai perjalanan sebagai freelancer dan membangun proyek pertama.",
    Icon: Flag,
    color: "cyan",
  },
  {
    year: "2022",
    title: "First 10 Clients",
    description: "Mendapatkan 10 klien pertama dan membangun kepercayaan.",
    Icon: Users,
    color: "pink",
  },
  {
    year: "2023",
    title: "Build SaaS Projects",
    description: "Mulai membangun produk SaaS dan fokus pada solusi digital.",
    Icon: Code2,
    color: "yellow",
  },
  {
    year: "2024",
    title: "Expand Services",
    description: "Memperluas layanan ke web development dan integrasi AI.",
    Icon: Gauge,
    color: "cyan",
  },
  {
    year: "2025",
    title: "Product & Automation",
    description: "Fokus pada product building dan otomasi untuk efisiensi bisnis.",
    Icon: Target,
    color: "purple",
  },
] as const;

export const testimonials = [
  {
    name: "Dimas Pratama",
    role: "CEO, TechNova",
    content:
      "RiszDev sangat profesional dan memahami kebutuhan bisnis kami. Hasil akhirnya melebihi ekspektasi!",
    avatar: "DP",
  },
  {
    name: "Rani Putri",
    role: "Product Manager, EduSmart",
    content:
      "Desain yang dibuat modern dan user-friendly. Komunikasi lancar dan selalu on-time.",
    avatar: "RP",
  },
] as const;

export const aboutIcon = Smile;
export const heroIcon = Star;
export const projectIcon = Layers3;
