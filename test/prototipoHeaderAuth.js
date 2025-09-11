/**
 * AidSync Authenticated Header Component
 * Handles user menu, mobile navigation, and authentication state
 */
class AuthHeader {
    // Firebase auth state observer
    static authStateChangedCallback = null;
    
    // Current user data
    static currentUser = null;
    
    // Default user avatar
    static DEFAULT_AVATAR = '/public/assets/img/default-avatar.png';
    constructor() {
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
      
      this.init();
    }
  
    async init() {
      try {
        // Initialize Firebase Auth state observer
        this.setupAuthStateListener();
        
        // Setup UI components
        this.setupEventListeners();
        this.setupMobileMenu();
        this.setupDarkModeToggle();
        this.setupClickOutsideHandlers();
        
        // Check initial auth state
        await this.checkAuthState();
      } catch (error) {
        console.error('Error initializing auth header:', error);
      }
    }
    
    // Setup Firebase Auth state listener
    setupAuthStateListener() {
      firebase.auth().onAuthStateChanged((user) => {
        this.currentUser = user;
        this.updateAuthUI(user);
        
        // Call the callback if it exists
        if (typeof AuthHeader.authStateChangedCallback === 'function') {
          AuthHeader.authStateChangedCallback(user);
        }
      });
    }
    
    // Update UI based on auth state
    updateAuthUI(user) {
      if (user) {
        // User is signed in
        this.updateUserProfile(user);
        this.toggleAuthUI(true);
      } else {
        // User is signed out
        this.resetUserProfile();
        this.toggleAuthUI(false);
      }
    }
    
    // Update user profile in the UI
    updateUserProfile(user) {
      const displayName = user.displayName || 'User';
      const email = user.email || '';
      const photoURL = user.photoURL || '/public/assets/img/default-avatar.png';
      
      // Update desktop user info
      if (this.userName) this.userName.textContent = displayName;
      if (this.userDisplayName) this.userDisplayName.textContent = displayName;
      if (this.userEmail) this.userEmail.textContent = email;
      if (this.userAvatar) this.userAvatar.src = photoURL;
      if (this.dropdownAvatar) this.dropdownAvatar.src = photoURL;
      
      // Update mobile user info
      if (this.mobileUserName) this.mobileUserName.textContent = displayName;
      if (this.mobileUserEmail) this.mobileUserEmail.textContent = email;
      if (this.mobileUserAvatar) this.mobileUserAvatar.src = photoURL;
    }
    
    // Reset user profile to default
    resetUserProfile() {
      // Reset desktop user info
      if (this.userName) this.userName.textContent = 'Guest';
      if (this.userDisplayName) this.userDisplayName.textContent = 'Guest';
      if (this.userEmail) this.userEmail.textContent = 'guest@example.com';
      if (this.userAvatar) this.userAvatar.src = '/public/assets/img/default-avatar.png';
      if (this.dropdownAvatar) this.dropdownAvatar.src = '/public/assets/img/default-avatar.png';
      
      // Reset mobile user info
      if (this.mobileUserName) this.mobileUserName.textContent = 'Guest';
      if (this.mobileUserEmail) this.mobileUserEmail.textContent = 'guest@example.com';
      if (this.mobileUserAvatar) this.mobileUserAvatar.src = '/public/assets/img/default-avatar.png';
    }
    
    // Toggle UI elements based on auth state
    toggleAuthUI(isAuthenticated) {
      // Toggle user menu
      if (this.userMenu) {
        this.userMenu.style.display = isAuthenticated ? 'block' : 'none';
      }
      
      // Toggle login/logout buttons
      const loginButtons = document.querySelectorAll('.login-btn');
      const logoutButtons = document.querySelectorAll('.logout-btn');
      
      loginButtons.forEach(btn => {
        btn.style.display = isAuthenticated ? 'none' : 'block';
      });
      
      logoutButtons.forEach(btn => {
        btn.style.display = isAuthenticated ? 'block' : 'none';
      });
    }
  
