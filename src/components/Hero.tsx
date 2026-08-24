"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useI18n } from "@/i18n";
import GrainMark from "./ui/GrainMark";

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

      <div className="relative z-10 mx-auto grid min-h-svh max-w-7xl items-center gap-12 px-5 pb-24 pt-32 lg:grid-cols-[1.08fr_0.92fr] lg:px-8">
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

        {/* --------------------------- app mockup card --------------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.45, ease: easeOut }}
          className="relative mx-auto hidden w-full max-w-sm lg:block"
        >
          {/* Floating chip: wood flour warning */}
          <div className="animate-float-slow absolute -right-8 -top-10 z-20 rotate-3">
            <div className="flex items-center gap-2 rounded-2xl border border-[#f0b95e]/40 bg-[#3a2a12]/85 px-4 py-2.5 shadow-card backdrop-blur-md">
              <span className="grid size-6 place-items-center rounded-full bg-clay text-xs text-cream">
                !
              </span>
              <span className="text-xs font-bold text-[#ffd9a0]">{t.hero.verdictWood}</span>
            </div>
          </div>

          {/* Floating chip: speed */}
          <div
            className="animate-float-slow absolute -bottom-8 -left-10 z-20 -rotate-2"
            style={{ animationDelay: "-3.2s" }}
          >
            <div className="flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-2.5 shadow-card backdrop-blur-md">
              <svg viewBox="0 0 24 24" className="size-4 text-teff" fill="currentColor">
                <path d="M13 2 4.5 13.5H11L9.5 22 19 10h-6.5L13 2Z" />
              </svg>
              <span className="text-xs font-bold text-cream">{t.hero.scanTag}</span>
            </div>
          </div>

          {/* Glass scan-result card */}
          <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-white/[0.08] p-6 shadow-soft backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="grid size-8 place-items-center rounded-lg bg-teff text-night">
                  <GrainMark className="size-4.5" />
                </span>
                <span className="text-sm font-extrabold tracking-tight">ጥራት</span>
              </div>
              <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-cream/80">
                <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
                AI
              </span>
            </div>

            {/* Viewfinder over a flour pile */}
            <div className="relative mt-5 h-44 overflow-hidden rounded-2xl bg-gradient-to-br from-[#20351f] to-[#101c10]">
              <div
                className="absolute inset-x-10 bottom-[-30%] top-[38%] rounded-[50%] bg-[radial-gradient(ellipse_at_center,#efe6d0_0%,#d8c8a4_55%,transparent_72%)] blur-[2px]"
              />
              <div className="absolute inset-x-16 bottom-[-34%] top-[52%] rounded-[50%] bg-[radial-gradient(ellipse_at_center,#fbf5e6_0%,transparent_65%)] opacity-80" />
              {/* viewfinder corners */}
              {["left-3 top-3 border-l-2 border-t-2", "right-3 top-3 border-r-2 border-t-2", "bottom-3 left-3 border-b-2 border-l-2", "bottom-3 right-3 border-b-2 border-r-2"].map(
                (pos) => (
                  <span key={pos} className={`absolute size-5 rounded-[3px] border-teff/80 ${pos}`} />
                ),
              )}
              <span className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-night/60 px-3 py-1 text-[0.65rem] font-semibold tracking-wide text-teff-light backdrop-blur-sm">
                {t.how.chipAnalyzing}
              </span>
            </div>

            {/* Verdict */}
            <div className="mt-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-full bg-emerald-500/20 ring-1 ring-emerald-400/50">
                  <svg viewBox="0 0 24 24" className="size-5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <div>
                  <p className="text-lg font-extrabold leading-none">{t.hero.verdictPure}</p>
                  <p className="mt-1 text-[0.7rem] font-medium text-cream/55">{t.trust.items[0].desc}</p>
                </div>
              </div>
              <span className="text-right">
                <span className="block text-2xl font-black leading-none text-emerald-400">92%</span>
                <span className="text-[0.62rem] font-bold uppercase tracking-wider text-cream/50">
                  {t.hero.confidenceShort}
                </span>
              </span>
            </div>

            {/* Confidence bar */}
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "92%" }}
                transition={{ duration: 1.4, delay: 1.1, ease: easeOut }}
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-300"
              />
            </div>
          </div>
        </motion.div>
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
