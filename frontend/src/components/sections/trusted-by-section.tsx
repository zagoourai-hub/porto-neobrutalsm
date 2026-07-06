import { trustedStack } from "@/lib/landing-data";
import { Marquee } from "@/components/ui/marquee";

export function TrustedBySection() {
  return (
    <section className="brutal-container py-5">
      <div className="flex flex-col gap-4 border-[3px] border-border bg-surface p-5 shadow-[var(--shadow-hard-md)] md:flex-row md:items-center overflow-hidden">
        <p className="min-w-28 text-sm font-black uppercase shrink-0">Trusted By</p>
        <div className="hidden h-9 w-px bg-border md:block shrink-0" />
        
        <div className="flex-1 overflow-hidden">
          <Marquee pauseOnHover className="[--duration:25s] py-1">
            {trustedStack.map((item) => (
              <div 
                key={item} 
                className="mx-3 text-center text-sm font-black uppercase border-2 border-border bg-surface px-4 py-2 shadow-[var(--shadow-hard-sm)]"
              >
                {item}
              </div>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}
