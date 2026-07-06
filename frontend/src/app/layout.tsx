import type { Metadata } from "next";
import { FloatingNavbar } from "@/components/layout/floating-navbar";
import { Footer } from "@/components/layout/footer";
import { MainContentWrapper } from "@/components/layout/main-content-wrapper";
import "./globals.css";

export const metadata: Metadata = {
  title: "RiszDev - Fullstack Developer & UI/UX Designer",
  description:
    "Portfolio fullstack developer dan UI/UX designer Indonesia yang membantu bisnis membangun website, aplikasi, dan produk digital modern.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full antialiased">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="flex min-h-full flex-col overflow-x-hidden brutal-grid-bg">
        <FloatingNavbar />
        <MainContentWrapper>{children}</MainContentWrapper>
        <Footer />
      </body>
    </html>
  );
}
