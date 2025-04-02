// Service Worker with Offline Caching

const CACHE_NAME = 'snake-game-cache-v1';
const FILES_TO_CACHE = [
  'snake-game.html',
  'snake-pixel-art.png' // Add other essential assets if they become separate files later
];

self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  // Pre-cache assets for offline use
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: Caching app shell');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting(); // Activate worker immediately
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  // Clean up old caches
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('Service Worker: Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  event.waitUntil(clients.claim()); // Take control of pages immediately
});

self.addEventListener('fetch', (event) => {
  console.log('Service Worker: Fetching', event.request.url);
  // Serve from cache first, then network
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        console.log('Service Worker: Serving from cache', event.request.url);
        return response; // Serve from cache
      }
      console.log('Service Worker: Fetching from network', event.request.url);
      return fetch(event.request); // Fetch from network if not in cache
    })
  );
}); 