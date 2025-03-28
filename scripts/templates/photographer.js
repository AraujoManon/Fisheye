// scripts/templates/photographer.js

function photographerTemplate(data) {
    const { name, portrait, city, country, tagline, price, id } = data;
    const picture = `assets/photographers/${portrait}`; 
    // OU "assets/images/<dossier>..." selon votre organisation
  
    function getUserCardDOM() {
      const article = document.createElement('article');
      article.setAttribute('role', 'listitem');
  
      // Lien cliquable
      const link = document.createElement('a');
      link.setAttribute('href', `photographer.html?id=${id}`);
      link.setAttribute('aria-label', `Accéder à la page de ${name}`);
  
      // Image
      const img = document.createElement('img');
      img.setAttribute('src', picture);
      img.setAttribute('alt', `Portrait de ${name}`);
  
      // Nom
      const h2 = document.createElement('h2');
      h2.textContent = name;
  
      // Localisation
      const location = document.createElement('p');
      location.textContent = `${city}, ${country}`;
      location.classList.add('photographer-location');
  
      // Tagline
      const taglineElem = document.createElement('p');
      taglineElem.textContent = tagline;
      taglineElem.classList.add('photographer-tagline');
  
      // Prix
      const priceElem = document.createElement('p');
      priceElem.textContent = `${price}€/jour`;
      priceElem.classList.add('photographer-price');
  
      link.appendChild(img);
      link.appendChild(h2);
  
      article.appendChild(link);
      article.appendChild(location);
      article.appendChild(taglineElem);
      article.appendChild(priceElem);
  
      return article;
    }
  
    return { name, picture, getUserCardDOM };
  }
  