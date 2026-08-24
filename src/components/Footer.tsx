"use client";

import { useI18n } from "@/i18n";
import { CONTACT_EMAIL, NAV_ANCHORS } from "@/lib/site";
import GrainMark from "./ui/GrainMark";

export default function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-night text-cream">
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-xl bg-teff text-night">
                <GrainMark className="size-5" />
              </span>
              <span className="text-lg font-extrabold tracking-tight">
                ጥራት <span className="font-bold opacity-70">AI</span>
              </span>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-cream/60">
              {t.footer.tagline}
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-teff-light/80">
              {t.footer.linksTitle}
            </h3>
            <ul className="flex flex-col gap-2.5">
              {NAV_ANCHORS.map((key) => (
                <li key={key}>
                  <a
                    href={`#${key}`}
                    className="text-sm text-cream/70 transition-colors hover:text-teff-light"
                  >
                    {t.nav[key]}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-teff-light/80">
              {t.contact.directTitle}
            </h3>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-sm font-semibold text-cream transition-colors hover:text-teff-light"
            >
              {CONTACT_EMAIL}
            </a>
            <p className="mt-3 flex items-center gap-2 text-xs text-cream/50">
              <span className="inline-block size-2 rounded-full bg-brand" />
              {t.footer.madeIn}
            </p>
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-6">
          <p className="text-xs leading-relaxed text-cream/40">{t.footer.disclaimer}</p>
          <p className="mt-3 text-xs text-cream/40">
            © {year} ጥራት AI — Tirat AI. {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
