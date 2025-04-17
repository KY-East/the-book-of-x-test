/**
 * xi-scroll.js - XiCore滚动效果模块
 * 
 * 提供与XiCore系统集成的滚动触发动画功能
 * 
 * 版本: 1.1.0
 * 日期: 2024-07-28
 */

const XiScroll = (function() {
  // 模块配置
  const config = {
    autoInit: true,
    themeEnabled: true,
    defaultOffset: 0.2, // 触发距离（为视口高度的比例）
    defaultThreshold: 0.1, // 交叉比例阈值
    defaultDelay: 0, // 默认延迟（毫秒）
    defaultDuration: 800, // 默认动画持续时间（毫秒）
    attributePrefix: 'data-xi-scroll', // 数据属性前缀
    animationClasses: {
      fadeIn: 'xi-scroll-fade-in',
      fadeInUp: 'xi-scroll-fade-in-up',
      fadeInDown: 'xi-scroll-fade-in-down',
      fadeInLeft: 'xi-scroll-fade-in-left',
      fadeInRight: 'xi-scroll-fade-in-right',
      zoomIn: 'xi-scroll-zoom-in',
      zoomOut: 'xi-scroll-zoom-out',
      slideIn: 'xi-scroll-slide-in',
      glitch: 'xi-scroll-glitch',
      typewriter: 'xi-scroll-typewriter',
      pulse: 'xi-scroll-pulse',
      shake: 'xi-scroll-shake',
      flip: 'xi-scroll-flip',
      techBriefing: 'xi-scroll-tech-briefing' // 新增技术简报逐项显示效果
    }
  };
  
  // 状态管理
  const state = {
    initialized: false,
    elementsRegistered: 0,
    currentTheme: null,
    originalSystemLoaded: false,
    observer: null
  };
  
  // 原始系统引用
  let originalSystem = null;
  
  // 元素集合
  const elements = new Map();
  
  // 样式元素引用
  let themeStyle = null;
  let baseStyle = null;
  
  // 为主题应用创建样式元素
  function createThemeStyleElement() {
    if (themeStyle) return themeStyle;
    
    themeStyle = document.createElement('style');
    themeStyle.id = 'xi-scroll-theme-style';
    document.head.appendChild(themeStyle);
    
    return themeStyle;
  }
  
  // 创建基础样式元素
  function createBaseStyleElement() {
    if (baseStyle) return baseStyle;
    
    baseStyle = document.createElement('style');
    baseStyle.id = 'xi-scroll-base-style';
    
    // 添加基础样式
    baseStyle.textContent = `
      /* 基础隐藏类 */
      .xi-scroll-hidden {
        visibility: hidden;
        opacity: 0;
        transition: visibility 0s, opacity 0.5s ease;
      }
      
      /* 显示类 */
      .xi-scroll-visible {
        visibility: visible;
        opacity: 1;
      }
      
      /* 淡入效果 */
      .xi-scroll-fade-in {
        animation-name: xiFadeIn;
      }
      
      /* 向上淡入 */
      .xi-scroll-fade-in-up {
        animation-name: xiFadeInUp;
      }
      
      /* 向下淡入 */
      .xi-scroll-fade-in-down {
        animation-name: xiFadeInDown;
      }
      
      /* 向左淡入 */
      .xi-scroll-fade-in-left {
        animation-name: xiFadeInLeft;
      }
      
      /* 向右淡入 */
      .xi-scroll-fade-in-right {
        animation-name: xiFadeInRight;
      }
      
      /* 放大淡入 */
      .xi-scroll-zoom-in {
        animation-name: xiZoomIn;
      }
      
      /* 缩小淡入 */
      .xi-scroll-zoom-out {
        animation-name: xiZoomOut;
      }
      
      /* 滑入效果 */
      .xi-scroll-slide-in {
        animation-name: xiSlideIn;
      }
      
      /* 故障效果 */
      .xi-scroll-glitch {
        animation-name: xiGlitch;
      }
      
      /* 打字机效果 */
      .xi-scroll-typewriter {
        animation-name: xiTypewriter;
        white-space: nowrap;
        overflow: hidden;
      }
      
      /* 脉冲效果 */
      .xi-scroll-pulse {
        animation-name: xiPulse;
      }
      
      /* 抖动效果 */
      .xi-scroll-shake {
        animation-name: xiShake;
      }
      
      /* 翻转效果 */
      .xi-scroll-flip {
        animation-name: xiFlip;
        perspective: 1000px;
      }
      
      /* 技术简报逐项显示效果 */
      .xi-scroll-tech-briefing {
        opacity: 1;
        transform: translateY(0);
      }
      
      .xi-scroll-tech-briefing li {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.5s ease, transform 0.5s ease;
      }
      
      .xi-scroll-tech-briefing.active li {
        opacity: 1;
        transform: translateY(0);
      }
      
      /* 动画基础类 */
      [class*="xi-scroll-"] {
        animation-duration: 800ms;
        animation-timing-function: ease;
        animation-fill-mode: both;
      }
      
      /* 动画关键帧 */
      @keyframes xiFadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes xiFadeInUp {
        from {
          opacity: 0;
          transform: translate3d(0, 40px, 0);
        }
        to {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }
      }
      
      @keyframes xiFadeInDown {
        from {
          opacity: 0;
          transform: translate3d(0, -40px, 0);
        }
        to {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }
      }
      
      @keyframes xiFadeInLeft {
        from {
          opacity: 0;
          transform: translate3d(-40px, 0, 0);
        }
        to {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }
      }
      
      @keyframes xiFadeInRight {
        from {
          opacity: 0;
          transform: translate3d(40px, 0, 0);
        }
        to {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }
      }
      
      @keyframes xiZoomIn {
        from {
          opacity: 0;
          transform: scale3d(0.3, 0.3, 0.3);
        }
        50% {
          opacity: 1;
        }
      }
      
      @keyframes xiZoomOut {
        from {
          opacity: 0;
          transform: scale3d(1.5, 1.5, 1.5);
        }
        50% {
          opacity: 1;
        }
      }
      
      @keyframes xiSlideIn {
        from {
          transform: translate3d(-100%, 0, 0);
          visibility: visible;
        }
        to {
          transform: translate3d(0, 0, 0);
        }
      }
      
      @keyframes xiGlitch {
        0% {
          transform: translate(0);
        }
        20% {
          transform: translate(-5px, 5px);
        }
        40% {
          transform: translate(5px, -5px);
        }
        60% {
          transform: translate(-5px, 5px);
        }
        80% {
          transform: translate(5px, -5px);
        }
        100% {
          transform: translate(0);
        }
      }
      
      @keyframes xiPulse {
        0% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.1);
        }
        100% {
          transform: scale(1);
        }
      }
      
      @keyframes xiShake {
        0%, 100% {
          transform: translateX(0);
        }
        10%, 30%, 50%, 70%, 90% {
          transform: translateX(-10px);
        }
        20%, 40%, 60%, 80% {
          transform: translateX(10px);
        }
      }
      
      @keyframes xiFlip {
        from {
          transform: perspective(400px) rotate3d(0, 1, 0, 90deg);
          animation-timing-function: ease-in;
          opacity: 0;
        }
        40% {
          transform: perspective(400px) rotate3d(0, 1, 0, -20deg);
          animation-timing-function: ease-in;
        }
        60% {
          transform: perspective(400px) rotate3d(0, 1, 0, 10deg);
          opacity: 1;
        }
        80% {
          transform: perspective(400px) rotate3d(0, 1, 0, -5deg);
        }
        to {
          transform: perspective(400px);
        }
      }
      
      @keyframes xiTypewriter {
        from { width: 0; }
        to { width: 100%; }
      }
    `;
    
    document.head.appendChild(baseStyle);
    
    return baseStyle;
  }
  
  // 应用主题样式
  function applyThemeStyle(themeConfig) {
    if (!themeConfig || !themeConfig.components || !themeConfig.components.scroll) {
      console.warn('[XiScroll] 主题配置中缺少滚动效果样式信息');
      return;
    }
    
    const style = themeConfig.components.scroll;
    const styleElement = createThemeStyleElement();
    
    // 构建主题CSS
    const css = `
      /* ${themeConfig.id} 主题滚动效果样式 */
      [class*="xi-scroll-"] {
        animation-duration: ${style.duration || '800ms'};
        animation-timing-function: ${style.timing || 'ease'};
      }
      
      /* 自定义主题动画关键帧 */
      @keyframes xiFadeInUp {
        from {
          opacity: 0;
          transform: translate3d(0, ${style.distance || '40px'}, 0);
        }
        to {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }
      }
      
      @keyframes xiGlitch {
        0% {
          transform: translate(0);
          text-shadow: 0 0 0 ${style.glowColor || 'transparent'};
        }
        20% {
          transform: translate(-3px, 3px);
          text-shadow: 0 0 3px ${style.glowColor || style.accentColor || '#00ff9d'};
        }
        40% {
          transform: translate(-3px, -3px);
          text-shadow: 0 0 3px ${style.glowColor || style.accentColor || '#00ff9d'};
        }
        60% {
          transform: translate(3px, 3px);
          text-shadow: 0 0 3px ${style.glowColor || style.accentColor || '#00ff9d'};
        }
        80% {
          transform: translate(3px, -3px);
          text-shadow: 0 0 3px ${style.glowColor || style.accentColor || '#00ff9d'};
        }
        100% {
          transform: translate(0);
          text-shadow: 0 0 0 transparent;
        }
      }
      
      /* 主题特定的滚动效果 */
      .xi-scroll-theme-effect {
        animation-name: ${style.customAnimation || 'xiFadeIn'};
        color: ${style.textColor || 'inherit'};
        text-shadow: 0 0 5px ${style.glowColor || 'rgba(0, 255, 157, 0.5)'};
      }
    `;
    
    styleElement.textContent = css;
    
    console.log('[XiScroll] 主题样式已应用');
  }
  
  // 检查原始系统是否可用
  function checkOriginalSystem() {
    return typeof window.ScrollAnimations !== 'undefined';
  }
  
  // 加载原始系统
  async function loadOriginalSystemIfNeeded() {
    if (checkOriginalSystem()) {
      originalSystem = window.ScrollAnimations;
      state.originalSystemLoaded = true;
      return true;
    }
    
    try {
      const basePath = getBasePath();
      await loadScript(`${basePath}components/scroll-animations.js`);
      
      // 再次检查是否加载成功
      if (checkOriginalSystem()) {
        originalSystem = window.ScrollAnimations;
        state.originalSystemLoaded = true;
        return true;
      } else {
        throw new Error('滚动动画脚本已加载但未能正确初始化');
      }
    } catch (error) {
      console.error('[XiScroll] 无法加载滚动动画组件:', error);
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
  
  // 初始化交叉观察器
  function initIntersectionObserver() {
    if (state.observer) {
      // 已经初始化过，先断开所有连接
      state.observer.disconnect();
    }
    
    const observerOptions = {
      root: null, // 使用视口
      rootMargin: `0px 0px ${-window.innerHeight * config.defaultOffset}px 0px`,
      threshold: config.defaultThreshold
    };
    
    state.observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        const element = entry.target;
        const elementData = elements.get(element);
        
        if (!elementData) return;
        
        if (entry.isIntersecting) {
          // 元素进入视口，应用动画
          setTimeout(() => {
            applyAnimation(element, elementData);
          }, elementData.delay || 0);
          
          // 如果只触发一次，则停止观察
          if (elementData.once) {
            observer.unobserve(element);
          }
        } else if (!elementData.once && elementData.reset) {
          // 元素离开视口，重置动画（如果启用了重置）
          resetAnimation(element, elementData);
        }
      });
    }, observerOptions);
    
    // 重新观察所有已注册的元素
    elements.forEach((data, element) => {
      state.observer.observe(element);
    });
  }
  
  // 查找具有滚动动画数据属性的元素
  function findScrollElements() {
    const prefix = config.attributePrefix;
    
    // 查找所有带有滚动属性的元素
    const foundElements = document.querySelectorAll(`[${prefix}],[${prefix}-animation]`);
    
    foundElements.forEach(element => {
      if (!elements.has(element)) {
        registerElement(element);
      }
    });
    
    return foundElements.length;
  }
  
  // 注册元素
  function registerElement(element) {
    const prefix = config.attributePrefix;
    
    // 获取元素的配置
    const animation = element.getAttribute(`${prefix}-animation`) || 'fadeIn';
    const delay = parseInt(element.getAttribute(`${prefix}-delay`)) || config.defaultDelay;
    const duration = parseInt(element.getAttribute(`${prefix}-duration`)) || config.defaultDuration;
    const once = element.hasAttribute(`${prefix}-once`) ? true : false;
    const reset = element.hasAttribute(`${prefix}-reset`) ? true : false;
    const offset = parseFloat(element.getAttribute(`${prefix}-offset`)) || config.defaultOffset;
    
    // 存储元素数据
    elements.set(element, {
      animation,
      delay,
      duration,
      once,
      reset,
      offset,
      active: false
    });
    
    // 初始隐藏元素
    element.classList.add('xi-scroll-hidden');
    
    // 如果有观察器，开始观察该元素
    if (state.observer) {
      state.observer.observe(element);
    }
    
    state.elementsRegistered++;
    
    return true;
  }
  
  // 应用动画效果
  function applyAnimation(element, data) {
    const { animation, duration, delay, once, className } = data;
    
    // 移除之前的动画类
    Object.values(config.animationClasses).forEach(cls => {
      element.classList.remove(cls);
    });
    
    // 应用新动画
    element.classList.add(className || animation);
    element.classList.add('xi-scroll-visible');
    
    // 设置动画持续时间和延迟
    if (duration) {
      element.style.animationDuration = `${duration}ms`;
    }
    
    if (delay) {
      element.style.animationDelay = `${delay}ms`;
    }
    
    // 处理技术简报特殊动画
    if (animation === 'techBriefing' || className === config.animationClasses.techBriefing) {
      const items = element.querySelectorAll('li');
      items.forEach((item, i) => {
        // 为每个列表项设置递增延迟
        const itemDelay = 150 * i; // 每项递增150ms
        item.style.transitionDelay = `${itemDelay}ms`;
      });
    }
    
    // 记录动画已触发
    data.triggered = true;
    
    // 如果是一次性动画，则从观察列表中移除
    if (once && state.observer) {
      state.observer.unobserve(element);
      elements.delete(element);
      state.elementsRegistered--;
    }
    
    // 触发回调
    if (typeof data.onVisible === 'function') {
      data.onVisible(element);
    }
  }
  
  // 重置动画
  function resetAnimation(element, data) {
    if (!data.active) return; // 已经处于非活动状态
    
    // 添加隐藏类
    element.classList.add('xi-scroll-hidden');
    element.classList.remove('xi-scroll-visible');
    
    // 移除动画类
    const animationClass = config.animationClasses[data.animation] || data.animation;
    element.classList.remove(animationClass);
    
    // 更新状态
    data.active = false;
    elements.set(element, data);
  }
  
  // 当窗口尺寸变化时重新初始化观察器
  function handleResize() {
    initIntersectionObserver();
  }
  
  // 模块API
  const api = {
    /**
     * 初始化滚动效果模块
     */
    async init(options = {}) {
      if (state.initialized) {
        console.log('[XiScroll] 已初始化');
        return;
      }
      
      // 合并配置
      Object.assign(config, options);
      
      // 加载原始系统
      await loadOriginalSystemIfNeeded();
      
      // 创建样式元素
      createBaseStyleElement();
      
      // 初始化交叉观察器
      initIntersectionObserver();
      
      // 查找可滚动元素
      findScrollElements();
      
      // 监听窗口大小变化
      window.addEventListener('resize', handleResize);
      
      state.initialized = true;
      
      // 通知XiCore模块已准备好
      if (window.XiCore && window.XiCore.trigger) {
        window.XiCore.trigger('moduleReady', { name: 'scroll' });
      }
      
      console.log('[XiScroll] 初始化完成');
    },
    
    /**
     * 应用主题
     */
    applyTheme(theme) {
      if (!state.initialized) {
        console.warn('[XiScroll] 模块尚未初始化，无法应用主题');
        return false;
      }
      
      if (!config.themeEnabled) {
        console.log('[XiScroll] 主题功能已禁用');
        return false;
      }
      
      if (!theme || !theme.id) {
        console.error('[XiScroll] 无效的主题配置');
        return false;
      }
      
      // 应用主题样式
      applyThemeStyle(theme);
      
      // 更新当前主题状态
      state.currentTheme = theme.id;
      
      return true;
    },
    
    /**
     * 刷新元素
     * 扫描DOM中的新元素并注册它们
     */
    refresh() {
      if (!state.initialized) {
        console.warn('[XiScroll] 模块尚未初始化，无法刷新');
        return false;
      }
      
      const count = findScrollElements();
      console.log(`[XiScroll] 刷新完成，总计 ${state.elementsRegistered} 个元素`);
      
      return count;
    },
    
    /**
     * 注册单个元素
     */
    register(element, options = {}) {
      if (!state.initialized) {
        console.warn('[XiScroll] 模块尚未初始化，无法注册元素');
        return false;
      }
      
      if (!element || !(element instanceof HTMLElement)) {
        console.error('[XiScroll] 无效的元素');
        return false;
      }
      
      // 设置数据属性
      if (options.animation) {
        element.setAttribute(`${config.attributePrefix}-animation`, options.animation);
      }
      
      if (options.delay) {
        element.setAttribute(`${config.attributePrefix}-delay`, options.delay);
      }
      
      if (options.duration) {
        element.setAttribute(`${config.attributePrefix}-duration`, options.duration);
      }
      
      if (options.once) {
        element.setAttribute(`${config.attributePrefix}-once`, '');
      }
      
      if (options.reset) {
        element.setAttribute(`${config.attributePrefix}-reset`, '');
      }
      
      if (options.offset) {
        element.setAttribute(`${config.attributePrefix}-offset`, options.offset);
      }
      
      // 注册元素
      return registerElement(element);
    },
    
    /**
     * 取消注册元素
     */
    unregister(element) {
      if (!state.initialized) {
        console.warn('[XiScroll] 模块尚未初始化，无法取消注册元素');
        return false;
      }
      
      if (!element || !(element instanceof HTMLElement)) {
        console.error('[XiScroll] 无效的元素');
        return false;
      }
      
      if (!elements.has(element)) {
        console.warn('[XiScroll] 元素未注册');
        return false;
      }
      
      // 停止观察
      if (state.observer) {
        state.observer.unobserve(element);
      }
      
      // 移除类
      element.classList.remove('xi-scroll-hidden', 'xi-scroll-visible');
      
      // 移除数据属性中的动画类
      const data = elements.get(element);
      if (data && data.animation) {
        const animationClass = config.animationClasses[data.animation] || data.animation;
        element.classList.remove(animationClass);
      }
      
      // 从集合中移除
      elements.delete(element);
      state.elementsRegistered--;
      
      return true;
    },
    
    /**
     * 获取已注册元素数量
     */
    getElementCount() {
      return state.elementsRegistered;
    },
    
    /**
     * 手动触发元素动画
     */
    trigger(element) {
      if (!state.initialized) {
        console.warn('[XiScroll] 模块尚未初始化，无法触发动画');
        return false;
      }
      
      if (!element || !(element instanceof HTMLElement)) {
        console.error('[XiScroll] 无效的元素');
        return false;
      }
      
      if (!elements.has(element)) {
        console.warn('[XiScroll] 元素未注册');
        return false;
      }
      
      const data = elements.get(element);
      applyAnimation(element, data);
      
      return true;
    },
    
    /**
     * 手动重置元素动画
     */
    reset(element) {
      if (!state.initialized) {
        console.warn('[XiScroll] 模块尚未初始化，无法重置动画');
        return false;
      }
      
      if (!element || !(element instanceof HTMLElement)) {
        console.error('[XiScroll] 无效的元素');
        return false;
      }
      
      if (!elements.has(element)) {
        console.warn('[XiScroll] 元素未注册');
        return false;
      }
      
      const data = elements.get(element);
      resetAnimation(element, data);
      
      return true;
    },
    
    /**
     * 触发所有元素动画
     */
    triggerAll() {
      if (!state.initialized) {
        console.warn('[XiScroll] 模块尚未初始化，无法触发所有动画');
        return false;
      }
      
      let count = 0;
      elements.forEach((data, element) => {
        applyAnimation(element, data);
        count++;
      });
      
      return count;
    },
    
    /**
     * 重置所有元素动画
     */
    resetAll() {
      if (!state.initialized) {
        console.warn('[XiScroll] 模块尚未初始化，无法重置所有动画');
        return false;
      }
      
      let count = 0;
      elements.forEach((data, element) => {
        resetAnimation(element, data);
        count++;
      });
      
      return count;
    },
    
    /**
     * 获取模块状态
     */
    getState() {
      return { ...state };
    },
    
    /**
     * 设置配置项
     */
    setConfig(options = {}) {
      if (!state.initialized) {
        console.warn('[XiScroll] 模块尚未初始化，配置将在初始化时应用');
      }
      
      Object.assign(config, options);
      
      // 如果已初始化，更新交叉观察器
      if (state.initialized && state.observer) {
        initIntersectionObserver();
      }
      
      return true;
    },
    
    /**
     * 销毁模块
     */
    destroy() {
      if (!state.initialized) return;
      
      // 断开观察器连接
      if (state.observer) {
        state.observer.disconnect();
        state.observer = null;
      }
      
      // 移除事件监听器
      window.removeEventListener('resize', handleResize);
      
      // 重置所有元素
      elements.forEach((data, element) => {
        // 移除所有类
        element.classList.remove('xi-scroll-hidden', 'xi-scroll-visible');
        
        const animationClass = config.animationClasses[data.animation] || data.animation;
        element.classList.remove(animationClass);
        
        // 重置元素内联样式
        element.style.animationDuration = '';
      });
      
      // 清空元素集合
      elements.clear();
      
      // 移除样式
      if (themeStyle && themeStyle.parentNode) {
        themeStyle.parentNode.removeChild(themeStyle);
        themeStyle = null;
      }
      
      // 保留基础样式，因为它可能被其他实例使用
      
      state.initialized = false;
      state.elementsRegistered = 0;
      state.currentTheme = null;
      
      console.log('[XiScroll] 模块已销毁');
    },
    
    /**
     * 应用技术简报逐项显示效果
     * @param {HTMLElement} element - 容器元素
     * @param {Object} options - 选项
     */
    applyTechBriefing(element, options = {}) {
      if (!element) return false;
      
      const itemDelay = options.itemDelay || 150;
      const items = element.querySelectorAll('li');
      
      // 添加技术简报类
      element.classList.add(config.animationClasses.techBriefing);
      
      // 设置每项的延迟
      items.forEach((item, i) => {
        item.style.transitionDelay = `${i * itemDelay}ms`;
      });
      
      return true;
    },
    
    /**
     * 立即触发技术简报逐项显示
     * @param {HTMLElement} element - 容器元素
     */
    triggerTechBriefing(element) {
      if (!element) return false;
      
      element.classList.add('active');
      return true;
    }
  };
  
  // 如果XiCore已加载，则自动注册模块
  if (window.XiCore) {
    window.XiCore.registerModule('scroll', api);
  }
  
  // 返回模块API
  return api;
})();

// 如果在Node环境中，则导出模块
if (typeof module !== 'undefined' && module.exports) {
  module.exports = XiScroll;
} 