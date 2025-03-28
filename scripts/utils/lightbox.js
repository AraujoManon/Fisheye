// scripts/utils/lightbox.js

function mediaFactory(media, photographerId) {
  const mediaContainer = document.createElement('div');
  mediaContainer.classList.add('media-item');

  // Récupère le dossier correspondant
  const folderName = folderMap[photographerId];

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

  // Titre
  const titleElem = document.createElement('p');
  titleElem.classList.add('media-title');
  titleElem.textContent = media.title;

  // Likes
  const likesElem = document.createElement('span');
  likesElem.classList.add('media-likes');
  likesElem.textContent = media.likes;

  // Clic => openLightbox
  mediaElement.addEventListener('click', () => {
    openLightbox(media, folderName);
  });

  mediaContainer.appendChild(mediaElement);
  mediaContainer.appendChild(titleElem);
  mediaContainer.appendChild(likesElem);

  return mediaContainer;
}

function openLightbox(media, folderName) {
  console.log('Ouverture lightbox pour :', media);
  // À compléter (création d'une modale, navigation, etc.)
}
