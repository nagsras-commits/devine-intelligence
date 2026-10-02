import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";

const AuthContext = createContext(null);
const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Read japa/likhita state from localStorage so we can push it to server on login
const readLocal = () => {
  const num = (v) => { try { return JSON.parse(v || "{}"); } catch { return {}; } };
  const numCounts = (obj) => {
    const out = {};
    Object.entries(obj || {}).forEach(([k, v]) => { out[k] = typeof v === "number" ? v : parseInt(v, 10) || 0; });
    return out;
  };
  return {
    japa_counts: numCounts(num(localStorage.getItem("dj_japa_counts"))),
    likhita_counts: numCounts(num(localStorage.getItem("dj_ramakoti_counts"))),
    ritual_streak: num(localStorage.getItem("dj_tulasi_streak")),
  };
};

const writeLocal = (server) => {
  if (server.japa_counts) localStorage.setItem("dj_japa_counts", JSON.stringify(server.japa_counts));
  if (server.likhita_counts) localStorage.setItem("dj_ramakoti_counts", JSON.stringify(server.likhita_counts));
  if (server.ritual_streak && Object.keys(server.ritual_streak).length) {
    localStorage.setItem("dj_tulasi_streak", JSON.stringify(server.ritual_streak));
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API}/auth/me`, { withCredentials: true });
      setUser(data);
      return data;
    } catch {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Handle emergent auth redirect: look for #session_id=... on URL fragment
    const initFromFragment = async () => {
      const hash = window.location.hash;
      if (hash.startsWith("#session_id=")) {
        const sessionId = hash.replace("#session_id=", "").split("&")[0];
        try {
          await axios.post(`${API}/auth/session`, {}, {
            headers: { "X-Session-ID": sessionId },
            withCredentials: true,
          });
          // Clean the URL
          const cleanUrl = window.location.pathname + window.location.search;
          window.history.replaceState({}, "", cleanUrl);
          const u = await refresh();
          if (u) {
            // Merge localStorage → server, then hydrate local from server
            const local = readLocal();
            try {
              const { data } = await axios.post(`${API}/user/sadhana/sync`, {
                ...local, merge: true,
              }, { withCredentials: true });
              writeLocal(data);
            } catch { /* non-fatal */ }
          }
        } catch (e) {
          console.warn("Auth session exchange failed", e);
        }
      }
      await refresh();
    };
    initFromFragment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = () => {
    const redirect = encodeURIComponent(window.location.origin + "/profile");
    window.location.href = `https://auth.emergentagent.com/?redirect=${redirect}`;
  };

  const logout = async () => {
    try {
      await axios.post(`${API}/auth/logout`, {}, { withCredentials: true });
    } catch { /* ignore */ }
    setUser(null);
  };

  const syncNow = async () => {
    if (!user) return null;
    const local = readLocal();
    try {
      const { data } = await axios.post(`${API}/user/sadhana/sync`, { ...local, merge: true }, { withCredentials: true });
      writeLocal(data);
      // Notify listeners (e.g. JapaCounter, RamaKoti) to re-read localStorage
      window.dispatchEvent(new Event("dj-sadhana-synced"));
      return data;
    } catch (e) {
      console.warn("sync failed", e);
      return null;
    }
  };

  const value = { user, loading, login, logout, refresh, syncNow };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
