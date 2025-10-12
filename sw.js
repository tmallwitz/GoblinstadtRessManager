// Service Worker für Goblinstadt Ressourcen Manager - iOS optimiert mit CDN Support
const CACHE_NAME = 'goblinstadt-cache-v4';
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
  // CDN Ressourcen
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/rpg-awesome/0.2.0/css/rpg-awesome.min.css',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&display=swap'
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

// Hybride Strategie: Cache-First für lokale, Network-First mit Cache-Fallback für CDN
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Für externe CDN-Ressourcen: Network-First mit Cache-Fallback
  if (url.origin !== location.origin) {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Wenn erfolgreich, Cache aktualisieren
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Bei Netzwerkfehler: Aus Cache servieren
          return caches.match(request)
            .then(cachedResponse => {
              if (cachedResponse) {
                console.log('[ServiceWorker] Serving CDN resource from cache:', request.url);
                return cachedResponse;
              }
              // Fallback für nicht gecachte externe Ressourcen
              return new Response('CDN resource unavailable offline', {
                status: 503,
                statusText: 'Service Unavailable',
                headers: new Headers({
                  'Content-Type': 'text/plain'
                })
              });
            });
        })
    );
    return;
  }

  // Für lokale App-Ressourcen: Aggressive Cache-First-Strategie
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
