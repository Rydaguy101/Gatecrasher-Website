// DOM Elements
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const modal = document.getElementById('contactModal');
const closeModal = document.querySelector('.close');
const contactForm = document.getElementById('contactForm');
const dogInterestSelect = document.getElementById('dogInterest');

// Navigation Toggle
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Smooth scrolling function
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const offsetTop = element.offsetTop - 80; // Account for fixed navbar
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = '#000000';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = '#000000';
        navbar.style.boxShadow = 'none';
    }
});

// Modal functionality
function openContactModal(dogName = '') {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Pre-select dog if specified
    if (dogName) {
        dogInterestSelect.value = dogName;
    }
    
    // Focus on first input
    setTimeout(() => {
        document.getElementById('name').focus();
    }, 300);
}

function closeContactModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    contactForm.reset();
}

// Event listeners for modal
closeModal.addEventListener('click', closeContactModal);

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeContactModal();
    }
});

// Escape key to close modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'block') {
        closeContactModal();
    }
});

// Contact form submission
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        dogInterest: formData.get('dogInterest'),
        message: formData.get('message')
    };
    
    // Validate form
    if (!data.name || !data.email || !data.message) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
    }
    
    // Simulate form submission
    submitForm(data);
});

// Form submission function
async function submitForm(data) {
    const submitBtn = document.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    
    // Loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // In a real application, you would send data to your backend here
        console.log('Form submission data:', data);
        
        showNotification('Your inquiry has been sent successfully! We will contact you within 24 hours.', 'success');
        closeContactModal();
        
    } catch (error) {
        console.error('Form submission error:', error);
        showNotification('There was an error sending your inquiry. Please try again.', 'error');
    } finally {
        // Reset button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 3000;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'check-circle';
        case 'error': return 'exclamation-triangle';
        case 'warning': return 'exclamation-circle';
        default: return 'info-circle';
    }
}

function getNotificationColor(type) {
    switch (type) {
        case 'success': return '#28a745';
        case 'error': return '#dc3545';
        case 'warning': return '#ffc107';
        default: return '#17a2b8';
    }
}

// AOS (Animate On Scroll) implementation
function initAOS() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all elements with data-aos attribute
    document.querySelectorAll('[data-aos]').forEach(el => {
        observer.observe(el);
    });
}

// Parallax effect for hero section
function initParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroImg = document.querySelector('.hero-bg-img');
        
        if (heroImg && scrolled < window.innerHeight) {
            heroImg.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
        
        // Hero content stays fixed - no parallax movement
    });
}

// Stats counter animation
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = target.textContent;
                const isNumber = !isNaN(parseInt(finalValue));
                
                if (isNumber) {
                    animateNumber(target, parseInt(finalValue));
                }
                observer.unobserve(target);
            }
        });
    });
    
    statNumbers.forEach(stat => observer.observe(stat));
}

function animateNumber(element, finalValue) {
    let currentValue = 0;
    const increment = finalValue / 60; // 60 frames for smooth animation
    const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= finalValue) {
            currentValue = finalValue;
            clearInterval(timer);
        }
        element.textContent = Math.floor(currentValue) + (finalValue >= 100 ? '+' : '');
    }, 16); // ~60fps
}

// Lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        scrollToSection(targetId);
    });
});

// Hero scroll indicator
function initHeroScroll() {
    const heroScroll = document.querySelector('.hero-scroll');
    if (heroScroll) {
        heroScroll.addEventListener('click', () => {
            scrollToSection('dogs');
        });
    }
}

// Form validation enhancement
function enhanceFormValidation() {
    const inputs = document.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        // Real-time validation feedback
        input.addEventListener('blur', () => {
            validateField(input);
        });
        
        input.addEventListener('input', () => {
            // Clear validation state on input
            input.classList.remove('valid', 'invalid');
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = emailRegex.test(value);
    }
    
    // Apply validation classes
    if (value) {
        field.classList.toggle('valid', isValid);
        field.classList.toggle('invalid', !isValid);
    }
    
    return isValid;
}

// Performance optimization: Debounced resize handler
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

const handleResize = debounce(() => {
    // Handle responsive adjustments
    if (window.innerWidth > 768) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
}, 250);

window.addEventListener('resize', handleResize);

// Hero Carousel functionality
function initHeroCarousel() {
    const slides = document.querySelectorAll('.hero-slide');
    let currentSlide = 0;
    
    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }
    
    // Auto-advance every 5 seconds
    setInterval(nextSlide, 5000);
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initAOS();
    initParallax();
    animateStats();
    initLazyLoading();
    initHeroScroll();
    enhanceFormValidation();
    initHeroCarousel();
    
    // Add custom CSS animations for notifications
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
            gap: 0.5rem;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            margin-left: auto;
            padding: 0 0.5rem;
        }
        
        input.valid, textarea.valid, select.valid {
            border-color: #28a745;
        }
        
        input.invalid, textarea.invalid, select.invalid {
            border-color: #dc3545;
        }
    `;
    document.head.appendChild(style);
});

// Error handling for images
document.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG') {
        e.target.style.display = 'none';
        console.warn('Failed to load image:', e.target.src);
    }
}, true);

// Performance monitoring
const performanceObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
            console.log('FCP:', entry.startTime);
        }
    }
});

try {
    performanceObserver.observe({ entryTypes: ['paint'] });
} catch (e) {
    // PerformanceObserver not supported
}

// Dog Filtering System
let currentFilter = 'all';
let lastFilterTime = 0;
const FILTER_COOLDOWN = 1000; // 1 second cooldown

function filterDogs(category) {
    const now = Date.now();
    
    // Check cooldown for same button
    if (currentFilter === category && (now - lastFilterTime) < FILTER_COOLDOWN) {
        return;
    }
    
    const filterBtns = document.querySelectorAll('.filter-btn');
    const activeBtn = document.querySelector(`[data-category="${category}"]`);
    
    if (!activeBtn) return;
    
    lastFilterTime = now;
    
    // Remove active class from all buttons
    filterBtns.forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to clicked button
    activeBtn.classList.add('active');
    
    if (category === 'all') {
        // Show all categories
        document.querySelectorAll('.male-dogs, .female-dogs, .male-puppies, .female-puppies, .upcoming-breeds').forEach((section, index) => {
            section.style.display = 'block';
            setTimeout(() => {
                section.classList.add('filtered');
            }, index * 100);
        });
    } else {
        // Hide all categories first
        document.querySelectorAll('.male-dogs, .female-dogs, .male-puppies, .female-puppies, .upcoming-breeds').forEach(section => {
            section.style.display = 'none';
            section.classList.remove('filtered');
        });
        
        // Show only selected category based on class name
        let targetClass = '';
        switch(category) {
            case 'male':
                targetClass = '.male-dogs';
                break;
            case 'female':
                targetClass = '.female-dogs';
                break;
            case 'male-puppies':
                targetClass = '.male-puppies';
                break;
            case 'female-puppies':
                targetClass = '.female-puppies';
                break;
            case 'upcoming':
                targetClass = '.upcoming-breeds';
                break;
        }
        
        if (targetClass) {
            const targetSection = document.querySelector(targetClass);
            if (targetSection) {
                targetSection.style.display = 'block';
                setTimeout(() => {
                    targetSection.classList.add('filtered');
                }, 100);
            }
        }
    }
    
    currentFilter = category;
}

// Export functions for potential external use
window.GatecrasherK9 = {
    scrollToSection,
    openContactModal,
    closeContactModal,
    showNotification,
    filterDogs
};
