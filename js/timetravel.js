/**
 * Version TimeTravel JavaScript
 * Handles Matrix rain effect and timeline interactions
 * @author Thomas J Butler
 */

// Matrix Rain Effect
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

// Make canvas fullscreen
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Matrix characters
const katakana = '101010101アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン010010101';
const characters = katakana.split('');

const fontSize = 14;
const columns = canvas.width / fontSize;

// Initialize drops
const drops = [];
for (let i = 0; i < columns; i++) {
    drops[i] = Math.random() * -canvas.height;
}

// Draw matrix rain
function drawMatrix() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#0F0';
    ctx.font = `${fontSize}px monospace`;

    for (let i = 0; i < drops.length; i++) {
        const text = characters[Math.floor(Math.random() * characters.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

// Animation loop
function animate() {
    drawMatrix();
    requestAnimationFrame(animate);
}

animate();

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }

    // Scroll reveal for version containers
    const versionContainers = document.querySelectorAll('.version-container');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    versionContainers.forEach(container => {
        container.style.opacity = '0';
        container.style.transform = 'translateY(20px)';
        container.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(container);
    });

    // Add glitch effect to version links on hover
    const versionLinks = document.querySelectorAll('.version-link');
    
    versionLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            const originalText = this.textContent;
            const glitchChars = '!@#$%^&*()';
            let iterations = 0;
            
            const glitchInterval = setInterval(() => {
                this.textContent = originalText
                    .split('')
                    .map((char, index) => {
                        if (index < iterations) {
                            return originalText[index];
                        }
                        return glitchChars[Math.floor(Math.random() * glitchChars.length)];
                    })
                    .join('');
                
                if (iterations >= originalText.length) {
                    clearInterval(glitchInterval);
                }
                
                iterations += 1;
            }, 30);
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add pulse effect to timeline dots
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% {
                box-shadow: 0 0 0 0 rgba(0, 255, 0, 0.7);
            }
            70% {
                box-shadow: 0 0 0 20px rgba(0, 255, 0, 0);
            }
            100% {
                box-shadow: 0 0 0 0 rgba(0, 255, 0, 0);
            }
        }
        
        .version-container::before {
            animation: pulse 2s infinite;
        }
    `;
    document.head.appendChild(style);
});