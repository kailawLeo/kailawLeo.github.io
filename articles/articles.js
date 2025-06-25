// Articles page JavaScript functionality

// Global variables
let allArticles = [];
let filteredArticles = [];
let currentFilters = {
    search: '',
    category: 'all',
    tags: []
};
let articlesPerPage = 6;
let currentPage = 1;

// DOM elements
const searchInput = document.getElementById('searchInput');
const searchClear = document.getElementById('searchClear');
const sortSelect = document.getElementById('sortSelect');
const filterButtons = document.querySelectorAll('.filter-btn');
const articlesGrid = document.getElementById('articlesGrid');
const noResults = document.getElementById('noResults');
const loadingAnimation = document.getElementById('loadingAnimation');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const loadMoreContainer = document.getElementById('loadMoreContainer');
const resultsCount = document.getElementById('resultsCount');
const activeFilters = document.getElementById('activeFilters');
const filtersList = document.getElementById('filtersList');
const clearAllFiltersBtn = document.getElementById('clearAllFilters');

// Initialize functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeArticles();
    setupEventListeners();
    setupMobileMenu();
    
    // Check if this is an article detail page
    if (document.getElementById('articleBody')) {
        initializeArticleDetailPage();
    }
    
    // Check for URL parameters
    checkUrlParameters();
});

// Initialize articles data
function initializeArticles() {
    if (!articlesGrid) return;
    
    const articleCards = articlesGrid.querySelectorAll('.article-card');
    allArticles = Array.from(articleCards).map(card => {
        return {
            element: card,
            title: card.querySelector('.card-title a').textContent.toLowerCase(),
            category: card.dataset.category || '',
            date: new Date(card.dataset.date || '1970-01-01'),
            tags: Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase()),
            excerpt: card.querySelector('.card-excerpt')?.textContent.toLowerCase() || ''
        };
    });
    
    filteredArticles = [...allArticles];
    updateResultsDisplay();
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch();
            }
        });
    }
    
    if (searchClear) {
        searchClear.addEventListener('click', clearSearch);
    }
    
    // Sort functionality
    if (sortSelect) {
        sortSelect.addEventListener('change', handleSort);
    }
    
    // Category filter buttons
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            handleCategoryFilter(this.dataset.category);
        });
    });
    
    // Load more functionality
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreArticles);
    }
    
    // Clear all filters
    if (clearAllFiltersBtn) {
        clearAllFiltersBtn.addEventListener('click', clearAllFilters);
    }
    
    // Newsletter form
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }
    
    // Category cards click
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            filterByCategory(this.dataset.category);
        });
    });
}

// Setup mobile menu
function setupMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    
    if (mobileMenuToggle && mobileMenuOverlay) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenuOverlay.classList.toggle('active');
            document.body.style.overflow = mobileMenuOverlay.classList.contains('active') ? 'hidden' : '';
        });
        
        // Close menu when clicking overlay
        mobileMenuOverlay.addEventListener('click', function(e) {
            if (e.target === mobileMenuOverlay) {
                mobileMenuOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Close menu when clicking links
        const mobileLinks = mobileMenuOverlay.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuOverlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
}

// Handle search input
function handleSearch() {
    const searchValue = searchInput.value.trim();
    currentFilters.search = searchValue;
    
    // Show/hide clear button
    if (searchClear) {
        if (searchValue) {
            searchClear.classList.add('visible');
        } else {
            searchClear.classList.remove('visible');
        }
    }
    
    // Debounce search
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(performSearch, 300);
}

// Perform search
function performSearch() {
    showLoading();
    
    setTimeout(() => {
        filterArticles();
        updateResultsDisplay();
        updateActiveFilters();
        hideLoading();
    }, 200);
}

// Clear search
function clearSearch() {
    if (searchInput) {
        searchInput.value = '';
        currentFilters.search = '';
        searchClear.classList.remove('visible');
        performSearch();
    }
}

// Handle category filter
function handleCategoryFilter(category) {
    currentFilters.category = category;
    
    // Update active button
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        }
    });
    
    performSearch();
}

// Filter by category (from category cards)
function filterByCategory(category) {
    window.location.href = `/articles/?category=${category}`;
}

