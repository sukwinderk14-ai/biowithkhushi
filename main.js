/* ============================================
   BIOWITHKHUSHI - MAIN JAVASCRIPT
   ============================================ */

// Configuration
const API_BASE_URL = 'http://localhost:8000/api';
const IMAGE_PLACEHOLDER = 'https://via.placeholder.com/400x250?text=Article';

// State Management
const appState = {
    articles: [],
    categories: [],
    research: [],
    currentFilter: 'all',
    searchQuery: '',
    loading: false
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Fetch data from API
 */
async function fetchAPI(endpoint) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        return null;
    }
}

/**
 * Post data to API
 */
async function postAPI(endpoint, data) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Post error:', error);
        return null;
    }
}

/**
 * Format date to readable string
 */
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

/**
 * Truncate text
 */
function truncateText(text, length) {
    if (text.length > length) {
        return text.substring(0, length) + '...';
    }
    return text;
}

/**
 * Show loading spinner
 */
function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        `;
    }
}

/**
 * Show error message
 */
function showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `
            <div class="col-12">
                <div class="alert alert-warning alert-dismissible fade show" role="alert">
                    <i class="fas fa-exclamation-triangle"></i> ${message}
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            </div>
        `;
    }
}

/**
 * Show empty state
 */
function showEmpty(elementId, message = 'No items found') {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `
            <div class="col-12">
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <p>${message}</p>
                </div>
            </div>
        `;
    }
}

/**
 * Toast notification
 */
function showToast(message, type = 'success') {
    const toastHTML = `
        <div class="toast align-items-center text-white bg-${type} border-0" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    `;
    
    const toastContainer = document.createElement('div');
    toastContainer.classList.add('position-fixed', 'bottom-0', 'end-0', 'p-3');
    toastContainer.style.zIndex = '11';
    toastContainer.innerHTML = toastHTML;
    document.body.appendChild(toastContainer);
    
    const toastElement = toastContainer.querySelector('.toast');
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
    
    setTimeout(() => {
        toastContainer.remove();
    }, 5000);
}

// ============================================
// ARTICLES FUNCTIONS
// ============================================

/**
 * Load articles from API or mock data
 */
async function loadArticles() {
    showLoading('articlesContainer');
    appState.loading = true;
    
    let endpoint = '/articles';
    const params = [];
    
    if (appState.currentFilter !== 'all') {
        params.push(`category=${appState.currentFilter}`);
    }
    
    if (appState.searchQuery) {
        params.push(`search=${appState.searchQuery}`);
    }
    
    if (params.length > 0) {
        endpoint += '?' + params.join('&');
    }
    
    let articles = await fetchAPI(endpoint);
    
    // If API fails, use mock data
    if (!articles || articles.length === 0) {
        articles = mockArticles;
    }
    
    appState.loading = false;
    
    if (articles && articles.length > 0) {
        appState.articles = articles;
        renderArticles(articles);
    } else {
        showEmpty('articlesContainer', 'No articles found. Try different search or filter.');
    }
}

/**
 * Render articles to DOM
 */
function renderArticles(articles) {
    const container = document.getElementById('articlesContainer');
    
    if (articles.length === 0) {
        showEmpty('articlesContainer');
        return;
    }
    
    container.innerHTML = articles.map(article => `
        <div class="col-lg-4 col-md-6 col-sm-12">
            <div class="article-card fade-in-up">
                <div class="article-card-image">
                    <img src="${article.imageUrl || IMAGE_PLACEHOLDER}" alt="${article.title}" onerror="this.src='${IMAGE_PLACEHOLDER}'">
                </div>
                <div class="article-card-body">
                    <span class="article-category">${article.category}</span>
                    <h3>${article.title}</h3>
                    <p>${truncateText(article.excerpt, 120)}</p>
                    
                    <div class="article-tags">
                        ${(article.tags || []).slice(0, 3).map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    
                    <div class="article-meta">
                        <span>
                            <i class="fas fa-eye"></i>
                            ${article.views || 0} views
                        </span>
                        <span>
                            <i class="fas fa-heart"></i>
                            ${article.likes || 0} likes
                        </span>
                    </div>
                    
                    <button class="btn btn-primary mt-3 w-100" onclick="viewArticle('${article.slug}')">
                        <i class="fas fa-arrow-right"></i> Read More
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

/**
 * View single article
 */
async function viewArticle(slug) {
    const article = appState.articles.find(a => a.slug === slug);
    if (article) {
        // Increment view count
        await postAPI(`/articles/${article.id}/view`, {});
        
        // Store article in session storage
        sessionStorage.setItem('currentArticle', JSON.stringify(article));
        
        // Show notification
        showToast('Article view count updated!', 'info');
    }
}

/**
 * Like article
 */
async function likeArticle(articleId) {
    const result = await postAPI(`/articles/${articleId}/like`, {});
    if (result) {
        showToast('Article liked! 💕', 'success');
        loadArticles();
    }
}

// ============================================
// CATEGORIES FUNCTIONS
// ============================================

/**
 * Load categories from API or mock data
 */
async function loadCategories() {
    let categories = await fetchAPI('/categories');
    
    // If API fails, use mock categories
    if (!categories || categories.length === 0) {
        categories = mockCategories;
    }
    
    if (categories && categories.length > 0) {
        appState.categories = categories;
        renderCategories(categories);
    } else {
        showError('categoriesContainer', 'Failed to load categories');
    }
}

/**
 * Render categories to DOM
 */
function renderCategories(categories) {
    const container = document.getElementById('categoriesContainer');
    
    container.innerHTML = categories.map(category => `
        <div class="col-lg-3 col-md-4 col-sm-6">
            <div class="category-card fade-in-up" onclick="filterByCategory('${category.slug}')">
                <span class="category-icon">${category.icon}</span>
                <h3>${category.name}</h3>
                <p>${category.description}</p>
                <span class="category-count">${category.articleCount || 0} Articles</span>
            </div>
        </div>
    `).join('');
}

/**
 * Filter articles by category
 */
function filterByCategory(categorySlug) {
    if (categorySlug === 'all') {
        appState.currentFilter = 'all';
    } else {
        const category = appState.categories.find(c => c.slug === categorySlug);
        if (category) {
            appState.currentFilter = category.name;
        }
    }
    
    loadArticles();
    
    // Scroll to articles
    document.getElementById('articles').scrollIntoView({ behavior: 'smooth' });
}

// ============================================
// RESEARCH FUNCTIONS
// ============================================

/**
 * Load research notes from API or mock data
 */
async function loadResearch() {
    let research = await fetchAPI('/research');
    
    // If API fails, use mock research
    if (!research || research.length === 0) {
        research = mockResearch;
    }
    
    if (research && research.length > 0) {
        appState.research = research;
        renderResearch(research);
    } else {
        showError('researchContainer', 'Failed to load research notes');
    }
}

/**
 * Render research notes to DOM
 */
function renderResearch(research) {
    const container = document.getElementById('researchContainer');
    
    if (research.length === 0) {
        showEmpty('researchContainer', 'No research notes available');
        return;
    }
    
    container.innerHTML = research.map(note => `
        <div class="col-lg-4 col-md-6 col-sm-12">
            <div class="research-card fade-in-up">
                <h3>${note.title}</h3>
                <p>${truncateText(note.description, 150)}</p>
                
                <div class="research-date mb-3">
                    <i class="fas fa-calendar"></i>
                    ${formatDate(note.uploadDate)}
                </div>
                
                <div class="mb-3">
                    <span class="badge bg-primary">${note.category}</span>
                </div>
                
                <a href="${note.fileUrl}" target="_blank" class="research-link" download>
                    <i class="fas fa-download"></i> Download PDF
                </a>
            </div>
        </div>
    `).join('');
}

// ============================================
// SEARCH FUNCTIONS
// ============================================

/**
 * Setup search functionality
 */
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            appState.searchQuery = e.target.value;
            
            searchTimeout = setTimeout(() => {
                appState.currentFilter = 'all';
                loadArticles();
            }, 300);
        });
    }
}

