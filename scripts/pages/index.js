/* global photographerTemplate */

// Récupère les photographes depuis le fichier JSON
const getPhotographers = async () =>
  fetch("data/photographers.json")
    .then((res) => res.json())
    .then((data) => data.photographers)
    .catch((err) => {
      console.error("Erreur chargement photographes :", err);
      return [];
    });

// Affiche les cartes des photographes
const displayData = (photographers) => {
  document
    .querySelector(".photographer_section")
    .append(
      ...photographers.map((p) => photographerTemplate(p).getUserCardDOM())
    );
};

// Initialise la page
(async () => displayData(await getPhotographers()))();
