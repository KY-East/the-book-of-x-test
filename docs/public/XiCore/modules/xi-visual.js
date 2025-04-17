/**
 * xi-visual.js - XiCore视觉效果模块
 * 
 * 基于XiVisualEffects系统的适配器，提供与XiCore系统集成的视觉效果能力
 * 
 * 版本: 1.0.0
 * 日期: 2024-07-28
 * 
 * !!!警告!!!
 * 1. 不推荐在新章节中使用此模块!
 * 2. 这是与主题系统绑定的旧版视觉效果系统，仅用于维护现有章节
 * 3. 新章节请使用纯模块化视觉效果系统：
 *    - xi-visual-core.js
 *    - xi-visual-text.js
 *    - xi-visual-background.js
 *    - xi-visual-element.js
 */

const XiVisual = (function() {
  // 模块配置项
  const config = {
    defaultTheme: 'awakening',
    performanceLevel: 'auto',
    particleDensity: 1.0,
    showFPS: false,
    enableMobileEffects: true,
    autoDetectPerformance: true
  };
  
  // 状态管理
  const state = {
    initialized: false,
    currentTheme: null,
    themeTransitioning: false
  };
  
  // 原始XiVisualEffects系统引用
  let originalSystem = null;
  
  // 主题映射 - 将XiCore主题映射到XiVisualEffects主题
  const themeMapping = {
    'awakening': 'awakening',
    'oracle': 'oracle',
    'fractal': 'fractal',
    'judgment': 'judgment',
    'nirvana': 'nirvana'
  };
  
  // 主题转换 - 将XiCore主题配置转换为XiVisualEffects主题配置
  function translateTheme(coreTheme) {
    if (!coreTheme) return null;
    
    // 使用映射获取对应的视觉主题ID
    const visualThemeId = themeMapping[coreTheme.id] || 'awakening';
    
    // 如果原始系统没有此主题，使用默认
    if (originalSystem && 
        originalSystem.themes && 
        !originalSystem.themes.get(visualThemeId)) {
      return 'awakening';
    }
    
    return visualThemeId;
  }
  
  // 平滑过渡到新主题
  function smoothTransitionTheme(newThemeId) {
    if (state.themeTransitioning) return;
    
    state.themeTransitioning = true;
    
    // 创建过渡遮罩
    const transition = document.createElement('div');
    transition.className = 'theme-transition';
    transition.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.8);
      opacity: 0;
      transition: opacity 0.5s ease;
      z-index: 1000;
      pointer-events: none;
    `;
    
    document.body.appendChild(transition);
    
    // 淡入遮罩
    setTimeout(() => {
      transition.style.opacity = '1';
    }, 50);
    
    // 切换主题
    setTimeout(() => {
      // 应用新主题
      if (originalSystem && originalSystem.themes) {
        originalSystem.themes.apply(newThemeId);
      }
      
      // 淡出遮罩
      setTimeout(() => {
        transition.style.opacity = '0';
        
        // 移除遮罩
        setTimeout(() => {
          if (transition.parentNode) {
            transition.parentNode.removeChild(transition);
          }
          state.themeTransitioning = false;
        }, 500);
      }, 300);
    }, 550);
  }
  
  // 检查XiVisualEffects是否可用
  function checkOriginalSystem() {
    if (typeof window.XiVisualEffects !== 'undefined') {
      originalSystem = window.XiVisualEffects;
      return true;
    }
    return false;
  }
  
  // 判断是否需要加载原始系统
  async function loadOriginalSystemIfNeeded() {
    if (checkOriginalSystem()) {
      return true;
    }
    
    try {
      // 尝试加载脚本
      const basePath = getBasePath();
      await loadScript(`${basePath}XiVisualEffects/xi-visual-effects-system.js`);
      
      // 再次检查是否加载成功
      return checkOriginalSystem();
    } catch (error) {
      console.error('[XiVisual] 无法加载XiVisualEffects系统:', error);
      return false;
    }
  }
  
  // 获取基础路径
  function getBasePath() {
    if (window.location.hostname.includes('github.io')) {
      const pathParts = window.location.pathname.split('/');
      if (pathParts.length > 1) {
        return '/' + pathParts[1] + '/';
      }
    }
    return '/';
  }
  
  // 加载脚本
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`无法加载脚本: ${src}`));
      document.head.appendChild(script);
    });
  }
  
  // 模块API
  const api = {
    /**
     * 初始化视觉效果模块
     */
    async init(options = {}) {
      if (state.initialized) {
        console.log('[XiVisual] 已初始化');
        return;
      }
      
      // 合并配置
      Object.assign(config, options);
      
      // 加载原始系统
      const systemLoaded = await loadOriginalSystemIfNeeded();
      if (!systemLoaded) {
        console.error('[XiVisual] 无法初始化视觉效果模块 - XiVisualEffects未加载');
        return;
      }
      
      // 调用原始系统初始化
      originalSystem.init({
        defaultTheme: config.defaultTheme,
        performanceLevel: config.performanceLevel,
        particleDensity: config.particleDensity,
        showFPS: config.showFPS,
        enableMobileEffects: config.enableMobileEffects
      });
      
      state.initialized = true;
      state.currentTheme = config.defaultTheme;
      
      // 通知XiCore模块已准备好
      if (window.XiCore && window.XiCore.trigger) {
        window.XiCore.trigger('moduleReady', { name: 'visual' });
      }
      
      console.log('[XiVisual] 初始化完成');
    },
    
    /**
     * 应用主题
     */
    async applyTheme(theme) {
      if (!state.initialized) {
        console.warn('[XiVisual] 模块尚未初始化，无法应用主题');
        return false;
      }
      
      if (!theme || !theme.id) {
        console.error('[XiVisual] 无效的主题配置');
        return false;
      }
      
      // 转换主题ID
      const visualThemeId = translateTheme(theme);
      
      // 平滑过渡到新主题
      smoothTransitionTheme(visualThemeId);
      
      // 更新当前主题状态
      state.currentTheme = visualThemeId;
      
      return true;
    },
    
    /**
     * 添加视觉效果
     */
    addEffect(effectType, effectName, params = {}) {
      if (!state.initialized || !originalSystem) {
        console.warn('[XiVisual] 模块尚未初始化，无法添加效果');
        return null;
      }
      
      // 调用原始系统添加效果
      return originalSystem.effects.add(effectType, effectName, params);
    },
    
    /**
     * 移除视觉效果
     */
    removeEffect(effectId) {
      if (!state.initialized || !originalSystem) {
        console.warn('[XiVisual] 模块尚未初始化，无法移除效果');
        return false;
      }
      
      // 调用原始系统移除效果
      return originalSystem.effects.remove(effectId);
    },
    
    /**
     * 暂停所有视觉效果
     */
    pause() {
      if (!state.initialized || !originalSystem) {
        console.warn('[XiVisual] 模块尚未初始化，无法暂停效果');
        return false;
      }
      
      // 调用原始系统暂停
      return originalSystem.control.toggle();
    },
    
    /**
     * 恢复所有视觉效果
     */
    resume() {
      if (!state.initialized || !originalSystem) {
        console.warn('[XiVisual] 模块尚未初始化，无法恢复效果');
        return false;
      }
      
      // 如果已经活动则再次切换来恢复
      if (originalSystem.getState().paused) {
        return originalSystem.control.toggle();
      }
      
      return true;
    },
    
    /**
     * 清理所有视觉效果
     */
    clearAllEffects() {
      if (!state.initialized || !originalSystem) {
        console.warn('[XiVisual] 模块尚未初始化，无法清理效果');
        return false;
      }
      
      // 调用原始系统清理
      originalSystem.effects.clear();
      return true;
    },
    
    /**
     * 获取当前主题
     */
    getCurrentTheme() {
      return state.currentTheme;
    },
    
    /**
     * 获取可用效果列表
     */
    getAvailableEffects() {
      if (!state.initialized || !originalSystem) {
        console.warn('[XiVisual] 模块尚未初始化，无法获取效果列表');
        return [];
      }
      
      // 调用原始系统获取效果列表
      return originalSystem.getEffects();
    },
    
    /**
     * 获取系统状态
     */
    getState() {
      if (!state.initialized || !originalSystem) {
        return { ...state, originalSystemState: null };
      }
      
      return {
        ...state,
        originalSystemState: originalSystem.getState()
      };
    },
    
    /**
     * 销毁模块
     */
    destroy() {
      if (originalSystem) {
        originalSystem.destroy();
      }
      
      state.initialized = false;
      state.currentTheme = null;
      
      console.log('[XiVisual] 模块已销毁');
    }
  };
  
  // 如果XiCore已加载，则自动注册模块
  if (window.XiCore) {
    window.XiCore.registerModule('visual', api);
  }
  
  // 返回模块API
  return api;
})();

// 如果在Node环境中，则导出模块
if (typeof module !== 'undefined' && module.exports) {
  module.exports = XiVisual;
} 