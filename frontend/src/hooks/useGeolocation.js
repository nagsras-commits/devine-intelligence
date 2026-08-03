import { useEffect, useState } from "react";

const GEO_KEY = "dj_geo_v1";
const TTL_MS = 7 * 86400 * 1000; // re-ask after 7 days

const loadCached = () => {
  try {
    const raw = JSON.parse(localStorage.getItem(GEO_KEY) || "null");
    if (!raw || Date.now() - (raw.at || 0) > TTL_MS) return null;
    return raw;
  } catch { return null; }
};

const guessTzOffset = () => -new Date().getTimezoneOffset() / 60; // decimal hours, e.g. 5.5

export default function useGeolocation() {
  const [state, setState] = useState(() => {
    const c = loadCached();
    if (c) return { ...c, status: "ready", requested: true };
    return { status: "idle", lat: null, lng: null, tz_offset: guessTzOffset(), requested: false };
  });

  const request = () => {
    if (!("geolocation" in navigator)) {
      setState((s) => ({ ...s, status: "denied", requested: true }));
      return;
    }
    setState((s) => ({ ...s, status: "loading", requested: true }));
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const v = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          tz_offset: guessTzOffset(),
          at: Date.now(),
          status: "ready",
          requested: true,
        };
        try { localStorage.setItem(GEO_KEY, JSON.stringify(v)); } catch {}
        setState(v);
      },
      () => setState((s) => ({ ...s, status: "denied", requested: true })),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 24 * 3600 * 1000 }
    );
  };

  const clear = () => {
    try { localStorage.removeItem(GEO_KEY); } catch {}
    setState({ status: "idle", lat: null, lng: null, tz_offset: guessTzOffset(), requested: false });
  };

  // Auto-attempt once on mount if permission already granted
  useEffect(() => {
    if (state.status !== "idle") return;
    if (!("permissions" in navigator)) return;
    navigator.permissions.query({ name: "geolocation" }).then((p) => {
      if (p.state === "granted") request();
    }).catch(() => {});
    // eslint-disable-next-line
  }, []);

  return { ...state, request, clear };
}
