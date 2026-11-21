import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { LanguageProvider } from "@/components/LanguageProvider";

export const metadata: Metadata = {
  title: "MyWeb",
  description: "เว็บแรกด้วย Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className="flex min-h-screen flex-col bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100">
        <LanguageProvider>
          <Suspense>
            <Navbar />
          </Suspense>

          <main className="mx-auto w-full max-w-6xl flex-1 p-4">
            {children}
          </main>
        </LanguageProvider>
      </body>
    </html>
  );
}