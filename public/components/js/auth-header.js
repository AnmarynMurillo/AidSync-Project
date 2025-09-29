/**
 * auth-header.js
 * Componente de cabecera con integración de autenticación (Firebase) + animaciones.
 *
 * Requisitos en el HTML (auth-header.html):
 *  - Botones/Elementos con data-auth:
 *    [data-auth="login"], [data-auth="register"], [data-auth="logout"],
 *    [data-auth="username"], [data-auth="avatar"],
 *    [data-auth="profile-toggle"] (botón para abrir/cerrar el menú del perfil),
 *    [data-auth="menu"] (contenedor del menú desplegable del perfil).
 *
 * Notas:
 *  - Este script detecta Firebase en modo modular o compat. Si no existe, intenta cargar desde CDN.
 *  - Para inicializar automáticamente en modo modular, define window.FIREBASE_CONFIG en tu HTML antes de este script.
 *    Ejemplo:
 *      <script>
 *        window.FIREBASE_CONFIG = { apiKey: "...", authDomain: "...", projectId: "...", appId: "..." };
 *      </script>
 *
 *  - Al hacer logout, redirige a "index.html".
 *  - Las animaciones son livianas y se aplican a botones y menú del perfil.
 */

(function () {
  function AuthHeader(root) {
    this.root = root || document;
    
    // Cache DOM
    this.wrap = this.root.querySelector('#asHeaderUser');
    this.nameEl = this.root.querySelector('#rightUserName');
    this.avatarEl = this.root.querySelector('#rightUserAvatar');
    this.logoutBtn = this.root.querySelector('#headerLogoutBtn');
    
    this.handleLogout = this.handleLogout.bind(this);
    this._rtdbRef = null;
    this._authUnsubscribe = null;
    
    // FORZAR CSS inmediato
    this.forceCorrectCSS();
    this.ensureStyles();
    this.ensureLogo();
    
    // FORZAR detección inmediata de usuario
    this.forceDetectUser();
    
    this.setupEvents();
    this.initAuth();
  }

  AuthHeader.DEFAULT_AVATAR = '/public/assets/img/default-avatar.png';

  // NUEVO: aplicar CSS crítico inmediato
  AuthHeader.prototype.forceCorrectCSS = function () {
    try {
      const header = this.root.querySelector('#authHeader');
      if (header) {
        // Aplicar estilos inline como fallback inmediato
        header.style.cssText = 'height:60px!important;min-height:60px!important;max-height:60px!important;background:linear-gradient(135deg,#0e5a8a 0%,#0ea5a6 100%)!important;position:fixed!important;top:0;z-index:1000;width:100%!important;box-shadow:0 2px 8px rgba(0,0,0,.1)';
        
        const container = this.root.querySelector('.as-header__container');
        if (container) {
          container.style.cssText = 'height:60px!important;padding:0 1rem!important;display:flex!important;align-items:center!important;justify-content:space-between!important;max-width:1280px;margin:0 auto;position:relative;gap:12px';
        }
        
        const logo = this.root.querySelector('.as-header__logo');
        if (logo) {
          logo.style.cssText = 'height:40px!important;max-height:40px!important;width:auto!important;object-fit:contain!important';
        }
        
        const nav = this.root.querySelector('.as-header__nav');
        if (nav) {
          nav.style.cssText = 'position:absolute!important;left:50%!important;transform:translateX(-50%)!important';
        }
        
        const navList = this.root.querySelector('.as-header__nav-list');
        if (navList) {
          navList.style.cssText = 'list-style:none!important;display:flex!important;gap:1rem!important;margin:0!important;padding:0!important';
        }
        
        const navLinks = this.root.querySelectorAll('.as-header__nav-link');
        navLinks.forEach(link => {
          link.style.cssText = 'color:#fff!important;font-weight:600!important;text-decoration:none!important;padding:.3rem .6rem!important;border-radius:.3rem!important;font-size:14px!important';
        });
        
        if (this.avatarEl) {
          this.avatarEl.style.cssText = 'width:32px!important;height:32px!important;border-radius:50%!important;object-fit:cover!important;border:2px solid rgba(255,255,255,.9)!important';
        }
        
        if (this.nameEl) {
          this.nameEl.style.cssText = 'color:#fff!important;font-weight:700!important;max-width:120px!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;font-size:13px!important';
        }
        
        if (this.logoutBtn) {
          this.logoutBtn.style.cssText = 'background:transparent!important;color:#fff!important;border:2px solid rgba(255,255,255,.9)!important;padding:.25rem .6rem!important;border-radius:999px!important;font-weight:700!important;cursor:pointer!important;font-size:12px!important';
        }
      }
    } catch (e) {
      console.warn('Force CSS failed:', e);
    }
  };

  // NUEVO: detección agresiva de usuario desde múltiples fuentes
  AuthHeader.prototype.forceDetectUser = function () {
    // 1. Verificar Firebase Auth actual
    if (typeof firebase !== 'undefined' && firebase.auth && firebase.auth().currentUser) {
      this.applyUser(firebase.auth().currentUser);
      return;
    }
    
    // 2. Verificar localStorage
    const stored = this.getStoredUser();
    if (stored && (stored.uid || stored.email)) {
      this.applyUser(stored);
      return;
    }
    
    // 3. Verificar token Firebase en localStorage
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i);
      if (k && k.indexOf('firebase:authUser:') === 0) {
        try {
          var fu = JSON.parse(localStorage.getItem(k));
          if (fu && fu.uid) {
            this.applyUser(fu);
            return;
          }
        } catch (_) {}
      }
    }
    
    // Si no hay usuario, ocultar
    this.setVisible(false);
  };

  AuthHeader.prototype.setupEvents = function () {
    console.log('🔧 Setting up events, logoutBtn found:', !!this.logoutBtn);
    if (this.logoutBtn) {
      console.log('🔧 Adding click listener to logout button');
      this.logoutBtn.addEventListener('click', (e) => {
        console.log('🔧 Logout button clicked!');
        e.preventDefault();
        this.handleLogout();
      });
    } else {
      console.warn('🔧 Logout button not found!');
    }
    
    window.addEventListener('as:user-updated', () => this.refreshFromStorage());
    window.addEventListener('storage', (e) => {
      if (!e.key) return;
      if (e.key === 'user' || e.key === 'as_user' || (e.key && e.key.indexOf('firebase:authUser:') === 0)) {
        this.refreshFromStorage();
      }
    });
  };

  AuthHeader.prototype.initAuth = async function () {
    // Esperar más tiempo para Firebase
    await this.waitForFirebaseAuth(8000);
    const auth = this.getAuth();
    if (auth && typeof auth.onAuthStateChanged === 'function') {
      if (this._authUnsubscribe) this._authUnsubscribe();
      
      this._authUnsubscribe = auth.onAuthStateChanged((user) => {
        console.log('🔥 Firebase Auth State Change:', user ? user.uid : 'null');
        this.applyUser(user);
      });
    } else {
      console.warn('🔥 Firebase Auth not available, using stored user');
      this.applyUser(this.getStoredUser());
    }
  };

  AuthHeader.prototype.ensureLogo = function () {
    try {
      var logo = this.root.querySelector('#authHeader .as-header__logo');
      if (!logo) return;
      
      var sources = [
        '/public/assets/logos/White_name.png',
        '/public/assets/logos/white_name.png',
        '/public/assets/logos/white-name.png',
        '/public/assets/logos/White_Name.png',
        '/public/assets/logos/logito.png'
      ];
      
      var current = logo.getAttribute('src');
      if (current && sources.indexOf(current) !== 0) sources.unshift(current);
      
      logo.dataset.asLogoIdx = '0';
      logo.alt = 'AidSync Logo';
      
      logo.onerror = () => {
        var i = parseInt(logo.dataset.asLogoIdx || '0', 10) + 1;
        if (i < sources.length) { 
          logo.dataset.asLogoIdx = String(i); 
          logo.src = sources[i]; 
        } else {
          var parent = logo.parentElement;
          if (parent) {
            var span = document.createElement('span');
            span.textContent = 'AidSync';
            span.style.fontWeight = '700';
            span.style.color = '#fff';
            span.style.fontSize = '18px';
            logo.replaceWith(span);
          }
        }
      };
      
      logo.src = sources[0];
    } catch (_) {}
  };

  AuthHeader.prototype.applyUser = function (user) {
    console.log('📝 Applying user to header:', user);
    
    if (!user) {
      this.detachRtdb();
      return this.setVisible(false);
    }
    
    // Datos iniciales mejorados
    const stored = this.getStoredUser() || {};
    const norm = this.normalizeUser(user, stored);
    
    console.log('📝 Normalized user:', norm);
    
    if (this.nameEl) {
      this.nameEl.textContent = norm.displayName;
      console.log('📝 Set header name:', norm.displayName);
    }
    
    this.safeSetAvatar(this.avatarEl, norm.photoURL);
    this.setVisible(true);
    
    // RTDB con UID válido
    const uid = user.uid || user.user_id || stored.uid;
    if (uid) {
      console.log('🔗 Connecting to RTDB for UID:', uid);
      this.attachRtdb(uid);
    }
  };

  AuthHeader.prototype.attachRtdb = function (uid) {
    try {
      if (typeof firebase === 'undefined' || !firebase.database || !uid) {
        console.warn('🔗 Cannot attach RTDB:', { firebase: typeof firebase, database: !!firebase.database, uid });
        return;
      }
      
      this.detachRtdb();
      
      const ref = firebase.database().ref('users/' + uid);
      this._rtdbRef = ref;
      
      console.log('🔗 RTDB listener attached for:', uid);
      
      ref.on('value', (snap) => {
        const v = snap.val() || {};
        console.log('📡 RTDB data received:', v);
        
        // Actualizar nombre en tiempo real
        const name = (v.username || v.nombre || v.name || '').toString().trim();
        if (name && this.nameEl) {
          const clean = name.includes('@') ? name.split('@')[0] : name;
          this.nameEl.textContent = clean;
          console.log('📡 Updated header name from RTDB:', clean);
          this.updateLocalStorage('displayName', clean);
        }
        
        // Actualizar foto en tiempo real
        const photo = (v.foto_url || v.photoURL || '').toString().trim();
        if (photo) {
          this.safeSetAvatar(this.avatarEl, photo);
          console.log('📡 Updated header photo from RTDB:', photo);
          this.updateLocalStorage('photoURL', photo);
        }
        
        // Datos adicionales
        if (v.email) this.updateLocalStorage('email', v.email);
        if (v.accountType) this.updateLocalStorage('accountType', v.accountType);
      }, (error) => {
        console.error('📡 RTDB listener error:', error);
        setTimeout(() => {
          if (!this._rtdbRef) this.attachRtdb(uid);
        }, 3000);
      });
    } catch (e) {
      console.error('🔗 Error setting up RTDB listener:', e);
    }
  };

  AuthHeader.prototype.updateLocalStorage = function (key, value) {
    try {
      const raw = localStorage.getItem('as_user') || localStorage.getItem('user') || '{}';
      const obj = JSON.parse(raw);
      obj[key] = value;
      localStorage.setItem('as_user', JSON.stringify(obj));
      window.dispatchEvent(new CustomEvent('as:user-updated', { detail: { [key]: value } }));
    } catch (e) {
      console.warn('💾 Error updating localStorage:', e);
    }
  };

  AuthHeader.prototype.detachRtdb = function () {
    try { 
      if (this._rtdbRef) { 
        this._rtdbRef.off(); 
        this._rtdbRef = null; 
      } 
    } catch (e) {
      console.warn('Error detaching RTDB:', e);
    }
  };

  AuthHeader.prototype.setVisible = function (show) {
    if (!this.wrap) return;
    this.wrap.style.display = show ? 'flex' : 'none';
    if (show) this.wrap.style.visibility = 'visible';
  };

  AuthHeader.prototype.handleLogout = async function () {
    console.log('🔧 handleLogout called!');
    // Cleanup listeners antes del logout
    this.detachRtdb();
    if (this._authUnsubscribe) {
      this._authUnsubscribe();
      this._authUnsubscribe = null;
    }
    
    try { 
      const auth = this.getAuth(); 
      if (auth) await auth.signOut(); 
    } catch (e) {
      console.warn('Firebase signOut error:', e);
    }
    
    try {
      localStorage.removeItem('user'); 
      localStorage.removeItem('as_user'); 
      localStorage.removeItem('idToken');
      localStorage.removeItem('uid');
      sessionStorage.removeItem('user'); 
      sessionStorage.removeItem('as_user');
    } catch (e) {
      console.warn('Storage cleanup error:', e);
    }
    
    window.location.href = '../index.html';
  };

  AuthHeader.prototype.refreshFromStorage = function () {
    const stored = this.getStoredUser();
    if (stored && this.nameEl && this.avatarEl) {
      const norm = this.normalizeUser(null, stored);
      this.nameEl.textContent = norm.displayName;
      this.safeSetAvatar(this.avatarEl, norm.photoURL);
    }
  };

  AuthHeader.prototype.normalizeUser = function (u, s) {
    var get = function (obj, path) { 
      try { 
        return path.split('.').reduce((o, k) => (o && o[k] != null ? o[k] : null), obj); 
      } catch (_) { 
        return null; 
      } 
    };
    
    // PRIORIDAD ABSOLUTA: username de RTDB
    var username = this.pick(
      get(s, 'username'),     // localStorage username
      get(u, 'username'),     // firebase user username  
      get(s, 'nombre'),       // localStorage nombre
      get(u, 'nombre'),       // firebase user nombre
      get(s, 'displayName'),  // localStorage displayName
      get(u, 'displayName'),  // firebase user displayName
      get(u, 'email')         // fallback email
    );
    
    if (typeof username === 'string' && username.indexOf('@') !== -1) {
      username = username.split('@')[0];
    }
    
    // PRIORIDAD ABSOLUTA: foto_url de RTDB
    var photoURL = this.pick(
      get(s, 'foto_url'),     // localStorage foto_url (desde RTDB)
      get(u, 'foto_url'),     // firebase user foto_url
      get(s, 'photoURL'),     // localStorage photoURL
      get(u, 'photoURL'),     // firebase user photoURL
      get(s, 'avatarUrl'),    // localStorage avatarUrl
      get(u, 'avatarUrl')     // firebase user avatarUrl
    );
    
    return { 
      displayName: (username && username.trim()) || 'User', 
      photoURL: photoURL || AuthHeader.DEFAULT_AVATAR 
    };
  };

  AuthHeader.prototype.pick = function () {
    for (var i = 0; i < arguments.length; i++) { 
      var v = arguments[i]; 
      if (typeof v === 'string' && v.trim().length) return v; 
    }
    return null;
  };

  AuthHeader.prototype.safeSetAvatar = function (img, url) {
    if (!img) return;
    
    // Manejar errores de carga
    img.onerror = () => { 
      img.src = AuthHeader.DEFAULT_AVATAR; 
    };
    
    // Si es una URL válida, usarla directamente
    if (url && (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:'))) {
      img.src = url;
    } else {
      img.src = AuthHeader.DEFAULT_AVATAR;
    }
  };

  AuthHeader.prototype.ensureStyles = function () {
    try {
      const isShadow = !!(this.root && this.root.host);
      const container = isShadow ? this.root : document.head;
      // CSS crítico mejorado
      if (!(container.querySelector && container.querySelector('#as-header-critical-css'))) {
        const critical = document.createElement('style');
        critical.id = 'as-header-critical-css';
        critical.textContent = `
          #authHeader{height:60px!important;min-height:60px!important;max-height:60px!important;background:linear-gradient(135deg,#0e5a8a 0%,#0ea5a6 100%)!important;position:fixed!important;top:0;z-index:1000;width:100%!important}
          #authHeader .as-header__container{height:60px!important;padding:0 1rem!important;display:flex!important;align-items:center!important;justify-content:space-between!important;max-width:1280px;margin:0 auto;position:relative}
          #authHeader .as-header__nav-list{list-style:none!important;margin:0!important;padding:0!important;display:flex!important;gap:1rem!important}
          #authHeader .as-header__nav-link{text-decoration:none!important;color:#fff!important;font-size:14px!important;padding:.3rem .6rem!important}
          #authHeader .as-header__user{display:none!important;align-items:center!important;gap:.6rem!important}
          #authHeader .as-header__user-avatar{width:32px!important;height:32px!important;border-radius:50%!important}
{{ ... }}
          #authHeader .as-header__user-logout{font-size:12px!important;padding:.25rem .6rem!important;background:transparent!important;color:#fff!important;border:2px solid rgba(255,255,255,.9)!important}
        `;
        container.appendChild(critical);
      }

      // Import CSS del componente
      if (!(container.querySelector && container.querySelector('#as-header-import-css'))) {
        const style = document.createElement('style');
        style.id = 'as-header-import-css';
        style.textContent = `@import url("/src/components/css/auth-header.css");`;
        container.appendChild(style);
      }

      // Fallback más agresivo
      setTimeout(() => {
        this.forceCorrectCSS(); // Aplicar estilos inline como último recurso
      }, 100);
    } catch (_) {}
  };

  AuthHeader.prototype.getAuth = function () {
    try { 
      if (typeof firebase !== 'undefined' && firebase.auth) return firebase.auth(); 
    } catch (_) {}
    return null;
  };

  AuthHeader.prototype.waitForFirebaseAuth = function (timeoutMs, intervalMs) {
    timeoutMs = timeoutMs || 3000;
    intervalMs = intervalMs || 120;
    return new Promise((resolve) => {
      var start = Date.now();
      (function loop() {
        if (typeof firebase !== 'undefined' && firebase.auth) return resolve(true);
        if (Date.now() - start > timeoutMs) return resolve(false);
        setTimeout(loop, intervalMs);
      })();
    });
  };

  AuthHeader.prototype.getStoredUser = function () {
    try {
      var parse = function (s) { 
        try { return JSON.parse(s); } catch (e) { return null; } 
      };
      var raw = localStorage.getItem('as_user') || localStorage.getItem('user');
      var u = raw ? parse(raw) : null;
      if (u) return u;
      
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k && k.indexOf('firebase:authUser:') === 0) {
          var fu = parse(localStorage.getItem(k));
          if (fu) return fu;
        }
      }
      return null;
    } catch (_) { return null; }
  };

  // Bootstrap
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      if (document.getElementById('authHeader') && !window.authHeader) {
        window.authHeader = new AuthHeader(document);
      }
    });
  } else {
    if (document.getElementById('authHeader') && !window.authHeader) {
      window.authHeader = new AuthHeader(document);
    }
  }

  // Cleanup al destruir
  AuthHeader.prototype.destroy = function () {
    this.detachRtdb();
    if (this._authUnsubscribe) {
      this._authUnsubscribe();
      this._authUnsubscribe = null;
    }
  };

  try { window.AuthHeader = AuthHeader; } catch (_) {}
})();