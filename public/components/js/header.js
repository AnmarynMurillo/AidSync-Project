/**
 * Header functionality for AidSync
 * Handles mobile menu and dark mode
 */

// Prevent multiple initializations
if (typeof window.asHeaderInitialized === 'undefined') {
  window.asHeaderInitialized = false;
}

function initHeader() {
  // Prevent multiple initializations
  if (window.asHeaderInitialized) return;
  window.asHeaderInitialized = true;
  
  // --- Dark mode functionality ---
  function setDarkMode(on) {
    const html = document.documentElement;
    if (on) {
      html.setAttribute('data-theme', 'dark');
      localStorage.setItem('as_darkmode', '1');
      updateDarkModeButtons(true);
    } else {
      html.setAttribute('data-theme', 'light');
      localStorage.setItem('as_darkmode', '0');
      updateDarkModeButtons(false);
    }
  }
  
  // Update dark mode buttons state
  function updateDarkModeButtons(isDark) {
    document.querySelectorAll('.as-header__darkmode-btn').forEach(btn => {
      const icon = btn.querySelector('.as-header__icon');
      if (icon) {
        icon.setAttribute('aria-pressed', isDark);
        icon.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
      }
    });
  }
  
  // Initialize dark mode from localStorage
  if (localStorage.getItem('as_darkmode') === '1') {
    setDarkMode(true);
  } else {
    setDarkMode(false);
  }
  
  // Add dark mode toggle event listeners
  document.querySelectorAll('.as-header__darkmode-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const isDark = document.documentElement.getAttribute('data-theme') !== 'dark';
      setDarkMode(isDark);
    });
  });

  // --- Mobile Menu Functionality ---
  const burger = document.querySelector('.as-header__mobile-menu-btn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileMenuLinks = document.querySelectorAll('.as-header__mobile-nav-link');
  const body = document.body;
  
  // Track touch start position for swipe gestures
  let touchStartX = 0;
  let touchEndX = 0;

  // Open mobile menu with animation
  function openMenu() {
    if (mobileMenu && burger) {
      // Add active classes to show the menu
      mobileMenu.classList.add('active');
      burger.classList.add('active');
      body.classList.add('mobile-menu-open');
      
      // Set aria-expanded to true
      burger.setAttribute('aria-expanded', 'true');
      
      // Add event listeners for closing the menu
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('touchstart', handleTouchStart, { passive: true });
      document.addEventListener('touchend', handleTouchEnd, { passive: true });
    }
  }

  // Close mobile menu
  function closeMenu() {
    if (mobileMenu && burger) {
      // Remove active classes to hide the menu
      mobileMenu.classList.remove('active');
      burger.classList.remove('active');
      body.classList.remove('mobile-menu-open');
      
      // Set aria-expanded to false
      burger.setAttribute('aria-expanded', 'false');
      
      // Remove event listeners
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    }
  }
  
  // Handle keyboard navigation
  function handleKeyDown(e) {
    // Close on Escape key
    if (e.key === 'Escape') {
      closeMenu();
    }
    
    // Trap focus inside the mobile menu when open
    if (e.key === 'Tab' && mobileMenu.classList.contains('open')) {
      const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
      const focusableContent = mobileMenu.querySelectorAll(focusableElements);
      
      // If shift + tab on first element, go to last element
      if (e.shiftKey && document.activeElement === focusableContent[0]) {
        e.preventDefault();
        focusableContent[focusableContent.length - 1].focus();
      } 
      // If tab on last element, go to first element
      else if (!e.shiftKey && document.activeElement === focusableContent[focusableContent.length - 1]) {
        e.preventDefault();
        focusableContent[0].focus();
      }
    }
  }
  
  // Touch event handlers for swipe gestures
  function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
  }
  
  function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }
  
  function handleSwipe() {
    const swipeThreshold = 50;
    const swipeDistance = touchEndX - touchStartX;
    
    // If swiped left and the menu is open, close it
    if (swipeDistance < -swipeThreshold && mobileMenu.classList.contains('open')) {
      closeMenu();
    }
  }

  // Toggle menu when burger button is clicked
  if (burger) {
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-controls', 'mobileMenu');
    burger.setAttribute('aria-label', 'Toggle mobile menu');
    
    burger.addEventListener('click', function(e) {
      e.stopPropagation();
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      
      if (isExpanded) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  // Close menu when clicking outside or on a link
  document.addEventListener('click', function(e) {
    if (mobileMenu && mobileMenu.classList.contains('active') && 
        !mobileMenu.contains(e.target) && 
        e.target !== burger) {
      closeMenu();
    }
  });
  
  // Close menu when clicking on a menu link
  mobileMenuLinks.forEach(link => {
    link.addEventListener('click', function() {
      closeMenu();
    });
  });

  // Close menu when window is resized to desktop
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth > 900) {
        closeMenu();
        if (burger) burger.setAttribute('aria-expanded', 'false');
      }
    }, 250);
  });

  // Initial check on page load
  if (window.innerWidth > 900) {
    closeMenu();
  }

  // Add click event listener to close button
  if (closeMobile) {
    closeMobile.addEventListener('click', function(e) {
      e.stopPropagation();
      closeMenu();
      if (burger) burger.setAttribute('aria-expanded', 'false');
    });
  }
}

// Set active navigation link based on current page
function setActiveNavLink() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.as-header__nav-link, .as-header__mobile-list a');
  
  // Normalize the current path to handle different formats
  const normalizePath = (path) => {
    // Remove trailing slashes and convert to lowercase for comparison
    return path.replace(/\/$/, '').toLowerCase();
  };
  
  navLinks.forEach(link => {
    // Remove active class from all links first
    link.classList.remove('active');
    
    try {
      // Get the path from the link's href
      const linkUrl = new URL(link.href, window.location.origin);
      const linkPath = linkUrl.pathname;
      
      // Normalize both paths for comparison
      const normalizedLinkPath = normalizePath(linkPath);
      const normalizedCurrentPath = normalizePath(currentPath);
      
      // Check if the current path includes the link path or vice versa
      if (normalizedCurrentPath.includes(normalizedLinkPath) || 
          normalizedLinkPath.includes(normalizedCurrentPath) ||
          (normalizedLinkPath.endsWith('about.html') && (normalizedCurrentPath.endsWith('about') || normalizedCurrentPath.endsWith('about/')))) {
        link.classList.add('active');
      }
    } catch (e) {
      console.error('Error processing navigation link:', e);
    }
  });
}

// Initialize header when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    setActiveNavLink();
  });
} else {
  initHeader();
  setActiveNavLink();
}