// Handle sort
function handleSort() {
    if (!sortSelect) return;
    
    const sortValue = sortSelect.value;
    showLoading();
    
    setTimeout(() => {
        sortArticles(sortValue);
        updateResultsDisplay();
        hideLoading();
    }, 200);
}

// Filter articles based on current filters
function filterArticles() {
    filteredArticles = allArticles.filter(article => {
        // Search filter
        if (currentFilters.search) {
            const searchTerm = currentFilters.search.toLowerCase();
            const matchesSearch = 
                article.title.includes(searchTerm) ||
                article.excerpt.includes(searchTerm) ||
                article.tags.some(tag => tag.includes(searchTerm));
            
            if (!matchesSearch) return false;
        }
        
        // Category filter
        if (currentFilters.category !== 'all') {
            if (article.category !== currentFilters.category) return false;
        }
        
        // Tags filter
        if (currentFilters.tags.length > 0) {
            const hasMatchingTag = currentFilters.tags.some(filterTag => 
                article.tags.some(articleTag => articleTag.includes(filterTag))
            );
            if (!hasMatchingTag) return false;
        }
        
        return true;
    });
    
    // Reset pagination
    currentPage = 1;
}

// Sort articles
function sortArticles(sortType) {
    filteredArticles.sort((a, b) => {
        switch (sortType) {
            case 'date-desc':
                return b.date - a.date;
            case 'date-asc':
                return a.date - b.date;
            case 'title-asc':
                return a.title.localeCompare(b.title);
            case 'title-desc':
                return b.title.localeCompare(a.title);
            default:
                return b.date - a.date;
        }
    });
}

// Update results display
function updateResultsDisplay() {
    if (!articlesGrid) return;
    
    // Hide all articles first
    allArticles.forEach(article => {
        article.element.style.display = 'none';
    });
    
    // Show filtered articles with pagination
    const startIndex = 0;
    const endIndex = currentPage * articlesPerPage;
    const visibleArticles = filteredArticles.slice(startIndex, endIndex);
    
    visibleArticles.forEach(article => {
        article.element.style.display = 'block';
    });
    
    // Update results count
    if (resultsCount) {
        resultsCount.textContent = filteredArticles.length;
    }
    
    // Show/hide no results message
    if (noResults) {
        if (filteredArticles.length === 0) {
            noResults.style.display = 'block';
            articlesGrid.style.display = 'none';
        } else {
            noResults.style.display = 'none';
            articlesGrid.style.display = 'grid';
        }
    }
    
    // Show/hide load more button
    if (loadMoreContainer) {
        if (endIndex >= filteredArticles.length) {
            loadMoreContainer.style.display = 'none';
        } else {
            loadMoreContainer.style.display = 'block';
        }
    }
}

// Load more articles
function loadMoreArticles() {
    currentPage++;
    showLoading();
    
    setTimeout(() => {
        updateResultsDisplay();
        hideLoading();
        
        // Smooth scroll to new articles
        const newArticles = document.querySelectorAll('.article-card:nth-child(n+' + ((currentPage - 1) * articlesPerPage + 1) + ')');
        if (newArticles.length > 0) {
            newArticles[0].scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, 300);
}

// Update active filters display
function updateActiveFilters() {
    if (!activeFilters || !filtersList) return;
    
    const hasActiveFilters = currentFilters.search || currentFilters.category !== 'all' || currentFilters.tags.length > 0;
    
    if (hasActiveFilters) {
        activeFilters.style.display = 'block';
        filtersList.innerHTML = '';
        
        // Add search filter
        if (currentFilters.search) {
            addFilterTag('搜尋: ' + currentFilters.search, 'search');
        }
        
        // Add category filter
        if (currentFilters.category !== 'all') {
            const categoryName = document.querySelector(`[data-category="${currentFilters.category}"]`)?.textContent.trim() || currentFilters.category;
            addFilterTag('分類: ' + categoryName, 'category');
        }
        
        // Add tag filters
        currentFilters.tags.forEach(tag => {
            addFilterTag('標籤: ' + tag, 'tag', tag);
        });
    } else {
        activeFilters.style.display = 'none';
    }
}

// Add filter tag to active filters
function addFilterTag(text, type, value = null) {
    const tag = document.createElement('span');
    tag.className = 'filter-tag';
    tag.innerHTML = `
        ${text}
        <span class="remove" onclick="removeFilter('${type}', '${value || ''}')">&times;</span>
    `;
    filtersList.appendChild(tag);
}

// Remove filter
function removeFilter(type, value) {
    switch (type) {
        case 'search':
            clearSearch();
            break;
        case 'category':
            handleCategoryFilter('all');
            break;
        case 'tag':
            currentFilters.tags = currentFilters.tags.filter(tag => tag !== value);
            performSearch();
            break;
    }
}

// Clear all filters
function clearAllFilters() {
    // Clear search
    if (searchInput) {
        searchInput.value = '';
        searchClear.classList.remove('visible');
    }
    
    // Reset category filter
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === 'all') {
            btn.classList.add('active');
        }
    });
    
    // Reset sort
    if (sortSelect) {
        sortSelect.value = 'date-desc';
    }
    
    // Reset filters
    currentFilters = {
        search: '',
        category: 'all',
        tags: []
    };
    
    performSearch();
}

