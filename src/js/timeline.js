/**
 * Timeline Component
 * Handles the version timeline display and interactions
 */

export class Timeline {
  constructor() {
    this.container = document.getElementById('timeline-container');
    if (!this.container) return;
    
    this.versions = [];
    this.init();
  }
  
  async init() {
    try {
      // Show loading state
      this.showLoading();
      
      // Load version data
      await this.loadVersionData();
      
      // Render timeline
      this.render();
      
      // Initialize interactions
      this.initInteractions();
      
      // Initialize lazy loading
      this.initLazyLoading();
      
      // Remove loading state
      this.hideLoading();
    } catch (error) {
      console.error('Failed to initialize timeline:', error);
      this.showError();
    }
  }
  
  async loadVersionData() {
    try {
      const response = await fetch('/src/data/versions.json');
      const data = await response.json();
      this.versions = data.versions.reverse(); // Show newest first
    } catch (error) {
      console.error('Failed to load version data:', error);
      // Fallback data
      this.versions = this.getFallbackData();
    }
  }
  
  getFallbackData() {
    return [
      {
        id: 'v3',
        number: '3.0',
        date: 'February 2025',
        title: 'Current Live Version',
        isLive: true,
        techStack: ['React 18', 'Next.js 14', 'TypeScript', 'Tailwind CSS'],
        features: [
          'Server-side rendering',
          'Progressive Web App',
          'Advanced animations',
          'API integrations'
        ]
      },
      {
        id: 'v2.9',
        number: '2.9',
        date: 'January 2025',
        title: 'Final Static Version',
        screenshots: {
          desktop: 'https://res.cloudinary.com/depqttzlt/image/upload/v1737668269/VersionTimeTravelv25desktop_wrj8uu.png',
          mobile: 'https://res.cloudinary.com/depqttzlt/image/upload/v1737668270/VersionTimeTravelv25mobile_ua2l41.png'
        },
        features: [
          'Performance optimizations',
          'Enhanced accessibility',
          'Refined UI/UX',
          'Code refactoring'
        ],
        path: 'versions/v2.9/'
      },
      {
        id: 'v2.8',
        number: '2.8',
        date: 'January 2025',
        title: 'Matrix Evolution',
        screenshots: {
          desktop: 'https://res.cloudinary.com/depqttzlt/image/upload/v1737668269/VersionTimeTravelv25desktop_wrj8uu.png',
          mobile: 'https://res.cloudinary.com/depqttzlt/image/upload/v1737668270/VersionTimeTravelv25mobile_ua2l41.png'
        },
        features: [
          'Matrix theme refinement',
          'Improved animations',
          'Better mobile experience',
          'SEO enhancements'
        ],
        path: 'version28.html'
      },
      {
        id: 'landing',
        number: 'Landing Page',
        date: 'November 2024',
        title: 'Experimental Features',
        screenshots: {
          desktop: 'https://res.cloudinary.com/depqttzlt/image/upload/v1737668231/landingpagedesktop_ssozki.png',
          mobile: 'https://res.cloudinary.com/depqttzlt/image/upload/v1737668228/landingpagemobile_exon4w.png'
        },
        features: [
          'Version TimeTravel feature',
          'Interactive CV',
          'Advanced CSS buttons',
          'Navigation experiments'
        ],
        path: 'landingpage.html'
      },
      {
        id: 'v2.5',
        number: '2.5',
        date: 'October 2024',
        title: 'Animation Upgrade',
        screenshots: {
          desktop: 'https://res.cloudinary.com/depqttzlt/image/upload/v1737668269/VersionTimeTravelv25desktop_wrj8uu.png',
          mobile: 'https://res.cloudinary.com/depqttzlt/image/upload/v1737668270/VersionTimeTravelv25mobile_ua2l41.png'
        },
        features: [
          'GSAP animations',
          'ScrollMagic integration',
          'Infinity gallery',
          'Performance improvements'
        ],
        path: 'version25.html'
      },
      {
        id: 'v2',
        number: '2.0',
        date: 'September 2024',
        title: 'Matrix Theme Born',
        screenshots: {
          desktop: 'https://res.cloudinary.com/depqttzlt/image/upload/v1737668253/VersionTimeTravelv2desktop_gg9tpn.png',
          mobile: 'https://res.cloudinary.com/depqttzlt/image/upload/v1737668253/VersionTimeTravelv2mobile_lcyyvb.png'
        },
        features: [
          'Matrix theme introduction',
          'Canvas animations',
          'Responsive grid',
          'Dark mode toggle'
        ],
        path: 'version2.html'
      },
      {
        id: 'v1',
        number: '1.0',
        date: 'August 2024',
        title: 'The Beginning',
        screenshots: {
          desktop: 'https://res.cloudinary.com/depqttzlt/image/upload/v1737668237/VersionTimeTravelv1desktop_fcmf21.png',
          mobile: 'https://res.cloudinary.com/depqttzlt/image/upload/v1737668237/VersionTimeTravelv1mobile_xd9ypl.png'
        },
        features: [
          'Initial portfolio launch',
          'Basic responsive design',
          'Simple navigation',
          'Contact form'
        ],
        path: 'version1.html'
      }
    ];
  }
  
