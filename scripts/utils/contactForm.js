// Export de la fonction photographerTemplate
export const photographerTemplate = ({
  name,
  portrait,
  city,
  country,
  tagline,
  price,
  id,
}) => {
  const picture = `assets/photographers/${portrait}`;

  // Fonction utilitaire de création d'éléments avec attributs
  const createElement = (tag, attributes = {}) =>
    Object.assign(document.createElement(tag), attributes);

  const getUserCardDOM = () => {
    const article = createElement("article", { role: "listitem" });
    const link = createElement("a", {
      href: `photographer.html?id=${id}`,
      ariaLabel: `Accéder à la page de ${name}`,
    });
    link.append(
      createElement("img", { src: picture, alt: `Portrait de ${name}` }),
      createElement("h2", { textContent: name })
    );
    article.append(
      link,
      ...[
        "photographer-location",
        "photographer-tagline",
        "photographer-price",
      ].map((className, i) =>
        createElement("p", {
          textContent: [`${city}, ${country}`, tagline, `${price}€/jour`][i],
          className,
        })
      )
    );
    return article;
  };

  return { name, picture, getUserCardDOM };
};
