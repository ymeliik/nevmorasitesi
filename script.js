// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background change on scroll
function setNavbarInitialStyle() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        navbar.style.background = 'linear-gradient(90deg, #18171c 0%, #232026 100%)';
        navbar.style.backdropFilter = 'blur(8px)';
        navbar.style.boxShadow = '0 2px 16px #bfa77a22';
        navbar.style.padding = '1rem 0';
        navbar.style.borderBottom = 'none';
    }
    document.querySelectorAll('.nav-link').forEach(link => {
        link.style.color = '#fff';
    });
}
window.addEventListener('DOMContentLoaded', setNavbarInitialStyle);

window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const scrollY = window.scrollY;
    if (navbar) {
        // Her zaman koyu ve opak arka plan
        navbar.style.background = 'linear-gradient(90deg, #18171c 0%, #232026 100%)';
        if (scrollY > 50) {
            navbar.style.padding = '0.5rem 0';
            navbar.style.backdropFilter = 'blur(15px)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
            navbar.style.borderBottom = '1px solid rgba(191, 167, 122, 0.1)';
        } else {
            navbar.style.padding = '1rem 0';
            navbar.style.backdropFilter = 'blur(8px)';
            navbar.style.boxShadow = '0 2px 16px #bfa77a22';
            navbar.style.borderBottom = 'none';
        }
    }
});

// Contact Form Handling
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const name = formData.get('name');
    const phone = formData.get('phone');
    const email = formData.get('email');
    const message = formData.get('message');
    
    // Simple validation
    if (!name || !phone || !email || !message) {
        showNotification('Lütfen tüm alanları doldurun.', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Lütfen geçerli bir e-posta adresi girin.', 'error');
        return;
    }
    
    if (!isValidPhone(phone)) {
        showNotification('Lütfen geçerli bir telefon numarası girin.', 'error');
        return;
    }
    
    // Show loading message
    showNotification('Mesajınız gönderiliyor...', 'info');
    
    // Submit to Formspree
    fetch('https://formspree.io/f/mgvydzgl', {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            showNotification('Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.', 'success');
            contactForm.reset();
        } else {
            throw new Error('Form submission failed');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification('Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.', 'error');
    });
});

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Phone validation
function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Add notification animations to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        margin-left: 10px;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .notification-close:hover {
        opacity: 0.8;
    }
`;
document.head.appendChild(style);

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.service-card, .gallery-item, .contact-item, .about-content');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Lightbox functionality for gallery
const lightboxModal = document.getElementById('lightbox-modal');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');

const galleryLinks = Array.from(document.querySelectorAll('.gallery-lightbox'));
let currentIndex = 0;

function openLightbox(src, alt, idx) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    currentIndex = idx;
    updateArrowVisibility();
    lightboxClose.focus();
}
function closeLightbox() {
    lightboxModal.classList.remove('active');
    setTimeout(() => {
        lightboxImg.src = '';
        document.body.style.overflow = '';
    }, 300);
}
function showPrev() {
    if (galleryLinks.length < 2) return;
    currentIndex = (currentIndex - 1 + galleryLinks.length) % galleryLinks.length;
    const img = galleryLinks[currentIndex].querySelector('img');
    openLightbox(galleryLinks[currentIndex].href, img ? img.alt : '', currentIndex);
}
function showNext() {
    if (galleryLinks.length < 2) return;
    currentIndex = (currentIndex + 1) % galleryLinks.length;
    const img = galleryLinks[currentIndex].querySelector('img');
    openLightbox(galleryLinks[currentIndex].href, img ? img.alt : '', currentIndex);
}
function updateArrowVisibility() {
    if (galleryLinks.length < 2) {
        lightboxPrev.style.display = 'none';
        lightboxNext.style.display = 'none';
    } else {
        lightboxPrev.style.display = '';
        lightboxNext.style.display = '';
    }
}
galleryLinks.forEach((link, idx) => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const img = link.querySelector('img');
        openLightbox(link.href, img ? img.alt : '', idx);
    });
});
lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', e => { e.stopPropagation(); showPrev(); });
lightboxNext.addEventListener('click', e => { e.stopPropagation(); showNext(); });
lightboxModal.addEventListener('click', e => {
    if (e.target === lightboxModal) closeLightbox();
});
document.addEventListener('keydown', e => {
    if (lightboxModal.classList.contains('active')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
        // Trap focus in modal
        if (e.key === 'Tab') {
            e.preventDefault();
            lightboxClose.focus();
        }
    }
});

// WhatsApp button enhancement
document.querySelector('.btn-whatsapp').addEventListener('click', (e) => {
    // Add click tracking or analytics here if needed
    console.log('WhatsApp button clicked');
});

// Form input enhancements
document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
    // Add focus effects
    input.addEventListener('focus', () => {
        input.parentElement.style.transform = 'scale(1.02)';
    });
    
    input.addEventListener('blur', () => {
        input.parentElement.style.transform = 'scale(1)';
    });
    
    // Add floating label effect (optional enhancement)
    if (input.placeholder) {
        input.addEventListener('input', () => {
            if (input.value) {
                input.classList.add('has-value');
            } else {
                input.classList.remove('has-value');
            }
        });
    }
});

// Scroll to top functionality
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollToTopBtn.className = 'scroll-to-top';
scrollToTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #8B7355 0%, #A0522D 100%);
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
    box-shadow: 0 4px 15px rgba(139, 115, 85, 0.3);
`;

document.body.appendChild(scrollToTopBtn);

