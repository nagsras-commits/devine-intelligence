import React, { useEffect, useMemo, useRef, useState } from "react";
import { useApp } from "@/context/AppContext";
import NamaCertificate from "@/components/NamaCertificate";
import WritingPad from "@/components/WritingPad";
import PageHero from "@/components/PageHero";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { RotateCcw, Sparkles, PenLine, ChevronDown, Check, Volume2, VolumeX, Keyboard, Brush } from "lucide-react";

const TARGET = 10000116;
const MILESTONES = [116, 1116, 10116, 100116, 1000116, TARGET];
const KEY_KOTI = "dj_ramakoti_counts";    // { [nameId]: totalCount }
const KEY_ACTIVE = "dj_ramakoti_active";
const KEY_BELL = "dj_ramakoti_bell";
const KEY_MODE = "dj_ramakoti_mode";      // 'type' | 'write'

const loadCounts = () => { try { return JSON.parse(localStorage.getItem(KEY_KOTI) || "{}"); } catch { return {}; } };
const saveCounts = (o) => localStorage.setItem(KEY_KOTI, JSON.stringify(o));

// Presets of divine names — user writes any variation matching these
const NAME_PRESETS = [
  {
    id: "rama",
    label: "Rāma Koṭi",
    display: "राम",
    telugu: "రామ",
    accepted: ["rama", "raama", "ram", "sriram", "sri ram", "sri rama", "jai ram", "jai rama", "ராமா", "ராம", "राम", "రామ", "శ్రీరామ", "sriraama"],
    accent: "#065F46",
    sadhana: "Rāma Nāma Likhita Japa",
    grace: "By the grace of Śrī Rāma",
    guide: "Write \"Rāma\" or \"राम\" or \"రామ\". Each valid entry counts as one.",
  },
  {
    id: "govinda",
    label: "Govinda Koṭi",
    display: "गोविन्द",
    telugu: "గోవింద",
    accepted: ["govinda", "govind", "gopala", "gopal", "gōvinda", "hari govinda", "sri govinda", "jai govinda", "గోవింద", "గోవిందా", "गोविन्द", "गोविंद", "गोविंदा"],
    accent: "#1E3A8A",
    sadhana: "Govinda Nāma Likhita Japa",
    grace: "By the grace of Śrī Govinda",
    guide: "Write \"Govinda\" or \"गोविन्द\" or \"గోవింద\".",
  },
  {
    id: "om_namah_shivaya",
    label: "Om Namaḥ Śivāya Koṭi",
    display: "ॐ नमः शिवाय",
    telugu: "ఓం నమః శివాయ",
    accepted: ["om namah shivaya", "om namah sivaya", "om namashivaya", "ॐ नमः शिवाय", "ఓం నమః శివాయ", "namah shivaya", "namah sivaya", "hara hara mahadev", "shiva", "śiva"],
    accent: "#0B1021",
    sadhana: "Om Namaḥ Śivāya Likhita Japa",
    grace: "By the grace of Śrī Śiva",
    guide: "Write \"Om Namah Shivaya\" (or ॐ नमः शिवाय).",
  },
  {
    id: "krishna",
    label: "Kṛṣṇa Koṭi",
    display: "कृष्ण",
    telugu: "కృష్ణ",
    accepted: ["krishna", "krsna", "krsn", "kṛṣṇa", "hari krishna", "hare krishna", "sri krishna", "కృష్ణ", "श्रीकृष्ण", "కృష్ణా", "కృష్ణం"],
    accent: "#1E3A8A",
    sadhana: "Kṛṣṇa Nāma Likhita Japa",
    grace: "By the grace of Śrī Kṛṣṇa",
    guide: "Write \"Krishna\" or \"कृष्ण\" or \"కృష్ణ\".",
  },
  {
    id: "hanuman",
    label: "Hanumān Nāma Likhita",
    display: "हनुमान्",
    telugu: "హనుమాన్",
    accepted: ["hanuman", "hanumaan", "jai hanuman", "sri hanuman", "hanumān", "हनुमान", "हनुमान्", "హనుమాన్", "hanumantha", "anjaneya", "బజరంగ", "bajrang"],
    accent: "#B91C1C",
    sadhana: "Hanumān Nāma Likhita Japa",
    grace: "By the grace of Śrī Hanumān",
    guide: "Write \"Hanuman\" or \"हनुमान्\" or \"హనుమాన్\".",
  },
  {
    id: "durga",
    label: "Durgā Nāma Likhita",
    display: "दुर्गा",
    telugu: "దుర్గా",
    accepted: ["durga", "durgā", "jai durga", "sri durga", "amba", "ambe", "jai mata di", "दुर्गा", "దుర్గా", "దుర్గ", "దుర్గే", "మా దుర్గా", "maa durga"],
    accent: "#DC2626",
    sadhana: "Durgā Nāma Likhita Japa",
    grace: "By the grace of Śrī Durgā Devī",
    guide: "Write \"Durga\" or \"दुर्गा\" or \"దుర్గా\".",
  },
  {
    id: "chandi",
    label: "Caṇḍī Nāma Likhita",
    display: "चण्डी",
    telugu: "చండి",
    accepted: ["chandi", "chandika", "caṇḍī", "caṇḍikā", "candi", "जय चंडी", "चण्डी", "चंडी", "चण्डिका", "చండి", "చండికా", "చండీ"],
    accent: "#991B1B",
    sadhana: "Caṇḍī Nāma Likhita Japa",
    grace: "By the grace of Śrī Caṇḍī",
    guide: "Write \"Chandi\" or \"चण्डी\" or \"చండి\".",
  },
  {
    id: "ayyappa",
    label: "Ayyappa Śaraṇam Likhita",
    display: "शरणम् अय्यप्पा",
    telugu: "శరణం అయ్యప్ప",
    accepted: ["ayyappa", "ayyappa saranam", "swamiye saranam ayyappa", "saranam ayyappa", "శరణం అయ్యప్ప", "శరణం", "అయ్యప్ప", "स्वामिये शरणम् अय्यप्पा", "ஸ்வாமியே சரணம் ஐயப்பா", "ஐயப்பா"],
    accent: "#111827",
    sadhana: "Ayyappa Śaraṇam Likhita Japa",
    grace: "By the grace of Śrī Ayyappa Svāmi",
    guide: "Write \"Ayyappa\" or \"Saranam Ayyappa\" or \"అయ్యప్ప\".",
  },
  {
    id: "narasimha",
    label: "Narasiṁha Nāma Likhita",
    display: "नरसिंह",
    telugu: "నరసింహ",
    accepted: ["narasimha", "narasiṁha", "narasimhaya", "nrisimha", "jai narasimha", "sri narasimha", "lakshmi narasimha", "నరసింహ", "నారసింహ", "नरसिंह", "नारसिंह", "narsingh"],
    accent: "#7F1D1D",
    sadhana: "Narasiṁha Nāma Likhita Japa",
    grace: "By the grace of Śrī Narasiṁha Svāmi",
    guide: "Write \"Narasimha\" or \"नरसिंह\" or \"నరసింహ\".",
  },
  {
    id: "venkateswara",
    label: "Govinda-Veṅkaṭeśa Likhita",
    display: "वेङ्कटेश",
    telugu: "వేంకటేశ",
    accepted: ["venkatesha", "venkateswara", "venkatesa", "govinda govinda", "govinda", "śrīnivāsa", "srinivasa", "balaji", "వేంకటేశ", "వేంకటేశ్వర", "శ్రీనివాస", "बालाजी", "वेङ्कटेश्वर", "వేంకటేశ్వరా"],
    accent: "#7C2D12",
    sadhana: "Śrī Veṅkaṭeśa Likhita Japa",
    grace: "By the grace of Śrī Veṅkaṭeśvara",
    guide: "Write \"Govinda\" / \"Venkatesa\" / \"వేంకటేశ\" / \"बालाजी\".",
  },
  {
    id: "lakshmi",
    label: "Śrī Lakṣmī Likhita",
    display: "श्री लक्ष्मी",
    telugu: "శ్రీ లక్ష్మీ",
    accepted: ["lakshmi", "sri lakshmi", "mahalakshmi", "lakṣmī", "shri lakshmi", "श्री लक्ष्मी", "लक्ष्मी", "శ్రీ లక్ష్మీ", "లక్ష్మీ", "మహాలక్ష్మి"],
    accent: "#EC4899",
    sadhana: "Śrī Lakṣmī Nāma Likhita Japa",
    grace: "By the grace of Śrī Mahālakṣmī",
    guide: "Write \"Sri Lakshmi\" or \"श्री लक्ष्मी\" or \"శ్రీ లక్ష్మీ\".",
  },
  {
    id: "saraswati",
    label: "Sarasvatī Nāma Likhita",
    display: "सरस्वती",
    telugu: "సరస్వతీ",
    accepted: ["saraswati", "sarasvati", "sharada", "śāradā", "sri saraswati", "सरस्वती", "శారద", "సరస్వతీ", "సరస్వతి"],
    accent: "#F5F5DC",
    sadhana: "Sarasvatī Nāma Likhita Japa",
    grace: "By the grace of Śrī Sarasvatī",
    guide: "Write \"Saraswati\" or \"सरस्वती\" or \"సరస్వతీ\".",
  },
  {
    id: "ganesha",
    label: "Gaṇeśa Nāma Likhita",
    display: "गणेश",
    telugu: "గణేశ",
    accepted: ["ganesha", "ganesh", "ganapati", "gaṇeśa", "vinayaka", "vināyaka", "jai ganesh", "गणेश", "गणपति", "గణేశ", "గణపతి", "వినాయక"],
    accent: "#FF9933",
    sadhana: "Gaṇeśa Nāma Likhita Japa",
    grace: "By the grace of Śrī Gaṇeśa",
    guide: "Write \"Ganesha\" / \"गणेश\" / \"గణేశ\" / \"Ganapati\".",
  },
  {
    id: "kali",
    label: "Kālikā Nāma Likhita",
    display: "काली",
    telugu: "కాళికా",
    accepted: ["kali", "kalika", "kālī", "kālikā", "jai kali", "maa kali", "काली", "कालिका", "కాళికా", "కాళి"],
    accent: "#111827",
    sadhana: "Kālikā Nāma Likhita Japa",
    grace: "By the grace of Śrī Mahākālī",
    guide: "Write \"Kali\" or \"काली\" or \"కాళికా\".",
  },
  {
    id: "lalitha",
    label: "Lalitā Nāma Likhita",
    display: "ललिता",
    telugu: "లలితా",
    accepted: ["lalitha", "lalita", "lalitā", "sri lalitha", "śrī lalitā", "tripura sundari", "ललिता", "ललिताम्बा", "లలితా", "లలిత", "శ్రీలలితా"],
    accent: "#BE185D",
    sadhana: "Lalitā Nāma Likhita Japa",
    grace: "By the grace of Śrī Lalitā Tripura Sundarī",
    guide: "Write \"Lalitha\" or \"ललिता\" or \"లలితా\".",
  },
  {
    id: "dattatreya",
    label: "Datta Nāma Likhita",
    display: "दत्तात्रेय",
    telugu: "దత్తాత్రేయ",
    accepted: ["datta", "dattatreya", "shri datta", "jai guru datta", "avadhuta", "दत्त", "दत्तात्रेय", "దత్త", "దత్తాత్రేయ", "గురుదత్త"],
    accent: "#B45309",
    sadhana: "Datta Nāma Likhita Japa",
    grace: "By the grace of Śrī Dattātreya",
    guide: "Write \"Datta\" or \"दत्तात्रेय\" or \"దత్తాత్రేయ\".",
  },
  {
    id: "raghavendra",
    label: "Rāghavendra Nāma Likhita",
    display: "राघवेन्द्र",
    telugu: "రాఘవేంద్ర",
    accepted: ["raghavendra", "rayaru", "sri raghavendra", "raghavendra swamy", "guru raghavendra", "राघवेन्द्र", "राघवेंद्र", "రాఘవేంద్ర", "రాయరు"],
    accent: "#A16207",
    sadhana: "Rāghavendra Nāma Likhita Japa",
    grace: "By the grace of Śrī Rāghavendra Svāmi",
    guide: "Write \"Raghavendra\" or \"राघवेन्द्र\" or \"రాఘవేంద్ర\".",
  },
  {
    id: "gayatri",
    label: "Gāyatrī Likhita",
    display: "गायत्री",
    telugu: "గాయత్రీ",
    accepted: ["gayatri", "gāyatrī", "savitri", "vedamata", "गायत्री", "సావిత్రి", "గాయత్రీ", "గాయత్రి"],
    accent: "#C2410C",
    sadhana: "Gāyatrī Nāma Likhita Japa",
    grace: "By the grace of Vedamātā Gāyatrī",
    guide: "Write \"Gayatri\" or \"गायत्री\" or \"గాయత్రీ\".",
  },
  {
    id: "subrahmanya",
    label: "Muruga / Skanda Likhita",
    display: "स्कन्द",
    telugu: "సుబ్రహ్మణ్య",
    accepted: ["subrahmanya", "murugan", "muruga", "skanda", "kartikeya", "shanmukha", "haro hara", "स्कन्द", "मुरुगन", "కుమార", "సుబ్రహ్మణ్య", "ஷண்முகன்", "முருகா", "முருகன்"],
    accent: "#EA580C",
    sadhana: "Muruga Nāma Likhita Japa",
    grace: "By the grace of Śrī Subrahmaṇya Svāmi",
    guide: "Write \"Muruga\" / \"Subrahmanya\" / \"సుబ్రహ్మణ్య\" / \"स्कन्द\".",
  },
  {
    id: "sai",
    label: "Sāī Rām Likhita",
    display: "साईं राम",
    telugu: "సాయి రామ్",
    accepted: ["sai ram", "sai rama", "sairam", "om sai ram", "om sai", "saai ram", "साईं राम", "साईराम", "సాయి రామ్", "సాయిరాం", "sri sai", "shirdi sai"],
    accent: "#B45309",
    sadhana: "Sāī Rām Likhita Japa",
    grace: "By the grace of Śrī Sāī Bābā",
    guide: "Write \"Sai Ram\" or \"साईं राम\" or \"సాయి రామ్\".",
  },
  {
    id: "hare_krishna",
    label: "Mahā-Mantra Likhita",
    display: "हरे कृष्ण",
    telugu: "హరే కృష్ణ",
    accepted: ["hare krishna", "hare rama", "hare krishna hare rama", "mahamantra", "maha mantra", "हरे कृष्ण", "हरे राम", "హరే కృష్ణ", "హరే రామ"],
    accent: "#3730A3",
    sadhana: "Mahā-Mantra Likhita Japa",
    grace: "By the grace of Śrī Hari",
    guide: "Write \"Hare Krishna\" or \"Hare Rama\" (Mahā-Mantra).",
  },
];

