import React, { useEffect, useState } from "react";
import axios from "axios";
import { Users, Sparkles, Loader2, Copy, LogOut, Plus, Hash, PenLine, Trophy } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { DEITIES } from "@/data/deities";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const TARGET = 10000116;

const fmt = (n) => (n || 0).toLocaleString("en-IN");

export default function FamilySadhana() {
  const { user } = useAuth() || {};
  const [households, setHouseholds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("view"); // view | create | join
  const [name, setName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [err, setErr] = useState("");
  const [toast, setToast] = useState("");
  const [deityId, setDeityId] = useState(DEITIES[0]?.id || "shiva");
  const [contribJapa, setContribJapa] = useState(108);
  const [contribLikhita, setContribLikhita] = useState(0);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/household/mine`, { withCredentials: true });
      setHouseholds(data || []);
    } catch { setHouseholds([]); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [user]);

  const showToast = (m) => { setToast(m); setTimeout(() => setToast(""), 2500); };

  const create = async (e) => {
    e?.preventDefault();
    if (!name.trim()) { setErr("Please give your household a name."); return; }
    setErr("");
    try {
      const { data } = await axios.post(`${API}/household/create`, { name }, { withCredentials: true });
      setHouseholds([data]); setMode("view"); setName(""); showToast(`Created — share code ${data.code}`);
    } catch (e) { setErr(e?.response?.data?.detail || "Could not create"); }
  };
  const join = async (e) => {
    e?.preventDefault();
    if (!joinCode.trim()) { setErr("Enter the invite code."); return; }
    setErr("");
    try {
      const { data } = await axios.post(`${API}/household/join`, null, { params: { code: joinCode.toUpperCase() }, withCredentials: true });
      setHouseholds([data]); setMode("view"); setJoinCode(""); showToast(`Joined ${data.name}`);
    } catch (e) { setErr(e?.response?.data?.detail || "Could not join"); }
  };
  const contribute = async (hh) => {
    if (!contribJapa && !contribLikhita) return;
    try {
      const { data } = await axios.post(`${API}/household/contribute`, {
        deity_id: deityId, japa: contribJapa, likhita: contribLikhita,
      }, { withCredentials: true });
      setHouseholds([data]);
      showToast(`+${contribJapa || 0} japa, +${contribLikhita || 0} likhita contributed`);
    } catch (e) { showToast(e?.response?.data?.detail || "Failed"); }
  };
  const leave = async () => {
    if (!window.confirm("Leave this household? Shared progress stays for others.")) return;
    try { await axios.post(`${API}/household/leave`, null, { withCredentials: true }); setHouseholds([]); showToast("Left household"); }
    catch (e) { showToast("Failed"); }
  };
  const copyCode = (code) => {
    navigator.clipboard?.writeText(code).then(() => showToast(`Code ${code} copied`));
  };

  if (!user) {
    return (
      <section className="sacred-card grain" data-testid="family-sadhana">
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-5 h-5 text-saffron" />
          <h3 className="text-xl font-semibold text-kumkum dark:text-[hsl(var(--gold))]">Family Sādhanā</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Sign in to create or join a household and pool your family's japa and likhita towards the shared 1,00,00,116 goal.
        </p>
      </section>
    );
  }

  const hh = households[0];

  return (
    <section className="sacred-card grain" data-testid="family-sadhana">
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <Users className="w-5 h-5 text-saffron" />
        <h3 className="text-xl font-semibold text-kumkum dark:text-[hsl(var(--gold))]">Family Sādhanā</h3>
        {toast && <span data-testid="family-toast" className="ml-auto text-[11px] rounded-full px-3 py-1 gold-border bg-emerald-500/10 text-emerald-700">{toast}</span>}
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" /> Loading…</div>
      ) : hh ? (
        <>
          <div className="rounded-xl p-4 gold-border" style={{ background: "linear-gradient(135deg, hsl(var(--gold)/0.12), hsl(var(--saffron)/0.06))" }}>
            <div className="flex items-baseline justify-between gap-3 flex-wrap">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Household</div>
                <div className="text-xl font-display text-kumkum dark:text-[hsl(var(--gold))]" data-testid="family-name">{hh.name}</div>
              </div>
              <button onClick={() => copyCode(hh.code)} data-testid="family-copy-code" className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs gold-border hover:bg-[hsl(var(--gold)/0.15)]">
                <Hash className="w-3.5 h-3.5" /> Invite code <b className="tracking-widest">{hh.code}</b> <Copy className="w-3 h-3" />
              </button>
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              {hh.members?.length || 0} member{(hh.members?.length || 0) === 1 ? "" : "s"} • {hh.members?.map((m) => m.name || "Anon").join(", ")}
            </div>
          </div>

          {/* Shared totals */}
          <div className="mt-4">
            <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">Shared progress</div>
            <div className="space-y-2">
              {DEITIES.slice(0, 8).filter((d) => (hh.japa_counts?.[d.id] || hh.likhita_counts?.[d.id])).length === 0 && (
                <div className="text-xs text-muted-foreground italic">No contributions yet. Add the family's first 108 below!</div>
              )}
              {DEITIES.filter((d) => (hh.japa_counts?.[d.id] || hh.likhita_counts?.[d.id])).map((d) => {
                const j = hh.japa_counts?.[d.id] || 0;
                const l = hh.likhita_counts?.[d.id] || 0;
                const combined = j + l;
                const pct = Math.min(100, (combined / TARGET) * 100);
                return (
                  <div key={d.id} className="rounded-lg p-3 gold-border bg-card" data-testid={`family-progress-${d.id}`}>
                    <div className="flex items-baseline justify-between text-sm">
                      <span className="font-medium">{d.name?.en || d.id}</span>
                      <span className="text-xs text-muted-foreground tabular-nums">{fmt(combined)} / {fmt(TARGET)}</span>
                    </div>
                    <div className="mt-1.5 h-2 rounded-full overflow-hidden bg-[hsl(var(--gold)/0.12)]">
                      <div className="h-full bg-gradient-to-r from-[hsl(var(--kumkum))] to-[hsl(var(--saffron))]" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="mt-1 text-[10px] text-muted-foreground flex gap-4">
                      <span><Hash className="w-3 h-3 inline" /> {fmt(j)} japa</span>
                      <span><PenLine className="w-3 h-3 inline" /> {fmt(l)} likhita</span>
                      {combined >= TARGET && <span className="ml-auto text-emerald-700 font-semibold"><Trophy className="w-3 h-3 inline" /> Sādhanā complete!</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contribute */}
          <div className="mt-4 rounded-xl p-3 gold-border bg-[hsl(var(--gold)/0.05)]">
            <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">Contribute today</div>
            <div className="grid sm:grid-cols-4 gap-2">
              <select value={deityId} onChange={(e) => setDeityId(e.target.value)} data-testid="family-deity" className="rounded-lg px-3 py-2 gold-border bg-card text-sm">
                {DEITIES.map((d) => <option key={d.id} value={d.id}>{d.name?.en || d.id}</option>)}
              </select>
              <input type="number" min="0" value={contribJapa} onChange={(e) => setContribJapa(parseInt(e.target.value || "0", 10))} data-testid="family-japa" placeholder="Japa +" className="rounded-lg px-3 py-2 gold-border bg-card text-sm" />
              <input type="number" min="0" value={contribLikhita} onChange={(e) => setContribLikhita(parseInt(e.target.value || "0", 10))} data-testid="family-likhita" placeholder="Likhita +" className="rounded-lg px-3 py-2 gold-border bg-card text-sm" />
              <button onClick={() => contribute(hh)} data-testid="family-contribute" className="rounded-full px-4 py-2 text-sm bg-gradient-to-r from-[hsl(var(--kumkum))] to-[hsl(var(--saffron))] text-white hover:opacity-90 inline-flex items-center gap-1 justify-center">
                <Sparkles className="w-4 h-4" /> Contribute
              </button>
            </div>
          </div>

          <div className="mt-3 flex justify-end">
            <button onClick={leave} data-testid="family-leave" className="text-[11px] inline-flex items-center gap-1 text-muted-foreground hover:text-red-600">
              <LogOut className="w-3 h-3" /> Leave household
            </button>
          </div>
        </>
      ) : mode === "view" ? (
        <>
          <p className="text-sm text-muted-foreground mb-3">
            Pool your family's japa and likhita toward the shared 1,00,00,116 goal per deity. Anyone in the household can contribute; everyone shares the total.
          </p>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setMode("create")} data-testid="family-create-open" className="rounded-full px-4 py-2 text-sm bg-gradient-to-r from-[hsl(var(--kumkum))] to-[hsl(var(--saffron))] text-white hover:opacity-90 inline-flex items-center gap-1">
              <Plus className="w-4 h-4" /> Create household
            </button>
            <button onClick={() => setMode("join")} data-testid="family-join-open" className="rounded-full px-4 py-2 text-sm gold-border hover:bg-[hsl(var(--gold)/0.15)] inline-flex items-center gap-1">
              <Hash className="w-4 h-4" /> Join with code
            </button>
          </div>
        </>
      ) : mode === "create" ? (
        <form onSubmit={create} className="space-y-2">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Our Family Sādhanā" data-testid="family-name-input" className="w-full rounded-lg px-3 py-2 gold-border bg-card text-sm" autoFocus />
          {err && <div className="text-xs text-red-600" data-testid="family-err">{err}</div>}
          <div className="flex gap-2">
            <button type="submit" data-testid="family-create-submit" className="rounded-full px-4 py-2 text-sm bg-gradient-to-r from-[hsl(var(--kumkum))] to-[hsl(var(--saffron))] text-white hover:opacity-90">Create</button>
            <button type="button" onClick={() => { setMode("view"); setErr(""); }} className="text-xs text-muted-foreground">Cancel</button>
          </div>
        </form>
      ) : (
        <form onSubmit={join} className="space-y-2">
          <input value={joinCode} onChange={(e) => setJoinCode(e.target.value.toUpperCase())} placeholder="6-char invite code" data-testid="family-join-input" maxLength={6} className="w-full rounded-lg px-3 py-2 gold-border bg-card text-sm tracking-widest uppercase font-bold" autoFocus />
          {err && <div className="text-xs text-red-600" data-testid="family-err">{err}</div>}
          <div className="flex gap-2">
            <button type="submit" data-testid="family-join-submit" className="rounded-full px-4 py-2 text-sm bg-gradient-to-r from-[hsl(var(--kumkum))] to-[hsl(var(--saffron))] text-white hover:opacity-90">Join</button>
            <button type="button" onClick={() => { setMode("view"); setErr(""); }} className="text-xs text-muted-foreground">Cancel</button>
          </div>
        </form>
      )}
    </section>
  );
}
