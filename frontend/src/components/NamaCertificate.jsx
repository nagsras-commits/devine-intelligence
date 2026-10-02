import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import { Award, Download, Share2, X, Sparkles } from "lucide-react";

const NAME_KEY = "dj_devotee_name";

/**
 * Reusable Sadhana Certificate for Japa & Rāma-Koṭi milestones (1,00,00,116 target).
 * The parent decides when it unlocks and passes the current count + labels.
 *
 *   <NamaCertificate
 *     unlocked={count >= 10000116}
 *     count={count}
 *     target={10000116}
 *     sadhanaTitle="Rāma Nāma Likhita Japa"
 *     sadhanaSub="1,00,00,116 Rāma Nāma"
 *     achievement="Sacred writing of Bhagavān Rāma's name"
 *     accent="#7F1D1D"
 *     signature="By the grace of Śrī Rāma"
 *     testIdPrefix="ramakoti-cert"
 *   />
 */
export default function NamaCertificate({
  unlocked,
  count,
  target,
  sadhanaTitle,
  sadhanaSub,
  achievement,
  accent = "hsl(0 65% 32%)",
  signature = "By the grace of the Divine",
  testIdPrefix = "nama-cert",
  extraDetail = null,
}) {
  const [name, setName] = useState(() => localStorage.getItem(NAME_KEY) || "");
  const [open, setOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const certRef = useRef(null);

  const updateName = (v) => { setName(v); localStorage.setItem(NAME_KEY, v); };

  const pct = Math.min(100, Math.floor((count / target) * 10000) / 100);

  const download = async () => {
    if (!certRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(certRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `${sadhanaTitle.replace(/\s+/g, "-")}-Certificate.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (e) {
      console.warn("Cert download failed", e);
    } finally {
      setDownloading(false);
    }
  };

  const share = async () => {
    if (!certRef.current) return;
    try {
      const canvas = await html2canvas(certRef.current, { backgroundColor: null, scale: 2 });
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], `${sadhanaTitle}.png`, { type: "image/png" });
        if (navigator.share && navigator.canShare?.({ files: [file] })) {
          await navigator.share({ files: [file], title: sadhanaTitle, text: `I completed ${sadhanaSub}! 🕉️` });
        } else {
          download();
        }
      });
    } catch {
      download();
    }
  };

  const fmt = (n) => n.toLocaleString("en-IN");
  const today = new Date();

  return (
    <>
      <section
        data-testid={`${testIdPrefix}-trigger`}
        className={`sacred-card grain relative overflow-hidden ${unlocked ? "diya-glow-strong" : ""}`}
        style={unlocked ? { background: "linear-gradient(135deg, hsl(43 74% 55% / 0.15), hsl(30 90% 55% / 0.10), hsl(0 65% 32% / 0.08))" } : {}}
      >
        <div className="flex items-center gap-3 flex-wrap">
          <div className={`w-14 h-14 rounded-full grid place-items-center ${unlocked ? "bg-gradient-to-br from-[hsl(var(--gold))] to-[hsl(var(--saffron))] text-white diya-glow-strong" : "gold-border bg-[hsl(var(--gold)/0.1)] text-kumkum"}`}>
            <Award className={`w-6 h-6 ${unlocked ? "" : "opacity-70"}`} />
          </div>
          <div className="flex-1 min-w-[220px]">
            <h3 className="text-lg font-semibold text-kumkum dark:text-[hsl(var(--gold))]">
              {unlocked ? `🌸 ${sadhanaTitle} — Complete!` : `Progress: ${fmt(count)} / ${fmt(target)}`}
            </h3>
            <div className="mt-2 h-1.5 w-full rounded-full bg-[hsl(var(--gold)/0.15)] overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-[hsl(var(--gold))] to-[hsl(var(--saffron))] transition-all"
                   style={{ width: `${Math.max(0.5, pct)}%` }} />
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              {unlocked ? "May the Divine bestow supreme grace." : `${pct.toFixed(4)}% complete`}
            </p>
          </div>
          {unlocked && (
            <button
              onClick={() => setOpen(true)}
              data-testid={`${testIdPrefix}-open`}
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm bg-gradient-to-r from-[hsl(var(--kumkum))] to-[hsl(var(--saffron))] text-white hover:opacity-90 diya-glow"
            >
              <Sparkles className="w-4 h-4" /> View Certificate
            </button>
          )}
        </div>
      </section>

      {open && (
        <div
          className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
          data-testid={`${testIdPrefix}-modal`}
        >
          <div
            className="w-full max-w-3xl max-h-[95vh] overflow-y-auto rounded-2xl bg-background p-4 sm:p-6 gold-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-kumkum dark:text-[hsl(var(--gold))]">{sadhanaTitle}</h3>
              <button onClick={() => setOpen(false)} data-testid={`${testIdPrefix}-close`} className="p-1 rounded-full hover:bg-[hsl(var(--gold)/0.1)]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <label className="block text-xs text-muted-foreground mb-1">Your name on the certificate</label>
            <input
              type="text"
              value={name}
              onChange={(e) => updateName(e.target.value)}
              data-testid={`${testIdPrefix}-name`}
              placeholder="Śrī / Śrīmatī ..."
              className="w-full rounded-lg px-3 py-2 mb-4 gold-border bg-card focus:outline-none focus:ring-2 focus:ring-[hsl(var(--gold))]"
            />

            <div
              ref={certRef}
              data-testid={`${testIdPrefix}-canvas`}
              style={{
                width: "100%",
                maxWidth: "800px",
                margin: "0 auto",
                aspectRatio: "1.414 / 1",
                position: "relative",
                background: "radial-gradient(circle at 20% 15%, hsl(43 74% 88%) 0%, hsl(40 55% 96%) 45%, hsl(38 50% 90%) 100%)",
                border: `4px double ${accent}`,
                borderRadius: "8px",
                padding: "28px 40px",
                color: "hsl(20 30% 15%)",
                fontFamily: "'Cormorant Garamond', 'Marcellus', Georgia, serif",
                overflow: "hidden",
              }}
            >
              {["top-left", "top-right", "bottom-left", "bottom-right"].map((c) => {
                const pos = {
                  "top-left": { top: 12, left: 12 },
                  "top-right": { top: 12, right: 12, transform: "scaleX(-1)" },
                  "bottom-left": { bottom: 12, left: 12, transform: "scaleY(-1)" },
                  "bottom-right": { bottom: 12, right: 12, transform: "scale(-1, -1)" },
                }[c];
                return (
                  <svg key={c} width="60" height="60" viewBox="0 0 60 60" style={{ position: "absolute", ...pos }}>
                    <path d="M2 2 L20 2 M2 2 L2 20 M6 6 Q30 6 6 30" stroke={accent} strokeWidth="1.2" fill="none" />
                    <circle cx="4" cy="4" r="2" fill={accent} />
                  </svg>
                );
              })}

              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Tiro Devanagari Sanskrit', serif", fontSize: 42, color: accent, lineHeight: 1, textShadow: "0 2px 8px hsl(30 90% 55% / 0.4)" }}>ॐ</div>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: 24, letterSpacing: "0.14em", color: accent, marginTop: 4, fontWeight: 700 }}>
                  {sadhanaTitle.toUpperCase()}
                </div>
                <div style={{ fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", color: "hsl(20 30% 40%)", marginTop: 4 }}>
                  {sadhanaSub}
                </div>
                <div style={{ width: "60%", height: 1, margin: "10px auto", background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />
              </div>

              <div style={{ textAlign: "center", marginTop: 14 }}>
                <div style={{ fontSize: 15, fontStyle: "italic", color: "hsl(20 30% 30%)" }}>This is to certify that</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, color: accent, marginTop: 6, fontWeight: 600, lineHeight: 1.15, minHeight: 40 }}>
                  {name.trim() || "—"}
                </div>
                <div style={{ fontSize: 14, fontStyle: "italic", color: "hsl(20 30% 30%)", marginTop: 8 }}>has completed the sacred sādhana of</div>
                <div style={{ fontSize: 20, color: "hsl(20 30% 15%)", marginTop: 4, fontWeight: 600 }}>{achievement}</div>
                <div style={{ fontSize: 13, color: "hsl(20 30% 30%)", marginTop: 8 }}>
                  Total count: <b style={{ color: accent }}>{fmt(target)}</b>
                </div>
                {extraDetail && (
                  <div style={{ fontSize: 12, color: "hsl(20 30% 35%)", marginTop: 6, fontStyle: "italic" }}>{extraDetail}</div>
                )}
              </div>

              <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 16 }}>
                {Array.from({ length: 21 }).map((_, i) => (
                  <div key={i} style={{ position: "relative", width: 12, height: 20 }}>
                    <div style={{ position: "absolute", top: -2, left: 3, width: 6, height: 8, borderRadius: "50%", background: "radial-gradient(ellipse at 50% 100%, hsl(50 100% 65%), hsl(20 100% 55%), transparent)" }} />
                    <div style={{ position: "absolute", bottom: 0, width: 12, height: 10, borderRadius: "0 0 6px 6px", background: `radial-gradient(circle at 50% 30%, hsl(45 100% 65%), hsl(30 95% 50%), ${accent})`, boxShadow: `0 0 6px ${accent}` }} />
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 12, fontSize: 12, color: "hsl(20 30% 30%)" }}>
                <div>
                  <div style={{ textTransform: "uppercase", letterSpacing: "0.2em", opacity: 0.7 }}>Date</div>
                  <div style={{ fontSize: 13, marginTop: 2 }}>{today.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</div>
                </div>
                <div style={{ textAlign: "center", fontStyle: "italic", fontSize: 12, color: accent }}>
                  May the Divine bestow supreme grace.
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "'Tiro Devanagari Sanskrit', serif", fontSize: 20, color: accent }}>🕉️</div>
                  <div style={{ fontSize: 11, fontStyle: "italic", opacity: 0.8 }}>{signature}</div>
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <button
                onClick={download}
                disabled={downloading}
                data-testid={`${testIdPrefix}-download`}
                className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 bg-gradient-to-r from-[hsl(var(--kumkum))] to-[hsl(var(--saffron))] text-white hover:opacity-90 diya-glow disabled:opacity-60"
              >
                <Download className="w-4 h-4" /> {downloading ? "..." : "Download PNG"}
              </button>
              <button
                onClick={share}
                data-testid={`${testIdPrefix}-share`}
                className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 gold-border hover:bg-[hsl(var(--gold)/0.1)]"
              >
                <Share2 className="w-4 h-4" /> Share
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
