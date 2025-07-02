const CACHE_NAME = 'nutritrack-cache-v1'; // Renamed cache for this app
const urlsToCache = [
  './',
  './index.html',
  './styles/main.css',
  './app.js',
  './manifest.json', // It's good practice to cache the manifest as well
  './icons/icon-192x192.png',
  './icons/icon-512x512.png',
  './favicon.ico'
  // Add other critical assets (images, fonts, etc.) that make up your app shell
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});