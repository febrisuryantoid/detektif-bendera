
const CACHE_NAME = 'detektif-bendera-v4-core';
const ASSET_CACHE = 'detektif-bendera-v4-assets';

// DAFTAR ASET WAJIB (CORE ASSETS)
const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&family=Titan+One&display=swap',
  'https://yzpezhqxhmkgyskvklge.supabase.co/storage/v1/object/public/images/icon.png'
];

// Install Handler
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(PRECACHE_URLS);
      })
  );
});

// Activate Handler
self.addEventListener('activate', event => {
  const currentCaches = [CACHE_NAME, ASSET_CACHE];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!currentCaches.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Helper: Cek validitas response
const isValidResponse = (response) => {
  return response && response.status === 200 && (response.type === 'basic' || response.type === 'cors');
};

// Fetch Handler
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // 1. ASSET STRATEGY: CACHE FIRST, FALLBACK NETWORK
  // Untuk gambar bendera, suara, dan font, kita ingin performa maksimal.
  // Jika ada di cache, pakai cache. Jika tidak, download lalu simpan.
  if (
    url.hostname.includes('flagcdn.com') || 
    url.hostname.includes('flaticon.com') || 
    url.hostname.includes('gstatic.com') ||
    url.hostname.includes('supabase.co') ||
    event.request.destination === 'image' ||
    event.request.destination === 'font' ||
    event.request.destination === 'audio'
  ) {
    event.respondWith(
      caches.open(ASSET_CACHE).then(cache => {
        return cache.match(event.request).then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(event.request).then(networkResponse => {
            if (isValidResponse(networkResponse)) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          });
        });
      })
    );
    return;
  }

  // 2. CORE STRATEGY: STALE-WHILE-REVALIDATE
  // Untuk HTML, JS bundle app.
  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(cachedResponse => {
        const fetchPromise = fetch(event.request).then(networkResponse => {
          if (isValidResponse(networkResponse)) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => {
          // Network gagal
        });
        return cachedResponse || fetchPromise;
      });
    })
  );
});