// Show loading animation
function showLoading() {
    if (loadingAnimation) {
        loadingAnimation.style.display = 'block';
    }
    if (articlesGrid) {
        articlesGrid.style.opacity = '0.5';
    }
}

// Hide loading animation
function hideLoading() {
    if (loadingAnimation) {
        loadingAnimation.style.display = 'none';
    }
    if (articlesGrid) {
        articlesGrid.style.opacity = '1';
    }
}

// Handle newsletter subscription
function handleNewsletterSubmit(e) {
    e.preventDefault();
    
    const email = e.target.querySelector('input[type="email"]').value;
    const button = e.target.querySelector('button');
    const originalText = button.innerHTML;
    
    // Simulate submission
    button.innerHTML = '<i class="ph ph-spinner"></i> 訂閱中...';
    button.disabled = true;
    
    setTimeout(() => {
        button.innerHTML = '<i class="ph ph-check"></i> 訂閱成功！';
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
            e.target.reset();
        }, 2000);
    }, 1500);
}

// Check URL parameters
function checkUrlParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Category filter from URL
    const category = urlParams.get('category');
    if (category) {
        handleCategoryFilter(category);
    }
    
    // Search term from URL
    const search = urlParams.get('search');
    if (search && searchInput) {
        searchInput.value = search;
        currentFilters.search = search;
        performSearch();
    }
    
    // Tag filter from URL
    const tag = urlParams.get('tag');
    if (tag) {
        currentFilters.tags = [tag.toLowerCase()];
        performSearch();
    }
}

// Article Detail Page Functions
function initializeArticleDetailPage() {
    generateTableOfContents();
    setupReadingProgress();
    setupScrollSpy();
    calculateReadingTime();
    initializeViewCounter();
    setupArticleActions();
    
    // Add scroll animations
    addScrollAnimations();
}

// Generate table of contents
function generateTableOfContents() {
    const articleBody = document.getElementById('articleBody');
    const tocContainer = document.getElementById('articleToc');
    
    if (!articleBody || !tocContainer) return;
    
    const headings = articleBody.querySelectorAll('h1, h2, h3, h4, h5, h6');
    if (headings.length === 0) {
        document.querySelector('.article-toc').style.display = 'none';
        return;
    }
    
    const tocList = document.createElement('ul');
    tocList.className = 'toc-list';
    
    headings.forEach((heading, index) => {
        // Add ID if not present
        if (!heading.id) {
            heading.id = `heading-${index}`;
        }
        
        const listItem = document.createElement('li');
        listItem.className = `toc-item toc-${heading.tagName.toLowerCase()}`;
        
        const link = document.createElement('a');
        link.href = `#${heading.id}`;
        link.textContent = heading.textContent;
        link.className = 'toc-link';
        
        // Smooth scroll to heading
        link.addEventListener('click', function(e) {
            e.preventDefault();
            heading.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Update URL
            history.pushState(null, null, `#${heading.id}`);
        });
        
        listItem.appendChild(link);
        tocList.appendChild(listItem);
    });
    
    tocContainer.appendChild(tocList);
}

