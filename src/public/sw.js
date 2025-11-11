// sw.js
// === Service Worker untuk PWA + Push Notification + Offline Support ===

const CACHE_NAME = 'pt1-cache-v3';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './192.png',
  './512.png',
  './style.css',
  './app.css',
  './app.bundle.js',
  './index.js',
];

// === INSTALL ===
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching app shell...');
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// === ACTIVATE ===
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activated');
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', name);
            return caches.delete(name);
          }
        })
      )
    )
  );
  return self.clients.claim();
});

// === FETCH (offline fallback) ===
self.addEventListener('fetch', (event) => {
  // Lewati permintaan API agar tidak meng-cache data dari jaringan
  if (event.request.url.includes('https://story-api.dicoding.dev')) {
    return;
  }

  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((response) => {
      if (response) {
        // file ada di cache
        return response;
      }

      // jika tidak ada di cache, ambil dari jaringan
      return fetch(event.request)
        .then((networkResponse) => {
          // cache-kan file baru yang berhasil diambil
          return caches.open(CACHE_NAME).then((cache) => {
            // Jangan cache permintaan ke eksternal (misal CDN, API)
            if (
              event.request.url.startsWith(self.location.origin)
            ) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          });
        })
        .catch(() => {
          // fallback jika offline dan halaman navigasi
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
    })
  );
});

// === PUSH ===
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push event diterima');

  let notificationData = {};
  if (event.data) {
    try {
      notificationData = event.data.json();
    } catch (e) {
      notificationData = { title: 'Cerita Baru!', body: event.data.text() };
    }
  }

  const title = notificationData.title || 'Story App';
  const options = {
    body: notificationData.body || 'Ada cerita baru yang ditambahkan!',
    icon: '/192.png',
    badge: '/512.png',
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// === CLICK NOTIFICATION ===
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow('/'));
});

// === TEST NOTIFICATION (manual trigger dari halaman utama) ===
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'TEST_PUSH') {
    const { title, body } = event.data;
    console.log('[Service Worker] Test push diterima:', event.data);
    self.registration.showNotification(title, { body });
  }
});
