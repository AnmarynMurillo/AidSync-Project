document.addEventListener('DOMContentLoaded', function() {
    // Initialize Carousels
    initBannerCarousel();
    initTeamCarousel();
    
    // Existing code
    // Dynamic Text Rotation
    const dynamicText = document.getElementById('dynamic-text');
    const words = ['thinkers', 'innovators', 'teenagers', 'dreamers'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100; // Typing speed in milliseconds
    let deleteSpeed = 50; // Deleting speed in milliseconds
    let pauseTime = 2000; // Pause time between words in milliseconds

    function typeEffect() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            // Delete characters
            dynamicText.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            // Type characters
            dynamicText.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        // Check if we've finished typing the word
        if (!isDeleting && charIndex === currentWord.length) {
            // Pause at the end of the word
            isDeleting = true;
            setTimeout(typeEffect, pauseTime);
            return;
        }

        // Check if we've finished deleting the word
        if (isDeleting && charIndex === 0) {
            isDeleting = false;
            // Move to the next word
            wordIndex = (wordIndex + 1) % words.length;
        }

        // Set typing speed
        const speed = isDeleting ? deleteSpeed : typeSpeed;
        setTimeout(typeEffect, speed);
    }

    // Start the typing effect
    if (dynamicText) {
        // Add cursor effect
        dynamicText.classList.add('typing-cursor');
        // Start typing after a short delay
        setTimeout(typeEffect, 1000);
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Account for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add animation on scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.animate-on-scroll');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('animated');
            }
        });
    };

    // Add scroll event listener
    window.addEventListener('scroll', animateOnScroll);
    
    // Initial check in case elements are already in view
    animateOnScroll();
});

// Banner Carousel Functionality
function initBannerCarousel() {
    const carouselSlide = document.querySelector('.carousel-slide');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.carousel-control.prev');
    const nextBtn = document.querySelector('.carousel-control.next');
    const dotsContainer = document.querySelector('.carousel-dots');
    
    if (!carouselSlide) return; // Exit if no carousel found
    
    let currentIndex = 0;
    let slideInterval;
    const slideIntervalTime = 5000; // 5 seconds

    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('dot');
        dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    // Set up the slider
    function updateCarousel() {
        carouselSlide.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    // Next slide
    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        updateCarousel();
        resetInterval();
    }

    // Previous slide
    function prevSlide() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateCarousel();
        resetInterval();
    }

    // Go to specific slide
    function goToSlide(index) {
        currentIndex = index;
        updateCarousel();
        resetInterval();
    }

    // Reset interval
    function resetInterval() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, slideIntervalTime);
    }

    // Event listeners
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });

    // Touch events for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    carouselSlide.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carouselSlide.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const swipeDiff = touchStartX - touchEndX;
        
        if (Math.abs(swipeDiff) > swipeThreshold) {
            if (swipeDiff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }

    // Pause on hover
    const carousel = document.querySelector('.banner-carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', () => clearInterval(slideInterval));
        carousel.addEventListener('mouseleave', () => resetInterval());
    }

    // Start the interval
    resetInterval();
}

