/**
 * Main Application Entry Point
 * Version TimeTravel - Thomas J Butler
 */

import { MatrixRain } from './js/matrix.js';
import { Timeline } from './js/timeline.js';

// Show initial loading state
document.documentElement.classList.add('is-loading');

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Version TimeTravel Initialized');
  
  // Initialize Matrix rain effect
  new MatrixRain('matrix-canvas');
  
  // Initialize timeline
  const timeline = new Timeline();
  
  // Initialize mobile menu
  initMobileMenu();
  
  // Initialize smooth scroll
  initSmoothScroll();
  
  // Add intersection observer for animations
  initIntersectionObserver();
  
  // Initialize back to top button
  initBackToTop();
  
  // Initialize scroll progress
  initScrollProgress();
  
  // Initialize keyboard navigation
  initKeyboardNavigation();
  
  // Initialize version quick links
  initVersionQuickLinks();
  
  // Remove loading state after initialization
  setTimeout(() => {
    document.documentElement.classList.remove('is-loading');
  }, 500);
});

/**
 * Initialize mobile menu toggle
 */
function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      mainNav.classList.toggle('active');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
        mainNav.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }
}

/**
 * Initialize smooth scrolling for anchor links
 */
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

/**
 * Initialize intersection observer for fade-in animations
 */
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
  
  // Observe all sections
  const sections = document.querySelectorAll('section');
  sections.forEach(section => {
    observer.observe(section);
  });
}

/**
 * Initialize back to top button
 */
function initBackToTop() {
  const backToTopBtn = document.querySelector('.back-to-top');
  
  // Show/hide based on scroll position
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });
  
  // Scroll to top on click
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * Initialize scroll progress bar
 */
function initScrollProgress() {
  const progressBar = document.querySelector('.scroll-progress-bar');
  
  window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    progressBar.style.width = scrolled + '%';
  });
}

/**
 * Initialize keyboard navigation
 */
function initKeyboardNavigation() {
  document.addEventListener('keydown', (e) => {
    // Number keys 1-6 for version navigation
    if (e.key >= '1' && e.key <= '6') {
      const versions = ['v1', 'v2', 'v2.5', 'landing', 'v2.8', 'v3'];
      const versionIndex = parseInt(e.key) - 1;
      if (versions[versionIndex]) {
        const element = document.getElementById(versions[versionIndex]);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
    
    // ESC to close viewer or go to top
    if (e.key === 'Escape') {
      if (window.location.pathname.includes('viewer.html')) {
        window.location.href = '/';
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
    
    // Arrow keys for timeline navigation
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

/**
 * Initialize version quick links with smooth scroll
 */
function initVersionQuickLinks() {
  const quickLinks = document.querySelectorAll('.version-link-btn');
  
  quickLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const versionId = link.getAttribute('data-version');
      const element = document.getElementById(versionId);
      
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Add highlight effect
        element.classList.add('highlight');
        setTimeout(() => {
          element.classList.remove('highlight');
        }, 2000);
      }
    });
  });
}