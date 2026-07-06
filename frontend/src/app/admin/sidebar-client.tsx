"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Calendar, 
  MessageSquare, 
  Settings, 
  LogOut, 
  FolderGit2,
  Star
} from "lucide-react";

interface AdminSidebarProps {
  email: string;
}

export function AdminSidebar({ email }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Projects", href: "/admin/projects", icon: FolderGit2 },
    { name: "Timeline", href: "/admin/timeline", icon: Calendar },
    { name: "Testimonials", href: "/admin/testimonials", icon: Star },
    { name: "Messages", href: "/admin/messages", icon: MessageSquare, badge: 3 },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        router.push("/login");
        router.refresh();
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <aside className="w-full border-b-[3px] border-border bg-yellow p-4 sm:p-6 lg:w-64 lg:border-b-0 lg:border-r-[3px] lg:min-h-screen flex flex-col justify-between shadow-[4px_0_0_var(--color-border)] shrink-0 sticky top-0">
      <div>
        {/* Logo */}
        <div className="mb-6">
          <Link href="/admin" className="text-2xl font-black uppercase tracking-[-0.06em]">
            RISZDEV<span className="text-purple-600">.</span>
          </Link>
        </div>

        {/* User Card */}
        <div className="border-2 border-border bg-surface p-3.5 shadow-[var(--shadow-hard-sm)] mb-6 flex items-center gap-3">
          <div className="relative h-10 w-10 border-2 border-border overflow-hidden bg-purple shrink-0">
            <Image
              alt="Admin Avatar"
              className="object-cover"
              fill
              sizes="40px"
              src="/images/profile1.jpg"
            />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-black uppercase truncate">RiszDev Admin</p>
            <p className="text-[10px] font-bold text-ink/75 truncate mt-0.5" title={email}>{email}</p>
          </div>
        </div>
        
        {/* Navigation Menu */}
        <nav className="space-y-2.5">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`relative flex items-center gap-3 border-2 border-border p-2.5 text-xs font-black uppercase transition shadow-[1px_1px_0_var(--color-border)] hover:bg-surface hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_var(--color-border)] ${
                  isActive ? "bg-surface shadow-[3px_3px_0_var(--color-border)] -translate-x-0.5 -translate-y-0.5" : "bg-yellow"
                }`}
              >
                <Icon size={16} />
                {item.name}
                {item.badge ? (
                  <span className="absolute right-3 flex h-4 min-w-4 items-center justify-center rounded-full border border-border bg-pink px-1 text-[8px] font-black text-ink shadow-[1px_1px_0_var(--color-border)]">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout button */}
      <button
        onClick={handleLogout}
        className="mt-8 flex w-full items-center gap-3 border-2 border-border bg-pink p-2.5 text-xs font-black uppercase text-ink transition shadow-[1px_1px_0_var(--color-border)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_var(--color-border)] cursor-pointer"
      >
        <LogOut size={16} />
        Logout
      </button>
    </aside>
  );
}
