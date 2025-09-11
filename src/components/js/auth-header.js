/**
 * AidSync Authenticated Header Component
 * Handles user menu, mobile navigation, and authentication state
 */
class AuthHeader {
  // Static properties
  static authStateChangedCallback = null;
  static currentUser = null;
  static DEFAULT_AVATAR = '/public/assets/img/default-avatar.png';

  constructor() {
    // Initialize DOM elements
    this.initializeElements();
    
    // Set up event listeners and auth state
    this.initialize();
  }

  /**
   * Initialize DOM element references
   */
  initializeElements() {
    // Main elements
    this.authHeader = document.getElementById('authHeader');
    this.userMenu = document.querySelector('.as-header__user-menu');
    this.userMenuButton = document.getElementById('userMenuButton');
    this.userDropdown = document.getElementById('userDropdown');
    
    // Mobile menu elements
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
    
    // Mobile user info elements
    this.mobileUserName = document.getElementById('mobileUserName');
    this.mobileUserEmail = document.getElementById('mobileUserEmail');
    this.mobileUserAvatar = document.getElementById('mobileUserAvatar');
    this.mobileLogoutBtn = document.getElementById('mobileLogoutBtn');
    
    // Dark mode toggle
    this.darkModeToggle = document.querySelector('.as-header__darkmode-btn');
  }

  /**
   * Initialize the component
   */
  async initialize() {
    try {
      this.setupAuthStateListener();
      this.setupEventListeners();
      this.setupMobileMenu();
      this.setupDarkModeToggle();
      this.setupClickOutsideHandlers();
      await this.checkAuthState();
    } catch (error) {
      console.error('Error initializing auth header:', error);
    }
  }

