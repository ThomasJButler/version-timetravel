/**
 * Matrix Rain Effect for Portfolio v3.0
 * Extracted from main scripts.ts for standalone use
 * @author Thomas J Butler
 * @version 3.0.0
 */

// Matrix Rain Effect Setup
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

// Interactive matrix effect on mouse/touch
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

// Mobile menu toggle handler (if menu exists)
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

// Reveal animations on scroll for showcase elements
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

// Smooth scrolling for anchor links
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

// Simple page loader functionality
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

// Export for use in other modules (if using ES6 modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        drawMatrix,
        showPageLoader,
        hidePageLoader,
        matrixEnabled
    };
}