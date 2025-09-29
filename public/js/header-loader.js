// Header Loader Universal - Detecta autenticación y carga el header apropiado
// Este archivo debe ser incluido en todas las páginas que necesiten el header

console.log('🔍 Header Loader loaded');

// Función para verificar autenticación
function checkUserAuthentication() {
  try {
    console.log('🔍 Starting authentication check...');
    
    // Verificar localStorage
    const user = localStorage.getItem('as_user') || localStorage.getItem('user');
    console.log('🔍 Checking localStorage user:', user ? 'Found' : 'Not found');
    console.log('🔍 Raw localStorage data:', user);
    
    if (user) {
      try {
        const userData = JSON.parse(user);
        console.log('🔍 Parsed user data:', userData);
        if (userData && (userData.uid || userData.email)) {
          console.log('🔍 User data valid:', userData);
          console.log('🔍 Username found:', userData.username || userData.displayName || 'Not found');
          return true;
        }
      } catch (parseError) {
        console.warn('🔍 Error parsing user data:', parseError);
      }
    }
    
    // Verificar Firebase Auth
    if (typeof firebase !== 'undefined' && firebase.auth) {
      const currentUser = firebase.auth().currentUser;
      console.log('🔍 Firebase auth currentUser:', currentUser ? 'Found' : 'Not found');
      if (currentUser) {
        console.log('🔍 Firebase auth user found');
        return true;
      }
    } else {
      console.log('🔍 Firebase not available');
    }
    
    // Verificar tokens de Firebase en localStorage
    console.log('🔍 Checking Firebase tokens in localStorage...');
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.indexOf('firebase:authUser:') === 0) {
        try {
          const firebaseUser = JSON.parse(localStorage.getItem(key));
          if (firebaseUser && firebaseUser.uid) {
            console.log('🔍 Firebase token user found:', firebaseUser.uid);
            return true;
          }
        } catch (e) {
          console.warn('🔍 Error parsing Firebase token:', e);
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
      console.log('🔍 Auth header HTML inserted');
      
      // Esperar un poco para que el DOM se actualice
      setTimeout(() => {
        // Carga el JS del auth-header después de insertar el HTML
        const script = document.createElement('script');
        script.src = authHeaderJsPath;
        script.defer = true;
        script.onload = () => {
          console.log('🔍 Auth-header.js loaded successfully');
          // Instanciar AuthHeader si existe y no ha sido instanciado
          if (window.AuthHeader && !window.authHeader && document.getElementById('authHeader')) {
            console.log('🔍 Creating AuthHeader instance...');
            window.authHeader = new window.AuthHeader(document);
            console.log('🔍 AuthHeader instance created:', !!window.authHeader);
          } else {
            console.warn('🔍 Cannot create AuthHeader instance:', {
              AuthHeader: !!window.AuthHeader,
              authHeader: !!window.authHeader,
              authHeaderElement: !!document.getElementById('authHeader')
            });
          }
          
          // Actualizar el nombre del usuario después de cargar el auth-header
          setTimeout(() => {
            if (window.updateHeaderUserName) {
              console.log('🔍 Calling global updateHeaderUserName function');
              window.updateHeaderUserName();
            }
            
            // También llamar a la función de fuerza
            if (window.forceUpdateUsername) {
              console.log('🔍 Calling forceUpdateUsername function');
              window.forceUpdateUsername();
            }
          }, 100);
        };
        script.onerror = () => console.error('Error al cargar auth-header.js');
        document.body.appendChild(script);
      }, 50);
      
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
      
      // Cargar footer
      loadFooter();
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
      
      // Cargar footer
      loadFooter();
    })
    .catch(error => {
      console.error('Error cargando el header:', error);
    });
}

// Variable para evitar cargar el header múltiples veces
let headerLoaded = false;

// Loader universal para el header - detecta autenticación
function loadHeader() {
  const container = document.getElementById('header-container');
  if (!container) {
    console.warn('Header container not found');
    return;
  }
  
  // Evitar cargar múltiples veces
  if (headerLoaded) {
    console.log('🔍 Header already loaded, skipping...');
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
  
  headerLoaded = true;
  
  // Cargar footer independientemente del header
  console.log('🔍 Loading footer independently...');
  loadFooter();
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
  console.log('🔍 Current page:', window.location.pathname);
  
  // Esperar un poco para que Firebase se inicialice si está presente
  setTimeout(() => {
    console.log('🔍 Loading header after timeout...');
    loadHeader();
  }, 500); // Aumentado el delay para dar más tiempo
});

// También escuchar cambios en el localStorage para recargar el header cuando cambie el estado de autenticación
window.addEventListener('storage', (e) => {
  if (e.key === 'as_user' || e.key === 'user' || (e.key && e.key.indexOf('firebase:authUser:') === 0)) {
    // Recargar el header cuando cambie el estado de autenticación
    setTimeout(loadHeader, 100);
  }
});

// Escuchar cambios en el localStorage desde la misma pestaña
window.addEventListener('storage', (e) => {
  if (e.key === 'as_user' || e.key === 'user') {
    console.log('🔍 Storage change detected, updating username...');
    setTimeout(() => {
      if (window.forceUpdateUsername) {
        window.forceUpdateUsername();
      }
    }, 100);
  }
});

// También escuchar eventos personalizados
window.addEventListener('as:user-updated', () => {
  console.log('🔍 User updated event detected, updating username...');
  setTimeout(() => {
    if (window.forceUpdateUsername) {
      window.forceUpdateUsername();
    }
  }, 100);
});

// Escuchar eventos personalizados de cambio de autenticación
window.addEventListener('as:user-updated', () => {
  setTimeout(loadHeader, 100);
});

// Función para cargar footer
function loadFooter() {
  const container = document.getElementById('footer-container');
  if (!container) {
    console.warn('🔍 Footer container not found');
    return;
  }
  
  // Determinar la ruta correcta según la ubicación de la página
  const isInPagesFolder = window.location.pathname.includes('/pages/');
  const footerPath = isInPagesFolder ? '../components/html/footer.html' : 'components/html/footer.html';
  const footerCssPath = isInPagesFolder ? '../components/css/footer.css' : 'components/css/footer.css';
  
  console.log('🔍 Loading footer from:', footerPath);
  console.log('🔍 Footer container found:', !!container);
  
  fetch(footerPath)
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.text();
    })
    .then(html => {
      console.log('🔍 Footer HTML loaded, inserting into container');
      container.innerHTML = html;
      console.log('🔍 Footer content inserted successfully');
      
      // Carga el CSS del footer si no está ya cargado
      if (!document.querySelector(`link[href*="${footerCssPath}"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = footerCssPath;
        link.onerror = () => console.error('Error al cargar footer.css');
        document.head.appendChild(link);
        console.log('🔍 Footer CSS loaded');
      }
      
      // Cargar Font Awesome si no está cargado
      if (!document.querySelector('link[href*="font-awesome"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css';
        document.head.appendChild(link);
        console.log('🔍 Font Awesome loaded for footer');
      }
    })
    .catch(error => {
      console.error('Error cargando el footer:', error);
    });
}

// Exportar funciones para uso global
window.loadHeader = loadHeader;
window.checkUserAuthentication = checkUserAuthentication;
window.loadFooter = loadFooter;