// Tiny bell chime
function chime(volume = 0.25) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(660, ctx.currentTime);
    g.gain.setValueAtTime(volume, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
    o.connect(g); g.connect(ctx.destination);
    o.start(); o.stop(ctx.currentTime + 0.35);
    setTimeout(() => ctx.close(), 500);
  } catch { /* ignore */ }
}

const normalize = (s) => String(s || "")
  .trim()
  .toLowerCase()
  .replace(/\s+/g, " ");

const fmt = (n) => n.toLocaleString("en-IN");

export default function RamaKoti() {
  const { lang } = useApp();
  const { user } = useAuth();
  const [counts, setCounts] = useState(loadCounts);
  const [activeId, setActiveId] = useState(() => localStorage.getItem(KEY_ACTIVE) || NAME_PRESETS[0].id);
  const [entry, setEntry] = useState("");
  const [flash, setFlash] = useState(false);
  const [error, setError] = useState("");
  const [milestone, setMilestone] = useState(null);
  const [bell, setBell] = useState(() => localStorage.getItem(KEY_BELL) !== "false");
  const [mode, setMode] = useState(() => localStorage.getItem(KEY_MODE) || "type");
  const inputRef = useRef(null);

  const preset = useMemo(() => NAME_PRESETS.find((p) => p.id === activeId) || NAME_PRESETS[0], [activeId]);
  const count = counts[activeId] || 0;
  const overallPct = Math.min(100, (count / TARGET) * 100);
  const nextMilestone = MILESTONES.find((m) => m > count) || TARGET;
  const prevMilestone = [...MILESTONES].reverse().find((m) => m <= count) || 0;
  const tierPct = ((count - prevMilestone) / Math.max(1, nextMilestone - prevMilestone)) * 100;
  const unlocked = count >= TARGET;

  useEffect(() => saveCounts(counts), [counts]);
  useEffect(() => { localStorage.setItem(KEY_ACTIVE, activeId); }, [activeId]);
  useEffect(() => { localStorage.setItem(KEY_BELL, String(bell)); }, [bell]);
  useEffect(() => { localStorage.setItem(KEY_MODE, mode); }, [mode]);

  // Re-read after server sync
  useEffect(() => {
    const onSync = () => setCounts(loadCounts());
    window.addEventListener("dj-sadhana-synced", onSync);
    return () => window.removeEventListener("dj-sadhana-synced", onSync);
  }, []);

  // Debounced push likhita counts to server
  const syncTimerRef = useRef(null);
  useEffect(() => {
    if (!user) return;
    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    syncTimerRef.current = setTimeout(() => {
      axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/user/sadhana/sync`,
        { likhita_counts: counts, merge: true },
        { withCredentials: true }
      ).catch(() => {});
    }, 2000);
    return () => syncTimerRef.current && clearTimeout(syncTimerRef.current);
  }, [counts, user]);

  // Shared counter increment (used by both typing and writing pad)
  const increment = () => {
    const newCount = count + 1;
    setCounts((prev) => ({ ...prev, [activeId]: newCount }));
    setFlash(true);
    setTimeout(() => setFlash(false), 220);
    if (bell) {
      if (newCount % 108 === 0) chime(0.45);
      else if (newCount % 11 === 0) chime(0.18);
    }
    if (MILESTONES.includes(newCount)) {
      setMilestone(newCount);
      setTimeout(() => setMilestone(null), 3500);
      if (bell) chime(0.6);
    }
  };

  const write = (raw) => {
    const value = normalize(raw);
    if (!value) { setError("Write the divine name first."); return; }
    const accepted = preset.accepted.map(normalize);
    if (!accepted.some((a) => value === a || value.replace(/[^\w\s]/g, "") === a.replace(/[^\w\s]/g, ""))) {
      setError(`Please write "${preset.display}" (or accepted variants).`);
      return;
    }
    setError("");
    setEntry("");
    increment();
    inputRef.current?.focus();
  };

  const onKey = (e) => {
    if (e.key === "Enter") { e.preventDefault(); write(entry); }
  };

  const undo = () => {
    if (count <= 0) return;
    setCounts((prev) => ({ ...prev, [activeId]: Math.max(0, (prev[activeId] || 0) - 1) }));
  };

  const reset = () => {
    if (!window.confirm(`Reset ${preset.label} count? This cannot be undone.`)) return;
    setCounts((prev) => ({ ...prev, [activeId]: 0 }));
  };

  // Visual "book" — last 108 entries visualized as filled dots
  const inRound = count % 108;
  const totalRounds = Math.floor(count / 108);

  return (
    <div className="space-y-8" data-testid="rama-koti-page">
      <PageHero
        bannerId="rama_koti"
        eyebrow="Likhita Japa Sādhanā"
        title="Rāma Koṭi & Likhita Nāma"
        sanskritTitle="रामकोटि"
        subtitle="The ancient sādhanā of writing the divine name. Each written name accumulates spiritual merit — complete the sacred 1,00,00,116 writings to unlock your Likhita Japa Certificate."
      />

      {/* Preset picker */}
      <section className="sacred-card grain">
        <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Choose Divine Name</label>
        <div className="relative">
          <select
            value={activeId}
            onChange={(e) => { setActiveId(e.target.value); setEntry(""); setError(""); }}
            data-testid="ramakoti-name-select"
            className="w-full appearance-none rounded-lg pl-3 pr-9 py-2.5 gold-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-[hsl(var(--gold))]"
          >
            {NAME_PRESETS.map((p) => (
              <option key={p.id} value={p.id}>{p.label} — {p.display}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>
        <div className="mt-3 text-xs italic text-muted-foreground">{preset.guide}</div>
      </section>

      {milestone && (
        <div
          data-testid="ramakoti-milestone-toast"
          className="fixed top-24 left-1/2 -translate-x-1/2 z-[80] rounded-full px-5 py-2.5 bg-gradient-to-r from-[hsl(var(--kumkum))] to-[hsl(var(--saffron))] text-white diya-glow-strong animate-rise"
        >
          <Sparkles className="inline w-4 h-4 mr-2" />
          {milestone.toLocaleString("en-IN")} likhita nāma completed! 🌸
        </div>
      )}

      {/* Writing Board */}
      <section
        className="sacred-card grain relative overflow-hidden"
        style={{ background: `radial-gradient(ellipse at top, ${preset.accent}22 0%, transparent 60%)` }}
      >
        <div className="grid md:grid-cols-2 gap-6 items-center">
          {/* Left: Big display */}
          <div className="text-center md:text-left">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Write the sacred name</div>
            <div className="mt-2 font-devanagari text-6xl sm:text-7xl leading-none" style={{ color: preset.accent, textShadow: `0 0 32px ${preset.accent}55` }}>
              {preset.display}
            </div>
            <div className="mt-1 text-xl text-foreground/85">{preset.telugu}</div>
          </div>

          {/* Right: Input + counter */}
          <div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground text-center md:text-left">Total Written</div>
            <div
              data-testid="ramakoti-count-display"
              className={`text-center md:text-left font-display text-5xl sm:text-6xl font-semibold text-kumkum dark:text-[hsl(var(--gold))] transition-transform ${flash ? "scale-110" : ""}`}
              style={{ textShadow: `0 0 24px ${preset.accent}44` }}
            >
              {fmt(count)}
            </div>
            <div className="text-xs text-muted-foreground text-center md:text-left">/ {fmt(TARGET)} • Rounds of 108: <b className="text-foreground">{fmt(totalRounds)}</b></div>

            {/* Mode toggle: Type / Write with finger */}
            <div className="mt-4 inline-flex items-center rounded-full gold-border p-1 bg-card" data-testid="ramakoti-mode-toggle">
              <button
                onClick={() => { setMode("type"); setError(""); }}
                data-testid="ramakoti-mode-type"
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition ${mode === "type" ? "bg-gradient-to-r from-[hsl(var(--kumkum))] to-[hsl(var(--saffron))] text-white diya-glow" : "text-foreground/70 hover:text-foreground"}`}
              >
                <Keyboard className="w-3.5 h-3.5" /> Type
              </button>
              <button
                onClick={() => { setMode("write"); setError(""); }}
                data-testid="ramakoti-mode-write"
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition ${mode === "write" ? "bg-gradient-to-r from-[hsl(var(--kumkum))] to-[hsl(var(--saffron))] text-white diya-glow" : "text-foreground/70 hover:text-foreground"}`}
              >
                <Brush className="w-3.5 h-3.5" /> Write with finger
              </button>
            </div>

            {mode === "type" ? (
              <>
                <div className="mt-4 relative">
                  <input
                    ref={inputRef}
                    value={entry}
                    onChange={(e) => { setEntry(e.target.value); if (error) setError(""); }}
                    onKeyDown={onKey}
                    data-testid="ramakoti-input"
                    placeholder={`Type "${preset.display}" and press Enter`}
                    className="w-full rounded-lg pl-3 pr-16 py-3 font-devanagari text-2xl gold-border bg-card focus:outline-none focus:ring-2 focus:ring-[hsl(var(--gold))]"
                    autoComplete="off"
                    spellCheck={false}
                  />
                  <button
                    onClick={() => write(entry)}
                    data-testid="ramakoti-add-btn"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm bg-gradient-to-r from-[hsl(var(--kumkum))] to-[hsl(var(--saffron))] text-white hover:opacity-90 diya-glow"
                  >
                    <Check className="w-4 h-4" /> Add
                  </button>
                </div>
                {error && <div data-testid="ramakoti-error" className="mt-2 text-xs text-red-600">{error}</div>}
                <div className="mt-1 text-[11px] text-muted-foreground">Press <kbd className="px-1 py-0.5 rounded bg-muted text-[10px]">Enter</kbd> after each name.</div>
              </>
            ) : (
              <div className="mt-4 text-[11px] text-muted-foreground">
                Use the pad below to draw the sacred name with your finger, stylus or mouse.
              </div>
            )}
          </div>
        </div>

        {/* Writing pad — shows only in "write" mode */}
        {mode === "write" && (
          <div className="mt-6">
            <WritingPad
              onSubmit={increment}
              accent={preset.accent}
              displayHint={preset.display}
            />
          </div>
        )}

        {/* Progress */}
        <div className="mt-6 max-w-xl mx-auto">
          <div className="h-2 w-full rounded-full bg-[hsl(var(--gold)/0.15)] overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[hsl(var(--gold))] to-[hsl(var(--saffron))] transition-all"
                 style={{ width: `${Math.max(0.5, overallPct)}%` }} />
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground text-center">
            {overallPct.toFixed(overallPct < 0.01 ? 6 : 4)}% overall • Next: <b>{fmt(nextMilestone)}</b>
          </div>
          <div className="mt-2 h-1 w-full rounded-full bg-[hsl(var(--saffron)/0.15)] overflow-hidden">
            <div className="h-full bg-[hsl(var(--saffron))] transition-all" style={{ width: `${Math.min(100, tierPct)}%` }} />
          </div>
        </div>

        {/* 108 dots — visual "page" */}
        <div className="mt-6">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground text-center mb-2">Current Round: {inRound}/108</div>
          <div className="grid grid-cols-18 gap-1 max-w-lg mx-auto" style={{ gridTemplateColumns: "repeat(18, minmax(0, 1fr))" }}>
            {Array.from({ length: 108 }).map((_, i) => {
              const filled = i < inRound;
              return (
                <div
                  key={i}
                  className="aspect-square rounded-sm transition-all"
                  style={{
                    background: filled ? preset.accent : "hsl(var(--gold) / 0.12)",
                    boxShadow: filled ? `0 0 6px ${preset.accent}66` : "none",
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Controls */}
        <div className="mt-6 flex items-center justify-center gap-2 flex-wrap">
          <button onClick={undo} data-testid="ramakoti-undo-btn" className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs gold-border hover:bg-[hsl(var(--gold)/0.1)] transition">
            <RotateCcw className="w-3.5 h-3.5" /> Undo last
          </button>
          <button onClick={() => setBell((b) => !b)} data-testid="ramakoti-bell-toggle" className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs gold-border hover:bg-[hsl(var(--gold)/0.1)] transition">
            {bell ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />} Chime {bell ? "on" : "off"}
          </button>
          <button onClick={reset} data-testid="ramakoti-reset-btn" className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs text-red-700 border border-red-500/40 hover:bg-red-500/10 transition">
            Reset
          </button>
        </div>
      </section>

      {/* Milestones */}
      <section className="sacred-card grain">
        <h3 className="text-lg font-semibold text-kumkum dark:text-[hsl(var(--gold))]">Milestones</h3>
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
          {MILESTONES.map((m) => {
            const done = count >= m;
            return (
              <div key={m} data-testid={`ramakoti-milestone-${m}`}
                   className={`rounded-lg p-2 text-center gold-border ${done ? "bg-[hsl(var(--gold)/0.15)] text-kumkum dark:text-[hsl(var(--gold))]" : "opacity-60"}`}>
                <div className="text-base">{done ? "✓" : "○"}</div>
                <div className="mt-0.5">{fmt(m)}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Certificate */}
      <NamaCertificate
        unlocked={unlocked}
        count={count}
        target={TARGET}
        sadhanaTitle={preset.sadhana}
        sadhanaSub={`${fmt(TARGET)} × ${preset.display}`}
        achievement={`${fmt(TARGET)} writings of ${preset.display}`}
        accent={preset.accent}
        signature={preset.grace}
        testIdPrefix="ramakoti-cert"
        extraDetail="Likhita Japa — the sacred sādhanā of writing"
      />

      {/* Tips */}
      <section className="sacred-card grain">
        <div className="flex items-center gap-2 mb-2">
          <PenLine className="w-4 h-4 text-saffron" />
          <h3 className="text-sm font-semibold text-kumkum dark:text-[hsl(var(--gold))]">A note on Likhita Japa</h3>
        </div>
        <p className="text-sm text-foreground/80">
          Traditionally, devotees write the divine name in a bound notebook — one name per line — while chanting mentally.
          Use this digital board as a daily sādhanā companion. Bhagavān sees the bhāvanā, not the medium.
        </p>
      </section>
    </div>
  );
}
