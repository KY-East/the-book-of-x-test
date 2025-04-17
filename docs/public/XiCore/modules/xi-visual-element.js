/**
 * xi-visual-element.js - XiCore元素视觉效果模块
 * 
 * 提供应用到DOM元素上的视觉装饰效果功能
 * 
 * 版本: 2.0.0
 * 日期: 2024-08-02
 */

const XiVisualElement = (function() {
  // 默认配置
  const defaultConfig = {
    duration: 2000,     // 效果持续时间(ms)
    loop: true,         // 是否循环播放
    intensity: 0.5      // 效果强度(0-1)
  };
  
  // 效果实例集合
  const effectInstances = {};
  
  // 检查依赖项
  function checkDependencies() {
    if (typeof XiVisualCore === 'undefined') {
      console.error('[XiVisualElement] 错误: 找不到XiVisualCore模块');
      return false;
    }
    return true;
  }
  
  // 注入CSS样式
  function injectStyles() {
    const styles = `
      /* 元素效果基础样式 */
      [class*="xi-element-effect"] {
        position: relative;
      }
      
      /* 发光边框效果 */
      .xi-element-effect-glowBorder {
        box-shadow: 0 0 5px rgba(var(--xi-glow-color, 0, 255, 157), 0.5),
                    0 0 10px rgba(var(--xi-glow-color, 0, 255, 157), 0.3);
      }
      
      .xi-element-effect-glowBorder.xi-element-pulse {
        animation: xi-glow-pulse var(--xi-pulse-duration, 2s) infinite ease-in-out;
      }
      
      @keyframes xi-glow-pulse {
        0% { box-shadow: 0 0 5px rgba(var(--xi-glow-color, 0, 255, 157), 0.5),
                         0 0 10px rgba(var(--xi-glow-color, 0, 255, 157), 0.3); }
        50% { box-shadow: 0 0 10px rgba(var(--xi-glow-color, 0, 255, 157), 0.8),
                          0 0 20px rgba(var(--xi-glow-color, 0, 255, 157), 0.5),
                          0 0 30px rgba(var(--xi-glow-color, 0, 255, 157), 0.3); }
        100% { box-shadow: 0 0 5px rgba(var(--xi-glow-color, 0, 255, 157), 0.5),
                           0 0 10px rgba(var(--xi-glow-color, 0, 255, 157), 0.3); }
      }
      
      /* 扫描线效果 */
      .xi-element-effect-scanLine {
        position: relative;
        overflow: hidden;
      }
      
      .xi-element-effect-scanLine::before {
        content: "";
        position: absolute;
        width: 100%;
        height: 2px;
        background-color: rgba(var(--xi-scan-color, 0, 255, 255), 0.8);
        top: 0;
        left: 0;
        z-index: 1;
        animation: xi-scan-line var(--xi-scan-duration, 2s) linear infinite;
      }
      
      @keyframes xi-scan-line {
        0% { top: 0; }
        100% { top: 100%; }
      }
      
      /* 全息效果 */
      .xi-element-effect-hologram {
        position: relative;
        z-index: 1;
      }
      
      .xi-element-effect-hologram::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, 
                                    rgba(var(--xi-hologram-color-1, 0, 255, 255), 0.2) 0%,
                                    rgba(var(--xi-hologram-color-2, 255, 0, 255), 0.1) 50%,
                                    rgba(var(--xi-hologram-color-1, 0, 255, 255), 0.2) 100%);
        z-index: -1;
        opacity: 0.7;
        animation: xi-hologram-shift 3s infinite linear;
      }
      
      .xi-element-effect-hologram::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(var(--xi-hologram-lines, 0, 255, 255), 0.1) 2px,
          rgba(var(--xi-hologram-lines, 0, 255, 255), 0.1) 4px
        );
        z-index: -1;
        opacity: var(--xi-hologram-intensity, 0.5);
        animation: xi-hologram-flicker 0.2s infinite alternate-reverse;
      }
      
      @keyframes xi-hologram-shift {
        0% { background-position: 0% 0%; }
        100% { background-position: 200% 200%; }
      }
      
      @keyframes xi-hologram-flicker {
        0% { opacity: var(--xi-hologram-intensity, 0.5); }
        100% { opacity: calc(var(--xi-hologram-intensity, 0.5) * 0.7); }
      }
      
      /* 脉冲边框效果 */
      .xi-element-effect-pulseBorder {
        position: relative;
      }
      
      .xi-element-effect-pulseBorder::before {
        content: "";
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        border: 2px solid rgba(var(--xi-pulse-border-color, 0, 255, 157), 0.8);
        animation: xi-pulse-border var(--xi-pulse-duration, 2s) infinite ease-in-out;
        pointer-events: none;
        z-index: 1;
      }
      
      @keyframes xi-pulse-border {
        0% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.05); opacity: 0.5; }
        100% { transform: scale(1); opacity: 1; }
      }
      
      /* 高亮效果 */
      .xi-element-effect-highlight {
        position: relative;
        z-index: 1;
      }
      
      .xi-element-effect-highlight::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(var(--xi-highlight-color, 255, 255, 0), 0.2);
        z-index: -1;
        animation: xi-highlight-pulse var(--xi-highlight-duration, 1.5s) infinite ease-in-out;
      }
      
      @keyframes xi-highlight-pulse {
        0% { opacity: 0.2; }
        50% { opacity: 0.4; }
        100% { opacity: 0.2; }
      }
    `;
    
    XiVisualCore.resources.injectStyle(styles, 'xi-visual-element-styles');
  }
  
  // 元素效果实现
  const effects = {
    /**
     * 发光边框效果
     */
    glowBorder: function(element, options = {}) {
      const settings = Object.assign({}, defaultConfig, {
        color: '0, 255, 157', // 发光颜色 (RGB格式)
        pulse: true,          // 是否脉冲
        intensity: 0.7        // 发光强度(0-1)
      }, options);
      
      // 添加样式
      element.classList.add('xi-element-effect', 'xi-element-effect-glowBorder');
      element.style.setProperty('--xi-glow-color', settings.color);
      element.style.setProperty('--xi-glow-intensity', settings.intensity);
      
      // 脉冲效果
      if (settings.pulse) {
        element.classList.add('xi-element-pulse');
        element.style.setProperty('--xi-pulse-duration', (settings.duration / 1000) + 's');
      }
      
      // 如果不是循环模式且脉冲开启，设置结束后移除
      if (!settings.loop && settings.pulse) {
        setTimeout(() => {
          element.classList.remove('xi-element-pulse');
        }, settings.duration * 3);
      }
      
      // 返回效果对象
      return {
        id: element.id || 'xi-element-glowBorder-' + Date.now(),
        element: element,
        stop: function() {
          element.classList.remove('xi-element-effect-glowBorder', 'xi-element-pulse');
        },
        start: function() {
          element.classList.add('xi-element-effect-glowBorder');
          if (settings.pulse) {
            element.classList.add('xi-element-pulse');
          }
        },
        update: function(newOptions) {
          Object.assign(settings, newOptions);
          
          element.style.setProperty('--xi-glow-color', settings.color);
          element.style.setProperty('--xi-glow-intensity', settings.intensity);
          
          if (settings.pulse) {
            element.classList.add('xi-element-pulse');
            element.style.setProperty('--xi-pulse-duration', (settings.duration / 1000) + 's');
          } else {
            element.classList.remove('xi-element-pulse');
          }
          
          return this;
        }
      };
    },
    
    /**
     * 扫描线效果
     */
    scanLine: function(element, options = {}) {
      const settings = Object.assign({}, defaultConfig, {
        color: '0, 255, 255', // 扫描线颜色 (RGB格式)
        speed: 2              // 扫描速度(秒)
      }, options);
      
      // 添加样式
      element.classList.add('xi-element-effect', 'xi-element-effect-scanLine');
      element.style.setProperty('--xi-scan-color', settings.color);
      element.style.setProperty('--xi-scan-duration', settings.speed + 's');
      
      // 如果不是循环模式，设置结束后移除
      if (!settings.loop) {
        setTimeout(() => {
          element.classList.remove('xi-element-effect-scanLine');
        }, settings.duration);
      }
      
      // 返回效果对象
      return {
        id: element.id || 'xi-element-scanLine-' + Date.now(),
        element: element,
        stop: function() {
          element.classList.remove('xi-element-effect-scanLine');
        },
        start: function() {
          element.classList.add('xi-element-effect-scanLine');
        },
        update: function(newOptions) {
          Object.assign(settings, newOptions);
          
          element.style.setProperty('--xi-scan-color', settings.color);
          element.style.setProperty('--xi-scan-duration', settings.speed + 's');
          
          return this;
        }
      };
    },
    
    /**
     * 全息效果
     */
    hologram: function(element, options = {}) {
      const settings = Object.assign({}, defaultConfig, {
        color1: '0, 255, 255',  // 第一个全息颜色 (RGB格式)
        color2: '255, 0, 255',  // 第二个全息颜色 (RGB格式)
        lineColor: '0, 255, 255', // 扫描线颜色 (RGB格式)
        intensity: 0.5           // 全息效果强度(0-1)
      }, options);
      
      // 添加样式
      element.classList.add('xi-element-effect', 'xi-element-effect-hologram');
      element.style.setProperty('--xi-hologram-color-1', settings.color1);
      element.style.setProperty('--xi-hologram-color-2', settings.color2);
      element.style.setProperty('--xi-hologram-lines', settings.lineColor);
      element.style.setProperty('--xi-hologram-intensity', settings.intensity);
      
      // 如果不是循环模式，设置结束后移除
      if (!settings.loop) {
        setTimeout(() => {
          element.classList.remove('xi-element-effect-hologram');
        }, settings.duration);
      }
      
      // 返回效果对象
      return {
        id: element.id || 'xi-element-hologram-' + Date.now(),
        element: element,
        stop: function() {
          element.classList.remove('xi-element-effect-hologram');
        },
        start: function() {
          element.classList.add('xi-element-effect-hologram');
        },
        update: function(newOptions) {
          Object.assign(settings, newOptions);
          
          element.style.setProperty('--xi-hologram-color-1', settings.color1);
          element.style.setProperty('--xi-hologram-color-2', settings.color2);
          element.style.setProperty('--xi-hologram-lines', settings.lineColor);
          element.style.setProperty('--xi-hologram-intensity', settings.intensity);
          
          return this;
        }
      };
    },
    
    /**
     * 脉冲边框效果
     */
    pulseBorder: function(element, options = {}) {
      const settings = Object.assign({}, defaultConfig, {
        color: '0, 255, 157', // 边框颜色 (RGB格式)
        speed: 2              // 脉冲速度(秒)
      }, options);
      
      // 添加样式
      element.classList.add('xi-element-effect', 'xi-element-effect-pulseBorder');
      element.style.setProperty('--xi-pulse-border-color', settings.color);
      element.style.setProperty('--xi-pulse-duration', settings.speed + 's');
      
      // 如果不是循环模式，设置结束后移除
      if (!settings.loop) {
        setTimeout(() => {
          element.classList.remove('xi-element-effect-pulseBorder');
        }, settings.duration);
      }
      
      // 返回效果对象
      return {
        id: element.id || 'xi-element-pulseBorder-' + Date.now(),
        element: element,
        stop: function() {
          element.classList.remove('xi-element-effect-pulseBorder');
        },
        start: function() {
          element.classList.add('xi-element-effect-pulseBorder');
        },
        update: function(newOptions) {
          Object.assign(settings, newOptions);
          
          element.style.setProperty('--xi-pulse-border-color', settings.color);
          element.style.setProperty('--xi-pulse-duration', settings.speed + 's');
          
          return this;
        }
      };
    },
    
    /**
     * 高亮效果
     */
    highlight: function(element, options = {}) {
      const settings = Object.assign({}, defaultConfig, {
        color: '255, 255, 0', // 高亮颜色 (RGB格式)
        speed: 1.5            // 高亮脉冲速度(秒)
      }, options);
      
      // 添加样式
      element.classList.add('xi-element-effect', 'xi-element-effect-highlight');
      element.style.setProperty('--xi-highlight-color', settings.color);
      element.style.setProperty('--xi-highlight-duration', settings.speed + 's');
      
      // 如果不是循环模式，设置结束后移除
      if (!settings.loop) {
        setTimeout(() => {
          element.classList.remove('xi-element-effect-highlight');
        }, settings.duration);
      }
      
      // 返回效果对象
      return {
        id: element.id || 'xi-element-highlight-' + Date.now(),
        element: element,
        stop: function() {
          element.classList.remove('xi-element-effect-highlight');
        },
        start: function() {
          element.classList.add('xi-element-effect-highlight');
        },
        update: function(newOptions) {
          Object.assign(settings, newOptions);
          
          element.style.setProperty('--xi-highlight-color', settings.color);
          element.style.setProperty('--xi-highlight-duration', settings.speed + 's');
          
          return this;
        }
      };
    }
  };
  
  // API接口
  return {
    /**
     * 初始化元素效果模块
     */
    init: function() {
      if (!checkDependencies()) return false;
      injectStyles();
      console.log('[XiVisualElement] 元素效果模块初始化完成');
      return true;
    },
    
    /**
     * 添加元素效果
     * @param {string} effectName - 效果名称
     * @param {Element} element - 目标元素
     * @param {Object} options - 配置选项
     * @returns {Object} 效果实例
     */
    add: function(effectName, element, options = {}) {
      if (!effects[effectName]) {
        console.warn(`[XiVisualElement] 未知的元素效果: ${effectName}`);
        return null;
      }
      
      try {
        // 创建效果实例
        const instance = effects[effectName](element, options);
        effectInstances[instance.id] = instance;
        
        // 注册到核心系统
        XiVisualCore.registerEffect('element', effectName, instance);
        
        return instance;
      } catch (error) {
        console.error(`[XiVisualElement] 应用${effectName}效果时出错:`, error);
        return null;
      }
    },
    
    /**
     * 移除元素效果
     * @param {string} id - 效果ID
     * @returns {boolean} 是否成功移除
     */
    remove: function(id) {
      const instance = effectInstances[id];
      if (!instance) return false;
      
      // 停止效果
      if (instance.stop) {
        instance.stop();
      }
      
      // 从实例集合中移除
      delete effectInstances[id];
      
      // 从核心系统注销
      XiVisualCore.unregisterEffect(id);
      
      return true;
    },
    
    /**
     * 获取所有可用元素效果
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
     * 更新元素效果设置
     * @param {string} id - 效果ID
     * @param {Object} options - 新的配置选项
     * @returns {Object|null} 更新后的效果实例
     */
    update: function(id, options = {}) {
      const instance = effectInstances[id];
      if (!instance || !instance.update) return null;
      
      return instance.update(options);
    }
  };
})();

// 自动初始化
if (typeof XiVisualCore !== 'undefined') {
  document.addEventListener('DOMContentLoaded', function() {
    XiVisualElement.init();
  });
}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
  module.exports = XiVisualElement;
} else if (typeof window !== 'undefined') {
  window.XiVisualElement = XiVisualElement;
} 