// Setup reading progress
function setupReadingProgress() {
    const progressFill = document.getElementById('progressFill');
    if (!progressFill) return;
    
    function updateProgress() {
        const articleBody = document.getElementById('articleBody');
        if (!articleBody) return;
        
        const rect = articleBody.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const documentHeight = articleBody.scrollHeight;
        
        // Calculate progress
        const scrollTop = window.scrollY - articleBody.offsetTop + windowHeight;
        const progress = Math.min(Math.max(scrollTop / documentHeight, 0), 1);
        
        progressFill.style.width = `${progress * 100}%`;
    }
    
    window.addEventListener('scroll', updateProgress);
    updateProgress(); // Initial call
}

// Setup scroll spy for TOC
function setupScrollSpy() {
    const tocLinks = document.querySelectorAll('.toc-link');
    if (tocLinks.length === 0) return;
    
    const headings = Array.from(document.querySelectorAll('#articleBody h1, #articleBody h2, #articleBody h3, #articleBody h4, #articleBody h5, #articleBody h6'));
    
    function updateActiveHeading() {
        let activeHeading = null;
        
        // Find the heading that's currently in view
        for (let i = headings.length - 1; i >= 0; i--) {
            const heading = headings[i];
            const rect = heading.getBoundingClientRect();
            
            if (rect.top <= 100) {
                activeHeading = heading;
                break;
            }
        }
        
        // Update TOC active state
        tocLinks.forEach(link => {
            link.classList.remove('active');
            if (activeHeading && link.getAttribute('href') === `#${activeHeading.id}`) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveHeading);
    updateActiveHeading(); // Initial call
}

// Calculate reading time
function calculateReadingTime() {
    const readingTimeElement = document.getElementById('readingTime');
    const articleBody = document.getElementById('articleBody');
    
    if (!readingTimeElement || !articleBody) return;
    
    const text = articleBody.textContent || articleBody.innerText || '';
    const wordsPerMinute = 200; // Average reading speed for Chinese
    const wordCount = text.length; // For Chinese, count characters
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    
    readingTimeElement.textContent = readingTime;
}

// Initialize view counter (placeholder - would connect to analytics)
function initializeViewCounter() {
    const viewCountElement = document.getElementById('viewCount');
    if (!viewCountElement) return;
    
    // Simulate view count (in real implementation, this would come from analytics)
    const views = Math.floor(Math.random() * 1000) + 100;
    viewCountElement.textContent = views.toLocaleString();
    
    // Increment view count (placeholder)
    setTimeout(() => {
        viewCountElement.textContent = (views + 1).toLocaleString();
    }, 2000);
}

// Setup article actions
function setupArticleActions() {
    // Share article function (global scope for onclick)
    window.shareArticle = function() {
        if (navigator.share) {
            navigator.share({
                title: document.title,
                text: document.querySelector('meta[name="description"]')?.content || '',
                url: window.location.href
            });
        } else {
            // Fallback - copy to clipboard
            navigator.clipboard.writeText(window.location.href).then(() => {
                showNotification('文章連結已複製到剪貼簿');
            });
        }
    };
    
    // Bookmark article function
    window.bookmarkArticle = function() {
        const bookmarkBtn = document.querySelector('.bookmark-btn');
        const icon = bookmarkBtn.querySelector('i');
        
        if (icon.classList.contains('ph-bookmark')) {
            icon.classList.remove('ph-bookmark');
            icon.classList.add('ph-bookmark-simple');
            bookmarkBtn.querySelector('span') ? bookmarkBtn.querySelector('span').textContent = '已收藏' : null;
            showNotification('文章已加入收藏');
        } else {
            icon.classList.remove('ph-bookmark-simple');
            icon.classList.add('ph-bookmark');
            bookmarkBtn.querySelector('span') ? bookmarkBtn.querySelector('span').textContent = '收藏文章' : null;
            showNotification('已移除收藏');
        }
    };
    
    // Print article function
    window.printArticle = function() {
        window.print();
    };
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary-color);
        color: var(--bg-dark);
        padding: 1rem 2rem;
        border-radius: 10px;
        font-weight: 600;
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add scroll animations
function addScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.article-card, .featured-card, .category-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Utility function for smooth scrolling
function smoothScrollTo(element, duration = 800) {
    const targetPosition = element.offsetTop - 100; // Account for fixed header
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

// Handle window resize
window.addEventListener('resize', function() {
    // Recalculate layout if needed
    if (document.getElementById('articleBody')) {
        setupReadingProgress();
    }
});

// Handle back/forward browser navigation
window.addEventListener('popstate', function() {
    checkUrlParameters();
});