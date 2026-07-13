"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { COPY, type Lang } from "@/config/copy";

const LangCtx = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({ lang: "tr", setLang: () => {} });

export function LangProvider({ children }: { children: React.ReactNode }) {
  // Server + first client render use "tr" (matches SSR → no hydration mismatch);
  // after mount we switch to the stored choice or the visitor's browser language.
  const [lang, setLangState] = useState<Lang>("tr");

  useEffect(() => {
    let initial: Lang = "tr";
    try {
      const stored = localStorage.getItem("sans-lang") as Lang | null;
      if (stored === "tr" || stored === "en") initial = stored;
      else if (!navigator.language.toLowerCase().startsWith("tr")) initial = "en";
    } catch {
      /* ignore */
    }
    setLangState(initial);
    document.documentElement.lang = initial;
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    document.documentElement.lang = l;
    try {
      localStorage.setItem("sans-lang", l);
    } catch {
      /* ignore */
    }
  };

  return <LangCtx.Provider value={{ lang, setLang }}>{children}</LangCtx.Provider>;
}

export const useLang = () => useContext(LangCtx);
/** Copy for the active language. */
export const useT = () => COPY[useContext(LangCtx).lang];
