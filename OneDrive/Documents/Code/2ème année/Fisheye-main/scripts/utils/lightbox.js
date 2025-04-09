// Mappage des dossiers pour chaque photographe
const folderMap = {
  243: "Mimi",
  930: "Ellie Rose",
  82: "Tracy",
  527: "Nabeel",
  925: "Rhode",
  195: "Marcel",
};

//  Crée un élément média (image ou vidéo)* @param {Object} media - L'objet media* @param {Number} photographerId - L'ID du photographe* @param {Number} index - L'index du média* @returns {HTMLElement} - Elément contenant le média
export function mediaFactory(media, photographerId, index) {
  const folderName = folderMap[photographerId] || "Unknown";
  const container = document.createElement("div");
  container.className = "media-item";

  const mediaEl = media.image
    ? Object.assign(document.createElement("img"), {
        src: `assets/images/${folderName}/${media.image}`,
        alt: media.title,
      })
    : (() => {
        const video = document.createElement("video");
        video.controls = true;
        const source = document.createElement("source");
        source.src = `assets/images/${folderName}/${media.video}`;
        source.type = "video/mp4";
        video.appendChild(source);
        video.setAttribute("aria-label", media.title);
        return video;
      })();

  const desc = document.createElement("div");
  desc.className = "media-description";

  const title = document.createElement("p");
  title.className = "media-title";
  title.textContent = media.title;

  const likes = document.createElement("span");
  likes.className = "media-likes";
  likes.textContent = media.likes;

  const heart = Object.assign(document.createElement("img"), {
    src: "assets/icons/heart.png",
    alt: "likes",
    style: "width:15px; cursor:pointer",
  });

  let liked = false;
  heart.addEventListener("click", () => {
    if (!liked) {
      media.likes++;
      likes.textContent = media.likes;
      liked = true;
      // Suppression de l'appel à updateTotalLikes car cela ne concerne pas la lightbox
    }
  });

  const likesContainer = document.createElement("div");
  likesContainer.className = "likes-container";
  likesContainer.append(likes, heart);

  desc.append(title, likesContainer);
  mediaEl.addEventListener("click", () => openLightbox(index));
  container.append(mediaEl, desc);
  return container;
}

//  Ouvre la lightbox et affiche le média à l'index donné* @param {Number} index - L'index du média à afficher
export function openLightbox(index) {
  const modal = document.getElementById("lightbox-modal");
  modal.style.display = "block";
  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
  document.body.setAttribute("aria-hidden", "true");
  window.currentIndex = index;
  displayLightboxMedia(index);
  document.querySelector(".lightbox-close")?.focus();
}

//  Ferme la lightbox
export function closeLightbox() {
  const modal = document.getElementById("lightbox-modal");
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  document.body.setAttribute("aria-hidden", "false");
}

//  Affiche le média dans la lightbox* @param {Number} index - L'index du média à afficher
export function displayLightboxMedia(index) {
  const media = window.currentMediaList[index];
  if (!media) return;
  const container = document.querySelector(".lightbox-media-container");
  const title = document.querySelector(".lightbox-media-title");
  const folder = folderMap[media.photographerId] || "Unknown";

  container.innerHTML = "";
  title.textContent = media.title;

  if (media.image) {
    const img = document.createElement("img");
    img.src = `assets/images/${folder}/${media.image}`;
    img.alt = media.title;
    container.appendChild(img);
  } else if (media.video) {
    const video = document.createElement("video");
    video.controls = true;
    const source = document.createElement("source");
    source.src = `assets/images/${folder}/${media.video}`;
    source.type = "video/mp4";
    video.appendChild(source);
    container.appendChild(video);
  }
}

//  Passe au média suivant dans la lightbox
export function nextMedia() {
  window.currentIndex =
    (window.currentIndex + 1) % window.currentMediaList.length;
  displayLightboxMedia(window.currentIndex);
}

//  Passe au média précédent dans la lightbox
export function prevMedia() {
  window.currentIndex =
    (window.currentIndex - 1 + window.currentMediaList.length) %
    window.currentMediaList.length;
  displayLightboxMedia(window.currentIndex);
}

//  Gestion des événements clavier et clic sur la lightbox
document.addEventListener("DOMContentLoaded", () => {
  document
    .querySelector(".lightbox-close")
    ?.addEventListener("click", closeLightbox);
  document
    .querySelector(".lightbox-next")
    ?.addEventListener("click", nextMedia);
  document
    .querySelector(".lightbox-prev")
    ?.addEventListener("click", prevMedia);

  document.addEventListener("keydown", (e) => {
    if (document.getElementById("lightbox-modal").style.display !== "block")
      return;
    if (e.key === "Escape") closeLightbox();
    else if (e.key === "ArrowRight") nextMedia();
    else if (e.key === "ArrowLeft") prevMedia();
  });
});
