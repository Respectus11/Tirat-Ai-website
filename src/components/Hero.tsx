"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useI18n } from "@/i18n";

const TeffField = dynamic(() => import("@/components/three/TeffField"), {
  ssr: false,
  loading: () => <div className="!absolute inset-0 bg-night" />,
});

const easeOut = [0.21, 0.47, 0.32, 0.98] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, delay: 0.12 * i, ease: easeOut },
  }),
};

export default function Hero() {
  const { t } = useI18n();

  return (
    <section id="top" className="relative min-h-svh overflow-hidden bg-night text-cream">
      {/* 3D teff field (client-only WebGL) */}
      <TeffField />

      {/* Legibility overlays */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-night/85 via-night/35 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-night to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-night/70 to-transparent" />

      <div className="relative z-10 mx-auto flex min-h-svh max-w-7xl flex-col justify-center px-5 pb-24 pt-32 lg:px-8">
        {/* ------------------------------- copy ------------------------------- */}
        <div className="max-w-2xl">
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}>
            <span className="inline-flex items-center gap-2.5 rounded-full border border-teff/35 bg-teff/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-teff-light backdrop-blur-sm">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-teff opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-teff" />
              </span>
              {t.hero.badge}
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className="mt-6 text-balance text-4xl font-extrabold leading-[1.06] tracking-tight sm:text-6xl xl:text-[4.15rem]"
          >
            {t.hero.titleA}
            <span className="block bg-gradient-to-r from-teff-light via-teff to-[#b97f2e] bg-clip-text text-transparent">
              {t.hero.titleB}
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
            className="mt-6 max-w-xl text-base leading-relaxed text-cream/75 sm:text-lg"
          >
            {t.hero.sub}
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={3}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <a
              href="#download"
              className="animate-pulse-ring rounded-full bg-teff px-7 py-3.5 text-sm font-bold text-night shadow-soft transition-transform hover:-translate-y-0.5 hover:bg-teff-light sm:text-base"
            >
              {t.hero.ctaPrimary}
            </a>
            <a
              href="#contact"
              className="rounded-full border border-white/25 bg-white/5 px-7 py-3.5 text-sm font-semibold text-cream backdrop-blur-sm transition-colors hover:bg-white/15 sm:text-base"
            >
              {t.hero.ctaSecondary}
            </a>
          </motion.div>
        </div>
      </div>

      {/* Scroll hint */}
      <motion.a
        href="#problem"
        aria-label={t.hero.scrollHint}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1.5 text-cream/60 transition-colors hover:text-teff-light"
      >
        <span className="text-[0.65rem] font-bold uppercase tracking-[0.24em]">{t.hero.scrollHint}</span>
        <motion.svg
          viewBox="0 0 24 24"
          className="size-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        >
          <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
      </motion.a>
    </section>
  );
}
