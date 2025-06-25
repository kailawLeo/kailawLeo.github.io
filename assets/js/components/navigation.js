// ======================================
// 導航組件
// ======================================

import { MobileMenu } from '../utils/dom.js';
import { smoothScrollTo } from '../utils/animations.js';

/**
 * 主導航控制器
 */
export class Navigation {
  constructor() {
    this.header = document.querySelector('.site-header');
    this.navLinks = document.querySelectorAll('.main-nav a');
    this.mobileMenu = null;
    
    this.init();
  }
  
  init() {
    this.setupScrollSpy();
    this.setupSmoothScrolling();
    this.setupMobileMenu();
    this.setupScrollEffect();
  }
  
  setupScrollSpy() {
    if (this.navLinks.length === 0) return;
    
    const sections = document.querySelectorAll('section[id]');
    if (sections.length === 0) return;
    
    const updateActiveLink = () => {
      let current = '';
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop - 200) {
          current = section.getAttribute('id');
        }
      });
      
      this.navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        
        if (href && href.startsWith('#') && href.slice(1) === current) {
          link.classList.add('active');
        }
      });
    };
    
    window.addEventListener('scroll', updateActiveLink, { passive: true });
    updateActiveLink(); // 初始調用
  }
  
  setupSmoothScrolling() {
    this.navLinks.forEach(link => {
      const href = link.getAttribute('href');
      
      if (href && href.startsWith('#')) {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            smoothScrollTo(target);
            
            // 更新 URL
            history.pushState(null, null, href);
          }
        });
      }
    });
  }
  
  setupMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const menu = document.querySelector('.mobile-menu-overlay');
    
    if (toggle && menu) {
      this.mobileMenu = new MobileMenu(
        '.mobile-menu-toggle',
        '.mobile-menu-overlay'
      );
    }
  }
  
  setupScrollEffect() {
    if (!this.header) return;
    
    let lastScrollY = window.scrollY;
    let isScrollingDown = false;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // 檢測滾動方向
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // 向下滾動且超過 100px
        if (!isScrollingDown) {
          isScrollingDown = true;
          this.header.style.transform = 'translateY(-100%)';
        }
      } else {
        // 向上滾動或在頂部
        if (isScrollingDown) {
          isScrollingDown = false;
          this.header.style.transform = 'translateY(0)';
        }
      }
      
      // 滾動時的背景透明度變化
      const opacity = Math.min(currentScrollY / 100, 0.95);
      this.header.style.background = `rgba(12, 15, 16, ${opacity})`;
      
      lastScrollY = currentScrollY;
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
  }
}

/**
 * 麵包屑導航
 */
export class Breadcrumb {
  constructor(selector = '.breadcrumb') {
    this.container = document.querySelector(selector);
    this.init();
  }
  
  init() {
    if (!this.container) return;
    
    this.generate();
  }
  
  generate() {
    const path = window.location.pathname;
    const segments = path.split('/').filter(segment => segment);
    
    // 清空容器
    this.container.innerHTML = '';
    
    // 添加首頁
    this.addItem('首頁', '/');
    
    // 添加路徑段
    let currentPath = '';
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === segments.length - 1;
      
      // 路徑名稱映射
      const nameMap = {
        'about': '關於',
        'articles': '文章',
        'team': '團隊',
        'service': '服務',
        'contact': '聯絡'
      };
      
      const name = nameMap[segment] || this.formatName(segment);
      
      if (!isLast) {
        this.addSeparator();
        this.addItem(name, currentPath);
      } else {
        this.addSeparator();
        this.addCurrentItem(name);
      }
    });
  }
  
  addItem(text, href) {
    const item = document.createElement('a');
    item.className = 'breadcrumb__item';
    item.textContent = text;
    item.href = href;
    this.container.appendChild(item);
  }
  
  addCurrentItem(text) {
    const item = document.createElement('span');
    item.className = 'breadcrumb__item breadcrumb__item--current';
    item.textContent = text;
    this.container.appendChild(item);
  }
  
  addSeparator() {
    const separator = document.createElement('span');
    separator.className = 'breadcrumb__separator';
    separator.textContent = '/';
    this.container.appendChild(separator);
  }
  
  formatName(segment) {
    return segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  
  update(items) {
    this.container.innerHTML = '';
    
    items.forEach((item, index) => {
      if (index > 0) this.addSeparator();
      
      if (item.href && index < items.length - 1) {
        this.addItem(item.text, item.href);
      } else {
        this.addCurrentItem(item.text);
      }
    });
  }
}