    setupEventListeners() {
      // User menu toggle
      if (this.userMenuButton) {
        this.userMenuButton.addEventListener('click', (e) => {
          e.stopPropagation();
          const isExpanded = this.userMenuButton.getAttribute('aria-expanded') === 'true';
          this.userMenuButton.setAttribute('aria-expanded', !isExpanded);
          this.userDropdown.classList.toggle('show', !isExpanded);
        });
      }
      
      // Logout button
      if (this.logoutBtn) {
        this.logoutBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.handleLogout();
        });
      }
      
      // Mobile logout button
      if (this.mobileLogoutBtn) {
        this.mobileLogoutBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.handleLogout();
        });
      }
      
      // Close dropdown when clicking outside
      document.addEventListener('click', (e) => {
        if (this.userMenuButton && !this.userMenuButton.contains(e.target) && 
            this.userDropdown && !this.userDropdown.contains(e.target)) {
          this.userMenuButton.setAttribute('aria-expanded', 'false');
          this.userDropdown.classList.remove('show');
        }
      });
      
      // Handle keyboard navigation
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.closeDropdowns();
        }
      });
    }
    
    async checkAuthState() {
      try {
        const user = firebase.auth().currentUser;
        if (user) {
          this.currentUser = user;
          this.updateUserProfile(user);
          this.toggleAuthUI(true);
        } else {
          this.toggleAuthUI(false);
        }
      } catch (error) {
        console.error('Error checking auth state:', error);
        this.toggleAuthUI(false);
      }
    }
    
    async handleLogout() {
      try {
        await firebase.auth().signOut();
        // Reset UI
        this.resetUserProfile();
        this.toggleAuthUI(false);
        // Close any open dropdowns
        this.closeDropdowns();
        // Redirect to home page
        window.location.href = '/index.html';
      } catch (error) {
        console.error('Error signing out:', error);
        alert('Error signing out. Please try again.');
      }
    }
    
    closeDropdowns() {
      if (this.userMenuButton) {
        this.userMenuButton.setAttribute('aria-expanded', 'false');
      }
      if (this.userDropdown) {
        this.userDropdown.classList.remove('show');
      }
      if (this.mobileMenu) {
        this.mobileMenu.classList.remove('show');
        document.body.style.overflow = '';
      }
      if (this.burgerButton) {
        this.burgerButton.setAttribute('aria-expanded', 'false');
      }
    }
    
    setupMobileMenu() {
      // Mobile menu toggle
      if (this.burgerButton) {
        this.burgerButton.addEventListener('click', (e) => {
          e.stopPropagation();
          const isExpanded = this.burgerButton.getAttribute('aria-expanded') === 'true';
          this.burgerButton.setAttribute('aria-expanded', !isExpanded);
          this.mobileMenu.classList.toggle('show', !isExpanded);
          document.body.style.overflow = !isExpanded ? 'hidden' : '';
          
          // Close other dropdowns
          if (!isExpanded) {
            this.closeDropdowns();
            this.mobileMenu.classList.add('show');
          }
        });
      }
  
      // Close mobile menu
      if (this.mobileCloseButton) {
        this.mobileCloseButton.addEventListener('click', (e) => {
          e.stopPropagation();
          this.closeDropdowns();
        });
      }
      
      // Close mobile menu when clicking on a link
      const mobileLinks = this.mobileMenu?.querySelectorAll('a');
      if (mobileLinks) {
        mobileLinks.forEach(link => {
          link.addEventListener('click', () => {
            this.closeDropdowns();
          });
        });
      }
    }
    
    setupDarkModeToggle() {
      // Get all theme toggles
      const themeToggles = [
        this.darkModeToggle,
        document.getElementById('mobileThemeToggle')
      ].filter(Boolean);
      
      if (themeToggles.length === 0) return;
      
      // Check for saved user preference or system preference
      const applyTheme = (isDark) => {
        if (isDark) {
          document.documentElement.setAttribute('data-theme', 'dark');
          themeToggles.forEach(toggle => {
            if (toggle.tagName === 'BUTTON') {
              toggle.setAttribute('aria-pressed', 'true');
            } else {
              toggle.checked = true;
            }
          });
        } else {
          document.documentElement.removeAttribute('data-theme');
          themeToggles.forEach(toggle => {
            if (toggle.tagName === 'BUTTON') {
              toggle.setAttribute('aria-pressed', 'false');
            } else {
              toggle.checked = false;
            }
          });
        }
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
      };
      
      // Check saved theme or system preference
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        applyTheme(true);
      } else {
        applyTheme(false);
      }
      
      // Add event listeners to all theme toggles
      themeToggles.forEach(toggle => {
        toggle.addEventListener('change', (e) => {
          const isDark = toggle.tagName === 'BUTTON' 
            ? toggle.getAttribute('aria-pressed') === 'true'
            : toggle.checked;
          applyTheme(!isDark);
        });
      });
      
      // Listen for system theme changes
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
          applyTheme(e.matches);
        }
      });
    }
    
    setupClickOutsideHandlers() {
      // Close dropdown when clicking outside
      document.addEventListener('click', (e) => {
        if (this.userMenu && !this.userMenu.contains(e.target)) {
          this.closeDropdowns();
        }
        
        // Close mobile menu when clicking outside
        if (this.mobileMenu && this.mobileMenu.classList.contains('show') && 
            !this.mobileMenu.contains(e.target) && 
              this.burgerButton && !this.burgerButton.contains(e.target)) {
            this.closeMobileMenu();
          }
        });
      } catch (error) {
        console.error('Error setting up click outside handlers:', error);
      }
    }
    
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
  
    async checkAuthState() {
      try {
        // Check if user is logged in using Firebase
        const user = firebase.auth().currentUser;
        
        if (user) {
          // User is signed in
          this.currentUser = user;
          this.updateAuthUI(user);
          return true;
        } else {
          // No user is signed in
          this.resetUserProfile();
          this.toggleAuthUI(false);
          return false;
        }
      } catch (error) {
        console.error('Error checking auth state:', error);
        this.redirectToLogin();
        return false;
      }
    }
  
    async checkIfUserIsLoggedIn() {
      try {
        // Check Firebase auth state
        return firebase.auth().currentUser !== null;
      } catch (error) {
        console.error('Error checking if user is logged in:', error);
        return false;
      }
        // Example for Firebase:
        // const user = firebase.auth().currentUser;
        // return !!user;
        
        // For demo purposes, check localStorage
        return localStorage.getItem('isLoggedIn') === 'true';
      } catch (error) {
        console.error('Error checking if user is logged in:', error);
        return false;
      }
    }
  
    async loadUserData() {
      try {
        // Get user data from your authentication service
        const userData = await this.fetchUserData();
        
        if (userData) {
          this.updateUserUI(userData);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    }
  
    async fetchUserData() {
      try {
        // Replace with your actual user data fetching logic
        // Example for Firebase:
        // const user = firebase.auth().currentUser;
        // if (user) {
        //   const token = await user.getIdToken();
        //   const response = await fetch('/api/user/profile', {
        //     headers: { 'Authorization': `Bearer ${token}` }
        //   });
        //   if (!response.ok) throw new Error('Failed to fetch user data');
        //   return await response.json();
        // }
        
        // For demo purposes, return mock data
        return {
          name: 'John Doe',
          email: 'john.doe@example.com',
          avatar: '/public/assets/img/default-avatar.png',
          role: 'volunteer' // or 'admin', 'donor', etc.
        };
      } catch (error) {
        console.error('Error fetching user data:', error);
        throw error; // Re-throw to be handled by the caller
      }
    }
  
    updateUserUI(userData) {
      try {
        if (!userData) return;
        
        // Update desktop UI
        if (this.userName) this.userName.textContent = userData.name.split(' ')[0]; // First name only
        if (this.userDisplayName) this.userDisplayName.textContent = userData.name;
        if (this.userEmail) this.userEmail.textContent = userData.email;
        
        // Update mobile UI
        if (this.mobileUserName) this.mobileUserName.textContent = userData.name;
        if (this.mobileUserEmail) this.mobileUserEmail.textContent = userData.email;
        
        // Update avatars
        const avatarUrl = userData.avatar || '/public/assets/img/default-avatar.png';
        [this.userAvatar, this.dropdownAvatar, this.mobileUserAvatar].forEach(el => {
          if (el) el.src = avatarUrl;
        });
        
        // Update UI based on user role if needed
        this.updateUIBasedOnRole(userData.role);
      } catch (error) {
        console.error('Error updating user UI:', error);
      }
    }
  
    updateUIBasedOnRole(role) {
      try {
        // Example: Add role-specific UI updates here
        // if (role === 'admin') { ... }
        // This is a placeholder for role-based UI updates
      } catch (error) {
        console.error('Error updating UI based on role:', error);
      }
    }
  
    async handleLogout() {
      try {
        // Show loading state
        [this.logoutBtn, this.mobileLogoutBtn].forEach(btn => {
          if (btn) {
            const originalText = btn.textContent;
            btn.disabled = true;
            btn.innerHTML = '<span class="spinner">Logging out...</span>';
            
            // Reset button state after 2 seconds if logout fails
            setTimeout(() => {
              if (btn && btn.disabled) {
                btn.disabled = false;
                btn.textContent = originalText;
              }
            }, 2000);
          }
        });
        
        // Perform logout
        await this.performLogout();
        
        // Clear any stored auth data
        localStorage.removeItem('isLoggedIn');
        
        // Redirect to login page
        window.location.href = '/public/pages/login.html';
      } catch (error) {
        console.error('Error during logout:', error);
        alert('Failed to log out. Please try again.');
        
        // Reset buttons
        [this.logoutBtn, this.mobileLogoutBtn].forEach(btn => {
          if (btn) {
            btn.disabled = false;
            btn.textContent = 'Logout';
          }
        });
      }
    }
  
    async performLogout() {
      try {
        // Example for Firebase:
        // await firebase.auth().signOut();
        
        // Clear auth state
        localStorage.removeItem('isLoggedIn');
        // Add any other cleanup needed
        
        return new Promise((resolve) => {
          // Simulate network delay
          setTimeout(resolve, 500);
        });
      } catch (error) {
        console.error('Error performing logout:', error);
        throw error;
      }
    }
  
    redirectToLogin() {
      try {
        // Don't redirect if we're already on the login page
        if (!window.location.pathname.includes('login.html')) {
          window.location.href = '/public/pages/login.html';
        }
      } catch (error) {
        console.error('Error during login redirect:', error);
        // Fallback to default login page if there's an error
        window.location.href = '/public/pages/login.html';
      }
    }
  
    showAuthHeader() {
      try {
        if (!this.authHeader) return;
        
        this.authHeader.style.display = 'block';
        
        // Add animation class
        this.authHeader.classList.add('as-header--visible');
        
        // Trigger reflow
        void this.authHeader.offsetWidth;
        
        // Add active class for animation
        this.authHeader.classList.add('as-header--active');
      } catch (error) {
        console.error('Error showing auth header:', error);
      }
    }
  
    hideAuthHeader() {
      try {
        if (!this.authHeader) return;
        
        this.authHeader.classList.remove('as-header--active');
        
        // Wait for animation to complete before hiding
        setTimeout(() => {
          if (this.authHeader) {
            this.authHeader.style.display = 'none';
          }
        }, 300); // Match this with your CSS transition duration
      } catch (error) {
        console.error('Error hiding auth header:', error);
      }
    }
  
  // Initialize when DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    try {
      // Only initialize if the auth header exists on the page
      if (document.getElementById('authHeader')) {
        new AuthHeader();
      }
    } catch (error) {
      console.error('Failed to initialize auth header:', error);
    }
  });
  