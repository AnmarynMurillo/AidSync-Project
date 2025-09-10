/**
 * Utility functions for AidSync
 * Handles loading of components
 */

// Load header and footer components
function loadComponents() {
  // Check if we should load the authenticated header
  const isAuthPage = document.body.classList.contains('auth-page') || 
                    window.location.pathname.includes('dashboard') ||
                    window.location.pathname.includes('profile');
  
  const headerFile = isAuthPage ? 'auth-header.html' : 'header.html';
  const targetHeaderId = isAuthPage ? 'authHeader' : 'guestHeader';
  const otherHeaderId = isAuthPage ? 'guestHeader' : 'authHeader';
  
  // Remove the other header if it exists
  const otherHeader = document.getElementById(otherHeaderId);
  if (otherHeader) {
    otherHeader.remove();
    console.log(`Removed ${otherHeaderId} header`);
  }
  
  // Only load if target header is not already loaded
  if (!document.getElementById(targetHeaderId)) {
    fetch(`/src/components/html/${headerFile}`)
      .then(r => r.text())
      .then(html => {
        const headerContainer = document.getElementById('header-container') || 
          document.body.insertBefore(document.createElement('header'), document.body.firstChild);
        headerContainer.outerHTML = html;
        console.log(`${isAuthPage ? 'Authenticated ' : ''}Header loaded successfully`);
        
        // If this is an auth header, dispatch an event to notify other components
        if (isAuthPage) {
          document.dispatchEvent(new CustomEvent('authHeaderLoaded'));
        }
      })
      .catch(error => console.error(`Error loading ${isAuthPage ? 'authenticated ' : ''}header:`, error));
  } else {
    console.log(`${targetHeaderId} header already loaded`);
  }

  // Load footer if container exists
  const footerContainer = document.getElementById('footer-container');
  if (footerContainer && !document.querySelector('footer.as-footer')) {
    fetch('/src/components/html/footer.html')
      .then(r => r.text())
      .then(html => {
        footerContainer.innerHTML = html;
        console.log('Footer loaded successfully');
      })
      .catch(error => console.error('Error loading footer:', error));
  }
}

// Initialize components when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadComponents);
} else {
  loadComponents();
}
