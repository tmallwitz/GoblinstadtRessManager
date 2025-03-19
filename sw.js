// Service Worker für Goblinstadt Ressourcen Manager - iOS optimiert
const CACHE_NAME = 'goblinstadt-cache-v3';
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
  './sw.js'
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
            // Verwende keine-Cache-Anfragen, um frische Kopien zu erhalten
            return fetch(url, { cache: 'no-store' })
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

// Aggressive Cache-First-Strategie für alle Ressourcen
self.addEventListener('fetch', (event) => {
  console.log('[ServiceWorker] Fetch', event.request.url);
  
  // Verwende eine Cache-First-Strategie für alle Ressourcen
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          console.log('[ServiceWorker] Serving from cache:', event.request.url);
          return response;
        }
        
        // Cache miss - return from network and cache
        console.log('[ServiceWorker] Cache miss, fetching from network:', event.request.url);
        
        return fetch(event.request)
          .then((response) => {
            // Return the original response if invalid
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response for caching
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then((cache) => {
                console.log('[ServiceWorker] Caching new resource:', event.request.url);
                cache.put(event.request, responseToCache);
              })
              .catch(error => {
                console.log('[ServiceWorker] Failed to cache:', event.request.url, error);
              });
              
            return response;
          })
          .catch(() => {
            // If network fails completely, try to return a fallback
            console.log('[ServiceWorker] Network failed, no fallback for:', event.request.url);
            
            // For navigation requests, return the offline page
            if (event.request.mode === 'navigate') {
              return caches.match('./index.html');
            }
            
            // Otherwise return nothing (will cause error, but that's expected in offline mode)
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