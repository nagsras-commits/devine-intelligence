import React, { useRef, useState } from "react";
import axios from "axios";
import { Heart, Loader2, Sparkles, User, Users, Download, ImageIcon } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const CITIES = [
  { label: "Hyderabad, India",  lat: 17.3850, lng: 78.4867, tz: 5.5 },
  { label: "Chennai, India",    lat: 13.0827, lng: 80.2707, tz: 5.5 },
  { label: "Bengaluru, India",  lat: 12.9716, lng: 77.5946, tz: 5.5 },
  { label: "Mumbai, India",     lat: 19.0760, lng: 72.8777, tz: 5.5 },
  { label: "Delhi, India",      lat: 28.7041, lng: 77.1025, tz: 5.5 },
  { label: "Kolkata, India",    lat: 22.5726, lng: 88.3639, tz: 5.5 },
  { label: "New York, USA",     lat: 40.7128, lng: -74.0060, tz: -5 },
  { label: "London, UK",        lat: 51.5074, lng: -0.1278, tz: 0 },
  { label: "Sydney, Australia", lat: -33.8688, lng: 151.2093, tz: 10 },
  { label: "Dubai, UAE",        lat: 25.2048, lng: 55.2708, tz: 4 },
];

const emptyPerson = { name: "", dob: "", time: "12:00", cityIdx: 0 };

const PersonForm = ({ label, icon: Icon, form, setForm, testidBase }) => {
  const city = CITIES[form.cityIdx] || CITIES[0];
  return (
    <div className="rounded-2xl p-4 gold-border bg-[hsl(var(--gold)/0.05)]">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-saffron" />
        <div className="text-sm font-semibold text-kumkum dark:text-[hsl(var(--gold))]">{label}</div>
      </div>
      <div className="grid gap-3">
        <input
          type="text" placeholder="Name" value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          data-testid={`${testidBase}-name`}
          className="w-full rounded-lg px-3 py-2 gold-border bg-card text-sm"
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            type="date" value={form.dob}
            onChange={(e) => setForm({ ...form, dob: e.target.value })}
            data-testid={`${testidBase}-dob`}
            className="rounded-lg px-3 py-2 gold-border bg-card text-sm"
          />
          <input
            type="time" value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
            data-testid={`${testidBase}-time`}
            className="rounded-lg px-3 py-2 gold-border bg-card text-sm"
          />
        </div>
        <select
          value={form.cityIdx}
          onChange={(e) => setForm({ ...form, cityIdx: parseInt(e.target.value, 10) })}
          data-testid={`${testidBase}-place`}
          className="w-full rounded-lg px-3 py-2 gold-border bg-card text-sm"
        >
          {CITIES.map((c, i) => <option key={i} value={i}>{c.label}</option>)}
        </select>
      </div>
    </div>
  );
};

