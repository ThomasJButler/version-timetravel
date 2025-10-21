/**
 * @fileoverview Main script file for portfolio website with Matrix rain effect and interactive elements
 * @requires DOM elements: matrixCanvas, vincent-gallery, form elements, navigation elements
 * @author Thomas J Butler
 * @version 1.0.0
 *
 * @description
 * This script handles multiple interactive features:
 * - Matrix rain effect animation on non-art pages
 * - Text glitch effects on headings
 * - Scroll reveal animations
 * - Form validation
 * - Responsive navigation menu
 * - Van Gogh infinity gallery with 3D hover effects
 * - Lazy loading images
 * - Smooth scrolling
 * - Parallax effects
 * - Notification system
 *
 * Key variables and components:
 * 
 * @property {boolean} isArtPage - Determines if current page is art gallery
 * @property {HTMLCanvasElement} canvas - Matrix rain canvas element
 * @property {CanvasRenderingContext2D} ctx - Canvas context for drawing
 * @property {boolean} matrixEnabled - Controls matrix animation
 * @property {boolean} isVincentGalleryOpen - Controls gallery visibility
 * @property {number} frameCount - Tracks animation frames
 * @property {number} fadeAmount - Controls matrix fade effect
 * 
 * Main functions:
 * @function drawMatrix() - Renders matrix rain animation
 * @function glitchEffect() - Applies text glitch animation to elements
 * @function reveal() - Handles scroll reveal animations
 * @function openVincentGallery() - Shows Van Gogh gallery
 * @function closeVincentGallery() - Hides Van Gogh gallery
 * @function showNotification() - Displays notification messages
 *
 * Event listeners:
 * - Window resize: Updates canvas dimensions
 * - Scroll: Controls matrix fade and menu
 * - Mouse/touch: Interactive matrix effects
 * - Click: Toggles features and handles navigation
 *
 * To modify:
 * 1. Adjust fontSize and fadeAmount for different matrix effects
 * 2. Modify glitchChars for different glitch characters
 * 3. Change animation timings in setInterval calls
 * 4. Update notification styling in CSS
 * 5. Modify gallery hover sensitivity in applyHoverEffect
 */
const isArtPage = window.location.pathname.includes('art.html');

// Matrix Rain Effect - will be replaced with landing page example in future
const canvas = document.getElementById('matrixCanvas');
let ctx;
let matrixEnabled = !isArtPage;
let isVincentGalleryOpen = isArtPage;
let frameCount = 0;

if (canvas) {
    ctx = canvas.getContext('2d');
} else {
    console.log('Matrix canvas not found. This might be the art page.');
}

