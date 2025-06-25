// About page JavaScript functionality

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

// Add animation on scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.timeline-item, .experience-card, .expertise-card, .award-item, .principle-item');
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        if (elementTop < window.innerHeight - elementVisible) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// Profile avatar animation
function animateProfileAvatar() {
    const avatar = document.querySelector('.lawyer-avatar');
    if (avatar) {
        avatar.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(5deg)';
        });
        
        avatar.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    }
}

// Counter animation for profile highlights
function animateCounters() {
    const counters = document.querySelectorAll('.highlight-item span');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const text = entry.target.textContent;
                const match = text.match(/(\d+)/);
                if (match) {
                    const finalNumber = parseInt(match[1]);
                    const prefix = text.split(match[1])[0];
                    const suffix = text.split(match[1])[1];
                    
                    animateNumber(entry.target, 0, finalNumber, prefix, suffix, 2000);
                }
                observer.unobserve(entry.target);
            }
        });
    });
    
    counters.forEach(counter => observer.observe(counter));
}

function animateNumber(element, start, end, prefix, suffix, duration) {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (end - start) * easeOut);
        
        element.textContent = prefix + current + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// Parallax effect for hero section
function addParallaxEffect() {
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.3;
            hero.style.transform = `translateY(${rate}px)`;
        });
    }
}

// Add typing effect to philosophy quote
function addTypingEffect() {
    const quote = document.querySelector('.philosophy-quote blockquote');
    if (quote) {
        const text = quote.textContent;
        quote.textContent = '';
        quote.style.borderRight = '2px solid #d7b765';
        
        let index = 0;
        const typeSpeed = 50;
        
        function typeWriter() {
            if (index < text.length) {
                quote.textContent += text.charAt(index);
                index++;
                setTimeout(typeWriter, typeSpeed);
            } else {
                // Remove cursor after typing is complete
                setTimeout(() => {
                    quote.style.borderRight = 'none';
                }, 1000);
            }
        }
        
        // Start typing when element comes into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(typeWriter, 500);
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(quote);
    }
}

// Add floating animation to awards
function addFloatingAnimation() {
    const awards = document.querySelectorAll('.award-item');
    awards.forEach((award, index) => {
        // Add different delay for each award
        const delay = index * 0.2;
        award.style.animationDelay = `${delay}s`;
        
        // Add floating keyframe animation via CSS
        award.style.animation = 'float 3s ease-in-out infinite';
    });
}

// Add CSS keyframes for floating animation
function addFloatingKeyframes() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .animate-fade-in-up {
            animation: fadeInUp 0.8s ease-out;
        }
    `;
    document.head.appendChild(style);
}

// Initial animation setup
function setupInitialAnimations() {
    const elements = document.querySelectorAll('.timeline-item, .experience-card, .expertise-card, .award-item, .principle-item');
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    });
}

// Add active nav indicator
function updateActiveNavigation() {
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('nav a[href^="#"]');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });
}

// Add loading animation
function addLoadingAnimation() {
    window.addEventListener('load', function() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    });
}

// Touch gesture support for mobile
function addTouchGestures() {
    let touchStartY = 0;
    let touchEndY = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });
    
    document.addEventListener('touchend', function(e) {
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const swipeDistance = touchStartY - touchEndY;
        
        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) {
                // Swipe up - scroll to next section
                scrollToNextSection();
            } else {
                // Swipe down - scroll to previous section
                scrollToPreviousSection();
            }
        }
    }
    
    function scrollToNextSection() {
        const sections = document.querySelectorAll('section');
        const currentScroll = window.scrollY;
        
        for (let i = 0; i < sections.length; i++) {
            if (sections[i].offsetTop > currentScroll + 100) {
                sections[i].scrollIntoView({ behavior: 'smooth' });
                break;
            }
        }
    }
    
    function scrollToPreviousSection() {
        const sections = document.querySelectorAll('section');
        const currentScroll = window.scrollY;
        
        for (let i = sections.length - 1; i >= 0; i--) {
            if (sections[i].offsetTop < currentScroll - 100) {
                sections[i].scrollIntoView({ behavior: 'smooth' });
                break;
            }
        }
    }
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add CSS keyframes
    addFloatingKeyframes();
    
    // Setup initial states
    setupInitialAnimations();
    
    // Initialize animations and interactions
    animateProfileAvatar();
    animateCounters();
    addParallaxEffect();
    addTypingEffect();
    addFloatingAnimation();
    updateActiveNavigation();
    addLoadingAnimation();
    addTouchGestures();
    
    // Initial animation trigger
    animateOnScroll();
});

// Event listeners
window.addEventListener('scroll', animateOnScroll);
window.addEventListener('resize', function() {
    // Recalculate animations on resize
    animateOnScroll();
});