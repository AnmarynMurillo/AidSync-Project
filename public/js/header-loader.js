// Header Loader Universal - Detecta autenticación y carga el header apropiado
// Este archivo debe ser incluido en todas las páginas que necesiten el header

console.log('🔍 Header Loader loaded');

// Función para verificar autenticación
function checkUserAuthentication() {
  try {
    // Verificar localStorage
    const user = localStorage.getItem('as_user') || localStorage.getItem('user');
    console.log('🔍 Checking localStorage user:', user ? 'Found' : 'Not found');
    if (user) {
      const userData = JSON.parse(user);
      if (userData && (userData.uid || userData.email)) {
        console.log('🔍 User data valid:', userData);
        return true;
      }
    }
    
    // Verificar Firebase Auth
    if (typeof firebase !== 'undefined' && firebase.auth && firebase.auth().currentUser) {
      console.log('🔍 Firebase auth user found');
      return true;
    }
    
    // Verificar tokens de Firebase en localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.indexOf('firebase:authUser:') === 0) {
        try {
          const firebaseUser = JSON.parse(localStorage.getItem(key));
          if (firebaseUser && firebaseUser.uid) {
            console.log('🔍 Firebase token user found');
            return true;
          }
        } catch (e) {
          // Ignorar errores de parsing
        }
      }
    }
    
    console.log('🔍 No authentication found');
    return false;
  } catch (e) {
    console.warn('Error checking authentication:', e);
    return false;
  }
}

// Función para cargar header autenticado
function loadAuthHeader() {
  const container = document.getElementById('header-container');
  if (!container) return;
  
  // Determinar la ruta correcta según la ubicación de la página
  const isInPagesFolder = window.location.pathname.includes('/pages/');
  const authHeaderPath = isInPagesFolder ? '../components/html/auth-header.html' : 'components/html/auth-header.html';
  const authHeaderJsPath = isInPagesFolder ? '../components/js/auth-header.js' : 'components/js/auth-header.js';
  const authHeaderCssPath = isInPagesFolder ? '../components/css/auth-header.css' : 'components/css/auth-header.css';
  
  console.log('🔍 Loading auth header from:', authHeaderPath);
  
  fetch(authHeaderPath)
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.text();
    })
    .then(html => {
      container.innerHTML = html;
      
      // Carga el JS del auth-header después de insertar el HTML
      const script = document.createElement('script');
      script.src = authHeaderJsPath;
      script.defer = true;
      script.onerror = () => console.error('Error al cargar auth-header.js');
      document.body.appendChild(script);
      
      // Carga el CSS del auth-header si no está ya cargado
      if (!document.querySelector('link[href*="auth-header.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = authHeaderCssPath;
        link.onerror = () => console.error('Error al cargar auth-header.css');
        document.head.appendChild(link);
      }
      
      // Inicializa el modo oscuro después de cargar el header
      initDarkModeHeader();
    })
    .catch(error => {
      console.error('Error cargando el auth-header:', error);
      // Fallback al header normal si hay error
      loadGuestHeader();
    });
}

// Función para cargar header normal (invitado)
function loadGuestHeader() {
  const container = document.getElementById('header-container');
  if (!container) return;
  
  // Determinar la ruta correcta según la ubicación de la página
  const isInPagesFolder = window.location.pathname.includes('/pages/');
  const headerPath = isInPagesFolder ? '../components/html/header.html' : 'components/html/header.html';
  const headerJsPath = isInPagesFolder ? '../components/js/header.js' : 'components/js/header.js';
  const headerCssPath = isInPagesFolder ? '../components/css/header.css' : 'components/css/header.css';
  
  console.log('🔍 Loading guest header from:', headerPath);
  
  fetch(headerPath)
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.text();
    })
    .then(html => {
      container.innerHTML = html;
      
      // Carga el JS del header después de insertar el HTML
      const script = document.createElement('script');
      script.src = headerJsPath;
      script.defer = true;
      script.onerror = () => console.error('Error al cargar header.js');
      document.body.appendChild(script);
      
      // Carga el CSS del header si no está ya cargado
      if (!document.querySelector('link[href*="header.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = headerCssPath;
        link.onerror = () => console.error('Error al cargar header.css');
        document.head.appendChild(link);
      }
      
      // Inicializa el modo oscuro después de cargar el header
      initDarkModeHeader();
    })
    .catch(error => {
      console.error('Error cargando el header:', error);
    });
}

// Loader universal para el header - detecta autenticación
function loadHeader() {
  const container = document.getElementById('header-container');
  if (!container) {
    console.warn('Header container not found');
    return;
  }
  
  // Verificar si el usuario está autenticado
  const isAuthenticated = checkUserAuthentication();
  console.log('🔍 Header Loader - User authenticated:', isAuthenticated);
  
  if (isAuthenticated) {
    // Cargar header autenticado
    console.log('🔍 Loading auth header');
    loadAuthHeader();
  } else {
    // Cargar header normal
    console.log('🔍 Loading guest header');
    loadGuestHeader();
  }
}

// Función para inicializar el modo oscuro
function initDarkModeHeader() {
  const html = document.documentElement;
  
  function setDarkMode(on) {
    if (on) {
      html.setAttribute('data-theme', 'dark');
      localStorage.setItem('as_darkmode', '1');
    } else {
      html.setAttribute('data-theme', 'light');
      localStorage.setItem('as_darkmode', '0');
    }
  }
  
  if (localStorage.getItem('as_darkmode') === '1') {
    setDarkMode(true);
  } else {
    setDarkMode(false);
  }
  
  // Esperar a que el header se cargue completamente
  setTimeout(() => {
    document.querySelectorAll('.as-header__darkmode-btn').forEach(btn => {
      btn.onclick = function () {
        setDarkMode(html.getAttribute('data-theme') !== 'dark');
      };
    });
  }, 100);
}

// Cargar header cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  console.log('🔍 DOM Content Loaded, loading header...');
  loadHeader();
});

// También escuchar cambios en el localStorage para recargar el header cuando cambie el estado de autenticación
window.addEventListener('storage', (e) => {
  if (e.key === 'as_user' || e.key === 'user' || (e.key && e.key.indexOf('firebase:authUser:') === 0)) {
    // Recargar el header cuando cambie el estado de autenticación
    setTimeout(loadHeader, 100);
  }
});

// Escuchar eventos personalizados de cambio de autenticación
window.addEventListener('as:user-updated', () => {
  setTimeout(loadHeader, 100);
});

// Exportar funciones para uso global
window.loadHeader = loadHeader;
window.checkUserAuthentication = checkUserAuthentication;
