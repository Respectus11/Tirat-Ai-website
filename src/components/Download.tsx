"use client";

import { useI18n } from "@/i18n";
import { PLAY_STORE_URL, APP_STORE_URL, CONTACT_EMAIL, mailtoUrl } from "@/lib/site";
import Reveal from "./ui/Reveal";
import SectionHeading from "./ui/SectionHeading";

/**
 * Launch-day checklist (src/lib/site.ts):
 *   PLAY_STORE_URL — paste the real Google Play link
 *   APP_STORE_URL  — paste the real App Store link
 * Until set, buttons render in a "Coming soon" state and deep-link nowhere.
 */

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-7 shrink-0" fill="currentColor">
      <path d="M3.6 2.3a1.1 1.1 0 0 0-.6 1v17.4c0 .43.24.8.6 1l9.9-9.7L3.6 2.3Zm12.1 7.6L6.3 4.4l7.6 7.4 1.8-1.9Zm3.4 1.2-2.3-1.3-2 2.2 2 2.2 2.3-1.3c.75-.44.75-1.38 0-1.82ZM6.3 19.6l9.4-5.5-1.8-1.9-7.6 7.4Z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-7 shrink-0" fill="currentColor">
      <path d="M16.7 12.9c0-2.4 2-3.6 2.1-3.7-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.16-2.9.88-3.7.88-.77 0-1.95-.86-3.2-.83-1.65.02-3.17.96-4.02 2.43-1.71 2.97-.44 7.36 1.23 9.77.81 1.18 1.78 2.5 3.05 2.45 1.22-.05 1.69-.79 3.17-.79s1.9.79 3.2.77c1.32-.03 2.16-1.2 2.97-2.39.93-1.37 1.31-2.7 1.33-2.76-.03-.01-2.56-.98-2.58-3.87ZM14.3 5.4c.67-.82 1.13-1.96 1-3.1-.97.04-2.15.65-2.85 1.47-.62.72-1.17 1.88-1.03 2.98 1.09.09 2.2-.55 2.88-1.35Z" />
    </svg>
  );
}

export default function Download() {
  const { t } = useI18n();

  const stores = [
    { label: t.download.googlePlay, badge: t.download.androidBadge, url: PLAY_STORE_URL, Icon: PlayIcon },
    { label: t.download.appStore, badge: t.download.iosBadge, url: APP_STORE_URL, Icon: AppleIcon },
  ];

  const notifyHref = mailtoUrl(t.download.notifySubject, t.download.notifyBody);

  return (
    <section
      id="download"
      className="relative scroll-mt-24 overflow-hidden bg-night py-24 text-cream sm:py-28"
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teff/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading eyebrow={t.download.eyebrow} heading={t.download.heading} sub={t.download.sub} dark />

        {/* Store badges */}
        <div className="mt-14 flex flex-wrap items-stretch justify-center gap-5">
          {stores.map(({ label, badge, url, Icon }, i) => {
            const live = Boolean(url);
            const inner = (
              <>
                <Icon />
                <span className="flex flex-col items-start leading-tight">
                  <span className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] opacity-70">
                    {badge}
                  </span>
                  <span className="mt-1 text-sm font-extrabold sm:text-base">{label}</span>
                </span>
              </>
            );
            // Use a real <a> when the store link is live, otherwise a <button>
            // so screen readers don't announce a dead link.
            return (
              <Reveal key={label} delay={i * 0.12}>
                <div className="relative">
                  {live ? (
                    <a
                      href={url}
                      className="flex items-center gap-4 rounded-2xl border border-teff/60 bg-teff px-7 py-4 transition-all hover:-translate-y-0.5 hover:bg-teff-light"
                    >
                      {inner}
                    </a>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="flex cursor-not-allowed items-center gap-4 rounded-2xl border border-white/15 bg-white/[0.06] px-7 py-4 opacity-80 transition-all"
                    >
                      {inner}
                    </button>
                  )}
                  {!live && (
                    <span className="absolute -right-3 -top-3 rotate-6 rounded-full bg-clay px-3 py-1 text-[0.65rem] font-black uppercase tracking-wide text-cream shadow-card">
                      {t.download.comingSoon}
                    </span>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Notify CTA */}
        <Reveal delay={0.2}>
          <div className="mt-12 flex flex-col items-center gap-3">
            <a
              href={notifyHref}
              className="group inline-flex items-center gap-2.5 rounded-full border border-teff/40 bg-teff/10 px-7 py-3 text-sm font-bold text-teff-light transition-all hover:-translate-y-0.5 hover:bg-teff/20"
            >
              <svg viewBox="0 0 24 24" className="size-4.5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M3 8l9 6 9-6M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" strokeLinecap="round" />
              </svg>
              {t.download.notifyCta}
            </a>
            <p className="text-xs text-cream/40">{CONTACT_EMAIL}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
