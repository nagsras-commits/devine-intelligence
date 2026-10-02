import React from "react";
import { pickLang } from "@/lib/i18n";

/**
 * DeityIcon — an elegant devotional "niche" placeholder with deity name in Devanagari.
 * Uses the deity's accent color for a temple-altar style. Reliable & sacred looking.
 */
export default function DeityIcon({ deity, lang, size = "full" }) {
  const sa = pickLang(deity.name, "sa");
  const local = pickLang(deity.name, lang);
  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{
        background: `
          radial-gradient(120% 80% at 50% -10%, ${deity.color}55 0%, transparent 55%),
          radial-gradient(80% 60% at 50% 110%, ${deity.color}44 0%, transparent 55%),
          linear-gradient(180deg, hsl(var(--parchment)) 0%, hsl(var(--card)) 100%)
        `,
      }}
      aria-label={local}
    >
      {/* Kolam-dot pattern */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(${deity.color}66 1px, transparent 1.5px)`,
          backgroundSize: "18px 18px",
        }}
      />
      {/* Temple arch */}
      <svg viewBox="0 0 100 140" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id={`g-${deity.id}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={deity.color} stopOpacity="0.85" />
            <stop offset="100%" stopColor={deity.color} stopOpacity="0.15" />
          </linearGradient>
        </defs>
        <path
          d="M20 130 L20 60 Q20 20 50 20 Q80 20 80 60 L80 130 Z"
          fill="none"
          stroke={`url(#g-${deity.id})`}
          strokeWidth="1.2"
        />
        <path
          d="M28 130 L28 62 Q28 30 50 30 Q72 30 72 62 L72 130"
          fill="none"
          stroke={deity.color}
          strokeOpacity="0.35"
          strokeWidth="0.7"
        />
      </svg>
      {/* Central Om + name */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-3 text-center">
        <div
          className="font-devanagari leading-none animate-flicker"
          style={{ color: deity.color, fontSize: size === "sm" ? "3rem" : "5rem", textShadow: `0 4px 24px ${deity.color}88` }}
        >
          ॐ
        </div>
        <div
          className="mt-3 font-devanagari"
          style={{ color: deity.color, fontSize: size === "sm" ? "1.2rem" : "1.8rem" }}
        >
          {sa}
        </div>
      </div>
      {/* Bottom fade for label overlay compatibility */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
    </div>
  );
}
