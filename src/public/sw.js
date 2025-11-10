// sw.js
// === Service Worker untuk Push Notification (submission lanjutan Dicoding) ===

// Event install (opsional, untuk caching jika diperlukan di masa depan)
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installed');
  self.skipWaiting(); // agar langsung aktif
});

// Event activate (membersihkan cache lama jika nanti ada)
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activated');
  event.waitUntil(clients.claim());
});

// Event push — menangani notifikasi dari server
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push event diterima');

  let notificationData = {};

  // Jika server mengirim payload JSON
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
    icon: './favicon.png', // ganti sesuai ikon yang kamu punya di folder images
    badge: './images/logo.png', // opsional, bisa dihapus jika belum ada
  };

  // Tampilkan notifikasi
  event.waitUntil(self.registration.showNotification(title, options));
});

// Event message — digunakan untuk uji notifikasi manual dari halaman utama
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'TEST_PUSH') {
    const { title, body } = event.data;
    console.log('Pesan test notifikasi diterima dari halaman:', event.data);
    self.registration.showNotification(title, { body });
  }
});

// (Opsional) Event notificationclick — agar bisa membuka halaman tertentu saat notifikasi diklik
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/') // arahkan ke halaman utama
  );
});
