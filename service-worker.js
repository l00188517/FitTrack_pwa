const CACHE_NAME = 'fitlife-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './styles/main.css', // Assuming you have a main CSS file
  './app.js',   // Assuming your main JS file
  './icons/icon-192x192.png',
  './icons/icon-512x512.png',
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
        // Cache hit - return response
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
            // Delete old caches
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// For more advanced caching strategies (e.g., Network falling back to Cache, Cache falling back to Network)
// you would implement more complex logic within the fetch event listener.
// For data synchronization (e.g., submitting fitness logs offline and syncing later),
// you would use Background Sync API (via service worker).