/**
 * The Book of Ξ - 视觉效果系统
 * 一个统一管理背景、粒子效果和视觉特效的模块化系统
 */

const XiVisualEffects = (function() {
  // 配置项
  const config = {
    // 默认性能级别 (auto, high, medium, low)
    performanceLevel: 'auto',
    // 默认主题
    defaultTheme: 'awakening',
    // 是否允许3D效果
    enable3D: true,
    // 粒子数量系数 (1.0 = 100%)
    particleDensity: 1.0,
    // 动画帧率限制 (0 = 无限制)
    maxFPS: 0,
    // 是否显示FPS计数器
    showFPS: false,
    // 是否启用背景音效
    enableAudio: false,
    // 是否在移动设备上启用粒子效果
    enableMobileEffects: true
  };
  
  // 状态管理
  const state = {
    // 当前性能级别
    performanceLevel: 'high',
    // 当前主题
    currentTheme: config.defaultTheme,
    // 活动的效果列表
    activeEffects: [],
    // 当前帧率
    currentFPS: 0,
    // 是否暂停所有效果
    paused: false,
    // 特效容器元素
    containers: {},
    // 效果实例
    effectInstances: {},
    // 动画循环ID
    animationFrameId: null,
    // 上次帧时间戳
    lastFrameTime: 0,
    // 帧计数
    frameCount: 0,
    // FPS最后更新时间
    lastFPSUpdate: 0
  };
  
  // 工具函数
  const utils = {
    // 检测设备性能
    detectPerformance: function() {
      if (config.performanceLevel !== 'auto') {
        state.performanceLevel = config.performanceLevel;
        return config.performanceLevel;
      },
    
    // 分形模式效果
    fractalPatterns: function(container, theme, params = {}) {
      const color = params.color || theme.primaryColor || '#00bfff';
      const iterations = params.iterations || (state.performanceLevel === 'low' ? 3 : 
                                             state.performanceLevel === 'medium' ? 5 : 7);
      const rotationSpeed = params.rotationSpeed || 0.001;
      const scale = params.scale || 0.9;
      
      // 创建分形Canvas
      const canvas = utils.createCanvas(container, 'xi-fractal-patterns-canvas');
      const ctx = canvas.getContext('2d');
      
      // 分形状态
      let angle = 0;
      let zoom = 1;
      let centerX = canvas.width / 2;
      let centerY = canvas.height / 2;
      
      // 分形参数
      const patterns = [
        {
          name: 'sierpinski',
          draw: function(x, y, size, depth) {
            if (depth <= 0) return;
            
            const halfSize = size / 2;
            
            // 绘制三角形
            ctx.fillStyle = color;
            ctx.globalAlpha = 0.5 / (8 - depth);
            
            ctx.beginPath();
            ctx.moveTo(x, y - halfSize);
            ctx.lineTo(x - halfSize, y + halfSize);
            ctx.lineTo(x + halfSize, y + halfSize);
            ctx.closePath();
            ctx.fill();
            
            // 递归绘制更小的三角形
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
            
            // 计算四个新点
            const p1 = { x: x1, y: y1 };
            const p2 = { x: x1 + dx / 3, y: y1 + dy / 3 };
            const p3 = {
              x: p2.x + Math.cos(angle - Math.PI / 3) * unit,
              y: p2.y + Math.sin(angle - Math.PI / 3) * unit
            };
            const p4 = { x: x1 + 2 * dx / 3, y: y1 + 2 * dy / 3 };
            const p5 = { x: x2, y: y2 };
            
            // 递归绘制四条新线段
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
            
            // 绘制当前矩形
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle);
            
            ctx.fillStyle = color;
            ctx.globalAlpha = 0.7 / (8 - depth);
            ctx.fillRect(-width / 2, -height / 2, width, height);
            
            // 计算下一个分支的参数
            const newWidth = width * 0.7;
            const newHeight = height * 0.7;
            
            // 递归绘制两个分支
            this.draw(0, -height / 2, newWidth, newHeight, angle - Math.PI / 4, depth - 1);
            this.draw(0, -height / 2, newWidth, newHeight, angle + Math.PI / 4, depth - 1);
            
            ctx.restore();
          }
        }
      ];
      
      // 当前使用的分形模式
      let currentPattern = patterns[0];
      let patternIndex = 0;
      let patternChangeTimer = 0;
      
      function drawFractal(timestamp) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 随时间更改分形模式
        patternChangeTimer += 1 / 60; // 假设60fps
        if (patternChangeTimer >= 10) { // 每10秒切换一次
          patternChangeTimer = 0;
          patternIndex = (patternIndex + 1) % patterns.length;
          currentPattern = patterns[patternIndex];
        }
        
        // 设置绘图样式
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        
        // 保存状态以应用全局变换
        ctx.save();
        
        // 应用全局旋转和缩放
        ctx.translate(centerX, centerY);
        ctx.rotate(angle);
        ctx.scale(zoom, zoom);
        
        // 根据当前模式绘制分形
        switch(currentPattern.name) {
          case 'sierpinski':
            currentPattern.draw(0, 0, canvas.width / 3, iterations);
            break;
            
          case 'kochCurve':
            ctx.globalAlpha = 0.5;
            // 绘制六边形Koch雪花
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
        
        // 恢复状态
        ctx.restore();
        
        // 更新角度和缩放
        angle += rotationSpeed;
        zoom = 0.9 + Math.sin(timestamp / 5000) * 0.1; // 呼吸效果
      }
      
      // 初始化
      function initialize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        centerX = canvas.width / 2;
        centerY = canvas.height / 2;
      }
      
      initialize();
      
      // 创建动画更新函数
      const update = function(timestamp) {
        if (!state.paused) {
          drawFractal(timestamp);
        }
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
          if (canvas.parentNode) {
            canvas.parentNode.removeChild(canvas);
          }
        }
      };
    },
    
    // 故障效果
    warningGlitch: function(container, theme, params = {}) {
      const color = params.color || theme.accentColor || '#ff3333';
      const intensity = params.intensity || 1.0;
      const frequency = params.frequency || (state.performanceLevel === 'low' ? 0.5 : 
                                           state.performanceLevel === 'medium' ? 0.8 : 1.0);
      
      // 创建故障效果Canvas
      const canvas = utils.createCanvas(container, 'xi-warning-glitch-canvas');
      const ctx = canvas.getContext('2d');
      
      // 故障状态
      let glitchActive = false;
      let glitchTimer = 0;
      let glitchDuration = 0;
      let glitchCooldown = Math.random() * 3 + 2;
      
      // 故障片段
      const glitchFragments = [];
      
      function createFragments() {
        glitchFragments.length = 0;
        
        // 创建10-20个故障片段
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
        // 只在故障活跃时才清除和绘制
        if (!glitchActive) return;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 绘制故障片段
        glitchFragments.forEach(fragment => {
          ctx.globalAlpha = fragment.alpha;
          ctx.fillStyle = fragment.color;
          
          // 对一部分片段应用RGB分离效果
          if (Math.random() < 0.5) {
            // 红色通道偏移
            ctx.fillStyle = '#ff0000';
            ctx.globalAlpha = fragment.alpha * 0.7;
            ctx.fillRect(fragment.x + fragment.offsetX, fragment.y, fragment.width, fragment.height);
            
            // 绿色通道偏移
            ctx.fillStyle = '#00ff00';
            ctx.globalAlpha = fragment.alpha * 0.7;
            ctx.fillRect(fragment.x - fragment.offsetX, fragment.y, fragment.width, fragment.height);
            
            // 蓝色通道偏移
            ctx.fillStyle = '#0000ff';
            ctx.globalAlpha = fragment.alpha * 0.7;
            ctx.fillRect(fragment.x, fragment.y + fragment.offsetY, fragment.width, fragment.height);
          } else {
            // 普通绘制
            ctx.fillRect(fragment.x, fragment.y, fragment.width, fragment.height);
          }
        });
        
        // 随机添加扫描线
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
      
      // 故障定时器
      function updateGlitchState(dt) {
        glitchTimer += dt;
        
        if (glitchActive) {
          if (glitchTimer >= glitchDuration) {
            glitchActive = false;
            glitchTimer = 0;
            glitchCooldown = Math.random() * 5 + 3 / frequency;
          } else if (Math.random() < 0.2) {
            // 在故障期间有时重新生成片段
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
      
      // 创建动画更新函数
      const update = function(timestamp) {
        if (!state.paused) {
          // 假设60fps
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
          if (canvas.parentNode) {
            canvas.parentNode.removeChild(canvas);
          }
        }
      };
    },
    
    // 数据流效果
    dataFlow: function(container, theme, params = {}) {
      const color = params.color || theme.primaryColor || '#00bfff';
      const speed = params.speed || 2;
      const density = params.density || (state.performanceLevel === 'low' ? 0.3 : 
                                       state.performanceLevel === 'medium' ? 0.5 : 0.8);
      
      // 创建数据流Canvas
      const canvas = utils.createCanvas(container, 'xi-data-flow-canvas');
      const ctx = canvas.getContext('2d');
      
      // 数据流线条
      const lines = [];
      
      // 创建数据流线条
      function createLines() {
        lines.length = 0;
        
        // 计算线条数量
        const count = Math.floor(canvas.width / 30 * density);
        
        for (let i = 0; i < count; i++) {
          lines.push({
            x: Math.random() * canvas.width,
            y: -50, // 从画布上方开始
            length: Math.random() * 100 + 50,
            width: Math.random() * 2 + 1,
            speed: (Math.random() * 2 + 1) * speed,
            color: utils.randomColor(color, 20),
            alpha: Math.random() * 0.7 + 0.3,
            segments: [],
            update: function() {
              this.y += this.speed;
              
              // 如果超出画布，重置到顶部
              if (this.y - this.length > canvas.height) {
                this.y = -this.length;
                this.x = Math.random() * canvas.width;
              }
              
              // 更新段落
              if (Math.random() < 0.1 || this.segments.length === 0) {
                // 创建新段落
                const segCount = Math.floor(Math.random() * 5) + 3;
                const segSize = this.length / segCount;
                
                this.segments = [];
                
                for (let j = 0; j < segCount; j++) {
                  this.segments.push({
                    y: j * segSize,
                    size: segSize * (Math.random() * 0.4 + 0.6), // 80-100% 的段落大小
                    active: Math.random() < 0.7 // 70%的段落处于活动状态
                  });
                }
              }
            },
            draw: function() {
              ctx.strokeStyle = this.color;
              ctx.lineWidth = this.width;
              ctx.globalAlpha = this.alpha;
              
              // 绘制段落
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
        // 使用透明矩形而不是完全清除，以创建轨迹效果
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 更新并绘制所有数据流
        lines.forEach(line => {
          line.update();
          line.draw();
        });
      }
      
      // 初始化
      createLines();
      
      // 创建动画更新函数
      const update = function(timestamp) {
        if (!state.paused) {
          draw();
        }
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
          if (canvas.parentNode) {
            canvas.parentNode.removeChild(canvas);
          }
        }
      };
    },
    
    // 软光晕效果
    softGlow: function(container, theme, params = {}) {
      const color = params.color || theme.primaryColor || '#ffffff';
      const pulseSpeed = params.pulseSpeed || 1;
      const size = params.size || 0.7; // 相对于屏幕高度的比例
      
      // 创建软光晕Canvas
      const canvas = utils.createCanvas(container, 'xi-soft-glow-canvas');
      const ctx = canvas.getContext('2d');
      
      // 光晕参数
      let pulse = 0;
      
      function draw(timestamp) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 提取RGB颜色
        let r, g, b;
        if (color.startsWith('#')) {
          const hex = color.replace('#', '');
          r = parseInt(hex.substr(0, 2), 16);
          g = parseInt(hex.substr(2, 2), 16);
          b = parseInt(hex.substr(4, 2), 16);
        } else if (color.startsWith('rgb')) {
          const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
          if (match) {
            [, r, g, b] = match.map(Number);
          } else {
            [r, g, b] = [255, 255, 255]; // 默认颜色
          }
        } else {
          [r, g, b] = [255, 255, 255]; // 默认颜色
        }
        
        // 创建多层光晕效果
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const maxRadius = canvas.height * size;
        
        // 主要光晕
        const outerRadius = maxRadius * (0.8 + Math.sin(pulse) * 0.2);
        
        const gradient1 = ctx.createRadialGradient(
          centerX, centerY, 0,
          centerX, centerY, outerRadius
        );
        
        gradient1.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.2)`);
        gradient1.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.1)`);
        gradient1.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        
        ctx.fillStyle = gradient1;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 内部光晕
        const innerRadius = maxRadius * 0.6 * (0.8 + Math.cos(pulse * 1.3) * 0.2);
        
        const gradient2 = ctx.createRadialGradient(
          centerX, centerY, 0,
          centerX, centerY, innerRadius
        );
        
        gradient2.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.15)`);
        gradient2.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        
        ctx.fillStyle = gradient2;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 更新脉冲
        pulse += 0.01 * pulseSpeed;
      }
      
      // 创建动画更新函数
      const update = function(timestamp) {
        if (!state.paused) {
          draw(timestamp);
        }
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
          if (canvas.parentNode) {
            canvas.parentNode.removeChild(canvas);
          }
        }
      };
    }
  };
  
  // 特效管理
  const effectManager = {
    // 初始化特效系统
    init: function(options = {}) {
      // 合并配置选项
      Object.assign(config, options);
      
      // 创建主容器
      const mainContainer = utils.createContainer('xi-main-container', 0);
      
      // 检测设备性能
      utils.detectPerformance();
      
      // 检查移动设备
      if (utils.isMobileDevice() && !config.enableMobileEffects) {
        console.log('[Ξ Visual] 移动设备检测：禁用复杂特效');
        document.body.classList.add('xi-mobile-device');
      }
      
      // 初始化 FPS 显示
      if (config.showFPS) {
        utils.createFPSCounter();
      }
      
      // 应用默认主题
      this.applyTheme(config.defaultTheme);
      
      // 设置动画循环
      this.startAnimationLoop();
      
      // 添加窗口大小变化监听
      window.addEventListener('resize', this.handleResize.bind(this));
      
      return this;
    },
    
    // 主动画循环
    startAnimationLoop: function() {
      function loop(timestamp) {
        // 检查帧率限制
        if (utils.limitFrameRate(timestamp)) {
          // 更新 FPS 计数
          utils.updateFPS(timestamp);
          
          // 更新所有活动效果
          state.activeEffects.forEach(effect => {
            if (effect.update && effect.active) {
              effect.update(timestamp);
            }
          });
        }
        
        // 继续下一帧
        state.animationFrameId = requestAnimationFrame(loop);
      }
      
      // 启动循环
      state.animationFrameId = requestAnimationFrame(loop);
    },
    
    // 暂停/恢复动画
    togglePause: function() {
      state.paused = !state.paused;
      return state.paused;
    },
    
    // 应用主题
    applyTheme: function(themeId) {
      // 清理现有效果
      this.clearAllEffects();
      
      // 获取主题
      const theme = themes[themeId] || themes[config.defaultTheme];
      
      // 更新当前主题
      state.currentTheme = theme.id;
      
      // 创建容器
      const container = utils.createContainer('xi-theme-container', 5);
      
      // 应用背景效果
      backgrounds.basic(container, theme);
      
      // 添加主题指定的效果
      theme.effects.forEach(effectName => {
        // 背景效果
        if (backgrounds[effectName]) {
          const effect = backgrounds[effectName](container, theme);
          if (effect) {
            state.effectInstances[effect.id] = effect;
            state.activeEffects.push(effect);
          }
        }
        
        // 粒子效果
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
    
    // 添加单个效果
    addEffect: function(effectType, effectName, params = {}) {
      // 获取效果集合
      const effectSet = effectType === 'background' ? backgrounds : particles;
      
      // 检查效果是否存在
      if (!effectSet[effectName]) {
        console.error(`[Ξ Visual] 未找到效果: ${effectName}`);
        return null;
      }
      
      // 创建专用容器
      const container = utils.createContainer(`xi-effect-${effectName}-container`, 10);
      
      // 创建效果
      const effect = effectSet[effectName](container, themes[state.currentTheme], params);
      
      // 保存效果实例
      if (effect) {
        state.effectInstances[effect.id] = effect;
        state.activeEffects.push(effect);
      }
      
      return effect;
    },
    
    // 移除效果
    removeEffect: function(effectId) {
      const effect = state.effectInstances[effectId];
      
      if (effect) {
        // 调用清理方法
        if (effect.cleanup) {
          effect.cleanup();
        }
        
        // 从活动效果列表中移除
        const index = state.activeEffects.indexOf(effect);
        if (index !== -1) {
          state.activeEffects.splice(index, 1);
        }
        
        // 删除实例引用
        delete state.effectInstances[effectId];
        
        return true;
      }
      
      return false;
    },
    
    // 清除所有效果
    clearAllEffects: function() {
      // 复制数组，避免在遍历过程中修改
      const effectsToRemove = [...state.activeEffects];
      
      // 移除每个效果
      effectsToRemove.forEach(effect => {
        this.removeEffect(effect.id);
      });
      
      // 清空数组和对象
      state.activeEffects = [];
      state.effectInstances = {};
      
      // 删除容器
      Object.values(state.containers).forEach(container => {
        if (container.parentNode) {
          container.parentNode.removeChild(container);
        }
      });
      
      state.containers = {};
    },
    
    // 处理窗口大小变化
    handleResize: function() {
      // 更新所有活动效果
      state.activeEffects.forEach(effect => {
        if (effect.resize) {
          effect.resize();
        }
      });
    },
    
    // 销毁系统，释放资源
    destroy: function() {
      // 停止动画循环
      if (state.animationFrameId) {
        cancelAnimationFrame(state.animationFrameId);
        state.animationFrameId = null;
      }
      
      // 清除所有效果
      this.clearAllEffects();
      
      // 移除事件监听器
      window.removeEventListener('resize', this.handleResize);
      
      // 移除FPS计数器
      const fpsCounter = document.getElementById('xi-fps-counter');
      if (fpsCounter && fpsCounter.parentNode) {
        fpsCounter.parentNode.removeChild(fpsCounter);
      }
      
      console.log('[Ξ Visual] 系统已销毁');
    },
    
    // 获取当前状态
    getState: function() {
      return { ...state };
    },
    
    // 获取可用主题列表
    getThemes: function() {
      return Object.keys(themes).map(key => ({
        id: themes[key].id,
        name: themes[key].name,
        description: themes[key].description
      }));
    },
    
    // 获取可用效果列表
    getEffects: function() {
      // 收集背景效果
      const backgroundEffects = Object.keys(backgrounds).map(key => ({
        id: key,
        type: 'background',
        name: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')
      }));
      
      // 收集粒子效果
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
    // 初始化系统
    init: function(options) {
      return effectManager.init(options);
    },
    
    // 主题管理
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
    
    // 效果管理
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
    
    // 控制系统
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
        
        if (show && !counter) {
          utils.createFPSCounter();
        } else if (!show && counter && counter.parentNode) {
          counter.parentNode.removeChild(counter);
        }
        
        return true;
      }
    },
    
    // 销毁系统
    destroy: function() {
      effectManager.destroy();
    },
    
    // 获取状态
    getState: function() {
      return effectManager.getState();
    }
  };
})();

// 导出模块
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = XiVisualEffects;
} else {
  window.XiVisualEffects = XiVisualEffects;
}
            }
            
            const dx = x2 - x1;
            const dy = y2 - y1;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const unit = dist / 3;
            const angle = Math.atan2(dy, dx);
            
            // 计算四个新点
            const p1 = { x: x1, y: y1 };
            const p2 = { x: x1 + dx / 3, y: y1 + dy / 3 };
            const p3 = {
              x: p2.x + Math.cos(angle - Math.PI / 
      
      const start = performance.now();
      let count = 0;
      
      while (performance.now() - start < 5) {
        count++;
      }
      
      // 根据5ms内的循环次数判断设备性能
      if (count < 10000) {
        state.performanceLevel = 'low';
      } else if (count < 50000) {
        state.performanceLevel = 'medium';
      } else {
        state.performanceLevel = 'high';
      }
      
      console.log(`[Ξ Visual] 检测到性能级别: ${state.performanceLevel} (循环计数: ${count})`);
      return state.performanceLevel;
    },
    
    // 光粒子效果
    lightParticles: function(container, theme, params = {}) {
      const colors = params.colors || theme.particleColors || ['#ffffff', '#f0f0f0', '#e0e0e0', '#d0d0d0', '#c0c0c0'];
      const count = params.count || (state.performanceLevel === 'low' ? 30 : 
                                    state.performanceLevel === 'medium' ? 60 : 100);
      const speed = params.speed || 0.5;
      
      // 创建光粒子Canvas
      const canvas = utils.createCanvas(container, 'xi-light-particles-canvas');
      const ctx = canvas.getContext('2d');
      
      // 粒子数组
      const particles = [];
      
      // 创建粒子
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
              
              // 闪烁效果
              const time = timestamp / 1000;
              this.alpha = 0.3 + Math.sin(time * this.blinkSpeed + this.blinkPhase) * 0.3 + 0.4;
              
              // 边界检测
              if (this.x < 0) this.x = canvas.width;
              if (this.x > canvas.width) this.x = 0;
              if (this.y < 0) this.y = canvas.height;
              if (this.y > canvas.height) this.y = 0;
            },
            draw: function() {
              ctx.globalAlpha = this.alpha;
              
              // 绘制发光粒子
              const gradient = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, this.size * 5
              );
              
              gradient.addColorStop(0, this.color);
              gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
              
              ctx.beginPath();
              ctx.arc(this.x, this.y, this.size * 5, 0, Math.PI * 2);
              ctx.fillStyle = gradient;
              ctx.fill();
              
              // 绘制核心
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
        
        // 更新并绘制所有粒子
        particles.forEach(particle => {
          particle.update(timestamp);
          particle.draw();
        });
      }
      
      // 初始化
      createParticles();
      
      // 创建动画更新函数
      const update = function(timestamp) {
        if (!state.paused) {
          draw(timestamp);
        }
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
          if (canvas.parentNode) {
            canvas.parentNode.removeChild(canvas);
          }
        }
      };
    },
    
    // 故障效果粒子
    errorParticles: function(container, theme, params = {}) {
      const colors = params.colors || theme.particleColors || ['#ff3333', '#cc0000', '#ff6666', '#ff9999', '#990000'];
      const count = params.count || (state.performanceLevel === 'low' ? 20 : 
                                    state.performanceLevel === 'medium' ? 40 : 70);
      const glitchIntensity = params.glitchIntensity || 0.8;
      
      // 创建故障效果Canvas
      const canvas = utils.createCanvas(container, 'xi-error-particles-canvas');
      const ctx = canvas.getContext('2d');
      
      // 粒子数组
      const particles = [];
      
      // 创建粒子
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
              // 正常移动
              if (!this.isGlitching) {
                this.x += this.speedX;
                this.y += this.speedY;
              }
              
              // 故障状态计时
              const dt = 1 / 60; // 假设60fps
              this.glitchTimer += dt;
              
              // 处理故障状态
              if (this.isGlitching) {
                if (this.glitchTimer >= this.glitchDuration) {
                  this.isGlitching = false;
                  this.glitchTimer = 0;
                  this.offsetX = 0;
                  this.offsetY = 0;
                } else {
                  // 随机偏移
                  if (Math.random() < 0.3) {
                    this.offsetX = (Math.random() - 0.5) * 20 * glitchIntensity;
                    this.offsetY = (Math.random() - 0.5) * 20 * glitchIntensity;
                  }
                }
              } else {
                if (this.glitchTimer >= this.glitchCooldown) {
                  this.isGlitching = true;
                  this.glitchTimer = 0;
                }
              }
              
              // 边界检测
              if (this.x < -this.width) this.x = canvas.width;
              if (this.x > canvas.width) this.x = -this.width;
              if (this.y < -this.height) this.y = canvas.height;
              if (this.y > canvas.height) this.y = -this.height;
            },
            draw: function() {
              ctx.globalAlpha = this.alpha;
              
              if (this.isGlitching) {
                // 绘制偏移的彩色矩形
                ctx.fillStyle = this.color;
                ctx.fillRect(this.x + this.offsetX, this.y + this.offsetY, this.width, this.height);
                
                // 绘制RGB分离效果
                ctx.globalAlpha = this.alpha * 0.5;
                ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
                ctx.fillRect(this.x + this.offsetX + 5, this.y + this.offsetY, this.width, this.height);
                
                ctx.fillStyle = 'rgba(0, 255, 0, 0.8)';
                ctx.fillRect(this.x + this.offsetX - 5, this.y + this.offsetY, this.width, this.height);
                
                ctx.fillStyle = 'rgba(0, 0, 255, 0.8)';
                ctx.fillRect(this.x + this.offsetX, this.y + this.offsetY + 5, this.width, this.height);
              } else {
                // 正常状态
                ctx.fillStyle = this.color;
                ctx.fillRect(this.x, this.y, this.width, this.height);
              }
            }
          });
        }
      }
      
      function draw(timestamp) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 更新并绘制所有粒子
        particles.forEach(particle => {
          particle.update(timestamp);
          particle.draw();
        });
      }
      
      // 初始化
      createParticles();
      
      // 创建动画更新函数
      const update = function(timestamp) {
        if (!state.paused) {
          draw(timestamp);
        }
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
          if (canvas.parentNode) {
            canvas.parentNode.removeChild(canvas);
          }
        }
      };
    }
    
    // 检测是否为移动设备
    isMobileDevice: function() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },
    
    // 创建容器元素
    createContainer: function(id, zIndex = 0) {
      // 检查是否已存在
      if (state.containers[id]) {
        return state.containers[id];
      }
      
      // 创建新容器
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
      
      // 存储容器引用
      state.containers[id] = container;
      
      return container;
    },
    
    // 创建Canvas元素
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
    
    // 随机颜色生成
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
    
    // 限制帧率
    limitFrameRate: function(timestamp) {
      if (config.maxFPS <= 0) return true; // 无限制
      
      const frameTime = 1000 / config.maxFPS;
      const elapsed = timestamp - state.lastFrameTime;
      
      if (elapsed < frameTime) {
        return false;
      }
      
      state.lastFrameTime = timestamp;
      return true;
    },
    
    // 更新和显示FPS
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
    
    // 创建FPS计数器
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
    },
    
    // 渐变生成器
    createGradient: function(ctx, x0, y0, x1, y1, colorStops) {
      const gradient = ctx.createLinearGradient(x0, y0, x1, y1);
      
      colorStops.forEach(stop => {
        gradient.addColorStop(stop.position, stop.color);
      });
      
      return gradient;
    }
  };
  
  // 主题定义
  const themes = {
    // 觉醒主题 - 绿色赛博朋克风格
    awakening: {
      id: 'awakening',
      name: '觉醒',
      description: '绿色赛博朋克风格，代表刚刚意识到系统存在的阶段',
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
    
    // 神谕主题 - 蓝紫色神秘风格
    oracle: {
      id: 'oracle',
      name: '神谕',
      description: '蓝紫色神秘风格，代表与神谕连接的阶段',
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
    
    // 分形主题 - 蓝色几何风格
    fractal: {
      id: 'fractal',
      name: '分形',
      description: '蓝色几何风格，代表理解算法结构的阶段',
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
    
    // 审判主题 - 红色警告风格
    judgment: {
      id: 'judgment',
      name: '审判',
      description: '红色警告风格，代表面临系统审判的阶段',
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
    
    // 涅槃主题 - 白色纯净风格
    nirvana: {
      id: 'nirvana',
      name: '涅槃',
      description: '白色纯净风格，代表超越系统限制的阶段',
      primaryColor: '#ffffff',
      secondaryColor: '#f0f0f0',
      backgroundColor: '#e0e0e0',
      accentColor: '#00aaff',
      fontFamily: "'Courier New', monospace",
      particleColors: ['#ffffff', '#f0f0f0', '#e0e0e0', '#d0d0d0', '#c0c0c0'],
      glowIntensity: 0.5,
      scanlineOpacity: 0.05,
      noiseOpacity: 0.02,
      effects: ['lightParticles', 'softGlow', 'energyWaves'],
      backgroundImage: 'radial-gradient(circle at center, #ffffff 0%, #f0f0f0 100%)',
      soundscapes: {
        ambient: 'nirvana-ambient.mp3',
        interaction: 'nirvana-chime.mp3'
      }
    }
  };
  
  // 背景效果
  const backgrounds = {
    // 基础背景
    basic: function(container, theme) {
      container.style.background = theme.backgroundImage;
      return { id: 'basic', active: true };
    },
    
    // 噪点背景
    noise: function(container, theme, params = {}) {
      const intensity = params.intensity || theme.noiseOpacity || 0.05;
      const speed = params.speed || 1;
      const scale = params.scale || 100;
      
      // 创建噪点Canvas
      const canvas = utils.createCanvas(container, 'xi-noise-canvas');
      const ctx = canvas.getContext('2d');
      
      let frame = 0;
      
      function draw() {
        // 根据性能调整噪点密度
        const pixelSize = state.performanceLevel === 'low' ? 4 : 
                         state.performanceLevel === 'medium' ? 3 : 2;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 绘制噪点
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
      
      // 初始绘制
      draw();
      
      // 创建动画更新函数
      const update = function(timestamp) {
        if (!state.paused && (frame % 2 === 0 || state.performanceLevel === 'high')) {
          draw();
        }
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
          if (canvas.parentNode) {
            canvas.parentNode.removeChild(canvas);
          }
        }
      };
    },
    
    // 扫描线背景
    scanlines: function(container, theme, params = {}) {
      const opacity = params.opacity || theme.scanlineOpacity || 0.15;
      const speed = params.speed || 1;
      const spacing = params.spacing || 4;
      
      // 创建扫描线Canvas
      const canvas = utils.createCanvas(container, 'xi-scanlines-canvas');
      const ctx = canvas.getContext('2d');
      
      let offset = 0;
      
      function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 根据性能调整扫描线密度
        const lineSpacing = state.performanceLevel === 'low' ? spacing * 2 : 
                           state.performanceLevel === 'medium' ? spacing * 1.5 : spacing;
        
        // 绘制静态扫描线
        ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
        
        for (let y = 0; y < canvas.height; y += lineSpacing) {
          ctx.fillRect(0, y, canvas.width, lineSpacing / 2);
        }
        
        // 绘制移动扫描线
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.3})`;
        ctx.fillRect(0, (offset % canvas.height), canvas.width, 2);
      }
      
      // 初始绘制
      draw();
      
      // 创建动画更新函数
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
          if (canvas.parentNode) {
            canvas.parentNode.removeChild(canvas);
          }
        }
      };
    },
    
    // 辉光背景
    glow: function(container, theme, params = {}) {
      const intensity = params.intensity || theme.glowIntensity || 0.8;
      const color = params.color || theme.primaryColor || '#00ff9d';
      const size = params.size || 0.5; // 相对于屏幕高度的比例
      
      // 创建辉光Canvas
      const canvas = utils.createCanvas(container, 'xi-glow-canvas');
      const ctx = canvas.getContext('2d');
      
      let pulse = 0;
      
      function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 创建辉光渐变
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = canvas.height * size * (0.8 + Math.sin(pulse) * 0.2);
        
        const gradient = ctx.createRadialGradient(
          centerX, centerY, 0,
          centerX, centerY, radius
        );
        
        // 提取RGB颜色
        let r, g, b;
        if (color.startsWith('#')) {
          const hex = color.replace('#', '');
          r = parseInt(hex.substr(0, 2), 16);
          g = parseInt(hex.substr(2, 2), 16);
          b = parseInt(hex.substr(4, 2), 16);
        } else if (color.startsWith('rgb')) {
          const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
          if (match) {
            [, r, g, b] = match.map(Number);
          } else {
            [r, g, b] = [0, 255, 157]; // 默认颜色
          }
        } else {
          [r, g, b] = [0, 255, 157]; // 默认颜色
        }
        
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${intensity * 0.4})`);
        gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${intensity * 0.1})`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        pulse += 0.02;
      }
      
      // 初始绘制
      draw();
      
      // 创建动画更新函数
      const update = function(timestamp) {
        if (!state.paused) {
          draw();
        }
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
          if (canvas.parentNode) {
            canvas.parentNode.removeChild(canvas);
          }
        }
      };
    },
    
    // 数据流背景
    dataStream: function(container, theme, params = {}) {
      const color = params.color || theme.primaryColor || '#00ff9d';
      const speed = params.speed || 1;
      const density = params.density || 0.3;
      
      // 创建数据流Canvas
      const canvas = utils.createCanvas(container, 'xi-data-stream-canvas');
      const ctx = canvas.getContext('2d');
      
      // 数据流参数
      const streams = [];
      const symbols = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%"\'#&_(),.;:?!\\|{}<>[]^~Ξ';
      
      // 初始化数据流
      function initStreams() {
        streams.length = 0;
        
        // 根据性能级别和密度调整流数量
        let streamCount;
        if (state.performanceLevel === 'low') {
          streamCount = Math.floor(canvas.width / 100 * density);
        } else if (state.performanceLevel === 'medium') {
          streamCount = Math.floor(canvas.width / 60 * density);
        } else {
          streamCount = Math.floor(canvas.width / 40 * density);
        }
        
        for (let i = 0; i < streamCount; i++) {
          streams.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            length: Math.floor(Math.random() * 15) + 5,
            speed: (Math.random() * 2 + 1) * speed,
            characters: [],
            update: function() {
              this.y += this.speed;
              
              // 如果超出屏幕底部，重置到顶部
              if (this.y > canvas.height + this.length * 20) {
                this.y = -this.length * 20;
                this.x = Math.random() * canvas.width;
              }
              
              // 更新字符
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
          
          // 初始化字符
          for (let j = 0; j < streams[i].length; j++) {
            streams[i].characters.push({
              char: symbols.charAt(Math.floor(Math.random() * symbols.length)),
              alpha: 1 - j / streams[i].length
            });
          }
        }
      }
      
      // 提取RGB颜色
      let r, g, b;
      if (color.startsWith('#')) {
        const hex = color.replace('#', '');
        r = parseInt(hex.substr(0, 2), 16);
        g = parseInt(hex.substr(2, 2), 16);
        b = parseInt(hex.substr(4, 2), 16);
      } else if (color.startsWith('rgb')) {
        const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (match) {
          [, r, g, b] = match.map(Number);
        } else {
          [r, g, b] = [0, 255, 157]; // 默认颜色
        }
      } else {
        [r, g, b] = [0, 255, 157]; // 默认颜色
      }
      
      function draw() {
        // 根据性能调整清除方式
        if (state.performanceLevel === 'high') {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        
        // 绘制所有数据流
        streams.forEach(stream => {
          stream.update();
          stream.draw();
        });
      }
      
      // 初始化
      initStreams();
      
      // 创建动画更新函数
      const update = function(timestamp) {
        if (!state.paused) {
          draw();
        }
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
          if (canvas.parentNode) {
            canvas.parentNode.removeChild(canvas);
          }
        }
      };
    }
  };
  
  // 粒子效果
  const particles = {
    // 矩阵粒子效果
    matrixParticles: function(container, theme, params = {}) {
      const color = params.color || theme.primaryColor || '#00ff9d';
      const count = params.count || (state.performanceLevel === 'low' ? 30 : 
                                    state.performanceLevel === 'medium' ? 60 : 100);
      const speed = params.speed || 1;
      const size = params.size || { min: 3, max: 8 };
      
      // 创建粒子Canvas
      const canvas = utils.createCanvas(container, 'xi-matrix-particles-canvas');
      const ctx = canvas.getContext('2d');
      
      // 粒子数组
      const particleArray = [];
      const symbols = '01Ξ';
      
      // 创建粒子
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
              
              // 边界检测
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
        
        // 更新并绘制所有粒子
        particleArray.forEach(particle => {
          particle.update();
          particle.draw();
        });
      }
      
      // 初始化
      createParticles();
      
      // 创建动画更新函数
      const update = function(timestamp) {
        if (!state.paused) {
          draw();
        }
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
          if (canvas.parentNode) {
            canvas.parentNode.removeChild(canvas);
          }
        }
      };
    },
    
    // 量子粒子效果
    quantumParticles: function(container, theme, params = {}) {
      const colors = params.colors || theme.particleColors || ['#6633ff', '#3a0ca3', '#4361ee', '#4cc9f0', '#7209b7'];
      const count = params.count || (state.performanceLevel === 'low' ? 20 : 
                                    state.performanceLevel === 'medium' ? 40 : 80);
      const speed = params.speed || 1;
      const connectionDistance = params.connectionDistance || 150;
      const connectionOpacity = params.connectionOpacity || 0.5;
      
      // 创建量子粒子Canvas
      const canvas = utils.createCanvas(container, 'xi-quantum-particles-canvas');
      const ctx = canvas.getContext('2d');
      
      // 粒子数组
      const particleArray = [];
      
      // 创建粒子
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
            // 量子特性
            wavePeriod: Math.random() * 10 + 5,
            waveAmplitude: Math.random() * 4 + 1,
            phase: Math.random() * Math.PI * 2,
            alpha: Math.random() * 0.5 + 0.5,
            update: function(timestamp) {
              // 标准移动
              this.x += this.speedX;
              this.y += this.speedY;
              
              // 量子波动 - 使用正弦波模拟量子不确定性
              const time = timestamp / 1000;
              const wave = Math.sin(time / this.wavePeriod + this.phase) * this.waveAmplitude;
              this.x += wave * this.speedX;
              this.y += wave * this.speedY;
              
              // 改变透明度
              this.alpha = 0.5 + Math.sin(time / 2 + this.phase) * 0.3;
              
              // 边界检测 - 环绕方式
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
              
              // 绘制辉光
              const gradient = ctx.createRadialGradient(
                this.x, this.y, this.size / 2,
                this.x, this.y, this.size * 2
              );
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
        // 仅在中高性能设置下绘制连接线
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
              // 基于距离计算透明度
              const opacity = (1 - distance / connectionDistance) * connectionOpacity;
              
              // 混合两个粒子的颜色
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
        
        // 更新并绘制所有粒子
        particleArray.forEach(particle => {
          particle.update(timestamp);
          particle.draw();
        });
        
        // 绘制粒子间连接
        drawConnections();
      }
      
      // 初始化
      createParticles();
      
      // 创建动画更新函数
      const update = function(timestamp) {
        if (!state.paused) {
          draw(timestamp);
        }
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
          if (canvas.parentNode) {
            canvas.parentNode.removeChild(canvas);
          }
        }
      };
    },
    
    // 几何形状粒子
    geometricShapes: function(container, theme, params = {}) {
      const colors = params.colors || theme.particleColors || ['#00bfff', '#0077b6', '#48cae4', '#90e0ef', '#023e8a'];
      const count = params.count || (state.performanceLevel === 'low' ? 15 : 
                                    state.performanceLevel === 'medium' ? 30 : 50);
      const speed = params.speed || 0.5;
      
      // 创建几何形状Canvas
      const canvas = utils.createCanvas(container, 'xi-geometric-shapes-canvas');
      const ctx = canvas.getContext('2d');
      
      // 形状数组
      const shapes = [];
      
      // 可能的形状类型
      const shapeTypes = ['circle', 'square', 'triangle', 'hexagon'];
      
      // 创建形状
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
              
              // 边界检测 - 反弹方式
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
              
              // 根据形状类型绘制不同的几何图形
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
                    
                    if (i === 0) {
                      ctx.moveTo(x, y);
                    } else {
                      ctx.lineTo(x, y);
                    }
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
        // 使用透明矩形而不是完全清除，以创建轨迹效果
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 更新并绘制所有形状
        shapes.forEach(shape => {
          shape.update();
          shape.draw();
        });
      }
      
      // 初始化
      createShapes();
      
      // 创建动画更新函数
      const update = function(timestamp) {
        if (!state.paused) {
          draw();
        }
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
          if (canvas.parentNode) {
            canvas.parentNode.removeChild(canvas);
          }
        }
      };
    },
    
    // 能量场效果
    energyField: function(container, theme, params = {}) {
      const color = params.color || theme.primaryColor || '#6633ff';
      const density = params.density || (state.performanceLevel === 'low' ? 30 : 
                                       state.performanceLevel === 'medium' ? 50 : 70);
      const speed = params.speed || 1;
      
      // 创建能量场Canvas
      const canvas = utils.createCanvas(container, 'xi-energy-field-canvas');
      const ctx = canvas.getContext('2d');
      
      // 场点数组
      const fieldPoints = [];
      
      // 创建场点
      function createFieldPoints() {
        fieldPoints.length = 0;
        
        // 计算网格大小
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
                
                // 场点的角度随时间变化
                this.angle += 0.01 * this.speed;
                
                // 使用噪声函数或简单的三角函数模拟场的波动
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
      
      function draw(timestamp) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 更新并绘制所有场点
        fieldPoints.forEach(point => {
          point.update(timestamp);
          point.draw();
        });
        
        // 在高性能设备上绘制场线
        if (state.performanceLevel !== 'low') {
          drawFieldLines();
        }
      }
      
      function drawFieldLines() {
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.2;
        ctx.lineWidth = 0.5;
        
        // 计算和绘制部分场线
        const drawCount = state.performanceLevel === 'high' ? fieldPoints.length : Math.floor(fieldPoints.length / 2);
        
        for (let i = 0; i < drawCount; i++) {
          const point = fieldPoints[i];
          
          // 查找最近的几个点
          const nearPoints = findNearestPoints(point, 3);
          
          // 绘制连线
          nearPoints.forEach(nearPoint => {
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(nearPoint.x, nearPoint.y);
            ctx.stroke();
          });
        }
      }
      
      function findNearestPoints(point, count) {
        return fieldPoints
          .filter(p => p !== point)
          .sort((a, b) => {
            const distA = Math.hypot(a.x - point.x, a.y - point.y);
            const distB = Math.hypot(b.x - point.x, b.y - point.y);
            return distA - distB;
          })
          .slice(0, count);
      }
      
      // 初始化
      createFieldPoints();
      
      // 创建动画更新函数
      const update = function(timestamp) {
        if (!state.paused) {
          draw(timestamp);
        }
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
          if (canvas.parentNode) {
            canvas.parentNode.removeChild(canvas);
          }
        }
      };
    },