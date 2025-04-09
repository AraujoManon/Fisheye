(() => {
  // Récupère les photographes depuis le JSON
  const getPhotographers = async () => {
    try {
      const response = await fetch("data/photographers.json");
      const data = await response.json();
      return data.photographers;
    } catch (error) {
      console.error("Erreur lors de la récupération des photographes :", error);
      return [];
    }
  };

  // Affiche les cartes des photographes
  const displayData = (photographers) => {
    const section = document.querySelector(".photographer_section");
    photographers.forEach((photographer) => {
      const card = document.createElement("article");
      card.className = "photographer-card";
      card.innerHTML = `
        <a href="photographer.html?id=${photographer.id}">
          <img src="assets/photographers/${photographer.portrait}" alt="${photographer.name}">
          <h2>${photographer.name}</h2>
        </a>
        <p>${photographer.city}, ${photographer.country}</p>
        <p>${photographer.tagline}</p>
        <p>${photographer.price}€/jour</p>
      `;
      section.appendChild(card);
    });
  };

  // Initie l'application
  const init = async () => {
    const photographers = await getPhotographers();
    displayData(photographers);
  };

  init();
})();
