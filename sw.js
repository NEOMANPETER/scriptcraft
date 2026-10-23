// ScriptCraft service worker — makes the app open and work with no internet.
// Everything the app needs (including PDF export, which is built into index.html)
// is cached on the first visit. Your scripts live in the browser's own storage,
// not in this cache.
const CACHE = 'scriptcraft-v3-4-0';
const SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-32.png',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/maskable-192.png',
  './icons/maskable-512.png',
  './icons/mark-128.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => Promise.all(SHELL.map((url) => cache.add(url).catch(() => null))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(names.filter((n) => n !== CACHE).map((n) => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;
  const isFont = /(^|\.)fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  // Leave everything else (e.g. AI storyboard images) to the network.
  if (!sameOrigin && !isFont) return;

  // Network first so updates arrive quickly; cache is the offline fallback.
  event.respondWith(
    // 'no-cache' makes the browser re-check with the server, so new uploads show up
    // straight away instead of after GitHub's ~10 minute page cache.
    fetch(req, sameOrigin ? { cache: 'no-cache' } : undefined)
      .then((res) => {
        if (res && (res.ok || res.type === 'opaque')) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      })
      .catch(() =>
        caches.match(req).then((hit) =>
          hit || (req.mode === 'navigate' ? caches.match('./index.html') : null) || Response.error()
        )
      )
  );
});
