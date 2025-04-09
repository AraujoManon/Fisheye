/* global mediaFactory */

let currentMediaList = [];
let currentSort = "popularity";

// Récupère l'ID du photographe depuis l'URL
function getPhotographerId() {
  return parseInt(new URLSearchParams(location.search).get("id"), 10);
}

// Récupère les données JSON et gère les erreurs
async function getData() {
  try {
    const res = await fetch("data/photographers.json");
    return await res.json();
  } catch (err) {
    console.error("Erreur JSON:", err);
    return { photographers: [], media: [] };
  }
}

// Affiche l'en-tête du photographe avec ses infos
function displayPhotographerHeader(p) {
  document.getElementById("photographer-name").textContent = p.name;
  document.getElementById(
    "photographer-location"
  ).textContent = `${p.city}, ${p.country}`;
  document.getElementById("photographer-tagline").textContent = p.tagline;
  document.getElementById("daily-price").textContent = `${p.price}€ / jour`;

  const img = document.createElement("img");
  img.src = `assets/photographers/${p.portrait}`;
  img.alt = p.name;
  document.getElementById("photographer-portrait").appendChild(img);
}

// Met à jour le compteur total de likes
function updateTotalLikes() {
  const total = currentMediaList.reduce((sum, m) => sum + Number(m.likes), 0);
  document.getElementById("total-likes").textContent = total;
}

// Trie les médias selon le critère sélectionné
function sortMediaList(criteria) {
  const sorters = {
    popularity: (a, b) => b.likes - a.likes,
    date: (a, b) => new Date(b.date) - new Date(a.date),
    title: (a, b) => a.title.localeCompare(b.title),
  };
  currentMediaList.sort(sorters[criteria]);
}

// Affiche la galerie en créant les éléments via mediaFactory (définie dans lightbox.js)
function displayMediaGallery(mediaItems, photographerId) {
  const gallery = document.querySelector(".media-gallery");
  gallery.innerHTML = "";
  mediaItems.forEach((media, index) => {
    const el = mediaFactory(media, photographerId, index);
    gallery.appendChild(el);
  });
  updateTotalLikes();
}

// Création du dropdown personnalisé pour le tri avec remplacement d'icône SVG
function createCustomDropdown() {
  const nativeSelect = document.getElementById("sort-select");
  const options = Array.from(nativeSelect.options).map((opt) => ({
    value: opt.value,
    text: opt.textContent,
  }));
  const container = document.createElement("div");
  container.className = "custom-dropdown";

  const toggle = document.createElement("button");
  toggle.className = "sort-toggle";
  toggle.setAttribute("aria-haspopup", "listbox");
  toggle.setAttribute("aria-expanded", "false");

  const selected = document.createElement("span");
  selected.className = "dropdown-selected";
  selected.textContent = options[0].text;

  // Icône SVG par défaut (fermé)
  const svgDown = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
    <g clip-path="url(#clip0_120_430)">
      <path d="M22.12 11.4531L16 17.5598L9.88 11.4531L8 13.3331L16 21.3331L24 13.3331L22.12 11.4531Z" fill="white"/>
    </g>
    <defs>
      <clipPath id="clip0_120_430">
        <rect width="32" height="32" fill="white"/>
      </clipPath>
    </defs>
  </svg>`;

  // Nouvelle icône SVG (ouvert)
  const svgUp = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M9.88 20.5469L16 14.4402L22.12 20.5469L24 18.6669L16 10.6669L8 18.6669L9.88 20.5469Z" fill="white"/>
  </svg>`;

  const arrow = document.createElement("span");
  arrow.className = "sort-arrow";
  arrow.innerHTML = svgDown;

  toggle.append(selected, arrow);
  container.appendChild(toggle);

  const menu = document.createElement("ul");
  menu.className = "dropdown-menu";
  menu.setAttribute("role", "listbox");

  const updateMenu = () => {
    menu.innerHTML = "";
    options
      .filter((opt) => opt.value !== currentSort)
      .forEach((opt) => {
        const li = document.createElement("li");
        li.className = "dropdown-option";
        li.dataset.value = opt.value;
        li.setAttribute("role", "option");
        li.textContent = opt.text;
        menu.appendChild(li);
      });
  };
  updateMenu();
  container.appendChild(menu);
  document.querySelector(".sort-block").appendChild(container);

  // Au clic, bascule l'état et remplace l'icône SVG
  toggle.addEventListener("click", () => {
    const isExpanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", !isExpanded);
    menu.classList.toggle("open");
    arrow.innerHTML = !isExpanded ? svgUp : svgDown;
  });

  // Au choix d'une option, met à jour le tri et réinitialise l'icône
  menu.addEventListener("click", (e) => {
    if (e.target.matches(".dropdown-option")) {
      currentSort = e.target.dataset.value;
      selected.textContent = e.target.textContent;
      toggle.setAttribute("aria-expanded", "false");
      menu.classList.remove("open");
      arrow.innerHTML = svgDown;
      updateMenu();
      sortMediaList(currentSort);
      displayMediaGallery(currentMediaList, getPhotographerId());
    }
  });
}

// Initialise la page photographe
async function initPhotographer() {
  const photographerId = getPhotographerId();
  const { photographers, media } = await getData();
  const photographer = photographers.find((p) => p.id === photographerId);
  if (!photographer)
    return console.error("Photographe introuvable :", photographerId);

  displayPhotographerHeader(photographer);
  currentMediaList = media.filter((m) => m.photographerId === photographerId);
  window.currentMediaList = currentMediaList;

  sortMediaList(currentSort);
  displayMediaGallery(currentMediaList, photographerId);
  createCustomDropdown();
}

initPhotographer();