// Team Carousel Functionality
function initTeamCarousel() {
    // Ensure the team carousel container exists
    const carousel = document.querySelector('.team-carousel');
    if (!carousel) return; // Exit if no team carousel found
    
    // Add dots container if it doesn't exist
    const carouselContainer = document.querySelector('.team-carousel-container');
    if (carouselContainer && !document.querySelector('.team-carousel-dots')) {
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'team-carousel-dots';
        carouselContainer.appendChild(dotsContainer);
    }
    
    const teamMembers = [
        {
            name: 'Anmaryn Murillo',
            role: 'Project Lead',
            image: '../../public/assets/members/Anmaryn.png',
            bio: 'Passionate about creating impactful solutions through technology.',
            social: {
                twitter: '#',
                linkedin: '#',
                github: '#'
            }
        },
        {
            name: 'Dushka Hernandez',
            role: 'UI/UX Designer',
            image: '../../public/assets/members/Dushka.png',
            bio: 'Transforming ideas into beautiful and intuitive user experiences.',
            social: {
                twitter: '#',
                linkedin: '#',
                github: '#'
            }
        },
        {
            name: 'Elina Villalobos',
            role: 'Frontend Developer',
            image: '../../public/assets/members/Elina.png',
            bio: 'Building responsive and accessible web applications.',
            social: {
                twitter: '#',
                linkedin: '#',
                github: '#'
            }
        },
        {
            name: 'Emily Rojas',
            role: 'Backend Developer',
            image: '../../public/assets/members/Emily.png',
            bio: 'Creating robust and scalable server-side solutions.',
            social: {
                twitter: '#',
                linkedin: '#',
                github: '#'
            }
        },
        {
            name: 'Isaura Ríos',
            role: 'Full Stack Developer',
            image: '../../public/assets/members/Isaura.png',
            bio: 'Bridging the gap between frontend and backend development.',
            social: {
                twitter: '#',
                linkedin: '#',
                github: '#'
            }
        },
        {
            name: 'Jhostan Rojas',
            role: 'Mobile Developer',
            image: '../../public/assets/members/Jhostan.png',
            bio: 'Building cross-platform mobile experiences.',
            social: {
                twitter: '#',
                linkedin: '#',
                github: '#'
            }
        },
        {
            name: 'Josue Rojas',
            role: 'DevOps Engineer',
            image: '../../public/assets/members/Josue.png',
            bio: 'Automating deployments and ensuring system reliability.',
            social: {
                twitter: '#',
                linkedin: '#',
                github: '#'
            }
        },
        {
            name: 'Juan Murillo',
            role: 'QA Engineer',
            image: '../../public/assets/members/Juan.png',
            bio: 'Ensuring the highest quality in every release.',
            social: {
                twitter: '#',
                linkedin: '#',
                github: '#'
            }
        },
        {
            name: 'Luis Murillo',
            role: 'Data Scientist',
            image: '../../public/assets/members/Luis.png',
            bio: 'Extracting insights from complex data sets.',
            social: {
                twitter: '#',
                linkedin: '#',
                github: '#'
            }
        },
        {
            name: 'Patricia Rojas',
            role: 'Product Manager',
            image: '../../public/assets/members/Patricia.png',
            bio: 'Defining product vision and strategy.',
            social: {
                twitter: '#',
                linkedin: '#',
                github: '#'
            }
        },
        {
            name: 'Stephany Rojas',
            role: 'UX Researcher',
            image: '../../public/assets/members/Stephany.png',
            bio: 'Understanding user needs and behaviors.',
            social: {
                twitter: '#',
                linkedin: '#',
                github: '#'
            }
        }
    ];

    const dotsContainer = document.querySelector('.team-carousel-dots');
    const prevBtn = carousel.closest('.team-carousel-container').querySelector('.carousel-control.prev');
    const nextBtn = carousel.closest('.team-carousel-container').querySelector('.carousel-control.next');
    
    let currentIndex = 0;
    let itemsPerView = calculateItemsPerView();
    
    // Calculate number of items to show based on viewport width
    function calculateItemsPerView() {
        const width = window.innerWidth;
        if (width < 768) return 1;
        if (width < 1024) return 2;
        return 3;
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
        itemsPerView = calculateItemsPerView();
        updateCarousel();
    });
    
    // Generate team member cards
    function renderTeam() {
        carousel.innerHTML = teamMembers.map((member, index) => `
            <div class="team-member" data-index="${index}">
                <div class="member-image-container">
                    <div class="image-wrapper">
                        <img src="${member.image}" alt="${member.name}" class="member-image" 
                             onerror="this.onerror=null; this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=003d66&color=fff&size=300'">
                    </div>
                    <div class="social-links">
                        <a href="${member.social.twitter}" target="_blank" rel="noopener noreferrer" aria-label="${member.name}'s Twitter">
                            <i class="fab fa-twitter"></i>
                        </a>
                        <a href="${member.social.linkedin}" target="_blank" rel="noopener noreferrer" aria-label="${member.name}'s LinkedIn">
                            <i class="fab fa-linkedin-in"></i>
                        </a>
                        <a href="${member.social.github}" target="_blank" rel="noopener noreferrer" aria-label="${member.name}'s GitHub">
                            <i class="fab fa-github"></i>
                        </a>
                    </div>
                </div>
                <div class="member-info">
                    <h3>${member.name}</h3>
                    <p class="member-role">${member.role}</p>
                    <p class="member-bio">${member.bio}</p>
                </div>
            </div>
        `).join('');
        
        // Generate dots
        const totalDots = Math.max(1, Math.ceil(teamMembers.length / itemsPerView));
        dotsContainer.innerHTML = Array.from({ length: totalDots })
            .map((_, i) => `<button class="dot ${i === 0 ? 'active' : ''}" data-index="${i}" aria-label="Go to slide ${i + 1}"></button>`)
            .join('');
    }
    
    // Update carousel position
    function updateCarousel() {
        const item = document.querySelector('.team-member');
        if (!item) return;
        
        const itemWidth = item.offsetWidth + 32; // width + gap
        const newPosition = -currentIndex * itemWidth * itemsPerView;
        carousel.style.transform = `translateX(${newPosition}px)`;
        
        // Update active dot
        document.querySelectorAll('.dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === Math.floor(currentIndex / itemsPerView));
        });
        
        // Update button states
        prevBtn.disabled = currentIndex <= 0;
        nextBtn.disabled = currentIndex >= teamMembers.length - itemsPerView;
        
        // Add/remove disabled state for better UX
        prevBtn.classList.toggle('disabled', prevBtn.disabled);
        nextBtn.classList.toggle('disabled', nextBtn.disabled);
    }
    
    // Event listeners
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });
    
    nextBtn.addEventListener('click', () => {
        if (currentIndex < teamMembers.length - itemsPerView) {
            currentIndex++;
            updateCarousel();
        }
    });
    
    // Dot navigation
    dotsContainer.addEventListener('click', (e) => {
        const dot = e.target.closest('.dot');
        if (dot) {
            currentIndex = parseInt(dot.dataset.index);
            updateCarousel();
        }
    });
    
    // Touch support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50; // Minimum distance for a swipe
        const swipeDistance = touchEndX - touchStartX;
        
        if (Math.abs(swipeDistance) < swipeThreshold) return;
        
        if (swipeDistance > 0 && currentIndex > 0) {
            // Swipe right
            currentIndex--;
        } else if (swipeDistance < 0 && currentIndex < teamMembers.length - itemsPerView) {
            // Swipe left
            currentIndex++;
        }
        
        updateCarousel();
    }
    
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateCarousel();
        }, 250);
    });
    
    // Initialize
    renderTeam();
    updateCarousel();
}
