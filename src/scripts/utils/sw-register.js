// === utils/sw-register.js ===
// Registrasi Service Worker dan Notifikasi (submission lanjutan Dicoding)

const registerServiceWorker = async () => {
  if (!('serviceWorker' in navigator)) {
    console.log('Browser tidak mendukung Service Worker');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register('./sw.js');
    console.log('Service Worker terdaftar:', registration);

    // Setelah terdaftar, minta izin notifikasi
    requestNotificationPermission();
  } catch (error) {
    console.error('Gagal mendaftarkan Service Worker:', error);
  }
};

const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('Browser tidak mendukung notifikasi.');
    return;
  }

  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    console.log('Izin notifikasi diberikan.');
  } else {
    console.log('Izin notifikasi ditolak.');
  }
};

export default registerServiceWorker;
