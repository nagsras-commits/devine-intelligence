import React from "react";

/**
 * PageHero — a stunning hero header used at the top of each page.
 *
 * Props:
 *   bannerId: string — matches a file at /api/static/banners/{bannerId}.png
 *   eyebrow?: string — small uppercase tagline above title
 *   title: string | ReactNode — the big page title
 *   sanskritTitle?: string — small devanagari accent shown next to title
 *   subtitle?: string — one-line description under title
 *   accent?: string — gradient accent color (defaults to gold/saffron)
 *   height?: string — tailwind height class (defaults to h-64 sm:h-80)
 */
export default function PageHero({
  bannerId,
  eyebrow,
  title,
  sanskritTitle,
  subtitle,
  accent = "hsl(var(--gold))",
  height = "min-h-[220px] sm:min-h-[280px] lg:min-h-[340px]",
  children,
}) {
  const url = `${process.env.REACT_APP_BACKEND_URL}/api/static/banners/${bannerId}.png`;

  return (
    <section
      data-testid={`page-hero-${bannerId}`}
      className={`relative -mx-4 sm:-mx-6 -mt-6 sm:-mt-10 mb-8 sm:mb-12 overflow-hidden ${height} rounded-b-3xl`}
    >
      {/* Background image */}
      <img
        src={url}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: "center" }}
      />

      {/* Cinematic gradient overlays */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, hsl(30 90% 15% / 0.45) 0%, hsl(30 60% 12% / 0.35) 35%, hsl(30 60% 8% / 0.60) 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 20% 20%, hsl(43 100% 60% / 0.25), transparent 55%)," +
            "radial-gradient(ellipse at 90% 90%, hsl(0 65% 32% / 0.30), transparent 55%)",
        }}
      />
      {/* Faint grain to soften */}
      <div aria-hidden="true" className="absolute inset-0 grain pointer-events-none opacity-40" />

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col justify-end">
        {eyebrow && (
          <div className="text-[11px] sm:text-xs uppercase tracking-[0.32em] text-[hsl(var(--gold))] mb-2 font-medium">
            <span className="inline-block w-8 h-px align-middle bg-[hsl(var(--gold))] mr-2" />
            {eyebrow}
          </div>
        )}
        <h1
          data-testid={`page-hero-${bannerId}-title`}
          className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-tight text-gold-shimmer flex items-baseline flex-wrap gap-x-4 gap-y-1"
          style={{ letterSpacing: "0.06em", filter: "drop-shadow(0 4px 24px rgba(0,0,0,0.5))" }}
        >
          <span>{title}</span>
          {sanskritTitle && (
            <span
              className="font-devanagari text-2xl sm:text-3xl lg:text-4xl font-normal"
              style={{
                background: `linear-gradient(120deg, hsl(45 100% 88%), hsl(30 100% 62%), hsl(45 100% 88%))`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {sanskritTitle}
            </span>
          )}
        </h1>
        {subtitle && (
          <p className="mt-3 text-sm sm:text-base max-w-2xl text-[hsl(45_100%_92%)]/90 leading-relaxed"
             style={{ textShadow: "0 2px 12px rgba(0,0,0,0.55)" }}>
            {subtitle}
          </p>
        )}
        {children}
      </div>

      {/* Bottom glow line */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-[2px]"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
      />
    </section>
  );
}
