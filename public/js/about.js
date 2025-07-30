// about.js - Funcionalidad para la página Sobre Nosotros

// Datos del equipo con rutas corregidas y validación
const TEAM = [
    {
      nombre: 'Juan Morales',
      foto: '../images/integrantes/Juan.Morales.png',
      rol: 'Desarrollo',
      desc: 'Apasionado por la tecnología y el impacto social. Encargado del backend y la integración con Firebase.'
    },
    {
      nombre: 'Isaura Ríos',
      foto: '../images/integrantes/Isaura.Rios.png',
      rol: 'Diseño UX/UI',
      desc: 'Diseñadora creativa, responsable de la experiencia visual y la identidad de AidSync.'
    },
    {
      nombre: 'Patricia Fernández',
      foto: '../images/integrantes/Patricia.Fernandez.png',
      rol: 'Contenido',
      desc: 'Redactor y comunicador. Se encarga de los textos y la estrategia de comunicación.'
    },
    {
      nombre: 'Anmaryn Murrillo',
      foto: '../images/integrantes/Anmaryn.Murrillo.png',
      rol: 'Gestión de Proyectos',
      desc: 'Organiza y coordina al equipo para que todo funcione en tiempo y forma.'
    },
    {
      nombre: 'Dushka Jimenez',
      foto: '../images/integrantes/Dushka.Jimenez.png',
      rol: 'Marketing',
      desc: 'Estratega digital, encargada de la difusión y redes sociales de AidSync.'
    },
    {
      nombre: 'Emily Bulgin',
      foto: '../images/integrantes/Emily.Bulgin.png',
      rol: 'QA & Testing',
      desc: 'Responsable de la calidad y pruebas de la plataforma.'
    },
    {
      nombre: 'Luis Camargo',
      foto: '../images/integrantes/Luis.Camargo.png',
      rol: 'Soporte Técnico',
      desc: 'Brinda soporte y ayuda a los usuarios y fundaciones.'
    },
    {
      nombre: 'Gilberto Rodriguez',
      foto: '../images/integrantes/Gilberto.Rodriguez.png',
      rol: 'DevOps',
      desc: 'Gestiona la infraestructura y el despliegue seguro de la plataforma.'
    },
    {
      nombre: 'Stephany Dominguez',
      foto: '../images/integrantes/Stephany.Dominguez.png',
      rol: 'Legal',
      desc: 'Asegura el cumplimiento legal y la protección de datos en AidSync.'
    },
    {
      nombre: 'Elina Pérez',
      foto: '../images/integrantes/Elina.Perez.png',
      rol: 'JS Developer',
      desc: 'Encargada de la funcionalidad JavaScript y interacciones dinámicas.'
    }
  ];
  
  // Carrusel con rutas corregidas
  const CAROUSEL_IMAGES = [
    '../images/team/momento1.jpg',
    '../images/team/momento2.jpg',
    '../images/team/momento3.jpg',
    '../images/team/momento4.jpg'
  ];
  
  // Función para renderizar el equipo con manejo de errores
  function renderTeam() {
    const gallery = document.getElementById('team-gallery');
    
    if (!gallery) {
      console.error('Error: No se encontró el elemento con ID "team-gallery"');
      return;
    }
  
    gallery.innerHTML = TEAM.map(member => {
      // Validación de datos del miembro
      if (!member.foto || !member.rol) {
        console.warn(`Datos incompletos para: ${member.nombre}`);
        return '';
      }
      
      return `
        <div class="team-card">
          <img src="${member.foto}" 
               alt="Foto de ${member.nombre}" 
               class="team-photo"
               loading="lazy"
               onerror="this.onerror=null;this.src='../images/default-avatar.png'">
          <div class="team-name">${member.nombre}</div>
          <div class="team-role">${member.rol}</div>
          <div class="team-desc">${member.desc}</div>
        </div>
      `;
    }).join('');
  }
  
  // Carrusel mejorado con autoplay y controles
  let carouselIndex = 0;
  let carouselInterval = null;
  
  function renderCarousel() {
    const track = document.getElementById('carousel-track');
    if (!track) return;
  
    track.innerHTML = CAROUSEL_IMAGES.map((src, index) => 
      `<img src="${src}" 
            class="carousel-img" 
            alt="Momento del equipo ${index + 1}"
            draggable="false"
            loading="lazy">`
    ).join('');
  
    updateCarousel();
    startCarouselAuto();
    
    // Agregar event listeners
    document.getElementById('carousel-prev')?.addEventListener('click', prevCarousel);
    document.getElementById('carousel-next')?.addEventListener('click', nextCarousel);
    
    // Pausar al hacer hover
    track.addEventListener('mouseenter', pauseCarousel);
    track.addEventListener('mouseleave', startCarouselAuto);
  }
  
  function updateCarousel() {
    const track = document.getElementById('carousel-track');
    if (track) {
      track.style.transform = `translateX(-${carouselIndex * 100}%)`;
    }
  }
  
  function nextCarousel() {
    carouselIndex = (carouselIndex + 1) % CAROUSEL_IMAGES.length;
    updateCarousel();
    restartCarouselAuto();
  }
  
  function prevCarousel() {
    carouselIndex = (carouselIndex - 1 + CAROUSEL_IMAGES.length) % CAROUSEL_IMAGES.length;
    updateCarousel();
    restartCarouselAuto();
  }
  
  function startCarouselAuto() {
    if (carouselInterval) clearInterval(carouselInterval);
    carouselInterval = setInterval(nextCarousel, 5000);
  }
  
  function pauseCarousel() {
    if (carouselInterval) clearInterval(carouselInterval);
  }
  
  function restartCarouselAuto() {
    pauseCarousel();
    startCarouselAuto();
  }
  
  // Observador de intersección para animaciones
  function setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        }
      });
    }, { threshold: 0.1 });
  
    document.querySelectorAll('.mission, .vision, .value-card').forEach(el => {
      observer.observe(el);
    });
  }
  
  // Inicialización cuando el DOM esté listo
  document.addEventListener('DOMContentLoaded', () => {
    renderTeam();
    renderCarousel();
    setupIntersectionObserver();
    
    // Verificación en consola
    console.log('Página "Sobre Nosotros" cargada correctamente');
  });