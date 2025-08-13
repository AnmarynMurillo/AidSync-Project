/**
 * Cargador automático de módulos de AidSync
 * Este script se encarga de cargar e inicializar automáticamente
 * los componentes necesarios en cada página. es decir, es posible añadir nuevos (ejm: footer.js)
 */

(function() {
  // Lista de módulos a cargar
  const modules = {
    header: {
      path: '/src/components/js/header.js',
      selector: '.as-header',
      loaded: false
    }
    // Puedes añadir más módulos aquí en el futuro
  };

  /**
   * Carga un módulo si su elemento contenedor está presente en la página
   * @param {string} moduleName - Nombre del módulo a cargar
   */
  function loadModule(moduleName) {
    const module = modules[moduleName];
    if (!module || module.loaded) return;

    const element = document.querySelector(module.selector);
    if (element) {
      // Crear script
      const script = document.createElement('script');
      script.src = module.path;
      script.type = 'module';
      script.onload = () => {
        console.log(`Módulo ${moduleName} cargado correctamente`);
        module.loaded = true;
      };
      script.onerror = (error) => {
        console.error(`Error al cargar el módulo ${moduleName}:`, error);
      };
      
      document.head.appendChild(script);
    }
  }

  /**
   * Inicializa todos los módulos necesarios
   */
  function initModules() {
    Object.keys(modules).forEach(moduleName => {
      loadModule(moduleName);
    });
  }

  // Inicializar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initModules);
  } else {
    setTimeout(initModules, 0);
  }
})();