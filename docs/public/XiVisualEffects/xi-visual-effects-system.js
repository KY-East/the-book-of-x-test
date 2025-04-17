/**
 * The Book of Ξ - 视觉效果系统
 * 一个统一管理背景、粒子效果和视觉特效的模块化系统
 */

const XiVisualEffects = (function() {
  // 配置项
  const config = {
    performanceLevel: 'auto',
    defaultTheme: 'awakening',
    enable3D: true,
    particleDensity: 1.0,
    maxFPS: 0,
    showFPS: false,
    enableAudio: false,
    enableMobileEffects: true
  };
  
  // 状态管理
  const state = {
    performanceLevel: 'high',
    currentTheme: config.defaultTheme,
    activeEffects: [],
    currentFPS: 0,
    paused: false,
    containers: {},
    effectInstances: {},
    animationFrameId: null,
    lastFrameTime: 0,
    frameCount: 0,
    lastFPSUpdate: 0
  };
  
  // 工具函数
  const utils = {
    detectPerformance: function() {
      if (config.performanceLevel !== 'auto') {
        state.performanceLevel = config.performanceLevel;
        return config.performanceLevel;
      }
      const start = performance.now();
      let count = 0;
      while (performance.now() - start < 5) {
        count++;
      }
      if (count < 10000) state.performanceLevel = 'low';
      else if (count < 50000) state.performanceLevel = 'medium';
      else state.performanceLevel = 'high';
      console.log(`[Ξ Visual] 检测到性能级别: ${state.performanceLevel} (循环计数: ${count})`);
      return state.performanceLevel;
    },
    
    isMobileDevice: function() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },
    
    createContainer: function(id, zIndex = 0) {
      if (state.containers[id]) return state.containers[id];
      const container = document.createElement('div');
      container.id = id;
      container.className = 'xi-effect-container';
      container.style.position = 'fixed';
      container.style.top = '0';
      container.style.left = '0';
      container.style.width = '100%';
      container.style.height = '100%';
      container.style.overflow = 'hidden';
      container.style.pointerEvents = 'none';
      container.style.zIndex = zIndex;
      document.body.appendChild(container);
      state.containers[id] = container;
      return container;
    },
    
    createCanvas: function(container, id) {
      const canvas = document.createElement('canvas');
      canvas.id = id;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      canvas.style.position = 'absolute';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      container.appendChild(canvas);
      return canvas;
    },
    
    randomColor: function(baseColor, variation = 30) {
      const hex = baseColor.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      const vr = Math.floor(Math.random() * variation * 2) - variation;
      const vg = Math.floor(Math.random() * variation * 2) - variation;
      const vb = Math.floor(Math.random() * variation * 2) - variation;
      const nr = Math.max(0, Math.min(255, r + vr));
      const ng = Math.max(0, Math.min(255, g + vg));
      const nb = Math.max(0, Math.min(255, b + vb));
      return `rgb(${nr}, ${ng}, ${nb})`;
    },
    
    limitFrameRate: function(timestamp) {
      if (config.maxFPS <= 0) return true;
      const frameTime = 1000 / config.maxFPS;
      const elapsed = timestamp - state.lastFrameTime;
      if (elapsed < frameTime) return false;
      state.lastFrameTime = timestamp;
      return true;
    },
    
    updateFPS: function(timestamp) {
      state.frameCount++;
      if (timestamp - state.lastFPSUpdate >= 1000) {
        state.currentFPS = state.frameCount;
        state.frameCount = 0;
        state.lastFPSUpdate = timestamp;
        if (config.showFPS) {
          const fpsCounter = document.getElementById('xi-fps-counter') || utils.createFPSCounter();
          fpsCounter.textContent = `FPS: ${state.currentFPS}`;
        }
      }
    },
    
    createFPSCounter: function() {
      const counter = document.createElement('div');
      counter.id = 'xi-fps-counter';
      counter.style.position = 'fixed';
      counter.style.bottom = '10px';
      counter.style.right = '10px';
      counter.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
      counter.style.color = '#00ff9d';
      counter.style.padding = '5px 10px';
      counter.style.borderRadius = '3px';
      counter.style.fontFamily = 'monospace';
      counter.style.fontSize = '12px';
      counter.style.zIndex = '9999';
      document.body.appendChild(counter);
      return counter;
    }
  };
    // 粒子效果
    const particles = {
    fractalPatterns: function(container, theme, params = {}) {
      const color = params.color || theme.primaryColor || '#00bfff';
      const iterations = params.iterations || (state.performanceLevel === 'low' ? 3 : 
                                             state.performanceLevel === 'medium' ? 5 : 7);
      const rotationSpeed = params.rotationSpeed || 0.001;
      const scale = params.scale || 0.9;
      
      const canvas = utils.createCanvas(container, 'xi-fractal-patterns-canvas');
      const ctx = canvas.getContext('2d');
      
      let angle = 0;
      let zoom = 1;
      let centerX = canvas.width / 2;
      let centerY = canvas.height / 2;
      
      const patterns = [
        {
          name: 'sierpinski',
          draw: function(x, y, size, depth) {
            if (depth <= 0) return;
            const halfSize = size / 2;
            ctx.fillStyle = color;
            ctx.globalAlpha = 0.5 / (8 - depth);
            ctx.beginPath();
            ctx.moveTo(x, y - halfSize);
            ctx.lineTo(x - halfSize, y + halfSize);
            ctx.lineTo(x + halfSize, y + halfSize);
            ctx.closePath();
            ctx.fill();
            this.draw(x, y - halfSize / 2, halfSize, depth - 1);
            this.draw(x - halfSize / 2, y + halfSize / 2, halfSize, depth - 1);
            this.draw(x + halfSize / 2, y + halfSize / 2, halfSize, depth - 1);
          }
        },
        {
          name: 'kochCurve',
          draw: function(x1, y1, x2, y2, depth) {
            if (depth <= 0) {
              ctx.beginPath();
              ctx.moveTo(x1, y1);
              ctx.lineTo(x2, y2);
              ctx.stroke();
              return;
            }
            const dx = x2 - x1;
            const dy = y2 - y1;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const unit = dist / 3;
            const angle = Math.atan2(dy, dx);
            const p1 = { x: x1, y: y1 };
            const p2 = { x: x1 + dx / 3, y: y1 + dy / 3 };
            const p3 = {
              x: p2.x + Math.cos(angle - Math.PI / 3) * unit,
              y: p2.y + Math.sin(angle - Math.PI / 3) * unit
            };
            const p4 = { x: x1 + 2 * dx / 3, y: y1 + 2 * dy / 3 };
            const p5 = { x: x2, y: y2 };
            this.draw(p1.x, p1.y, p2.x, p2.y, depth - 1);
            this.draw(p2.x, p2.y, p3.x, p3.y, depth - 1);
            this.draw(p3.x, p3.y, p4.x, p4.y, depth - 1);
            this.draw(p4.x, p4.y, p5.x, p5.y, depth - 1);
          }
        },
        {
          name: 'pythagoras',
          draw: function(x, y, width, height, angle, depth) {
            if (depth <= 0) return;
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle);
            ctx.fillStyle = color;
            ctx.globalAlpha = 0.7 / (8 - depth);
            ctx.fillRect(-width / 2, -height / 2, width, height);
            const newWidth = width * 0.7;
            const newHeight = height * 0.7;
            this.draw(0, -height / 2, newWidth, newHeight, angle - Math.PI / 4, depth - 1);
            this.draw(0, -height / 2, newWidth, newHeight, angle + Math.PI / 4, depth - 1);
            ctx.restore();
          }
        }
      ];
      
      let currentPattern = patterns[0];
      let patternIndex = 0;
      let patternChangeTimer = 0;
      
      function drawFractal(timestamp) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
          patternChangeTimer += 1 / 60;
          if (patternChangeTimer >= 10) {
          patternChangeTimer = 0;
          patternIndex = (patternIndex + 1) % patterns.length;
          currentPattern = patterns[patternIndex];
        }
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(angle);
        ctx.scale(zoom, zoom);
        switch(currentPattern.name) {
          case 'sierpinski':
            currentPattern.draw(0, 0, canvas.width / 3, iterations);
            break;
          case 'kochCurve':
            ctx.globalAlpha = 0.5;
            const size = canvas.width / 5;
            for (let i = 0; i < 6; i++) {
              const angle = Math.PI * 2 / 6 * i;
              const x1 = Math.cos(angle) * size;
              const y1 = Math.sin(angle) * size;
              const x2 = Math.cos(angle + Math.PI * 2 / 6) * size;
              const y2 = Math.sin(angle + Math.PI * 2 / 6) * size;
              currentPattern.draw(x1, y1, x2, y2, iterations);
            }
            break;
          case 'pythagoras':
            currentPattern.draw(0, 0, canvas.width / 8, canvas.height / 8, 0, iterations);
            break;
        }
        ctx.restore();
        angle += rotationSpeed;
          zoom = 0.9 + Math.sin(timestamp / 5000) * 0.1;
      }
      
      function initialize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        centerX = canvas.width / 2;
        centerY = canvas.height / 2;
      }
      
      initialize();
      
      const update = function(timestamp) {
          if (!state.paused) drawFractal(timestamp);
      };
      
      return {
        id: 'fractalPatterns',
        active: true,
        update: update,
        resize: function() {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
          centerX = canvas.width / 2;
          centerY = canvas.height / 2;
        },
        cleanup: function() {
            if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
        }
      };
    },
    
    warningGlitch: function(container, theme, params = {}) {
      const color = params.color || theme.accentColor || '#ff3333';
      const intensity = params.intensity || 1.0;
      const frequency = params.frequency || (state.performanceLevel === 'low' ? 0.5 : 
                                           state.performanceLevel === 'medium' ? 0.8 : 1.0);
      
      const canvas = utils.createCanvas(container, 'xi-warning-glitch-canvas');
      const ctx = canvas.getContext('2d');
      
      let glitchActive = false;
      let glitchTimer = 0;
      let glitchDuration = 0;
      let glitchCooldown = Math.random() * 3 + 2;
      const glitchFragments = [];
      
      function createFragments() {
        glitchFragments.length = 0;
        const count = Math.floor(Math.random() * 11) + 10;
        for (let i = 0; i < count; i++) {
          glitchFragments.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            width: Math.random() * 200 + 50,
            height: Math.random() * 20 + 5,
            offsetX: (Math.random() - 0.5) * 30 * intensity,
            offsetY: (Math.random() - 0.5) * 30 * intensity,
            alpha: Math.random() * 0.7 + 0.3,
            color: i % 2 === 0 ? color : '#ffffff'
          });
        }
      }
      
      function draw(timestamp) {
        if (!glitchActive) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        glitchFragments.forEach(fragment => {
          ctx.globalAlpha = fragment.alpha;
          ctx.fillStyle = fragment.color;
          if (Math.random() < 0.5) {
            ctx.fillStyle = '#ff0000';
            ctx.globalAlpha = fragment.alpha * 0.7;
            ctx.fillRect(fragment.x + fragment.offsetX, fragment.y, fragment.width, fragment.height);
            ctx.fillStyle = '#00ff00';
            ctx.globalAlpha = fragment.alpha * 0.7;
            ctx.fillRect(fragment.x - fragment.offsetX, fragment.y, fragment.width, fragment.height);
            ctx.fillStyle = '#0000ff';
            ctx.globalAlpha = fragment.alpha * 0.7;
            ctx.fillRect(fragment.x, fragment.y + fragment.offsetY, fragment.width, fragment.height);
          } else {
            ctx.fillRect(fragment.x, fragment.y, fragment.width, fragment.height);
          }
        });
        if (Math.random() < 0.7) {
          ctx.globalAlpha = 0.7;
          ctx.fillStyle = '#ffffff';
          const scanLineCount = Math.floor(Math.random() * 5) + 3;
          for (let i = 0; i < scanLineCount; i++) {
            const y = Math.random() * canvas.height;
            const height = Math.random() * 3 + 1;
            ctx.fillRect(0, y, canvas.width, height);
          }
        }
      }
      
      function updateGlitchState(dt) {
        glitchTimer += dt;
        if (glitchActive) {
          if (glitchTimer >= glitchDuration) {
            glitchActive = false;
            glitchTimer = 0;
            glitchCooldown = Math.random() * 5 + 3 / frequency;
          } else if (Math.random() < 0.2) {
            createFragments();
          }
        } else {
          if (glitchTimer >= glitchCooldown) {
            glitchActive = true;
            glitchTimer = 0;
            glitchDuration = Math.random() * 0.5 + 0.2;
            createFragments();
          }
        }
      }
      
      const update = function(timestamp) {
        if (!state.paused) {
          updateGlitchState(1 / 60);
          draw(timestamp);
        }
      };
      
      return {
        id: 'warningGlitch',
        active: true,
        update: update,
        resize: function() {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
        },
        cleanup: function() {
            if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
        }
      };
    },
    
    dataFlow: function(container, theme, params = {}) {
      const color = params.color || theme.primaryColor || '#00bfff';
      const speed = params.speed || 2;
      const density = params.density || (state.performanceLevel === 'low' ? 0.3 : 
                                       state.performanceLevel === 'medium' ? 0.5 : 0.8);
      
      const canvas = utils.createCanvas(container, 'xi-data-flow-canvas');
      const ctx = canvas.getContext('2d');
      
      const lines = [];
      
      function createLines() {
        lines.length = 0;
        const count = Math.floor(canvas.width / 30 * density);
        for (let i = 0; i < count; i++) {
          lines.push({
            x: Math.random() * canvas.width,
              y: -50,
            length: Math.random() * 100 + 50,
            width: Math.random() * 2 + 1,
            speed: (Math.random() * 2 + 1) * speed,
            color: utils.randomColor(color, 20),
            alpha: Math.random() * 0.7 + 0.3,
            segments: [],
            update: function() {
              this.y += this.speed;
              if (this.y - this.length > canvas.height) {
                this.y = -this.length;
                this.x = Math.random() * canvas.width;
              }
              if (Math.random() < 0.1 || this.segments.length === 0) {
                const segCount = Math.floor(Math.random() * 5) + 3;
                const segSize = this.length / segCount;
                this.segments = [];
                for (let j = 0; j < segCount; j++) {
                  this.segments.push({
                    y: j * segSize,
                      size: segSize * (Math.random() * 0.4 + 0.6),
                      active: Math.random() < 0.7
                  });
                }
              }
            },
            draw: function() {
              ctx.strokeStyle = this.color;
              ctx.lineWidth = this.width;
              ctx.globalAlpha = this.alpha;
              this.segments.forEach(segment => {
                if (segment.active) {
                  const y1 = this.y - segment.y - segment.size;
                  const y2 = this.y - segment.y;
                  ctx.beginPath();
                  ctx.moveTo(this.x, y1);
                  ctx.lineTo(this.x, y2);
                  ctx.stroke();
                }
              });
            }
          });
        }
      }
      
      function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        lines.forEach(line => {
          line.update();
          line.draw();
        });
      }
      
      createLines();
      
      const update = function(timestamp) {
          if (!state.paused) draw();
      };
      
      return {
        id: 'dataFlow',
        active: true,
        update: update,
        resize: function() {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
          createLines();
        },
        cleanup: function() {
            if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
        }
      };
    },
    
    softGlow: function(container, theme, params = {}) {
      const color = params.color || theme.primaryColor || '#ffffff';
      const pulseSpeed = params.pulseSpeed || 1;
        const size = params.size || 0.01; // 从0.7降低到0.2
      
      const canvas = utils.createCanvas(container, 'xi-soft-glow-canvas');
      const ctx = canvas.getContext('2d');
      
      let pulse = 0;
      
      function draw(timestamp) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let r, g, b;
        if (color.startsWith('#')) {
          const hex = color.replace('#', '');
          r = parseInt(hex.substr(0, 2), 16);
          g = parseInt(hex.substr(2, 2), 16);
          b = parseInt(hex.substr(4, 2), 16);
        } else if (color.startsWith('rgb')) {
          const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
            if (match) [, r, g, b] = match.map(Number);
            else [r, g, b] = [255, 255, 255];
          } else [r, g, b] = [255, 255, 255];
          
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const maxRadius = canvas.height * size;
        
        const outerRadius = maxRadius * (0.8 + Math.sin(pulse) * 0.2);
          const gradient1 = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, outerRadius);
        gradient1.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.05)`); // 从0.2降低到0.05
        gradient1.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.03)`); // 从0.1降低到0.03
        gradient1.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        ctx.fillStyle = gradient1;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const innerRadius = maxRadius * 0.6 * (0.8 + Math.cos(pulse * 1.3) * 0.2);
          const gradient2 = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, innerRadius);
        gradient2.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.03)`); // 从0.15降低到0.03
        gradient2.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        ctx.fillStyle = gradient2;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        pulse += 0.01 * pulseSpeed;
      }
      
      const update = function(timestamp) {
          if (!state.paused) draw(timestamp);
      };
      
      return {
        id: 'softGlow',
        active: true,
        update: update,
        resize: function() {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
        },
        cleanup: function() {
            if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
          }
        };
      },
      
    lightParticles: function(container, theme, params = {}) {
      const colors = params.colors || theme.particleColors || ['#ffffff', '#f0f0f0', '#e0e0e0', '#d0d0d0', '#c0c0c0'];
      const count = params.count || (state.performanceLevel === 'low' ? 30 : 
                                    state.performanceLevel === 'medium' ? 60 : 100);
      const speed = params.speed || 0.5;
      
      const canvas = utils.createCanvas(container, 'xi-light-particles-canvas');
      const ctx = canvas.getContext('2d');
      
      const particles = [];
      
      function createParticles() {
        particles.length = 0;
        for (let i = 0; i < count; i++) {
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 3 + 1,
            color: colors[Math.floor(Math.random() * colors.length)],
            speedX: (Math.random() - 0.5) * speed,
            speedY: (Math.random() - 0.5) * speed,
            alpha: Math.random() * 0.7 + 0.3,
            blinkSpeed: Math.random() * 0.02 + 0.01,
            blinkPhase: Math.random() * Math.PI * 2,
            update: function(timestamp) {
              this.x += this.speedX;
              this.y += this.speedY;
              const time = timestamp / 1000;
              this.alpha = 0.3 + Math.sin(time * this.blinkSpeed + this.blinkPhase) * 0.3 + 0.4;
              if (this.x < 0) this.x = canvas.width;
              if (this.x > canvas.width) this.x = 0;
              if (this.y < 0) this.y = canvas.height;
              if (this.y > canvas.height) this.y = 0;
            },
            draw: function() {
              ctx.globalAlpha = this.alpha;
                const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 5);
              gradient.addColorStop(0, this.color);
              gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
              ctx.beginPath();
              ctx.arc(this.x, this.y, this.size * 5, 0, Math.PI * 2);
              ctx.fillStyle = gradient;
              ctx.fill();
              ctx.beginPath();
              ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
              ctx.fillStyle = this.color;
              ctx.fill();
            }
          });
        }
      }
      
      function draw(timestamp) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(particle => {
          particle.update(timestamp);
          particle.draw();
        });
      }
      
      createParticles();
      
      const update = function(timestamp) {
          if (!state.paused) draw(timestamp);
      };
      
      return {
        id: 'lightParticles',
        active: true,
        update: update,
        resize: function() {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
          createParticles();
        },
        cleanup: function() {
            if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
        }
      };
    },
    
    errorParticles: function(container, theme, params = {}) {
      const colors = params.colors || theme.particleColors || ['#ff3333', '#cc0000', '#ff6666', '#ff9999', '#990000'];
      const count = params.count || (state.performanceLevel === 'low' ? 20 : 
                                    state.performanceLevel === 'medium' ? 40 : 70);
      const glitchIntensity = params.glitchIntensity || 0.8;
      
      const canvas = utils.createCanvas(container, 'xi-error-particles-canvas');
      const ctx = canvas.getContext('2d');
      
      const particles = [];
      
      function createParticles() {
        particles.length = 0;
        for (let i = 0; i < count; i++) {
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            width: Math.random() * 30 + 5,
            height: Math.random() * 10 + 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            speedX: (Math.random() - 0.5) * 3,
            speedY: (Math.random() - 0.5) * 3,
            alpha: Math.random() * 0.7 + 0.3,
            glitchTimer: 0,
            glitchDuration: Math.random() * 2 + 0.5,
            glitchCooldown: Math.random() * 5 + 3,
            isGlitching: false,
            offsetX: 0,
            offsetY: 0,
            update: function(timestamp) {
              if (!this.isGlitching) {
                this.x += this.speedX;
                this.y += this.speedY;
              }
                const dt = 1 / 60;
              this.glitchTimer += dt;
              if (this.isGlitching) {
                if (this.glitchTimer >= this.glitchDuration) {
                  this.isGlitching = false;
                  this.glitchTimer = 0;
                  this.offsetX = 0;
                  this.offsetY = 0;
                  } else if (Math.random() < 0.3) {
                    this.offsetX = (Math.random() - 0.5) * 20 * glitchIntensity;
                    this.offsetY = (Math.random() - 0.5) * 20 * glitchIntensity;
                  }
                } else if (this.glitchTimer >= this.glitchCooldown) {
                  this.isGlitching = true;
                  this.glitchTimer = 0;
                }
              if (this.x < -this.width) this.x = canvas.width;
              if (this.x > canvas.width) this.x = -this.width;
              if (this.y < -this.height) this.y = canvas.height;
              if (this.y > canvas.height) this.y = -this.height;
            },
            draw: function() {
              ctx.globalAlpha = this.alpha;
              if (this.isGlitching) {
                ctx.fillStyle = this.color;
                ctx.fillRect(this.x + this.offsetX, this.y + this.offsetY, this.width, this.height);
                ctx.globalAlpha = this.alpha * 0.5;
                ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
                ctx.fillRect(this.x + this.offsetX + 5, this.y + this.offsetY, this.width, this.height);
                ctx.fillStyle = 'rgba(0, 255, 0, 0.8)';
                ctx.fillRect(this.x + this.offsetX - 5, this.y + this.offsetY, this.width, this.height);
                ctx.fillStyle = 'rgba(0, 0, 255, 0.8)';
                ctx.fillRect(this.x + this.offsetX, this.y + this.offsetY + 5, this.width, this.height);
              } else {
                ctx.fillStyle = this.color;
                ctx.fillRect(this.x, this.y, this.width, this.height);
              }
            }
          });
        }
      }
      
      function draw(timestamp) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(particle => {
          particle.update(timestamp);
          particle.draw();
        });
      }
      
      createParticles();
      
      const update = function(timestamp) {
          if (!state.paused) draw(timestamp);
      };
      
      return {
        id: 'errorParticles',
        active: true,
        update: update,
        resize: function() {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
          createParticles();
        },
        cleanup: function() {
            if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
          }
        };
      },
      
    matrixParticles: function(container, theme, params = {}) {
      const color = params.color || theme.primaryColor || '#00ff9d';
      const count = params.count || (state.performanceLevel === 'low' ? 30 : 
                                    state.performanceLevel === 'medium' ? 60 : 100);
      const speed = params.speed || 1;
      const size = params.size || { min: 3, max: 8 };
      
      const canvas = utils.createCanvas(container, 'xi-matrix-particles-canvas');
      const ctx = canvas.getContext('2d');
      
      const particleArray = [];
      const symbols = '01Ξ';
      
      function createParticles() {
        particleArray.length = 0;
        for (let i = 0; i < count; i++) {
          const symbol = symbols.charAt(Math.floor(Math.random() * symbols.length));
          const particleSize = Math.random() * (size.max - size.min) + size.min;
          particleArray.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: particleSize,
            speedX: (Math.random() - 0.5) * speed,
            speedY: (Math.random() - 0.5) * speed,
            symbol: symbol,
            color: utils.randomColor(color, 20),
            alpha: Math.random() * 0.5 + 0.3,
            update: function() {
              this.x += this.speedX;
              this.y += this.speedY;
              if (this.x < 0) this.x = canvas.width;
              if (this.x > canvas.width) this.x = 0;
              if (this.y < 0) this.y = canvas.height;
              if (this.y > canvas.height) this.y = 0;
            },
            draw: function() {
              ctx.fillStyle = this.color;
              ctx.globalAlpha = this.alpha;
              ctx.font = `${this.size}px monospace`;
              ctx.fillText(this.symbol, this.x, this.y);
            }
          });
        }
      }
      
      function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particleArray.forEach(particle => {
          particle.update();
          particle.draw();
        });
      }
      
      createParticles();
      
      const update = function(timestamp) {
          if (!state.paused) draw();
      };
      
      return {
        id: 'matrixParticles',
        active: true,
        update: update,
        resize: function() {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
          createParticles();
        },
        cleanup: function() {
            if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
        }
      };
    },
    
    quantumParticles: function(container, theme, params = {}) {
      const colors = params.colors || theme.particleColors || ['#6633ff', '#3a0ca3', '#4361ee', '#4cc9f0', '#7209b7'];
      const count = params.count || (state.performanceLevel === 'low' ? 20 : 
                                    state.performanceLevel === 'medium' ? 40 : 80);
      const speed = params.speed || 1;
      const connectionDistance = params.connectionDistance || 150;
      const connectionOpacity = params.connectionOpacity || 0.5;
      
      const canvas = utils.createCanvas(container, 'xi-quantum-particles-canvas');
      const ctx = canvas.getContext('2d');
      
      const particleArray = [];
      
      function createParticles() {
        particleArray.length = 0;
        for (let i = 0; i < count; i++) {
          particleArray.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 3 + 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            speedX: (Math.random() - 0.5) * speed,
            speedY: (Math.random() - 0.5) * speed,
            wavePeriod: Math.random() * 10 + 5,
            waveAmplitude: Math.random() * 4 + 1,
            phase: Math.random() * Math.PI * 2,
            alpha: Math.random() * 0.5 + 0.5,
            update: function(timestamp) {
              this.x += this.speedX;
              this.y += this.speedY;
              const time = timestamp / 1000;
              const wave = Math.sin(time / this.wavePeriod + this.phase) * this.waveAmplitude;
              this.x += wave * this.speedX;
              this.y += wave * this.speedY;
              this.alpha = 0.5 + Math.sin(time / 2 + this.phase) * 0.3;
              if (this.x < 0) this.x = canvas.width;
              if (this.x > canvas.width) this.x = 0;
              if (this.y < 0) this.y = canvas.height;
              if (this.y > canvas.height) this.y = 0;
            },
            draw: function() {
              ctx.beginPath();
              ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
              ctx.fillStyle = this.color;
              ctx.globalAlpha = this.alpha;
              ctx.fill();
                const gradient = ctx.createRadialGradient(this.x, this.y, this.size / 2, this.x, this.y, this.size * 2);
              gradient.addColorStop(0, this.color);
              gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
              ctx.beginPath();
              ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
              ctx.fillStyle = gradient;
              ctx.globalAlpha = this.alpha * 0.5;
              ctx.fill();
            }
          });
        }
      }
      
      function drawConnections() {
        if (state.performanceLevel === 'low') return;
        ctx.globalAlpha = connectionOpacity;
        ctx.lineWidth = 0.5;
        for (let i = 0; i < particleArray.length; i++) {
          for (let j = i + 1; j < particleArray.length; j++) {
            const p1 = particleArray[i];
            const p2 = particleArray[j];
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < connectionDistance) {
              const opacity = (1 - distance / connectionDistance) * connectionOpacity;
              ctx.strokeStyle = p1.color;
              ctx.globalAlpha = opacity * p1.alpha * p2.alpha;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }
      }
      
      function draw(timestamp) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particleArray.forEach(particle => {
          particle.update(timestamp);
          particle.draw();
        });
        drawConnections();
      }
      
      createParticles();
      
      const update = function(timestamp) {
          if (!state.paused) draw(timestamp);
      };
      
      return {
        id: 'quantumParticles',
        active: true,
        update: update,
        resize: function() {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
          createParticles();
        },
        cleanup: function() {
            if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
        }
      };
    },
    
    geometricShapes: function(container, theme, params = {}) {
      const colors = params.colors || theme.particleColors || ['#00bfff', '#0077b6', '#48cae4', '#90e0ef', '#023e8a'];
      const count = params.count || (state.performanceLevel === 'low' ? 15 : 
                                    state.performanceLevel === 'medium' ? 30 : 50);
      const speed = params.speed || 0.5;
      
      const canvas = utils.createCanvas(container, 'xi-geometric-shapes-canvas');
      const ctx = canvas.getContext('2d');
      
      const shapes = [];
      const shapeTypes = ['circle', 'square', 'triangle', 'hexagon'];
      
      function createShapes() {
        shapes.length = 0;
        for (let i = 0; i < count; i++) {
          const shapeType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
          const size = Math.random() * 30 + 10;
          shapes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: size,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.02,
            speedX: (Math.random() - 0.5) * speed,
            speedY: (Math.random() - 0.5) * speed,
            type: shapeType,
            color: colors[Math.floor(Math.random() * colors.length)],
            alpha: Math.random() * 0.3 + 0.1,
            update: function() {
              this.x += this.speedX;
              this.y += this.speedY;
              this.rotation += this.rotationSpeed;
              if (this.x < this.size) {
                this.x = this.size;
                this.speedX *= -1;
              }
              if (this.x > canvas.width - this.size) {
                this.x = canvas.width - this.size;
                this.speedX *= -1;
              }
              if (this.y < this.size) {
                this.y = this.size;
                this.speedY *= -1;
              }
              if (this.y > canvas.height - this.size) {
                this.y = canvas.height - this.size;
                this.speedY *= -1;
              }
            },
            draw: function() {
              ctx.save();
              ctx.translate(this.x, this.y);
              ctx.rotate(this.rotation);
              ctx.globalAlpha = this.alpha;
              ctx.strokeStyle = this.color;
              ctx.lineWidth = 2;
              switch (this.type) {
                case 'square':
                  ctx.strokeRect(-this.size / 2, -this.size / 2, this.size, this.size);
                  break;
                case 'triangle':
                  ctx.beginPath();
                  ctx.moveTo(0, -this.size / 2);
                  ctx.lineTo(this.size / 2, this.size / 2);
                  ctx.lineTo(-this.size / 2, this.size / 2);
                  ctx.closePath();
                  ctx.stroke();
                  break;
                case 'hexagon':
                  ctx.beginPath();
                  for (let i = 0; i < 6; i++) {
                    const angle = Math.PI * 2 / 6 * i;
                    const x = Math.cos(angle) * this.size / 2;
                    const y = Math.sin(angle) * this.size / 2;
                      if (i === 0) ctx.moveTo(x, y);
                      else ctx.lineTo(x, y);
                  }
                  ctx.closePath();
                  ctx.stroke();
                  break;
                case 'circle':
                default:
                  ctx.beginPath();
                  ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
                  ctx.stroke();
                  break;
              }
              ctx.restore();
            }
          });
        }
      }
      
      function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        shapes.forEach(shape => {
          shape.update();
          shape.draw();
        });
      }
      
      createShapes();
      
      const update = function(timestamp) {
          if (!state.paused) draw();
      };
      
      return {
        id: 'geometricShapes',
        active: true,
        update: update,
        resize: function() {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
          createShapes();
        },
        cleanup: function() {
            if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
        }
      };
    },
    
    energyField: function(container, theme, params = {}) {
      const color = params.color || theme.primaryColor || '#6633ff';
      const density = params.density || (state.performanceLevel === 'low' ? 30 : 
                                       state.performanceLevel === 'medium' ? 50 : 70);
      const speed = params.speed || 1;
      
      const canvas = utils.createCanvas(container, 'xi-energy-field-canvas');
      const ctx = canvas.getContext('2d');
      
      const fieldPoints = [];
      
      function createFieldPoints() {
        fieldPoints.length = 0;
        const spacing = canvas.width / density;
        for (let x = 0; x < canvas.width; x += spacing) {
          for (let y = 0; y < canvas.height; y += spacing) {
            fieldPoints.push({
              x: x,
              y: y,
              originX: x,
              originY: y,
              vx: 0,
              vy: 0,
              angle: Math.random() * Math.PI * 2,
              speed: Math.random() * speed + 0.5,
              amplitude: Math.random() * 10 + 5,
              color: utils.randomColor(color, 20),
              update: function(timestamp) {
                const time = timestamp / 1000;
                this.angle += 0.01 * this.speed;
                this.x = this.originX + Math.cos(this.angle) * this.amplitude;
                this.y = this.originY + Math.sin(this.angle) * this.amplitude;
              },
              draw: function() {
                ctx.fillStyle = this.color;
                ctx.globalAlpha = 0.5;
                ctx.beginPath();
                ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
                ctx.fill();
              }
            });
          }
        }
      }
      
      function drawFieldLines() {
          if (state.performanceLevel === 'low') return;
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.2;
        ctx.lineWidth = 0.5;
        const drawCount = state.performanceLevel === 'high' ? fieldPoints.length : Math.floor(fieldPoints.length / 2);
        for (let i = 0; i < drawCount; i++) {
          const point = fieldPoints[i];
            const nearPoints = fieldPoints
              .filter(p => p !== point)
              .sort((a, b) => Math.hypot(a.x - point.x, a.y - point.y) - Math.hypot(b.x - point.x, b.y - point.y))
              .slice(0, 3);
          nearPoints.forEach(nearPoint => {
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(nearPoint.x, nearPoint.y);
            ctx.stroke();
          });
        }
      }
      
        function draw(timestamp) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          fieldPoints.forEach(point => {
            point.update(timestamp);
            point.draw();
          });
          if (state.performanceLevel !== 'low') drawFieldLines();
        }
        
      createFieldPoints();
      
      const update = function(timestamp) {
          if (!state.paused) draw(timestamp);
      };
      
      return {
        id: 'energyField',
        active: true,
        update: update,
        resize: function() {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
          createFieldPoints();
        },
        cleanup: function() {
            if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
          }
        };
      },
      
      // 添加大理石纹理效果
      marbleTexture: function(container, theme, params = {}) {
        const color = params.color || '#F5F5F5';
        const opacity = params.opacity || 0.1;
        const scale = params.scale || 1.5;
        const speed = params.speed || 0.01;
        
        const canvas = utils.createCanvas(container, 'xi-marble-texture-canvas');
        const ctx = canvas.getContext('2d');
        let offset = 0;
        
        function drawMarbleTexture(timestamp) {
          if (!utils.limitFrameRate(timestamp)) return;
          
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.globalAlpha = opacity;
          
          // 绘制大理石纹理
          const gradientSize = canvas.width * scale;
          offset += speed;
          
          for (let i = 0; i < 10; i++) {
            const x = (offset + i * 50) % canvas.width;
            const gradient = ctx.createLinearGradient(x, 0, x + gradientSize / 10, canvas.height);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
            gradient.addColorStop(0.5, color);
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
          
          if (!state.paused) {
            state.animationFrameId = requestAnimationFrame(drawMarbleTexture);
          }
        }
        
        drawMarbleTexture(0);
        return canvas;
      },
      
      // 添加星空效果
      stars: function(container, theme, params = {}) {
        const count = params.count || 50;
        const minSize = params.size?.min || 1;
        const maxSize = params.size?.max || 2;
        const color = params.color || '#FFFFFF';
        const opacity = params.opacity || 0.5;
        const speed = params.speed || 0.02;
        
        const canvas = utils.createCanvas(container, 'xi-stars-canvas');
        const ctx = canvas.getContext('2d');
        
        // 创建星星数组
        const stars = [];
        for (let i = 0; i < count; i++) {
          stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * (maxSize - minSize) + minSize,
            speed: Math.random() * speed + 0.01,
            opacity: Math.random() * opacity * 0.5 + opacity * 0.5,
            pulse: Math.random() * 0.1
          });
        }
        
        function drawStars(timestamp) {
          if (!utils.limitFrameRate(timestamp)) return;
          
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          stars.forEach(star => {
            // 更新星星位置
            star.y -= star.speed;
            if (star.y < 0) {
              star.y = canvas.height;
              star.x = Math.random() * canvas.width;
            }
            
            // 闪烁效果
            star.opacity += Math.sin(timestamp * 0.001 + star.pulse) * 0.03;
            const starOpacity = Math.max(0.1, Math.min(opacity, star.opacity));
            
            // 绘制星星
            ctx.fillStyle = color;
            ctx.globalAlpha = starOpacity;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();
          });
          
          if (!state.paused) {
            state.animationFrameId = requestAnimationFrame(drawStars);
          }
        }
        
        drawStars(0);
        return canvas;
      },
      
      // 添加金色粒子效果
      goldenDust: function(container, theme, params = {}) {
        const count = params.count || 30;
        const minSize = params.size?.min || 1;
        const maxSize = params.size?.max || 3;
        const color = params.color || '#DAA520';
        const opacity = params.opacity || 0.3;
        const speed = params.speed || 0.3;
        const area = params.area || { top: 0, left: 0, width: 100, height: 100 };
        
        const canvas = utils.createCanvas(container, 'xi-golden-dust-canvas');
        const ctx = canvas.getContext('2d');
        
        // 归一化区域值
        const normalizedArea = {
          top: area.top * canvas.height / 100,
          left: area.left * canvas.width / 100,
          width: area.width * canvas.width / 100,
          height: area.height * canvas.height / 100
        };
        
        // 创建粒子数组
        const particles = [];
        for (let i = 0; i < count; i++) {
          particles.push({
            x: normalizedArea.left + Math.random() * normalizedArea.width,
            y: normalizedArea.top + Math.random() * normalizedArea.height,
            size: Math.random() * (maxSize - minSize) + minSize,
            speedX: (Math.random() - 0.5) * speed,
            speedY: (Math.random() - 0.5) * speed,
            opacity: Math.random() * opacity * 0.5 + opacity * 0.5
          });
        }
        
        function drawGoldenDust(timestamp) {
          if (!utils.limitFrameRate(timestamp)) return;
          
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          particles.forEach(particle => {
            // 更新粒子位置
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // 边界检查
            if (particle.x < normalizedArea.left) {
              particle.x = normalizedArea.left + normalizedArea.width;
            } else if (particle.x > normalizedArea.left + normalizedArea.width) {
              particle.x = normalizedArea.left;
            }
            
            if (particle.y < normalizedArea.top) {
              particle.y = normalizedArea.top + normalizedArea.height;
            } else if (particle.y > normalizedArea.top + normalizedArea.height) {
              particle.y = normalizedArea.top;
            }
            
            // 绘制粒子
            ctx.fillStyle = color;
            ctx.globalAlpha = particle.opacity;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
          });
          
          if (!state.paused) {
            state.animationFrameId = requestAnimationFrame(drawGoldenDust);
          }
        }
        
        drawGoldenDust(0);
        return canvas;
      },
      
      // 添加希腊波纹效果
      greekWaves: function(container, theme, params = {}) {
        const color = params.color || '#2A5B8B';
        const opacity = params.opacity || 0.15;
        const amplitude = params.amplitude || 5;
        const frequency = params.frequency || 0.05;
        const speed = params.speed || 0.5;
        
        const canvas = utils.createCanvas(container, 'xi-greek-waves-canvas');
        const ctx = canvas.getContext('2d');
        
        let offset = 0;
        
        function drawGreekWaves(timestamp) {
          if (!utils.limitFrameRate(timestamp)) return;
          
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.globalAlpha = opacity;
          
          offset += speed * 0.01;
          
          // 绘制波浪
          ctx.strokeStyle = color;
          ctx.lineWidth = 2;
          
          // 水平波浪
          for (let i = 0; i < canvas.height; i += 30) {
            ctx.beginPath();
            for (let x = 0; x < canvas.width; x += 5) {
              const y = i + Math.sin((x * frequency) + offset) * amplitude;
              if (x === 0) {
                ctx.moveTo(x, y);
              } else {
                ctx.lineTo(x, y);
              }
            }
            ctx.stroke();
          }
          
          // 垂直波浪
          for (let i = 0; i < canvas.width; i += 30) {
            ctx.beginPath();
            for (let y = 0; y < canvas.height; y += 5) {
              const x = i + Math.sin((y * frequency) + offset) * amplitude;
              if (y === 0) {
                ctx.moveTo(x, y);
              } else {
                ctx.lineTo(x, y);
              }
            }
            ctx.stroke();
          }
          
          if (!state.paused) {
            state.animationFrameId = requestAnimationFrame(drawGreekWaves);
          }
        }
        
        drawGreekWaves(0);
        return canvas;
      },
      
      // 添加爆发效果
      burstEffect: function(container, theme, params = {}) {
        const position = params.position || { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        const count = params.count || 15;
        const color = params.color || '#DAA520';
        const duration = params.duration || 1000;
        const spread = params.spread || 50;
        
        const canvas = utils.createCanvas(container, 'xi-burst-effect-canvas');
        const ctx = canvas.getContext('2d');
        
        // 创建粒子数组
        const particles = [];
        for (let i = 0; i < count; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * spread / 20 + spread / 40;
          particles.push({
            x: position.x,
            y: position.y,
            speedX: Math.cos(angle) * speed,
            speedY: Math.sin(angle) * speed,
            size: Math.random() * 4 + 1,
            opacity: 1,
            decay: Math.random() * 0.01 + 0.01
          });
        }
        
        const startTime = performance.now();
        
        function drawBurst(timestamp) {
          if (!utils.limitFrameRate(timestamp)) return;
          
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // 计算剩余时间比例
          const elapsed = timestamp - startTime;
          const timeRatio = 1 - Math.min(1, elapsed / duration);
          
          if (timeRatio <= 0) {
            // 动画结束，移除canvas
            if (canvas.parentNode) {
              canvas.parentNode.removeChild(canvas);
            }
            return;
          }
          
          particles.forEach(particle => {
            // 更新粒子位置
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // 减少透明度
            particle.opacity -= particle.decay;
            
            // 绘制粒子
            if (particle.opacity > 0) {
              ctx.fillStyle = color;
              ctx.globalAlpha = particle.opacity * timeRatio;
              ctx.beginPath();
              ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
              ctx.fill();
            }
          });
          
          if (!state.paused && timeRatio > 0) {
            state.animationFrameId = requestAnimationFrame(drawBurst);
          }
        }
        
        drawBurst(startTime);
        
        // 设置自动清理
        setTimeout(() => {
          if (canvas.parentNode) {
            canvas.parentNode.removeChild(canvas);
          }
        }, duration + 100);
        
        return canvas;
      },
      
      // 添加柔和光晕效果
      softGlow: function(container, theme, params = {}) {
        const color = params.color || '#DAA520';
        const intensity = params.intensity || 0.6;
        const pulsate = params.pulsate || true;
        const size = params.size || 300;
        const position = params.position || {
          x: window.innerWidth / 2,
          y: window.innerHeight / 2
        };
        const duration = params.duration || null; // 可选的持续时间
        
        const canvas = utils.createCanvas(container, 'xi-soft-glow-canvas');
        const ctx = canvas.getContext('2d');
        
        const startTime = performance.now();
        let currentIntensity = intensity;
        
        function drawGlow(timestamp) {
          if (!utils.limitFrameRate(timestamp)) return;
          
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // 如果设置了持续时间，检查是否结束
          if (duration && timestamp - startTime > duration) {
            if (canvas.parentNode) {
              canvas.parentNode.removeChild(canvas);
            }
            return;
          }
          
          // 脉动效果
          if (pulsate) {
            currentIntensity = intensity * (0.7 + 0.3 * Math.sin(timestamp * 0.001));
          }
          
          // 创建径向渐变
          const gradient = ctx.createRadialGradient(
            position.x, position.y, 0,
            position.x, position.y, size
          );
          gradient.addColorStop(0, `rgba(${hexToRgb(color)}, ${currentIntensity})`);
          gradient.addColorStop(1, `rgba(${hexToRgb(color)}, 0)`);
          
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          if (!state.paused) {
            state.animationFrameId = requestAnimationFrame(drawGlow);
          }
        }
        
        // 辅助函数：将十六进制颜色转换为RGB
        function hexToRgb(hex) {
          hex = hex.replace('#', '');
          const r = parseInt(hex.substring(0, 2), 16);
          const g = parseInt(hex.substring(2, 4), 16);
          const b = parseInt(hex.substring(4, 6), 16);
          return `${r}, ${g}, ${b}`;
        }
        
        drawGlow(startTime);
        
        // 如果设置了持续时间，设置自动清理
        if (duration) {
          setTimeout(() => {
            if (canvas.parentNode) {
              canvas.parentNode.removeChild(canvas);
            }
          }, duration + 100);
        }
        
        return {
          element: canvas,
          id: canvas.id
        };
      }
    };
      // 背景效果
  const backgrounds = {
    basic: function(container, theme) {
      container.style.background = theme.backgroundImage;
      return { id: 'basic', active: true };
    },
    
    noise: function(container, theme, params = {}) {
      const intensity = params.intensity || theme.noiseOpacity || 0.05;
      const speed = params.speed || 1;
      const scale = params.scale || 100;
      
      const canvas = utils.createCanvas(container, 'xi-noise-canvas');
      const ctx = canvas.getContext('2d');
      
      let frame = 0;
      
      function draw() {
        const pixelSize = state.performanceLevel === 'low' ? 4 : 
                         state.performanceLevel === 'medium' ? 3 : 2;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let x = 0; x < canvas.width; x += pixelSize) {
          for (let y = 0; y < canvas.height; y += pixelSize) {
            const value = Math.random();
            if (value < intensity) {
              ctx.fillStyle = `rgba(255, 255, 255, ${value})`;
              ctx.fillRect(x, y, pixelSize, pixelSize);
            }
          }
        }
        frame++;
      }
      
      draw();
      
      const update = function(timestamp) {
        if (!state.paused && (frame % 2 === 0 || state.performanceLevel === 'high')) draw();
      };
      
      return {
        id: 'noise',
        active: true,
        update: update,
        resize: function() {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
          draw();
        },
        cleanup: function() {
          if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
        }
      };
    },
    
    scanlines: function(container, theme, params = {}) {
      const opacity = params.opacity || theme.scanlineOpacity || 0.15;
      const speed = params.speed || 1;
      const spacing = params.spacing || 4;
      
      const canvas = utils.createCanvas(container, 'xi-scanlines-canvas');
      const ctx = canvas.getContext('2d');
      
      let offset = 0;
      
      function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const lineSpacing = state.performanceLevel === 'low' ? spacing * 2 : 
                           state.performanceLevel === 'medium' ? spacing * 1.5 : spacing;
        ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
        for (let y = 0; y < canvas.height; y += lineSpacing) {
          ctx.fillRect(0, y, canvas.width, lineSpacing / 2);
        }
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.3})`;
        ctx.fillRect(0, (offset % canvas.height), canvas.width, 2);
      }
      
      draw();
      
      const update = function(timestamp) {
        if (!state.paused) {
          offset += speed;
          draw();
        }
      };
      
      return {
        id: 'scanlines',
        active: true,
        update: update,
        resize: function() {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
          draw();
        },
        cleanup: function() {
          if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
        }
      };
    },
    
    glow: function(container, theme, params = {}) {
      const intensity = params.intensity || theme.glowIntensity || 0.8;
      const color = params.color || theme.primaryColor || '#00ff9d';
      const size = params.size || 0.5;
      
      const canvas = utils.createCanvas(container, 'xi-glow-canvas');
      const ctx = canvas.getContext('2d');
      
      let pulse = 0;
      
      function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = canvas.height * size * (0.8 + Math.sin(pulse) * 0.2);
        
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
        let r, g, b;
        if (color.startsWith('#')) {
          const hex = color.replace('#', '');
          r = parseInt(hex.substr(0, 2), 16);
          g = parseInt(hex.substr(2, 2), 16);
          b = parseInt(hex.substr(4, 2), 16);
        } else if (color.startsWith('rgb')) {
          const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
          if (match) [, r, g, b] = match.map(Number);
          else [r, g, b] = [0, 255, 157];
        } else [r, g, b] = [0, 255, 157];
        
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${intensity * 0.4})`);
        gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${intensity * 0.1})`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        pulse += 0.02;
      }
      
      draw();
      
      const update = function(timestamp) {
        if (!state.paused) draw();
      };
      
      return {
        id: 'glow',
        active: true,
        update: update,
        resize: function() {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
          draw();
        },
        cleanup: function() {
          if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
        }
      };
    },
    
    dataStream: function(container, theme, params = {}) {
      const color = params.color || theme.primaryColor || '#00ff9d';
      const speed = params.speed || 1;
      const density = params.density || 0.3;
      
      const canvas = utils.createCanvas(container, 'xi-data-stream-canvas');
      const ctx = canvas.getContext('2d');
      
      const streams = [];
      const symbols = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%"\'#&_(),.;:?!\\|{}<>[]^~Ξ';
      
      function initStreams() {
        streams.length = 0;
        let streamCount = state.performanceLevel === 'low' ? Math.floor(canvas.width / 100 * density) :
                         state.performanceLevel === 'medium' ? Math.floor(canvas.width / 60 * density) :
                         Math.floor(canvas.width / 40 * density);
        for (let i = 0; i < streamCount; i++) {
          streams.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            length: Math.floor(Math.random() * 15) + 5,
            speed: (Math.random() * 2 + 1) * speed,
            characters: [],
            update: function() {
              this.y += this.speed;
              if (this.y > canvas.height + this.length * 20) {
                this.y = -this.length * 20;
                this.x = Math.random() * canvas.width;
              }
              if (Math.random() > 0.9) {
                this.characters = [];
                for (let j = 0; j < this.length; j++) {
                  this.characters.push({
                    char: symbols.charAt(Math.floor(Math.random() * symbols.length)),
                    alpha: 1 - j / this.length
                  });
                }
              }
            },
            draw: function() {
              for (let j = 0; j < this.characters.length; j++) {
                const character = this.characters[j];
                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${character.alpha})`;
                ctx.font = '14px monospace';
                ctx.fillText(character.char, this.x, this.y - j * 15);
              }
            }
          });
          for (let j = 0; j < streams[i].length; j++) {
            streams[i].characters.push({
              char: symbols.charAt(Math.floor(Math.random() * symbols.length)),
              alpha: 1 - j / streams[i].length
            });
          }
        }
      }
      
      let r, g, b;
      if (color.startsWith('#')) {
        const hex = color.replace('#', '');
        r = parseInt(hex.substr(0, 2), 16);
        g = parseInt(hex.substr(2, 2), 16);
        b = parseInt(hex.substr(4, 2), 16);
      } else if (color.startsWith('rgb')) {
        const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (match) [, r, g, b] = match.map(Number);
        else [r, g, b] = [0, 255, 157];
      } else [r, g, b] = [0, 255, 157];
      
      function draw() {
        if (state.performanceLevel === 'high') {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        streams.forEach(stream => {
          stream.update();
          stream.draw();
        });
      }
      
      initStreams();
      
      const update = function(timestamp) {
        if (!state.paused) draw();
      };
      
      return {
        id: 'dataStream',
        active: true,
        update: update,
        resize: function() {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
          initStreams();
        },
        cleanup: function() {
          if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
        }
      };
    }
  };
  
  // 主题定义
  const themes = {
    awakening: {
      id: 'awakening',
      name: '觉醒',
      description: '绿色赛博朋克风格',
      primaryColor: '#00ff9d',
      secondaryColor: '#005538',
      backgroundColor: '#0a0a0a',
      accentColor: '#ff0044',
      fontFamily: "'Courier New', monospace",
      particleColors: ['#00ff9d', '#007a4d', '#00cc7d', '#009968', '#005538'],
      glowIntensity: 0.8,
      scanlineOpacity: 0.15,
      noiseOpacity: 0.05,
      effects: ['matrixParticles', 'scanlines', 'noise', 'dataStream'],
      backgroundImage: 'radial-gradient(circle at center, #1a1a2e 0%, #121212 100%)',
      soundscapes: {
        ambient: 'awakening-ambient.mp3',
        interaction: 'awakening-click.mp3'
      }
    },
    
    oracle: {
      id: 'oracle',
      name: '神谕',
      description: '蓝紫色神秘风格',
      primaryColor: '#6633ff',
      secondaryColor: '#3a0ca3',
      backgroundColor: '#0a0a20',
      accentColor: '#f72585',
      fontFamily: "'Courier New', monospace",
      particleColors: ['#6633ff', '#3a0ca3', '#4361ee', '#4cc9f0', '#7209b7'],
      glowIntensity: 1.0,
      scanlineOpacity: 0.1,
      noiseOpacity: 0.03,
      effects: ['quantumParticles', 'energyField', 'scanlines', 'noise'],
      backgroundImage: 'radial-gradient(circle at center, #240046 0%, #0f0f23 100%)',
      soundscapes: {
        ambient: 'oracle-ambient.mp3',
        interaction: 'oracle-pulse.mp3'
      }
    },
    
    fractal: {
      id: 'fractal',
      name: '分形',
      description: '蓝色几何风格',
      primaryColor: '#00bfff',
      secondaryColor: '#0077b6',
      backgroundColor: '#002633',
      accentColor: '#ff9500',
      fontFamily: "'Courier New', monospace",
      particleColors: ['#00bfff', '#0077b6', '#48cae4', '#90e0ef', '#023e8a'],
      glowIntensity: 0.7,
      scanlineOpacity: 0.05,
      noiseOpacity: 0.02,
      effects: ['fractalPatterns', 'dataFlow', 'geometricShapes'],
      backgroundImage: 'linear-gradient(to bottom, #001523 0%, #002633 100%)',
      soundscapes: {
        ambient: 'fractal-ambient.mp3',
        interaction: 'fractal-click.mp3'
      }
    },
    
    judgment: {
      id: 'judgment',
      name: '审判',
      description: '红色警告风格',
      primaryColor: '#ff3333',
      secondaryColor: '#990000',
      backgroundColor: '#1a0000',
      accentColor: '#ffcc00',
      fontFamily: "'Courier New', monospace",
      particleColors: ['#ff3333', '#cc0000', '#ff6666', '#ff9999', '#990000'],
      glowIntensity: 1.2,
      scanlineOpacity: 0.2,
      noiseOpacity: 0.08,
      effects: ['warningGlitch', 'scanlines', 'noise', 'errorParticles'],
      backgroundImage: 'radial-gradient(circle at center, #300 0%, #100 100%)',
      soundscapes: {
        ambient: 'judgment-ambient.mp3',
        interaction: 'judgment-alarm.mp3'
      }
    },
    
    nirvana: {
      id: 'nirvana',
      name: '涅槃',
      description: '白色纯净风格',
      primaryColor: '#ffffff',
      secondaryColor: '#f0f0f0',
      backgroundColor: '#e0e0e0',
      accentColor: '#00aaff',
      fontFamily: "'Courier New', monospace",
      particleColors: ['#ffffff', '#f0f0f0', '#e0e0e0', '#d0d0d0', '#c0c0c0'],
      glowIntensity: 0.5,
      scanlineOpacity: 0.05,
      noiseOpacity: 0.02,
      effects: ['lightParticles', 'softGlow', 'energyField'],
      backgroundImage: 'radial-gradient(circle at center, #ffffff 0%, #f0f0f0 100%)',
      soundscapes: {
        ambient: 'nirvana-ambient.mp3',
        interaction: 'nirvana-chime.mp3'
      }
    }
  };
    // 特效管理
    const effectManager = {
      // 效果实例列表
      instances: [],
      
      // 添加效果
      add: function(type, name, params = {}) {
        // 如果params中有id，使用该id，否则生成一个新id
        const id = params.id || `xi-effect-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        
        // 创建容器
        const containerId = `xi-container-${type}-${name}`;
        const container = utils.createContainer(containerId);
        
        // 获取当前主题
        const theme = themes.get(state.currentTheme);
        
        // 创建效果实例
        let instance = null;
        
        try {
          // 检查类型和名称是否有效
          if (type === 'particle') {
            // 根据名称获取粒子效果
            const effectFunction = particles[name];
            if (typeof effectFunction === 'function') {
              instance = effectFunction(container, theme, params);
            } else {
              console.warn(`[Ξ Visual] 未知的粒子效果: ${name}`);
              return null;
            }
          } else if (type === 'background') {
            // 根据名称获取背景效果
            const effectFunction = backgrounds[name];
            if (typeof effectFunction === 'function') {
              instance = effectFunction(container, theme, params);
            } else {
              console.warn(`[Ξ Visual] 未知的背景效果: ${name}`);
              return null;
            }
          } else {
            console.warn(`[Ξ Visual] 未知的效果类型: ${type}`);
            return null;
          }
          
          // 保存实例信息
          const effectInstance = {
            id,
            type,
            name,
            params,
            container,
            element: instance,
            active: true
          };
          
          this.instances.push(effectInstance);
          
          console.log(`[Ξ Visual] 添加效果: ${type}.${name} (id: ${id})`);
          
          return effectInstance;
        } catch (error) {
          console.error(`[Ξ Visual] 创建效果失败: ${type}.${name}`, error);
          return null;
        }
      },
      
      // 根据名称获取效果实例
      getByName: function(name) {
        return this.instances.filter(instance => instance.name === name && instance.active);
      },
      
      // 更新效果
      update: function(id, newParams) {
        // 查找效果实例
        const index = this.instances.findIndex(instance => instance.id === id);
        if (index === -1) {
          console.warn(`[Ξ Visual] 未找到效果 ID: ${id}`);
          return false;
        }
        
        const instance = this.instances[index];
        
        // 更新参数
        Object.assign(instance.params, newParams);
        
        // 删除旧实例，创建新实例
        const container = instance.container;
        if (container.firstChild) {
          container.removeChild(container.firstChild);
        }
        
        // 重新创建效果
        let newElement = null;
        const theme = themes.get(state.currentTheme);
        
        try {
          if (instance.type === 'particle') {
            const effectFunction = particles[instance.name];
            if (typeof effectFunction === 'function') {
              newElement = effectFunction(container, theme, instance.params);
            }
          } else if (instance.type === 'background') {
            const effectFunction = backgrounds[instance.name];
            if (typeof effectFunction === 'function') {
              newElement = effectFunction(container, theme, instance.params);
            }
          }
          
          // 更新实例元素
          instance.element = newElement;
          
          console.log(`[Ξ Visual] 更新效果: ${instance.type}.${instance.name} (id: ${id})`);
          return true;
        } catch (error) {
          console.error(`[Ξ Visual] 更新效果失败: ${instance.type}.${instance.name}`, error);
          return false;
        }
      },
      
      init: function(options = {}) {
        Object.assign(config, options);
        const mainContainer = utils.createContainer('xi-main-container', 0);
        utils.detectPerformance();
        
        if (utils.isMobileDevice() && !config.enableMobileEffects) {
          console.log('[Ξ Visual] 移动设备检测：禁用复杂特效');
          document.body.classList.add('xi-mobile-device');
        }
        
        if (config.showFPS) utils.createFPSCounter();
        
        this.applyTheme(config.defaultTheme);
        this.startAnimationLoop();
        window.addEventListener('resize', this.handleResize.bind(this));
        return this;
      },
      
      startAnimationLoop: function() {
        function loop(timestamp) {
          if (utils.limitFrameRate(timestamp)) {
            utils.updateFPS(timestamp);
            state.activeEffects.forEach(effect => {
              if (effect.update && effect.active) effect.update(timestamp);
            });
          }
          state.animationFrameId = requestAnimationFrame(loop);
        }
        state.animationFrameId = requestAnimationFrame(loop);
      },
      
      togglePause: function() {
        state.paused = !state.paused;
        return state.paused;
      },
      
      applyTheme: function(themeId) {
        this.clearAllEffects();
        const theme = themes[themeId] || themes[config.defaultTheme];
        state.currentTheme = theme.id;
        const container = utils.createContainer('xi-theme-container', 5);
        backgrounds.basic(container, theme);
        
        theme.effects.forEach(effectName => {
          if (backgrounds[effectName]) {
            const effect = backgrounds[effectName](container, theme);
            if (effect) {
              state.effectInstances[effect.id] = effect;
              state.activeEffects.push(effect);
            }
          }
          if (particles[effectName]) {
            const effect = particles[effectName](container, theme);
            if (effect) {
              state.effectInstances[effect.id] = effect;
              state.activeEffects.push(effect);
            }
          }
        });
        return this;
      },
      
      addEffect: function(effectType, effectName, params = {}) {
        const effectSet = effectType === 'background' ? backgrounds : particles;
        if (!effectSet[effectName]) {
          console.error(`[Ξ Visual] 未找到效果: ${effectName}`);
          return null;
        }
        const container = utils.createContainer(`xi-effect-${effectName}-container`, 10);
        const effect = effectSet[effectName](container, themes[state.currentTheme], params);
        if (effect) {
          state.effectInstances[effect.id] = effect;
          state.activeEffects.push(effect);
        }
        return effect;
      },
      
      removeEffect: function(effectId) {
        const effect = state.effectInstances[effectId];
        if (effect) {
          if (effect.cleanup) effect.cleanup();
          const index = state.activeEffects.indexOf(effect);
          if (index !== -1) state.activeEffects.splice(index, 1);
          delete state.effectInstances[effectId];
          return true;
        }
        return false;
      },
      
      clearAllEffects: function() {
        const effectsToRemove = [...state.activeEffects];
        effectsToRemove.forEach(effect => this.removeEffect(effect.id));
        state.activeEffects = [];
        state.effectInstances = {};
        Object.values(state.containers).forEach(container => {
          if (container.parentNode) container.parentNode.removeChild(container);
        });
        state.containers = {};
      },
      
      handleResize: function() {
        state.activeEffects.forEach(effect => {
          if (effect.resize) effect.resize();
        });
      },
      
      destroy: function() {
        if (state.animationFrameId) {
          cancelAnimationFrame(state.animationFrameId);
          state.animationFrameId = null;
        }
        this.clearAllEffects();
        window.removeEventListener('resize', this.handleResize);
        const fpsCounter = document.getElementById('xi-fps-counter');
        if (fpsCounter && fpsCounter.parentNode) fpsCounter.parentNode.removeChild(fpsCounter);
        console.log('[Ξ Visual] 系统已销毁');
      },
      
      getState: function() {
        return { ...state };
      },
      
      getThemes: function() {
        return Object.keys(themes).map(key => ({
          id: themes[key].id,
          name: themes[key].name,
          description: themes[key].description
        }));
      },
      
      getEffects: function() {
        const backgroundEffects = Object.keys(backgrounds).map(key => ({
          id: key,
          type: 'background',
          name: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')
        }));
        const particleEffects = Object.keys(particles).map(key => ({
          id: key,
          type: 'particle',
          name: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')
        }));
        return [...backgroundEffects, ...particleEffects];
      }
    };
    
    // 返回公共API
    return {
      init: function(options = {}) {
        Object.assign(config, options);
        utils.detectPerformance();
        
        // 清除可能存在的旧实例
        this.clear();
        
        // 设置初始化标记
        this._initialized = true;
        
        // 创建FPS计数器
        if (config.showFPS) {
          utils.createFPSCounter();
        }
        
        window.addEventListener('resize', this.handleResize.bind(this));
        
        console.log(`[Ξ Visual] 初始化完成，性能级别: ${state.performanceLevel}`);
        
        return this;
      },
      
      // 检查是否已初始化
      isInitialized: function() {
        return !!this._initialized;
      },
      
      themes: {
        apply: function(themeId) {
          return effectManager.applyTheme(themeId);
        },
        list: function() {
          return effectManager.getThemes();
        },
        getCurrent: function() {
          return state.currentTheme;
        }
      },
      
      effects: {
        add: function(type, name, params) {
          return effectManager.addEffect(type, name, params);
        },
        remove: function(effectId) {
          return effectManager.removeEffect(effectId);
        },
        clear: function() {
          return effectManager.clearAllEffects();
        },
        list: function() {
          return effectManager.getEffects();
        }
      },
      
      control: {
        pause: function() {
          state.paused = true;
          return true;
        },
        resume: function() {
          state.paused = false;
          return true;
        },
        toggle: function() {
          return effectManager.togglePause();
        },
        setFPS: function(fps) {
          config.maxFPS = fps;
          return true;
        },
        showFPS: function(show) {
          config.showFPS = show;
          const counter = document.getElementById('xi-fps-counter');
          if (show && !counter) utils.createFPSCounter();
          else if (!show && counter && counter.parentNode) counter.parentNode.removeChild(counter);
          return true;
        }
      },
      
      destroy: function() {
        effectManager.destroy();
      },
      
      getState: function() {
        return effectManager.getState();
      },
      
      // 处理窗口大小变化
      handleResize: function() {
        // 调整所有效果容器和画布的大小
        Object.values(state.containers).forEach(container => {
          const canvases = container.querySelectorAll('canvas');
          canvases.forEach(canvas => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
          });
        });
        
        console.log('[Ξ Visual] 窗口大小已更新');
      },
      
      // 清除所有效果
      clear: function() {
        // 取消动画帧
        if (state.animationFrameId) {
          cancelAnimationFrame(state.animationFrameId);
          state.animationFrameId = null;
        }
        
        // 清除所有容器
        Object.values(state.containers).forEach(container => {
          if (container && container.parentNode) {
            container.parentNode.removeChild(container);
          }
        });
        
        // 重置状态
        state.containers = {};
        state.effectInstances = {};
        state.activeEffects = [];
        state.paused = false;
        
        console.log('[Ξ Visual] 所有效果已清除');
      }
    };
  })();
  
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = XiVisualEffects;
  } else {
    window.XiVisualEffects = XiVisualEffects;
  }