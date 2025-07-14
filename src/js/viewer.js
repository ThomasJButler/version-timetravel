/**
 * Version Viewer
 * Handles version preview functionality
 */

class VersionViewer {
  constructor() {
    this.frame = document.getElementById('version-frame');
    this.deviceFrame = document.querySelector('.device-frame');
    this.viewportBtns = document.querySelectorAll('.viewport-btn');
    this.backBtn = document.getElementById('back-btn');
    this.fullscreenBtn = document.getElementById('fullscreen-btn');
    this.refreshBtn = document.getElementById('refresh-btn');
    this.loadingOverlay = document.querySelector('.loading-overlay');
    this.versionNumber = document.getElementById('version-number');
    this.versionDate = document.getElementById('version-date');
    
    this.init();
  }
  
  init() {
    // Get version from URL params
    const params = new URLSearchParams(window.location.search);
    const versionPath = params.get('version');
    const versionId = params.get('id');
    const versionNum = params.get('num');
    const date = params.get('date');
    
    if (versionPath) {
      this.loadVersion(versionPath, versionId, versionNum, date);
    } else {
      this.showError('No version specified');
    }
    
    this.initControls();
  }
  
  loadVersion(path, id, num, date) {
    // Show loading
    this.loadingOverlay.classList.add('active');
    
    // Update version info
    if (num) this.versionNumber.textContent = `Version ${num}`;
    if (date) this.versionDate.textContent = date;
    
    // Load version in iframe
    this.frame.src = path;
    
    // Handle load complete
    this.frame.addEventListener('load', () => {
      setTimeout(() => {
        this.loadingOverlay.classList.remove('active');
        this.frame.classList.add('loaded');
      }, 500);
    });
    
    // Handle load error
    this.frame.addEventListener('error', () => {
      this.showError('Failed to load version');
    });
  }
  
  initControls() {
    // Back button
    this.backBtn.addEventListener('click', () => {
      window.location.href = '/';
    });
    
    // Viewport toggles
    this.viewportBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const viewport = btn.getAttribute('data-viewport');
        this.setViewport(viewport);
      });
    });
    
    // Fullscreen toggle
    this.fullscreenBtn.addEventListener('click', () => {
      this.toggleFullscreen();
    });
    
    // Refresh button
    this.refreshBtn.addEventListener('click', () => {
      this.frame.src = this.frame.src;
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      switch(e.key) {
        case 'Escape':
          if (document.fullscreenElement) {
            this.toggleFullscreen();
          } else {
            window.location.href = '/';
          }
          break;
        case '1':
          this.setViewport('desktop');
          break;
        case '2':
          this.setViewport('tablet');
          break;
        case '3':
          this.setViewport('mobile');
          break;
        case 'f':
        case 'F':
          this.toggleFullscreen();
          break;
        case 'r':
        case 'R':
          this.frame.src = this.frame.src;
          break;
      }
    });
  }
  
  setViewport(viewport) {
    // Update buttons
    this.viewportBtns.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-viewport') === viewport);
    });
    
    // Update frame
    this.deviceFrame.setAttribute('data-viewport', viewport);
    
    // Add transition effect
    this.deviceFrame.style.opacity = '0.8';
    setTimeout(() => {
      this.deviceFrame.style.opacity = '1';
    }, 100);
  }
  
  toggleFullscreen() {
    const container = document.querySelector('.viewer-container');
    const icon = this.fullscreenBtn.querySelector('i');
    
    if (!document.fullscreenElement) {
      container.requestFullscreen().then(() => {
        container.classList.add('fullscreen');
        icon.classList.remove('fa-expand');
        icon.classList.add('fa-compress');
      });
    } else {
      document.exitFullscreen().then(() => {
        container.classList.remove('fullscreen');
        icon.classList.remove('fa-compress');
        icon.classList.add('fa-expand');
      });
    }
  }
  
  showError(message) {
    this.loadingOverlay.innerHTML = `
      <div class="error-message">
        <i class="fas fa-exclamation-triangle"></i>
        <p>${message}</p>
        <button onclick="window.location.href='/'">Back to Timeline</button>
      </div>
    `;
    this.loadingOverlay.classList.add('active');
  }
}

// Initialize viewer when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new VersionViewer();
});