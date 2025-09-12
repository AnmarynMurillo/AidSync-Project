/**
 * AidSync Authenticated Header Component
 * Handles user menu, mobile navigation, theme, auth state, and session timeout/extend
 */
class AuthHeader {
  static DEFAULT_AVATAR = '/public/assets/img/default-avatar.png';
  static SESSION_KEY = 'as_session_expires_at';
  static WARNING_KEY = 'as_session_warning_at';
  static SESSION_DURATION_MS = 60 * 60 * 1000; // 1 hour
  static WARNING_DURATION_MS = 60 * 1000; // 1 minute

  constructor() {
    // ...existing code...
    this.initializeElements();
    this.sessionTimers = { check: null, countdown: null };
    this.isAuthenticated = false; // nuevo estado centralizado
    this.initialize();
  }

  /**
   * Initialize DOM element references
   */
  initializeElements() {
    // Main elements
    this.authHeader = document.getElementById('authHeader');
    // Permitir configurar si el componente debe autoiniciar sesión cuando no existan timestamps.
    // data-autostart-session="false" desactiva esta función; por defecto, true.
    this.autoStartSession = !this.authHeader || this.authHeader.dataset.autostartSession !== 'false';

    this.userMenu = document.querySelector('.as-header__user-menu');
    this.userMenuButton = document.getElementById('userMenuButton');
    this.userDropdown = document.getElementById('userDropdown');
    // Mobile
    this.burgerButton = document.querySelector('.as-header__burger');
    this.mobileMenu = document.getElementById('as-header__mobile-menu');
    this.mobileCloseButton = document.querySelector('.as-header__mobile-close');
    // User info elements
    this.userName = document.getElementById('userName');
    this.userDisplayName = document.getElementById('dropdownName');
    this.userEmail = document.getElementById('dropdownEmail');
    this.userAvatar = document.getElementById('userAvatar');
    this.dropdownAvatar = document.getElementById('dropdownAvatar');
    this.logoutBtn = document.getElementById('logoutBtn');
    this.headerLogoutBtn = document.getElementById('headerLogoutBtn');
    
    // Mobile user info elements
    this.mobileUserName = document.getElementById('mobileUserName');
    this.mobileUserEmail = document.getElementById('mobileUserEmail');
    this.mobileUserAvatar = document.getElementById('mobileUserAvatar');
    this.mobileLogoutBtn = document.getElementById('mobileLogoutBtn');
    
    // Dark mode toggle
    this.darkModeToggles = Array.from(document.querySelectorAll('.as-header__icon-btn'));
    
    // Session modal elements
    this.sessionModal = document.getElementById('as-session-modal');
    this.sessionCountdownEl = document.getElementById('sessionCountdown');
    this.sessionExtendBtn = document.getElementById('sessionExtendBtn');
    this.sessionLogoutBtn = document.getElementById('sessionLogoutBtn');
  }

  /**
   * Initialize the component
   */
  async initialize() {
    try {
      this.setupEventListeners();
      this.setupMobileMenu();
      this.setupDarkModeToggle();
      this.setupClickOutsideHandlers();
      await this.checkAuthState();
      this.setupSessionManagement();
    } catch (error) {
      console.error('Error initializing auth header:', error);
    }
  }

