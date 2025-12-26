
const CACHE_NAME = 'detektif-bendera-v5-core';
const ASSET_CACHE = 'detektif-bendera-v5-assets';

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
  // Paksa SW baru untuk segera menggantikan yang lama (langsung masuk fase activate)
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
    }).then(() => {
      // Segera kontrol semua klien yang terbuka tanpa perlu reload manual
      return self.clients.claim();
    })
  );
});

// Helper: Cek validitas response
const isValidResponse = (response) => {
  return response && response.status === 200 && (response.type === 'basic' || response.type === 'cors');
};

// Fetch Handler
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // 1. HTML / ROOT STRATEGY: NETWORK FIRST, FALLBACK CACHE
  // Ini kunci Auto Update: Selalu coba ambil index.html terbaru dari server.
  // Jika index.html berubah (karena ada deploy baru), browser akan memuat JS/CSS baru.
  if (event.request.mode === 'navigate' || url.pathname.endsWith('index.html') || url.pathname === '/') {
    event.respondWith(
      fetch(event.request)
        .then(networkResponse => {
          return caches.open(CACHE_NAME).then(cache => {
             cache.put(event.request, networkResponse.clone());
             return networkResponse;
          });
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
    return;
  }

  // 2. ASSET STRATEGY: CACHE FIRST, FALLBACK NETWORK
  // Untuk gambar bendera, suara, font, dll. Performa maksimal.
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

  // 3. JS/CSS BUNDLE STRATEGY: STALE-WHILE-REVALIDATE
  // Ambil dari cache dulu biar cepat, tapi update cache di background untuk reload berikutnya.
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
