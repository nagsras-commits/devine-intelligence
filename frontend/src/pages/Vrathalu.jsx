import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, BookOpen, CalendarDays, Search, Sparkles, Square, Volume2 } from "lucide-react";
import { VRATHALU, VRATHALU_SOURCES } from "@/data/vrathalu";
import { createDevineUtterance } from "@/lib/speech";

const categoryLabels = { vrathalu: "వ్రతాలు", nomulu: "నోములు" };

function RitualDetail({ item }) {
  const [speaking, setSpeaking] = useState(false);
  const steps = [
    "పూజా స్థలాన్ని శుభ్రపరచి, స్నానం చేసి, పూజా సామగ్రిని సిద్ధం చేసుకోండి.",
    "దీపం వెలిగించి, గణపతిని స్మరించి, మీ పేరు-గోత్రం తెలిసి ఉంటే వాటితో సంకల్పం చెప్పండి.",
    item.focus,
    "సంబంధిత వ్రతకథను చదవండి లేదా వినండి; ఇచ్చిన మంత్రం, ప్రార్థనను భక్తితో జపించండి.",
    "నైవేద్యం సమర్పించి హారతి ఇవ్వండి; ప్రసాదాన్ని కుటుంబంతో పంచుకోండి.",
  ];
  const toggleSpeech = () => {
    const synth = window.speechSynthesis;
    if (!synth) return;
    if (speaking) {
      synth.cancel();
      setSpeaking(false);
      return;
    }
    const text = [item.title, item.when, item.preparation, item.focus, item.mantra, item.sloka].join(". ");
    const utterance = createDevineUtterance(text);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    synth.cancel();
    synth.speak(utterance);
    setSpeaking(true);
  };

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  return (
    <article className="space-y-7" data-testid={`vrathalu-detail-${item.id}`}>
      <Link to="/vrathalu" className="inline-flex items-center gap-2 text-sm text-kumkum dark:text-[hsl(var(--gold))] hover:underline">
        <ArrowLeft className="h-4 w-4" /> అన్ని వ్రతాలు, నోములు
      </Link>

      <header className="border-b border-[hsl(var(--gold)/0.4)] pb-5">
        <div className="mb-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>{categoryLabels[item.category]}</span><span aria-hidden="true">·</span><span>{item.deity}</span>
        </div>
        <h1 className="font-telugu text-3xl sm:text-4xl leading-relaxed text-kumkum dark:text-[hsl(var(--gold))]">{item.title}</h1>
        <button
          type="button"
          onClick={toggleSpeech}
          data-testid={`read-page-${item.id}`}
          aria-label={speaking ? "Stop reading page text" : "Read page text"}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-[hsl(var(--kumkum))] px-4 py-2 text-sm font-medium text-white hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--gold))]"
        >
          {speaking ? <><Square className="h-4 w-4" /> చదవడం ఆపండి</> : <><Volume2 className="h-4 w-4" /> ఈ పేజీని చదవండి</>}
        </button>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="mb-2 flex items-center gap-2 font-display text-lg text-kumkum dark:text-[hsl(var(--gold))]"><CalendarDays className="h-4 w-4" /> ఎప్పుడు ఆచరించాలి</h2>
          <p className="font-telugu leading-8 text-foreground/85">{item.when}</p>
        </div>
        <div>
          <h2 className="mb-2 flex items-center gap-2 font-display text-lg text-kumkum dark:text-[hsl(var(--gold))]"><Sparkles className="h-4 w-4" /> సిద్ధం చేసుకోవాల్సినవి</h2>
          <p className="font-telugu leading-8 text-foreground/85">{item.preparation}</p>
        </div>
      </section>

      <section>
        <h2 className="mb-3 flex items-center gap-2 font-display text-lg text-kumkum dark:text-[hsl(var(--gold))]"><BookOpen className="h-4 w-4" /> పూజా విధి: దశలవారీగా</h2>
        <ol className="space-y-3 font-telugu leading-8 text-foreground/85">
          {steps.map((step, index) => <li key={index} className="flex gap-3"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[hsl(var(--gold)/0.16)] text-sm font-semibold text-kumkum dark:text-[hsl(var(--gold))]">{index + 1}</span><span>{step}</span></li>)}
        </ol>
      </section>

      <section className="space-y-4 border-t border-[hsl(var(--gold)/0.35)] pt-5">
        <div>
          <h2 className="mb-2 font-display text-lg text-kumkum dark:text-[hsl(var(--gold))]">మంత్రం</h2>
          <p className="font-telugu text-xl leading-9">{item.mantra}</p>
        </div>
        <div>
          <h2 className="mb-2 font-display text-lg text-kumkum dark:text-[hsl(var(--gold))]">ప్రారంభ ప్రార్థన</h2>
          <p className="font-devanagari whitespace-pre-line text-lg leading-9">{item.sloka}</p>
        </div>
      </section>

      <p className="border-l-2 border-[hsl(var(--gold))] pl-4 font-telugu text-sm leading-7 text-muted-foreground">
        తిథి, ముహూర్తం, ఉపవాసం మరియు కథా పాఠాంతరాలు ప్రాంతం, పంచాంగం, కుటుంబ సంప్రదాయం బట్టి మారవచ్చు. ఈ సాధారణ సూచనలను స్థానిక పూజారి లేదా కుటుంబ వ్రతకల్పంతో నిర్ధారించండి. ఆరోగ్యాన్ని ప్రభావితం చేసే ఉపవాస నియమాలు వైద్య సలహా లేకుండా పాటించవద్దు.
      </p>
      <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
        {VRATHALU_SOURCES.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-foreground">{source.label}</a>)}
      </div>
    </article>
  );
}

export default function Vrathalu() {
  const { id } = useParams();
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const selected = VRATHALU.find((item) => item.id === id);
  const filtered = useMemo(() => VRATHALU.filter((item) =>
    (category === "all" || item.category === category) && item.title.includes(query.trim())
  ), [category, query]);

  if (id) return selected ? <RitualDetail key={selected.id} item={selected} /> : (
    <section className="space-y-4"><h1 className="font-display text-2xl">వ్రతం కనబడలేదు</h1><Link to="/vrathalu" className="underline">జాబితాకు తిరిగి వెళ్ళండి</Link></section>
  );

  return (
    <div className="space-y-8" data-testid="vrathalu-index">
      <header className="border-b border-[hsl(var(--gold)/0.4)] pb-5">
        <p className="mb-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">వ్రతకల్పాలు · గృహాచారాలు</p>
        <h1 className="font-display text-3xl sm:text-4xl leading-tight text-kumkum dark:text-[hsl(var(--gold))]">Vrathalu &amp; Nomulu</h1>
        <p className="mt-1 font-telugu text-xl leading-8 text-foreground/85">వ్రతాలు &amp; నోములు</p>
        <p className="mt-2 max-w-3xl font-telugu leading-7 text-foreground/75">తెలుగు సంప్రదాయాల్లో ఆచరించే వ్రతాలు, నోముల విధి, మంత్రాలు మరియు సమయ సూచనలు.</p>
      </header>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2" role="group" aria-label="వ్రతాల వర్గం">
          {[{ id: "all", label: "అన్నీ" }, { id: "vrathalu", label: "వ్రతాలు" }, { id: "nomulu", label: "నోములు" }].map((tab) => (
            <button key={tab.id} type="button" onClick={() => setCategory(tab.id)} aria-pressed={category === tab.id} data-testid={`vrathalu-filter-${tab.id}`} className={`rounded-full px-4 py-2 text-sm ${category === tab.id ? "bg-[hsl(var(--kumkum))] text-white" : "gold-border hover:bg-[hsl(var(--gold)/0.1)]"}`}>
              {tab.label}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 rounded-full gold-border px-3 py-2 sm:w-72">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" placeholder="వ్రతం లేదా నోము వెతకండి" aria-label="వ్రతం లేదా నోము వెతకండి" data-testid="vrathalu-search" />
        </label>
      </div>

      {[
        { id: "vrathalu", title: "వ్రతాలు" },
        { id: "nomulu", title: "నోములు" },
      ].filter((group) => category === "all" || category === group.id).map((group) => {
        const items = filtered.filter((item) => item.category === group.id);
        if (!items.length) return null;
        return (
          <section key={group.id} aria-labelledby={`group-${group.id}`}>
            <h2 id={`group-${group.id}`} className="mb-3 font-display text-xl text-kumkum dark:text-[hsl(var(--gold))]">{group.title}<span className="ml-2 text-sm text-muted-foreground">{items.length}</span></h2>
            <ul className="divide-y divide-[hsl(var(--gold)/0.25)] border-y border-[hsl(var(--gold)/0.35)]">
              {items.map((item) => <li key={item.id}><Link to={`/vrathalu/${item.id}`} data-testid={`vrathalu-item-${item.id}`} className="flex items-center justify-between gap-4 py-3 transition-colors hover:bg-[hsl(var(--gold)/0.06)]"><span className="font-telugu leading-7 text-foreground">{item.title}</span><span className="shrink-0 text-sm text-kumkum dark:text-[hsl(var(--gold))]" aria-hidden="true">→</span></Link></li>)}
            </ul>
          </section>
        );
      })}
      {!filtered.length && <p className="py-8 text-center font-telugu text-muted-foreground">ఈ వెతుకులాటకు సరిపోలే అంశాలు లేవు.</p>}
      <div className="border-t border-[hsl(var(--gold)/0.3)] pt-4 text-xs leading-6 text-muted-foreground">
        {VRATHALU_SOURCES.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer" className="mr-5 underline underline-offset-2 hover:text-foreground">{source.label}</a>)}
        <p className="mt-2 font-telugu">ప్రాంతం, సంప్రదాయం, పంచాంగం బట్టి ఆచారాలు మారవచ్చు. ఖచ్చితమైన తిథి, ముహూర్తం కోసం స్థానిక పంచాంగాన్ని చూడండి.</p>
      </div>
    </div>
  );
}