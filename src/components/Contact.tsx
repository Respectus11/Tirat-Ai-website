"use client";

import { useState } from "react";
import { useI18n } from "@/i18n";
import { CONTACT_EMAIL, contactMailto } from "@/lib/site";
import Reveal from "./ui/Reveal";
import SectionHeading from "./ui/SectionHeading";

export default function Contact() {
  const { t, lang } = useI18n();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = contactMailto(message, name || "—", email);
  };

  const inputCls =
    "w-full rounded-xl border border-forest/15 bg-white px-4 py-3 text-sm text-forest placeholder:text-forest/40 outline-none transition-all focus:border-brand focus:ring-2 focus:ring-brand/25";

  return (
    <section id="contact" className="scroll-mt-24 bg-mist/60 py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading eyebrow={t.contact.eyebrow} heading={t.contact.heading} sub={t.contact.sub} />

        <div className="mx-auto mt-14 grid max-w-5xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Direct contact card */}
          <Reveal>
            <div className="flex h-full flex-col justify-between gap-8 rounded-3xl bg-deep p-8 text-cream shadow-soft sm:p-10">
              <div>
                <h3 className="text-xl font-extrabold tracking-tight">{t.contact.directTitle}</h3>
                <p className="mt-2 text-sm leading-relaxed text-cream/65">
                  {t.contact.directHint}
                </p>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="group mt-6 inline-flex items-center gap-3 rounded-2xl border border-teff/30 bg-teff/10 px-5 py-4 transition-colors hover:bg-teff/20"
                >
                  <span className="grid size-10 place-items-center rounded-xl bg-teff text-night">
                    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M3 8l9 6 9-6M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" strokeLinecap="round" />
                    </svg>
                  </span>
                  <span className="text-sm font-extrabold tracking-tight sm:text-base">
                    {CONTACT_EMAIL}
                  </span>
                </a>
              </div>

              {/* Decorative grain mark */}
              <div
                aria-hidden="true"
                className="select-none text-right font-black leading-none tracking-tighter text-teff/[0.12]"
                style={{ fontSize: lang === "am" ? "7rem" : "6.5rem" }}
              >
                ጥራት
              </div>
            </div>
          </Reveal>

          {/* Form → mailto */}
          <Reveal delay={0.12}>
            <form
              onSubmit={onSubmit}
              className="flex h-full flex-col gap-4 rounded-3xl border border-forest/10 bg-white p-8 shadow-card sm:p-10"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-forest/60">
                    {t.contact.form.name}
                  </span>
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputCls}
                    placeholder="Abebe Kebede"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-forest/60">
                    {t.contact.form.email}
                  </span>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputCls}
                    placeholder="you@example.com"
                  />
                </label>
              </div>
              <label className="flex flex-1 flex-col gap-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-forest/60">
                  {t.contact.form.message}
                </span>
                <textarea
                  required
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={`${inputCls} min-h-[140px] flex-1 resize-y`}
                  placeholder="…"
                />
              </label>
              <button
                type="submit"
                className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-brand px-7 py-3.5 text-sm font-bold text-cream transition-all hover:-translate-y-0.5 hover:bg-deep"
              >
                {t.contact.form.submit}
                <svg viewBox="0 0 24 24" className="size-4.5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <p className="text-center text-xs text-forest/45">{t.contact.form.hint}</p>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
