function toggleMenu(button) {
    const menu = document.getElementById(button.getAttribute('aria-controls'));
    const isExpanded = button.getAttribute('aria-expanded') === 'true';

    // Cambiar el estado del botón y del menú
    button.setAttribute('aria-expanded', !isExpanded);
    menu.classList.toggle('hidden', isExpanded);
  }