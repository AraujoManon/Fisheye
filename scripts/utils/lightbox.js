(() => {
  // Mapping des dossiers par ID photographe
  const folderMap = {
    243: "Mimi",
    930: "Ellie Rose",
    82: "Tracy",
    527: "Nabeel",
    925: "Rhode",
    195: "Marcel",
  };

  // Crée l'élément média (image ou vidéo) et sa description
  function mediaFactory(media, photographerId, index) {
    const folderName = folderMap[photographerId] || "Unknown";
    let mediaElement = media.image
      ? Object.assign(document.createElement("img"), {
          src: `assets/images/${folderName}/${media.image}`,
          alt: media.title,
        })
      : (() => {
          const vid = document.createElement("video");
          vid.controls = true;
          const source = document.createElement("source");
          source.src = `assets/images/${folderName}/${media.video}`;
          source.type = "video/mp4";
          vid.appendChild(source);
          vid.setAttribute("aria-label", media.title);
          return vid;
        })();

    const titleElem = document.createElement("p");
    titleElem.className = "media-title";
    titleElem.textContent = media.title;

    const likesElem = document.createElement("span");
    likesElem.className = "media-likes";
    likesElem.textContent = media.likes;

    const heartIcon = Object.assign(document.createElement("img"), {
      src: "assets/icons/heart.png",
      alt: "likes",
      style: "width:15px;cursor:pointer",
    });

    let hasLiked = false;
    heartIcon.addEventListener("click", () => {
      if (!hasLiked) {
        media.likes++;
        likesElem.textContent = media.likes;
        hasLiked = true;
        if (typeof window.updateTotalLikes === "function")
          window.updateTotalLikes();
      }
    });

    const likesContainer = document.createElement("div");
    likesContainer.className = "likes-container";
    likesContainer.append(likesElem, heartIcon);

    const descDiv = document.createElement("div");
    descDiv.className = "media-description";
    descDiv.append(titleElem, likesContainer);

    mediaElement.addEventListener("click", () => openLightbox(index));

    const mediaContainer = document.createElement("div");
    mediaContainer.className = "media-item";
    mediaContainer.append(mediaElement, descDiv);
    return mediaContainer;
  }

  // Ouvre la lightbox et affiche le média sélectionné
  function openLightbox(index) {
    const lightboxModal = document.getElementById("lightbox-modal");
    lightboxModal.style.display = "block";
    lightboxModal.classList.remove("hidden");
    lightboxModal.setAttribute("aria-hidden", "false");
    document.body.setAttribute("aria-hidden", "true");
    window.currentIndex = index;
    displayLightboxMedia(index);
    const closeButton = document.querySelector(".lightbox-close");
    if (closeButton) closeButton.focus();
  }

  // Ferme la lightbox
  function closeLightbox() {
    const lightboxModal = document.getElementById("lightbox-modal");
    lightboxModal.style.display = "none";
    lightboxModal.setAttribute("aria-hidden", "true");
    document.body.setAttribute("aria-hidden", "false");
  }

  // Affiche le média dans la lightbox
  function displayLightboxMedia(index) {
    const media = window.currentMediaList[index];
    if (!media) return;
    const folderName = folderMap[media.photographerId] || "Unknown";
    const container = document.querySelector(".lightbox-media-container");
    const title = document.querySelector(".lightbox-media-title");
    container.innerHTML = "";
    title.textContent = media.title;
    if (media.image) {
      const img = document.createElement("img");
      img.src = `assets/images/${folderName}/${media.image}`;
      img.alt = media.title;
      container.append(img);
    } else if (media.video) {
      const video = document.createElement("video");
      video.controls = true;
      const source = document.createElement("source");
      source.src = `assets/images/${folderName}/${media.video}`;
      source.type = "video/mp4";
      video.append(source);
      container.append(video);
    }
  }

  // Affiche le média suivant
  function nextMedia() {
    window.currentIndex =
      window.currentIndex < window.currentMediaList.length - 1
        ? window.currentIndex + 1
        : 0;
    displayLightboxMedia(window.currentIndex);
  }

  // Affiche le média précédent
  function prevMedia() {
    window.currentIndex =
      window.currentIndex > 0
        ? window.currentIndex - 1
        : window.currentMediaList.length - 1;
    displayLightboxMedia(window.currentIndex);
  }

  document.addEventListener("DOMContentLoaded", () => {
    const closeBtn = document.querySelector(".lightbox-close");
    const nextBtn = document.querySelector(".lightbox-next");
    const prevBtn = document.querySelector(".lightbox-prev");
    if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
    if (nextBtn) nextBtn.addEventListener("click", nextMedia);
    if (prevBtn) prevBtn.addEventListener("click", prevMedia);
    document.addEventListener("keydown", (e) => {
      const lightboxModal = document.getElementById("lightbox-modal");
      if (lightboxModal.style.display !== "block") return;
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowRight") nextMedia();
      else if (e.key === "ArrowLeft") prevMedia();
    });
  });

  // Rendre les fonctions accessibles globalement
  window.mediaFactory = mediaFactory;
  window.openLightbox = openLightbox;
  window.closeLightbox = closeLightbox;
  window.displayLightboxMedia = displayLightboxMedia;
  window.nextMedia = nextMedia;
  window.prevMedia = prevMedia;
})();
