// ======================================
// 主要 JavaScript 檔案
// ======================================

// 導入工具函數和組件
import { 
  ScrollAnimationObserver, 
  ParallaxEffect, 
  addPageLoadAnimation,
  animateCounter,
  ScrollProgress
} from './utils/animations.js';

import { 
  NotificationSystem, 
  MobileMenu, 
  FormValidator,
  utils 
} from './utils/dom.js';

import { 
  Navigation, 
  Breadcrumb, 
  TableOfContents, 
  BackToTop 
} from './components/navigation.js';

/**
 * 主要應用程式類別
 */
class App {
  constructor() {
    this.components = {};
    this.isInitialized = false;
    
    // 創建全域實例
    this.notification = new NotificationSystem();
    
    this.init();
  }
  
  init() {
    if (this.isInitialized) return;
    
    // 等待 DOM 載入完成
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initializeApp());
    } else {
      this.initializeApp();
    }
  }
  
  initializeApp() {
    try {
      // 基礎初始化
      this.initializeNavigation();
      this.initializeAnimations();
      this.initializePageSpecific();
      this.initializeCommonFeatures();
      
      this.isInitialized = true;
      console.log('App initialized successfully');
      
    } catch (error) {
      console.error('App initialization failed:', error);
    }
  }
  
  /**
   * 初始化導航系統
   */
  initializeNavigation() {
    // 主導航
    this.components.navigation = new Navigation();
    
    // 麵包屑
    if (document.querySelector('.breadcrumb')) {
      this.components.breadcrumb = new Breadcrumb();
    }
    
    // 返回頂部按鈕
    this.components.backToTop = new BackToTop();
  }
  
  /**
   * 初始化動畫系統
   */
  initializeAnimations() {
    // 滾動動畫觀察器
    this.components.scrollAnimator = new ScrollAnimationObserver();
    this.components.scrollAnimator.observe([
      '.card',
      '.whyMe-card',
      '.timeline-item',
      '.experience-card',
      '.expertise-card',
      '.award-item',
      '.article-card',
      '.featured-card',
      '.category-card'
    ].join(', '));
    
    // 頁面載入動畫
    addPageLoadAnimation();
    
    // 視差效果（首頁）
    if (document.querySelector('.hero')) {
      this.components.parallax = new ParallaxEffect('.hero', -0.3);
    }
  }
  
  /**
   * 初始化頁面特定功能
   */
  initializePageSpecific() {
    const bodyClass = document.body.className;
    const currentPath = window.location.pathname;
    
    // 首頁
    if (bodyClass.includes('home') || currentPath === '/' || currentPath === '/index.html') {
      this.initializeHomePage();
    }
    
    // 關於頁面
    if (bodyClass.includes('about') || currentPath.includes('/about/')) {
      this.initializeAboutPage();
    }
    
    // 文章頁面
    if (bodyClass.includes('articles') || currentPath.includes('/articles/')) {
      this.initializeArticlesPage();
    }
    
    // 文章詳情頁面
    if (document.getElementById('articleBody')) {
      this.initializeArticleDetailPage();
    }
  }
  
  /**
   * 初始化首頁功能
   */
  initializeHomePage() {
    // 統計數字動畫
    const stats = document.querySelectorAll('.highlight-item span');
    if (stats.length > 0) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const text = entry.target.textContent;
            const match = text.match(/(\d+)/);
            if (match) {
              const finalNumber = parseInt(match[1]);
              const prefix = text.split(match[1])[0];
              const suffix = text.split(match[1])[1];
              
              animateCounter(entry.target, 0, finalNumber, 2000, prefix, suffix);
            }
            observer.unobserve(entry.target);
          }
        });
      });
      
      stats.forEach(stat => observer.observe(stat));
    }
    
    // 聯絡表單驗證
    this.initializeContactForm();
  }
  
  /**
   * 初始化關於頁面功能
   */
  initializeAboutPage() {
    // 個人頭像動畫
    const avatar = document.querySelector('.lawyer-avatar');
    if (avatar) {
      avatar.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1) rotate(5deg)';
      });
      
      avatar.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1) rotate(0deg)';
      });
    }
    
    // 統計數字動畫
    const counters = document.querySelectorAll('.highlight-item span');
    if (counters.length > 0) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const text = entry.target.textContent;
            const match = text.match(/(\d+)/);
            if (match) {
              const finalNumber = parseInt(match[1]);
              const prefix = text.split(match[1])[0];
              const suffix = text.split(match[1])[1];
              
              animateCounter(entry.target, 0, finalNumber, 2000, prefix, suffix);
            }
            observer.unobserve(entry.target);
          }
        });
      });
      
      counters.forEach(counter => observer.observe(counter));
    }
    
    // 獎項浮動動畫
    const awards = document.querySelectorAll('.award-item');
    if (awards.length > 0) {
      awards.forEach((award, index) => {
        const delay = index * 0.2;
        award.style.animationDelay = `${delay}s`;
        award.style.animation = 'float 3s ease-in-out infinite';
      });
    }
  }
  
  /**
   * 初始化文章頁面功能
   */
  initializeArticlesPage() {
    // 文章搜尋和篩選功能在 articles.js 中處理
    // 這裡可以添加額外的功能
    
    // 電子報訂閱表單
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleNewsletterSubmit(e);
      });
    }
  }
  
  /**
   * 初始化文章詳情頁面功能
   */
  initializeArticleDetailPage() {
    // 目錄生成
    this.components.toc = new TableOfContents();
    
    // 閱讀進度
    this.components.readingProgress = new ScrollProgress('.progress-fill', '#articleBody');
    
    // 計算閱讀時間
    this.calculateReadingTime();
    
    // 文章操作功能
    this.initializeArticleActions();
    
    // 初始化瀏覽計數器
    this.initializeViewCounter();
  }
  
  /**
   * 初始化通用功能
   */
  initializeCommonFeatures() {
    // 平滑滾動到錨點
    this.initializeSmoothScrolling();
    
    // 表單增強
    this.enhanceForms();
    
    // 外部連結處理
    this.handleExternalLinks();
    
    // 圖片懶載入
    this.initializeLazyLoading();
    
    // 鍵盤導航支援
    this.initializeKeyboardNavigation();
    
    // 觸控手勢支援
    if (utils.isTouchDevice()) {
      this.initializeTouchGestures();
    }
  }
  
  /**
   * 初始化聯絡表單
   */
  initializeContactForm() {
    const form = document.querySelector('#contact form, .contact-form form');
    if (!form) return;
    
    const validator = new FormValidator(form);
    
    // 添加驗證規則
    validator.addRule('name', FormValidator.rules.required, '請輸入姓名');
    validator.addRule('phone', FormValidator.rules.required, '請輸入電話號碼');
    validator.addRule('phone', FormValidator.rules.phone, '請輸入有效的電話號碼');
    validator.addRule('email', FormValidator.rules.email, '請輸入有效的電子郵件');
    validator.addRule('message', FormValidator.rules.required, '請輸入諮詢內容');
    validator.addRule('message', FormValidator.rules.minLength(10), '諮詢內容至少需要10個字');
    
    // 表單提交處理
    form.addEventListener('submit', (e) => {
      if (validator.validate()) {
        e.preventDefault();
        this.handleContactFormSubmit(form);
      }
    });
  }
  
  /**
   * 處理聯絡表單提交
   */
  handleContactFormSubmit(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // 顯示載入狀態
    submitBtn.textContent = '發送中...';
    submitBtn.disabled = true;
    
    // 模擬提交過程
    setTimeout(() => {
      this.notification.success('感謝您的諮詢！我們會盡快與您聯繫。');
      form.reset();
      
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }, 2000);
  }
  
  /**
   * 處理電子報訂閱
   */
  handleNewsletterSubmit(e) {
    const form = e.target;
    const email = form.querySelector('input[type="email"]').value;
    const button = form.querySelector('button');
    const originalText = button.innerHTML;
    
    // 基本驗證
    if (!FormValidator.rules.email(email)) {
      this.notification.error('請輸入有效的電子郵件地址');
      return;
    }
    
    // 顯示載入狀態
    button.innerHTML = '<i class="ph ph-spinner"></i> 訂閱中...';
    button.disabled = true;
    
    // 模擬訂閱過程
    setTimeout(() => {
      button.innerHTML = '<i class="ph ph-check"></i> 訂閱成功！';
      this.notification.success('電子報訂閱成功！');
      
      setTimeout(() => {
        button.innerHTML = originalText;
        button.disabled = false;
        form.reset();
      }, 2000);
    }, 1500);
  }
  
  /**
   * 計算閱讀時間
   */
  calculateReadingTime() {
    const readingTimeElement = document.getElementById('readingTime');
    const articleBody = document.getElementById('articleBody');
    
    if (!readingTimeElement || !articleBody) return;
    
    const text = articleBody.textContent || articleBody.innerText || '';
    const wordsPerMinute = 200; // 中文平均閱讀速度
    const wordCount = text.length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    
    readingTimeElement.textContent = readingTime;
  }
  
  /**
   * 初始化文章操作功能
   */
  initializeArticleActions() {
    // 分享功能
    window.shareArticle = () => {
      if (navigator.share) {
        navigator.share({
          title: document.title,
          text: document.querySelector('meta[name="description"]')?.content || '',
          url: window.location.href
        }).catch(console.error);
      } else {
        // 備用方案：複製到剪貼簿
        navigator.clipboard.writeText(window.location.href).then(() => {
          this.notification.success('文章連結已複製到剪貼簿');
        }).catch(() => {
          this.notification.error('無法複製連結');
        });
      }
    };
    
    // 書籤功能
    window.bookmarkArticle = () => {
      const bookmarkBtn = document.querySelector('.bookmark-btn');
      const icon = bookmarkBtn?.querySelector('i');
      
      if (icon) {
        if (icon.classList.contains('ph-bookmark')) {
          icon.classList.remove('ph-bookmark');
          icon.classList.add('ph-bookmark-simple');
          this.notification.success('文章已加入收藏');
        } else {
          icon.classList.remove('ph-bookmark-simple');
          icon.classList.add('ph-bookmark');
          this.notification.info('已移除收藏');
        }
      }
    };
    
    // 列印功能
    window.printArticle = () => {
      window.print();
    };
  }
  
  /**
   * 初始化瀏覽計數器
   */
  initializeViewCounter() {
    const viewCountElement = document.getElementById('viewCount');
    if (!viewCountElement) return;
    
    // 模擬瀏覽數據
    const views = Math.floor(Math.random() * 1000) + 100;
    viewCountElement.textContent = views.toLocaleString();
    
    // 模擬計數增加
    setTimeout(() => {
      viewCountElement.textContent = (views + 1).toLocaleString();
    }, 2000);
  }
  
  /**
   * 平滑滾動處理
   */
  initializeSmoothScrolling() {
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
  }
  
  /**
   * 表單增強
   */
  enhanceForms() {
    // 為所有表單添加基本增強
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      // 添加載入狀態
      form.addEventListener('submit', function() {
        const submitBtn = this.querySelector('button[type="submit"]');
        if (submitBtn && !submitBtn.disabled) {
          submitBtn.style.opacity = '0.7';
          submitBtn.style.pointerEvents = 'none';
        }
      });
    });
  }
  
  /**
   * 外部連結處理
   */
  handleExternalLinks() {
    const externalLinks = document.querySelectorAll('a[href^="http"]');
    externalLinks.forEach(link => {
      if (!link.href.includes(window.location.hostname)) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      }
    });
  }
  
  /**
   * 圖片懶載入
   */
  initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    if (images.length === 0) return;
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
  }
  
  /**
   * 鍵盤導航支援
   */
  initializeKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      // ESC 鍵關閉模態框和選單
      if (e.key === 'Escape') {
        // 關閉移動選單
        const mobileMenu = document.querySelector('.mobile-menu-overlay.active');
        if (mobileMenu) {
          mobileMenu.classList.remove('active');
          document.body.style.overflow = '';
        }
      }
    });
  }
  
  /**
   * 觸控手勢支援
   */
  initializeTouchGestures() {
    let touchStartY = 0;
    let touchEndY = 0;
    
    document.addEventListener('touchstart', (e) => {
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });
    
    document.addEventListener('touchend', (e) => {
      touchEndY = e.changedTouches[0].screenY;
      this.handleSwipe();
    }, { passive: true });
  }
  
  handleSwipe() {
    const swipeThreshold = 50;
    const swipeDistance = touchStartY - touchEndY;
    
    if (Math.abs(swipeDistance) > swipeThreshold) {
      if (swipeDistance > 0) {
        // 向上滑動
        this.scrollToNextSection();
      } else {
        // 向下滑動
        this.scrollToPreviousSection();
      }
    }
  }
  
  scrollToNextSection() {
    const sections = document.querySelectorAll('section');
    const currentScroll = window.scrollY;
    
    for (let i = 0; i < sections.length; i++) {
      if (sections[i].offsetTop > currentScroll + 100) {
        sections[i].scrollIntoView({ behavior: 'smooth' });
        break;
      }
    }
  }
  
  scrollToPreviousSection() {
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

// 初始化應用程式
const app = new App();

// 將 app 實例和通知系統暴露到全域
window.app = app;
window.notification = app.notification;

// 處理瀏覽器前進後退
window.addEventListener('popstate', () => {
  if (app.components.breadcrumb) {
    app.components.breadcrumb.generate();
  }
});

// 處理視窗大小變化
window.addEventListener('resize', utils.debounce(() => {
  // 重新計算布局相關功能
  if (app.components.readingProgress) {
    app.components.readingProgress.handleScroll();
  }
}, 250));

// 導出主要類別供其他模組使用
export { App };