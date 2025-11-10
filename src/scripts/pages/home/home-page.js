import Api from '../../data/api';
import { showFormattedDate } from '../../utils';

class HomePage {
  async render() {
    return `
       <section class="home-page container">
      <div>
        <h1>Beranda</h1>
        <h2>Daftar Cerita</h2>
        <div id="storiesContainer"></div>
      </div>

      <aside>
        <h2>Peta Cerita</h2>
        <div id="map" style="height: 500px;"></div>
      </aside>
    </section>
    `;
  }

  async afterRender() {
    const container = document.querySelector('#storiesContainer');
    const mapContainer = document.querySelector('#map');

    const stories = await Api.getStories(true);
    container.innerHTML = '';

    if (stories.error) {
      container.innerHTML = `<p>${stories.message}</p>`;
      return;
    }

    stories.listStory.forEach((story) => {
      container.innerHTML += `
        <article>
          <h3>${story.name}</h3>
          <p>${story.description}</p>
          <p><small>Dibuat pada: ${showFormattedDate(story.createdAt)}</small></p>
          <img src="${story.photoUrl}" alt="Foto ${story.name}" width="200">
        </article>
      `;
    });

    this.showMap(stories.listStory);

    document.querySelector('#addStoryForm').addEventListener('submit', async (e) => {
      e.preventDefault();

      const description = document.querySelector('#description').value;
      const photo = document.querySelector('#photo').files[0];
      const lat = document.querySelector('#lat').value;
      const lon = document.querySelector('#lon').value;

      const result = await Api.addStory({ description, photo, lat, lon });

      if (!result.error) {
        alert('Cerita berhasil ditambahkan!');
        window.location.reload();
      } else {
        alert(result.message);
      }
    });
  }

  showMap(stories) {
    const map = L.map('map').setView([0, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    stories.forEach((story) => {
      if (story.lat && story.lon) {
        const marker = L.marker([story.lat, story.lon]).addTo(map);
        marker.bindPopup(`<b>${story.name}</b><br>${story.description}`);
      }
    });
  }
}

export default HomePage;


