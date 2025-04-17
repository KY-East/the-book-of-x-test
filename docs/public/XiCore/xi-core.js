/**
 * XiCore - The Book of Ξ 核心系统
 * 
 * 一个统一的模块化系统，用于整合视觉效果、侧边栏、音乐播放器和滚动动画等组件，
 * 以提供一致的用户体验和简化开发流程。
 * 
 * 版本: 1.0.0
 * 日期: 2024-07-28
 */

const XiCore = (function() {
  // 配置项
  const config = {
    defaultTheme: 'awakening',
    enabledModules: ['visual', 'sidebar', 'music', 'scroll'],
    debug: false,
    autoInit: true
  };
  
  // 状态管理
  const state = {
    initialized: false,
    currentTheme: null,
    activeModules: {},
    registeredThemes: {},
    eventListeners: {}
  };
  
  // 已注册的模块
  const modules = {};
  
  // 工具函数
  const utils = {
    /**
     * 输出调试信息
     */
    log: function(message, type = 'info') {
      if (!config.debug && type !== 'error') return;
      
      const prefix = '[XiCore]';
      switch (type) {
        case 'error':
          console.error(`${prefix} 错误:`, message);
          break;
        case 'warn':
          console.warn(`${prefix} 警告:`, message);
          break;
        case 'info':
        default:
          console.log(`${prefix} 信息:`, message);
      }
    },
    
    /**
     * 加载脚本
     */
    loadScript: function(src) {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`无法加载脚本: ${src}`));
        document.head.appendChild(script);
      });
    },
    
    /**
     * 获取基础路径
     */
    getBasePath: function() {
      // 检查是否在GitHub Pages上
      if (window.location.hostname.includes('github.io')) {
        // 从URL路径中提取仓库名
        const pathParts = window.location.pathname.split('/');
        if (pathParts.length > 1) {
          return '/' + pathParts[1] + '/';
        }
      }
      // 本地开发或自定义域名根目录
      return '/';
    },
    
    /**
     * 合并对象
     */
    deepMerge: function(target, ...sources) {
      if (!sources.length) return target;
      const source = sources.shift();
      
      if (source && typeof source === 'object') {
        for (const key in source) {
          if (source[key] instanceof Object && key in target) {
            this.deepMerge(target[key], source[key]);
          } else {
            Object.assign(target, { [key]: source[key] });
          }
        }
      }
      
      return this.deepMerge(target, ...sources);
    }
  };
  
  // 模块加载器
  const moduleLoader = {
    /**
     * 加载模块
     */
    load: async function(moduleName) {
      if (modules[moduleName]) {
        utils.log(`模块 ${moduleName} 已加载`);
        return modules[moduleName];
      }
      
      try {
        const basePath = utils.getBasePath();
        const moduleUrl = `${basePath}XiCore/modules/xi-${moduleName}.js`;
        
        // 加载模块脚本
        await utils.loadScript(moduleUrl);
        
        // 检查全局命名空间中是否存在该模块
        const moduleNamespace = `Xi${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}`;
        if (window[moduleNamespace]) {
          modules[moduleName] = window[moduleNamespace];
          utils.log(`模块 ${moduleName} 加载成功`);
          return modules[moduleName];
        } else {
          throw new Error(`模块 ${moduleName} 未能正确注册`);
        }
      } catch (error) {
        utils.log(`加载模块 ${moduleName} 失败: ${error.message}`, 'error');
        return null;
      }
    },
    
    /**
     * 注册模块
     */
    register: function(moduleName, moduleObject) {
      if (modules[moduleName]) {
        utils.log(`模块 ${moduleName} 已经注册，将被覆盖`, 'warn');
      }
      
      modules[moduleName] = moduleObject;
      utils.log(`模块 ${moduleName} 注册成功`);
      return moduleObject;
    }
  };
  
  // 主题管理
  const themeManager = {
    /**
     * 注册主题
     */
    register: function(themeId, themeConfig) {
      if (state.registeredThemes[themeId]) {
        utils.log(`主题 ${themeId} 已经注册，将被覆盖`, 'warn');
      }
      
      state.registeredThemes[themeId] = themeConfig;
      utils.log(`主题 ${themeId} 注册成功`);
      
      // 触发主题注册事件
      eventSystem.trigger('themeRegistered', { id: themeId, config: themeConfig });
      
      return themeConfig;
    },
    
    /**
     * 获取主题
     */
    get: function(themeId) {
      return state.registeredThemes[themeId] || null;
    },
    
    /**
     * 获取所有主题
     */
    getAll: function() {
      return Object.keys(state.registeredThemes).map(id => ({
        id,
        name: state.registeredThemes[id].name || id,
        description: state.registeredThemes[id].description || ''
      }));
    },
    
    /**
     * 应用主题
     */
    apply: async function(themeId) {
      const theme = this.get(themeId);
      if (!theme) {
        utils.log(`主题 ${themeId} 不存在，将使用默认主题`, 'warn');
        if (themeId !== config.defaultTheme) {
          return this.apply(config.defaultTheme);
        }
        return false;
      }
      
      // 设置当前主题
      state.currentTheme = themeId;
      
      // 为每个激活的模块应用主题
      for (const moduleName in state.activeModules) {
        const module = state.activeModules[moduleName];
        if (module && typeof module.applyTheme === 'function') {
          try {
            await module.applyTheme(theme);
            utils.log(`已为模块 ${moduleName} 应用主题 ${themeId}`);
          } catch (error) {
            utils.log(`为模块 ${moduleName} 应用主题失败: ${error.message}`, 'error');
          }
        }
      }
      
      // 触发主题变更事件
      eventSystem.trigger('themeChanged', { id: themeId, config: theme });
      
      return true;
    },
    
    /**
     * 加载主题文件
     */
    loadThemeFile: async function(themeId) {
      try {
        if (state.registeredThemes[themeId]) {
          utils.log(`主题 ${themeId} 已加载`);
          return state.registeredThemes[themeId];
        }
        
        const basePath = utils.getBasePath();
        const themeUrl = `${basePath}XiCore/themes/theme-${themeId}.js`;
        
        await utils.loadScript(themeUrl);
        
        if (!state.registeredThemes[themeId]) {
          throw new Error(`主题文件加载成功但未正确注册`);
        }
        
        return state.registeredThemes[themeId];
      } catch (error) {
        utils.log(`加载主题 ${themeId} 失败: ${error.message}`, 'error');
        return null;
      }
    }
  };
  
  // 事件系统
  const eventSystem = {
    /**
     * 添加事件监听器
     */
    on: function(eventName, callback) {
      if (!eventName || typeof callback !== 'function') {
        utils.log('添加事件监听器失败: 无效的参数', 'error');
        return false;
      }
      
      if (!state.eventListeners[eventName]) {
        state.eventListeners[eventName] = [];
      }
      
      // 检查这个回调是否已经注册过了
      if (!state.eventListeners[eventName].includes(callback)) {
        state.eventListeners[eventName].push(callback);
        utils.log(`已添加事件监听器: ${eventName}`);
        return true;
      }
      
      return false;
    },
    
    /**
     * 移除事件监听器
     */
    off: function(eventName, callback) {
      if (!eventName || !state.eventListeners[eventName]) {
        return false;
      }
      
      if (callback) {
        // 移除指定的回调
        const index = state.eventListeners[eventName].indexOf(callback);
        if (index !== -1) {
          state.eventListeners[eventName].splice(index, 1);
          utils.log(`已移除事件监听器: ${eventName}`);
          
          // 如果这个事件已经没有监听器了，删除整个数组
          if (state.eventListeners[eventName].length === 0) {
            delete state.eventListeners[eventName];
          }
          
          return true;
        }
      } else {
        // 移除所有该事件的监听器
        delete state.eventListeners[eventName];
        utils.log(`已移除所有 ${eventName} 事件监听器`);
        return true;
      }
      
      return false;
    },
    
    /**
     * 添加一次性事件监听器
     */
    once: function(eventName, callback) {
      if (!eventName || typeof callback !== 'function') {
        utils.log('添加一次性事件监听器失败: 无效的参数', 'error');
        return false;
      }
      
      // 创建包装函数，执行一次后自动移除
      const onceCallback = (data) => {
        callback(data);
        this.off(eventName, onceCallback);
      };
      
      // 保存原始回调的引用，以便后续可以识别和移除
      onceCallback.originalCallback = callback;
      
      return this.on(eventName, onceCallback);
    },
    
    /**
     * 触发事件
     */
    trigger: function(eventName, data = {}) {
      if (!eventName) {
        utils.log('触发事件失败: 无效的事件名', 'error');
        return false;
      }
      
      // 添加事件名和时间戳到数据中
      const eventData = {
        ...data,
        eventName,
        timestamp: Date.now()
      };
      
      // 如果这个事件没有监听器，只记录调试信息
      if (!state.eventListeners[eventName] || state.eventListeners[eventName].length === 0) {
        utils.log(`触发事件 ${eventName}，但没有监听器`, 'info');
        return false;
      }
      
      // 克隆监听器数组，避免回调中修改数组导致的问题
      const listeners = [...state.eventListeners[eventName]];
      
      // 执行所有监听器
      listeners.forEach(callback => {
        try {
          callback(eventData);
        } catch (error) {
          utils.log(`事件 ${eventName} 的回调执行失败: ${error.message}`, 'error');
        }
      });
      
      utils.log(`已触发事件 ${eventName}，执行了 ${listeners.length} 个监听器`);
      return true;
    },
    
    /**
     * 获取指定事件的所有监听器
     */
    getListeners: function(eventName) {
      if (!eventName || !state.eventListeners[eventName]) {
        return [];
      }
      
      return [...state.eventListeners[eventName]];
    },
    
    /**
     * 获取所有已注册的事件
     */
    getEvents: function() {
      return Object.keys(state.eventListeners);
    },
    
    /**
     * 中继另一个对象的事件到XiCore
     */
    relay: function(source, eventName, targetEventName = null) {
      if (!source || !eventName || typeof source.on !== 'function') {
        utils.log('中继事件失败: 无效的参数或源对象不支持事件', 'error');
        return false;
      }
      
      // 如果没有指定目标事件名，使用源事件名
      const mappedEventName = targetEventName || eventName;
      
      // 在源对象上添加监听器，将事件中继到XiCore
      source.on(eventName, (data) => {
        this.trigger(mappedEventName, data);
      });
      
      utils.log(`已设置事件中继: ${eventName} -> ${mappedEventName}`);
      return true;
    }
  };
  
  // XiCore公共API
  const api = {
    /**
     * 初始化XiCore系统
     */
    async init(options = {}) {
      if (state.initialized) {
        utils.log('XiCore已经初始化', 'warn');
        return;
      }
      
      // 合并选项
      utils.deepMerge(config, options);
      
      // 在调试模式下输出配置
      if (config.debug) {
        utils.log('初始化配置:', 'info');
        console.log(config);
      }
      
      utils.log('正在初始化XiCore系统...');
      
      // 加载并初始化模块
      for (const moduleName of config.enabledModules) {
        try {
          const module = await moduleLoader.load(moduleName);
          
          if (module && typeof module.init === 'function') {
            await module.init();
            state.activeModules[moduleName] = module;
            utils.log(`模块 ${moduleName} 初始化成功`);
          } else {
            utils.log(`模块 ${moduleName} 缺少init方法`, 'warn');
          }
        } catch (error) {
          utils.log(`初始化模块 ${moduleName} 失败: ${error.message}`, 'error');
        }
      }
      
      // 加载并应用默认主题
      try {
        await themeManager.loadThemeFile(config.defaultTheme);
        await themeManager.apply(config.defaultTheme);
      } catch (error) {
        utils.log(`应用默认主题失败: ${error.message}`, 'error');
      }
      
      // 标记为已初始化
      state.initialized = true;
      
      // 触发初始化完成事件
      eventSystem.trigger('initialized', { config });
      
      utils.log('XiCore系统初始化完成');
    },
    
    /**
     * 获取当前主题
     */
    getCurrentTheme() {
      return {
        id: state.currentTheme,
        config: themeManager.get(state.currentTheme)
      };
    },
    
    /**
     * 获取所有可用主题
     */
    getThemes() {
      return themeManager.getAll();
    },
    
    /**
     * 设置当前主题
     */
    async setTheme(themeId) {
      // 如果主题未加载，先加载
      if (!themeManager.get(themeId)) {
        await themeManager.loadThemeFile(themeId);
      }
      return themeManager.apply(themeId);
    },
    
    /**
     * 注册新主题
     */
    registerTheme(themeId, themeConfig) {
      return themeManager.register(themeId, themeConfig);
    },
    
    /**
     * 获取模块实例
     */
    getModule(moduleName) {
      return modules[moduleName] || null;
    },
    
    /**
     * 注册模块
     */
    registerModule(moduleName, moduleObject) {
      return moduleLoader.register(moduleName, moduleObject);
    },
    
    /**
     * 添加事件监听器
     */
    on(eventName, callback) {
      return eventSystem.on(eventName, callback);
    },
    
    /**
     * 移除事件监听器
     */
    off(eventName, callback) {
      return eventSystem.off(eventName, callback);
    },
    
    /**
     * 添加一次性事件监听器
     */
    once(eventName, callback) {
      return eventSystem.once(eventName, callback);
    },
    
    /**
     * 触发事件
     */
    trigger(eventName, data) {
      return eventSystem.trigger(eventName, data);
    },
    
    /**
     * 获取所有已注册事件
     */
    getEvents() {
      return eventSystem.getEvents();
    },
    
    /**
     * 获取特定事件的所有监听器
     */
    getEventListeners(eventName) {
      return eventSystem.getListeners(eventName);
    },
    
    /**
     * 中继事件
     */
    relayEvents(source, eventMap) {
      if (!source) return false;
      
      if (typeof eventMap === 'string') {
        // 单个事件中继
        return eventSystem.relay(source, eventMap);
      } else if (typeof eventMap === 'object') {
        // 多个事件映射中继
        let success = true;
        for (const sourceEvent in eventMap) {
          const targetEvent = eventMap[sourceEvent];
          if (!eventSystem.relay(source, sourceEvent, targetEvent)) {
            success = false;
          }
        }
        return success;
      }
      
      return false;
    },
    
    /**
     * 获取系统状态
     */
    getState() {
      return {
        initialized: state.initialized,
        currentTheme: state.currentTheme,
        activeModules: Object.keys(state.activeModules),
        registeredThemes: Object.keys(state.registeredThemes),
        eventCount: Object.keys(state.eventListeners).length
      };
    },
    
    /**
     * 启用调试模式
     */
    enableDebug() {
      config.debug = true;
      utils.log('调试模式已启用');
      
      // 触发调试模式变更事件
      eventSystem.trigger('debugModeChanged', { enabled: true });
      
      return true;
    },
    
    /**
     * 禁用调试模式
     */
    disableDebug() {
      config.debug = false;
      utils.log('调试模式已禁用');
      
      // 触发调试模式变更事件
      eventSystem.trigger('debugModeChanged', { enabled: false });
      
      return true;
    },
    
    /**
     * 获取工具方法
     */
    get utils() {
      return {
        deepMerge: utils.deepMerge,
        getBasePath: utils.getBasePath,
        log: utils.log
      };
    }
  };
  
  // 设置全局事件处理
  window.addEventListener('load', () => {
    // 在页面加载完成后，如果设置了自动初始化，则初始化系统
    if (config.autoInit) {
      api.init();
    }
    
    // 触发页面加载事件
    eventSystem.trigger('pageLoaded');
  });
  
  window.addEventListener('resize', () => {
    // 触发窗口大小改变事件
    eventSystem.trigger('resize', {
      width: window.innerWidth,
      height: window.innerHeight
    });
  });
  
  document.addEventListener('visibilitychange', () => {
    // 触发页面可见性变化事件
    const isVisible = document.visibilityState === 'visible';
    eventSystem.trigger('visibilityChanged', { isVisible });
  });
  
  // 导出公共API
  return api;
})();

// 如果在Node环境中，则导出模块
if (typeof module !== 'undefined' && module.exports) {
  module.exports = XiCore;
} 