document.addEventListener("DOMContentLoaded", function() {
  // Selecciona el loader y el contenido
  const loader = document.getElementById('loader');
  const content = document.getElementById('content');

  // Añade un evento de clic al loader
  loader.addEventListener('click', function() {
      // Oculta la pantalla de carga
      loader.style.opacity = 0;
      loader.style.pointerEvents = 'none';

      // Muestra el contenido
      content.style.display = 'block';
  });

  // Opcional: Para ocultar el loader automáticamente después de un tiempo
  setTimeout(function() {
      if (loader.style.opacity !== '0') {
          loader.style.opacity = 0;
          loader.style.pointerEvents = 'none';
          content.style.display = 'block';
      }
  }, 5000); // 5 segundos de espera antes de ocultar el loader automáticamente
});
document.addEventListener('DOMContentLoaded', () => {
   const elements = document.querySelectorAll('.slide-up');

   const onScroll = () => {
       const windowHeight = window.innerHeight;
       const scrollY = window.scrollY;

       elements.forEach(element => {
           const elementTop = element.getBoundingClientRect().top + scrollY;
           const elementHeight = element.offsetHeight;

           if (scrollY + windowHeight > elementTop + elementHeight * 0.2) {
               element.classList.add('visible');
           }
       });
   };

   window.addEventListener('scroll', onScroll);
   onScroll(); // Ejecutar en carga inicial
});

document.addEventListener("DOMContentLoaded", function() {
    // Selecciona el loader y el contenido
    const loader = document.getElementById('loader');
    const content = document.getElementById('content');

    // Añade un evento de clic al loader
    loader.addEventListener('click', function() {
        // Oculta la pantalla de carga
        loader.style.opacity = 0;
        loader.style.pointerEvents = 'none';

        // Muestra el contenido
        content.style.display = 'block';
    });

    // Opcional: Para ocultar el loader automáticamente después de un tiempo
    setTimeout(function() {
        if (loader.style.opacity !== '0') {
            loader.style.opacity = 0;
            loader.style.pointerEvents = 'none';
            content.style.display = 'block';
        }
    }, 5000); // 5 segundos de espera antes de ocultar el loader automáticamente
});
 document.addEventListener('DOMContentLoaded', () => {
     const elements = document.querySelectorAll('.slide-up');

     const onScroll = () => {
         const windowHeight = window.innerHeight;
         const scrollY = window.scrollY;

         elements.forEach(element => {
             const elementTop = element.getBoundingClientRect().top + scrollY;
             const elementHeight = element.offsetHeight;

             if (scrollY + windowHeight > elementTop + elementHeight * 0.2) {
                 element.classList.add('visible');
             }
         });
     };

     window.addEventListener('scroll', onScroll);
     onScroll(); // Ejecutar en carga inicial
 });



// JavaScript para manejar la visibilidad del nav con el loader
document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loader');
    const nav = document.querySelector('nav');

    // Función para ocultar el nav cuando el loader está activo
    function hideNav() {
        nav.classList.add('hidden-nav');
    }

    // Función para mostrar el nav cuando el loader está oculto
    function showNav() {
        nav.classList.remove('hidden-nav');
    }

    // Simula un retraso para ocultar el loader y mostrar el nav
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.style.opacity = 0;
            setTimeout(() => {
                loader.style.display = 'none';
                showNav();
            }, 300); // Tiempo de transición de opacidad
        }, 2000); // Tiempo para simular la carga del contenido
    });

    // Si necesitas ocultar el nav inmediatamente en otro contexto
    // Puedes llamar a hideNav() cuando sea necesario
});
// para crear el icono del usuarios

const user = JSON.parse(localStorage.getItem('user'));

if (user) {
    // Create the user icon
    const userIcon = document.getElementById('userIcon');
    const initial = user.username.charAt(0).toUpperCase();

    userIcon.textContent = initial;
    userIcon.title = user.username; // Set the title to show the username on hover
}