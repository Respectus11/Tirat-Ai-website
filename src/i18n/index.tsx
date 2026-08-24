"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { en, type Dict } from "./en";
import { am } from "./am";

export type Language = "en" | "am";

const LANG_KEY = "tirat-lang";
const DEFAULT_LANG: Language = "en";

interface I18nCtx {
  lang: Language;
  setLang: (l: Language) => void;
  t: Dict;
}

const Ctx = createContext<I18nCtx>({
  lang: DEFAULT_LANG,
  setLang: () => undefined,
  t: en,
});

const DICTS: Record<Language, Dict> = { en, am };

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>(DEFAULT_LANG);

  useEffect(() => {
    const saved = window.localStorage.getItem(LANG_KEY);
    if (saved === "am" || saved === "en") setLangState(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === "am" ? "am" : "en";
    document.documentElement.dataset.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Language) => {
    setLangState(l);
    window.localStorage.setItem(LANG_KEY, l);
  }, []);

  return (
    <Ctx.Provider value={{ lang, setLang, t: DICTS[lang] }}>
      {children}
    </Ctx.Provider>
  );
}

export function useI18n(): I18nCtx {
  return useContext(Ctx);
}
