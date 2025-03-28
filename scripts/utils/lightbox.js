// scripts/utils/lightbox.js

// On suppose que 'currentMediaList' et 'currentIndex' sont gérés dans photographer.js
// On y accède via window ou on les redéfinit en variable globale si besoin.

function mediaFactory(media, photographerId, index) {
  const mediaContainer = document.createElement('div');
  mediaContainer.classList.add('media-item');

  // Récupère le dossier correspondant
  const folderMap = {
    243: 'Mimi',
    930: 'Ellie Rose',
    82: 'Tracy',
    527: 'Nabeel',
    925: 'Rhode',
    195: 'Marcel'
  };
  const folderName = folderMap[photographerId] || 'Unknown';

  let mediaElement;
  if (media.image) {
    mediaElement = document.createElement('img');
    mediaElement.setAttribute('src', `assets/images/${folderName}/${media.image}`);
    mediaElement.setAttribute('alt', media.title);
  } else if (media.video) {
    mediaElement = document.createElement('video');
    mediaElement.setAttribute('controls', 'true');
    const source = document.createElement('source');
    source.setAttribute('src', `assets/images/${folderName}/${media.video}`);
    source.setAttribute('type', 'video/mp4');
    mediaElement.appendChild(source);
    mediaElement.setAttribute('aria-label', media.title);
  }

  // Description (titre + likes)
  const descriptionDiv = document.createElement('div');
  descriptionDiv.classList.add('media-description');

  const titleElem = document.createElement('p');
  titleElem.classList.add('media-title');
  titleElem.textContent = media.title;

  // Likes
  const likesContainer = document.createElement('div');
  likesContainer.classList.add('likes-container');

  const likesElem = document.createElement('span');
  likesElem.classList.add('media-likes');
  likesElem.textContent = media.likes;

  const heartIcon = document.createElement('img');
  heartIcon.src = 'assets/icons/heart.png';
  heartIcon.alt = 'likes';
  heartIcon.style.width = '15px';
  heartIcon.style.cursor = 'pointer';

  // Incrémentation du like au clic (une seule fois par session)
  let hasLiked = false;
  heartIcon.addEventListener('click', () => {
    if (!hasLiked) {
      media.likes += 1;
      likesElem.textContent = media.likes;
      hasLiked = true;
      // Met à jour le total
      if (typeof updateTotalLikes === 'function') {
        updateTotalLikes();
      }
    }
  });

  likesContainer.appendChild(likesElem);
  likesContainer.appendChild(heartIcon);

  descriptionDiv.appendChild(titleElem);
  descriptionDiv.appendChild(likesContainer);

  // Clic sur le média => openLightbox
  mediaElement.addEventListener('click', () => {
    openLightbox(index);
  });

  mediaContainer.appendChild(mediaElement);
  mediaContainer.appendChild(descriptionDiv);

  return mediaContainer;
}

/* ================= LIGHTBOX ================== */
function openLightbox(index) {
  const lightboxModal = document.getElementById('lightbox-modal');
  lightboxModal.style.display = 'block';
  lightboxModal.setAttribute('aria-hidden', 'false');
  document.body.setAttribute('aria-hidden', 'true');

  window.currentIndex = index;
  displayLightboxMedia(index);

  // Focus sur le bouton close pour l’accessibilité
  const closeButton = document.querySelector('.lightbox-close');
  if (closeButton) {
    closeButton.focus();
  }
}

function closeLightbox() {
  const lightboxModal = document.getElementById('lightbox-modal');
  lightboxModal.style.display = 'none';
  lightboxModal.setAttribute('aria-hidden', 'true');
  document.body.setAttribute('aria-hidden', 'false');
}

function displayLightboxMedia(index) {
  // Récupère la liste depuis photographer.js (si globale)
  const media = window.currentMediaList[index];
  if (!media) return;

  const folderMap = {
    243: 'Mimi',
    930: 'Ellie Rose',
    82: 'Tracy',
    527: 'Nabeel',
    925: 'Rhode',
    195: 'Marcel'
  };
  const photographerId = media.photographerId;
  const folderName = folderMap[photographerId] || 'Unknown';

  const mediaContainer = document.querySelector('.lightbox-media-container');
  const mediaTitle = document.querySelector('.lightbox-media-title');

  mediaContainer.innerHTML = '';
  mediaTitle.textContent = media.title;

  if (media.image) {
    const img = document.createElement('img');
    img.src = `assets/images/${folderName}/${media.image}`;
    img.alt = media.title;
    mediaContainer.appendChild(img);
  } else if (media.video) {
    const video = document.createElement('video');
    video.setAttribute('controls', 'true');
    const source = document.createElement('source');
    source.src = `assets/images/${folderName}/${media.video}`;
    source.type = 'video/mp4';
    video.appendChild(source);
    mediaContainer.appendChild(video);
  }
}

/* ================= NAVIGATION LIGHTBOX ================== */
function nextMedia() {
  if (window.currentIndex < window.currentMediaList.length - 1) {
    window.currentIndex++;
  } else {
    window.currentIndex = 0; // boucle
  }
  displayLightboxMedia(window.currentIndex);
}

function prevMedia() {
  if (window.currentIndex > 0) {
    window.currentIndex--;
  } else {
    window.currentIndex = window.currentMediaList.length - 1; // boucle
  }
  displayLightboxMedia(window.currentIndex);
}

/* ================= EVENT LISTENERS ================== */
document.addEventListener('DOMContentLoaded', () => {
  const closeBtn = document.querySelector('.lightbox-close');
  const nextBtn = document.querySelector('.lightbox-next');
  const prevBtn = document.querySelector('.lightbox-prev');

  if (closeBtn) {
    closeBtn.addEventListener('click', closeLightbox);
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', nextMedia);
  }
  if (prevBtn) {
    prevBtn.addEventListener('click', prevMedia);
  }

  // Navigation au clavier
  document.addEventListener('keydown', (e) => {
    const lightboxModal = document.getElementById('lightbox-modal');
    const isLightboxOpen = lightboxModal.style.display === 'block';

    if (!isLightboxOpen) return;

    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      nextMedia();
    } else if (e.key === 'ArrowLeft') {
      prevMedia();
    }
  });
});
