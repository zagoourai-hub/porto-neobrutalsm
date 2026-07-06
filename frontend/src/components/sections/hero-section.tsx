"use client";

import { type ReactNode, useRef } from "react";
import Image from "next/image";
import { ArrowDownToLine, ArrowUpRight, MapPin, Star } from "lucide-react";
import { BrutalButton } from "@/components/ui/brutal-button";
import { DecorativeDoodles } from "@/components/sections/decorative-doodles";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface HeroSectionProps {
  content?: Record<string, { value: string; type: string }>;
}

export function HeroSection({ content }: HeroSectionProps) {
  const subtitle = content?.["hero.subtitle"]?.value || "Saya membangun produk digital yang fungsional, estetis, dan berdampak untuk membantu bisnis tumbuh lebih cepat.";
  
  const containerRef = useRef<HTMLDivElement>(null);
  const visualWrapperRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Entrance animations
    tl.fromTo(".hero-title", 
      { y: 50, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.8, delay: 0.2 }
    )
    .fromTo(".hero-badge", 
      { scale: 0.8, opacity: 0 }, 
      { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.5)" }, 
      "-=0.4"
    )
    .fromTo(".hero-subtitle", 
      { y: 30, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.6 }, 
      "-=0.3"
    )
    .fromTo(".hero-button-item", 
      { y: 20, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.15 }, 
      "-=0.3"
    )
    .fromTo(".hero-visual", 
      { scale: 0.9, opacity: 0, rotation: -3 }, 
      { scale: 1, opacity: 1, rotation: 0, duration: 1, ease: "back.out(1.2)" }, 
      "-=0.6"
    )
    .fromTo(".hero-chip", 
      { x: 50, opacity: 0 }, 
      { x: 0, opacity: 1, duration: 0.6, stagger: 0.15 }, 
      "-=0.6"
    );

    // Infinite floating animations for doodles
    gsap.to(".doodle-float-1", { y: 15, repeat: -1, yoyo: true, duration: 3, ease: "sine.inOut" });
    gsap.to(".doodle-float-2", { y: -15, rotation: 10, repeat: -1, yoyo: true, duration: 3.5, ease: "sine.inOut" });
    gsap.to(".doodle-float-3", { x: 10, repeat: -1, yoyo: true, duration: 2.8, ease: "sine.inOut" });
    gsap.to(".doodle-float-4", { rotation: 360, repeat: -1, duration: 20, ease: "none" });

    // 3D Tilt Effect on Hero Card
    const wrapper = visualWrapperRef.current;
    const card = containerRef.current?.querySelector(".hero-3d-card");
    const photo = containerRef.current?.querySelector(".hero-photo-box");
    const label = containerRef.current?.querySelector(".hero-label-box");

    if (wrapper && card) {
      gsap.set(wrapper, { perspective: 1000 });
      gsap.set(card, { transformStyle: "preserve-3d" });
      if (photo) gsap.set(photo, { transformStyle: "preserve-3d", z: 30 });
      if (label) gsap.set(label, { transformStyle: "preserve-3d", z: 60 });

      const handleMouseMove = (e: MouseEvent) => {
        const rect = wrapper.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const xc = x / rect.width - 0.5;
        const yc = y / rect.height - 0.5;

        const tiltX = yc * -15;
        const tiltY = xc * 15;

        gsap.to(card, {
          rotationX: tiltX,
          rotationY: tiltY,
          ease: "power2.out",
          duration: 0.5,
        });

        if (photo) {
          gsap.to(photo, { z: 45, duration: 0.5, ease: "power2.out" });
        }
        if (label) {
          gsap.to(label, { z: 80, duration: 0.5, ease: "power2.out" });
        }
      };

      const handleMouseLeave = () => {
        gsap.to(card, {
          rotationX: 0,
          rotationY: 0,
          ease: "power2.out",
          duration: 0.8,
        });

        if (photo) {
          gsap.to(photo, { z: 30, duration: 0.8, ease: "power2.out" });
        }
        if (label) {
          gsap.to(label, { z: 60, duration: 0.8, ease: "power2.out" });
        }
      };

      wrapper.addEventListener("mousemove", handleMouseMove);
      wrapper.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        wrapper.removeEventListener("mousemove", handleMouseMove);
        wrapper.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="home" className="relative overflow-hidden pt-24 pb-12 lg:pt-[110px] lg:pb-[72px]">
      <DecorativeDoodles />
      <div className="brutal-container grid items-center gap-20 lg:grid-cols-[1fr_0.99fr]">
        <div className="opacity-0 hero-content-wrapper" style={{ animation: "none", opacity: 1 }}>
          <h1 className="hero-title heading-brutal space-y-2 text-5xl lg:leading-12 font-black text-ink sm:text-7xl lg:text-[5rem] xl:text-[5rem] opacity-0">
           <span className="text-purple-600">hello</span><br/>
            welcome to my website
          </h1>
          <div className="hero-badge mt-4 inline-flex border-[3px] border-border bg-surface px-4 py-2 text-sm font-black uppercase shadow-[var(--shadow-hard-sm)] sm:text-lg opacity-0">
            Fullstack Developer & UI/UX Designer
            <span className="ml-4 w-4 bg-purple" aria-hidden="true" />
          </div>
          <p className="hero-subtitle mt-5 max-w-xl text-base font-semibold leading-5 text-ink opacity-0">
            {subtitle}
          </p>
          <div className="hero-buttons mt-6 flex flex-col gap-4 sm:flex-row">
            <div className="hero-button-item opacity-0">
              <BrutalButton href="#work">
                Lihat Karya Saya <ArrowUpRight aria-hidden size={18} />
              </BrutalButton>
            </div>
            <div className="hero-button-item opacity-0">
              <BrutalButton href="#contact" variant="secondary">
                Unduh CV <ArrowDownToLine aria-hidden size={18} />
              </BrutalButton>
            </div>
          </div>
        </div>

        <div ref={visualWrapperRef} className="relative min-h-[390px] lg:min-h-[520px]">
          {/* Main Visual box containing yellow box and profiles, animated as a group */}
          <div className="hero-visual absolute bottom-0 left-1/2 aspect-[335/360] w-[min(88%,720px)] -translate-x-1/2 opacity-0">
            {/* 3D tiltable card wrapper */}
            <div className="hero-3d-card relative w-full h-full">
              <div className="absolute bottom-2 left-0 h-56 w-32 border-[3px] border-border bg-cyan shadow-[var(--shadow-hard-sm)]" />
              <div className="dot-pattern absolute right-14 top-36 h-28 w-28" />
              <div className="absolute inset-0 border-[3px] border-border bg-yellow shadow-[var(--shadow-hard-lg)]">
                <div className="dot-pattern absolute right-8 top-28 h-28 w-24 opacity-80" />
                <div className="absolute -left-5 top-8 h-44 w-12 border-2 border-border bg-surface/70 bg-[linear-gradient(var(--color-border)_1px,transparent_1px),linear-gradient(90deg,var(--color-border)_1px,transparent_1px)] bg-[size:10px_10px]" />
                <div className="absolute -bottom-4 -left-7 h-40 w-28 border-[3px] border-border bg-cyan" />
                <div className="absolute left-9 top-8 h-16 w-16 rotate-[-35deg] border-l-[5px] border-t-[5px] border-border" />
                <div className="hero-photo-box absolute inset-x-8 bottom-16 top-14 overflow-hidden border-[6px] border-surface bg-purple shadow-[0_0_0_3px_var(--color-border)]">
                  <Image
                    alt="riszDev profile visual"
                    className="object-cover object-center"
                    fill
                    priority
                    sizes="(min-width: 1024px) 340px, 70vw"
                    src="/images/profile1.jpg"
                  />
                </div>
                <div className="hero-label-box absolute bottom-7 left-7 -rotate-3 border-[3px] border-border bg-purple px-4 py-2 text-xl font-black uppercase leading-none text-white shadow-[var(--shadow-hard-md)]">
                  Building
                  <br />
                  Digital Impact
                </div>
              </div>
            </div>
          </div>
          
          <div className="absolute right-0 top-20 grid gap-4">
            <div className="hero-chip opacity-0">
              <InfoChip icon={<MapPin aria-hidden size={28} />} label="Based In" value="Indonesia" />
            </div>
            <div className="hero-chip opacity-0">
              <InfoChip icon={<Star aria-hidden size={30} />} label="4+ Years" value="Experience" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoChip({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="hidden min-w-44 items-center gap-3 border-[3px] border-border bg-surface p-4 shadow-[var(--shadow-hard-md)] md:flex">
      <div className="text-cyan">{icon}</div>
      <div className="text-xs font-black uppercase leading-tight">
        <span className="block">{label}</span>
        <span className="text-base">{value}</span>
      </div>
    </div>
  );
}