/**
 * 目錄生成器 (TOC)
 */
export class TableOfContents {
  constructor(options = {}) {
    this.options = {
      contentSelector: '#articleBody',
      tocSelector: '#articleToc',
      headingSelector: 'h1, h2, h3, h4, h5, h6',
      activeClass: 'active',
      offset: 100,
      ...options
    };
    
    this.content = document.querySelector(this.options.contentSelector);
    this.tocContainer = document.querySelector(this.options.tocSelector);
    this.headings = [];
    this.tocLinks = [];
    
    this.init();
  }
  
  init() {
    if (!this.content || !this.tocContainer) return;
    
    this.generateTOC();
    this.setupScrollSpy();
  }
  
  generateTOC() {
    this.headings = this.content.querySelectorAll(this.options.headingSelector);
    
    if (this.headings.length === 0) {
      this.tocContainer.style.display = 'none';
      return;
    }
    
    const tocList = document.createElement('ul');
    tocList.className = 'toc-list';
    
    this.headings.forEach((heading, index) => {
      // 添加 ID
      if (!heading.id) {
        heading.id = `heading-${index}`;
      }
      
      const listItem = document.createElement('li');
      listItem.className = `toc-item toc-${heading.tagName.toLowerCase()}`;
      
      const link = document.createElement('a');
      link.href = `#${heading.id}`;
      link.textContent = heading.textContent;
      link.className = 'toc-link';
      
      // 點擊事件
      link.addEventListener('click', (e) => {
        e.preventDefault();
        smoothScrollTo(heading, 800, this.options.offset);
        history.pushState(null, null, `#${heading.id}`);
      });
      
      listItem.appendChild(link);
      tocList.appendChild(listItem);
      this.tocLinks.push(link);
    });
    
    this.tocContainer.appendChild(tocList);
  }
  
  setupScrollSpy() {
    if (this.tocLinks.length === 0) return;
    
    const updateActiveTOC = () => {
      let activeHeading = null;
      
      // 找到當前視窗中的標題
      for (let i = this.headings.length - 1; i >= 0; i--) {
        const heading = this.headings[i];
        const rect = heading.getBoundingClientRect();
        
        if (rect.top <= this.options.offset) {
          activeHeading = heading;
          break;
        }
      }
      
      // 更新 TOC 激活狀態
      this.tocLinks.forEach(link => {
        link.classList.remove(this.options.activeClass);
        
        if (activeHeading && link.getAttribute('href') === `#${activeHeading.id}`) {
          link.classList.add(this.options.activeClass);
        }
      });
    };
    
    window.addEventListener('scroll', updateActiveTOC, { passive: true });
    updateActiveTOC(); // 初始調用
  }
}

/**
 * 返回頂部按鈕
 */
export class BackToTop {
  constructor(options = {}) {
    this.options = {
      selector: '.back-to-top',
      showOffset: 300,
      scrollDuration: 800,
      ...options
    };
    
    this.button = document.querySelector(this.options.selector);
    this.init();
  }
  
  init() {
    if (!this.button) {
      this.createButton();
    }
    
    this.setupScrollListener();
    this.setupClickListener();
  }
  
  createButton() {
    this.button = document.createElement('button');
    this.button.className = 'back-to-top';
    this.button.innerHTML = '<i class="ph ph-arrow-up"></i>';
    this.button.setAttribute('aria-label', '返回頂部');
    
    this.button.style.cssText = `
      position: fixed;
      bottom: 30px;
      right: 30px;
      width: 50px;
      height: 50px;
      background: var(--primary-color);
      color: var(--bg-dark);
      border: none;
      border-radius: 50%;
      cursor: pointer;
      font-size: 1.2rem;
      z-index: 100;
      opacity: 0;
      visibility: hidden;
      transform: translateY(20px);
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(215, 183, 101, 0.3);
    `;
    
    document.body.appendChild(this.button);
  }
  
  setupScrollListener() {
    const handleScroll = () => {
      const shouldShow = window.scrollY > this.options.showOffset;
      
      if (shouldShow) {
        this.button.style.opacity = '1';
        this.button.style.visibility = 'visible';
        this.button.style.transform = 'translateY(0)';
      } else {
        this.button.style.opacity = '0';
        this.button.style.visibility = 'hidden';
        this.button.style.transform = 'translateY(20px)';
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
  }
  
  setupClickListener() {
    this.button.addEventListener('click', () => {
      smoothScrollTo(document.body, this.options.scrollDuration, 0);
    });
  }
}