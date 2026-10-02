import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import PageHero from "@/components/PageHero";
import FamilySadhana from "@/components/FamilySadhana";
import axios from "axios";
import { LogIn, LogOut, RefreshCw, Cloud, User, ChevronRight } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Profile() {
  const { user, loading, login, logout, syncNow } = useAuth();
  const nav = useNavigate();
  const [sadhana, setSadhana] = useState(null);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    if (!user) return;
    axios.get(`${API}/user/sadhana`, { withCredentials: true }).then((r) => setSadhana(r.data)).catch(() => {});
  }, [user]);

  if (loading) return <div className="py-20 text-center text-muted-foreground">Loading…</div>;

  return (
    <div className="space-y-8" data-testid="profile-page">
      <PageHero
        bannerId="home"
        eyebrow="Your Sādhanā"
        title="Profile"
        sanskritTitle="भक्तपरिचयः"
        subtitle={user ? `Welcome back, ${user.name}. Your sādhanā is synced across all devices.` : "Sign in with Google to sync your japa counts, likhita counts and ritual streak across devices."}
      />

      {!user ? (
        <section className="sacred-card grain text-center">
          <div className="w-16 h-16 mx-auto rounded-full grid place-items-center bg-gradient-to-br from-[hsl(var(--gold))] to-[hsl(var(--saffron))] text-white diya-glow-strong">
            <User className="w-8 h-8" />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-kumkum dark:text-[hsl(var(--gold))]">Sign in to sync your sādhanā</h2>
          <p className="mt-2 text-sm text-foreground/70 max-w-md mx-auto">
            You can keep using the app in <b>guest mode</b>. Sign in only if you want your japa and likhita counts saved to the cloud and available on other devices.
          </p>
          <button
            onClick={login}
            data-testid="profile-signin-btn"
            className="mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 bg-gradient-to-r from-[hsl(var(--kumkum))] to-[hsl(var(--saffron))] text-white font-medium hover:opacity-90 diya-glow"
          >
            <LogIn className="w-4 h-4" /> Sign in with Google
          </button>
          <button
            onClick={() => nav("/")}
            data-testid="profile-guest-btn"
            className="mt-3 block mx-auto text-xs text-muted-foreground hover:text-foreground"
          >
            Continue as guest
          </button>
        </section>
      ) : (
        <>
          <section className="sacred-card grain">
            <div className="flex items-center gap-4">
              {user.picture ? (
                <img src={user.picture} alt="" className="w-16 h-16 rounded-full ring-2 ring-[hsl(var(--gold))]" />
              ) : (
                <div className="w-16 h-16 rounded-full grid place-items-center bg-[hsl(var(--gold)/0.15)] text-2xl font-bold text-kumkum">
                  {user.name?.[0] || "🕉️"}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-lg text-kumkum dark:text-[hsl(var(--gold))]">{user.name}</div>
                <div className="text-xs text-muted-foreground truncate">{user.email}</div>
              </div>
              <button
                onClick={async () => { setSyncing(true); await syncNow(); const r = await axios.get(`${API}/user/sadhana`, { withCredentials: true }); setSadhana(r.data); setSyncing(false); }}
                data-testid="profile-sync-btn"
                className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs gold-border hover:bg-[hsl(var(--gold)/0.1)] transition disabled:opacity-60"
                disabled={syncing}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin" : ""}`} /> {syncing ? "Syncing…" : "Sync now"}
              </button>
              <button
                onClick={logout}
                data-testid="profile-signout-btn"
                className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs text-red-700 border border-red-500/40 hover:bg-red-500/10 transition"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign out
              </button>
            </div>
          </section>

          {sadhana && (
            <>
              <section className="sacred-card grain" data-testid="profile-japa-summary">
                <div className="flex items-center gap-2 mb-3">
                  <Cloud className="w-4 h-4 text-saffron" />
                  <h3 className="text-lg font-semibold text-kumkum dark:text-[hsl(var(--gold))]">Cloud Japa Totals</h3>
                </div>
                {Object.keys(sadhana.japa_counts || {}).length === 0 ? (
                  <div className="text-sm text-muted-foreground">No japa counts synced yet. Start chanting on <button onClick={() => nav("/japa")} className="text-saffron underline">Japa Counter <ChevronRight className="inline w-3 h-3" /></button></div>
                ) : (
                  <div className="space-y-1.5">
                    {Object.entries(sadhana.japa_counts).sort((a, b) => b[1] - a[1]).map(([id, v]) => (
                      <div key={id} className="flex items-center gap-3">
                        <div className="flex-1 truncate text-sm">{id}</div>
                        <div className="text-sm font-medium">{Number(v).toLocaleString("en-IN")}</div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section className="sacred-card grain" data-testid="profile-likhita-summary">
                <div className="flex items-center gap-2 mb-3">
                  <Cloud className="w-4 h-4 text-saffron" />
                  <h3 className="text-lg font-semibold text-kumkum dark:text-[hsl(var(--gold))]">Cloud Likhita Totals</h3>
                </div>
                {Object.keys(sadhana.likhita_counts || {}).length === 0 ? (
                  <div className="text-sm text-muted-foreground">No likhita counts synced yet. Start writing on <button onClick={() => nav("/rama-koti")} className="text-saffron underline">Rāma Koṭi <ChevronRight className="inline w-3 h-3" /></button></div>
                ) : (
                  <div className="space-y-1.5">
                    {Object.entries(sadhana.likhita_counts).sort((a, b) => b[1] - a[1]).map(([id, v]) => (
                      <div key={id} className="flex items-center gap-3">
                        <div className="flex-1 truncate text-sm">{id}</div>
                        <div className="text-sm font-medium">{Number(v).toLocaleString("en-IN")}</div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {sadhana.updated_at && (
                <p className="text-[11px] text-muted-foreground text-center">
                  Last synced: {new Date(sadhana.updated_at).toLocaleString("en-IN")}
                </p>
              )}
            </>
          )}
        </>
      )}
      <FamilySadhana />
    </div>
  );
}
