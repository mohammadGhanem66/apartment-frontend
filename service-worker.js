const CACHE_NAME = 'dashboard-cache-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/bracket.css',
  '/js/dashboard.js',
  '/js/bracket.js',
  '/img/logo.png',
  '/building.html',
  '/apartment-create.html',
  // Add more files to cache
];

// Install the service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch cached assets
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});
