/**
 * Matrix Rain Effect - Ultra Subtle Edition
 * Creates an elegant, minimal Matrix falling code effect
 * Designed to be atmospheric without being distracting
 */

export class MatrixRain {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    // Simplified to just binary for cleaner look
    this.characters = '0101010101';
    this.fontSize = 16;
    this.drops = [];
    this.frameCount = 0;
    this.columnSpacing = 4; // Only show rain every 4th column
    
    this.init();
    this.animate();
    
    // Handle resize with debouncing
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => this.init(), 250);
    });
  }
  
  init() {
    // Set canvas size
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    
    // Calculate sparse columns
    this.columns = Math.floor(this.canvas.width / this.fontSize);
    
    // Initialize drops with more variation
    this.drops = [];
    for (let i = 0; i < this.columns; i++) {
      // Only initialize drops for sparse columns
      if (i % this.columnSpacing === 0) {
        this.drops[i] = {
          y: Math.random() * -this.canvas.height / this.fontSize,
          speed: 0.3 + Math.random() * 0.2, // Variable speeds for more organic feel
          opacity: Math.random() * 0.3 + 0.1 // Random starting opacity
        };
      }
    }
  }
  
  draw() {
    // Stronger fade effect for subtlety
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Set text properties
    this.ctx.font = `${this.fontSize}px monospace`;
    
    // Draw characters with ultra-subtle effect
    for (let i = 0; i < this.columns; i++) {
      if (!this.drops[i]) continue; // Skip non-sparse columns
      
      const drop = this.drops[i];
      const char = this.characters[Math.floor(Math.random() * this.characters.length)];
      const x = i * this.fontSize;
      const y = drop.y * this.fontSize;
      
      // Ultra-subtle gradient - characters fade to nearly invisible
      const gradient = this.ctx.createLinearGradient(0, y - 30, 0, y + 10);
      gradient.addColorStop(0, 'rgba(0, 255, 0, 0)');
      gradient.addColorStop(0.5, `rgba(0, 255, 0, ${drop.opacity * 0.3})`);
      gradient.addColorStop(1, `rgba(0, 255, 0, ${drop.opacity * 0.15})`);
      
      this.ctx.fillStyle = gradient;
      this.ctx.fillText(char, x, y);
      
      // Add occasional bright "glitch" for visual interest
      if (Math.random() > 0.998) {
        this.ctx.fillStyle = `rgba(0, 255, 0, ${0.6})`;
        this.ctx.fillText(char, x, y);
      }
      
      // Reset drop when it reaches bottom
      if (y > this.canvas.height && Math.random() > 0.95) {
        drop.y = 0;
        drop.opacity = Math.random() * 0.3 + 0.1;
        drop.speed = 0.3 + Math.random() * 0.2;
      }
      
      // Move drop with its individual speed
      drop.y += drop.speed;
    }
  }
  
  animate() {
    this.frameCount++;
    
    // Skip frames for even slower, more subtle animation
    if (this.frameCount % 2 === 0) {
      this.draw();
    }
    
    requestAnimationFrame(() => this.animate());
  }
}