// Dynamic Text Rotation
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Carousels
    initBannerCarousel();
    initTeamCarousel();
    
    // Dynamic Text Configuration
    const dynamicText = document.getElementById('dynamic-text');
    if (dynamicText) {
        const words = ['thinkers', 'innovators', 'creators', 'problem solvers', 'visionaries'];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        const typeSpeed = 200;  // Increased from 100 to 200ms per character
        const deleteSpeed = 50;  // Increased from 30 to 50ms per character

        /**
         * Type effect function
         * Handles the typing and deleting of characters
         */
        function typeEffect() {
            const currentWord = words[wordIndex];
            
            if (isDeleting) {
                // Delete characters
                dynamicText.textContent = currentWord.substring(0, charIndex - 1).toLowerCase();
                charIndex--;
            } else {
                // Type characters
                dynamicText.textContent = currentWord.substring(0, charIndex + 1).toLowerCase();
                charIndex++;
            }

            // Check if we've finished typing the word
            if (!isDeleting && charIndex === currentWord.length) {
                isDeleting = true;
            }

            // Check if we've finished deleting the word
            if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
            }

            // Set typing speed
            const speed = isDeleting ? deleteSpeed : typeSpeed;
            setTimeout(typeEffect, speed);
        }

        // Start the typing effect
        dynamicText.classList.add('typing-cursor');
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
    const dotsContainer = document.querySelector('.carousel-dots');
    
    if (!carouselSlide) return; // Exit if no carousel found
    
    let currentIndex = 0;

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
    }

    // Go to specific slide
    function goToSlide(index) {
        currentIndex = index;
        updateCarousel();
    }

    // Auto-advance slides
    setInterval(nextSlide, 5000);

    // Handle window resize
    window.addEventListener('resize', updateCarousel);
    
    // Initialize the carousel
    updateCarousel();

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
                nextSlide();
            }
        }
    }

    // Dot navigation
    dotsContainer.addEventListener('click', (e) => {
        const dot = e.target.closest('.dot');
        if (dot) {
            currentIndex = parseInt(dot.dataset.index);
            updateCarousel();
        }
    });
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
            name: 'Dushka Jimenez',
            role: 'Designer',
            image: '../../public/assets/Integrantes/Dushka1.jpg',
            hoverImage: '../../public/assets/Integrantes/Dushka2.jpg',
            bio: 'Transforming ideas into beautiful and intuitive user experiences.',
            social: {
                email: '#',
                linkedin: '#',
                github: '#'
            }
        },
        {
            name: 'Elina Perez',
            role: 'Frontend Developer',
            image: '../../public/assets/Integrantes/Elina1.jpg',
            hoverImage: '../../public/assets/Integrantes/Elina2.jpg',
            bio: 'Building responsive and accessible web applications.',
            social: {
                email: '#',
                linkedin: '#',
                github: '#'
            }
        },
        {
            name: 'Isaura Ríos',
            role: 'Frontend Developer',
            image: '../../public/assets/Integrantes/Isaura1.jpg',
            hoverImage: '../../public/assets/Integrantes/Ir2.png',
            bio: 'Bridging the gap between frontend and backend development.',
            social: {
                email: '#',
                linkedin: '#',
                github: '#'
            }
        },
        {
            name: 'Jhostan Jimenez',
            role: 'Frontend Developer',
            image: '../../public/assets/Integrantes/Jhostan1.jpg',
            hoverImage: '../../public/assets/Integrantes/Jhostan2.jpg',
            bio: 'Building cross-platform mobile experiences.',
            social: {
                email: '#',
                linkedin: '#',
                github: '#'
            }
        },
        {
            name: 'Josue Rodriguez',
            role: 'Frontend Developer',
            image: '../../public/assets/Integrantes/Josue1.jpg',
            hoverImage: '../../public/assets/Integrantes/Josue2.jpg',
            bio: 'Automating deployments and ensuring system reliability.',
            social: {
                email: '#',
                linkedin: '#',
                github: '#'
            }
        },
        {
            name: 'Juan Morales',
            role: 'Backend Developer',
            image: '../../public/assets/Integrantes/Juan1.jpg',
            hoverImage: '../../public/assets/Integrantes/Juan2.jpg',
            bio: 'Ensuring the highest quality in every release.',
            social: {
                email: '#',
                linkedin: '#',
                github: '#'
            }
        },
        {
            name: 'Anmaryn Murillo',
            role: 'Frontend Developer',
            image: '../../public/assets/Integrantes/Anmaryn1.jpg',
            hoverImage: '../../public/assets/Integrantes/Anmaryn2.jpg',
            bio: 'Passionate about creating impactful solutions through technology.',
            social: {
                email: '#',
                linkedin: '#',
                github: '#'
            }
        },
        {
            name: 'Emily Bulgin',
            role: 'Designer',
            image: '../../public/assets/Integrantes/Emily1.jpg',
            hoverImage: '../../public/assets/Integrantes/Emily2.jpg',
            bio: 'Making the user experience.',
            social: {
                email: '#',
                linkedin: '#',
                github: '#'
            }
        },
        {
            name: 'Patricia Fernandez',
            role: 'Designer',
            image: '../../public/assets/Integrantes/Patricia1.jpg',
            hoverImage: '../../public/assets/Integrantes/Patricia2.jpg',
            bio: 'Creating beautiful and intuitive user experiences.',
            social: {
                email: '#',
                linkedin: '#',
                github: '#'
            }
        },
        {
            name: 'Stephany Dominguez',
            role: 'Data Researcher',
            image: '../../public/assets/Integrantes/Stephany1.jpg',
            hoverImage: '../../public/assets/Integrantes/Stephany2.jpg',
            bio: 'Searcher of information and data.',
            social: {
                email: '#',
                linkedin: '#',
                github: '#'
            }
        },
        {
            name: 'Luis Camargo',
            role: 'Backend Developer',
            image: '../../public/assets/Integrantes/Luis1.jpg',
            hoverImage: '../../public/assets/Integrantes/Luis2.jpg',
            bio: 'Extracting insights from complex data sets.',
            social: {
                email: '#',
                linkedin: '#',
                github: '#'
            }
        }
    ];

    const dotsContainer = document.querySelector('.team-carousel-dots');
    let currentIndex = 0;
    let itemsPerView = calculateItemsPerView();
    
    // Calculate number of items to show based on viewport width
    function calculateItemsPerView() {
        const width = window.innerWidth;
        if (width < 768) return 1;
        if (width < 1200) return 2;
        return 3;
    }
    
    // Debounce function
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Handle window resize with debounce
    function handleResize() {
        itemsPerView = calculateItemsPerView();
        currentIndex = 0; // Reset to first item on resize
        updateCarousel();
    }
    
    window.addEventListener('resize', debounce(handleResize, 150));
    
    // Generate team member cards
    function renderTeam() {
        carousel.innerHTML = teamMembers.map((member, index) => `
            <div class="team-member" data-index="${index}">
                <div class="member-image-container">
                    <div class="image-wrapper">
                        <img src="${member.image}" alt="${member.name}" class="member-image default-image" 
                             onerror="this.onerror=null; this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=003d66&color=fff&size=300'">
                        <img src="${member.hoverImage}" alt="${member.name} (hover)" class="member-image hover-image" 
                             onerror="this.onerror=null; this.style.display='none'">
                    </div>
                    <div class="social-links">
                        <a href="${member.social.email}" target="_blank" rel="noopener noreferrer" aria-label="${member.name}'s Email">
                            <i class="fas fa-envelope"></i>
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
        const items = document.querySelectorAll('.team-member');
        if (!items.length) return;
        
        // Get the first team member to calculate dimensions
        const firstItem = items[0];
        if (!firstItem) return;
        
        // Get the width of the carousel container
        const container = carousel.parentElement;
        const containerWidth = container.offsetWidth;
        
        // Get the width of a single item including its margin
        const itemStyle = window.getComputedStyle(firstItem);
        const itemWidth = firstItem.offsetWidth + 
                         parseFloat(itemStyle.marginLeft) + 
                         parseFloat(itemStyle.marginRight);
        
        // Calculate how many items fit in the viewport
        const itemsPerView = Math.max(1, Math.floor(containerWidth / itemWidth));
        
        // Calculate the maximum index we can go to
        const maxIndex = Math.max(0, teamMembers.length - itemsPerView);
        
        // Ensure currentIndex is within bounds
        currentIndex = Math.max(0, Math.min(currentIndex, maxIndex));
        
        // Calculate the new position
        const newPosition = -currentIndex * itemWidth;
        
        // Apply the transform with smooth transition
        carousel.style.transition = 'transform 0.5s ease-in-out';
        carousel.style.transform = `translateX(${newPosition}px)`;
        
        // Update active dot
        const activeDotIndex = Math.min(
            Math.floor(currentIndex / itemsPerView),
            document.querySelectorAll('.dot').length - 1
        );
        
        document.querySelectorAll('.dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === activeDotIndex);
        });
    }
    
    // Event listeners for navigation
    function goToPrev() {
        const maxIndex = Math.max(0, teamMembers.length - itemsPerView);
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            // If at the start, loop to the end
            currentIndex = maxIndex > 0 ? maxIndex : 0;
        }
        updateCarousel();
    }
    
    function goToNext() {
        const maxIndex = Math.max(0, teamMembers.length - itemsPerView);
        if (currentIndex < maxIndex) {
            currentIndex++;
        } else {
            // If at the end, loop back to start
            currentIndex = 0;
        }
        updateCarousel();
    }
    
    // Dot navigation
    dotsContainer.addEventListener('click', (e) => {
        const dot = e.target.closest('.dot');
        if (dot) {
            currentIndex = parseInt(dot.dataset.index) * itemsPerView;
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
    
    // Recalculate on window resize with debounce
    const debouncedResize = debounce(() => {
        itemsPerView = calculateItemsPerView();
        updateCarousel();
    }, 250);
    
    window.addEventListener('resize', debouncedResize);
    
    // Cleanup event listeners on component unmount if needed
    return () => {
        if (prevBtn) prevBtn.removeEventListener('click', goToPrev);
        if (nextBtn) nextBtn.removeEventListener('click', goToNext);
        window.removeEventListener('resize', debouncedResize);
    };
}
