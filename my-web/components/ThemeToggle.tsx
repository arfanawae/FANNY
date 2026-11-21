"use client";

import { useEffect, useSyncExternalStore } from "react";

const THEME_CHANGE_EVENT = "theme-change";

function subscribeToThemeChanges(onChange: () => void) {
  window.addEventListener(THEME_CHANGE_EVENT, onChange);
  return () => window.removeEventListener(THEME_CHANGE_EVENT, onChange);
}

function getThemeSnapshot() {
  return document.documentElement.classList.contains("dark");
}

function getServerThemeSnapshot() {
  return false;
}

function updateTheme(isDark: boolean) {
  document.documentElement.classList.toggle("dark", isDark);
  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}

export default function ThemeToggle() {
  const dark = useSyncExternalStore(
    subscribeToThemeChanges,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );

  useEffect(() => {
    updateTheme(localStorage.getItem("theme") === "dark");
  }, []);

  const handleToggle = () => {
    const next = !dark;
    localStorage.setItem("theme", next ? "dark" : "light");
    updateTheme(next);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="rounded-lg border border-slate-600 px-3 py-1 text-sm hover:border-sky-400"
    >
      {dark ? "Light" : "Dark"}
    </button>
  );
}