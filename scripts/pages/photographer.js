
const folderMap = {
    243: 'Mimi',
    930: 'Ellie Rose',
    82: 'Tracy',
    527: 'Nabeel',
    925: 'Rhode',
    195: 'Marcel',
  };
  
function getPhotographerId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
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
  
    nameElem.textContent = photographer.name;
    locationElem.textContent = `${photographer.city}, ${photographer.country}`;
    taglineElem.textContent = photographer.tagline;
  
    const folderName = folderMap[photographer.id]; // <-- Utilise le mapping ID->dossier
    const img = document.createElement('img');
    img.setAttribute('src', `assets/images/${folderName}/${photographer.portrait}`);
    img.setAttribute('alt', photographer.name);
    portraitContainer.appendChild(img);
  }
  
  function displayMediaGallery(mediaItems, photographerId) {
    const gallery = document.querySelector('.media-gallery');
    gallery.innerHTML = '';
  
    mediaItems.forEach((media) => {
      const mediaEl = mediaFactory(media, photographerId);
      gallery.appendChild(mediaEl);
    });
  }
  
  async function initPhotographer() {
    const photographerId = parseInt(getPhotographerId(), 10);
    const { photographers, media } = await getData();
  
    const photographer = photographers.find((p) => p.id === photographerId);
    if (!photographer) {
      console.error('Photographe introuvable pour ID :', photographerId);
      return;
    }
  
    displayPhotographerHeader(photographer);
  
    const photographerMedia = media.filter((m) => m.photographerId === photographerId);
    displayMediaGallery(photographerMedia, photographerId);
  }
  
  initPhotographer();
  