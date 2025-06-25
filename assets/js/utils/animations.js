// ======================================
// 動畫工具函數
// ======================================

/**
 * 滾動動畫觀察器
 */
export class ScrollAnimationObserver {
  constructor(options = {}) {
    this.options = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
      animationClass: 'animate-fade-in-up',
      ...options
    };
    
    this.observer = new IntersectionObserver(
      this.handleIntersection.bind(this),
      this.options
    );
  }
  
  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        entry.target.classList.add('visible');
        
        // 一次性觀察，避免重複觸發
        this.observer.unobserve(entry.target);
      }
    });
  }
  
  observe(elements) {
    if (typeof elements === 'string') {
      elements = document.querySelectorAll(elements);
    }
    
    if (elements.length === undefined) {
      elements = [elements];
    }
    
    elements.forEach(element => {
      // 設置初始狀態
      element.style.opacity = '0';
      element.style.transform = 'translateY(30px)';
      element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      
      this.observer.observe(element);
    });
  }
  
  disconnect() {
    this.observer.disconnect();
  }
}

/**
 * 平滑滾動到元素
 */
export function smoothScrollTo(element, duration = 800, offset = 100) {
  if (typeof element === 'string') {
    element = document.querySelector(element);
  }
  
  if (!element) return;
  
  const targetPosition = element.offsetTop - offset;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  let startTime = null;
  
  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = ease(timeElapsed, startPosition, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) requestAnimationFrame(animation);
  }
  
  function ease(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  }
  
  requestAnimationFrame(animation);
}

/**
 * 數字動畫計數器
 */
export function animateCounter(element, start = 0, end = 100, duration = 2000, prefix = '', suffix = '') {
  if (typeof element === 'string') {
    element = document.querySelector(element);
  }
  
  if (!element) return;
  
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

/**
 * 視差滾動效果
 */
export class ParallaxEffect {
  constructor(selector, speed = 0.5) {
    this.elements = document.querySelectorAll(selector);
    this.speed = speed;
    this.isActive = false;
    
    this.handleScroll = this.handleScroll.bind(this);
    this.init();
  }
  
  init() {
    if (this.elements.length > 0) {
      this.start();
    }
  }
  
  handleScroll() {
    if (!this.isActive) return;
    
    const scrolled = window.pageYOffset;
    
    this.elements.forEach(element => {
      const rate = scrolled * this.speed;
      element.style.transform = `translateY(${rate}px)`;
    });
  }
  
  start() {
    this.isActive = true;
    window.addEventListener('scroll', this.handleScroll, { passive: true });
  }
  
  stop() {
    this.isActive = false;
    window.removeEventListener('scroll', this.handleScroll);
  }
  
  destroy() {
    this.stop();
    this.elements.forEach(element => {
      element.style.transform = '';
    });
  }
}

/**
 * 打字機效果
 */
export function typeWriter(element, text, speed = 100, callback = null) {
  if (typeof element === 'string') {
    element = document.querySelector(element);
  }
  
  if (!element) return;
  
  let index = 0;
  element.textContent = '';
  element.style.borderRight = '2px solid var(--primary-color)';
  
  function type() {
    if (index < text.length) {
      element.textContent += text.charAt(index);
      index++;
      setTimeout(type, speed);
    } else {
      // 移除光標
      setTimeout(() => {
        element.style.borderRight = 'none';
        if (callback) callback();
      }, 1000);
    }
  }
  
  type();
}

/**
 * 浮動動畫
 */
export function addFloatingAnimation(elements, options = {}) {
  const defaults = {
    duration: 3,
    delay: 0,
    distance: 10
  };
  
  const settings = { ...defaults, ...options };
  
  if (typeof elements === 'string') {
    elements = document.querySelectorAll(elements);
  }
  
  if (elements.length === undefined) {
    elements = [elements];
  }
  
  // 添加 CSS 關鍵幀動畫
  const style = document.createElement('style');
  style.textContent = `
    @keyframes float-${settings.duration} {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-${settings.distance}px); }
    }
  `;
  document.head.appendChild(style);
  
  elements.forEach((element, index) => {
    const delay = settings.delay + (index * 0.2);
    element.style.animation = `float-${settings.duration} ${settings.duration}s ease-in-out infinite`;
    element.style.animationDelay = `${delay}s`;
  });
}

/**
 * 頁面載入動畫
 */
export function addPageLoadAnimation() {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  
  window.addEventListener('load', function() {
    setTimeout(() => {
      document.body.style.opacity = '1';
    }, 100);
  });
}

/**
 * 滾動進度條
 */
export class ScrollProgress {
  constructor(selector = '.progress-fill', container = null) {
    this.progressBar = document.querySelector(selector);
    this.container = container ? document.querySelector(container) : document.body;
    
    if (this.progressBar) {
      this.handleScroll = this.handleScroll.bind(this);
      this.init();
    }
  }
  
  init() {
    window.addEventListener('scroll', this.handleScroll, { passive: true });
    this.handleScroll(); // Initial call
  }
  
  handleScroll() {
    const containerHeight = this.container.scrollHeight - window.innerHeight;
    const scrolled = window.scrollY;
    const progress = Math.min(Math.max(scrolled / containerHeight, 0), 1);
    
    this.progressBar.style.width = `${progress * 100}%`;
  }
  
  destroy() {
    window.removeEventListener('scroll', this.handleScroll);
  }
}