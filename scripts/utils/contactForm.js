(() => {
  // Récupère la modale de contact
  const modal = document.getElementById("contact_modal");

  // Affiche la modale et met à jour le titre avec le nom du photographe
  function displayModal() {
    modal.style.display = "flex";
    modal.setAttribute("aria-hidden", "false");
    const photographerName =
      document.getElementById("photographer-name")?.textContent || "";
    const modalTitle = modal.querySelector("h2");
    if (modalTitle) {
      modalTitle.textContent = `Contactez-moi ${photographerName}`;
    }
  }

  // Cache la modale
  function closeModal() {
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
  }

  // Gestion de l'envoi du formulaire de contact
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      console.log("Formulaire soumis :", {
        firstName: document.getElementById("firstName").value,
        email: document.getElementById("email").value,
        message: document.getElementById("message").value,
      });
      closeModal();
    });
  }

  // Expose les fonctions globalement
  window.displayModal = displayModal;
  window.closeModal = closeModal;
})();
