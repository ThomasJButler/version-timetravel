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
      const response = await fetch('/data/versions.json');
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
        date: 'July 2025',
        title: 'Hybrid Architecture',
        screenshots: {
          desktop: 'https://res.cloudinary.com/depqttzlt/image/upload/v1754541799/v30_sesrmp.png',
          mobile: 'https://res.cloudinary.com/depqttzlt/image/upload/v1754541799/v30_sesrmp.png'
        },
        features: [
          'Hybrid HTML/CSS/JS with module system',
          'Vite build tools integration',
          '3D rotating cube showcase',
          'Enhanced Matrix rain effect'
        ],
        path: 'version30.html'
        },
        {
        id: 'commercial',
        number: 'Commercial',
        date: 'December 2024 (Updated to v2.0 June 2025)',
        title: 'Professional Portfolio',
        isExternal: true,
        externalUrl: 'https://thomasjbutler.me',
        screenshots: {
          desktop: 'https://res.cloudinary.com/depqttzlt/image/upload/v1752552064/commercialdesktop_nn2p8t.png',
          mobile: 'https://res.cloudinary.com/depqttzlt/image/upload/v1752552062/commercialmobile_nrh17c.png'
        },
        techStack: [
          'React',
          'JavaScript',
          'SCSS',
          'Bootstrap 5',
          'Vite'
        ],
        features: [
          'Separate site for commercial work',
          '3+ years experience showcase',
          'Apple-inspired design',
          'Light/dark theme switching',
          'Multi-language support',
          '90+ Lighthouse score',
          'WCAG compliant',
          'SEO optimized'
        ]
      },
      {
        id: 'v2.8',
        number: '2.8',
        date: 'January 2025',
        title: 'Matrix Evolution',
        screenshots: {
          desktop: 'https://res.cloudinary.com/depqttzlt/image/upload/v1752549398/v28desktop_f5lxp1.png',
          mobile: 'https://res.cloudinary.com/depqttzlt/image/upload/v1752549394/v28mobile_g7rovj.png'
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
        date: 'August 2024',
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
        date: 'January 2024',
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
      },
    ];
  }
  
  render() {
    this.container.innerHTML = this.versions.map((version, index) => 
      this.createVersionCard(version, index)
    ).join('');
  }
  
  createVersionCard(version, index) {
    if (version.isExternal) {
      // Special rendering for external/commercial portfolio
      return `
        <div class="version-card version-external" data-version="${version.id}" id="${version.id}">
          <div class="timeline-dot"></div>
          <div class="version-content">
            <div class="version-box">
              <div class="version-header">
                <div class="version-info">
                  <h3>${version.number} Portfolio</h3>
                  <span class="version-date">${version.date}</span>
                </div>
                <span class="version-tag">${version.title}</span>
              </div>
              ${version.screenshots ? `
                <div class="version-desktop">
                  <img src="${version.screenshots.desktop}" alt="${version.number} Portfolio Desktop" loading="lazy">
                  <span class="desktop-label">Desktop View</span>
                </div>
                <div class="version-bottom">
                  <div class="version-details">
              ` : '<div class="version-details">'}
                    <div class="version-features">
                      <h4>Key Changes</h4>
                      <ul class="features-list" data-version="${version.id}">
                        ${version.features.slice(0, 3).map(feature => `<li>${feature}</li>`).join('')}
                        ${version.features.length > 3 ? `
                          <div class="features-expanded" style="display: none;">
                            ${version.features.slice(3).map(feature => `<li>${feature}</li>`).join('')}
                          </div>
                        ` : ''}
                      </ul>
                      ${version.features.length > 3 ? `
                        <button class="see-more-btn" data-version="${version.id}" data-expanded="false">
                          <span class="see-more-text">See more</span>
                          <i class="fas fa-chevron-down"></i>
                        </button>
                      ` : ''}
                    </div>
                    <div class="button-group">
                      <a href="${version.externalUrl}" class="view-version-btn external-btn" target="_blank" rel="noopener">
                        Visit Site <i class="fas fa-external-link-alt"></i>
                      </a>
                      <a href="https://github.com/ThomasJButler/Commercial-Portfolio-React" class="view-version-btn github-btn" target="_blank" rel="noopener" title="View on GitHub">
                        <i class="fab fa-github"></i> GitHub
                      </a>
                    </div>
                  </div>
                  ${version.screenshots ? `
                    <div class="version-mobile">
                      <img src="${version.screenshots.mobile}" alt="${version.number} Portfolio Mobile" loading="lazy">
                      <span class="mobile-label">Mobile</span>
                    </div>
                  ` : ''}
                </div>
              ${!version.screenshots ? '</div>' : ''}
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
              <div class="version-desktop">
                <img src="${version.screenshots.desktop}" alt="Version ${version.number} Desktop" loading="lazy">
                <span class="desktop-label">Desktop View</span>
              </div>
              <div class="version-bottom">
                <div class="version-details">
            ` : '<div class="version-details">'}
                  <div class="version-features">
                    <h4>Key Changes</h4>
                    <ul class="features-list" data-version="${version.id}">
                      ${version.features.slice(0, 3).map(feature => `<li>${feature}</li>`).join('')}
                      ${version.features.length > 3 ? `
                        <div class="features-expanded" style="display: none;">
                          ${version.features.slice(3).map(feature => `<li>${feature}</li>`).join('')}
                        </div>
                      ` : ''}
                    </ul>
                    ${version.features.length > 3 ? `
                      <button class="see-more-btn" data-version="${version.id}" data-expanded="false">
                        <span class="see-more-text">See more</span>
                        <i class="fas fa-chevron-down"></i>
                      </button>
                    ` : ''}
                  </div>
                  ${version.path ? `
                    <button class="view-version-btn" data-path="${version.path}">
                      Time Travel <i class="fas fa-rocket"></i>
                    </button>
                  ` : ''}
                </div>
                ${version.screenshots ? `
                  <div class="version-mobile">
                    <img src="${version.screenshots.mobile}" alt="Version ${version.number} Mobile" loading="lazy">
                    <span class="mobile-label">Mobile</span>
                  </div>
                ` : ''}
              </div>
            ${!version.screenshots ? '</div>' : ''}
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
    
    // Handle see more buttons
    const seeMoreButtons = this.container.querySelectorAll('.see-more-btn');
    seeMoreButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const versionId = btn.getAttribute('data-version');
        const expanded = btn.getAttribute('data-expanded') === 'true';
        const featuresList = this.container.querySelector(`.features-list[data-version="${versionId}"]`);
        const expandedFeatures = featuresList.querySelector('.features-expanded');
        const btnText = btn.querySelector('.see-more-text');
        const btnIcon = btn.querySelector('i');
        
        if (expandedFeatures) {
          if (expanded) {
            expandedFeatures.style.display = 'none';
            btnText.textContent = 'See more';
            btnIcon.className = 'fas fa-chevron-down';
            btn.setAttribute('data-expanded', 'false');
          } else {
            expandedFeatures.style.display = 'block';
            btnText.textContent = 'See less';
            btnIcon.className = 'fas fa-chevron-up';
            btn.setAttribute('data-expanded', 'true');
          }
        }
      });
    });
    
    // Handle screenshot clicks
    const desktopShots = this.container.querySelectorAll('.version-desktop');
    const mobileShots = this.container.querySelectorAll('.version-mobile');
    
    [...desktopShots, ...mobileShots].forEach(screenshot => {
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
    window.location.href = `${import.meta.env.BASE_URL}viewer.html?${params.toString()}`;
  }
  
  showImageModal(src, alt) {
    console.log('Opening modal with image:', src);
    
    // Create modal structure first
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <button class="modal-close">&times;</button>
        <div class="modal-loading active">
          <i class="fas fa-spinner fa-spin"></i>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Force reflow to ensure animation plays
    modal.offsetHeight;
    
    // Preload the image
    const img = new Image();
    
    img.onload = () => {
      console.log('Image loaded successfully:', src);
      
      // Create the actual image element
      const imgElement = document.createElement('img');
      imgElement.src = src;
      imgElement.alt = alt;
      imgElement.className = 'loading';
      
      // Add image to modal
      const modalContent = modal.querySelector('.modal-content');
      modalContent.appendChild(imgElement);
      
      // Hide loading spinner
      const loadingElement = modal.querySelector('.modal-loading');
      loadingElement.classList.remove('active');
      
      // Fade in the image
      setTimeout(() => {
        imgElement.classList.remove('loading');
      }, 50);
    };
    
    img.onerror = () => {
      console.error('Failed to load image:', src);
      const modalContent = modal.querySelector('.modal-content');
      modalContent.innerHTML = `
        <button class="modal-close">&times;</button>
        <div style="color: var(--matrix-red); text-align: center; padding: 2rem;">
          <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
          <p>Failed to load image</p>
          <p style="font-size: 0.9rem; opacity: 0.7; margin-top: 0.5rem;">${src}</p>
        </div>
      `;
    };
    
    // Start loading the image
    img.src = src;
    
    // Close on click
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.classList.contains('modal-close')) {
        modal.remove();
      }
    });
    
    // Close on ESC key
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        modal.remove();
        document.removeEventListener('keydown', handleEsc);
      }
    };
    document.addEventListener('keydown', handleEsc);
  }
  
  showLoading() {
    this.container.innerHTML = `
      <div class="timeline-skeleton">
        ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(() => `
          <div class="version-card-skeleton">
            <div class="timeline-dot-skeleton"></div>
            <div class="version-content-skeleton">
              <div class="version-box-skeleton">
                <div class="skeleton skeleton-title"></div>
                <div class="skeleton skeleton-text skeleton-text-short"></div>
                <div class="skeleton skeleton-desktop"></div>
                <div class="skeleton-bottom">
                  <div class="skeleton-details">
                    <div class="skeleton skeleton-text"></div>
                    <div class="skeleton skeleton-text"></div>
                    <div class="skeleton skeleton-text skeleton-text-short"></div>
                    <div class="skeleton skeleton-button"></div>
                  </div>
                  <div class="skeleton skeleton-mobile"></div>
                </div>
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