// ============================================
// CONTACT FORM FUNCTIONS
// ============================================

/**
 * Setup contact form submission
 */
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (!contactForm.checkValidity()) {
                e.stopPropagation();
                contactForm.classList.add('was-validated');
                return;
            }
            
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };
            
            const result = await postAPI('/contact', formData);
            
            if (result) {
                showToast('Message sent successfully! We\'ll get back to you soon.', 'success');
                contactForm.reset();
                contactForm.classList.remove('was-validated');
            } else {
                showToast('Failed to send message. Please try again.', 'danger');
            }
        });
    }
}

// ============================================
// NAVIGATION FUNCTIONS
// ============================================

/**
 * Setup smooth scroll navigation
 */
function setupNavigation() {
    const navLinks = document.querySelectorAll('.navbar-nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const navbar = document.querySelector('.navbar-collapse');
            if (navbar.classList.contains('show')) {
                document.querySelector('.navbar-toggler').click();
            }
        });
    });
}

/**
 * Update active nav link on scroll
 */
function updateActiveNav() {
    const sections = document.querySelectorAll('section, header');
    const navLinks = document.querySelectorAll('.navbar-nav a');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// ============================================
// MOCK DATA FOR OFFLINE MODE
// ============================================

const mockArticles = [
    {
        id: 'article-001',
        title: 'Introduction to CRISPR Gene Editing',
        slug: 'introduction-to-crispr-gene-editing',
        excerpt: 'Discover how CRISPR technology is revolutionizing genetic engineering',
        category: 'Biotechnology',
        tags: ['CRISPR', 'gene-editing'],
        imageUrl: 'https://images.unsplash.com/photo-1576091160568-112d968ce08d?w=800',
        likes: 342,
        views: 5230,
        publishedDate: new Date().toISOString()
    },
    {
        id: 'article-002',
        title: 'Understanding DNA Sequencing Techniques',
        slug: 'understanding-dna-sequencing-techniques',
        excerpt: 'A comprehensive guide to modern DNA sequencing methods',
        category: 'Genetics',
        tags: ['DNA', 'sequencing'],
        imageUrl: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800',
        likes: 287,
        views: 4105,
        publishedDate: new Date().toISOString()
    },
    {
        id: 'article-003',
        title: 'Protein Folding and Its Biological Significance',
        slug: 'protein-folding-and-biological-significance',
        excerpt: 'Explore how proteins fold into complex structures',
        category: 'Molecular Biology',
        tags: ['proteins', 'folding'],
        imageUrl: 'https://images.unsplash.com/photo-1579154204601-01d5af266fbf?w=800',
        likes: 156,
        views: 2847,
        publishedDate: new Date().toISOString()
    },
    {
        id: 'article-004',
        title: 'Career Paths in Bioinformatics',
        slug: 'career-paths-in-bioinformatics',
        excerpt: 'Discover exciting career opportunities in bioinformatics',
        category: 'Career',
        tags: ['career', 'bioinformatics'],
        imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
        likes: 234,
        views: 3456,
        publishedDate: new Date().toISOString()
    },
    {
        id: 'article-005',
        title: 'The Human Microbiome: Our Hidden World',
        slug: 'human-microbiome-hidden-world',
        excerpt: 'Learn about the trillions of microorganisms in your body',
        category: 'Molecular Biology',
        tags: ['microbiome', 'health'],
        imageUrl: 'https://images.unsplash.com/photo-1585281033312-61a9f3d1d2ba?w=800',
        likes: 412,
        views: 6234,
        publishedDate: new Date().toISOString()
    }
];

const mockCategories = [
    { name: 'Genetics', slug: 'genetics', description: 'Explore genetics and DNA', icon: '🧬', color: '#FF6B6B', articleCount: 2 },
    { name: 'Molecular Biology', slug: 'molecular-biology', description: 'Dive into molecular mechanisms', icon: '🔬', color: '#4ECDC4', articleCount: 2 },
    { name: 'Biotechnology', slug: 'biotechnology', description: 'Discover biotechnology innovations', icon: '⚗️', color: '#95E1D3', articleCount: 1 },
    { name: 'Research', slug: 'research', description: 'Latest research findings', icon: '📊', color: '#FFD93D', articleCount: 0 },
    { name: 'Career', slug: 'career', description: 'Career opportunities', icon: '💼', color: '#A8E6CF', articleCount: 1 },
    { name: 'Education', slug: 'education', description: 'Educational resources', icon: '📚', color: '#C7CEEA', articleCount: 0 }
];

const mockResearch = [
    {
        id: 'research-001',
        title: 'CRISPR Applications in Cancer Treatment',
        description: 'Comprehensive review of CRISPR in cancer immunotherapy',
        fileUrl: 'https://example.com/research/crispr-cancer-2024.pdf',
        uploadDate: new Date().toISOString(),
        category: 'Biotechnology',
        tags: ['CRISPR', 'cancer']
    },
    {
        id: 'research-002',
        title: 'Single-Cell RNA Sequencing Advances',
        description: 'Latest developments in single-cell RNA-seq technology',
        fileUrl: 'https://example.com/research/scrna-seq-2024.pdf',
        uploadDate: new Date().toISOString(),
        category: 'Research',
        tags: ['RNA-seq', 'research']
    },
    {
        id: 'research-003',
        title: 'Machine Learning in Drug Discovery',
        description: 'AI approaches accelerating drug discovery',
        fileUrl: 'https://example.com/research/ml-drug-discovery-2024.pdf',
        uploadDate: new Date().toISOString(),
        category: 'Biotechnology',
        tags: ['AI', 'drug-discovery']
    }
];

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize the app
 */
async function initApp() {
    console.log('🧬 Initializing BioWithKhushi...');
    
    try {
        // Load all data
        await Promise.all([
            loadArticles(),
            loadCategories(),
            loadResearch()
        ]);
        
        // Setup event listeners
        setupSearch();
        setupContactForm();
        setupNavigation();
        
        console.log('✅ BioWithKhushi initialized successfully!');
        
    } catch (error) {
        console.error('❌ Initialization error:', error);
        showToast('Using demo data - backend not available', 'warning');
    }
}

// ============================================
// SCROLL EVENTS
// ============================================

window.addEventListener('scroll', updateActiveNav);

// ============================================
// DOM READY
// ============================================

document.addEventListener('DOMContentLoaded', initApp);

// ============================================
// EXPORT FUNCTIONS
// ============================================

window.appState = appState;
window.loadArticles = loadArticles;
window.filterByCategory = filterByCategory;
window.viewArticle = viewArticle;
window.likeArticle = likeArticle;
