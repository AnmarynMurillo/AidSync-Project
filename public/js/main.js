// Hero Carousel Data
const carouselSlides = [
  {
    img: 'public/assets/img/Carrusel_1/Educacion.jpg',
    text: 'Education that transforms'
  },
  {
    img: 'public/assets/img/Carrusel_1/health.png',
    text: 'Healthcare in sync'
  },
  {
    img: 'public/assets/img/Carrusel_1/environment.jpg',
    text: 'Smart environmental action'
  },
  {
    img: 'public/assets/img/Carrusel_1/Social_welfare.png',
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

  // Foundations Carousel
  const foundations = [
    { img: 'public/assets/img/Carrusel_1/Educacion.jpg', name: 'Educa Foundation' },
    { img: 'public/assets/img/Carrusel_1/health.png', name: 'Health4All' },
    { img: 'public/assets/img/Carrusel_1/environment.jpg', name: 'GreenFuture' },
    { img: 'public/assets/img/Carrusel_1/Social_welfare.png', name: 'SocialCare' },
    { img: 'public/assets/img/Carrusel_1/Educacion.jpg', name: 'Learn&Grow' }
  ];
  let foundationIdx = 0;
  const cardsToShow = 3;
  const foundationCardsDiv = document.querySelector('.foundation-cards');
  function renderFoundationCards() {
    foundationCardsDiv.innerHTML = '';
    for (let i = 0; i < cardsToShow; i++) {
      const idx = (foundationIdx + i) % foundations.length;
      const f = foundations[idx];
      const card = document.createElement('div');
      card.className = 'foundation-card';
      card.innerHTML = `<img src="${f.img}" alt="${f.name}"><div class="foundation-name">${f.name}</div>`;
      foundationCardsDiv.appendChild(card);
    }
  }
  function nextFoundation() {
    foundationIdx = (foundationIdx + 1) % foundations.length;
    renderFoundationCards();
  }
  function prevFoundation() {
    foundationIdx = (foundationIdx - 1 + foundations.length) % foundations.length;
    renderFoundationCards();
  }
  document.querySelector('.foundation-arrow.left').onclick = () => { prevFoundation(); startFoundationAuto(); };
  document.querySelector('.foundation-arrow.right').onclick = () => { nextFoundation(); startFoundationAuto(); };
  let foundationTimer;
  function startFoundationAuto() {
    clearInterval(foundationTimer);
    foundationTimer = setInterval(nextFoundation, 4000);
  }
  function stopFoundationAuto() {
    clearInterval(foundationTimer);
  }
  foundationCardsDiv.onmouseenter = stopFoundationAuto;
  foundationCardsDiv.onmouseleave = startFoundationAuto;
  renderFoundationCards();
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