/**
 * AidSync Component Loader
 * This script is responsible for loading and initializing
 * the necessary components on each page.
 */

(function() {
  // Function to load scripts
  const loadScript = (src, onload, type = 'text/javascript') => {
    const script = document.createElement('script');
    script.src = src;
    script.type = type;
    if (type === 'text/javascript') {
      script.defer = true;
    }
    script.onload = onload;
    script.onerror = (error) => console.error(`Error loading script ${src}:`, error);
    document.head.appendChild(script);
  };

  // Function to load modules
  const loadModule = (module) => {
    if (!module || module.loaded) return;

    const element = document.querySelector(module.selector);
    if (element) {
      loadScript(
        module.path,
        () => {
          console.log(`Module ${module.name} loaded successfully`);
          module.loaded = true;
        },
        module.type === 'module' ? 'module' : 'text/javascript'
      );
    }
  };

  // Load utils first
  loadScript('/src/components/js/utils.js', () => {
    console.log('Utils loaded, initializing components');
    
    // List of modules to load
    const modules = [
      {
        name: 'header',
        path: '/src/components/js/header.js',
        selector: '.as-header',
        loaded: false,
        type: 'script'
      }
    ];
    
    // Load all modules
    modules.forEach(module => loadModule(module));
  });
})();