export default function KundaliMatch() {
  const [bride, setBride] = useState(emptyPerson);
  const [groom, setGroom] = useState(emptyPerson);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [result, setResult] = useState(null);
  const [err, setErr] = useState("");
  const [toast, setToast] = useState("");
  const reportRef = useRef(null);

  const toReq = (p) => {
    const c = CITIES[p.cityIdx] || CITIES[0];
    return { name: p.name || null, dob: p.dob, time: p.time, place: c.label, lat: c.lat, lng: c.lng, tz_offset: c.tz };
  };

  const submit = async (e) => {
    e?.preventDefault();
    if (!bride.dob || !groom.dob) { setErr("Enter date of birth for both persons."); return; }
    setErr(""); setLoading(true); setResult(null);
    try {
      const { data } = await axios.post(`${API}/kundali/match`, { bride: toReq(bride), groom: toReq(groom) });
      setResult(data);
    } catch (e) { setErr(e?.response?.data?.detail || String(e)); }
    finally { setLoading(false); }
  };

  const exportImage = async () => {
    if (!reportRef.current || exporting) return;
    setExporting(true);
    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(reportRef.current, { scale: 2, backgroundColor: "#fdf6e3", useCORS: true });
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = `kundali-match-${bride.name || "bride"}-${groom.name || "groom"}.png`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 5000);
        setToast("Image saved"); setTimeout(() => setToast(""), 2500);
      }, "image/png");
    } catch { setToast("Export failed"); setTimeout(() => setToast(""), 2500); }
    finally { setExporting(false); }
  };

  const exportPdf = async () => {
    if (!reportRef.current || exporting) return;
    setExporting(true);
    try {
      const { default: html2canvas } = await import("html2canvas");
      const { default: jsPDF } = await import("jspdf");
      const canvas = await html2canvas(reportRef.current, { scale: 2, backgroundColor: "#fdf6e3", useCORS: true });
      const img = canvas.toDataURL("image/jpeg", 0.92);
      const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
      const pw = pdf.internal.pageSize.getWidth();
      const iw = pw - 40;
      const ih = (canvas.height * iw) / canvas.width;
      pdf.addImage(img, "JPEG", 20, 20, iw, ih);
      pdf.save(`kundali-match-${bride.name || "bride"}-${groom.name || "groom"}.pdf`);
      setToast("PDF saved"); setTimeout(() => setToast(""), 2500);
    } catch { setToast("PDF failed"); setTimeout(() => setToast(""), 2500); }
    finally { setExporting(false); }
  };

  return (
    <section className="sacred-card grain" data-testid="kundali-match">
      <div className="flex items-center gap-2 mb-3">
        <Heart className="w-5 h-5 text-saffron" />
        <h3 className="text-xl font-semibold text-kumkum dark:text-[hsl(var(--gold))]">Kundali Match — Aṣṭakūṭa Guṇa Milāna</h3>
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        Traditional 8-fold marriage compatibility (36 points). Enter both partners' birth details to receive a score, verdict and printable report.
      </p>

      <form onSubmit={submit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-3">
          <PersonForm label="Bride"  icon={User}  form={bride}  setForm={setBride}  testidBase="match-bride"  />
          <PersonForm label="Groom"  icon={Users} form={groom}  setForm={setGroom}  testidBase="match-groom"  />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="submit" disabled={loading}
            data-testid="match-submit"
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 bg-gradient-to-r from-[hsl(var(--kumkum))] to-[hsl(var(--saffron))] text-white font-medium hover:opacity-90 disabled:opacity-60 diya-glow"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {loading ? "Computing…" : "Check Compatibility"}
          </button>
          {err && <div data-testid="match-err" className="text-xs text-red-600">{err}</div>}
        </div>
      </form>

      {result && (
        <div className="mt-6 space-y-4" data-testid="match-result">
          <div className="flex flex-wrap justify-end gap-2">
            <button onClick={exportImage} disabled={exporting} data-testid="match-export-img"
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs gold-border hover:bg-[hsl(var(--gold)/0.1)] disabled:opacity-60">
              {exporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ImageIcon className="w-3.5 h-3.5" />} Save Image
            </button>
            <button onClick={exportPdf} disabled={exporting} data-testid="match-export-pdf"
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs gold-border hover:bg-[hsl(var(--gold)/0.1)] disabled:opacity-60">
              {exporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />} Download PDF
            </button>
            {toast && <span className="text-[11px] rounded-full px-3 py-1.5 gold-border bg-emerald-500/10 text-emerald-700 self-center" data-testid="match-export-toast">{toast}</span>}
          </div>

          <div ref={reportRef} className="rounded-2xl p-5 gold-border" style={{ background: "linear-gradient(135deg, hsl(30 40% 96%), hsl(35 45% 92%))" }}>
            <div className="text-center border-b border-[hsl(var(--gold)/0.4)] pb-3 mb-4">
              <div className="text-[10px] uppercase tracking-[0.3em] text-[hsl(var(--kumkum))]">Kundali Match Report</div>
              <h4 className="font-display text-2xl mt-0.5 text-[hsl(var(--kumkum))]">
                {result.bride.name || "Bride"} ⚭ {result.groom.name || "Groom"}
              </h4>
              <div className="text-xs text-muted-foreground">Aṣṭakūṭa Guṇa Milāna</div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="rounded-lg p-3 gold-border bg-[hsl(var(--gold)/0.06)]">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Bride • {result.bride.name || "—"}</div>
                <div className="text-sm font-medium mt-1">{result.bride.janma_rasi}</div>
                <div className="text-[11px] text-muted-foreground">{result.bride.janma_nakshatra}</div>
              </div>
              <div className="rounded-lg p-3 gold-border bg-[hsl(var(--gold)/0.06)]">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Groom • {result.groom.name || "—"}</div>
                <div className="text-sm font-medium mt-1">{result.groom.janma_rasi}</div>
                <div className="text-[11px] text-muted-foreground">{result.groom.janma_nakshatra}</div>
              </div>
            </div>

            {/* Total score prominent */}
            <div className="text-center py-4 rounded-xl mb-4"
                 style={{ background: "linear-gradient(135deg, hsl(var(--gold) / 0.25), hsl(var(--saffron) / 0.15))" }}>
              <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Total Score</div>
              <div className="font-display text-5xl mt-1 text-[hsl(var(--kumkum))]" data-testid="match-total">
                {result.kutas.total}<span className="text-2xl text-muted-foreground">/{result.kutas.max}</span>
              </div>
              <div className="text-sm font-medium mt-1" data-testid="match-verdict">{result.kutas.verdict}</div>
            </div>

            {/* 8 Kūṭa breakdown */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-[hsl(var(--kumkum))] mb-2">Eight Kūṭa Breakdown</div>
              {["varna","vashya","tara","yoni","graha_maitri","gana","bhakoot","nadi"].map((k) => {
                const v = result.kutas[k];
                const pct = (v.score / v.max) * 100;
                const good = pct >= 60;
                return (
                  <div key={k} className="grid grid-cols-[6.5rem_1fr_3rem] items-center gap-2" data-testid={`match-kuta-${k}`}>
                    <div className="text-xs font-medium capitalize">{k.replace("_", " ")}</div>
                    <div className="h-2 rounded-full overflow-hidden bg-[hsl(var(--gold)/0.15)]">
                      <div className={`h-full ${good ? "bg-emerald-600" : pct > 0 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${pct}%` }} />
                    </div>
                    <div className="text-xs text-right tabular-nums">{v.score}/{v.max}</div>
                    <div className="col-span-3 text-[10px] text-muted-foreground -mt-1 pl-[6.75rem]">{v.desc}</div>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 mt-3 border-t border-[hsl(var(--gold)/0.3)] text-center text-[10px] text-muted-foreground">
              Generated by Devine Intelligence • {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
