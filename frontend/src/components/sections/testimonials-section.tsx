"use client";

import { useRef } from "react";
import { Quote, Star } from "lucide-react";
import Image from "next/image";
import { testimonials as staticTestimonials } from "@/lib/landing-data";
import { BrutalCard } from "@/components/ui/brutal-card";
import { SectionLabel } from "@/components/ui/section-label";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Testimonial {
  id: string;
  name: string;
  role?: string | null;
  company?: string | null;
  avatarUrl?: string | null;
  rating: number;
  content: string;
}

interface TestimonialsSectionProps {
  testimonials?: Testimonial[];
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      ".testimonials-card",
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".testimonials-card",
          start: "top 85%",
          toggleActions: "play reverse play reverse",
        },
      }
    );

    gsap.fromTo(
      ".testimonial-item",
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".testimonial-item",
          start: "top 85%",
          toggleActions: "play reverse play reverse",
        },
      }
    );
  }, { scope: containerRef });
  // Fallback to static if undefined
  const displayTestimonials = testimonials ?? staticTestimonials.map((t, idx) => ({
    id: `static-${idx}`,
    name: t.name,
    role: t.role,
    company: "",
    avatarUrl: null,
    rating: 5,
    content: t.content,
  }));

  return (
    <section ref={containerRef} className="brutal-container py-5">
      <SectionLabel color="cyan">Apa Kata Klien</SectionLabel>
      <BrutalCard className="testimonials-card relative mt-5 overflow-hidden p-6 opacity-0">
        <div className="dot-pattern absolute right-10 top-8 h-24 w-24" aria-hidden="true" />
        
        {displayTestimonials.length === 0 ? (
          <div className="text-center font-bold py-6">
            <p className="text-xl">Belum ada testimoni klien.</p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {displayTestimonials.map((testimonial) => {
              const initials = testimonial.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2);

              const roleText = [testimonial.role, testimonial.company]
                .filter(Boolean)
                .join(", ");

              return (
                <div key={testimonial.id} className="testimonial-item grid gap-4 sm:grid-cols-[96px_1fr] opacity-0">
                  <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-2 border-border bg-gray-100 text-2xl font-black shadow-[var(--shadow-hard-sm)] overflow-hidden">
                    {testimonial.avatarUrl ? (
                      <Image
                        src={testimonial.avatarUrl}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      initials
                    )}
                  </div>
                  <div className="relative border-l-2 border-r-2 border-border px-6">
                    <Quote aria-hidden className="mb-2 text-ink/40" size={30} />
                    <p className="text-sm font-semibold leading-6">{testimonial.content}</p>
                    <div className="mt-3 flex text-yellow">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          aria-hidden
                          size={16}
                          fill={index < testimonial.rating ? "currentColor" : "none"}
                          className={index < testimonial.rating ? "" : "text-border"}
                        />
                      ))}
                    </div>
                    <p className="mt-3 text-sm font-black">{testimonial.name}</p>
                    {roleText && <p className="text-xs font-semibold text-ink/70">{roleText}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </BrutalCard>
    </section>
  );
}