  render() {
    this.container.innerHTML = this.versions.map((version, index) => 
      this.createVersionCard(version, index)
    ).join('');
  }
  
  createVersionCard(version, index) {
    if (version.isLive) {
      // Special rendering for v3.0
      return `
        <div class="version-card version-live" data-version="${version.id}" id="${version.id}">
          <div class="timeline-dot"></div>
          <div class="version-content">
            <div class="version-box live-version">
              <div class="version-header">
                <div class="version-info">
                  <h3>Version ${version.number}</h3>
                  <span class="version-date">${version.date}</span>
                </div>
                <span class="version-tag">Live Now</span>
              </div>
              <div class="version-features">
                <h4>Modern Tech Stack</h4>
                <ul class="features-list">
                  ${version.techStack.map(tech => `<li>${tech}</li>`).join('')}
                </ul>
              </div>
              <div class="version-features">
                <h4>Key Features</h4>
                <ul class="features-list">
                  ${version.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
              </div>
              <a href="https://thomasjbutler.co.uk" class="view-version-btn" target="_blank" rel="noopener">
                Visit Live Site <i class="fas fa-external-link-alt"></i>
              </a>
            </div>
          </div>
        </div>
      `;
    }
    
    return `
      <div class="version-card" data-version="${version.id}" id="${version.id}">
        <div class="timeline-dot"></div>
        <div class="version-content">
          <div class="version-box">
            <div class="version-header">
              <div class="version-info">
                <h3>Version ${version.number}</h3>
                <span class="version-date">${version.date}</span>
              </div>
              <span class="version-tag">${version.title}</span>
            </div>
            ${version.screenshots ? `
              <div class="version-screenshots">
                <div class="screenshot-wrapper" data-type="desktop">
                  <img src="${version.screenshots.desktop}" alt="Version ${version.number} Desktop" loading="lazy">
                  <span class="screenshot-label">Desktop</span>
                </div>
                <div class="screenshot-wrapper" data-type="mobile">
                  <img src="${version.screenshots.mobile}" alt="Version ${version.number} Mobile" loading="lazy">
                  <span class="screenshot-label">Mobile</span>
                </div>
              </div>
            ` : ''}
            <div class="version-features">
              <h4>Key Changes</h4>
              <ul class="features-list">
                ${version.features.map(feature => `<li>${feature}</li>`).join('')}
              </ul>
            </div>
            ${version.path ? `
              <button class="view-version-btn" data-path="${version.path}">
                Time Travel <i class="fas fa-rocket"></i>
              </button>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }
  
