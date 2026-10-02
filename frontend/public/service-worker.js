/* Devine Intelligence — Service Worker
 * Provides:
 *  - Offline shell caching (network-first for HTML, stale-while-revalidate for static)
 *  - Notification API integration (for local muhurta reminders)
 *
 * Bump CACHE_VERSION on releases to force refresh.
 */
const CACHE_VERSION = "devine-v2";
const SHELL_CACHE = `${CACHE_VERSION}-shell`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

// Core routes to pre-cache
const SHELL_ASSETS = [
  "/",
  "/manifest.webmanifest",
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(SHELL_ASSETS).catch(() => {}))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => !k.startsWith(CACHE_VERSION)).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;

  // Never cache API calls or POST/mutations; let them fail if offline.
  if (url.pathname.startsWith("/api/") && !url.pathname.startsWith("/api/static/")) {
    return; // pass through to network
  }

  // Navigations: network-first, fallback to cached shell
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(RUNTIME_CACHE).then((c) => c.put(req, copy)).catch(() => {});
        return res;
      }).catch(() => caches.match(req).then((r) => r || caches.match("/")))
    );
    return;
  }

  // Static assets & /api/static images: stale-while-revalidate
  if (sameOrigin || url.pathname.startsWith("/api/static/")) {
    event.respondWith(
      caches.match(req).then((cached) => {
        const fetchPromise = fetch(req).then((res) => {
          if (res && res.status === 200 && res.type !== "opaque") {
            const copy = res.clone();
            caches.open(RUNTIME_CACHE).then((c) => c.put(req, copy)).catch(() => {});
          }
          return res;
        }).catch(() => cached);
        return cached || fetchPromise;
      })
    );
  }
});

// Support scheduling notifications from page via postMessage
self.addEventListener("message", (event) => {
  const data = event.data || {};
  if (data.type === "schedule-notification") {
    const { title, body, tag, delayMs, url } = data;
    setTimeout(() => {
      self.registration.showNotification(title || "Muhūrta Alarm", {
        body: body || "It is time for the muhūrta.",
        icon: "/api/static/icons/panchangam.png",
        badge: "/api/static/icons/panchangam.png",
        tag: tag || "muhurta",
        renotify: true,
        vibrate: [500, 200, 500, 200, 800],
        requireInteraction: true,
        data: { url: url || "/panchangam" },
      });
    }, Math.max(0, delayMs || 0));
  } else if (data.type === "show-notification") {
    self.registration.showNotification(data.title || "Muhūrta Alarm", {
      body: data.body || "",
      icon: "/api/static/icons/panchangam.png",
      badge: "/api/static/icons/panchangam.png",
      tag: data.tag || "muhurta-now",
      vibrate: [500, 200, 500, 200, 800],
      requireInteraction: true,
      data: { url: data.url || "/panchangam" },
    });
  } else if (data.type === "skip-waiting") {
    self.skipWaiting();
  }
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || "/panchangam";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const c of clientList) {
        if ("focus" in c) { c.navigate(target).catch(() => {}); return c.focus(); }
      }
      if (self.clients.openWindow) return self.clients.openWindow(target);
    })
  );
});
