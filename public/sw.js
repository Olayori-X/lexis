const CACHE_NAME = 'lexis-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/dashboard',
  '/dashboard/new',
  '/auth/login',
  '/auth/signup',
];

// Install — cache app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — serve from cache if offline
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Let API calls pass through — we handle them in the client
  if (request.url.includes('/api/') || request.url.includes('localhost:8080')) {
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      return cached || fetch(request).then((response) => {
        // Cache new pages as they're visited
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        return response;
      });
    }).catch(() => caches.match('/'))
  );
});