function photographerTemplate(data) {
  const { name, portrait, city, country, tagline, price, id } = data;
  const picture = `assets/photographers/${portrait}`;

  // Crée et retourne le DOM pour la carte du photographe
  function getUserCardDOM() {
    const article = document.createElement("article");
    article.setAttribute("role", "listitem");
    article.innerHTML = `
      <a href="photographer.html?id=${id}" aria-label="Accéder à la page de ${name}">
        <img src="${picture}" alt="Portrait de ${name}">
        <h2>${name}</h2>
      </a>
      <p class="photographer-location">${city}, ${country}</p>
      <p class="photographer-tagline">${tagline}</p>
      <p class="photographer-price">${price}€/jour</p>
    `;
    return article;
  }

  return { name, picture, getUserCardDOM };
}

// Rendre la fonction accessible globalement
window.photographerTemplate = photographerTemplate;
