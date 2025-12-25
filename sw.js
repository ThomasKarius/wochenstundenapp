// Minimal Service Worker for offline support
const CACHE_NAME = "wochenstunden-pwa-v2";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./sw.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k === CACHE_NAME ? null : caches.delete(k))))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  event.respondWith(
    caches.match(req).then((cached) => {
      return (
        cached ||
        fetch(req)
          .then((resp) => {
            try {
              const url = new URL(req.url);
              if (req.method === "GET" && url.origin === self.location.origin) {
                caches.open(CACHE_NAME).then((cache) => cache.put(req, resp.clone()));
              }
            } catch {}
            return resp;
          })
          .catch(() => caches.match("./index.html"))
      );
    })
  );
});
