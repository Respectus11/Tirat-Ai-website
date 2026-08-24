"use client";

import { useI18n } from "@/i18n";
import { mailtoUrl } from "@/lib/site";
import Reveal from "./ui/Reveal";
import SectionHeading from "./ui/SectionHeading";

const PARTNER_ICONS = [
  // field pilot — map pin
  <path key="pilot" d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />,
  // dataset — database
  <path key="data" d="M4 6c0-1.66 3.58-3 8-3s8 1.34 8 3-3.58 3-8 3-8-1.34-8-3Zm0 0v12c0 1.66 3.58 3 8 3s8-1.34 8-3V6M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" />,
  // invest — trending up
  <path key="invest" d="m3 17 6-6 4 4 8-8m0 0h-5m5 0v5" />,
];

export default function Partners() {
  const { t } = useI18n();
  const ctaHref = mailtoUrl(`${t.partners.heading} — ${t.brand}`, t.contact.sub);

  return (
    <section id="partners" className="scroll-mt-24 bg-mist/60 py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading eyebrow={t.partners.eyebrow} heading={t.partners.heading} sub={t.partners.sub} />

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {t.partners.cards.map((card, i) => (
            <Reveal key={card.title} delay={i * 0.12}>
              <div className="group h-full rounded-3xl border border-forest/10 bg-white p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:border-teff/60 hover:shadow-card">
                <span className="mx-auto grid size-13 place-items-center rounded-2xl bg-deep text-teff-light ring-1 ring-teff/30 transition-transform duration-300 group-hover:scale-105">
                  <svg viewBox="0 0 24 24" className="size-6.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                    {PARTNER_ICONS[i]}
                  </svg>
                </span>
                <h3 className="mt-5 text-lg font-extrabold tracking-tight text-forest">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-forest/65">{card.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <div className="mt-12 text-center">
            <a
              href={ctaHref}
              className="inline-flex items-center gap-2.5 rounded-full bg-brand px-8 py-4 text-sm font-bold text-cream shadow-soft transition-all hover:-translate-y-0.5 hover:bg-deep sm:text-base"
            >
              {t.partners.cta}
              <svg viewBox="0 0 24 24" className="size-4.5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
