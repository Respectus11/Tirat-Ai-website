import Reveal from "./Reveal";

interface SectionHeadingProps {
  eyebrow: string;
  heading: string;
  sub?: string;
  dark?: boolean;
  align?: "center" | "left";
}

export default function SectionHeading({
  eyebrow,
  heading,
  sub,
  dark = false,
  align = "center",
}: SectionHeadingProps) {
  const alignCls = align === "center" ? "items-center text-center" : "items-start text-left";

  return (
    <div className={`flex flex-col gap-4 ${alignCls}`}>
      <Reveal>
        <span
          className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] ${
            dark
              ? "border-teff/40 bg-teff/10 text-teff-light"
              : "border-brand/25 bg-brand/10 text-deep"
          }`}
        >
          {eyebrow}
        </span>
      </Reveal>
      <Reveal delay={0.08}>
        <h2
          className={`max-w-3xl text-balance text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-[2.75rem] ${
            dark ? "text-cream" : "text-forest"
          }`}
        >
          {heading}
        </h2>
      </Reveal>
      {sub && (
        <Reveal delay={0.16}>
          <p
            className={`max-w-2xl text-base leading-relaxed sm:text-lg ${
              dark ? "text-cream/70" : "text-forest/70"
            }`}
          >
            {sub}
          </p>
        </Reveal>
      )}
    </div>
  );
}
