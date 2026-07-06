"use client";

import { useRef } from "react";
import { MapPin, Star, Code2, Globe, ArrowUpRight } from "lucide-react";
import { BrutalCard } from "@/components/ui/brutal-card";
import { SectionLabel } from "@/components/ui/section-label";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function BentoSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      ".bento-card",
      { scale: 0.9, opacity: 0, y: 30 },
      {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.2)",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play reverse play reverse",
        },
      }
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="highlights" className="brutal-container py-10 space-y-6">
      <div className="border-b-4 border-border pb-4">
        <h2 className="heading-brutal text-4xl sm:text-5xl lg:text-6xl font-black text-ink">
          MY HIGHLIGHTS
        </h2>
        <p className="text-sm font-semibold text-ink/70 uppercase tracking-wider mt-1">
          Bento Grid sekilas tentang keahlian, status, dan pengalaman saya.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Bio (2 cols wide) */}
        <BrutalCard className="bento-card md:col-span-2 p-6 bg-surface flex flex-col justify-between min-h-[220px] relative overflow-hidden group hover:shadow-[var(--shadow-hard-lg)] transition-all opacity-0">
          <div className="absolute right-[-20px] bottom-[-20px] h-32 w-32 bg-yellow/10 rounded-full border-4 border-dashed border-yellow/20 -rotate-12 group-hover:rotate-12 transition-all duration-700" />
          <div>
            <SectionLabel color="cyan" className="mb-4">ABOUT ME</SectionLabel>
            <h3 className="text-2xl font-black uppercase text-ink mt-2">
              Building Web Apps with Love and Clean Code
            </h3>
            <p className="text-sm font-semibold text-ink/75 leading-relaxed mt-3 max-w-xl">
              Saya RiszDev, seorang Fullstack Developer yang berfokus membangun produk digital modern, cepat, dan terukur. Saya menyukai estetika desain Neobrutalisme dan menulis kode bersih dengan TypeScript.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs font-black uppercase">
            <span>Learn more about my work</span>
            <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </div>
        </BrutalCard>

        {/* Card 2: Location (1 col) */}
        <BrutalCard className="bento-card p-6 bg-yellow text-black flex flex-col justify-between min-h-[220px] relative overflow-hidden group hover:shadow-[var(--shadow-hard-lg)] transition-all opacity-0">
          <div className="absolute right-4 top-4 text-black/20 group-hover:scale-110 transition-transform"><Globe size={60} /></div>
          <div>
            <SectionLabel color="purple" className="text-white border-purple-700">LOCATION</SectionLabel>
            <h3 className="text-2xl font-black uppercase text-black mt-6">
              Based in
              <br />
              Indonesia
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs font-black uppercase border-2 border-border bg-surface px-3 py-1.5 shadow-[1px_1px_0_var(--color-border)] w-fit mt-4">
            <MapPin size={14} className="text-pink" />
            <span>UTC +7 (WIB)</span>
          </div>
        </BrutalCard>

        {/* Card 3: Experience (1 col) */}
        <BrutalCard className="bento-card p-6 bg-pink text-black flex flex-col justify-between min-h-[220px] relative overflow-hidden group hover:shadow-[var(--shadow-hard-lg)] transition-all opacity-0">
          <div>
            <SectionLabel color="yellow">EXPERIENCE</SectionLabel>
            <p className="text-7xl font-black mt-4 leading-none tracking-tight">4+ Yrs</p>
          </div>
          <p className="text-xs font-black uppercase leading-snug max-w-[180px] mt-4">
            Membangun website dinamis & solusi fullstack yang aman.
          </p>
        </BrutalCard>

        {/* Card 4: Code Preview (2 cols wide) */}
        <BrutalCard className="bento-card md:col-span-2 bg-[#1e1e1e] border-border text-[#d4d4d4] p-5 font-mono text-xs overflow-hidden flex flex-col justify-between min-h-[220px] shadow-[var(--shadow-hard-md)] opacity-0">
          <div className="flex items-center justify-between border-b border-gray-700 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-500" />
              <span className="h-3 w-3 rounded-full bg-yellow-500" />
              <span className="h-3 w-3 rounded-full bg-green-500" />
              <span className="text-[10px] text-gray-500 font-bold ml-2">AppService.ts</span>
            </div>
            <Code2 size={14} className="text-gray-500" />
          </div>
          <div className="flex-1 space-y-1">
            <p><span className="text-blue-400">const</span> <span className="text-yellow-300">riszDev</span> = &#123;</p>
            <p className="pl-4">role: <span className="text-green-300">&quot;Fullstack Developer&quot;</span>,</p>
            <p className="pl-4">skills: [<span className="text-green-300">&quot;Next.js&quot;</span>, <span className="text-green-300">&quot;Prisma v7&quot;</span>, <span className="text-green-300">&quot;Tailwind v4&quot;</span>],</p>
            <p className="pl-4">philosophy: <span className="text-green-300">&quot;Functional designs + clean code&quot;</span>,</p>
            <p className="pl-4">coffeeLevel: <span className="text-purple-400">99</span>,</p>
            <p>&#125;;</p>
            <p><span className="text-blue-400">export default</span> <span className="text-yellow-300">riszDev</span>;</p>
          </div>
          <div className="text-[9px] text-gray-650 mt-4 border-t border-gray-800 pt-2 flex justify-between">
            <span>{"// Powered by React & Next.js"}</span>
            <span>UTF-8</span>
          </div>
        </BrutalCard>

        {/* Card 5: Focus / Core Skill (1 col) */}
        <BrutalCard className="bento-card p-6 bg-cyan text-black flex flex-col justify-between min-h-[220px] relative overflow-hidden group hover:shadow-[var(--shadow-hard-lg)] transition-all opacity-0">
          <div className="absolute right-4 top-4 text-black/20 group-hover:scale-110 transition-transform"><Star size={60} /></div>
          <div>
            <SectionLabel color="pink" className="text-ink border-pink-700">CORE FOCUS</SectionLabel>
            <h3 className="text-2xl font-black uppercase text-black mt-6">
              UI/UX &
              <br />
              Code Quality
            </h3>
          </div>
          <p className="text-xxs font-black uppercase leading-relaxed text-black/75 mt-4">
            Mengutamakan performa loading cepat, keramahan SEO, dan tipe data ketat.
          </p>
        </BrutalCard>
      </div>
    </section>
  );
}
