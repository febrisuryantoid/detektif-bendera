
const CACHE_NAME = 'detektif-bendera-v3-offline';
const RUNTIME_CACHE = 'detektif-bendera-runtime-v3';

// DAFTAR ASET WAJIB (CORE ASSETS)
// Ini akan didownload SAAT INSTALASI. Jika salah satu gagal, install gagal.
const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.json',
  // External Libraries (PENTING untuk Offline)
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&family=Titan+One&display=swap',
  // App Icon (External Supabase)
  'https://yzpezhqxhmkgyskvklge.supabase.co/storage/v1/object/public/images/icon.png'
];

// Install Handler
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Precaching Core Assets');
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate Handler (Cleanup Cache Lama)
self.addEventListener('activate', event => {
  const currentCaches = [CACHE_NAME, RUNTIME_CACHE];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!currentCaches.includes(cacheName)) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Helper: Cek apakah request valid untuk di-cache
const isValidResponse = (response) => {
  return response && response.status === 200 && response.type === 'basic' || response.type === 'cors';
};

// Fetch Handler
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // 1. STRATEGI UNTUK GAMBAR (BENDERA & IKON) & FONT FILES
  // Cache First -> Network -> Save to Cache
  if (
    url.hostname.includes('flagcdn.com') || 
    url.hostname.includes('flaticon.com') || 
    url.hostname.includes('gstatic.com') ||
    url.hostname.includes('supabase.co') ||
    event.request.destination === 'image' ||
    event.request.destination === 'font'
  ) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then(response => {
          if (isValidResponse(response)) {
            const clone = response.clone();
            caches.open(RUNTIME_CACHE).then(cache => cache.put(event.request, clone));
          }
          return response;
        }).catch(() => {
          // Fallback image jika offline dan belum tercache (opsional, bisa return SVG kosong)
          return new Response('<svg>...</svg>', { headers: { 'Content-Type': 'image/svg+xml' }});
        });
      })
    );
    return;
  }

  // 2. STRATEGI UNTUK APP SHELL (HTML, JS, JSON)
  // Stale-While-Revalidate: Pakai cache dulu agar cepat, lalu update cache di background
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      const fetchPromise = fetch(event.request).then(networkResponse => {
        if (isValidResponse(networkResponse)) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return networkResponse;
      }).catch(err => {
        console.log('[Service Worker] Network fetch failed, using cache only');
      });

      return cachedResponse || fetchPromise;
    })
  );
});