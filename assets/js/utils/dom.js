// ======================================
// DOM 操作工具函數
// ======================================

/**
 * 通知系統
 */
export class NotificationSystem {
  constructor() {
    this.container = this.createContainer();
  }
  
  createContainer() {
    let container = document.querySelector('.notification-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'notification-container';
      container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1001;
        pointer-events: none;
      `;
      document.body.appendChild(container);
    }
    return container;
  }
  
  show(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      background: var(--primary-color);
      color: var(--bg-dark);
      padding: 1rem 2rem;
      border-radius: 10px;
      font-weight: 600;
      margin-bottom: 10px;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      pointer-events: auto;
      cursor: pointer;
    `;
    
    // 設置不同類型的顏色
    if (type === 'error') {
      notification.style.background = '#ef4444';
      notification.style.color = '#ffffff';
    } else if (type === 'success') {
      notification.style.background = '#10b981';
      notification.style.color = '#ffffff';
    } else if (type === 'warning') {
      notification.style.background = '#f59e0b';
      notification.style.color = '#1f2937';
    }
    
    this.container.appendChild(notification);
    
    // 動畫進入
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // 點擊關閉
    notification.addEventListener('click', () => {
      this.remove(notification);
    });
    
    // 自動關閉
    if (duration > 0) {
      setTimeout(() => {
        this.remove(notification);
      }, duration);
    }
    
    return notification;
  }
  
  remove(notification) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }
  
  success(message, duration) {
    return this.show(message, 'success', duration);
  }
  
  error(message, duration) {
    return this.show(message, 'error', duration);
  }
  
  warning(message, duration) {
    return this.show(message, 'warning', duration);
  }
  
  info(message, duration) {
    return this.show(message, 'info', duration);
  }
}

/**
 * 模態框系統
 */
export class Modal {
  constructor(selector, options = {}) {
    this.modal = typeof selector === 'string' 
      ? document.querySelector(selector) 
      : selector;
    
    this.options = {
      closeOnBackdrop: true,
      closeOnEsc: true,
      showCloseButton: true,
      ...options
    };
    
    this.isOpen = false;
    this.init();
  }
  
