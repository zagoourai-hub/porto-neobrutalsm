"use client";

import { usePathname } from "next/navigation";

export function MainContentWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminOrLogin = pathname.startsWith("/admin") || pathname.startsWith("/login");

  return (
    <div className={`flex flex-1 flex-col ${isAdminOrLogin ? "" : "pt-24"}`}>
      {children}
    </div>
  );
}
