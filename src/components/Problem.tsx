"use client";

import { useI18n } from "@/i18n";
import Reveal from "./ui/Reveal";
import SectionHeading from "./ui/SectionHeading";

const CARD_ICONS = [
  // sawdust — wood layers
  <path key="wood" d="M3 7h18M3 12h18M3 17h18m-6-5h.01" strokeWidth="1.8" />,
  // gypsum — mineral crystal
  <path key="mineral" d="M12 2 4 7v10l8 5 8-5V7l-8-5Zm0 0v20M4 7l8 5 8-5" strokeWidth="1.6" />,
];

export default function Problem() {
  const { t } = useI18n();

  return (
    <section id="problem" className="scroll-mt-24 bg-cream py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow={t.problem.eyebrow}
          heading={t.problem.heading}
          sub={t.problem.sub}
        />

        {/* Adulterant cards */}
        <div className="mx-auto mt-14 grid max-w-4xl gap-6 md:grid-cols-2">
          {t.problem.cards.map((card, i) => (
            <Reveal key={card.title} delay={i * 0.12}>
              <div className="group h-full rounded-3xl border border-forest/10 bg-white p-8 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-soft">
                <span className="grid size-13 place-items-center rounded-2xl bg-clay/10 text-clay ring-1 ring-clay/25 transition-colors group-hover:bg-clay group-hover:text-cream">
                  <svg viewBox="0 0 24 24" className="size-6.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                    {CARD_ICONS[i]}
                  </svg>
                </span>
                <h3 className="mt-5 text-xl font-extrabold tracking-tight text-forest">{card.title}</h3>
                <p className="mt-3 leading-relaxed text-forest/70">{card.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Stats */}
        <div className="mx-auto mt-16 grid max-w-4xl gap-8 sm:grid-cols-3">
          {t.problem.stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.1}>
              <div className="text-center">
                <p className="bg-gradient-to-br from-brand to-deep bg-clip-text text-4xl font-black tracking-tight text-transparent sm:text-5xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm leading-snug text-forest/60">{stat.label}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Closing line */}
        <Reveal delay={0.15}>
          <p className="mx-auto mt-16 max-w-2xl text-center text-lg font-medium leading-relaxed text-deep sm:text-xl">
            {t.problem.closing}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
