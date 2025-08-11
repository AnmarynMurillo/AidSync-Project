// Funcionalidad Header AidSync
// Este script maneja el menú móvil y el modo oscuro global de AidSync
// Menú móvil y modo oscuro global
//AidSync-Project\src\components\js\header.js

document.addEventListener('DOMContentLoaded', function () {
  // --- Modo oscuro global en <html> ---
  function setDarkMode(on) {
    const html = document.documentElement;
    if (on) {
      html.setAttribute('data-theme', 'dark');
      localStorage.setItem('as_darkmode', '1');
    } else {
      html.setAttribute('data-theme', 'light');
      localStorage.setItem('as_darkmode', '0');
    }
  }
  // Inicializa modo oscuro según localStorage
  if (localStorage.getItem('as_darkmode') === '1') {
    setDarkMode(true);
  } else {
    setDarkMode(false);
  }
  document.querySelectorAll('.as-header__darkmode-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      setDarkMode(document.documentElement.getAttribute('data-theme') !== 'dark');
    });
  });

  // --- Menú móvil ---
  const burger = document.querySelector('.as-header__burger');
  const mobileMenu = document.getElementById('as-header__mobile-menu');
  const closeMobile = document.querySelector('.as-header__mobile-close');

  function openMenu() {
    if (mobileMenu) {
      mobileMenu.classList.add('open');
      burger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
  }
  function closeMenu() {
    if (mobileMenu) {
      mobileMenu.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  }
  if (burger) {
    burger.addEventListener('click', openMenu);
  }
  if (closeMobile) {
    closeMobile.addEventListener('click', closeMenu);
  }
  // Cierra el menú si se hace click fuera del panel (solo fondo, no contenido)
  if (mobileMenu) {
    mobileMenu.addEventListener('mousedown', function (e) {
      // Solo cierra si el click es exactamente sobre el fondo del menú (no sobre hijos)
      if (e.target === mobileMenu) closeMenu();
    });
  }
  // Cierra el menú al hacer click en cualquier enlace del menú móvil
  document.querySelectorAll('.as-header__mobile-list a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
  // Refuerza el cierre con teclado (accesibilidad)
  if (closeMobile) {
    closeMobile.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        closeMenu();
      }
    });
  }
});
