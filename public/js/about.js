// about.js - Functionality for the About Us page

// Team data with corrected paths and validation
const TEAM = [
    {
      nombre: 'Juan Morales',
      foto: '/public/assets/members/Juan.png',
      rol: 'Development',
      desc: 'Passionate about technology and social impact. In charge of backend and Firebase integration.'
    },
    {
      nombre: 'Isaura Ríos',
      foto: '/public/assets/members/Isaura.png',
      rol: 'UX/UI Design',
      desc: 'Creative designer, responsible for the visual experience and AidSync identity.'
    },
    {
      nombre: 'Patricia Fernández',
      foto: '/public/assets/members/Patricia.png',
      rol: 'Content',
      desc: 'Writer and communicator. Handles texts and communication strategy.'
    },
    {
      nombre: 'Anmaryn Murrillo',
      foto: '/public/assets/members/Anmaryn.png',
      rol: 'Project Management',
      desc: 'Organizes and coordinates the team to ensure everything works on time and properly.'
    },
    {
      nombre: 'Dushka Jimenez',
      foto: '/public/assets/members/Dushka.png',
      rol: 'Marketing',
      desc: 'Digital strategist, in charge of AidSync outreach and social media.'
    },
    {
      nombre: 'Emily Bulgin',
      foto: '/public/assets/members/Emily.png',
      rol: 'QA & Testing',
      desc: 'Responsible for platform quality and testing.'
    },
    {
      nombre: 'Luis Camargo',
      foto: '/public/assets/members/Luis.png',
      rol: 'Technical Support',
      desc: 'Provides support and assistance to users and foundations.'
    },
    {
      nombre: 'Gilberto Rodriguez',
      foto: '/public/assets/members/Gilberto.png',
      rol: 'DevOps',
      desc: 'Manages infrastructure and secure platform deployment.'
    },
    {
      nombre: 'Stephany Dominguez',
      foto: '/public/assets/members/Stephany.png',
      rol: 'Legal',
      desc: 'Ensures legal compliance and data protection in AidSync.'
    },
    {
      nombre: 'Elina Pérez',
      foto: '/public/assets/members/Elina.png',
      rol: 'JS Developer',
      desc: 'In charge of JavaScript functionality and dynamic interactions.'
    }
  ];
  
  // Carousel with corrected paths
  const CAROUSEL_IMAGES = [
    '/public/assets/aidsync_moments/momento 1.jpeg',
    '/public/assets/aidsync_moments/momento 2.jpeg',
    '/public/assets/aidsync_moments/momento 3.jpeg',
    '/public/assets/aidsync_moments/momento 4.jpg',
  ];
  
  // Function to render team with error handling  
  function renderTeam() {
    const gallery = document.getElementById('team-gallery');
    
    if (!gallery) {
      console.error('Error: Element with ID "team-gallery" not found');
      return;
    }

    // Define color variations using AidSync colors
    const colorVariations = [
      { bg: '#82dfcd', accent: '#16a085' }, // Support1 + Accent
      { bg: '#003d66', accent: '#82dfcd' }, // Primary + Support1
      { bg: '#16a085', accent: '#eaf4f5' }, // Accent + Support2
      { bg: '#eaf4f5', accent: '#003d66' }, // Support2 + Primary
      { bg: '#4a9b8e', accent: '#fff' },    // Blend + White
    ];

    gallery.innerHTML = TEAM.map((member, index) => {
      // Member data validation
      if (!member.foto || !member.rol) {
        console.warn(`Incomplete data for: ${member.nombre}`);
        return '';
      }
      
      const colorScheme = colorVariations[index % colorVariations.length];
      const isLightBg = ['#82dfcd', '#eaf4f5'].includes(colorScheme.bg);
      const textColor = isLightBg ? '#003d66' : '#fff';
      
      return `
        <div class="team-member" style="--member-bg: ${colorScheme.bg}; --member-accent: ${colorScheme.accent}; --member-text: ${textColor}">
          <div class="member-circle">
            <img src="${member.foto}" 
                 alt="Photo of ${member.nombre}" 
                 class="member-photo"
                 loading="lazy"
                 onerror="this.onerror=null;this.src='../images/default-avatar.png'">
            <div class="member-info">
              <h3 class="member-name">${member.nombre.toUpperCase()}</h3>
              <p class="member-role">${member.rol}</p>
            </div>
            <div class="member-decorative-elements">
              <div class="deco-circle deco-1"></div>
              <div class="deco-circle deco-2"></div>
              <div class="deco-pill deco-3"></div>
              <div class="deco-pill deco-4"></div>
            </div>
          </div>
          <div class="member-description">
            <p>${member.desc}</p>
          </div>
        </div>
      `;
    }).join('');
  }
  
  // Enhanced carousel with autoplay and controls
  let carouselIndex = 0;
  let carouselInterval = null;
  
  function renderCarousel() {
    const track = document.getElementById('carousel-track');
    if (!track) return;
  
    track.innerHTML = CAROUSEL_IMAGES.map((src, index) => 
      `<img src="${src}" 
            class="carousel-img" 
            alt="Team moment ${index + 1}"
            draggable="false"
            loading="lazy">`
    ).join('');
  
    updateCarousel();
    startCarouselAuto();
    
    // Add event listeners
    document.getElementById('carousel-prev')?.addEventListener('click', prevCarousel);
    document.getElementById('carousel-next')?.addEventListener('click', nextCarousel);
    
    // Pause on hover
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
  
  // Intersection observer for animations
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
  
  // Initialization when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    renderTeam();
    renderCarousel();
    setupIntersectionObserver();
    
    // Console verification
    console.log('About Us page loaded successfully');
  });