// scripts/pages/photographer.js

let currentMediaList = [];
let currentIndex = 0; // Pour la lightbox

// Mapping ID -> Nom de dossier (adapter à vos besoins)
const folderMap = {
  243: 'Mimi',
  930: 'Ellie Rose',
  82: 'Tracy',
  527: 'Nabeel',
  925: 'Rhode',
  195: 'Marcel'
};

function getPhotographerId() {
  const params = new URLSearchParams(window.location.search);
  return parseInt(params.get('id'), 10);
}

async function getData() {
  try {
    const response = await fetch('data/photographers.json');
    const data = await response.json();
    return data; // { photographers: [...], media: [...] }
  } catch (error) {
    console.error('Erreur JSON:', error);
    return { photographers: [], media: [] };
  }
}

function displayPhotographerHeader(photographer) {
  const nameElem = document.getElementById('photographer-name');
  const locationElem = document.getElementById('photographer-location');
  const taglineElem = document.getElementById('photographer-tagline');
  const portraitContainer = document.getElementById('photographer-portrait');
  const dailyPriceElem = document.getElementById('daily-price');

  nameElem.textContent = photographer.name;
  locationElem.textContent = `${photographer.city}, ${photographer.country}`;
  taglineElem.textContent = photographer.tagline;
  dailyPriceElem.textContent = `${photographer.price}€ / jour`;

  const folderName = folderMap[photographer.id] || 'Unknown';
  const img = document.createElement('img');
  img.setAttribute('src', `assets/photographers/${photographer.portrait}`);
  img.setAttribute('alt', `${photographer.name}`);
  portraitContainer.appendChild(img);
}

function updateTotalLikes() {
  const totalLikesElem = document.getElementById('total-likes');
  const total = currentMediaList.reduce((acc, media) => acc + media.likes, 0);
  totalLikesElem.textContent = total;
}

function displayMediaGallery(mediaItems, photographerId) {
  const gallery = document.querySelector('.media-gallery');
  gallery.innerHTML = '';

  mediaItems.forEach((media, index) => {
    const mediaEl = mediaFactory(media, photographerId, index);
    gallery.appendChild(mediaEl);
  });

  // Met à jour le total des likes
  updateTotalLikes();
}

function sortMediaList(criteria) {
  if (criteria === 'popularity') {
    currentMediaList.sort((a, b) => b.likes - a.likes);
  } else if (criteria === 'title') {
    currentMediaList.sort((a, b) => a.title.localeCompare(b.title));
  }
}

async function initPhotographer() {
  const photographerId = getPhotographerId();
  const { photographers, media } = await getData();

  const photographer = photographers.find((p) => p.id === photographerId);
  if (!photographer) {
    console.error('Photographe introuvable pour ID :', photographerId);
    return;
  }

  displayPhotographerHeader(photographer);

  // Filtre les médias pour ce photographe
  currentMediaList = media.filter((m) => m.photographerId === photographerId);

  // Tri par défaut : popularité
  sortMediaList('popularity');
  displayMediaGallery(currentMediaList, photographerId);

  // Gère le changement de tri
  const sortSelect = document.getElementById('sort-select');
  sortSelect.addEventListener('change', (e) => {
    sortMediaList(e.target.value);
    displayMediaGallery(currentMediaList, photographerId);
  });
}

initPhotographer();
