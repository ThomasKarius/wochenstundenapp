const CACHE_NAME = "wochenstunden-pwa-v3";
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
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return (
        cached ||
        fetch(event.request).then((resp) => {
          try {
            const url = new URL(event.request.url);
            if (event.request.method === "GET" && url.origin === self.location.origin) {
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resp.clone()));
            }
          } catch {}
          return resp;
        }).catch(() => caches.match("./index.html"))
      );
    })
  );
});
