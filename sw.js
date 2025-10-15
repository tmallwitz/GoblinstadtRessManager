// Service Worker für Goblinstadt Ressourcen Manager - Fully self-hosted, no CDN dependencies
const CACHE_NAME = 'goblinstadt-cache-v10';
const APP_PREFIX = 'goblinstadt-';

// Liste ALLER Ressourcen, die gecacht werden müssen
const urlsToCache = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json',
  './icon-192x192.png',
  './icon-512x512.png',
  './sw.js',
  // Self-hosted Tailwind CSS
  './assets/vendor/tailwind/tailwind-play.js',
  // Self-hosted Google Fonts
  './assets/vendor/fonts/fonts.css',
  './assets/vendor/fonts/roboto-regular.woff2',
  './assets/vendor/fonts/roboto-bold.woff2',
  './assets/vendor/fonts/cinzel-regular.woff2',
  './assets/vendor/fonts/cinzel-semibold.woff2',
  './assets/vendor/fonts/cinzel-bold.woff2',
  // Self-hosted Font Awesome
  './assets/vendor/font-awesome/css/all.min.css',
  './assets/vendor/font-awesome/webfonts/fa-brands-400.woff2',
  './assets/vendor/font-awesome/webfonts/fa-regular-400.woff2',
  './assets/vendor/font-awesome/webfonts/fa-solid-900.woff2',
  './assets/vendor/font-awesome/webfonts/fa-v4compatibility.woff2',
  // Self-hosted RPG Awesome
  './assets/vendor/rpg-awesome/css/rpgawesome.min.css',
  './assets/vendor/rpg-awesome/fonts/rpgawesome-webfont.woff'
];

// Installation des Service Workers mit sofortiger Aktivierung
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Install');

  // Force activation
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] Pre-caching offline page');

        // Aggressives Caching aller URLs
        return Promise.all(
          urlsToCache.map(url => {
            // Verwende keine-Cache-Anfragen für lokale Ressourcen, normale Anfragen für CDN
            const isExternal = url.startsWith('http');
            const fetchOptions = isExternal ? {} : { cache: 'no-store' };

            return fetch(url, fetchOptions)
              .then(response => {
                // Wenn erfolgreich, zum Cache hinzufügen
                if (response.ok) {
                  return cache.put(url, response);
                }
                console.log('[ServiceWorker] Failed to fetch:', url);
              })
              .catch(error => {
                console.log('[ServiceWorker] Failed to fetch:', url, error);
              });
          })
        );
      })
  );
});

// Aktivierung des Service Workers mit Client-Claim
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activate');

  // Übernimm sofort die Kontrolle über alle Clients
  event.waitUntil(clients.claim());

  // Lösche alte Caches
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key.startsWith(APP_PREFIX) && key !== CACHE_NAME) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
});

// Cache-First-Strategie für alle Ressourcen (100% self-hosted, keine CDN-Abhängigkeit)
self.addEventListener('fetch', (event) => {
  const { request } = event;

  event.respondWith(
    caches.match(request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          console.log('[ServiceWorker] Serving from cache:', request.url);
          return response;
        }

        // Cache miss - return from network and cache
        console.log('[ServiceWorker] Cache miss, fetching from network:', request.url);

        return fetch(request)
          .then((response) => {
            // Return the original response if invalid
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response for caching
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                console.log('[ServiceWorker] Caching new resource:', request.url);
                cache.put(request, responseToCache);
              })
              .catch(error => {
                console.log('[ServiceWorker] Failed to cache:', request.url, error);
              });

            return response;
          })
          .catch(() => {
            // If network fails completely, try to return a fallback
            console.log('[ServiceWorker] Network failed, no fallback for:', request.url);

            // For navigation requests, return the offline page
            if (request.mode === 'navigate') {
              return caches.match('./index.html');
            }

            // Otherwise return error response
            return new Response('Offline mode - resource unavailable', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
});
