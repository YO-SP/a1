import '../styles/styles.css';
import App from './pages/app';
import registerServiceWorker from './utils/sw-register.js'; // ⬅️ Tambahan

document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('authToken');

 
  if (token) {
    if (!window.location.hash || window.location.hash === '#/masukAtauDaftar') {
      window.location.hash = '/';
    }
  } else {
    window.location.hash = '/masukAtauDaftar';
  }

  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
  });

  await app.renderPage();
  window.addEventListener('hashchange', async () => {
    await app.renderPage();
  });
});

// === Tambahan aman untuk Push Notification ===
registerServiceWorker();

// === Meminta izin notifikasi dari user ===
if ('Notification' in window && 'serviceWorker' in navigator) {
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      console.log('Izin notifikasi diberikan ✅');
    } else if (permission === 'denied') {
      console.warn('Izin notifikasi ditolak 🚫');
    } else {
      console.log('Izin notifikasi belum dipilih ⚠️');
    }
  });
}
