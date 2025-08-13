// Funcionalidad Header AidSync
// Este script maneja el menú móvil y el modo oscuro global de AidSync
// Menú móvil y modo oscuro global
//AidSync-Project\src\components\js\header.js

function initHeader() {
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
    document.body.style.overflow = 'hidden';
    // Asegurarse de que el botón de cierre reciba el foco
    if (closeMobile) {
      closeMobile.focus();
    }
  }
}

function closeMenu() {
  if (mobileMenu) {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
    // Devolver el foco al botón del menú hamburguesa
    if (burger) {
      burger.focus();
    }
  }
}

// Añadir eventos
if (burger) {
  burger.addEventListener('click', function(e) {
    e.stopPropagation();
    if (mobileMenu && mobileMenu.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });
}

// Cerrar menú al hacer clic fuera
document.addEventListener('click', function(e) {
  if (mobileMenu && mobileMenu.classList.contains('open') && 
      !mobileMenu.contains(e.target) && 
      e.target !== burger) {
    closeMenu();
  }
});

// Cerrar menú con tecla Escape
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('open')) {
    closeMenu();
  }
});

// Cerrar menú al hacer clic en los enlaces del menú móvil
const mobileLinks = document.querySelectorAll('.as-header__mobile-list a');
mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

// Inicializar el header cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHeader);
} else {
  initHeader();
}
