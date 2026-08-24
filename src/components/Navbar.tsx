"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/i18n";
import { NAV_ANCHORS } from "@/lib/site";
import GrainMark from "./ui/GrainMark";
import LanguageToggle from "./ui/LanguageToggle";

export default function Navbar() {
  const { t } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const dark = !scrolled && !open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? "border-b border-forest/10 bg-cream/85 shadow-[0_8px_30px_-12px_rgb(19_79_44/0.25)] backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:h-[4.5rem] lg:px-8">
        <a href="#top" className="group flex items-center gap-2.5">
          <span
            className={`grid size-9 place-items-center rounded-xl transition-colors ${
              dark ? "bg-teff text-night" : "bg-brand text-cream"
            }`}
          >
            <GrainMark className="size-5" />
          </span>
          <span
            className={`flex flex-col leading-none transition-colors ${
              dark ? "text-cream" : "text-forest"
            }`}
          >
            <span className="text-lg font-extrabold tracking-tight">
              ጥራት <span className="font-bold opacity-70">AI</span>
            </span>
            <span className="mt-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.28em] opacity-60">
              Tirat AI
            </span>
          </span>
        </a>

        <div className="hidden items-center gap-7 lg:flex">
          {NAV_ANCHORS.map((key) => (
            <a
              key={key}
              href={`#${key}`}
              className={`text-sm font-semibold transition-opacity hover:opacity-100 ${
                dark ? "text-cream/85" : "text-forest/80"
              }`}
            >
              {t.nav[key]}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <LanguageToggle dark={dark} />
          <a
            href="#download"
            className={`hidden rounded-full px-5 py-2.5 text-sm font-bold transition-all hover:-translate-y-0.5 sm:inline-flex ${
              dark
                ? "bg-teff text-night hover:bg-teff-light"
                : "bg-brand text-cream hover:bg-deep"
            }`}
          >
            {t.hero.ctaPrimary}
          </a>

          {/* Mobile menu button */}
          <button
            type="button"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className={`grid size-10 place-items-center rounded-full border lg:hidden ${
              dark ? "border-white/25 text-cream" : "border-forest/15 text-forest"
            }`}
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {open && (
        <div className="border-t border-forest/10 bg-cream px-5 pb-5 pt-3 lg:hidden">
          <div className="flex flex-col gap-1">
            {NAV_ANCHORS.map((key) => (
              <a
                key={key}
                href={`#${key}`}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-semibold text-forest/85 hover:bg-forest/5"
              >
                {t.nav[key]}
              </a>
            ))}
            <a
              href="#download"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-brand px-5 py-3 text-center text-sm font-bold text-cream"
            >
              {t.hero.ctaPrimary}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