function resizeCanvas() {
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Mix of binary and Japanese katakana
const katakana = '101010101アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン010010101';
const characters = katakana.split('');

const fontSize = 14;
const columns = canvas ? canvas.width / fontSize : 0;

const drops = [];
const colors = [];
for (let i = 0; i < columns; i++) {
    drops[i] = Math.random() * -(canvas ? canvas.height : 0);
    // Mostly green with rare cyan or red
    colors[i] = Math.random() < 0.99 ? '#0F0' : (Math.random() < 0.1 ? '#00FFFF' : '#FF2800');
}

let fadeInterval;
let fadeAmount = 0;

function setFadeInterval() {
    clearInterval(fadeInterval);
    fadeInterval = setInterval(() => {
        if (fadeAmount < 0.05) fadeAmount += 0.001;
    }, 100);
}

setFadeInterval();

function drawMatrix() {
    if (!canvas || !matrixEnabled || isVincentGalleryOpen) return;

    ctx.fillStyle = `rgba(0, 0, 0, ${fadeAmount})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < drops.length; i++) {
        const text = characters[Math.floor(Math.random() * characters.length)];
        ctx.fillStyle = colors[i];
        ctx.font = `${fontSize}px monospace`;
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // Update drop positions every 3 frames
        if (frameCount % 3 === 0) {
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
                // Small chance to change colour
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

function animate() {
    if (canvas) {
        drawMatrix();
        requestAnimationFrame(animate);
    }
}

if (!isArtPage) {
    animate();
}

let lastScrollTop = 0;
window.addEventListener('scroll', () => {
    let st = window.pageYOffset || document.documentElement.scrollTop;
    // Increase fade when scrolling down, decrease when scrolling up
    if (st > lastScrollTop) {
        fadeAmount = Math.min(fadeAmount + 0.01, 0.05);
    } else {
        fadeAmount = Math.max(fadeAmount - 0.01, 0);
    }
    lastScrollTop = st <= 0 ? 0 : st;
    setFadeInterval();
});

if (canvas) {
    canvas.addEventListener('mousemove', (e) => {
        const x = Math.floor(e.clientX / fontSize);
        const y = Math.floor(e.clientY / fontSize);
        drops[x] = y;
    });

    // Touch interaction for mobile devices
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const x = Math.floor(touch.clientX / fontSize);
        const y = Math.floor(touch.clientY / fontSize);
        drops[x] = y;
    }, { passive: false });

    canvas.addEventListener('click', () => {
        matrixEnabled = !matrixEnabled;
    });
}

document.addEventListener('DOMContentLoaded', function() {
    if (isArtPage) {
        const vincentGallery = document.querySelector('.vincent-gallery');
        if (vincentGallery) {
            vincentGallery.style.display = 'grid';
        }
        if (canvas) {
            canvas.style.display = 'none';
        }
    }

    document.querySelectorAll('h1, h2, h3').forEach(heading => {
        heading.style.transition = 'transform 0.3s ease-in-out';

        heading.addEventListener('mouseover', () => {
            if (heading.dataset.cooldown !== 'true') {
                glitchEffect(heading);
                heading.dataset.cooldown = 'true';
            }
        });

        heading.addEventListener('mouseenter', () => {
            heading.style.transform = 'scale(1.05)';
        });

        heading.addEventListener('mouseleave', () => {
            heading.style.transform = 'scale(1)';
        });
    });


    function reveal() {
        const reveals = document.querySelectorAll(".reveal");
        reveals.forEach(element => {
            const windowHeight = window.innerHeight;
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < windowHeight - elementVisible) {
                element.classList.add("active");
            } else {
                element.classList.remove("active");
            }
        });
    }

    window.addEventListener("scroll", reveal);

    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            if (name && email && message) {
                form.submit();
            } else {
                alert('Please fill in all fields.');
            }
        });
    }

    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (header) {
            const scrollPosition = window.scrollY;
            header.style.backgroundPositionY = -scrollPosition * 0.5 + 'px';
        }
    });

    const projectItems = document.querySelectorAll('#projects .grid-item');
    projectItems.forEach(item => {
        item.addEventListener('click', function() {
            this.classList.toggle('expanded');
        });
    });

    function typeWriter(element, text, speed) {
        let i = 0;
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    }

    const introText = document.querySelector('#introduction p');
    if (introText) {
        const text = introText.innerHTML;
        introText.innerHTML = '';
        typeWriter(introText, text, 50);
    }

    document.querySelectorAll('section').forEach(section => {
        section.classList.add('reveal');
    });

    reveal();

    const menuToggle = document.querySelector('.menu-toggle');
    const navUl = document.querySelector('nav ul');
    const introduction = document.querySelector('#introduction');

    if (menuToggle && navUl) {
        menuToggle.addEventListener('click', function() {
            navUl.classList.toggle('show');
            menuToggle.classList.toggle('active');

            introduction.style.paddingTop = navUl.classList.contains('show') ? '333px' : '30px';
        });

        document.addEventListener('click', function(e) {
            if (!navUl.contains(e.target) && !menuToggle.contains(e.target)) {
                navUl.classList.remove('show');
                menuToggle.classList.remove('active');
                introduction.style.paddingTop = '30px';
            }
        });

        window.addEventListener('scroll', function() {
            if (navUl.classList.contains('show')) {
                navUl.classList.remove('show');
                menuToggle.classList.remove('active');
                introduction.style.paddingTop = '30px';
            }
        });
    }

    const lazyImages = [].slice.call(document.querySelectorAll("img.lazy"));

    if ("IntersectionObserver" in window) {
        let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    let lazyImage = entry.target;
                    lazyImage.src = lazyImage.dataset.src;
                    lazyImage.classList.remove("lazy");
                    lazyImageObserver.unobserve(lazyImage);
                }
            });
        });

        lazyImages.forEach(function(lazyImage) {
            lazyImageObserver.observe(lazyImage);
        });
    }

    const vincentItems = document.querySelectorAll('.vincent-item');
    const vincentGallery = document.querySelector('.vincent-gallery');
    const openGalleryButton = document.querySelector('#open-vincent-gallery');
    const closeGalleryButton = document.querySelector('#close-vincent-gallery');

    function openVincentGallery() {
        isVincentGalleryOpen = true;
        matrixEnabled = false;
        if (canvas) canvas.style.display = 'none';
        if (vincentGallery) vincentGallery.style.display = 'grid';
    }

    function closeVincentGallery() {
        isVincentGalleryOpen = false;
        matrixEnabled = true;
        if (canvas) canvas.style.display = 'block';
        if (vincentGallery) vincentGallery.style.display = 'none';
    }

    function applyHoverEffect(event) {
        if (!vincentGallery) return;
        const galleryRect = vincentGallery.getBoundingClientRect();
        const mouseX = (event.clientX - galleryRect.left) / galleryRect.width;
        const mouseY = (event.clientY - galleryRect.top) / galleryRect.height;

        vincentItems.forEach(item => {
            const itemRect = item.getBoundingClientRect();
            const itemCenterX = (itemRect.left + itemRect.right) / 2 - galleryRect.left;
            const itemCenterY = (itemRect.top + itemRect.bottom) / 2 - galleryRect.top;

            const deltaX = mouseX * galleryRect.width - itemCenterX;
            const deltaY = mouseY * galleryRect.height - itemCenterY;

            const angleX = (deltaY / galleryRect.height) * 30;
            const angleY = (deltaX / galleryRect.width) * -30;

            item.style.transform = `rotateX(${angleX}deg) rotateY(${angleY}deg)`;
        });
    }

    function resetHoverEffect() {
        vincentItems.forEach(item => {
            item.style.transform = 'rotateX(0) rotateY(0)';
        });
    }

    if (openGalleryButton) {
        openGalleryButton.addEventListener('click', openVincentGallery);
    }
    if (closeGalleryButton) {
        closeGalleryButton.addEventListener('click', closeVincentGallery);
    }
    if (vincentGallery) {
        vincentGallery.addEventListener('mousemove', applyHoverEffect);
        vincentGallery.addEventListener('mouseleave', resetHoverEffect);
    }

    const projectCards = document.querySelectorAll('.project-card');
    let lastClickedCard = null;

    projectCards.forEach((card, index) => {
        card.style.zIndex = 1000 - index;

        card.addEventListener('click', function(e) {
            if (e.target.closest('a')) return;

            if (lastClickedCard && lastClickedCard !== this) {
                lastClickedCard.classList.remove('active');
            }

            this.classList.toggle('active');
            lastClickedCard = this;

            const chars = '101010101アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン010010101';
            const matrixEffect = document.createElement('div');
            matrixEffect.className = 'matrix-activation';
            this.appendChild(matrixEffect);

            setTimeout(() => matrixEffect.remove(), 1000);

            if (this.classList.contains('active')) {
                this.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });

        card.addEventListener('mouseenter', () => {
            playMatrixSound('hover');
        });
    });

    function playMatrixSound(type) {
        const audio = new Audio();
        audio.volume = 0.1;
        switch(type) {
            case 'hover':
                audio.src = 'path/to/hover.mp3';
                break;
            case 'activate':
                audio.src = 'path/to/activate.mp3';
                break;
        }
        audio.play().catch(() => {});
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lastClickedCard) {
            lastClickedCard.classList.remove('active');
            lastClickedCard = null;
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach((card, index) => {
        const header = card.querySelector('.project-header');

        header.addEventListener('click', (e) => {
            e.stopPropagation();

            projectCards.forEach(otherCard => {
                if (otherCard !== card && otherCard.classList.contains('active')) {
                    otherCard.classList.remove('active');
                }
            });

            card.classList.toggle('active');

            if (card.classList.contains('active')) {
                const offset = 100;
                const cardPosition = card.getBoundingClientRect().top;
                const offsetPosition = cardPosition + window.pageYOffset - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });

        header.addEventListener('mouseenter', () => {
            if (!card.classList.contains('active')) {
                card.style.transform = 'translateX(1rem)';
            }
        });

        header.addEventListener('mouseleave', () => {
            if (!card.classList.contains('active')) {
                card.style.transform = 'none';
            }
        });
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            projectCards.forEach(card => {
                card.classList.remove('active');
            });
        }
    });
});

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);
    notification.offsetHeight;

    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

