/**
 * Main Application Entry Point
 * Version TimeTravel - Thomas J Butler
 */

import { MatrixRain } from './js/matrix.js';
import { Timeline } from './js/timeline.js';

document.documentElement.classList.add('is-loading');

document.addEventListener('DOMContentLoaded', () => {
  console.log('Version TimeTravel Initialised');

  new MatrixRain('matrix-canvas');
  const timeline = new Timeline();

  initMobileMenu();
  initSmoothScroll();
  initIntersectionObserver();
  initBackToTop();
  initScrollProgress();
  initKeyboardNavigation();
  initVersionQuickLinks();

  setTimeout(() => {
    document.documentElement.classList.remove('is-loading');
  }, 500);
});

function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('.main-nav');

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      mainNav.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
        mainNav.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }
}

function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      const targetId = link.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);

      if (target) {
        const headerHeight = document.querySelector('.site-header').offsetHeight;
        const targetPosition = target.offsetTop - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

function initIntersectionObserver() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  const sections = document.querySelectorAll('section');
  sections.forEach(section => {
    observer.observe(section);
  });
}

function initBackToTop() {
  const backToTopBtn = document.querySelector('.back-to-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

function initScrollProgress() {
  const progressBar = document.querySelector('.scroll-progress-bar');

  window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    progressBar.style.width = scrolled + '%';
  });
}

function initKeyboardNavigation() {
  document.addEventListener('keydown', (e) => {
    if (e.key >= '1' && e.key <= '9') {
      const versions = ['v1', 'v2', 'v2.5', 'landing', 'v2.8', 'v3', 'v3.5', 'commercial'];
      const versionIndex = parseInt(e.key) - 1;
      if (versions[versionIndex]) {
        const element = document.getElementById(versions[versionIndex]);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }

    if (e.key === 'Escape') {
      if (window.location.pathname.includes('viewer.html')) {
        window.location.href = import.meta.env.BASE_URL;
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }

    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      const versionCards = Array.from(document.querySelectorAll('.version-card'));
      const currentIndex = versionCards.findIndex(card =>
        card.getBoundingClientRect().top > 0
      );

      if (e.key === 'ArrowUp' && currentIndex > 0) {
        versionCards[currentIndex - 1].scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (e.key === 'ArrowDown' && currentIndex < versionCards.length - 1) {
        versionCards[currentIndex + 1].scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  });
}

function initVersionQuickLinks() {
  const quickLinks = document.querySelectorAll('.version-link-btn');

  quickLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const versionId = link.getAttribute('data-version');
      const element = document.getElementById(versionId);

      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });

        element.classList.add('highlight');
        setTimeout(() => {
          element.classList.remove('highlight');
        }, 2000);
      }
    });
  });
}