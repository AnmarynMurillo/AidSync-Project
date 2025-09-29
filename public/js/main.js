// Splash Screen Functionality
document.addEventListener('DOMContentLoaded', () => {
    const splashScreen = document.getElementById('splash-screen');
    const progressBar = document.querySelector('.progress');
    const loadingMessage = document.querySelector('.loading-message');
    const loadingDots = document.querySelector('.loading-dots');
    const loadingHint = document.querySelector('.loading-hint');
    
    if (splashScreen) {
        let progress = 0;
        const messages = [
            'Initializing platform',
            'Loading resources',
            'Preparing experience',
            'Almost there'
        ];
        
        // Update loading progress
        const updateProgress = () => {
            if (progress < 100) {
                progress += Math.random() * 15;
                if (progress > 100) progress = 100;
                progressBar.style.width = `${progress}%`;
                
                // Update loading message at certain intervals
                if (progress < 30) loadingMessage.textContent = messages[0];
                else if (progress < 50) loadingMessage.textContent = messages[1];
                else if (progress < 80) loadingMessage.textContent = messages[2];
                else loadingMessage.textContent = messages[3];
                
                // Random speed between 100-500ms
                setTimeout(updateProgress, 100 + Math.random() * 400);
            } else {
                loadingHint.style.opacity = '1';
                splashScreen.style.cursor = 'pointer';
            }
        };
        
        // Start progress
        setTimeout(updateProgress, 500);
        
        // Click to skip
        splashScreen.addEventListener('click', () => {
            splashScreen.classList.add('hidden');
            // Remove splash screen from DOM after animation
            setTimeout(() => {
                splashScreen.remove();
            }, 1000);
        });
        
        // Auto-hide after 7 seconds if not clicked
        setTimeout(() => {
            if (!splashScreen.classList.contains('hidden')) {
                splashScreen.click();
            }
        }, 7000);
    }
});

// Hero Carousel Data
const carouselSlides = [
  {
    img: 'assets/img/Carrusel_1/Educacion.jpg',
    text: 'Education that transforms'
  },
  {
    img: 'assets/img/Carrusel_1/health.png',
    text: 'Healthcare in sync'
  },
  {
    img: 'assets/img/Carrusel_1/environment.jpg',
    text: 'Smart environmental action'
  },
  {
    img: 'assets/img/Carrusel_1/Social_welfare.png',
    text: 'Social impact, aligned'
  }
];

let currentSlide = 0;
let carouselTimer;

function showCarouselSlide(idx) {
  const slideDiv = document.querySelector('.carousel-slide');
  slideDiv.innerHTML = '';
  const slide = carouselSlides[idx];
  const img = document.createElement('img');
  img.src = slide.img;
  img.alt = slide.text;
  img.className = 'carousel-image';
  slideDiv.appendChild(img);
  // Cambia el texto superpuesto
  const overlayText = document.querySelector('.carousel-overlay-content .carousel-title');
  if (overlayText) overlayText.textContent = slide.text;
}

function nextCarouselSlide() {
  currentSlide = (currentSlide + 1) % carouselSlides.length;
  showCarouselSlide(currentSlide);
}
function prevCarouselSlide() {
  currentSlide = (currentSlide - 1 + carouselSlides.length) % carouselSlides.length;
  showCarouselSlide(currentSlide);
}
function startCarouselAuto() {
  clearInterval(carouselTimer);
  carouselTimer = setInterval(nextCarouselSlide, 4000);
}
function stopCarouselAuto() {
  clearInterval(carouselTimer);
}

document.addEventListener('DOMContentLoaded', () => {
  // Hero Carousel
  showCarouselSlide(currentSlide);
  startCarouselAuto();
  document.querySelector('.carousel-arrow.left').onclick = () => { prevCarouselSlide(); startCarouselAuto(); };
  document.querySelector('.carousel-arrow.right').onclick = () => { nextCarouselSlide(); startCarouselAuto(); };
  document.querySelector('.carousel-slide').onmouseenter = stopCarouselAuto;
  document.querySelector('.carousel-slide').onmouseleave = startCarouselAuto;

  // Areas Modal
  const areaDescriptions = {
    education: 'Education: We support access to quality education for all, empowering communities through knowledge.',
    health: 'Health: We promote health initiatives and access to medical care for vulnerable populations.',
    environment: 'Environment: We drive smart environmental actions for a sustainable future.',
    'social-welfare': 'Social Welfare: We foster social inclusion and well-being for all.'
  };
  const areaCards = document.querySelectorAll('.area-card');
  const modal = document.getElementById('areaModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const closeModal = document.querySelector('.close-modal');
  areaCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      const area = card.getAttribute('data-area');
      modalTitle.textContent = card.querySelector('h3').textContent;
      modalDesc.textContent = areaDescriptions[area];
      modal.classList.add('active');
    });
    card.addEventListener('mouseleave', () => {
      modal.classList.remove('active');
    });
  });
  closeModal.onclick = () => modal.classList.remove('active');
  modal.onclick = (e) => { if (e.target === modal) modal.classList.remove('active'); };

  // Foundations Carousel funcionalidad solo JS
  let currentFoundation = 0;
  const foundationCardsDiv = document.querySelector('.foundation-cards');
  function getFoundationCards() {
    return Array.from(document.querySelectorAll('.foundation-card'));
  }
  function showOnlyFoundation(idx) {
    const foundationCards = getFoundationCards();
    foundationCards.forEach((card, i) => {
      card.style.display = (i === idx) ? 'flex' : 'none';
    });
  }
  function nextFoundationSlide() {
    const foundationCards = getFoundationCards();
    currentFoundation = (currentFoundation + 1) % foundationCards.length;
    showOnlyFoundation(currentFoundation);
  }
  function prevFoundationSlide() {
    const foundationCards = getFoundationCards();
    currentFoundation = (currentFoundation - 1 + foundationCards.length) % foundationCards.length;
    showOnlyFoundation(currentFoundation);
  }
  let foundationTimer;
  function startFoundationAuto() {
    clearInterval(foundationTimer);
    foundationTimer = setInterval(() => {
      nextFoundationSlide();
    }, 3000);
  }
  function stopFoundationAuto() {
    clearInterval(foundationTimer);
  }
  // Interacción usuario: pausa/reanuda
  foundationCardsDiv.addEventListener('mouseenter', stopFoundationAuto);
  foundationCardsDiv.addEventListener('mouseleave', startFoundationAuto);
  foundationCardsDiv.addEventListener('focusin', stopFoundationAuto);
  foundationCardsDiv.addEventListener('focusout', startFoundationAuto);
  document.querySelector('.foundation-arrow.left').onclick = () => {
    prevFoundationSlide();
    startFoundationAuto();
  };
  document.querySelector('.foundation-arrow.right').onclick = () => {
    nextFoundationSlide();
    startFoundationAuto();
  };
  showOnlyFoundation(currentFoundation);
  startFoundationAuto();

  // FAQ Accordion
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', function() {
      const item = this.parentElement;
      item.classList.toggle('active');
      document.querySelectorAll('.faq-item').forEach(other => {
        if (other !== item) other.classList.remove('active');
      });
    });
  });

  // Contact Form (no backend, just prevent default)
  document.querySelector('.contact-form').onsubmit = e => {
    e.preventDefault();
    alert('Thank you for contacting AidSync!');
  };
});

