// // script.js

// // Smooth scrolling for navigation links
// document.querySelectorAll('a[href^="#"]').forEach(anchor => {
//     anchor.addEventListener('click', function (e) {
//         e.preventDefault();
//         const target = document.querySelector(this.getAttribute('href'));
//         if (target) {
//             target.scrollIntoView({
//                 behavior: 'smooth',
//                 block: 'start'
//             });
//         }
//     });
// });

// // Form submission
// document.querySelector('form').addEventListener('submit', function(e) {
//     e.preventDefault();
    
//     // Get form data
//     const formData = new FormData(this);
//     const data = {
//         name: formData.get('name'),
//         phone: formData.get('phone'),
//         email: formData.get('email'),
//         message: formData.get('message')
//     };
    
//     // Simple validation
//     if (!data.name || !data.phone || !data.message) {
//         alert('請填寫所有必填欄位！');
//         return;
//     }
    
//     // Show success message
//     alert('感謝您的諮詢！我們會盡快與您聯繫。');
    
//     // Reset form
//     this.reset();
// });

// // Add animation on scroll
// function animateOnScroll() {
//     const elements = document.querySelectorAll('.service-card, .team-member, .timeline-item');
//     elements.forEach(element => {
//         const elementTop = element.getBoundingClientRect().top;
//         const elementVisible = 150;
//         if (elementTop < window.innerHeight - elementVisible) {
//             element.style.opacity = '1';
//             element.style.transform = 'translateY(0)';
//         }
//     });
// }

// // Initial animation setup
// document.querySelectorAll('.service-card, .team-member, .timeline-item').forEach(element => {
//     element.style.opacity = '0';
//     element.style.transform = 'translateY(30px)';
//     element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
// });

// // Event listeners
// window.addEventListener('scroll', animateOnScroll);
// window.addEventListener('load', animateOnScroll);

// // Mobile menu toggle (if needed in the future)
// function toggleMobileMenu() {
//     const nav = document.querySelector('nav');
//     nav.classList.toggle('mobile-active');
// }



// // Add active nav indicator
// window.addEventListener('scroll', function() {
//     const sections = document.querySelectorAll('section[id]');
//     const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
//     let current = '';
//     sections.forEach(section => {
//         const sectionTop = section.offsetTop;
//         const sectionHeight = section.clientHeight;
//         if (window.scrollY >= sectionTop - 200) {
//             current = section.getAttribute('id');
//         }
//     });
    
//     navLinks.forEach(link => {
//         link.classList.remove('active');
//         if (link.getAttribute('href').slice(1) === current) {
//             link.classList.add('active');
//         }
//     });
// });

// // Add loading animation
// window.addEventListener('load', function() {
//     document.body.classList.add('loaded');
// });

// // Simple typing effect for hero title (optional enhancement)
// function typeWriter(element, text, speed = 100) {
//     let i = 0;
//     element.innerHTML = '';
    
//     function type() {
//         if (i < text.length) {
//             element.innerHTML += text.charAt(i);
//             i++;
//             setTimeout(type, speed);
//         }
//     }
    
//     type();
// }

// // Parallax effect for hero section (optional enhancement)
// window.addEventListener('scroll', function() {
//     const hero = document.querySelector('.hero');
//     const scrolled = window.pageYOffset;
//     const rate = scrolled * -0.5;
    
//     if (hero) {
//         hero.style.transform = `translateY(${rate}px)`;
//     }
// });

// // Add intersection observer for better performance
// const observerOptions = {
//     threshold: 0.1,
//     rootMargin: '0px 0px -50px 0px'
// };

// const observer = new IntersectionObserver(function(entries) {
//     entries.forEach(entry => {
//         if (entry.isIntersecting) {
//             entry.target.style.opacity = '1';
//             entry.target.style.transform = 'translateY(0)';
//         }
//     });
// }, observerOptions);

// // Observe elements when DOM is loaded
// document.addEventListener('DOMContentLoaded', function() {
//     const animatedElements = document.querySelectorAll('.service-card, .team-member, .timeline-item');
//     animatedElements.forEach(el => observer.observe(el));
// });