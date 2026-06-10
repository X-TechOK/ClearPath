/* ─────────────────────────────────────────────────────────────
   ClearPath · service worker
   Purpose: make the app installable + offline-capable.
   Strategy: network-first for HTML (always try to ship updates),
             cache-first for fonts + CSS (stable, big, slow).
   To force-update beta testers: bump CACHE_VERSION below.
───────────────────────────────────────────────────────────── */

const CACHE_VERSION = 'v0.6.9';
const CACHE_NAME    = `clearpath-${CACHE_VERSION}`;

// Files that should be pre-cached so the app loads offline immediately.
const PRECACHE_URLS = [
  './',
  './index.html',
  './paper-ink.css',
  './manifest.webmanifest',
];

/* INSTALL — pre-cache the app shell. */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

/* ACTIVATE — delete any old caches from previous versions. */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k.startsWith('clearpath-') && k !== CACHE_NAME)
            .map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

/* FETCH — choose strategy by request type. */
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Network-first for the HTML document (index.html, "/" navigation).
  // This guarantees beta users get the latest UI when online.
  if (req.mode === 'navigate' || req.destination === 'document') {
    event.respondWith(
      fetch(req)
        .then((resp) => {
          const copy = resp.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, copy));
          return resp;
        })
        .catch(() => caches.match(req).then((cached) => cached || caches.match('./index.html')))
    );
    return;
  }

  // Cache-first for everything else (fonts, CSS, JSON, etc.).
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((resp) => {
        // Only cache same-origin or cross-origin responses we successfully fetched.
        if (resp && resp.status === 200) {
          const copy = resp.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, copy));
        }
        return resp;
      }).catch(() => cached);
    })
  );
});

/* MESSAGE — allow the page to ask us to update immediately. */
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') self.skipWaiting();
});
