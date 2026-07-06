"use client";

import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/lib/landing-data";
import { BrutalCard } from "@/components/ui/brutal-card";
import { SectionLabel } from "@/components/ui/section-label";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const serviceColorClasses = {
  cyan: "bg-cyan",
  pink: "bg-pink",
  purple: "bg-purple text-white",
  yellow: "bg-yellow",
} as const;

export function ServicesSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      ".service-card",
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
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
    <section ref={containerRef} id="services" className="brutal-container py-5">
      <SectionLabel color="yellow">Layanan Saya</SectionLabel>
      <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {services.map(({ title, description, Icon, color }) => (
          <BrutalCard key={title} className="service-card grid grid-cols-[64px_1fr_auto] items-center gap-4 p-5 opacity-0">
            <div className={`flex h-16 w-16 items-center justify-center border-2 border-border shadow-[var(--shadow-hard-sm)] ${serviceColorClasses[color]}`}>
              <Icon aria-hidden size={34} />
            </div>
            <div>
              <h2 className="text-lg font-black">{title}</h2>
              <p className="mt-2 text-sm font-semibold leading-6">{description}</p>
            </div>
            <ArrowUpRight aria-hidden className="hidden sm:block" size={22} />
          </BrutalCard>
        ))}
      </div>
    </section>
  );
}
