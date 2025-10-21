/**
 * Version Viewer
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
    this.showLoading(num);

    if (num) this.versionNumber.textContent = `Version ${num}`;
    if (date) this.versionDate.textContent = date;

    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    const fullPath = import.meta.env.BASE_URL + cleanPath;

    this.frame.src = fullPath;

    this.frame.addEventListener('load', () => {
      setTimeout(() => {
        this.hideLoading();
        this.frame.classList.add('loaded');
      }, 500);
    }, { once: true });

    this.frame.addEventListener('error', () => {
      this.showError('Failed to load version');
    }, { once: true });

    setTimeout(() => {
      if (this.loadingOverlay.classList.contains('active')) {
        this.showError('Loading timeout - please refresh');
      }
    }, 10000);
  }

  initControls() {
    this.backBtn.addEventListener('click', () => {
      window.location.href = import.meta.env.BASE_URL;
    });

    this.viewportBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const viewport = btn.getAttribute('data-viewport');
        this.setViewport(viewport);
      });
    });

    this.fullscreenBtn.addEventListener('click', () => {
      this.toggleFullscreen();
    });

    this.refreshBtn.addEventListener('click', () => {
      this.frame.src = this.frame.src;
    });

    document.addEventListener('keydown', (e) => {
      switch(e.key) {
        case 'Escape':
          if (document.fullscreenElement) {
            this.toggleFullscreen();
          } else {
            window.location.href = import.meta.env.BASE_URL;
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
    this.viewportBtns.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-viewport') === viewport);
    });

    this.deviceFrame.setAttribute('data-viewport', viewport);

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
  
  showLoading(versionNum) {
    this.loadingOverlay.innerHTML = `
      <div class="viewer-loading">
        <div class="viewer-loading-content">
          <div class="matrix-spinner"></div>
          <div class="loading-text">Loading Version ${versionNum || ''}</div>
          <div class="loading-progress">
            <div class="loading-progress-bar"></div>
          </div>
        </div>
      </div>
    `;
    this.loadingOverlay.classList.add('active');
  }
  
  hideLoading() {
    this.loadingOverlay.classList.remove('active');
    setTimeout(() => {
      this.loadingOverlay.innerHTML = '';
    }, 300);
  }
  
  showError(message) {
    this.loadingOverlay.innerHTML = `
      <div class="error-message">
        <i class="fas fa-exclamation-triangle"></i>
        <p>${message}</p>
        <button onclick="window.location.href='${import.meta.env.BASE_URL}'">Back to Timeline</button>
      </div>
    `;
    this.loadingOverlay.classList.add('active');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new VersionViewer();
});