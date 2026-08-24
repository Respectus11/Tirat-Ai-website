"use client";

import { useI18n } from "@/i18n";
import Reveal from "./ui/Reveal";
import SectionHeading from "./ui/SectionHeading";

const STEP_ICONS = [
  // camera
  <path key="cam" d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Zm8 9.5a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" strokeWidth="1.7" />,
  // chip / on-device brain
  <path key="chip" d="M9 3v3m6-3v3M9 18v3m6-3v3M3 9h3m-3 6h3m12-6h3m-3 6h3M6 6h12a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Zm4 4h4v4h-4Z" strokeWidth="1.7" />,
  // check-badge
  <path key="badge" d="M12 2 14.5 5l3.8-.5-.5 3.8L21 11l-3.2 2.7.5 3.8-3.8-.5L12 20l-2.5-3-3.8.5.5-3.8L3 11l3.2-2.7-.5-3.8 3.8.5L12 2Zm-3 9 2 2 4-4" strokeWidth="1.6" />,
];

export default function HowItWorks() {
  const { t } = useI18n();

  return (
    <section id="how" className="scroll-mt-24 bg-mist/60 py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading eyebrow={t.how.eyebrow} heading={t.how.heading} sub={t.how.sub} />

        {/* Steps */}
        <div className="relative mx-auto mt-16 grid max-w-5xl gap-10 md:grid-cols-3 md:gap-6">
          {/* connector line (desktop) */}
          <div className="absolute left-[16%] right-[16%] top-9 hidden border-t-2 border-dashed border-brand/25 md:block" />

          {t.how.steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.15}>
              <div className="relative flex flex-col items-center text-center">
                <span className="relative z-10 grid size-18 place-items-center rounded-3xl bg-white shadow-card ring-1 ring-forest/10">
                  <svg viewBox="0 0 24 24" className="size-8 text-brand" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                    {STEP_ICONS[i]}
                  </svg>
                  <span className="absolute -right-2 -top-2 grid size-6 place-items-center rounded-full bg-teff text-xs font-black text-night">
                    {i + 1}
                  </span>
                </span>
                <h3 className="mt-5 text-lg font-extrabold tracking-tight text-forest">{step.title}</h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-forest/65">{step.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Honesty note */}
        <Reveal delay={0.1}>
          <div className="mx-auto mt-16 flex max-w-3xl items-start gap-4 rounded-3xl border border-brand/20 bg-white p-7 shadow-card">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-teff/15 text-deep ring-1 ring-teff/40">
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8h.01M11 12h1v4h1" strokeLinecap="round" />
              </svg>
            </span>
            <div>
              <h3 className="font-extrabold tracking-tight text-forest">{t.how.noteTitle}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-forest/70">{t.how.noteBody}</p>
            </div>
          </div>
        </Reveal>

        {/* Disclaimer banner */}
        <Reveal delay={0.15}>
          <p className="mx-auto mt-8 max-w-3xl rounded-2xl border border-clay/30 bg-clay/10 px-6 py-4 text-center text-sm font-medium leading-relaxed text-clay">
            ⚠️ {t.how.disclaimer}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
