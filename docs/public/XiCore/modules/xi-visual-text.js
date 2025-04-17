/**
 * xi-visual-text.js - XiCore文本视觉效果模块
 * 
 * 提供各种文本视觉效果功能，如故障效果、打字机效果等
 * 
 * 版本: 2.0.0
 * 日期: 2024-08-02
 */

const XiVisualText = (function() {
  // 默认配置
  const defaultConfig = {
    duration: 1000,     // 效果持续时间(ms)
    loop: false,        // 是否循环播放
    intensity: 0.5      // 效果强度(0-1)
  };
  
  // 效果实例集合
  const effectInstances = {};
  
  // 检查依赖项
  function checkDependencies() {
    if (typeof XiVisualCore === 'undefined') {
      console.error('[XiVisualText] 错误: 找不到XiVisualCore模块');
      return false;
    }
    return true;
  }
  
  // 注入CSS样式
  function injectStyles() {
    const styles = `
      /* 文本效果基础样式 */
      [class*="xi-text-effect"] {
        display: inline-block;
        position: relative;
      }
      
      /* 故障效果 */
      .xi-text-effect-glitch {
        position: relative;
        display: inline-block;
      }
      
      .xi-text-effect-glitch::before,
      .xi-text-effect-glitch::after {
        content: attr(data-text);
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0.8;
      }
      
      .xi-text-effect-glitch::before {
        color: #0ff;
        z-index: -1;
        animation: xi-glitch-anim-1 0.4s ease-in-out infinite alternate-reverse;
      }
      
      .xi-text-effect-glitch::after {
        color: #f0f;
        z-index: -2;
        animation: xi-glitch-anim-2 0.3s ease-in-out infinite alternate-reverse;
      }
      
      @keyframes xi-glitch-anim-1 {
        0% { transform: translate(0); }
        20% { transform: translate(-3px, 2px); }
        40% { transform: translate(-2px, -2px); }
        60% { transform: translate(2px, 1px); }
        80% { transform: translate(1px, -1px); }
        100% { transform: translate(0); }
      }
      
      @keyframes xi-glitch-anim-2 {
        0% { transform: translate(0); }
        20% { transform: translate(3px, -2px); }
        40% { transform: translate(2px, 2px); }
        60% { transform: translate(-2px, -1px); }
        80% { transform: translate(-1px, 1px); }
        100% { transform: translate(0); }
      }
      
      /* 打字机效果 */
      .xi-text-effect-typewriter {
        display: inline-block;
        overflow: hidden;
        white-space: nowrap;
        border-right: 2px solid;
        animation: xi-typewriter-cursor 0.7s step-end infinite;
        width: 0;
      }
      
      @keyframes xi-typewriter-cursor {
        from, to { border-color: transparent; }
        50% { border-color: currentColor; }
      }
      
      /* 脉冲效果 */
      .xi-text-effect-pulse {
        animation: xi-pulse 1.5s ease-in-out infinite;
      }
      
      @keyframes xi-pulse {
        0% { opacity: 1; text-shadow: 0 0 0 rgba(var(--xi-text-glow-color, 0, 255, 157), 0); }
        50% { opacity: 0.8; text-shadow: 0 0 8px rgba(var(--xi-text-glow-color, 0, 255, 157), 0.8); }
        100% { opacity: 1; text-shadow: 0 0 0 rgba(var(--xi-text-glow-color, 0, 255, 157), 0); }
      }
      
      /* 抖动效果 */
      .xi-text-effect-shake {
        animation: xi-shake 0.5s ease-in-out;
      }
      
      @keyframes xi-shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
        20%, 40%, 60%, 80% { transform: translateX(2px); }
      }
      
      /* 翻转效果 */
      .xi-text-effect-flip {
        animation: xi-flip 0.5s ease-out;
        transform-style: preserve-3d;
        perspective: 500px;
      }
      
      @keyframes xi-flip {
        0% { transform: rotateX(90deg); opacity: 0; }
        100% { transform: rotateX(0deg); opacity: 1; }
      }
      
      /* 扫描效果 */
      .xi-text-effect-scan {
        position: relative;
        overflow: hidden;
      }
      
      .xi-text-effect-scan::after {
        content: "";
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, 
          rgba(var(--xi-text-scan-color, 0, 255, 157), 0) 0%, 
          rgba(var(--xi-text-scan-color, 0, 255, 157), 0.5) 50%, 
          rgba(var(--xi-text-scan-color, 0, 255, 157), 0) 100%);
        animation: xi-scan 2s linear infinite;
      }
      
      @keyframes xi-scan {
        0% { left: -100%; }
        100% { left: 200%; }
      }
      
      /* 手写文本效果 */
      .xi-text-effect-handwritten {
        font-family: 'Caveat', cursive, sans-serif;
        opacity: 0;
        animation: xi-handwritten 1s forwards;
      }
      
      @keyframes xi-handwritten {
        0% { opacity: 0; transform: translateY(10px); }
        100% { opacity: 1; transform: translateY(0); }
      }
    `;
    
    XiVisualCore.resources.injectStyle(styles, 'xi-visual-text-styles');
  }
  
  // 文本效果实现
  const effects = {
    /**
     * 故障效果
     */
    glitch: function(element, options = {}) {
      const settings = Object.assign({}, defaultConfig, options);
      
      // 保存原始文本
      const originalText = element.textContent;
      
      // 设置数据属性
      element.setAttribute('data-text', originalText);
      
      // 添加类
      element.classList.add('xi-text-effect', 'xi-text-effect-glitch');
      
      // 设置动画参数
      element.style.setProperty('--xi-glitch-intensity', settings.intensity);
      
      // 如果不是循环模式，设置动画结束后移除类
      if (!settings.loop) {
        element.style.animationIterationCount = 1;
        setTimeout(() => {
          element.classList.remove('xi-text-effect-glitch');
        }, settings.duration);
      }
      
      return {
        id: element.id || 'xi-text-glitch-' + Date.now(),
        element: element,
        stop: function() {
          element.classList.remove('xi-text-effect-glitch');
        },
        start: function() {
          element.classList.add('xi-text-effect-glitch');
        }
      };
    },
    
    /**
     * 打字机效果
     */
    typewriter: function(element, options = {}) {
      const settings = Object.assign({}, defaultConfig, {
        speed: 50, // 每个字符的打字速度(ms)
        startDelay: 0 // 开始打字前的延迟(ms)
      }, options);
      
      // 保存原始文本
      const originalText = element.textContent;
      const textLength = originalText.length;
      
      // 清空文本并添加类
      element.textContent = '';
      element.classList.add('xi-text-effect', 'xi-text-effect-typewriter');
      
      // 创建打字效果
      let charIndex = 0;
      
      const typeChar = function() {
        if (charIndex < textLength) {
          element.textContent += originalText.charAt(charIndex);
          charIndex++;
          
          // 计算当前应该显示的宽度（百分比）
          const widthPercent = (charIndex / textLength) * 100;
          element.style.width = `${widthPercent}%`;
          
          // 继续打字
          setTimeout(typeChar, settings.speed);
        } else {
          if (settings.loop) {
            // 如果循环，重置后重新开始
            setTimeout(() => {
              element.textContent = '';
              charIndex = 0;
              element.style.width = '0';
              setTimeout(typeChar, settings.speed);
            }, 1000);
          } else {
            // 如果不循环，移除动画
            element.style.borderRight = 'none';
          }
        }
      };
      
      // 开始打字效果
      setTimeout(typeChar, settings.startDelay);
      
      return {
        id: element.id || 'xi-text-typewriter-' + Date.now(),
        element: element,
        stop: function() {
          // 停止效果，直接显示完整文本
          element.textContent = originalText;
          element.style.width = '100%';
          element.style.borderRight = 'none';
        },
        reset: function() {
          // 重置效果
          element.textContent = '';
          charIndex = 0;
          element.style.width = '0';
          setTimeout(typeChar, settings.speed);
        }
      };
    },
    
    /**
     * 脉冲效果
     */
    pulse: function(element, options = {}) {
      const settings = Object.assign({}, defaultConfig, {
        color: '0, 255, 157' // 脉冲颜色 (RGB格式)
      }, options);
      
      // 添加类和设置参数
      element.classList.add('xi-text-effect', 'xi-text-effect-pulse');
      element.style.setProperty('--xi-text-glow-color', settings.color);
      element.style.animationDuration = (settings.duration / 1000) + 's';
      
      // 如果不是循环模式，设置有限次数
      if (!settings.loop) {
        element.style.animationIterationCount = '3';
        setTimeout(() => {
          element.classList.remove('xi-text-effect-pulse');
        }, settings.duration * 3);
      }
      
      return {
        id: element.id || 'xi-text-pulse-' + Date.now(),
        element: element,
        stop: function() {
          element.classList.remove('xi-text-effect-pulse');
        },
        start: function() {
          element.classList.add('xi-text-effect-pulse');
        }
      };
    },
    
    /**
     * 抖动效果
     */
    shake: function(element, options = {}) {
      const settings = Object.assign({}, defaultConfig, {
        intensity: 2 // 抖动强度(px)
      }, options);
      
      // 添加类
      element.classList.add('xi-text-effect', 'xi-text-effect-shake');
      
      // 设置动画参数
      element.style.setProperty('--xi-shake-intensity', settings.intensity + 'px');
      
      // 默认抖动动画只执行一次，如果需要循环则设置
      if (settings.loop) {
        element.style.animationIterationCount = 'infinite';
      } else {
        setTimeout(() => {
          element.classList.remove('xi-text-effect-shake');
        }, settings.duration);
      }
      
      return {
        id: element.id || 'xi-text-shake-' + Date.now(),
        element: element,
        stop: function() {
          element.classList.remove('xi-text-effect-shake');
        },
        start: function() {
          element.classList.add('xi-text-effect-shake');
        }
      };
    },
    
    /**
     * 翻转效果
     */
    flip: function(element, options = {}) {
      const settings = Object.assign({}, defaultConfig, {
        direction: 'x' // 翻转方向: x, y
      }, options);
      
      // 添加类
      element.classList.add('xi-text-effect', 'xi-text-effect-flip');
      
      // 设置动画
      element.style.animationName = 'xi-flip-' + settings.direction;
      element.style.animationDuration = (settings.duration / 1000) + 's';
      
      // 翻转通常只执行一次
      if (settings.loop) {
        setTimeout(() => {
          element.style.animationIterationCount = 'infinite';
          element.style.animationDirection = 'alternate';
        }, settings.duration);
      } else {
        setTimeout(() => {
          element.classList.remove('xi-text-effect-flip');
        }, settings.duration);
      }
      
      return {
        id: element.id || 'xi-text-flip-' + Date.now(),
        element: element,
        stop: function() {
          element.classList.remove('xi-text-effect-flip');
        },
        start: function() {
          element.classList.add('xi-text-effect-flip');
        }
      };
    },
    
    /**
     * 扫描效果
     */
    scan: function(element, options = {}) {
      const settings = Object.assign({}, defaultConfig, {
        color: '0, 255, 157', // 扫描线颜色 (RGB格式)
        speed: 2 // 扫描速度(秒)
      }, options);
      
      // 添加类
      element.classList.add('xi-text-effect', 'xi-text-effect-scan');
      
      // 设置动画参数
      element.style.setProperty('--xi-text-scan-color', settings.color);
      element.style.setProperty('--xi-scan-speed', settings.speed + 's');
      
      // 如果不是循环模式，设置结束后移除
      if (!settings.loop) {
        setTimeout(() => {
          element.classList.remove('xi-text-effect-scan');
        }, settings.duration);
      }
      
      return {
        id: element.id || 'xi-text-scan-' + Date.now(),
        element: element,
        stop: function() {
          element.classList.remove('xi-text-effect-scan');
        },
        start: function() {
          element.classList.add('xi-text-effect-scan');
        }
      };
    },
    
    /**
     * 手写文本效果
     */
    handwritten: function(element, options = {}) {
      const settings = Object.assign({}, defaultConfig, {
        fontFamily: "'Caveat', cursive, sans-serif" // 手写字体
      }, options);
      
      // 保存原始字体
      const originalFont = element.style.fontFamily;
      
      // 添加类和设置字体
      element.classList.add('xi-text-effect', 'xi-text-effect-handwritten');
      element.style.fontFamily = settings.fontFamily;
      
      // 如果本地没有手写字体，尝试加载
      if (!document.fonts.check(`12px ${settings.fontFamily}`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=Caveat&display=swap';
        document.head.appendChild(link);
      }
      
      return {
        id: element.id || 'xi-text-handwritten-' + Date.now(),
        element: element,
        stop: function() {
          element.classList.remove('xi-text-effect-handwritten');
          element.style.fontFamily = originalFont;
        },
        start: function() {
          element.classList.add('xi-text-effect-handwritten');
          element.style.fontFamily = settings.fontFamily;
        }
      };
    }
  };
  
  // API接口
  return {
    /**
     * 初始化文本效果模块
     */
    init: function() {
      if (!checkDependencies()) return false;
      injectStyles();
      console.log('[XiVisualText] 文本效果模块初始化完成');
      return true;
    },
    
    /**
     * 添加文本效果
     * @param {string} effectName - 效果名称
     * @param {Element} element - 目标元素
     * @param {Object} options - 配置选项
     * @returns {Object} 效果实例
     */
    add: function(effectName, element, options = {}) {
      if (!effects[effectName]) {
        console.warn(`[XiVisualText] 未知的文本效果: ${effectName}`);
        return null;
      }
      
      try {
        // 创建效果实例
        const instance = effects[effectName](element, options);
        effectInstances[instance.id] = instance;
        
        // 注册到核心系统
        XiVisualCore.registerEffect('text', effectName, instance);
        
        return instance;
      } catch (error) {
        console.error(`[XiVisualText] 应用${effectName}效果时出错:`, error);
        return null;
      }
    },
    
    /**
     * 移除文本效果
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
     * 获取所有可用文本效果
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
    }
  };
})();

// 自动初始化
if (typeof XiVisualCore !== 'undefined') {
  document.addEventListener('DOMContentLoaded', function() {
    XiVisualText.init();
  });
}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
  module.exports = XiVisualText;
} else if (typeof window !== 'undefined') {
  window.XiVisualText = XiVisualText;
} 