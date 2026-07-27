import React, { useEffect, useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";
import { Award, Download, Share2, X, Sparkles } from "lucide-react";
import { useApp } from "@/context/AppContext";

const KEY_DAYS = "dj_prad_days";
const KEY_NAME = "dj_devotee_name";

function loadDays() {
  try { return JSON.parse(localStorage.getItem(KEY_DAYS) || "{}"); } catch { return {}; }
}
function isoDate(d) {
  const y = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, "0"), dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}
function buildWindow(n) {
  const t = new Date(); t.setHours(0, 0, 0, 0);
  const out = [];
  for (let i = n - 1; i >= 0; i--) { const d = new Date(t); d.setDate(t.getDate() - i); out.push(d); }
  return out;
}
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/**
 * Renders a beautifully-designed HTML certificate that unlocks when the user completes all 30 days
 * in the rolling 30-day pradakṣiṇā window. Uses html2canvas to export as a shareable PNG.
 */
export default function SadhanaCertificate() {
  const { lang } = useApp();
  const [completions, setCompletions] = useState(loadDays());
  const [name, setName] = useState(() => localStorage.getItem(KEY_NAME) || "");
  const [open, setOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const certRef = useRef(null);

  useEffect(() => {
    const refresh = () => setCompletions(loadDays());
    const t = setInterval(refresh, 2500);
    window.addEventListener("focus", refresh);
    return () => { clearInterval(t); window.removeEventListener("focus", refresh); };
  }, []);

  useEffect(() => { localStorage.setItem(KEY_NAME, name); }, [name]);

  const window30 = useMemo(() => buildWindow(30), [completions]);
  const totalDone = window30.filter((d) => completions[isoDate(d)]).length;
  const unlocked = totalDone >= 30;

  if (!unlocked && totalDone < 25) return null; // Only surface once the user is very close / done

  const today = new Date();
  const startDate = window30[0];
  const dateRange = `${startDate.getDate()} ${MONTHS[startDate.getMonth()].slice(0, 3)} ${startDate.getFullYear()} — ${today.getDate()} ${MONTHS[today.getMonth()].slice(0, 3)} ${today.getFullYear()}`;

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
      a.download = `Sadhana-Certificate-${isoDate(today)}.png`;
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
        const file = new File([blob], "Sadhana-Certificate.png", { type: "image/png" });
        if (navigator.share && navigator.canShare?.({ files: [file] })) {
          await navigator.share({ files: [file], title: "My Sadhana Certificate 🌿", text: "I completed 30 days of 108 pradakṣiṇā around Tulasi Devi! 🪔" });
        } else {
          download();
        }
      });
    } catch {
      download();
    }
  };

  const L = {
    en: { unlocked_title: "🌿 Sadhana Certificate Unlocked!", unlocked_sub: "You have completed all 30 days of 108 pradakṣiṇā. May Śrī Tulasī bless you.", almost: "So close! Complete", of30: "of 30 days.", view: "View Certificate", close: "Close", enter_name: "Your name on the certificate", download: "Download PNG", share: "Share", cert_title: "Sadhana Certificate", cert_sub: "108 Pradakṣiṇā • 30 Consecutive Days", awarded: "This is to certify that", completed: "has completed the sacred sadhana of", achievement: "108 pradakṣiṇā around Śrī Tulasī Devi", days: "for", days_span: "30 consecutive days", blessed: "May the Divine Mother bestow her grace.", period: "Period", signature: "By the grace of Śrī Tulasī Devi" },
    te: { unlocked_title: "🌿 సాధన ప్రశంసా పత్రం అందుబాటులో!", unlocked_sub: "మీరు 30 రోజుల 108 ప్రదక్షిణ పూర్తి చేశారు. శ్రీ తులసి మిమ్మల్ని ఆశీర్వదించుగాక.", almost: "చాలా దగ్గరగా ఉన్నారు! ఇంకా పూర్తి చేయండి —", of30: "/ 30 రోజులు.", view: "పత్రం చూడండి", close: "మూసివేయి", enter_name: "పత్రంపై మీ పేరు", download: "PNG డౌన్‌లోడ్", share: "పంచుకోండి", cert_title: "సాధన ప్రశంసా పత్రం", cert_sub: "108 ప్రదక్షిణ • 30 వరుస రోజులు", awarded: "ఈ మేరకు ధృవీకరించబడుతోంది —", completed: "పవిత్ర సాధనను పూర్తి చేశారు —", achievement: "శ్రీ తులసి దేవి చుట్టూ 108 ప్రదక్షిణలు", days: "వ్యవధి —", days_span: "30 వరుస రోజులు", blessed: "దైవమాత అనుగ్రహం మీకు లభించుగాక.", period: "కాలం", signature: "శ్రీ తులసీ దేవి అనుగ్రహంతో" },
    hi: { unlocked_title: "🌿 साधना प्रमाणपत्र प्राप्त!", unlocked_sub: "आपने १०८ प्रदक्षिणा के ३० दिन पूर्ण किए। श्री तुलसी आपको आशीर्वाद दें।", almost: "बहुत निकट! अभी पूरा करें —", of30: "/ ३० दिन।", view: "प्रमाणपत्र देखें", close: "बंद करें", enter_name: "प्रमाणपत्र पर आपका नाम", download: "PNG डाउनलोड", share: "साझा करें", cert_title: "साधना प्रमाणपत्र", cert_sub: "१०८ प्रदक्षिणा • ३० लगातार दिन", awarded: "यह प्रमाणित किया जाता है —", completed: "ने पवित्र साधना पूर्ण की —", achievement: "श्री तुलसी देवी के १०८ प्रदक्षिणा", days: "अवधि —", days_span: "३० लगातार दिन", blessed: "देवी माँ की कृपा आप पर बनी रहे।", period: "अवधि", signature: "श्री तुलसी देवी की कृपा से" },
    ta: { unlocked_title: "🌿 ஸாதனா ஸான்றிதழ் திறக்கப்பட்டது!", unlocked_sub: "108 ப்ரதக்ஷிணத்தின் 30 நாட்களை முடித்துவிட்டீர்கள். ஸ்ரீ துளசி உங்களை ஆசீர்வதிக்கட்டும்.", almost: "மிக அருகில்! இன்னும் முடிக்கவும் —", of30: "/ 30 நாட்கள்.", view: "ஸான்றிதழ் காண்க", close: "மூடு", enter_name: "ஸான்றிதழில் உங்கள் பெயர்", download: "PNG பதிவிறக்கு", share: "பகிர்", cert_title: "ஸாதனா ஸான்றிதழ்", cert_sub: "108 ப்ரதக்ஷிணம் • 30 தொடர்ச்சியான நாட்கள்", awarded: "இதன்மூலம் சான்றளிக்கப்படுகிறது —", completed: "புனித ஸாதனையை நிறைவேற்றியுள்ளார் —", achievement: "ஸ்ரீ துளசி தேவியைச் சுற்றி 108 ப்ரதக்ஷிணம்", days: "காலம் —", days_span: "30 தொடர்ச்சியான நாட்கள்", blessed: "தெய்வத் தாய் அருள் புரிவாராக.", period: "காலம்", signature: "ஸ்ரீ துளசி தேவியின் அருளால்" },
  }[lang] || null;
  const L2 = L || { unlocked_title: "🌿 Sadhana Certificate Unlocked!", unlocked_sub: "You have completed all 30 days of 108 pradakṣiṇā.", almost: "So close! Complete", of30: "of 30 days.", view: "View Certificate", close: "Close", enter_name: "Your name on the certificate", download: "Download PNG", share: "Share", cert_title: "Sadhana Certificate", cert_sub: "108 Pradakṣiṇā • 30 Consecutive Days", awarded: "This is to certify that", completed: "has completed the sacred sadhana of", achievement: "108 pradakṣiṇā around Śrī Tulasī Devi", days: "for", days_span: "30 consecutive days", blessed: "May the Divine Mother bestow her grace.", period: "Period", signature: "By the grace of Śrī Tulasī Devi" };

  return (
    <>
      {/* Trigger card — shows congrats when unlocked, progress when close */}
      <section
        data-testid="sadhana-cert-trigger"
        className={`sacred-card grain relative overflow-hidden ${unlocked ? "diya-glow-strong" : ""}`}
        style={unlocked ? { background: "linear-gradient(135deg, hsl(43 74% 55% / 0.15), hsl(30 90% 55% / 0.10), hsl(120 45% 35% / 0.10))" } : {}}
      >
        <div className="flex items-center gap-3 flex-wrap">
          <div className={`w-14 h-14 rounded-full grid place-items-center ${unlocked ? "bg-gradient-to-br from-[hsl(var(--gold))] to-[hsl(var(--saffron))] text-white diya-glow-strong" : "gold-border bg-[hsl(var(--gold)/0.1)] text-kumkum"}`}>
            <Award className={`w-6 h-6 ${unlocked ? "" : "opacity-70"}`} />
          </div>
          <div className="flex-1 min-w-[220px]">
            <h3 className="text-xl font-semibold text-kumkum dark:text-[hsl(var(--gold))]">
              {unlocked ? L2.unlocked_title : `${L2.almost} ${totalDone} ${L2.of30}`}
            </h3>
            <p className="text-sm text-foreground/75 mt-1">{unlocked ? L2.unlocked_sub : ""}</p>
          </div>
          {unlocked && (
            <button
              onClick={() => setOpen(true)}
              data-testid="cert-open-btn"
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm bg-gradient-to-r from-[hsl(var(--kumkum))] to-[hsl(var(--saffron))] text-white hover:opacity-90 diya-glow"
            >
              <Sparkles className="w-4 h-4" /> {L2.view}
            </button>
          )}
        </div>
      </section>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-rise"
          onClick={() => setOpen(false)}
          data-testid="cert-modal"
        >
          <div
            className="w-full max-w-3xl max-h-[95vh] overflow-y-auto rounded-2xl bg-background p-4 sm:p-6 gold-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-kumkum dark:text-[hsl(var(--gold))]">{L2.cert_title}</h3>
              <button
                onClick={() => setOpen(false)}
                data-testid="cert-close-btn"
                className="p-1 rounded-full hover:bg-[hsl(var(--gold)/0.1)]"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Name input */}
            <label className="block text-xs text-muted-foreground mb-1">{L2.enter_name}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              data-testid="cert-name-input"
              placeholder="Śrī / Śrīmatī ..."
              className="w-full rounded-lg px-3 py-2 mb-4 gold-border bg-card focus:outline-none focus:ring-2 focus:ring-[hsl(var(--gold))]"
            />

            {/* Certificate (this is what gets exported) */}
            <div
              ref={certRef}
              data-testid="certificate-canvas"
              style={{
                width: "100%",
                maxWidth: "800px",
                margin: "0 auto",
                aspectRatio: "1.414 / 1", // A4 landscape ratio
                position: "relative",
                background:
                  "radial-gradient(circle at 20% 15%, hsl(43 74% 88%) 0%, hsl(40 55% 96%) 45%, hsl(38 50% 90%) 100%)",
                border: "4px double hsl(43 74% 45%)",
                borderRadius: "8px",
                padding: "32px 40px",
                color: "hsl(20 30% 15%)",
                fontFamily: "'Cormorant Garamond', 'Marcellus', Georgia, serif",
                overflow: "hidden",
              }}
            >
              {/* Corner ornaments */}
              {["top-left", "top-right", "bottom-left", "bottom-right"].map((c) => {
                const pos = {
                  "top-left": { top: 12, left: 12 },
                  "top-right": { top: 12, right: 12, transform: "scaleX(-1)" },
                  "bottom-left": { bottom: 12, left: 12, transform: "scaleY(-1)" },
                  "bottom-right": { bottom: 12, right: 12, transform: "scale(-1, -1)" },
                }[c];
                return (
                  <svg key={c} width="60" height="60" viewBox="0 0 60 60" style={{ position: "absolute", ...pos }}>
                    <path d="M2 2 L20 2 M2 2 L2 20 M6 6 Q30 6 6 30" stroke="hsl(43 74% 45%)" strokeWidth="1.2" fill="none" />
                    <circle cx="4" cy="4" r="2" fill="hsl(0 65% 40%)" />
                  </svg>
                );
              })}

              {/* Header - Om */}
              <div style={{ textAlign: "center", position: "relative" }}>
                <div style={{ fontFamily: "'Tiro Devanagari Sanskrit', serif", fontSize: 44, color: "hsl(0 65% 35%)", lineHeight: 1, textShadow: "0 2px 8px hsl(30 90% 55% / 0.4)" }}>
                  ॐ
                </div>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: 26, letterSpacing: "0.15em", color: "hsl(0 65% 32%)", marginTop: 6, fontWeight: 700 }}>
                  {L2.cert_title.toUpperCase()}
                </div>
                <div style={{ fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: "hsl(20 30% 40%)", marginTop: 4 }}>
                  {L2.cert_sub}
                </div>
                <div style={{ width: "60%", height: 1, margin: "12px auto", background: "linear-gradient(90deg, transparent, hsl(43 74% 45%), transparent)" }} />
              </div>

              {/* Body */}
              <div style={{ textAlign: "center", marginTop: 20 }}>
                <div style={{ fontSize: 15, fontStyle: "italic", color: "hsl(20 30% 30%)" }}>{L2.awarded}</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 38, color: "hsl(0 65% 32%)", marginTop: 8, fontWeight: 600, lineHeight: 1.15, minHeight: 44 }}>
                  {name.trim() || "—"}
                </div>
                <div style={{ fontSize: 15, fontStyle: "italic", color: "hsl(20 30% 30%)", marginTop: 12 }}>{L2.completed}</div>
                <div style={{ fontSize: 22, color: "hsl(20 30% 15%)", marginTop: 6, fontWeight: 600 }}>{L2.achievement}</div>
                <div style={{ fontSize: 14, color: "hsl(20 30% 30%)", marginTop: 6 }}>
                  {L2.days} <b style={{ color: "hsl(0 65% 32%)" }}>{L2.days_span}</b>
                </div>
              </div>

              {/* Diya row (30 lit) */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(15, 1fr)", gap: 4, marginTop: 24 }}>
                {Array.from({ length: 30 }).map((_, i) => (
                  <div key={i} style={{ position: "relative", height: 26, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
                    <div style={{ position: "absolute", top: -1, width: 6, height: 10, borderRadius: "50%", background: "radial-gradient(ellipse at 50% 100%, hsl(50 100% 65%) 0%, hsl(20 100% 55%) 60%, transparent 100%)" }} />
                    <div style={{ width: 16, height: 12, borderRadius: "0 0 8px 8px", background: "radial-gradient(circle at 50% 30%, hsl(45 100% 65%) 0%, hsl(30 95% 50%) 45%, hsl(0 65% 30%) 100%)", boxShadow: "0 0 6px hsl(30 95% 55% / 0.6)" }} />
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 20, fontSize: 12, color: "hsl(20 30% 30%)" }}>
                <div>
                  <div style={{ textTransform: "uppercase", letterSpacing: "0.2em", opacity: 0.7 }}>{L2.period}</div>
                  <div style={{ fontSize: 14, marginTop: 2 }}>{dateRange}</div>
                </div>
                <div style={{ textAlign: "center", fontStyle: "italic", fontSize: 13, color: "hsl(0 65% 32%)" }}>
                  {L2.blessed}
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "'Tiro Devanagari Sanskrit', serif", fontSize: 22, color: "hsl(0 65% 32%)" }}>🌿</div>
                  <div style={{ fontSize: 11, fontStyle: "italic", opacity: 0.8 }}>{L2.signature}</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <button
                onClick={download}
                disabled={downloading}
                data-testid="cert-download-btn"
                className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 bg-gradient-to-r from-[hsl(var(--kumkum))] to-[hsl(var(--saffron))] text-white hover:opacity-90 diya-glow disabled:opacity-60"
              >
                <Download className="w-4 h-4" /> {downloading ? "..." : L2.download}
              </button>
              <button
                onClick={share}
                data-testid="cert-share-btn"
                className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 gold-border hover:bg-[hsl(var(--gold)/0.1)]"
              >
                <Share2 className="w-4 h-4" /> {L2.share}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