// FAQ Modern Accordion (impact)
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.faq-accordion.impact .faq-question').forEach(btn => {
    btn.addEventListener('click', function() {
      const item = this.closest('.faq-item');
      const wasActive = item.classList.contains('active');
      document.querySelectorAll('.faq-accordion.impact .faq-item').forEach(i => i.classList.remove('active'));
      if (!wasActive) item.classList.add('active');
    });
  });
});

// Cargar header-loader para manejo inteligente del header
document.addEventListener('DOMContentLoaded', () => {
  // Cargar el header-loader si no está ya cargado
  if (!window.loadHeader) {
    const script = document.createElement('script');
    script.src = 'js/header-loader.js';
    script.defer = true;
    script.onload = () => {
      // El header se cargará automáticamente cuando se cargue header-loader.js
    };
    document.body.appendChild(script);
  }
});
// For dynamic header: re-inicializa modo oscuro tras cargar el header
function initDarkModeHeader() {
  const html = document.documentElement;
  
  function setDarkMode(on) {
    if (on) {
      html.setAttribute('data-theme', 'dark');
      localStorage.setItem('as_darkmode', '1');
    } else {
      html.setAttribute('data-theme', 'light');
      localStorage.setItem('as_darkmode', '0');
    }
  }
  if (localStorage.getItem('as_darkmode') === '1') {
    setDarkMode(true);
  } else {
    setDarkMode(false);
  }
  document.querySelectorAll('.as-header__darkmode-btn').forEach(btn => {
    btn.onclick = function () {
      setDarkMode(html.getAttribute('data-theme') !== 'dark');
    };
  });
}
// Si el header se carga dinámicamente, espera a que esté en el DOM
if (document.getElementById('header-container')) {
  const observer = new MutationObserver(() => {
    if (document.querySelector('.as-header__darkmode-btn')) {
      initDarkModeHeader();
      observer.disconnect();
    }
  });
  observer.observe(document.getElementById('header-container'), { childList: true, subtree: true });
} else {
  document.addEventListener('DOMContentLoaded', initDarkModeHeader);
}
let currentFoundation = 0;
const track = document.querySelector('.foundation-cards');
const cards = document.querySelectorAll('.foundation-card');
let cardWidth = cards[0].offsetWidth + 20; // 20 = gap entre tarjetas

const nextArrow = document.querySelector('.foundation-arrow.right');
const prevArrow = document.querySelector('.foundation-arrow.left');

function updateFoundationSlide() {
  track.style.transform = `translateX(-${currentFoundation * cardWidth}px)`;
}

function nextFoundationSlide() {
  if (currentFoundation < cards.length - 1) {
    currentFoundation++;
  } else {
    currentFoundation = 0; // opcional: vuelve al inicio
  }
  updateFoundationSlide();
}

function prevFoundationSlide() {
  if (currentFoundation > 0) {
    currentFoundation--;
  } else {
    currentFoundation = cards.length - 1; // opcional: ir al final
  }
  updateFoundationSlide();
}

// animación de flecha al hacer clic
function animateArrow(arrow) {
  arrow.style.transform = 'translateX(10px)';
  setTimeout(() => {
    arrow.style.transform = 'translateX(0)';
  }, 200);
}

// eventos de clic en flechas
nextArrow.addEventListener('click', () => {
  nextFoundationSlide();
  animateArrow(nextArrow);
});

prevArrow.addEventListener('click', () => {
  prevFoundationSlide();
  animateArrow(prevArrow);
});

// recalcular ancho de tarjetas al redimensionar
window.addEventListener('resize', () => {
  cardWidth = cards[0].offsetWidth + 20;
  updateFoundationSlide();
});

// inicializa posición
updateFoundationSlide();