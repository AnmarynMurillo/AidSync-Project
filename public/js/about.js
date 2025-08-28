// about.js - Functionality for the About Us page

// Team data with corrected paths and validation
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
  
  // Function for dynamic text effect
  function setupDynamicText() {
    const dynamicTextElement = document.getElementById('dynamic-text');
    if (!dynamicTextElement) return;

    const phrases = ["Changemakers.", "Kind Souls.", "Community Builders."];
    let currentIndex = 0;

    function updateText() {
      // Fade out
      dynamicTextElement.classList.remove('visible');

      setTimeout(() => {
        // Change text
        currentIndex = (currentIndex + 1) % phrases.length;
        dynamicTextElement.textContent = phrases[currentIndex];
        // Fade in
        dynamicTextElement.classList.add('visible');
      }, 400); // Corresponds to the CSS transition duration
    }

    // Initial text
    dynamicTextElement.textContent = phrases[0];
    dynamicTextElement.classList.add('visible');

    setInterval(updateText, 3000); // Change text every 3 seconds
  }

  // Function to set up the team carousel
  function setupTeamCarousel() {
    const track = document.getElementById('team-gallery');
    const prevButton = document.getElementById('team-carousel-prev');
    const nextButton = document.getElementById('team-carousel-next');

    if (!track || !prevButton || !nextButton) {
      console.warn('Team carousel elements not found.');
      return;
    }

    let currentIndex = 0;

    function updateCarousel() {
      const members = track.children;
      if (members.length === 0) return;

      const memberWidth = members[0].offsetWidth;
      const gap = parseInt(window.getComputedStyle(track).gap) || 0;
      const slideWidth = memberWidth + gap;

      track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    }

    nextButton.addEventListener('click', () => {
      const members = track.children;
      const containerWidth = track.parentElement.offsetWidth;
      const itemsInView = Math.floor(containerWidth / (members[0].offsetWidth + parseInt(window.getComputedStyle(track).gap)));
      
      if (currentIndex < members.length - itemsInView) {
        currentIndex++;
        updateCarousel();
      }
    });

    prevButton.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
      }
    });
  }

  // Initialization when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    renderTeam();
    renderCarousel();
    setupIntersectionObserver();
    setupDynamicText(); // Initialize dynamic text
    setupTeamCarousel(); // Initialize team carousel
    
    // Console verification
    console.log('About Us page loaded successfully');
  });