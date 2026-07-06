import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { AdminSidebar } from "./sidebar-client";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen flex-col bg-surface lg:flex-row border-t-[4px] border-black">
      {/* Sidebar Navigasi */}
      <AdminSidebar email={session.email} />
      
      {/* Konten Utama */}
      <div className="flex-1 p-4 sm:p-6 lg:p-10 bg-surface">
        <div className="mx-auto max-w-7xl w-full px-2 sm:px-6 lg:px-8">
          {children}
        </div>
      </div>
    </div>
  );
}
