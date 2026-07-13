"use client";
import { useLang } from "./LangProvider";

export default function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <button
      onClick={() => setLang(lang === "tr" ? "en" : "tr")}
      aria-label="Language"
      className="flex h-9 items-center gap-1 rounded-2xl border border-sky-200/70 bg-white px-3 text-xs font-extrabold text-slate shadow-pop-sm transition-colors hover:text-sea dark:border-white/10 dark:bg-night-card dark:text-sky-200/80"
    >
      🌐 {lang === "tr" ? "EN" : "TR"}
    </button>
  );
}
