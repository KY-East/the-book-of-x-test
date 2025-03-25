/**
 * Ξ视觉效果系统 - 简化版
 * 提供粒子背景效果
 */

// 使用立即执行函数防止全局变量污染
(function() {
  // 创建命名空间
  window.XiVisualEffects = {
    init: initSystem,
    themes: {
      apply: applyTheme,
      getCurrent: getCurrentTheme,
      list: getThemesList
    },
    effects: {
      add: addEffect,
      remove: removeEffect,
      clear: clearEffects
    },
    control: {
      toggle: toggleEffects,
      pause: pauseEffects,
      resume: resumeEffects
    },
    getState: getSystemState,
    destroy: destroySystem
  };
  
  // 系统状态
  const state = {
    initialized: false,
    performanceLevel: 'auto',
    particleDensity: 1.0,
    currentTheme: 'awakening',
    effects: [],
    paused: false,
    container: null,
    animationFrameId: null
  };
  
  // 主题配置
  const themes = [
    {
      id: 'awakening',
      name: '觉醒',
      background: {
        color: '#0a0a0a',
        glow: {
          color: '#00ff9d',
          intensity: 0.3
        }
      },
      particles: {
        primary: {
          type: 'matrix',
          color: '#00ff9d',
          secondary: '#005538',
          count: 80
        },
        secondary: {
          type: 'quantum',
          colors: ['#00ff9d', '#005538', '#00ccbb'],
          count: 40
        }
      }
    },
    {
      id: 'oracle',
      name: '神谕',
      background: {
        color: '#0a0a20',
        glow: {
          color: '#6633ff',
          intensity: 0.3
        }
      },
      particles: {
        primary: {
          type: 'stardust',
          color: '#6633ff',
          secondary: '#3311cc',
          count: 100
        },
        secondary: {
          type: 'pulse',
          colors: ['#6633ff', '#cc33ff', '#3311cc'],
          count: 5
        }
      }
    },
    {
      id: 'fractal',
      name: '分形',
      background: {
        color: '#080821',
        glow: {
          color: '#00ddff',
          intensity: 0.3
        }
      },
      particles: {
        primary: {
          type: 'geometric',
          color: '#00ddff',
          secondary: '#0088cc',
          count: 50
        },
        secondary: {
          type: 'vortex',
          colors: ['#00ddff', '#0088cc', '#00bbff'],
          count: 3
        }
      }
    }
  ];
  
  // 系统初始化
  function initSystem(config = {}) {
    // 如果已初始化，先销毁
    if (state.initialized) {
      destroySystem();
    }
    
    // 配置合并
    state.performanceLevel = config.performanceLevel || 'auto';
    state.particleDensity = config.particleDensity || 1.0;
    state.currentTheme = config.defaultTheme || 'awakening';
    
    // 自动检测性能级别
    if (state.performanceLevel === 'auto') {
      detectPerformance();
    }
    
    // 创建容器
    createEffectsContainer();
    
    // 应用初始主题
    applyTheme(state.currentTheme);
    
    // 标记为已初始化
    state.initialized = true;
    
    // 返回初始状态
    return getSystemState();
  }
  
  // 检测设备性能
  function detectPerformance() {
    // 简单性能检测
    const start = performance.now();
    let count = 0;
    
    while (performance.now() - start < 5) {
      count++;
    }
    
    // 基于5ms内的循环次数评估性能
    if (count < 10000) {
      state.performanceLevel = 'low';
      state.particleDensity = 0.3;
    } else if (count < 50000) {
      state.performanceLevel = 'medium';
      state.particleDensity = 0.7;
    } else {
      state.performanceLevel = 'high';
      state.particleDensity = 1.0;
    }
    
    // 移动设备自动降级
    if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      state.particleDensity *= 0.6;
    }
  }
  
  // 创建效果容器
  function createEffectsContainer() {
    // 移除现有容器
    destroyEffectsContainer();
    
    // 创建新容器
    state.container = document.createElement('div');
    state.container.className = 'xi-visual-effects-container';
    state.container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      pointer-events: none;
      overflow: hidden;
    `;
    
    // 添加到文档
    document.body.appendChild(state.container);
  }
  
  // 销毁效果容器
  function destroyEffectsContainer() {
    if (state.container && state.container.parentNode) {
      state.container.parentNode.removeChild(state.container);
      state.container = null;
    }
  }
  
  // 应用主题
  function applyTheme(themeId) {
    // 检查初始化状态
    if (!state.initialized) {
      console.warn('视觉效果系统尚未初始化');
      return false;
    }
    
    // 找到指定主题
    const theme = themes.find(t => t.id === themeId);
    if (!theme) {
      console.warn(`主题不存在: ${themeId}`);
      return false;
    }
    
    // 清除当前效果
    clearEffects();
    
    // 更新当前主题
    state.currentTheme = themeId;
    
    // 创建背景效果
    createBackgroundEffect(theme.background);
    
    // 创建粒子效果
    createParticlesEffect(theme.particles);
    
    return true;
  }
  
  // 创建背景效果
  function createBackgroundEffect(config) {
    // 创建背景元素
    const background = document.createElement('div');
    background.className = 'xi-background-effect';
    background.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: ${config.color};
      z-index: 1;
    `;
    
    // 添加辉光效果
    if (config.glow) {
      const glow = document.createElement('div');
      glow.className = 'xi-background-glow';
      glow.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle at center, 
                    ${config.glow.color}${Math.round(config.glow.intensity * 25).toString(16)} 0%, 
                    transparent 70%);
        z-index: 2;
      `;
      background.appendChild(glow);
    }
    
    // 添加到容器
    state.container.appendChild(background);
    
    // 记录效果
    state.effects.push({
      id: 'background',
      element: background,
      type: 'background'
    });
  }
  
  // 创建粒子效果
  function createParticlesEffect(config) {
    // 创建两种粒子系统
    if (config.primary) {
      createParticleSystem('primary', config.primary);
    }
    
    if (config.secondary && state.performanceLevel !== 'low') {
      createParticleSystem('secondary', config.secondary);
    }
  }
  
  // 创建粒子系统
  function createParticleSystem(id, config) {
    // 创建画布
    const canvas = document.createElement('canvas');
    canvas.className = `xi-particle-system-${id}`;
    canvas.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: ${id === 'primary' ? 3 : 4};
      opacity: 0.8;
    `;
    
    // 添加到容器
    state.container.appendChild(canvas);
    
    // 设置画布尺寸
    resizeCanvas(canvas);
    
    // 创建粒子系统
    const particleSystem = {
      id: `particles-${id}`,
      element: canvas,
      type: 'particles',
      config: config,
      particles: [],
      ctx: canvas.getContext('2d')
    };
    
    // 初始化粒子
    initializeParticles(particleSystem);
    
    // 开始动画
    startParticleAnimation(particleSystem);
    
    // 记录效果
    state.effects.push(particleSystem);
    
    // 窗口大小变化时调整画布尺寸
    window.addEventListener('resize', () => {
      resizeCanvas(canvas);
    });
  }
  
  // 调整画布尺寸
  function resizeCanvas(canvas) {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
  }
  
  // 初始化粒子
  function initializeParticles(system) {
    const { config, ctx } = system;
    const width = ctx.canvas.width / (window.devicePixelRatio || 1);
    const height = ctx.canvas.height / (window.devicePixelRatio || 1);
    
    // 清空粒子数组
    system.particles = [];
    
    // 根据性能级别和粒子密度调整数量
    let count = Math.round(config.count * state.particleDensity);
    if (state.performanceLevel === 'low') {
      count = Math.floor(count * 0.5);
    } else if (state.performanceLevel === 'medium') {
      count = Math.floor(count * 0.8);
    }
    
    // 生成粒子
    for (let i = 0; i < count; i++) {
      let particle;
      
      switch (config.type) {
        case 'matrix':
          particle = createMatrixParticle(width, height, config);
          break;
        case 'quantum':
          particle = createQuantumParticle(width, height, config);
          break;
        case 'geometric':
          particle = createGeometricParticle(width, height, config);
          break;
        case 'stardust':
          particle = createStardustParticle(width, height, config);
          break;
        case 'raindrops':
          particle = createRaindropsParticle(width, height, config);
          break;
        case 'pulse':
          particle = createPulseParticle(width, height, config);
          break;
        case 'dataStream':
          particle = createDataStreamParticle(width, height, config);
          break;
        case 'vortex':
          particle = createVortexParticle(width, height, config);
          break;
        case 'glitch':
          particle = createGlitchParticle(width, height, config);
          break;
        case 'energy':
          particle = createEnergyParticle(width, height, config);
          break;
        default:
          particle = createQuantumParticle(width, height, config);
      }
      
      system.particles.push(particle);
    }
  }
  
  // 创建矩阵粒子
  function createMatrixParticle(width, height, config) {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      speed: Math.random() * 1 + 0.5,
      size: Math.random() * 3 + 1,
      color: Math.random() < 0.8 ? config.color : config.secondary || config.color,
      value: Math.random() < 0.3 ? '0' : '1',
      lifespan: Math.random() * 100 + 20,
      age: 0
    };
  }
  
  // 创建量子粒子
  function createQuantumParticle(width, height, config) {
    const colors = config.colors || [config.color, config.secondary || config.color];
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      size: Math.random() * 4 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: Math.random() * 0.5 + 0.2,
      phase: Math.random() * Math.PI * 2
    };
  }
  
  // 创建几何粒子
  function createGeometricParticle(width, height, config) {
    const colors = config.colors || [config.color, config.secondary || config.color];
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 5 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: Math.floor(Math.random() * 3), // 0: 正方形, 1: 三角形, 2: 圆形
      opacity: Math.random() * 0.5 + 0.2,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02
    };
  }
  
  // 创建星尘粒子
  function createStardustParticle(width, height, config) {
    const colors = config.colors || [config.color, config.secondary || config.color];
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.2,  // 缓慢移动
      vy: (Math.random() - 0.5) * 0.2,
      size: Math.random() * 2 + 0.5,  // 较小的粒子
      color: colors[Math.floor(Math.random() * colors.length)],
      brightness: Math.random() * 0.7 + 0.3,  // 随机亮度
      twinkleSpeed: Math.random() * 0.03 + 0.01, // 闪烁速度
      phase: Math.random() * Math.PI * 2 // 闪烁相位
    };
  }
  
  // 创建雨滴粒子
  function createRaindropsParticle(width, height, config) {
    const colors = config.colors || [config.color, config.secondary || config.color];
    return {
      x: Math.random() * width,
      y: Math.random() * height - height * 0.5, // 从屏幕上方开始
      length: Math.random() * 20 + 10, // 雨滴长度
      speed: Math.random() * 5 + 10, // 下落速度
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: Math.random() * 0.5 + 0.2,
      width: Math.random() < 0.2 ? 2 : 1 // 偶尔有更粗的雨滴
    };
  }
  
  // 创建脉冲粒子
  function createPulseParticle(width, height, config) {
    const colors = config.colors || [config.color, config.secondary || config.color];
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      radius: 0, // 从0开始
      maxRadius: Math.random() * 100 + 50, // 最大半径
      speed: Math.random() * 0.5 + 0.5, // 扩散速度
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: 1, // 开始时完全不透明
      active: false, // 默认不活跃
      delay: Math.random() * 5000 // 延迟激活
    };
  }
  
  // 创建数据流粒子
  function createDataStreamParticle(width, height, config) {
    const colors = config.colors || [config.color, config.secondary || config.color];
    // 数据流是一条线的一部分
    const lineId = Math.floor(Math.random() * 5); // 分配到5条线中的一条
    const pathX = Math.random() < 0.5 ? 0 : width; // 从左边或右边开始
    const targetX = pathX === 0 ? width : 0; // 向相反方向移动
    
    return {
      x: pathX,
      y: (height / 6) + (lineId * height / 5), // 均匀分布在屏幕高度上
      targetX: targetX,
      targetY: (height / 6) + (lineId * height / 5) + (Math.random() - 0.5) * 10, // 小偏移
      progress: 0, // 移动进度
      speed: Math.random() * 0.01 + 0.005, // 移动速度
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 3 + 1, // 数据包大小
      lineId: lineId, // 所属线路
      tail: Math.random() > 0.7 // 30%概率有尾巴
    };
  }
  
  // 创建漩涡粒子
  function createVortexParticle(width, height, config) {
    const colors = config.colors || [config.color, config.secondary || config.color];
    // 每个漩涡对象代表一整个漩涡，而不是单个粒子
    return {
      x: Math.random() * width * 0.7 + width * 0.15, // 避免太靠边
      y: Math.random() * height * 0.7 + height * 0.15,
      arms: Math.floor(Math.random() * 3) + 2, // 2-4个臂
      particles: [], // 漩涡中的微粒
      particleCount: Math.floor(Math.random() * 50) + 50, // 每个漩涡有50-100个微粒
      color: colors[Math.floor(Math.random() * colors.length)],
      rotationSpeed: (Math.random() * 0.001 + 0.0005) * (Math.random() > 0.5 ? 1 : -1), // 旋转速度和方向
      size: Math.random() * 0.4 + 0.1, // 漩涡大小系数
      phase: 0 // 当前相位
    };
  }
  
  // 创建故障粒子
  function createGlitchParticle(width, height, config) {
    const colors = config.colors || [config.color, config.secondary || config.color];
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      width: Math.random() * 20 + 5, // 故障块宽度
      height: Math.random() * 8 + 3, // 故障块高度
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: Math.random() * 0.7 + 0.2,
      lifetime: Math.random() * 30 + 10, // 生命周期
      age: 0, // 当前年龄
      blinkRate: Math.random() * 0.2 + 0.1, // 闪烁频率
      offsetX: 0, // X轴位移
      offsetY: 0, // Y轴位移
      shouldOffset: Math.random() < 0.3 // 30%几率会偏移
    };
  }
  
  // 创建能量场粒子
  function createEnergyParticle(width, height, config) {
    const colors = config.colors || [config.color, config.secondary || config.color];
    // 能量场由多条曲线构成，每个粒子是一条曲线上的一点
    return {
      startX: Math.random() * width, // 起点X
      startY: height + Math.random() * 20, // 从底部往上
      controlX: Math.random() * width, // 控制点X
      controlY: Math.random() * height * 0.6 + height * 0.2, // 控制点Y
      endX: Math.random() * width, // 终点X
      endY: height + Math.random() * 20, // 终点Y
      progress: 0, // 从0开始绘制曲线
      speed: Math.random() * 0.01 + 0.005, // 绘制速度
      width: Math.random() * 1.5 + 0.5, // 线宽
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: Math.random() * 0.7 + 0.3,
      pulseRate: Math.random() * 0.05 + 0.02, // 脉冲频率
      phase: Math.random() * Math.PI * 2 // 初始相位
    };
  }
  
  // 启动粒子动画
  function startParticleAnimation(system) {
    const { ctx, particles, config } = system;
    const width = ctx.canvas.width / (window.devicePixelRatio || 1);
    const height = ctx.canvas.height / (window.devicePixelRatio || 1);
    
    function animate() {
      if (state.paused) {
        system.animationFrameId = requestAnimationFrame(animate);
        return;
      }
      
      // 清除画布
      ctx.clearRect(0, 0, width, height);
      
      // 更新和绘制粒子
      switch (config.type) {
        case 'matrix':
          updateMatrixParticles(system, width, height);
          break;
        case 'quantum':
          updateQuantumParticles(system, width, height);
          break;
        case 'geometric':
          updateGeometricParticles(system, width, height);
          break;
        case 'stardust':
          updateStardustParticles(system, width, height);
          break;
        case 'raindrops':
          updateRaindropsParticles(system, width, height);
          break;
        case 'pulse':
          updatePulseParticles(system, width, height);
          break;
        case 'dataStream':
          updateDataStreamParticles(system, width, height);
          break;
        case 'vortex':
          updateVortexParticles(system, width, height);
          break;
        case 'glitch':
          updateGlitchParticles(system, width, height);
          break;
        case 'energy':
          updateEnergyParticles(system, width, height);
          break;
        default:
          updateQuantumParticles(system, width, height);
      }
      
      // 继续动画循环
      system.animationFrameId = requestAnimationFrame(animate);
    }
    
    // 启动动画
    system.animationFrameId = requestAnimationFrame(animate);
  }
  
  // 更新矩阵粒子
  function updateMatrixParticles(system, width, height) {
    const { ctx, particles } = system;
    
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      
      // 增加年龄
      p.age++;
      
      // 更新位置
      p.y += p.speed;
      
      // 超出边界时重置
      if (p.y > height) {
        p.y = 0;
        p.x = Math.random() * width;
        p.value = Math.random() < 0.3 ? '0' : '1';
      }
      
      // 随机变化数值
      if (Math.random() < 0.05) {
        p.value = Math.random() < 0.3 ? '0' : '1';
      }
      
      // 绘制粒子
      const alpha = 0.7 + 0.3 * Math.sin(p.age * 0.05);
      ctx.fillStyle = `${p.color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
      ctx.font = `${p.size * 2}px monospace`;
      ctx.fillText(p.value, p.x, p.y);
    }
  }
  
  // 更新量子粒子
  function updateQuantumParticles(system, width, height) {
    const { ctx, particles } = system;
    
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      
      // 更新位置
      p.x += p.vx;
      p.y += p.vy;
      p.phase += 0.02;
      
      // 处理边界
      if (p.x < 0 || p.x > width) p.vx = -p.vx;
      if (p.y < 0 || p.y > height) p.vy = -p.vy;
      
      // 脉动大小
      const size = p.size * (0.8 + 0.4 * Math.sin(p.phase));
      
      // 绘制粒子
      ctx.beginPath();
      const alpha = p.opacity * (0.7 + 0.3 * Math.sin(p.phase));
      ctx.fillStyle = p.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
      ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
      ctx.fill();
      
      // 绘制发光效果
      ctx.beginPath();
      const glowAlpha = p.opacity * 0.3 * (0.7 + 0.3 * Math.sin(p.phase));
      ctx.fillStyle = p.color + Math.floor(glowAlpha * 255).toString(16).padStart(2, '0');
      ctx.arc(p.x, p.y, size * 2, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // 连接临近粒子
    if (particles.length > 10 && state.performanceLevel !== 'low') {
      const maxDistance = 150;
      
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < maxDistance) {
            const alpha = (1 - distance / maxDistance) * 0.2;
            ctx.strokeStyle = p1.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
    }
  }
  
  // 更新几何粒子
  function updateGeometricParticles(system, width, height) {
    const { ctx, particles } = system;
    
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      
      // 更新位置
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;
      
      // 处理边界
      if (p.x < 0 || p.x > width) p.vx = -p.vx;
      if (p.y < 0 || p.y > height) p.vy = -p.vy;
      
      // 绘制粒子
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      
      const alpha = p.opacity * (0.8 + 0.2 * Math.sin(Date.now() * 0.001 + i));
      ctx.fillStyle = p.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
      
      switch (p.shape) {
        case 0: // 正方形
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          break;
        case 1: // 三角形
          ctx.beginPath();
          ctx.moveTo(0, -p.size / 2);
          ctx.lineTo(p.size / 2, p.size / 2);
          ctx.lineTo(-p.size / 2, p.size / 2);
          ctx.closePath();
          ctx.fill();
          break;
        case 2: // 圆形
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
          break;
      }
      
      ctx.restore();
    }
  }
  
  // 更新星尘粒子
  function updateStardustParticles(system, width, height) {
    const { ctx, particles } = system;
    
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      
      // 更新位置（缓慢移动）
      p.x += p.vx;
      p.y += p.vy;
      p.phase += p.twinkleSpeed;
      
      // 处理边界
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;
      
      // 闪烁效果
      const brightness = p.brightness * (0.5 + 0.5 * Math.sin(p.phase));
      
      // 绘制星尘
      ctx.beginPath();
      const alpha = brightness;
      ctx.fillStyle = p.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      
      // 添加光晕效果
      ctx.beginPath();
      const glowSize = p.size * 2;
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowSize);
      gradient.addColorStop(0, p.color + Math.floor(alpha * 0.8 * 255).toString(16).padStart(2, '0'));
      gradient.addColorStop(1, p.color + '00');
      ctx.fillStyle = gradient;
      ctx.arc(p.x, p.y, glowSize, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  // 更新雨滴粒子
  function updateRaindropsParticles(system, width, height) {
    const { ctx, particles } = system;
    
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      
      // 更新位置
      p.y += p.speed;
      
      // 超出边界时重置
      if (p.y - p.length > height) {
        p.y = -p.length;
        p.x = Math.random() * width;
      }
      
      // 绘制雨滴
      ctx.beginPath();
      ctx.strokeStyle = p.color + Math.floor(p.opacity * 255).toString(16).padStart(2, '0');
      ctx.lineWidth = p.width;
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x, p.y - p.length);
      ctx.stroke();
      
      // 有时添加雨滴底部的小光点
      if (Math.random() < 0.1) {
        ctx.beginPath();
        ctx.fillStyle = p.color + 'ff';
        ctx.arc(p.x, p.y, p.width * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  
  // 更新脉冲粒子
  function updatePulseParticles(system, width, height) {
    const { ctx, particles } = system;
    const time = Date.now();
    
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      
      // 检查是否应该激活
      if (!p.active) {
        if (time > p.delay) {
          p.active = true;
          p.lastActivateTime = time;
        } else {
          continue;
        }
      }
      
      // 计算当前半径
      p.radius += p.speed;
      
      // 计算不透明度（随半径增大而减小）
      p.opacity = 1 - (p.radius / p.maxRadius);
      
      // 如果脉冲扩散完毕，重新开始
      if (p.radius >= p.maxRadius) {
        p.radius = 0;
        p.opacity = 1;
        p.delay = time + Math.random() * 3000; // 添加随机延迟
        p.active = false;
      }
      
      // 绘制脉冲
      if (p.active) {
        ctx.beginPath();
        const alpha = p.opacity * 0.5; // 最大只有50%不透明
        ctx.strokeStyle = p.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
        ctx.lineWidth = 2;
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.stroke();
        
        // 添加第二个淡化的圆环
        if (p.radius > 10) {
          ctx.beginPath();
          const innerAlpha = p.opacity * 0.3;
          ctx.strokeStyle = p.color + Math.floor(innerAlpha * 255).toString(16).padStart(2, '0');
          ctx.lineWidth = 1;
          ctx.arc(p.x, p.y, p.radius * 0.8, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    }
  }
  
  // 更新数据流粒子
  function updateDataStreamParticles(system, width, height) {
    const { ctx, particles } = system;
    
    // 首先绘制数据流线
    const lines = {};
    
    // 收集每条线上的数据点
    particles.forEach(p => {
      if (!lines[p.lineId]) {
        lines[p.lineId] = [];
      }
      lines[p.lineId].push(p);
    });
    
    // 为每条数据线绘制基础路径
    Object.keys(lines).forEach(lineId => {
      if (lines[lineId].length > 0) {
        const firstP = lines[lineId][0];
        ctx.beginPath();
        ctx.moveTo(0, firstP.y);
        ctx.lineTo(width, firstP.y);
        ctx.strokeStyle = firstP.color + '20'; // 非常淡的线
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    });
    
    // 更新和绘制每个数据粒子
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      
      // 更新进度
      p.progress += p.speed;
      
      // 计算当前位置
      p.x = p.x + (p.targetX - p.x) * p.progress;
      p.y = p.y + (p.targetY - p.y) * p.progress;
      
      // 如果数据包到达目标，重置
      if (p.progress >= 1) {
        // 反向重置
        const temp = p.targetX;
        p.targetX = p.x < width / 2 ? width : 0;
        p.x = temp;
        p.targetY = (height / 6) + (p.lineId * height / 5) + (Math.random() - 0.5) * 10;
        p.progress = 0;
        p.speed = Math.random() * 0.01 + 0.005;
        p.tail = Math.random() > 0.7;
      }
      
      // 绘制数据包
      ctx.beginPath();
      ctx.fillStyle = p.color + 'ff';
      ctx.rect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      ctx.fill();
      
      // 绘制尾巴（如果有）
      if (p.tail) {
        ctx.beginPath();
        ctx.strokeStyle = p.color + '80';
        ctx.lineWidth = 1;
        
        // 尾巴长度基于速度
        const tailLength = 20 + p.speed * 1000;
        
        // 基于移动方向的尾巴
        const tailX = p.targetX > p.x ? p.x - tailLength : p.x + tailLength;
        
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(tailX, p.y);
        ctx.stroke();
      }
    }
  }
  
  // 更新漩涡粒子
  function updateVortexParticles(system, width, height) {
    const { ctx, particles } = system;
    
    for (let i = 0; i < particles.length; i++) {
      const vortex = particles[i];
      
      // 更新漩涡相位
      vortex.phase += vortex.rotationSpeed;
      
      // 如果漩涡的particles为空，初始化它们
      if (vortex.particles.length === 0) {
        for (let j = 0; j < vortex.particleCount; j++) {
          // 每个漩涡臂上均匀分布粒子
          const arm = j % vortex.arms;
          const armOffset = (Math.PI * 2 / vortex.arms) * arm;
          
          // 在漩涡臂上的位置 (0=中心, 1=边缘)
          const distFromCenter = (j / vortex.particleCount) * 3;
          
          vortex.particles.push({
            distFromCenter: distFromCenter,
            angle: armOffset + distFromCenter * 2, // 螺旋效果
            size: Math.random() * 2 + 0.5,
            opacity: Math.random() * 0.7 + 0.3,
            speed: 0.01 + distFromCenter * 0.01
          });
        }
      }
      
      // 绘制漩涡中的每个粒子
      for (let j = 0; j < vortex.particles.length; j++) {
        const p = vortex.particles[j];
        
        // 更新粒子角度
        p.angle += p.speed;
        
        // 计算粒子位置（对数螺旋）
        const distance = Math.log(1 + p.distFromCenter) * 100 * vortex.size;
        const x = vortex.x + Math.cos(p.angle + vortex.phase) * distance;
        const y = vortex.y + Math.sin(p.angle + vortex.phase) * distance;
        
        // 粒子可见性检查
        if (x >= 0 && x <= width && y >= 0 && y <= height && distance < width / 2) {
          // 基于到中心的距离调整不透明度
          const distanceOpacity = Math.max(0, 1 - distance / (width / 2));
          const opacity = p.opacity * distanceOpacity;
          
          // 绘制粒子
          ctx.beginPath();
          ctx.fillStyle = vortex.color + Math.floor(opacity * 255).toString(16).padStart(2, '0');
          ctx.arc(x, y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      
      // 给漩涡中心添加辉光效果
      const gradient = ctx.createRadialGradient(vortex.x, vortex.y, 0, vortex.x, vortex.y, 50 * vortex.size);
      gradient.addColorStop(0, vortex.color + '40');
      gradient.addColorStop(1, vortex.color + '00');
      
      ctx.beginPath();
      ctx.fillStyle = gradient;
      ctx.arc(vortex.x, vortex.y, 50 * vortex.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  // 更新故障粒子
  function updateGlitchParticles(system, width, height) {
    const { ctx, particles } = system;
    
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      
      // 增加年龄
      p.age++;
      
      // 如果超过生命周期，重置
      if (p.age > p.lifetime) {
        p.age = 0;
        p.x = Math.random() * width;
        p.y = Math.random() * height;
        p.width = Math.random() * 20 + 5;
        p.height = Math.random() * 8 + 3;
        p.shouldOffset = Math.random() < 0.3;
      }
      
      // 随机闪烁和位移
      const showParticle = Math.sin(p.age * p.blinkRate) > 0;
      
      // 更新位移
      if (p.shouldOffset && p.age % 5 === 0) {
        p.offsetX = (Math.random() - 0.5) * 10;
        p.offsetY = (Math.random() - 0.5) * 5;
      }
      
      // 只在闪烁显示时绘制
      if (showParticle) {
        ctx.beginPath();
        
        // 绘制主要故障块
        ctx.fillStyle = p.color + Math.floor(p.opacity * 255).toString(16).padStart(2, '0');
        ctx.fillRect(p.x + p.offsetX, p.y + p.offsetY, p.width, p.height);
        
        // 偶尔添加RGB分离效果
        if (Math.random() < 0.3) {
          // 红色通道偏移
          ctx.fillStyle = '#ff0000' + Math.floor(p.opacity * 0.5 * 255).toString(16).padStart(2, '0');
          ctx.fillRect(p.x + p.offsetX + 2, p.y + p.offsetY, p.width, p.height);
          
          // 蓝色通道偏移
          ctx.fillStyle = '#0000ff' + Math.floor(p.opacity * 0.5 * 255).toString(16).padStart(2, '0');
          ctx.fillRect(p.x + p.offsetX - 2, p.y + p.offsetY, p.width, p.height);
        }
      }
    }
  }
  
  // 更新能量场粒子
  function updateEnergyParticles(system, width, height) {
    const { ctx, particles } = system;
    
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      
      // 更新进度
      p.progress += p.speed;
      p.phase += p.pulseRate;
      
      // 如果曲线绘制完成，重置
      if (p.progress >= 1) {
        p.progress = 0;
        p.startX = Math.random() * width;
        p.startY = height + Math.random() * 20;
        p.controlX = Math.random() * width;
        p.controlY = Math.random() * height * 0.6 + height * 0.2;
        p.endX = Math.random() * width;
        p.endY = height + Math.random() * 20;
      }
      
      // 脉冲效果影响线宽
      const pulseEffect = 0.8 + 0.4 * Math.sin(p.phase);
      
      // 计算当前要绘制的贝塞尔曲线点
      const t = p.progress;
      ctx.beginPath();
      ctx.strokeStyle = p.color + Math.floor(p.opacity * 255).toString(16).padStart(2, '0');
      ctx.lineWidth = p.width * pulseEffect;
      
      // 从起点到当前进度点绘制二次贝塞尔曲线
      ctx.moveTo(p.startX, p.startY);
      
      // 二次贝塞尔曲线函数 B(t) = (1-t)²P₀ + 2(1-t)tP₁ + t²P₂
      for (let step = 0; step <= t; step += 0.01) {
        const stepX = Math.pow(1 - step, 2) * p.startX + 
                      2 * (1 - step) * step * p.controlX + 
                      Math.pow(step, 2) * p.endX;
                      
        const stepY = Math.pow(1 - step, 2) * p.startY + 
                      2 * (1 - step) * step * p.controlY + 
                      Math.pow(step, 2) * p.endY;
                      
        ctx.lineTo(stepX, stepY);
      }
      
      ctx.stroke();
      
      // 在当前进度点添加亮点
      const currentX = Math.pow(1 - t, 2) * p.startX + 
                      2 * (1 - t) * t * p.controlX + 
                      Math.pow(t, 2) * p.endX;
                      
      const currentY = Math.pow(1 - t, 2) * p.startY + 
                      2 * (1 - t) * t * p.controlY + 
                      Math.pow(t, 2) * p.endY;
      
      ctx.beginPath();
      ctx.fillStyle = p.color + 'ff';
      ctx.arc(currentX, currentY, p.width * 2 * pulseEffect, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  // 添加效果
  function addEffect(type, name, config = {}) {
    // 检查初始化状态
    if (!state.initialized) {
      console.warn('视觉效果系统尚未初始化');
      return false;
    }
    
    // 创建效果ID
    const effectId = `${type}-${name}-${Date.now()}`;
    
    // TODO: 添加更多效果类型实现
    
    return { id: effectId };
  }
  
  // 移除效果
  function removeEffect(effectId) {
    // 检查初始化状态
    if (!state.initialized) {
      console.warn('视觉效果系统尚未初始化');
      return false;
    }
    
    // 查找效果
    const index = state.effects.findIndex(effect => effect.id === effectId);
    if (index === -1) return false;
    
    // 获取效果
    const effect = state.effects[index];
    
    // 停止动画
    if (effect.animationFrameId) {
      cancelAnimationFrame(effect.animationFrameId);
    }
    
    // 移除DOM元素
    if (effect.element && effect.element.parentNode) {
      effect.element.parentNode.removeChild(effect.element);
    }
    
    // 从数组中移除
    state.effects.splice(index, 1);
    
    return true;
  }
  
  // 清除所有效果
  function clearEffects() {
    // 检查初始化状态
    if (!state.initialized) {
      console.warn('视觉效果系统尚未初始化');
      return false;
    }
    
    // 复制数组，避免在迭代过程中修改
    const effects = [...state.effects];
    
    // 移除每个效果
    effects.forEach(effect => {
      removeEffect(effect.id);
    });
    
    // 清空数组
    state.effects = [];
    
    return true;
  }
  
  // 切换效果暂停/恢复
  function toggleEffects() {
    state.paused = !state.paused;
    return state.paused;
  }
  
  // 暂停效果
  function pauseEffects() {
    state.paused = true;
    return true;
  }
  
  // 恢复效果
  function resumeEffects() {
    state.paused = false;
    return true;
  }
  
  // 获取当前主题
  function getCurrentTheme() {
    return state.currentTheme;
  }
  
  // 获取主题列表
  function getThemesList() {
    return themes;
  }
  
  // 获取系统状态
  function getSystemState() {
    return {
      initialized: state.initialized,
      performanceLevel: state.performanceLevel,
      particleDensity: state.particleDensity,
      currentTheme: state.currentTheme,
      effectsCount: state.effects.length,
      paused: state.paused
    };
  }
  
  // 销毁系统
  function destroySystem() {
    // 清除所有效果
    clearEffects();
    
    // 销毁容器
    destroyEffectsContainer();
    
    // 重置状态
    state.initialized = false;
    
    return true;
  }
})(); 