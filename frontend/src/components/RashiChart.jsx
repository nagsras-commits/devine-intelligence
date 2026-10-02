import React from "react";

// South-Indian 4x4 layout — 12 houses around the perimeter.
// Rāśi index is FIXED per cell (rāśi is the spatial slot):
//  [Meena][Mesha][Vrishabha][Mithuna]
//  [Kumbha][           ][            ][Karka]
//  [Makara][           ][            ][Simha]
//  [Dhanu][Vrischika][Tula][Kanya]
//
// We display planet names in the cell whose rāśi matches. Lagna cell gets a special outline.
const RASI_CELLS = [
  // row 0 (top)
  { rasi: "Meena (Pisces)",       label: "Meena" },
  { rasi: "Mesha (Aries)",        label: "Mesha" },
  { rasi: "Vrishabha (Taurus)",   label: "Vrishabha" },
  { rasi: "Mithuna (Gemini)",     label: "Mithuna" },
  // row 1
  { rasi: "Kumbha (Aquarius)",    label: "Kumbha" },
  null, null,
  { rasi: "Karka (Cancer)",       label: "Karka" },
  // row 2
  { rasi: "Makara (Capricorn)",   label: "Makara" },
  null, null,
  { rasi: "Simha (Leo)",          label: "Simha" },
  // row 3 (bottom)
  { rasi: "Dhanu (Sagittarius)",  label: "Dhanu" },
  { rasi: "Vrischika (Scorpio)",  label: "Vrischika" },
  { rasi: "Tula (Libra)",         label: "Tula" },
  { rasi: "Kanya (Virgo)",        label: "Kanya" },
];

const PLANET_ABBR = {
  Sun: "Su", Moon: "Mo", Mars: "Ma", Mercury: "Me",
  Jupiter: "Ju", Venus: "Ve", Saturn: "Sa", Rahu: "Ra", Ketu: "Ke",
  Ascendant: "As",
};

const rasiKey = (name) => (name || "").split(" ")[0]; // 'Mesha' from 'Mesha (Aries)'

export default function RashiChart({ planets, lagnaRasi, chartTitle = "Rāśi Chart (South-Indian)" }) {
  // Build planetsByRasi[rasiKey] = [{ name, retro }]
  const groups = {};
  (planets || []).forEach((p) => {
    const k = rasiKey(p.rasi);
    if (!groups[k]) groups[k] = [];
    groups[k].push(p);
  });
  const lagnaKey = rasiKey(lagnaRasi);

  return (
    <div className="rounded-lg gold-border p-3 bg-card" data-testid="rashi-chart">
      <div className="text-sm font-semibold text-[hsl(var(--kumkum))] mb-2">{chartTitle}</div>
      <div className="grid grid-cols-4 gap-0.5" style={{ aspectRatio: "1 / 1" }}>
        {RASI_CELLS.map((c, i) => {
          if (!c) {
            // centre placeholder — merge with the surrounding empty cells to form the chakra centre
            return <div key={i} className="bg-gradient-to-br from-[hsl(var(--gold)/0.06)] to-[hsl(var(--saffron)/0.08)]" />;
          }
          const key = rasiKey(c.rasi);
          const items = groups[key] || [];
          const isLagna = lagnaKey === key;
          return (
            <div
              key={i}
              className={`relative p-1.5 flex flex-col text-[10px] leading-tight ${
                isLagna
                  ? "ring-2 ring-[hsl(var(--gold))] bg-[hsl(var(--gold)/0.14)]"
                  : "bg-[hsl(var(--gold)/0.05)]"
              } border border-[hsl(var(--gold)/0.3)]`}
              data-testid={`rashi-cell-${key.toLowerCase()}`}
            >
              <div className="text-[9px] uppercase tracking-widest text-muted-foreground font-medium">
                {c.label}
              </div>
              {isLagna && (
                <div className="absolute top-1 right-1 text-[8px] px-1 py-0.5 rounded bg-[hsl(var(--gold))] text-black font-bold">La</div>
              )}
              <div className="mt-auto flex flex-wrap gap-1">
                {items.map((p) => (
                  <span
                    key={p.name}
                    className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold text-[hsl(var(--kumkum))] bg-white/60 border border-[hsl(var(--kumkum)/0.3)]"
                    title={`${p.name}${p.retro ? " (R)" : ""} • House ${p.house} • ${p.nakshatra} pāda ${p.pada}`}
                    data-testid={`rashi-planet-${p.name.toLowerCase()}`}
                  >
                    {PLANET_ABBR[p.name] || p.name.slice(0, 2)}
                    {p.retro && <sup className="text-red-600">R</sup>}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-2 text-[10px] text-muted-foreground flex flex-wrap gap-x-3 gap-y-1">
        <span><b>La</b> Lagna</span>
        <span><b>Su</b> Sun</span><span><b>Mo</b> Moon</span><span><b>Ma</b> Mars</span>
        <span><b>Me</b> Mercury</span><span><b>Ju</b> Jupiter</span><span><b>Ve</b> Venus</span>
        <span><b>Sa</b> Saturn</span><span><b>Ra</b> Rāhu</span><span><b>Ke</b> Ketu</span>
      </div>
    </div>
  );
}
