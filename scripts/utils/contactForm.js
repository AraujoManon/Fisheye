function displayModal() {
    const modal = document.getElementById('contact_modal');
    modal.style.display = 'block';
    modal.setAttribute('aria-hidden', 'false');
    // Ici, gérez le focus sur la modale si besoin (par exemple modal.focus())
  }
  
  function closeModal() {
    const modal = document.getElementById('contact_modal');
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    // Ici, vous pouvez rétablir le focus sur l'élément déclencheur de la modale
  }
  
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const firstName = document.getElementById('firstName').value;
      const email = document.getElementById('email').value;
      const message = document.getElementById('message').value;
      console.log('Formulaire soumis :', { firstName, email, message });
      closeModal();
    });
  }
  