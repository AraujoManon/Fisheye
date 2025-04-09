(() => {
  // Récupère les données du JSON
  const getData = async () => {
    try {
      const res = await fetch("data/photographers.json");
      return await res.json();
    } catch (err) {
      console.error("Erreur JSON:", err);
      return { photographers: [], media: [] };
    }
  };

  // Extrait l'ID du photographe depuis l'URL
  const getPhotographerId = () =>
    Number(new URLSearchParams(window.location.search).get("id"));

  // Affiche l'en-tête du photographe
  function displayPhotographerHeader(photographer) {
    document.getElementById("photographer-name").textContent =
      photographer.name;
    document.getElementById(
      "photographer-location"
    ).textContent = `${photographer.city}, ${photographer.country}`;
    document.getElementById("photographer-tagline").textContent =
      photographer.tagline;
    document.getElementById(
      "daily-price"
    ).textContent = `${photographer.price}€ / jour`;
    const portraitContainer = document.getElementById("photographer-portrait");
    const img = document.createElement("img");
    img.src = `assets/photographers/${photographer.portrait}`;
    img.alt = photographer.name;
    portraitContainer.appendChild(img);
  }

  // Met à jour le total des likes et l'expose globalement
  function updateTotalLikes() {
    const total = window.currentMediaList.reduce(
      (acc, media) => acc + Number(media.likes),
      0
    );
    document.getElementById("total-likes").textContent = total;
    window.updateTotalLikes = updateTotalLikes;
  }

  // Trie les médias selon le critère sélectionné
  function sortMediaList(criteria) {
    window.currentMediaList.sort((a, b) => {
      if (criteria === "popularity") return b.likes - a.likes;
      if (criteria === "date") return new Date(b.date) - new Date(a.date);
      if (criteria === "title") return a.title.localeCompare(b.title);
      return 0;
    });
  }

  // Affiche la galerie des médias
  function displayMediaGallery(mediaItems, photographerId) {
    const gallery = document.querySelector(".media-gallery");
    gallery.innerHTML = "";
    mediaItems.forEach((media, index) => {
      gallery.appendChild(window.mediaFactory(media, photographerId, index));
    });
    updateTotalLikes();
  }

  // Crée un dropdown personnalisé pour le tri
  function createCustomDropdown() {
    const select = document.getElementById("sort-select");
    const optionsArray = Array.from(select.options).map((opt) => ({
      value: opt.value,
      text: opt.textContent,
    }));
    const dropdownContainer = document.createElement("div");
    dropdownContainer.className = "custom-dropdown";

    const dropdownToggle = document.createElement("button");
    dropdownToggle.className = "sort-toggle";
    dropdownToggle.setAttribute("aria-haspopup", "listbox");
    dropdownToggle.setAttribute("aria-expanded", "false");

    const selectedSpan = document.createElement("span");
    selectedSpan.className = "dropdown-selected";
    let currentSort = "popularity";
    selectedSpan.textContent =
      optionsArray.find((opt) => opt.value === currentSort)?.text || "";
    dropdownToggle.append(selectedSpan, document.createTextNode(" ▾"));

    const dropdownMenu = document.createElement("ul");
    dropdownMenu.className = "dropdown-menu";
    dropdownMenu.setAttribute("role", "listbox");

    const rebuildDropdown = () => {
      dropdownMenu.innerHTML = "";
      optionsArray
        .filter((opt) => opt.value !== currentSort)
        .forEach((opt) => {
          const li = document.createElement("li");
          li.className = "dropdown-option";
          li.setAttribute("role", "option");
          li.dataset.value = opt.value;
          li.textContent = opt.text;
          dropdownMenu.appendChild(li);
        });
    };
    rebuildDropdown();

    dropdownContainer.append(dropdownToggle, dropdownMenu);
    document.querySelector(".sort-block").appendChild(dropdownContainer);

    dropdownToggle.addEventListener("click", () => {
      const expanded = dropdownToggle.getAttribute("aria-expanded") === "true";
      dropdownToggle.setAttribute("aria-expanded", String(!expanded));
      dropdownMenu.classList.toggle("open");
    });

    dropdownMenu.addEventListener("click", (e) => {
      if (e.target && e.target.matches("li.dropdown-option")) {
        currentSort = e.target.dataset.value;
        selectedSpan.textContent = e.target.textContent;
        dropdownToggle.setAttribute("aria-expanded", "false");
        dropdownMenu.classList.remove("open");
        rebuildDropdown();
        sortMediaList(currentSort);
        displayMediaGallery(window.currentMediaList, getPhotographerId());
      }
    });
  }

  // Initie la page photographe
  async function initPhotographer() {
    const photographerId = getPhotographerId();
    const data = await getData();
    const photographer = data.photographers.find(
      (p) => p.id === photographerId
    );
    if (!photographer) {
      console.error("Photographe introuvable pour ID :", photographerId);
      return;
    }
    displayPhotographerHeader(photographer);
    window.currentMediaList = data.media.filter(
      (m) => m.photographerId === photographerId
    );
    sortMediaList("popularity");
    displayMediaGallery(window.currentMediaList, photographerId);
    createCustomDropdown();
  }

  initPhotographer();
})();
