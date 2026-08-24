"use client";

import { useI18n, type Language } from "@/i18n";

const OPTIONS: { key: Language; label: string }[] = [
  { key: "en", label: "EN" },
  { key: "am", label: "\u12a0\u121b" },
];

export default function LanguageToggle({ dark = false }: { dark?: boolean }) {
  const { lang, setLang } = useI18n();

  return (
    <div
      role="group"
      aria-label="Language / ቋንቋ"
      className={`flex items-center rounded-full border p-1 transition-colors ${
        dark
          ? "border-white/25 bg-white/10 backdrop-blur-sm"
          : "border-forest/15 bg-forest/5"
      }`}
    >
      {OPTIONS.map((opt) => {
        const active = lang === opt.key;
        return (
          <button
            key={opt.key}
            type="button"
            onClick={() => setLang(opt.key)}
            aria-pressed={active}
            className={`rounded-full px-3 py-1 text-xs font-bold tracking-wide transition-all ${
              active
                ? "bg-teff text-night shadow-sm"
                : dark
                  ? "text-cream/70 hover:text-cream"
                  : "text-forest/60 hover:text-forest"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