  // --- Auth state (Firebase optional) ---
  /**
   * Check authentication state
   */
  async checkAuthState() {
    try {
      if (typeof firebase === 'undefined' || !firebase.auth) {
        const expiresAt = parseInt(localStorage.getItem(AuthHeader.SESSION_KEY) || '0', 10);
        const now = Date.now();
        if (!expiresAt || now >= expiresAt) {
          if (this.autoStartSession) {
            // Autoiniciar sesión local para el header autenticado
            this.setSessionExpiry(now + AuthHeader.SESSION_DURATION_MS);
            this.isAuthenticated = true;
          } else {
            this.isAuthenticated = false;
          }
        } else {
          this.isAuthenticated = true;
        }
        // Cargar información de usuario si hay sesión válida
        if (this.isAuthenticated) {
          const u = this.getStoredUser();
          if (u) this.updateAuthUI(u);
          else this.toggleAuthUI(true);
        } else {
          this.resetUserProfile();
          this.toggleAuthUI(false);
        }
        return this.isAuthenticated;
      }

      const user = firebase.auth().currentUser;
      if (user) {
        this.updateAuthUI(user);
        this.isAuthenticated = true;
        return true;
      } else {
        this.resetUserProfile();
        this.toggleAuthUI(false);
        this.isAuthenticated = false;
        return false;
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
      this.isAuthenticated = false;
      return false;
    }
  }

  // Helpers para normalizar y leer usuario almacenado
  pick(...vals) { return vals.find(v => typeof v === 'string' && v.trim().length) || null; }
  normalizeUser(u) {
    if (!u) return null;
    const displayName = this.pick(u.displayName, u.name, u.username, u.fullName,
      u?.profile?.name,
      [u.given_name, u.family_name].filter(Boolean).join(' ').trim(),
      [u.firstName, u.lastName].filter(Boolean).join(' ').trim());
    const email = this.pick(u.email, u.mail, u.emailAddress, u?.profile?.email);
    const photoURL = this.pick(u.photoURL, u.picture, u.avatarUrl, u.avatar, u?.profile?.avatarUrl);
    return {
      displayName: displayName || 'User',
      email: email || '',
      photoURL: photoURL || AuthHeader.DEFAULT_AVATAR,
    };
  }

  getStoredUser() {
    try {
      const tryParse = (raw) => { try { return JSON.parse(raw); } catch { return null; } };
      // Claves comunes
      const raw = localStorage.getItem('user') || localStorage.getItem('as_user') ||
                  sessionStorage.getItem('user') || sessionStorage.getItem('as_user');
      let u = raw ? tryParse(raw) : null;
      if (!u) {
        // Intento con claves de Firebase persistidas
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && k.startsWith('firebase:authUser:')) {
            u = tryParse(localStorage.getItem(k));
            if (u) break;
          }
        }
      }
      return u ? this.normalizeUser(u) : null;
    } catch (_) { return null; }
  }

  refreshUserFromStorage() {
    const u = this.getStoredUser();
    if (u) this.updateAuthUI(u);
  }

  /**
   * Update UI based on authentication state
   * @param {Object} user - Firebase user object
   */
  updateAuthUI(user) {
    if (!user) { this.toggleAuthUI(false); return; }
    // Acepta tanto objetos Firebase como normalizados
    const norm = this.normalizeUser(user);

    // Update desktop view
    if (this.userName) this.userName.textContent = norm.displayName;
    if (this.userDisplayName) this.userDisplayName.textContent = norm.displayName;
    if (this.userEmail) this.userEmail.textContent = norm.email;
    if (this.userAvatar) this.userAvatar.src = norm.photoURL;
    if (this.dropdownAvatar) this.dropdownAvatar.src = norm.photoURL;

    // Update mobile view
    if (this.mobileUserName) this.mobileUserName.textContent = norm.displayName;
    if (this.mobileUserEmail) this.mobileUserEmail.textContent = norm.email;
    if (this.mobileUserAvatar) this.mobileUserAvatar.src = norm.photoURL;

    this.toggleAuthUI(true);
  }

  /**
   * Reset user profile to default state
   */
  resetUserProfile() {
    // Reset desktop view
    if (this.userName) this.userName.textContent = 'Guest';
    if (this.userDisplayName) this.userDisplayName.textContent = 'Guest';
    if (this.userEmail) this.userEmail.textContent = '';
    if (this.userAvatar) this.userAvatar.src = AuthHeader.DEFAULT_AVATAR;
    if (this.dropdownAvatar) this.dropdownAvatar.src = AuthHeader.DEFAULT_AVATAR;

    // Reset mobile view
    if (this.mobileUserName) this.mobileUserName.textContent = 'Guest';
    if (this.mobileUserEmail) this.mobileUserEmail.textContent = '';
    if (this.mobileUserAvatar) this.mobileUserAvatar.src = AuthHeader.DEFAULT_AVATAR;
  }

  /**
   * Toggle UI elements based on authentication state
   * @param {boolean} isAuthenticated - Whether the user is authenticated
   */
  toggleAuthUI(isAuthenticated) {
    // Mostrar/ocultar elementos por estado
    if (this.userMenu) {
      this.userMenu.style.display = isAuthenticated ? 'flex' : 'none';
    }
    const authElements = document.querySelectorAll('[data-auth]');
    authElements.forEach(el => {
      if (el.dataset.auth === 'authenticated') {
        el.style.display = isAuthenticated ? '' : 'none';
      } else if (el.dataset.auth === 'guest') {
        el.style.display = isAuthenticated ? 'none' : '';
      }
    });
  }

  // --- NUEVO: obtener usuario almacenado ---
  getStoredUser() {
    try {
      const tryParse = (raw) => { try { return JSON.parse(raw); } catch { return null; } };
      // Claves comunes
      const raw = localStorage.getItem('user') || localStorage.getItem('as_user') ||
                  sessionStorage.getItem('user') || sessionStorage.getItem('as_user');
      let u = raw ? tryParse(raw) : null;
      if (!u) {
        // Intento con claves de Firebase persistidas
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && k.startsWith('firebase:authUser:')) {
            u = tryParse(localStorage.getItem(k));
            if (u) break;
          }
        }
      }
      return u ? this.normalizeUser(u) : null;
    } catch (_) { return null; }
  }

  refreshUserFromStorage() {
    const u = this.getStoredUser();
    if (u) this.updateAuthUI(u);
  }

  /**
   * Set up event listeners
   */
  setupEventListeners() {
    // User menu toggle
    if (this.userMenuButton) {
      this.userMenuButton.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleUserDropdown();
      });
    }

    // Logout buttons (dropdown, mobile, header visible)
    [this.logoutBtn, this.mobileLogoutBtn, this.headerLogoutBtn].forEach(btn => {
      if (btn) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.handleLogout();
        });
      }
    });

    // Session extend and logout buttons
    if (this.sessionExtendBtn) {
      this.sessionExtendBtn.addEventListener('click', () => this.extendSession(true));
    }
    if (this.sessionLogoutBtn) {
      this.sessionLogoutBtn.addEventListener('click', () => this.handleLogout());
    }
  }

  /**
   * Set up mobile menu functionality
   */
  setupMobileMenu() {
    if (this.burgerButton) {
      this.burgerButton.addEventListener('click', () => {
        const isExpanded = this.burgerButton.getAttribute('aria-expanded') === 'true';
        this.burgerButton.setAttribute('aria-expanded', String(!isExpanded));
        if (this.mobileMenu) {
          this.mobileMenu.classList.toggle('open', !isExpanded);
          document.body.style.overflow = !isExpanded ? 'hidden' : '';
        }
      });
    }

    if (this.mobileCloseButton) {
      this.mobileCloseButton.addEventListener('click', () => this.closeMobileMenu());
    }
  }

  /**
   * Set up dark mode toggle
   */
  setupDarkModeToggle() {
    if (!this.darkModeToggles || !this.darkModeToggles.length) return;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme ? savedTheme === 'dark' : prefersDark;
    this.applyTheme(isDark);
    this.darkModeToggles.forEach(btn => btn.addEventListener('click', () => {
      const nowDark = document.documentElement.getAttribute('data-theme') === 'dark';
      this.applyTheme(!nowDark);
      localStorage.setItem('theme', !nowDark ? 'dark' : 'light');
    }));
  }

  /**
   * Apply theme to the document
   * @param {boolean} isDark - Whether to apply dark theme
   */
  applyTheme(isDark) {
    if (isDark) document.documentElement.setAttribute('data-theme', 'dark');
    else document.documentElement.removeAttribute('data-theme');
  }

  /**
   * Set up click outside handlers for dropdowns
   */
  setupClickOutsideHandlers() {
    document.addEventListener('click', (e) => {
      // Close user dropdown when clicking outside
      if (this.userMenuButton && !this.userMenuButton.contains(e.target) && 
          this.userDropdown && !this.userDropdown.contains(e.target)) {
        this.closeUserDropdown();
      }
      
      // Close mobile menu when clicking outside
      if (this.mobileMenu && this.mobileMenu.classList.contains('open') && 
          !this.mobileMenu.contains(e.target) && 
          this.burgerButton && !this.burgerButton.contains(e.target)) {
        this.closeMobileMenu();
      }
    });
  }

  /**
   * Toggle user dropdown menu
   */
  toggleUserDropdown() {
    const isExpanded = this.userMenuButton && this.userMenuButton.getAttribute('aria-expanded') === 'true';
    if (this.userMenuButton) this.userMenuButton.setAttribute('aria-expanded', String(!isExpanded));
    if (this.userDropdown) this.userDropdown.dataset.visible = (!isExpanded).toString();
    if (this.userMenu) this.userMenu.setAttribute('aria-expanded', String(!isExpanded));
  }

  /**
   * Close user dropdown menu
   */
  closeUserDropdown() {
    if (this.userMenuButton) this.userMenuButton.setAttribute('aria-expanded', 'false');
    if (this.userDropdown) this.userDropdown.dataset.visible = 'false';
    if (this.userMenu) this.userMenu.setAttribute('aria-expanded', 'false');
  }

  /**
   * Close mobile menu
   */
  closeMobileMenu() {
    if (this.burgerButton) this.burgerButton.setAttribute('aria-expanded', 'false');
    if (this.mobileMenu) this.mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }

  // --- Session handling ---
  /**
   * Set up session management
   */
  setupSessionManagement() {
    // Gestionar sesión únicamente si el usuario está autenticado
    const expiresAt = parseInt(localStorage.getItem(AuthHeader.SESSION_KEY) || '0', 10);

    if (this.isAuthenticated) {
      if (!expiresAt || Date.now() >= expiresAt) {
        // Crear o renovar una sesión válida
        this.setSessionExpiry(Date.now() + AuthHeader.SESSION_DURATION_MS);
      }
      this.startSessionCheckLoop();
    } else {
      this.clearSessionTimers();
      // Si no hay sesión válida, aseguramos que el modal esté oculto
      this.hideSessionModal();
    }
  }

  /**
   * Set session expiry timestamp
   * @param {number} ts - Timestamp in milliseconds
   */
  setSessionExpiry(ts) {
    localStorage.setItem(AuthHeader.SESSION_KEY, String(ts));
    localStorage.removeItem(AuthHeader.WARNING_KEY);
  }

  /**
   * Start the session check loop
   */
  startSessionCheckLoop() {
    this.clearSessionTimers();
    const check = () => {
      const now = Date.now();
      const expiresAt = parseInt(localStorage.getItem(AuthHeader.SESSION_KEY) || '0', 10);
      if (!expiresAt) return;
      const msLeft = expiresAt - now;
      if (msLeft <= 0) {
        this.autoLogout();
        return;
      }
      if (msLeft <= AuthHeader.WARNING_DURATION_MS) {
        const warnedAt = parseInt(localStorage.getItem(AuthHeader.WARNING_KEY) || '0', 10);
        if (!warnedAt) {
          localStorage.setItem(AuthHeader.WARNING_KEY, String(now));
          this.showSessionModal(Math.ceil(msLeft / 1000));
        }
      } else {
        this.hideSessionModal();
        localStorage.removeItem(AuthHeader.WARNING_KEY);
      }
      // Sincronizar perfil en esta pestaña si cambia en storage
      const u = this.getStoredUser();
      if (u) {
        const dn = u.displayName;
        if (this.userName && this.userName.textContent !== dn) {
          this.updateAuthUI(u);
        }
      }
    };
    check();
    this.sessionTimers.check = setInterval(check, 1000);

    window.addEventListener('storage', (e) => {
      if (e.key === AuthHeader.SESSION_KEY || e.key === AuthHeader.WARNING_KEY) {
        const now = Date.now();
        const expiresAt = parseInt(localStorage.getItem(AuthHeader.SESSION_KEY) || '0', 10);
        const msLeft = expiresAt - now;
        if (msLeft <= 0) this.autoLogout();
        else if (msLeft <= AuthHeader.WARNING_DURATION_MS) this.showSessionModal(Math.ceil(msLeft / 1000));
        else this.hideSessionModal();
      }
      if (e.key === 'user' || e.key === 'as_user' || (e.key && e.key.startsWith('firebase:authUser:'))) {
        this.refreshUserFromStorage();
      }
    });
  }

  /**
   * Show session warning modal
   * @param {number} seconds - Seconds until session expires
   */
  showSessionModal(seconds) {
    if (!this.sessionModal) return;
    this.sessionModal.setAttribute('aria-hidden', 'false');
    this.updateCountdown(seconds);
    this.clearCountdown();
    let remaining = seconds;
    this.sessionTimers.countdown = setInterval(() => {
      remaining -= 1;
      this.updateCountdown(Math.max(remaining, 0));
      if (remaining <= 0) {
        this.clearCountdown();
        this.autoLogout();
      }
    }, 1000);
  }

  /**
   * Hide session warning modal
   */
  hideSessionModal() {
    if (!this.sessionModal) return;
    this.sessionModal.setAttribute('aria-hidden', 'true');
    this.clearCountdown();
  }

  /**
   * Update countdown display in the session modal
   * @param {number} sec - Seconds remaining
   */
  updateCountdown(sec) {
    if (this.sessionCountdownEl) this.sessionCountdownEl.textContent = String(sec);
  }

  /**
   * Clear session timers
   */
  clearSessionTimers() {
    if (this.sessionTimers.check) clearInterval(this.sessionTimers.check);
    if (this.sessionTimers.countdown) clearInterval(this.sessionTimers.countdown);
    this.sessionTimers.check = null;
    this.sessionTimers.countdown = null;
  }

  /**
   * Clear countdown timer
   */
  clearCountdown() {
    if (this.sessionTimers.countdown) clearInterval(this.sessionTimers.countdown);
    this.sessionTimers.countdown = null;
  }

  /**
   * Extend the session expiry
   * @param {boolean} hideModal - Whether to hide the warning modal after extending
   */
  extendSession(hideModal = false) {
    this.setSessionExpiry(Date.now() + AuthHeader.SESSION_DURATION_MS);
    if (hideModal) this.hideSessionModal();
    // Reiniciar el bucle de verificación para tomar el nuevo tiempo
    this.startSessionCheckLoop();
  }

  /**
   * Automatically log out the user
   */
  async autoLogout() {
    try {
      // Asegurar limpieza de timers y modal antes de salir
      this.hideSessionModal();
      this.clearSessionTimers();
      await this.handleLogout(true);
    } catch (e) {
      this.redirectToHome();
    }
  }

  /**
   * Handle user logout
   * @param {boolean} silent - Whether to suppress UI feedback during logout
   */
  async handleLogout(silent = false) {
    try {
      // Button loading state (only if not silent)
      if (!silent) {
        [this.logoutBtn, this.mobileLogoutBtn].forEach(btn => {
          if (btn) {
            const originalText = btn.textContent;
            btn.disabled = true;
            btn.dataset.original = originalText;
            btn.textContent = 'Logging out...';
          }
        });
      }
      
      // Sign out from Firebase
      if (typeof firebase !== 'undefined' && firebase.auth) {
        await firebase.auth().signOut();
      }
      
      // Clear local/session storage
      localStorage.removeItem(AuthHeader.SESSION_KEY);
      localStorage.removeItem(AuthHeader.WARNING_KEY);
      localStorage.removeItem('user');
      sessionStorage.removeItem('user');
      this.clearSessionTimers();
      this.hideSessionModal();
      this.redirectToHome();
    } catch (err) {
      console.error('Error during logout:', err);
      
      // Reset button state
      [this.logoutBtn, this.mobileLogoutBtn].forEach(btn => {
        if (btn) {
          btn.disabled = false;
          btn.textContent = btn.dataset.original || 'Logout';
        }
      });
      
      if (!silent) alert('Failed to log out. Please try again.');
    }
  }

  /**
   * Redirect to the home page
   */
  redirectToHome() {
    window.location.href = '/index.html';
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('authHeader')) {
    window.authHeader = new AuthHeader();
  }
});
