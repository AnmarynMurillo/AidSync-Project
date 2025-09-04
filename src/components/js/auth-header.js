/**
 * AidSync Authenticated Header Component
 * Handles user menu, mobile navigation, and authentication state
 */
class AuthHeader {
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
      await this.checkAuthState();
      this.setupEventListeners();
      this.setupMobileMenu();
      this.setupDarkModeToggle();
      this.setupClickOutsideHandlers();
    } catch (error) {
      console.error('Error initializing auth header:', error);
    }
  }

  setupEventListeners() {
    try {
      // Toggle user dropdown menu
      if (this.userMenuButton) {
        this.userMenuButton.addEventListener('click', (e) => {
          e.stopPropagation();
          this.toggleUserDropdown();
        });
      }

      // Logout buttons
      [this.logoutBtn, this.mobileLogoutBtn].forEach(btn => {
        if (btn) {
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleLogout();
          });
        }
      });
      
      // Close dropdown when pressing Escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.closeUserDropdown();
          this.closeMobileMenu();
        }
      });
    } catch (error) {
      console.error('Error setting up event listeners:', error);
    }
  }
  
  setupMobileMenu() {
    try {
      // Toggle mobile menu
      if (this.burgerButton) {
        this.burgerButton.addEventListener('click', () => {
          const isExpanded = this.burgerButton.getAttribute('aria-expanded') === 'true';
          this.burgerButton.setAttribute('aria-expanded', !isExpanded);
          if (this.mobileMenu) {
            this.mobileMenu.style.display = isExpanded ? 'none' : 'block';
          }
          
          // Toggle body scroll
          document.body.style.overflow = isExpanded ? '' : 'hidden';
        });
      }
      
      // Close mobile menu
      if (this.mobileCloseButton) {
        this.mobileCloseButton.addEventListener('click', () => {
          this.closeMobileMenu();
        });
      }
      
      // Close mobile menu when clicking on a link
      if (this.mobileMenu) {
        const mobileLinks = this.mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
          link.addEventListener('click', () => {
            this.closeMobileMenu();
          });
        });
      }
    } catch (error) {
      console.error('Error setting up mobile menu:', error);
    }
  }
  
  setupDarkModeToggle() {
    try {
      if (!this.darkModeToggle) return;
      
      // Check for saved theme preference
      const savedTheme = localStorage.getItem('theme') || 'light';
      if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
      }
      
      // Toggle dark mode
      this.darkModeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
      });
    } catch (error) {
      console.error('Error setting up dark mode toggle:', error);
    }
  }
  
  setupClickOutsideHandlers() {
    try {
      // Close dropdown when clicking outside
      document.addEventListener('click', (e) => {
        if (this.userMenu && !this.userMenu.contains(e.target)) {
          this.closeUserDropdown();
        }
        
        // Close mobile menu when clicking outside
        if (this.mobileMenu && this.mobileMenu.style.display === 'block' && 
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
      if (!this.userMenu) return;
      
      const isExpanded = this.userMenu.getAttribute('aria-expanded') === 'true';
      this.userMenu.setAttribute('aria-expanded', !isExpanded);
      if (this.userDropdown) {
        this.userDropdown.setAttribute('data-visible', !isExpanded);
      }
    } catch (error) {
      console.error('Error toggling user dropdown:', error);
    }
  }
  
  closeUserDropdown() {
    try {
      if (this.userMenu) {
        this.userMenu.setAttribute('aria-expanded', 'false');
        if (this.userDropdown) {
          this.userDropdown.setAttribute('data-visible', 'false');
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
          this.mobileMenu.style.display = 'none';
        }
        document.body.style.overflow = '';
      }
    } catch (error) {
      console.error('Error closing mobile menu:', error);
    }
  }

  async checkAuthState() {
    try {
      // Check if user is logged in (this would be replaced with your actual auth check)
      const isLoggedIn = await this.checkIfUserIsLoggedIn();
      
      if (isLoggedIn) {
        this.showAuthHeader();
        await this.loadUserData();
      } else {
        this.redirectToLogin();
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
      this.redirectToLogin();
    }
  }

  async checkIfUserIsLoggedIn() {
    try {
      // Check for Firebase auth state or your preferred auth method
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
