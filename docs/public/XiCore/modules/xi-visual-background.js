/**
 * xi-visual-background.js - XiCore背景视觉效果模块
 * 
 * 提供各种背景视觉效果功能，如矩阵代码雨、分形图案等
 * 
 * 版本: 2.0.0
 * 日期: 2024-08-02
 */

const XiVisualBackground = (function() {
  // 默认配置
  const defaultConfig = {
    zIndex: 0,           // 背景层级
    opacity: 0.8,        // 背景透明度
    container: null,     // 自定义容器，默认为body
    performanceLevel: 'auto'  // 性能级别
  };
  
  // 效果实例集合
  const effectInstances = {};
  
  // 检查依赖项
  function checkDependencies() {
    if (typeof XiVisualCore === 'undefined') {
      console.error('[XiVisualBackground] 错误: 找不到XiVisualCore模块');
      return false;
    }
    return true;
  }
  
  // 背景效果实现
  const effects = {
    /**
     * 矩阵代码雨效果
     */
    matrixRain: function(options = {}) {
      const settings = Object.assign({}, defaultConfig, {
        color: '#00ff9d',   // 代码颜色
        speed: 1.0,         // 下落速度
        density: 1.0,       // 密度
        fontSize: 14,       // 字体大小
        characters: "01"    // 使用的字符
      }, options);
      
      // 创建容器
      const containerId = 'xi-bg-matrix-' + Date.now();
      const container = XiVisualCore.utils.createContainer(containerId, settings.zIndex);
      container.style.opacity = settings.opacity;
      
      // 创建canvas
      const canvas = XiVisualCore.utils.createCanvas(container, containerId + '-canvas');
      const ctx = canvas.getContext('2d');
      
      // 字符集
      let chars = settings.characters;
      if (chars === 'default' || chars === 'matrix') {
        chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
      } else if (chars === 'binary') {
        chars = "01".split("");
      } else if (chars === 'hex') {
        chars = "0123456789ABCDEF".split("");
      } else {
        chars = chars.split("");
      }
      
      // 代码雨参数
      const drops = [];
      const fontSize = settings.fontSize;
      const columns = Math.floor(canvas.width / fontSize);
      
      // 初始化雨滴位置
      for (let i = 0; i < columns; i++) {
        drops[i] = Math.floor(Math.random() * -100);
      }
      
      // 性能相关参数
      let lastFrameTime = 0;
      let isPaused = false;
      
      // 绘制函数
      function draw(timestamp) {
        if (isPaused) return;
        
        // 限制帧率
        const elapsed = timestamp - lastFrameTime;
        const fps = settings.performanceLevel === 'low' ? 15 : 
                   settings.performanceLevel === 'medium' ? 30 : 60;
        
        if (elapsed < 1000 / fps) return;
        lastFrameTime = timestamp;
        
        // 半透明背景，形成拖尾效果
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 设置字体
        ctx.fillStyle = settings.color;
        ctx.font = fontSize + 'px monospace';
        
        // 绘制字符
        for (let i = 0; i < drops.length; i++) {
          // 随机字符
          const char = chars[Math.floor(Math.random() * chars.length)];
          
          // 绘制字符
          ctx.fillText(char, i * fontSize, drops[i] * fontSize);
          
          // 重置雨滴或向下移动
          if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          
          // 根据速度移动雨滴
          drops[i] += settings.speed * 0.1;
        }
      }
      
      // 响应窗口大小变化
      function handleResize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // 重新计算列数
        const columns = Math.floor(canvas.width / fontSize);
        
        // 重新初始化雨滴
        for (let i = 0; i < columns; i++) {
          if (!drops[i]) {
            drops[i] = Math.floor(Math.random() * -100);
          }
        }
      }
      
      // 监听窗口大小变化
      window.addEventListener('resize', handleResize);
      
      // 首次调整大小
      handleResize();
      
      // 返回效果对象
      return {
        id: containerId,
        type: 'matrixRain',
        container: container,
        canvas: canvas,
        
        // 更新函数 - 用于渲染循环
        update: draw,
        
        // 暂停效果
        pause: function() {
          isPaused = true;
        },
        
        // 恢复效果
        resume: function() {
          isPaused = false;
        },
        
        // 更新设置
        updateOptions: function(newOptions) {
          Object.assign(settings, newOptions);
          
          // 应用新设置
          container.style.opacity = settings.opacity;
          container.style.zIndex = settings.zIndex;
          
          // 性能级别更新
          if (newOptions.performanceLevel) {
            settings.performanceLevel = newOptions.performanceLevel;
          }
          
          return this;
        },
        
        // 销毁效果
        destroy: function() {
          window.removeEventListener('resize', handleResize);
          if (container.parentNode) {
            container.parentNode.removeChild(container);
          }
        }
      };
    },
    
    /**
     * 分形图案效果
     */
    fractals: function(options = {}) {
      const settings = Object.assign({}, defaultConfig, {
        color: '#0066ff',      // 分形颜色
        type: 'julia',         // 分形类型: julia, mandelbrot
        zoom: 1.0,             // 缩放级别
        rotationSpeed: 0.001,  // 旋转速度
        iterations: 100        // 迭代次数
      }, options);
      
      // 创建容器
      const containerId = 'xi-bg-fractals-' + Date.now();
      const container = XiVisualCore.utils.createContainer(containerId, settings.zIndex);
      container.style.opacity = settings.opacity;
      
      // 创建canvas
      const canvas = XiVisualCore.utils.createCanvas(container, containerId + '-canvas');
      const ctx = canvas.getContext('2d');
      
      // 分形参数
      let zoom = settings.zoom;
      let angle = 0;
      let centerX = 0;
      let centerY = 0;
      let juliaConstant = { x: -0.7, y: 0.27 };
      
      // 性能相关参数
      let lastFrameTime = 0;
      let isPaused = false;
      let iterations = settings.iterations;
      
      // 设置性能级别相关参数
      function setPerformanceParameters() {
        if (settings.performanceLevel === 'low') {
          iterations = Math.min(50, settings.iterations);
        } else if (settings.performanceLevel === 'medium') {
          iterations = Math.min(100, settings.iterations);
        } else {
          iterations = settings.iterations;
        }
      }
      
      // 计算Julia集
      function computeJulia(x, y) {
        let zx = x;
        let zy = y;
        
        for (let i = 0; i < iterations; i++) {
          // z = z^2 + c
          const tmp = zx * zx - zy * zy + juliaConstant.x;
          zy = 2 * zx * zy + juliaConstant.y;
          zx = tmp;
          
          if (zx * zx + zy * zy > 4) {
            return i / iterations;
          }
        }
        
        return 0;
      }
      
      // 计算Mandelbrot集
      function computeMandelbrot(x, y) {
        let zx = 0;
        let zy = 0;
        const cx = x;
        const cy = y;
        
        for (let i = 0; i < iterations; i++) {
          // z = z^2 + c
          const tmp = zx * zx - zy * zy + cx;
          zy = 2 * zx * zy + cy;
          zx = tmp;
          
          if (zx * zx + zy * zy > 4) {
            return i / iterations;
          }
        }
        
        return 0;
      }
      
      // 彩色渲染
      function colorize(value) {
        const rgb = hslToRgb(value, 0.8, 0.5);
        return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
      }
      
      // HSL转RGB
      function hslToRgb(h, s, l) {
        let r, g, b;
        
        if (s === 0) {
          r = g = b = l;
        } else {
          const hue2rgb = function(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
          };
          
          const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
          const p = 2 * l - q;
          
          r = hue2rgb(p, q, h + 1/3);
          g = hue2rgb(p, q, h);
          b = hue2rgb(p, q, h - 1/3);
        }
        
        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
      }
      
      // 绘制函数
      function draw(timestamp) {
        if (isPaused) return;
        
        // 限制帧率
        const elapsed = timestamp - lastFrameTime;
        const fps = settings.performanceLevel === 'low' ? 10 : 
                   settings.performanceLevel === 'medium' ? 20 : 30;
        
        if (elapsed < 1000 / fps) return;
        lastFrameTime = timestamp;
        
        // 清空画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 计算缩放和旋转
        centerX = canvas.width / 2;
        centerY = canvas.height / 2;
        angle += settings.rotationSpeed;
        
        // 像素大小（低性能时使用更大的像素）
        const pixelSize = settings.performanceLevel === 'low' ? 4 : 
                         settings.performanceLevel === 'medium' ? 2 : 1;
        
        // 绘制分形
        const scale = 1.5 / (zoom * Math.min(canvas.width, canvas.height));
        
        for (let y = 0; y < canvas.height; y += pixelSize) {
          for (let x = 0; x < canvas.width; x += pixelSize) {
            // 坐标变换（中心平移和旋转）
            const dx = (x - centerX) * scale;
            const dy = (y - centerY) * scale;
            
            // 旋转变换
            const rx = dx * Math.cos(angle) - dy * Math.sin(angle);
            const ry = dx * Math.sin(angle) + dy * Math.cos(angle);
            
            // 计算分形值
            const value = settings.type === 'julia' ? 
                          computeJulia(rx, ry) : 
                          computeMandelbrot(rx, ry);
            
            if (value > 0) {
              ctx.fillStyle = colorize(value);
              ctx.fillRect(x, y, pixelSize, pixelSize);
            }
          }
        }
      }
      
      // 响应窗口大小变化
      function handleResize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        centerX = canvas.width / 2;
        centerY = canvas.height / 2;
      }
      
      // 监听窗口大小变化
      window.addEventListener('resize', handleResize);
      
      // 首次调整大小和性能参数
      handleResize();
      setPerformanceParameters();
      
      // 返回效果对象
      return {
        id: containerId,
        type: 'fractals',
        container: container,
        canvas: canvas,
        
        // 更新函数 - 用于渲染循环
        update: draw,
        
        // 暂停效果
        pause: function() {
          isPaused = true;
        },
        
        // 恢复效果
        resume: function() {
          isPaused = false;
        },
        
        // 更新设置
        updateOptions: function(newOptions) {
          Object.assign(settings, newOptions);
          
          // 应用新设置
          container.style.opacity = settings.opacity;
          container.style.zIndex = settings.zIndex;
          
          // 更新分形参数
          if (newOptions.zoom) zoom = newOptions.zoom;
          if (newOptions.type) settings.type = newOptions.type;
          
          // 性能级别更新
          if (newOptions.performanceLevel) {
            settings.performanceLevel = newOptions.performanceLevel;
            setPerformanceParameters();
          }
          
          return this;
        },
        
        // 缩放控制
        setZoom: function(newZoom) {
          zoom = newZoom;
          return this;
        },
        
        // 销毁效果
        destroy: function() {
          window.removeEventListener('resize', handleResize);
          if (container.parentNode) {
            container.parentNode.removeChild(container);
          }
        }
      };
    }
  };
  
  // API接口
  return {
    /**
     * 初始化背景效果模块
     */
    init: function() {
      if (!checkDependencies()) return false;
      console.log('[XiVisualBackground] 背景效果模块初始化完成');
      return true;
    },
    
    /**
     * 添加背景效果
     * @param {string} effectName - 效果名称
     * @param {Object} options - 配置选项
     * @returns {Object} 效果实例
     */
    add: function(effectName, options = {}) {
      if (!effects[effectName]) {
        console.warn(`[XiVisualBackground] 未知的背景效果: ${effectName}`);
        return null;
      }
      
      try {
        // 设置性能级别
        options.performanceLevel = options.performanceLevel || 
                                   XiVisualCore.getState().performanceLevel;
        
        // 创建效果实例
        const instance = effects[effectName](options);
        effectInstances[instance.id] = instance;
        
        // 注册到核心系统
        XiVisualCore.registerEffect('background', effectName, instance);
        
        return instance;
      } catch (error) {
        console.error(`[XiVisualBackground] 应用${effectName}效果时出错:`, error);
        return null;
      }
    },
    
    /**
     * 移除背景效果
     * @param {string} id - 效果ID
     * @returns {boolean} 是否成功移除
     */
    remove: function(id) {
      const instance = effectInstances[id];
      if (!instance) return false;
      
      // 销毁效果实例
      if (instance.destroy) {
        instance.destroy();
      }
      
      // 从实例集合中移除
      delete effectInstances[id];
      
      // 从核心系统注销
      XiVisualCore.unregisterEffect(id);
      
      return true;
    },
    
    /**
     * 获取所有可用背景效果
     * @returns {Array} 效果名称列表
     */
    list: function() {
      return Object.keys(effects);
    },
    
    /**
     * 获取特定效果实例
     * @param {string} id - 效果ID
     * @returns {Object} 效果实例
     */
    get: function(id) {
      return effectInstances[id] || null;
    },
    
    /**
     * 更新背景效果设置
     * @param {string} id - 效果ID
     * @param {Object} options - 新的配置选项
     * @returns {Object|null} 更新后的效果实例
     */
    update: function(id, options = {}) {
      const instance = effectInstances[id];
      if (!instance || !instance.updateOptions) return null;
      
      return instance.updateOptions(options);
    }
  };
})();

// 自动初始化
if (typeof XiVisualCore !== 'undefined') {
  document.addEventListener('DOMContentLoaded', function() {
    XiVisualBackground.init();
  });
}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
  module.exports = XiVisualBackground;
} else if (typeof window !== 'undefined') {
  window.XiVisualBackground = XiVisualBackground;
} 