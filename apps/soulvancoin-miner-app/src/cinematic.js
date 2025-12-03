/**
 * Cinematic onboarding experience
 * Full-screen overlay with starfield effects and typewriter animation
 */

class CinematicOnboarding {
  constructor() {
    this.overlay = null;
    this.canvas = null;
    this.ctx = null;
    this.stars = [];
    this.animationFrame = null;
    this.currentStep = 0;
    this.steps = [];
  }

  async start(walletAddress) {
    this.steps = [
      'Initializing Soulvan Coin ecosystem...',
      'Connecting to decentralized network...',
      `Creating wallet: ${walletAddress.substring(0, 20)}...`,
      'Securing private keys...',
      'Synchronizing with blockchain...',
      'Welcome to Soulvan Coin! Your wallet is ready.'
    ];

    this.createOverlay();
    this.initStarfield();
    this.startStarfieldAnimation();
    await this.playSteps();
    this.close();
  }

  createOverlay() {
    this.overlay = document.createElement('div');
    this.overlay.id = 'cinematic-overlay';
    this.overlay.className = 'cinematic-overlay';
    
    // Create starfield canvas
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'starfield-canvas';
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.ctx = this.canvas.getContext('2d');
    
    // Create text container
    const textContainer = document.createElement('div');
    textContainer.className = 'cinematic-text';
    textContainer.id = 'cinematic-text';
    
    this.overlay.appendChild(this.canvas);
    this.overlay.appendChild(textContainer);
    document.body.appendChild(this.overlay);
    
    // Force reflow for animation
    this.overlay.offsetHeight;
    this.overlay.classList.add('active');
  }

  initStarfield() {
    this.stars = [];
    const numStars = 200;
    
    for (let i = 0; i < numStars; i++) {
      this.stars.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        z: Math.random() * 2000,
        size: Math.random() * 2
      });
    }
  }

  startStarfieldAnimation() {
    const animate = () => {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
      const centerX = this.canvas.width / 2;
      const centerY = this.canvas.height / 2;
      
      this.stars.forEach(star => {
        star.z -= 2;
        if (star.z <= 0) {
          star.z = 2000;
          star.x = Math.random() * this.canvas.width;
          star.y = Math.random() * this.canvas.height;
        }
        
        const scale = 1000 / star.z;
        const x = (star.x - centerX) * scale + centerX;
        const y = (star.y - centerY) * scale + centerY;
        const size = star.size * scale;
        
        if (x >= 0 && x <= this.canvas.width && y >= 0 && y <= this.canvas.height) {
          this.ctx.fillStyle = `rgba(255, 255, 255, ${1 - star.z / 2000})`;
          this.ctx.beginPath();
          this.ctx.arc(x, y, size, 0, Math.PI * 2);
          this.ctx.fill();
        }
      });
      
      this.animationFrame = requestAnimationFrame(animate);
    };
    
    animate();
  }

  async playSteps() {
    const textContainer = document.getElementById('cinematic-text');
    
    for (let i = 0; i < this.steps.length; i++) {
      textContainer.textContent = '';
      await this.typewriterEffect(this.steps[i], textContainer);
      await this.sleep(800);
    }
    
    await this.sleep(1500);
  }

  async typewriterEffect(text, element) {
    for (let i = 0; i < text.length; i++) {
      element.textContent += text[i];
      await this.sleep(30);
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  close() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    
    if (this.overlay) {
      this.overlay.classList.remove('active');
      setTimeout(() => {
        if (this.overlay && this.overlay.parentNode) {
          this.overlay.parentNode.removeChild(this.overlay);
        }
      }, 500);
    }
  }
}

// Theme system with animated transitions
class ThemeManager {
  constructor() {
    this.themes = ['neo', 'aurora', 'noir', 'sunset'];
    this.currentThemeIndex = 0;
    this.loadSavedTheme();
  }

  loadSavedTheme() {
    const saved = localStorage.getItem('soulvan-theme');
    if (saved && this.themes.includes(saved)) {
      const index = this.themes.indexOf(saved);
      this.currentThemeIndex = index;
      this.applyTheme(saved);
    } else {
      this.applyTheme(this.themes[0]);
    }
  }

  cycleTheme() {
    this.currentThemeIndex = (this.currentThemeIndex + 1) % this.themes.length;
    const newTheme = this.themes[this.currentThemeIndex];
    this.applyTheme(newTheme);
    localStorage.setItem('soulvan-theme', newTheme);
  }

  applyTheme(themeName) {
    const body = document.body;
    
    // Add transitioning class
    body.classList.add('theme-transitioning');
    
    // Remove all theme classes
    this.themes.forEach(theme => {
      body.classList.remove(`theme-${theme}`);
    });
    
    // Add new theme class
    setTimeout(() => {
      body.classList.add(`theme-${themeName}`);
      
      // Remove transitioning class after animation
      setTimeout(() => {
        body.classList.remove('theme-transitioning');
      }, 500);
    }, 50);
  }

  getCurrentTheme() {
    return this.themes[this.currentThemeIndex];
  }
}

// Export for use in renderer
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CinematicOnboarding, ThemeManager };
}
