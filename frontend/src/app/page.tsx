import { AboutSection } from "@/components/sections/about-section";
import { BentoSection } from "@/components/sections/bento-section";
import { ContactSection } from "@/components/sections/contact-section";
import { FeaturedWorkSection } from "@/components/sections/featured-work-section";
import { HeroSection } from "@/components/sections/hero-section";
import { ServicesSection } from "@/components/sections/services-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { TimelineSection } from "@/components/sections/timeline-section";
import { TrustedBySection } from "@/components/sections/trusted-by-section";

import { ProjectService } from "@/server/services/project.service";
import { TimelineService } from "@/server/services/timeline.service";
import { TestimonialService } from "@/server/services/testimonial.service";
import { ContentService } from "@/server/services/content.service";
import { SettingService } from "@/server/services/setting.service";

export const revalidate = 60; // Revalidate every 60 seconds (ISR)

export default async function Home() {
  let projects: Awaited<ReturnType<typeof ProjectService.getFeaturedProjects>> = [];
  let timelineItems: Awaited<ReturnType<typeof TimelineService.getTimelineItems>> = [];
  let testimonials: Awaited<ReturnType<typeof TestimonialService.getApprovedTestimonials>> = [];
  let content: Awaited<ReturnType<typeof ContentService.getAllContent>> = {};
  let settings: Awaited<ReturnType<typeof SettingService.getSettings>> | null = null;

  try {
    const [
      dbProjects,
      dbTimeline,
      dbTestimonials,
      dbContent,
      dbSettings
    ] = await Promise.all([
      ProjectService.getFeaturedProjects(),
      TimelineService.getTimelineItems(),
      TestimonialService.getApprovedTestimonials(),
      ContentService.getAllContent(),
      SettingService.getSettings()
    ]);
    projects = dbProjects;
    timelineItems = dbTimeline;
    testimonials = dbTestimonials;
    content = dbContent;
    settings = dbSettings;
  } catch (error) {
    console.warn("Gagal memuat data dari database, menggunakan data fallback:", error);
  }

  return (
    <main className="flex-1">
      <HeroSection content={content} />
      <TrustedBySection />
      <AboutSection content={content} />
      <BentoSection />
      <FeaturedWorkSection projects={projects} />
      <ServicesSection />
      <TimelineSection items={timelineItems} />
      <TestimonialsSection testimonials={testimonials} />
      <ContactSection settings={settings} />
    </main>
  );
}
