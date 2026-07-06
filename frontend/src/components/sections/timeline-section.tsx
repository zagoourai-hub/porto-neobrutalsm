"use client";

import { useRef } from "react";
import * as Icons from "lucide-react";
import { timelineItems as staticTimeline } from "@/lib/landing-data";
import { BrutalCard } from "@/components/ui/brutal-card";
import { SectionLabel } from "@/components/ui/section-label";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const timelineColorClasses = {
  cyan: "bg-cyan",
  pink: "bg-pink",
  yellow: "bg-yellow",
  purple: "bg-purple text-white",
} as const;

interface TimelineItem {
  id: string;
  year: string;
  title: string;
  description: string;
  icon?: string | null;
  accentColor?: string | null;
}

interface TimelineSectionProps {
  items?: TimelineItem[];
}

export function TimelineSection({ items }: TimelineSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Animate horizontal line
    gsap.fromTo(
      ".timeline-line",
      { scaleX: 0 },
      {
        scaleX: 1,
        transformOrigin: "left",
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".timeline-line",
          start: "top 90%",
          toggleActions: "play reverse play reverse",
        },
      }
    );

    // Stagger timeline items
    gsap.fromTo(
      ".timeline-item",
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "back.out(1.2)",
        scrollTrigger: {
          trigger: ".timeline-item",
          start: "top 85%",
          toggleActions: "play reverse play reverse",
        },
      }
    );
  }, { scope: containerRef });
  // If undefined, fallback to static data
  const displayItems = items ?? staticTimeline.map((item, idx) => ({
    id: `static-${idx}`,
    year: item.year,
    title: item.title,
    description: item.description,
    icon: item.Icon.name || "Calendar",
    accentColor: item.color,
  }));

  return (
    <section ref={containerRef} id="timeline" className="brutal-container py-5">
      <SectionLabel color="purple">Perjalanan Saya</SectionLabel>
      
      {displayItems.length === 0 ? (
        <BrutalCard className="mt-8 p-10 text-center font-bold bg-surface shadow-[var(--shadow-hard-md)]">
          <p className="text-xl">Belum ada perjalanan karir yang ditambahkan.</p>
        </BrutalCard>
      ) : (
        <div className="relative mt-8">
          <div className="timeline-line absolute left-0 right-0 top-0 hidden h-0.5 bg-border lg:block" />
          <div className="grid gap-5 lg:grid-cols-5">
            {displayItems.map(({ id, year, title, description, icon, accentColor }) => {
              const colorKey = (accentColor && accentColor in timelineColorClasses ? accentColor : "cyan") as keyof typeof timelineColorClasses;
              
              // Dynamically lookup the Lucide icon
              const LucideIcon = (Icons as unknown as Record<string, React.ComponentType<{ className?: string; size?: number | string; "aria-hidden"?: boolean }>>)[icon || ""] || Icons.Calendar;

              return (
                <div key={id} className="timeline-item relative pt-6 opacity-0">
                  <div className={`absolute left-1/2 top-[-9px] hidden h-5 w-5 -translate-x-1/2 rounded-full border-2 border-border ${timelineColorClasses[colorKey]} lg:block`} />
                  <BrutalCard className="p-5">
                    <div className="mb-3 flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center border-2 border-border ${timelineColorClasses[colorKey]}`}>
                        <LucideIcon aria-hidden size={22} />
                      </div>
                      <div>
                        <p className="text-2xl font-black">{year}</p>
                        <p className="text-xs font-black uppercase">{title}</p>
                      </div>
                    </div>
                    <p className="text-sm font-semibold leading-6">{description}</p>
                  </BrutalCard>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