  initInteractions() {
    // Handle view version buttons
    const viewButtons = this.container.querySelectorAll('.view-version-btn[data-path]');
    viewButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const path = btn.getAttribute('data-path');
        this.openVersion(path);
      });
    });
    
    // Handle screenshot clicks
    const screenshots = this.container.querySelectorAll('.screenshot-wrapper');
    screenshots.forEach(screenshot => {
      screenshot.addEventListener('click', (e) => {
        const img = screenshot.querySelector('img');
        this.showImageModal(img.src, img.alt);
      });
    });
    
    // Add hover effect to timeline dots
    const dots = this.container.querySelectorAll('.timeline-dot');
    dots.forEach(dot => {
      dot.addEventListener('mouseenter', () => {
        dot.closest('.version-card').querySelector('.version-box').classList.add('highlight');
      });
      
      dot.addEventListener('mouseleave', () => {
        dot.closest('.version-card').querySelector('.version-box').classList.remove('highlight');
      });
    });
  }
  
  openVersion(path) {
    // Get version info from the button's parent card
    const btn = event.currentTarget;
    const card = btn.closest('.version-card');
    const versionId = card.getAttribute('data-version');
    const versionBox = card.querySelector('.version-box');
    const versionNum = versionBox.querySelector('.version-info h3').textContent.replace('Version ', '');
    const versionDate = versionBox.querySelector('.version-date').textContent;
    
    // Build viewer URL with parameters
    const params = new URLSearchParams({
      version: path,
      id: versionId,
      num: versionNum,
      date: versionDate
    });
    
    // Open in viewer
    window.location.href = `/viewer.html?${params.toString()}`;
  }
  
  showImageModal(src, alt) {
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <button class="modal-close">&times;</button>
        <img src="${src}" alt="${alt}">
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .image-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        animation: fadeIn 0.3s ease;
      }
      
      .modal-content {
        position: relative;
        max-width: 90%;
        max-height: 90%;
      }
      
      .modal-content img {
        width: 100%;
        height: auto;
        border: 2px solid var(--matrix-green);
        border-radius: 8px;
      }
      
      .modal-close {
        position: absolute;
        top: -40px;
        right: 0;
        background: none;
        border: none;
        color: var(--matrix-green);
        font-size: 2rem;
        cursor: pointer;
        padding: 0.5rem;
      }
    `;
    document.head.appendChild(style);
    
    // Close on click
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.classList.contains('modal-close')) {
        modal.remove();
        style.remove();
      }
    });
  }
  
  showLoading() {
    this.container.innerHTML = `
      <div class="timeline-skeleton">
        ${[1, 2, 3, 4, 5, 6, 7].map(() => `
          <div class="version-card-skeleton">
            <div class="timeline-dot-skeleton"></div>
            <div class="version-content-skeleton">
              <div class="version-box-skeleton">
                <div class="skeleton skeleton-title"></div>
                <div class="skeleton skeleton-text skeleton-text-short"></div>
                <div class="skeleton-screenshots">
                  <div class="skeleton skeleton-image"></div>
                  <div class="skeleton skeleton-image"></div>
                </div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-text skeleton-text-short"></div>
                <div class="skeleton skeleton-button"></div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }
  
  hideLoading() {
    // Timeline content is already rendered by render() method
    // Add fade-in animation
    const cards = this.container.querySelectorAll('.version-card');
    cards.forEach((card, index) => {
      card.classList.add('content-loading');
      setTimeout(() => {
        card.classList.add('content-loaded');
      }, index * 100);
    });
  }
  
  showError() {
    this.container.innerHTML = `
      <div class="error-container">
        <div class="error-content">
          <i class="fas fa-exclamation-triangle"></i>
          <h3>Failed to Load Timeline</h3>
          <p>Please refresh the page to try again.</p>
          <button class="reload-btn" onclick="location.reload()">
            <i class="fas fa-redo"></i> Reload
          </button>
        </div>
      </div>
    `;
  }
  
  initLazyLoading() {
    const images = this.container.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            
            // Add loading state
            img.classList.add('image-loading');
            
            // Create new image to preload
            const tempImg = new Image();
            tempImg.onload = () => {
              img.classList.remove('image-loading');
              img.classList.add('loaded');
            };
            tempImg.onerror = () => {
              img.classList.remove('image-loading');
              img.alt = 'Failed to load image';
            };
            
            // Start loading
            tempImg.src = img.src;
            
            // Stop observing this image
            observer.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px'
      });
      
      images.forEach(img => imageObserver.observe(img));
    } else {
      // Fallback for browsers without IntersectionObserver
      images.forEach(img => img.classList.add('loaded'));
    }
  }
}