  init() {
    if (!this.modal) return;
    
    // 設置基本樣式
    this.modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 999;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
    `;
    
    // 設置事件監聽器
    if (this.options.closeOnBackdrop) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) {
          this.close();
        }
      });
    }
    
    if (this.options.closeOnEsc) {
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          this.close();
        }
      });
    }
  }
  
  open() {
    this.isOpen = true;
    this.modal.style.opacity = '1';
    this.modal.style.visibility = 'visible';
    document.body.style.overflow = 'hidden';
    
    // 觸發事件
    this.modal.dispatchEvent(new CustomEvent('modal:open'));
  }
  
  close() {
    this.isOpen = false;
    this.modal.style.opacity = '0';
    this.modal.style.visibility = 'hidden';
    document.body.style.overflow = '';
    
    // 觸發事件
    this.modal.dispatchEvent(new CustomEvent('modal:close'));
  }
  
  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }
}

/**
 * 移動端選單控制器
 */
export class MobileMenu {
  constructor(toggleSelector, menuSelector, options = {}) {
    this.toggle = document.querySelector(toggleSelector);
    this.menu = document.querySelector(menuSelector);
    this.options = {
      activeClass: 'active',
      bodyLockClass: 'menu-open',
      ...options
    };
    
    this.isOpen = false;
    this.init();
  }
  
  init() {
    if (!this.toggle || !this.menu) return;
    
    // 切換按鈕事件
    this.toggle.addEventListener('click', () => {
      this.toggle();
    });
    
    // 點擊選單外部關閉
    this.menu.addEventListener('click', (e) => {
      if (e.target === this.menu) {
        this.close();
      }
    });
    
    // 點擊連結後關閉選單
    const links = this.menu.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', () => {
        this.close();
      });
    });
    
    // ESC 鍵關閉
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  }
  
  open() {
    this.isOpen = true;
    this.menu.classList.add(this.options.activeClass);
    document.body.classList.add(this.options.bodyLockClass);
    document.body.style.overflow = 'hidden';
  }
  
  close() {
    this.isOpen = false;
    this.menu.classList.remove(this.options.activeClass);
    document.body.classList.remove(this.options.bodyLockClass);
    document.body.style.overflow = '';
  }
  
  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }
}

/**
 * 表單驗證器
 */
export class FormValidator {
  constructor(formSelector, options = {}) {
    this.form = typeof formSelector === 'string' 
      ? document.querySelector(formSelector) 
      : formSelector;
    
    this.options = {
      errorClass: 'form__error',
      successClass: 'form__success',
      ...options
    };
    
    this.rules = {};
    this.init();
  }
  
  init() {
    if (!this.form) return;
    
    this.form.addEventListener('submit', (e) => {
      if (!this.validate()) {
        e.preventDefault();
      }
    });
  }
  
  addRule(fieldName, validator, message) {
    if (!this.rules[fieldName]) {
      this.rules[fieldName] = [];
    }
    this.rules[fieldName].push({ validator, message });
  }
  
  validate() {
    let isValid = true;
    
    // 清除之前的錯誤訊息
    this.clearErrors();
    
    Object.keys(this.rules).forEach(fieldName => {
      const field = this.form.querySelector(`[name="${fieldName}"]`);
      if (!field) return;
      
      const value = field.value.trim();
      
      this.rules[fieldName].forEach(rule => {
        if (!rule.validator(value, field)) {
          this.showError(field, rule.message);
          isValid = false;
        }
      });
    });
    
    return isValid;
  }
  
  showError(field, message) {
    const errorElement = document.createElement('div');
    errorElement.className = this.options.errorClass;
    errorElement.textContent = message;
    
    field.parentNode.appendChild(errorElement);
    field.classList.add('error');
  }
  
  clearErrors() {
    const errors = this.form.querySelectorAll(`.${this.options.errorClass}`);
    errors.forEach(error => error.remove());
    
    const errorFields = this.form.querySelectorAll('.error');
    errorFields.forEach(field => field.classList.remove('error'));
  }
  
  // 常用驗證規則
  static rules = {
    required: (value) => value.length > 0,
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    phone: (value) => /^[\d\s\-\+\(\)]+$/.test(value),
    minLength: (min) => (value) => value.length >= min,
    maxLength: (max) => (value) => value.length <= max
  };
}

/**
 * 載入狀態管理器
 */
export class LoadingManager {
  constructor() {
    this.activeLoaders = new Set();
  }
  
  show(target, options = {}) {
    const element = typeof target === 'string' 
      ? document.querySelector(target) 
      : target;
    
    if (!element) return null;
    
    const defaults = {
      text: '載入中...',
      spinner: true,
      overlay: true
    };
    
    const settings = { ...defaults, ...options };
    
    // 創建載入元素
    const loader = document.createElement('div');
    loader.className = 'loading-overlay';
    loader.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(27, 34, 35, 0.8);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 10;
      color: var(--text-light);
    `;
    
    if (settings.spinner) {
      const spinner = document.createElement('div');
      spinner.className = 'loading-spinner';
      spinner.style.cssText = `
        width: 40px;
        height: 40px;
        border: 3px solid rgba(215, 183, 101, 0.3);
        border-top: 3px solid var(--primary-color);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 1rem;
      `;
      loader.appendChild(spinner);
    }
    
    if (settings.text) {
      const text = document.createElement('div');
      text.textContent = settings.text;
      text.style.fontSize = '0.9rem';
      loader.appendChild(text);
    }
    
    // 確保父元素有相對定位
    const position = getComputedStyle(element).position;
    if (position === 'static') {
      element.style.position = 'relative';
    }
    
    element.appendChild(loader);
    this.activeLoaders.add(loader);
    
    return {
      hide: () => this.hide(loader),
      updateText: (newText) => {
        const textElement = loader.querySelector('div:last-child');
        if (textElement) textElement.textContent = newText;
      }
    };
  }
  
  hide(loader) {
    if (loader && loader.parentNode) {
      loader.parentNode.removeChild(loader);
      this.activeLoaders.delete(loader);
    }
  }
  
  hideAll() {
    this.activeLoaders.forEach(loader => this.hide(loader));
  }
}

// 添加旋轉動畫的 CSS
const spinKeyframes = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

if (!document.querySelector('#spin-keyframes')) {
  const style = document.createElement('style');
  style.id = 'spin-keyframes';
  style.textContent = spinKeyframes;
  document.head.appendChild(style);
}

/**
 * 工具函數
 */
export const utils = {
  // 防抖函數
  debounce: (func, wait, immediate = false) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        timeout = null;
        if (!immediate) func(...args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func(...args);
    };
  },
  
  // 節流函數
  throttle: (func, limit) => {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },
  
  // 檢測設備類型
  isMobile: () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  },
  
  // 檢測觸控設備
  isTouchDevice: () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  },
  
  // 等待元素出現
  waitForElement: (selector, timeout = 5000) => {
    return new Promise((resolve, reject) => {
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
        return;
      }
      
      const observer = new MutationObserver(() => {
        const element = document.querySelector(selector);
        if (element) {
          observer.disconnect();
          resolve(element);
        }
      });
      
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      
      setTimeout(() => {
        observer.disconnect();
        reject(new Error(`Element ${selector} not found within ${timeout}ms`));
      }, timeout);
    });
  }
};