function photographerTemplate(data) {
    const { name, portrait, city, country, tagline, price, id } = data;
    const picture = `assets/photographers/${portrait}`;
  
    function getUserCardDOM() {
      const article = document.createElement('article');
  
    
      const link = document.createElement('a');
      link.setAttribute('href', `photographer.html?id=${id}`);
      link.setAttribute('aria-label', `Accéder à la page de ${name}`);
  
   
      const img = document.createElement('img');
      img.setAttribute('src', picture);
      
      img.setAttribute('alt', name);
  

      const h2 = document.createElement('h2');
      h2.textContent = name;
  
     
      const location = document.createElement('p');
      location.textContent = `${city}, ${country}`;
      location.classList.add('photographer-location');
  
      
      const taglineElem = document.createElement('p');
      taglineElem.textContent = tagline;
      taglineElem.classList.add('photographer-tagline');
  
      
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
  
  