/**
 * xi-visual-core.js - XiCore纯模块化视觉效果系统核心
 * 
 * 提供纯模块化的视觉效果管理系统，摆脱主题限制
 * 
 * 版本: 2.0.0
 * 日期: 2024-08-02
 * 
 * !!!重要使用说明!!!
 * 1. 这是推荐的新系统！新章节开发应该使用此纯模块化系统而非主题系统。
 * 2. 使用方式：XiCore.visual.text/background/element.add() 等直接API，而不是XiCore.setTheme()
 * 3. 不依赖主题，可以自由组合各类效果，根据内容需求进行定制
 */

const XiVisualCore = (function() {
  // 状态管理
  const state = {
    initialized: false,
    effectInstances: {},
    effectCounter: 0,
    activeEffects: new Set(),
    performanceLevel: 'auto',
    paused: false,
    animationFrameId: null
  };
  
  // 工具函数
  const utils = {
    /**
     * 检测系统性能
     */
    detectPerformance: function() {
      if (state.performanceLevel !== 'auto') {
        return state.performanceLevel;
      }
      
      const start = performance.now();
      let count = 0;
      while (performance.now() - start < 5) {
        count++;
      }
      
      let level = 'medium';
      if (count < 10000) level = 'low';
      else if (count > 50000) level = 'high';
      
      console.log(`[XiVisual] 检测到性能级别: ${level} (循环计数: ${count})`);
      return level;
    },
    
    /**
     * 创建效果容器
     */
    createContainer: function(id, zIndex = 0) {
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
      return container;
    },
    
    /**
     * 创建Canvas元素
     */
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
    
    /**
     * 检测移动设备
     */
    isMobileDevice: function() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },
    
    /**
     * 生成唯一ID
     */
    generateId: function(prefix = 'effect') {
      return `xi-${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    },
    
    /**
     * 合并默认选项
     */
    mergeOptions: function(defaults, options) {
      return {...defaults, ...options};
    }
  };
  
  // 渲染循环管理
  const renderer = {
    /**
     * 启动渲染循环
     */
    start: function() {
      if (state.paused || state.animationFrameId) return;
      
      const animate = function(timestamp) {
        if (state.paused) return;
        
        // 更新所有活跃效果
        state.activeEffects.forEach(effectId => {
          const effect = state.effectInstances[effectId];
          if (effect && effect.update) {
            effect.update(timestamp);
          }
        });
        
        state.animationFrameId = requestAnimationFrame(animate);
      };
      
      state.animationFrameId = requestAnimationFrame(animate);
    },
    
    /**
     * 停止渲染循环
     */
    stop: function() {
      if (state.animationFrameId) {
        cancelAnimationFrame(state.animationFrameId);
        state.animationFrameId = null;
      }
    }
  };
  
  // 效果注册管理
  const registry = {
    /**
     * 注册效果实例
     */
    register: function(category, type, instance) {
      const id = instance.id || utils.generateId(`${category}-${type}`);
      state.effectInstances[id] = instance;
      state.activeEffects.add(id);
      
      // 确保渲染循环正在运行
      renderer.start();
      
      return id;
    },
    
    /**
     * 注销效果实例
     */
    unregister: function(id) {
      if (!state.effectInstances[id]) return false;
      
      // 调用清理函数
      const instance = state.effectInstances[id];
      if (instance.destroy) {
        instance.destroy();
      }
      
      // 从管理器中移除
      delete state.effectInstances[id];
      state.activeEffects.delete(id);
      
      // 如果没有活跃效果，停止渲染循环
      if (state.activeEffects.size === 0) {
        renderer.stop();
      }
      
      return true;
    },
    
    /**
     * 获取效果实例
     */
    get: function(id) {
      return state.effectInstances[id] || null;
    }
  };
  
  // 资源管理
  const resources = {
    loaded: new Map(),
    loading: new Map(),
    
    /**
     * 加载脚本
     */
    loadScript: function(src) {
      if (this.loaded.has(src)) {
        return Promise.resolve(this.loaded.get(src));
      }
      
      if (this.loading.has(src)) {
        return this.loading.get(src);
      }
      
      const promise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => {
          this.loaded.set(src, script);
          resolve(script);
        };
        script.onerror = (err) => {
          reject(new Error(`无法加载脚本: ${src}`));
        };
        document.head.appendChild(script);
      });
      
      this.loading.set(src, promise);
      return promise;
    },
    
    /**
     * 加载样式
     */
    loadStyle: function(src) {
      if (this.loaded.has(src)) {
        return Promise.resolve(this.loaded.get(src));
      }
      
      if (this.loading.has(src)) {
        return this.loading.get(src);
      }
      
      const promise = new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = src;
        link.onload = () => {
          this.loaded.set(src, link);
          resolve(link);
        };
        link.onerror = (err) => {
          reject(new Error(`无法加载样式: ${src}`));
        };
        document.head.appendChild(link);
      });
      
      this.loading.set(src, promise);
      return promise;
    },
    
    /**
     * 注入内联样式
     */
    injectStyle: function(css, id) {
      if (id && document.getElementById(id)) {
        const existing = document.getElementById(id);
        existing.textContent = css;
        return existing;
      }
      
      const style = document.createElement('style');
      if (id) style.id = id;
      style.textContent = css;
      document.head.appendChild(style);
      return style;
    }
  };
  
  // 公开API
  return {
    /**
     * 初始化视觉效果系统
     */
    init: function(options = {}) {
      if (state.initialized) {
        console.log('[XiVisualCore] 系统已初始化，跳过');
        return;
      }
      
      // 合并选项
      const config = utils.mergeOptions({
        performanceLevel: 'auto',
        autoStart: true
      }, options);
      
      // 性能检测
      state.performanceLevel = config.performanceLevel;
      if (state.performanceLevel === 'auto') {
        state.performanceLevel = utils.detectPerformance();
      }
      
      state.initialized = true;
      console.log('[XiVisualCore] 视觉效果系统初始化完成');
      
      // 自动启动渲染循环
      if (config.autoStart) {
        renderer.start();
      }
      
      return this;
    },
    
    /**
     * 注册效果实例
     */
    registerEffect: function(category, type, instance) {
      return registry.register(category, type, instance);
    },
    
    /**
     * 注销效果实例
     */
    unregisterEffect: function(id) {
      return registry.unregister(id);
    },
    
    /**
     * 获取效果实例
     */
    getEffect: function(id) {
      return registry.get(id);
    },
    
    /**
     * 暂停所有效果
     */
    pause: function() {
      if (state.paused) return;
      
      state.paused = true;
      renderer.stop();
      
      // 暂停所有支持暂停的效果
      Object.values(state.effectInstances).forEach(instance => {
        if (instance && instance.pause) {
          instance.pause();
        }
      });
    },
    
    /**
     * 恢复所有效果
     */
    resume: function() {
      if (!state.paused) return;
      
      state.paused = false;
      
      // 恢复所有支持恢复的效果
      Object.values(state.effectInstances).forEach(instance => {
        if (instance && instance.resume) {
          instance.resume();
        }
      });
      
      // 重启渲染循环
      renderer.start();
    },
    
    /**
     * 获取系统状态
     */
    getState: function() {
      return {
        initialized: state.initialized,
        performanceLevel: state.performanceLevel,
        activeEffectCount: state.activeEffects.size,
        paused: state.paused
      };
    },
    
    /**
     * 设置性能级别
     */
    setPerformanceLevel: function(level) {
      if (!['low', 'medium', 'high', 'auto'].includes(level)) {
        console.warn(`[XiVisualCore] 无效的性能级别: ${level}`);
        return false;
      }
      
      state.performanceLevel = level;
      if (level === 'auto') {
        state.performanceLevel = utils.detectPerformance();
      }
      
      // 通知所有支持性能调整的效果
      Object.values(state.effectInstances).forEach(instance => {
        if (instance && instance.updatePerformance) {
          instance.updatePerformance(state.performanceLevel);
        }
      });
      
      return true;
    },
    
    /**
     * 获取工具函数
     */
    utils: utils,
    
    /**
     * 获取资源管理器
     */
    resources: resources
  };
})();

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
  module.exports = XiVisualCore;
} else if (typeof window !== 'undefined') {
  window.XiVisualCore = XiVisualCore;
} 