  /**
   * Set up Firebase auth state listener
   */
  setupAuthStateListener() {
    if (typeof firebase !== 'undefined' && firebase.auth) {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.currentUser = user;
          this.updateAuthUI(user);
        } else {
          this.resetUserProfile();
          this.toggleAuthUI(false);
        }
        
        if (this.authStateChangedCallback) {
          this.authStateChangedCallback(user);
        }
      });
    }
  }

  /**
   * Update UI based on authentication state
   * @param {Object} user - Firebase user object
   */
  updateAuthUI(user) {
    if (!user) {
      this.toggleAuthUI(false);
      return;
    }

    this.toggleAuthUI(true);
    this.updateUserProfile(user);
  }

  /**
   * Update user profile in the UI
   * @param {Object} user - Firebase user object
   */
  updateUserProfile(user) {
    const displayName = user.displayName || 'User';
    const email = user.email || '';
    const photoURL = user.photoURL || this.constructor.DEFAULT_AVATAR;

    // Update desktop view
    if (this.userName) this.userName.textContent = displayName;
    if (this.userDisplayName) this.userDisplayName.textContent = displayName;
    if (this.userEmail) this.userEmail.textContent = email;
    if (this.userAvatar) this.userAvatar.src = photoURL;
    if (this.dropdownAvatar) this.dropdownAvatar.src = photoURL;

    // Update mobile view
    if (this.mobileUserName) this.mobileUserName.textContent = displayName;
    if (this.mobileUserEmail) this.mobileUserEmail.textContent = email;
    if (this.mobileUserAvatar) this.mobileUserAvatar.src = photoURL;
  }

  /**
   * Reset user profile to default state
   */
  resetUserProfile() {
    // Reset desktop view
    if (this.userName) this.userName.textContent = 'Guest';
    if (this.userDisplayName) this.userDisplayName.textContent = 'Guest';
    if (this.userEmail) this.userEmail.textContent = '';
    if (this.userAvatar) this.userAvatar.src = this.constructor.DEFAULT_AVATAR;
    if (this.dropdownAvatar) this.dropdownAvatar.src = this.constructor.DEFAULT_AVATAR;

    // Reset mobile view
    if (this.mobileUserName) this.mobileUserName.textContent = 'Guest';
    if (this.mobileUserEmail) this.mobileUserEmail.textContent = '';
    if (this.mobileUserAvatar) this.mobileUserAvatar.src = this.constructor.DEFAULT_AVATAR;
  }

  /**
   * Toggle UI elements based on authentication state
   * @param {boolean} isAuthenticated - Whether the user is authenticated
   */
  toggleAuthUI(isAuthenticated) {
    // Toggle user menu and login button visibility
    if (this.userMenu) {
      this.userMenu.style.display = isAuthenticated ? 'flex' : 'none';
    }

    // Toggle mobile menu items
    const authElements = document.querySelectorAll('[data-auth]');
    authElements.forEach(el => {
      if (el.dataset.auth === 'authenticated') {
        el.style.display = isAuthenticated ? 'block' : 'none';
      } else if (el.dataset.auth === 'guest') {
        el.style.display = isAuthenticated ? 'none' : 'block';
      }
    });
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

    // Logout button
    [this.logoutBtn, this.mobileLogoutBtn].forEach(btn => {
      if (btn) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.handleLogout();
        });
      }
    });
  }

  /**
   * Set up mobile menu functionality
   */
  setupMobileMenu() {
    if (this.burgerButton) {
      this.burgerButton.addEventListener('click', () => {
        const isExpanded = this.burgerButton.getAttribute('aria-expanded') === 'true';
        this.burgerButton.setAttribute('aria-expanded', !isExpanded);
        if (this.mobileMenu) {
          this.mobileMenu.classList.toggle('show', !isExpanded);
          document.body.style.overflow = !isExpanded ? 'hidden' : '';
        }
      });
    }

    if (this.mobileCloseButton) {
      this.mobileCloseButton.addEventListener('click', () => {
        this.closeMobileMenu();
      });
    }
  }

  /**
   * Set up dark mode toggle
   */
  setupDarkModeToggle() {
    if (!this.darkModeToggle) return;

    // Check for saved user preference or system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme ? savedTheme === 'dark' : prefersDark;

    // Apply theme
    this.applyTheme(isDark);

    // Toggle theme on button click
    this.darkModeToggle.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      this.applyTheme(!isDark);
      localStorage.setItem('theme', !isDark ? 'dark' : 'light');
    });
  }

  /**
   * Apply theme to the document
   * @param {boolean} isDark - Whether to apply dark theme
   */
  applyTheme(isDark) {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
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
      if (this.mobileMenu && this.mobileMenu.classList.contains('show') && 
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
    try {
      if (!this.userMenuButton) return;
      
      const isExpanded = this.userMenuButton.getAttribute('aria-expanded') === 'true';
      this.userMenuButton.setAttribute('aria-expanded', !isExpanded);
      if (this.userDropdown) {
        this.userDropdown.classList.toggle('show', !isExpanded);
      }
    } catch (error) {
      console.error('Error toggling user dropdown:', error);
    }
  }
  
  /**
   * Close user dropdown menu
   */
  closeUserDropdown() {
    try {
      if (this.userMenuButton) {
        this.userMenuButton.setAttribute('aria-expanded', 'false');
        if (this.userDropdown) {
          this.userDropdown.classList.remove('show');
        }
      }
    } catch (error) {
      console.error('Error closing user dropdown:', error);
    }
  }
  
  /**
   * Close mobile menu
   */
  closeMobileMenu() {
    try {
      if (this.burgerButton) {
        this.burgerButton.setAttribute('aria-expanded', 'false');
        if (this.mobileMenu) {
          this.mobileMenu.classList.remove('show');
        }
        document.body.style.overflow = '';
      }
    } catch (error) {
      console.error('Error closing mobile menu:', error);
    }
  }

  /**
   * Check authentication state
   */
  async checkAuthState() {
    try {
      if (typeof firebase === 'undefined' || !firebase.auth) {
        console.warn('Firebase Auth not available');
        return false;
      }
      
      const user = firebase.auth().currentUser;
      if (user) {
        this.currentUser = user;
        this.updateAuthUI(user);
        return true;
      } else {
        this.resetUserProfile();
        this.toggleAuthUI(false);
        return false;
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
      return false;
    }
  }

  /**
   * Handle user logout
   */
  async handleLogout() {
    try {
      // Show loading state
      [this.logoutBtn, this.mobileLogoutBtn].forEach(btn => {
        if (btn) {
          const originalText = btn.textContent;
          btn.disabled = true;
          btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Logging out...';
          
          // Reset button state after 3 seconds if logout fails
          setTimeout(() => {
            if (btn) {
              btn.disabled = false;
              btn.textContent = originalText;
            }
          }, 3000);
        }
      });

      // Sign out from Firebase
      if (typeof firebase !== 'undefined' && firebase.auth) {
        await firebase.auth().signOut();
      }
      
      // Clear any stored user data
      localStorage.removeItem('user');
      sessionStorage.removeItem('user');
      
      // Redirect to home page after logout
      window.location.href = '/';
      
    } catch (error) {
      console.error('Error during logout:', error);
      
      // Reset button state
      [this.logoutBtn, this.mobileLogoutBtn].forEach(btn => {
        if (btn) {
          btn.disabled = false;
          btn.textContent = 'Logout';
        }
      });
      
      // Show error message to user
      alert('Failed to log out. Please try again.');
    }
  }
}

// Initialize the auth header when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Only initialize if the auth header exists on the page
  if (document.getElementById('authHeader')) {
    window.authHeader = new AuthHeader();
  }
});
