/**
 * Portfolio v3.0 Complete JavaScript - Exact Live Site Replica
 * Consolidated from /Users/tombutler/Repos/ThomasJButlerv3.0copy/src/js/
 * All interactive functionality combined for version timetravel system
 * @author Thomas J Butler
 * @version 3.0.0
 */

/* ==========================================================================
   Matrix Rain Effect Setup
   ========================================================================== */

const canvas = document.getElementById('matrixCanvas');
let ctx = null;
const matrixEnabled = true;
let frameCount = 0;

// Get drawing context if canvas exists
if (canvas) {
    ctx = canvas.getContext('2d');
}

// Function to make canvas fullscreen and handle window resizing
function resizeCanvas() {
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
}

// Initialize canvas size
resizeCanvas();

// Event listener to handle window resizing
window.addEventListener('resize', resizeCanvas);

// Define characters for matrix rain - mix of binary and Japanese katakana
const katakana = '101010101アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン010010101';
const characters = katakana.split('');

// Set up matrix display parameters
const fontSize = 14;
const columns = canvas ? Math.floor(canvas.width / fontSize) : 0;

// Initialize arrays for drop positions and colors
const drops = [];
const colors = [];
for (let i = 0; i < columns; i++) {
    drops[i] = Math.random() * -(canvas ? canvas.height : 0);
    colors[i] = Math.random() < 0.99 ? '#0F0' : (Math.random() < 0.1 ? '#00FFFF' : '#FF2800');
}

// Control fade effect variables
let fadeInterval;
let fadeAmount = 0;

// Function to gradually increase fade effect
function setFadeInterval() {
    clearInterval(fadeInterval);
    fadeInterval = setInterval(() => {
        if (fadeAmount < 0.05) fadeAmount += 0.001;
    }, 100);
}

setFadeInterval();

