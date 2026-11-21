"use client";

import Link from "next/link";
import { useLang } from "@/components/LanguageProvider";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const { lang, setLang, t } = useLang();

  const links = [
    { href: "/Home", label: t.home },
    { href: "/about", label: t.about },
    { href: "/posts", label: t.posts },
    { href: "/count", label: t.count },
    { href: "/Hi", label: t.greeting },
  ];

  return (
    <nav className="bg-slate-200 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <div className="flex items-center justify-between p-4">
        <Link href="/" className="text-xl font-bold">
          MyWeb
        </Link>

        <div className="flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-sky-400"
            >
              {link.label}
            </Link>
          ))}

          <button
            onClick={() => setLang(lang === "th" ? "en" : "th")}
            className="rounded-lg border border-slate-600 px-3 py-1 text-sm hover:border-sky-400"
          >
            {lang === "th" ? "EN" : "TH"}
          </button>

          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}