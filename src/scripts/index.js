import '../styles/styles.css';
import App from './pages/app';

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