// Main matrix drawing function
function drawMatrix() {
    if (!canvas || !ctx || !matrixEnabled) return;

    // Create fade effect by drawing semi-transparent black rectangle
    ctx.fillStyle = `rgba(0, 0, 0, ${fadeAmount})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw each column of the matrix
    for (let i = 0; i < drops.length; i++) {
        const text = characters[Math.floor(Math.random() * characters.length)];
        ctx.fillStyle = colors[i];
        ctx.font = `${fontSize}px monospace`;
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // Update drop positions every 3 frames
        if (frameCount % 3 === 0) {
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
                if (Math.random() < 0.05) {
                    colors[i] = Math.random() < 0.5 ? '#00FFFF' : '#FF2800';
                } else {
                    colors[i] = '#0F0';
                }
            }
            drops[i]++;
        }
    }

    frameCount++;
}

// FPS limiter for better performance
let lastFrameTime = 0;
const targetFPS = 30; // Limit to 30 FPS for better performance
const frameInterval = 1000 / targetFPS;
let isScrolling = false;
let scrollTimeout = null;

// Animation loop function with FPS limiting and scroll optimization
function animateMatrix(currentTime = 0) {
    if (!canvas) return;

    const deltaTime = currentTime - lastFrameTime;

    // Reduce frame rate when scrolling for better performance
    const currentInterval = isScrolling ? frameInterval * 2 : frameInterval;

    if (deltaTime >= currentInterval) {
        drawMatrix();
        lastFrameTime = currentTime - (deltaTime % currentInterval);
    }

    requestAnimationFrame(animateMatrix);
}

// Start animation
requestAnimationFrame(animateMatrix);

/* ==========================================================================
   Throttle/RAF Utility Functions
   ========================================================================== */

// Throttle function for better performance
function rafThrottle(fn) {
    let isRunning = false;
    return function(...args) {
        if (isRunning) return;
        isRunning = true;
        requestAnimationFrame(() => {
            fn.apply(this, args);
            isRunning = false;
        });
    };
}

// Regular throttle function
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

/* ==========================================================================
   Scroll Handling and Performance Optimization
   ========================================================================== */

// Throttled scroll handler for better performance
const handleScroll = rafThrottle(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Mark as scrolling for performance optimization
    isScrolling = true;

    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }

    scrollTimeout = setTimeout(() => {
        isScrolling = false;
    }, 150);

    // Parallax effect for Matrix canvas - disabled during scroll for performance
    if (canvas && !isScrolling) {
        const parallaxSpeed = 0.5;
        canvas.style.transform = `translateY(${scrollTop * parallaxSpeed}px)`;
    }

    // Control matrix fade based on scroll
    if (scrollTop > 100) {
        fadeAmount = Math.min(0.8, 0.05 + (scrollTop / 1000));
    } else {
        setFadeInterval();
    }
});

// Scroll event handler with RAF throttling
window.addEventListener('scroll', handleScroll, { passive: true });

/* ==========================================================================
   Interactive Matrix Effect on Mouse/Touch
   ========================================================================== */

if (canvas) {
    let mouseX = 0;
    let mouseY = 0;

    function handleInteraction(e) {
        if (e instanceof MouseEvent) {
            mouseX = e.clientX;
            mouseY = e.clientY;
        } else if (e.touches && e.touches.length > 0) {
            mouseX = e.touches[0].clientX;
            mouseY = e.touches[0].clientY;
        }

        // Create ripple effect in matrix
        const column = Math.floor(mouseX / fontSize);
        const radius = 5;

        for (let i = Math.max(0, column - radius); i < Math.min(drops.length, column + radius); i++) {
            drops[i] = Math.floor(mouseY / fontSize);
            colors[i] = '#FFFFFF';
        }
    }

    canvas.addEventListener('mousemove', handleInteraction);
    canvas.addEventListener('touchmove', handleInteraction);
}

/* ==========================================================================
   Mobile Menu Functionality
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav ul');

    if (menuToggle && nav) {
        // Set initial state only on mobile
        if (window.innerWidth <= 768) {
            nav.style.display = 'none';
        }

        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = nav.classList.contains('show');

            if (isOpen) {
                // Close menu
                nav.classList.remove('show');
                menuToggle.classList.remove('active');
                nav.style.opacity = '0';
                nav.style.transform = 'translateY(-10px) scale(0.95)';
                setTimeout(() => {
                    if (!nav.classList.contains('show')) {
                        nav.style.display = 'none';
                    }
                }, 300);
            } else {
                // Open menu
                nav.style.display = 'flex';
                // Force reflow to ensure animation plays
                nav.offsetHeight;
                setTimeout(() => {
                    nav.classList.add('show');
                    menuToggle.classList.add('active');
                    nav.style.opacity = '1';
                    nav.style.transform = 'translateY(0) scale(1)';
                }, 10);
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target) && !menuToggle.contains(e.target) && nav.classList.contains('show')) {
                nav.classList.remove('show');
                menuToggle.classList.remove('active');
                nav.style.opacity = '0';
                nav.style.transform = 'translateY(-10px) scale(0.95)';
                setTimeout(() => {
                    if (!nav.classList.contains('show')) {
                        nav.style.display = 'none';
                    }
                }, 300);
            }
        });

        // Close menu when clicking on a link
        const navLinks = nav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (nav.classList.contains('show')) {
                    nav.classList.remove('show');
                    menuToggle.classList.remove('active');
                    nav.style.opacity = '0';
                    nav.style.transform = 'translateY(-10px) scale(0.95)';
                    setTimeout(() => {
                        if (!nav.classList.contains('show')) {
                            nav.style.display = 'none';
                        }
                    }, 300);
                }
            });
        });

        // Handle window resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                // Also resize canvas on window resize
                resizeCanvas();

                if (window.innerWidth > 768) {
                    // Desktop view - show nav
                    nav.style.display = '';
                    nav.style.opacity = '';
                    nav.style.transform = '';
                    nav.classList.remove('show');
                    menuToggle.classList.remove('active');
                } else {
                    // Mobile view - hide nav if not open
                    if (!nav.classList.contains('show')) {
                        nav.style.display = 'none';
                    }
                }
            }, 250);
        });
    }
});

/* ==========================================================================
   3D Rotating Cube Functionality
   ========================================================================== */

// Rotating Cube 3D Effect
const cube = document.getElementById('cube');
let currentRotation = { x: 0, y: 0 };
let currentFace = 'front';

function rotateCube(face) {
    if (!cube) return;

    // Update button states
    document.querySelectorAll('.cube-nav button').forEach(btn => {
        btn.classList.remove('active');
    });

    switch(face) {
        case 'front':
            currentRotation = { x: 0, y: 0 };
            const frontBtn = document.querySelector('.cube-nav button:nth-child(1)');
            if (frontBtn) frontBtn.classList.add('active');
            break;
        case 'right':
            currentRotation = { x: 0, y: 90 };
            const rightBtn = document.querySelector('.cube-nav button:nth-child(2)');
            if (rightBtn) rightBtn.classList.add('active');
            break;
        case 'back':
            currentRotation = { x: 0, y: 180 };
            const backBtn = document.querySelector('.cube-nav button:nth-child(3)');
            if (backBtn) backBtn.classList.add('active');
            break;
        case 'left':
            currentRotation = { x: 0, y: -90 };
            const leftBtn = document.querySelector('.cube-nav button:nth-child(4)');
            if (leftBtn) leftBtn.classList.add('active');
            break;
        case 'top':
            currentRotation = { x: -90, y: 0 };
            const topBtn = document.querySelector('.cube-nav button:nth-child(5)');
            if (topBtn) topBtn.classList.add('active');
            break;
        case 'bottom':
            currentRotation = { x: 90, y: 0 };
            const bottomBtn = document.querySelector('.cube-nav button:nth-child(6)');
            if (bottomBtn) bottomBtn.classList.add('active');
            break;
    }

    cube.style.transform = `rotateX(${currentRotation.x}deg) rotateY(${currentRotation.y}deg)`;
    currentFace = face;
}

// Touch/swipe support for mobile cube interaction
if (cube) {
    let touchStartX = 0;
    let touchStartY = 0;

    cube.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });

    cube.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const diffX = touchStartX - touchEndX;
        const diffY = touchStartY - touchEndY;

        // Minimum swipe distance
        const minSwipeDistance = 50;

        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > minSwipeDistance) {
            // Horizontal swipe
            if (diffX > 0) {
                // Swipe left - rotate right
                const nextFace = currentFace === 'front' ? 'right' :
                               currentFace === 'right' ? 'back' :
                               currentFace === 'back' ? 'left' : 'front';
                rotateCube(nextFace);
            } else {
                // Swipe right - rotate left
                const nextFace = currentFace === 'front' ? 'left' :
                               currentFace === 'left' ? 'back' :
                               currentFace === 'back' ? 'right' : 'front';
                rotateCube(nextFace);
            }
        } else if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > minSwipeDistance) {
            // Vertical swipe
            if (diffY > 0) {
                // Swipe up - rotate to top
                if (currentFace !== 'top' && currentFace !== 'bottom') {
                    rotateCube('top');
                }
            } else {
                // Swipe down - rotate to bottom
                if (currentFace !== 'top' && currentFace !== 'bottom') {
                    rotateCube('bottom');
                }
            }
        }
    });
}

// Auto-rotation (optional - currently disabled)
let autoRotate = false;
let autoRotateInterval;

if (autoRotate) {
    const faces = ['front', 'right', 'back', 'left', 'top', 'bottom'];
    let faceIndex = 0;

    autoRotateInterval = setInterval(() => {
        faceIndex = (faceIndex + 1) % faces.length;
        rotateCube(faces[faceIndex]);
    }, 4000);
}

// Make rotateCube function available globally for onclick handlers
window.rotateCube = rotateCube;

/* ==========================================================================
   Reveal Animations on Scroll
   ========================================================================== */

const revealElements = document.querySelectorAll('.reveal');
if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach((el) => revealObserver.observe(el));
}

/* ==========================================================================
   Smooth Scrolling for Anchor Links
   ========================================================================== */

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId && targetId !== '#') {
            const target = document.querySelector(targetId);
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});

/* ==========================================================================
   Form Validation and Handling
   ========================================================================== */

// Email validation helper
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Notification system
function showNotification(message, options = {}) {
    const { type = 'info', duration = 3000 } = options;

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? 'rgba(0, 255, 0, 0.9)' :
                     type === 'error' ? 'rgba(255, 40, 0, 0.9)' :
                     'rgba(0, 255, 255, 0.9)'};
        color: #000;
        border-radius: 8px;
        font-family: 'VT323', monospace;
        font-size: 1.1rem;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Trigger animation
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);

    // Remove notification
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, duration);
}

// Contact form handling
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');

        if (!name || !email || !message) {
            showNotification('Please fill in all fields', { type: 'error' });
            return;
        }

        if (!validateEmail(email)) {
            showNotification('Please enter a valid email address', { type: 'error' });
            return;
        }

        // Simulate form submission
        showNotification('Message sent successfully!', { type: 'success' });
        contactForm.reset();
    });
}

/* ==========================================================================
   Page Loader Functionality
   ========================================================================== */

function showPageLoader() {
    const loader = document.querySelector('.page-loader');
    if (loader) {
        loader.classList.add('active');
    }
}

function hidePageLoader() {
    const loader = document.querySelector('.page-loader');
    if (loader) {
        loader.classList.remove('active');
    }
}

/* ==========================================================================
   Keyboard Navigation and Shortcuts
   ========================================================================== */

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close any open modals or reset states
        const nav = document.querySelector('nav ul');
        const menuToggle = document.querySelector('.menu-toggle');
        if (nav && menuToggle && nav.classList.contains('show')) {
            nav.classList.remove('show');
            menuToggle.classList.remove('active');
            nav.style.opacity = '0';
            nav.style.transform = 'translateY(-10px) scale(0.95)';
            setTimeout(() => {
                if (!nav.classList.contains('show')) {
                    nav.style.display = 'none';
                }
            }, 300);
        }
    }

    // Cube navigation with number keys
    if (cube) {
        switch(e.key) {
            case '1':
                rotateCube('front');
                break;
            case '2':
                rotateCube('right');
                break;
            case '3':
                rotateCube('back');
                break;
            case '4':
                rotateCube('left');
                break;
            case '5':
                rotateCube('top');
                break;
            case '6':
                rotateCube('bottom');
                break;
        }
    }

    // Test loader with 'L' key
    if (e.key === 'l' || e.key === 'L') {
        showPageLoader();
        setTimeout(() => {
            hidePageLoader();
        }, 3000);
    }
});

/* ==========================================================================
   Page Load and FOUC Prevention
   ========================================================================== */

// Mark body as loaded for FOUC prevention
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// Ensure body is marked as loaded even if DOMContentLoaded already fired
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
}

/* ==========================================================================
   Lazy Loading for Images
   ========================================================================== */

const lazyImages = document.querySelectorAll('img[data-src]');
if (lazyImages.length > 0) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach((img) => imageObserver.observe(img));
}

/* ==========================================================================
   Interactive Button Effects
   ========================================================================== */

// Enhanced button hover effects
document.querySelectorAll('.cta-button, .neo-matrix-btn, .matrix-btn').forEach(button => {
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-2px) scale(1.05)';
    });

    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0) scale(1)';
    });
});

/* ==========================================================================
   Section Reveal on Scroll
   ========================================================================== */

const sections = document.querySelectorAll('section');
if (sections.length > 0) {
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    sections.forEach((section) => {
        sectionObserver.observe(section);
        // Immediately activate sections that are already in view on load
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            section.classList.add('active');
        }
    });
}

/* ==========================================================================
   Mouse Tracking for Interactive Effects
   ========================================================================== */

document.addEventListener('mousemove', (e) => {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        if (x >= 0 && x <= 100 && y >= 0 && y <= 100) {
            section.style.setProperty('--mouse-x', `${x}%`);
            section.style.setProperty('--mouse-y', `${y}%`);
        }
    });
});

/* ==========================================================================
   Gallery and Image Effects
   ========================================================================== */

// Enhanced gallery item hover effects
const galleryItems = document.querySelectorAll('.gallery-item, .introduction-img img, .cube-project-icon img');
galleryItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.transform = 'scale(1.02)';
        item.style.transition = 'transform 0.3s ease';
    });

    item.addEventListener('mouseleave', () => {
        item.style.transform = 'scale(1)';
    });
});

/* ==========================================================================
   Navigation Page Transition Effects
   ========================================================================== */

// Intercept navigation links for smooth transitions
document.querySelectorAll('a[href$=".html"]').forEach(link => {
    link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');

        // Skip external links and hash links
        if (!href || href.startsWith('http') || href.startsWith('#')) return;

        e.preventDefault();
        showPageLoader();

        // Set flag for next page
        sessionStorage.setItem('navigating', 'true');

        // Navigate after showing loader
        setTimeout(() => {
            window.location.href = href;
        }, 300);
    });
});

// Handle page load transitions
document.addEventListener('DOMContentLoaded', () => {
    // Show loader immediately if coming from another page
    const isNavigating = sessionStorage.getItem('navigating') === 'true';
    if (isNavigating) {
        showPageLoader();
        sessionStorage.removeItem('navigating');

        // Hide loader after animation
        setTimeout(() => {
            document.body.classList.add('loaded');
            hidePageLoader();
        }, 500);
    }
});

/* ==========================================================================
   Export Functions for Module Compatibility
   ========================================================================== */

// Export for use in other modules (if using ES6 modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        drawMatrix,
        showPageLoader,
        hidePageLoader,
        rotateCube,
        showNotification,
        validateEmail,
        matrixEnabled
    };
}

// Also make functions available on window for global access
window.showPageLoader = showPageLoader;
window.hidePageLoader = hidePageLoader;
window.showNotification = showNotification;
window.validateEmail = validateEmail;

/* ==========================================================================
   Performance and Compatibility Checks
   ========================================================================== */

// Check for reduced motion preference
if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Disable or reduce animations for accessibility
    document.documentElement.style.setProperty('--duration-fast', '0.01ms');
    document.documentElement.style.setProperty('--duration-base', '0.01ms');
    document.documentElement.style.setProperty('--duration-slow', '0.01ms');
    document.documentElement.style.setProperty('--duration-slower', '0.01ms');
}

// Initialize page when fully loaded
window.addEventListener('load', () => {
    // Ensure all images are loaded before revealing
    const images = document.querySelectorAll('img');
    Promise.all(Array.from(images).map(img => {
        return new Promise(resolve => {
            if (img.complete) {
                resolve();
            } else {
                img.addEventListener('load', resolve);
                img.addEventListener('error', resolve);
            }
        });
    })).then(() => {
        // All images loaded - ensure page is revealed
        document.body.classList.add('loaded');
    });
});

/* ==========================================================================
   Debug and Development Helpers
   ========================================================================== */

// Development mode helpers (only in development)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('🎯 Portfolio v3.0 JavaScript loaded successfully');
    console.log('🎮 Keyboard shortcuts:');
    console.log('  • 1-6: Rotate cube to different faces');
    console.log('  • L: Test page loader');
    console.log('  • ESC: Close menus/modals');
    console.log('🎨 Matrix rain effect:', matrixEnabled ? 'Enabled' : 'Disabled');

    // Add debug info to global scope
    window.portfolioDebug = {
        matrixEnabled,
        currentFace,
        currentRotation,
        frameCount,
        version: '3.0.0'
    };
}

console.log('✅ Portfolio v3.0 Interactive Systems Initialized');