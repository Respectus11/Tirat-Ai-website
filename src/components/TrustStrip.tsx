"use client";

import { useI18n } from "@/i18n";
import Reveal from "./ui/Reveal";

const ICONS = [
  // lock — private by design
  <path key="lock" d="M7 11V8a5 5 0 0 1 10 0v3m-11 0h12a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1Z" />,
  // wifi-off — works offline
  <path key="wifi" d="m2 2 20 20M8.5 16.5a5 5 0 0 1 6-1m-9.4-3a9.8 9.8 0 0 1 4-2.4M3 7a14.4 14.4 0 0 1 5-2.6M12 19.5h.01" />,
  // languages — amharic first
  <path key="lang" d="m5 8 6 6M4 14l6-6 2-3M2 5h12M7 2h1M22 22l-5-10-5 10M14 18h6" />,
  // bolt — instant verdicts
  <path key="bolt" d="M13 2 4.5 13.5H11L9.5 22 19 10h-6.5L13 2Z" />,
];

export default function TrustStrip() {
  const { t } = useI18n();

  return (
    <section className="border-y border-white/5 bg-night py-12 text-cream">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        {t.trust.items.map((item, i) => (
          <Reveal key={item.title} delay={i * 0.08}>
            <div className="flex items-start gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand/25 text-teff-light ring-1 ring-teff/30">
                <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                  {ICONS[i]}
                </svg>
              </span>
              <div>
                <h3 className="text-sm font-extrabold tracking-tight">{item.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-cream/55">{item.desc}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
