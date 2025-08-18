/**
 * Utility functions for AidSync
 * Handles loading of components
 */

// Load header and footer components
function loadComponents() {
  // Only load if not already loaded
  if (!document.querySelector('header.as-header')) {
    fetch('/src/components/html/header.html')
      .then(r => r.text())
      .then(html => {
        const headerContainer = document.getElementById('header-container') || 
          document.body.insertBefore(document.createElement('header'), document.body.firstChild);
        headerContainer.outerHTML = html;
        console.log('Header loaded successfully');
      })
      .catch(error => console.error('Error loading header:', error));
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
