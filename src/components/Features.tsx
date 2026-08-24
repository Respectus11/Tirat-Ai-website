"use client";

import { useI18n } from "@/i18n";
import Reveal from "./ui/Reveal";
import SectionHeading from "./ui/SectionHeading";

const FEATURE_ICONS: Record<string, React.ReactNode> = {
  lock: <path d="M7 11V8a5 5 0 0 1 10 0v3m-11 0h12a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1Z" />,
  "wifi-off": <path d="m2 2 20 20M8.5 16.5a5 5 0 0 1 6-1m-9.4-3a9.8 9.8 0 0 1 4-2.4M3 7a14.4 14.4 0 0 1 5-2.6M12 19.5h.01" />,
  percent: <path d="M19 5 5 19M6.5 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm11 11a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />,
  history: <path d="M3 3v5h5m13 4a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM12 7v5l3 3" />,
  languages: <path d="m5 8 6 6M4 14l6-6 2-3M2 5h12M7 2h1M22 22l-5-10-5 10M14 18h6" />,
  flask: <path d="M9 3h6M10 3v6L4.6 18.1A2 2 0 0 0 6.4 21h11.2a2 2 0 0 0 1.8-2.9L14 9V3M7.5 15h9" />,
};

export default function Features() {
  const { t } = useI18n();

  return (
    <section id="features" className="scroll-mt-24 bg-cream py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading eyebrow={t.features.eyebrow} heading={t.features.heading} sub={t.features.sub} />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {t.features.items.map((item, i) => (
            <Reveal key={item.title} delay={(i % 3) * 0.1}>
              <div className="group h-full rounded-3xl border border-forest/10 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-card">
                <span className="grid size-12 place-items-center rounded-2xl bg-brand/10 text-brand ring-1 ring-brand/20 transition-colors duration-300 group-hover:bg-brand group-hover:text-cream">
                  <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                    {FEATURE_ICONS[item.icon] ?? FEATURE_ICONS.lock}
                  </svg>
                </span>
                <h3 className="mt-5 text-lg font-extrabold tracking-tight text-forest">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-forest/65">{item.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