// Show/hide scroll to top button
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollToTopBtn.style.opacity = '1';
        scrollToTopBtn.style.visibility = 'visible';
    } else {
        scrollToTopBtn.style.opacity = '0';
        scrollToTopBtn.style.visibility = 'hidden';
    }
});

// Scroll to top functionality
scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Add hover effect to scroll to top button
scrollToTopBtn.addEventListener('mouseenter', () => {
    scrollToTopBtn.style.transform = 'translateY(-3px)';
    scrollToTopBtn.style.boxShadow = '0 6px 20px rgba(139, 115, 85, 0.4)';
});

scrollToTopBtn.addEventListener('mouseleave', () => {
    scrollToTopBtn.style.transform = 'translateY(0)';
    scrollToTopBtn.style.boxShadow = '0 4px 15px rgba(139, 115, 85, 0.3)';
});

// Performance optimization: Debounce scroll events
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

// Apply debouncing to scroll events
const debouncedScrollHandler = debounce(() => {
    // Navbar background change
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
    
    // Scroll to top button
    if (window.scrollY > 300) {
        scrollToTopBtn.style.opacity = '1';
        scrollToTopBtn.style.visibility = 'visible';
    } else {
        scrollToTopBtn.style.opacity = '0';
        scrollToTopBtn.style.visibility = 'hidden';
    }
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    console.log('Plise Perde website loaded successfully!');
    
    // Add loading animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Preloader logic
window.addEventListener('DOMContentLoaded', () => {
    const preloader = document.getElementById('preloader');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
        preloader.classList.add('fade-out');
        setTimeout(() => {
            preloader.style.display = 'none';
            document.body.style.overflow = '';
        }, 700);
    }, 1500);
});

// Section fade-in animation
window.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    const observer = new window.IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15 });
    sections.forEach(section => observer.observe(section));
});

// Carousel slider logic
const carousel = document.querySelector('.carousel');
const carouselTrack = document.querySelector('.carousel-track');
const carouselItems = Array.from(document.querySelectorAll('.carousel-item'));
const arrowLeft = document.querySelector('.carousel-arrow.left');
const arrowRight = document.querySelector('.carousel-arrow.right');
let carouselIndex = 0;
let carouselInterval = null;
let isCarouselPaused = false;

function showCarouselIndex(idx) {
    const visibleCount = getVisibleCarouselCount();
    if (idx < 0) idx = carouselItems.length - visibleCount;
    if (idx > carouselItems.length - visibleCount) idx = 0;
    carouselIndex = idx;
    const itemWidth = carouselItems[0].offsetWidth + parseInt(getComputedStyle(carouselTrack).gap || 0);
    carouselTrack.scrollTo({
        left: itemWidth * carouselIndex,
        behavior: 'smooth'
    });
}
function getVisibleCarouselCount() {
    if (window.innerWidth <= 600) return 1;
    if (window.innerWidth <= 900) return 2;
    if (window.innerWidth <= 1100) return 3;
    return 3;
}
function nextCarousel() {
    showCarouselIndex((carouselIndex + 1) % carouselItems.length);
}
function prevCarousel() {
    showCarouselIndex((carouselIndex - 1 + carouselItems.length) % carouselItems.length);
}
function startCarouselAuto() {
    if (carouselInterval) clearInterval(carouselInterval);
    carouselInterval = setInterval(() => {
        if (!isCarouselPaused) nextCarousel();
    }, 3000);
}
function pauseCarouselAuto() {
    isCarouselPaused = true;
}
function resumeCarouselAuto() {
    isCarouselPaused = false;
}
arrowLeft.addEventListener('click', () => { pauseCarouselAuto(); prevCarousel(); });
arrowRight.addEventListener('click', () => { pauseCarouselAuto(); nextCarousel(); });
carousel.addEventListener('mouseenter', pauseCarouselAuto);
carousel.addEventListener('mouseleave', resumeCarouselAuto);
carousel.addEventListener('touchstart', pauseCarouselAuto);
carousel.addEventListener('touchend', resumeCarouselAuto);

// Swipe support
let startX = 0;
let isSwiping = false;
carouselTrack.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    isSwiping = true;
});
carouselTrack.addEventListener('touchmove', e => {
    if (!isSwiping) return;
    const dx = e.touches[0].clientX - startX;
    if (Math.abs(dx) > 40) {
        if (dx > 0) prevCarousel();
        else nextCarousel();
        isSwiping = false;
    }
});
carouselTrack.addEventListener('touchend', () => { isSwiping = false; });

window.addEventListener('resize', () => showCarouselIndex(carouselIndex));
showCarouselIndex(0);
startCarouselAuto();

// Hero Slideshow Functionality
class HeroSlideshow {
    constructor() {
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.slide');
        this.autoPlayInterval = null;
        this.autoPlayDelay = 4000; // 4 seconds
        
        this.init();
    }
    
    init() {
        if (this.slides.length === 0) return;
        
        this.startAutoPlay();
        this.updateSlides();
    }
    
    updateSlides() {
        // Update slides
        this.slides.forEach((slide, index) => {
            slide.classList.remove('active', 'slide-in', 'slide-out');
            if (index === this.currentSlide) {
                slide.classList.add('active', 'slide-in');
            }
        });
    }
    
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.updateSlides();
    }
    
    startAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoPlayDelay);
    }
    
    pauseAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    resetAutoPlay() {
        this.pauseAutoPlay();
        this.startAutoPlay();
    }
}

// Initialize Hero Slideshow when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new HeroSlideshow();
}); 