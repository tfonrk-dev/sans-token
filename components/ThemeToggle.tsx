"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("sans-theme", next ? "dark" : "light");
    } catch {
      /* ignore */
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Açık moda geç" : "Koyu moda geç"}
      className={
        "flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate shadow-pop-sm transition-transform hover:-translate-y-0.5 dark:bg-night-card dark:text-sun " +
        className
      }
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
