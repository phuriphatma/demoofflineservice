const CACHE_NAME = "version-5"
const urlsToCache = ['index.html']

const self = this

// Install Service Worker
self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('install ' + CACHE_NAME);
                return cache.addAll(urlsToCache);
            })
    );
})
// Activate Service Worker
// Activate Service Worker
self.addEventListener('activate', (event) => {
    console.log('activate ' + CACHE_NAME);
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => Promise.all(
            cacheNames.map((cacheName) => {
                if (!cacheWhitelist.includes(cacheName)) {
                    return caches.delete(cacheName);
                }
            })
        ))
    );
});

self.addEventListener('fetch', event => {
    if (event.request.method != 'GET') return;
    event.respondWith(
        (async function () {
            const cache = await caches.open(CACHE_NAME);
            const cached = await cache.match(event.request);
            if (cached) {
                return cached;
            }
            try {
                return await fetch(event.request);
            } catch (error) {
                // Return a basic offline response
                return new Response('<h1>Offline</h1><p>The requested page is not available offline.</p>', {
                    headers: { 'Content-Type': 'text/html' }
                });
            }
        })()
    );
});