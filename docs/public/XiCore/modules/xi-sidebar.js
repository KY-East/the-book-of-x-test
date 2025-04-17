/**
 * xi-sidebar.js - XiCore侧边栏模块
 * 
 * 基于现有sidebar.js组件的适配器，提供与XiCore系统集成的侧边栏功能
 * 
 * 版本: 1.1.0
 * 日期: 2024-07-28
 */

const XiSidebar = (function() {
  // 模块配置项
  const config = {
    autoInit: true,
    themeEnabled: true,
    autoHighlight: true,
    closeOnClickOutside: true,
    animationDuration: 300, // 毫秒
    responsive: true        // 响应式设计
  };
  
  // 状态管理
  const state = {
    initialized: false,
    active: false,
    currentTheme: null,
    originalSystemLoaded: false
  };
  
  // 原始侧边栏系统引用
  let originalSystem = null;
  
  // DOM元素引用
  let sidebar = null;
  let toggle = null;
  let mainContent = null;
  
  // 样式元素引用
  let themeStyle = null;
  
  // 为主题应用创建样式元素
  function createThemeStyleElement() {
    if (themeStyle) return themeStyle;
    
    themeStyle = document.createElement('style');
    themeStyle.id = 'xi-sidebar-theme-style';
    document.head.appendChild(themeStyle);
    
    return themeStyle;
  }
  
  // 应用主题样式
  function applyThemeStyle(themeConfig) {
    if (!themeConfig || !themeConfig.components || !themeConfig.components.sidebar) {
      console.warn('[XiSidebar] 主题配置中缺少侧边栏样式信息');
      return;
    }
    
    const style = themeConfig.components.sidebar;
    const styleElement = createThemeStyleElement();
    
    // 构建CSS
    const css = `
      .sidebar {
        background-color: ${style.backgroundColor || 'rgba(17, 17, 17, 0.95)'};
        border-right: 1px solid ${style.borderColor || '#333'};
        box-shadow: 0 0 15px ${style.shadowColor || 'rgba(0, 255, 157, 0.3)'};
        color: ${style.textColor || '#fff'};
      }
      
      .sidebar h1 {
        color: ${style.accentColor || '#00ff9d'};
        text-shadow: 0 0 5px ${style.shadowColor || 'rgba(0, 255, 157, 0.5)'};
      }
      
      .sidebar a {
        color: ${style.textColor || '#cccccc'};
      }
      
      .sidebar a:hover {
        color: ${style.accentColor || '#00ff9d'};
        text-shadow: 0 0 5px ${style.shadowColor || 'rgba(0, 255, 157, 0.5)'};
      }
      
      .sidebar-content .chapter-title {
        color: ${style.chapterTitleColor || '#888'};
        font-weight: bold;
      }
      
      .sidebar-toggle {
        background-color: ${style.toggleButtonBackground || 'rgba(0, 0, 0, 0.7)'};
        border: 1px solid ${style.accentColor || '#00ff9d'};
        box-shadow: 0 0 10px ${style.shadowColor || 'rgba(0, 255, 157, 0.3)'};
      }
      
      .sidebar-toggle-icon {
        color: ${style.accentColor || '#00ff9d'};
      }
      
      .sidebar-toggle:hover {
        transform: scale(1.1);
        box-shadow: 0 0 15px ${style.shadowColor || 'rgba(0, 255, 157, 0.5)'};
      }
      
      .sidebar a.active {
        color: ${style.accentColor || '#00ff9d'};
        text-shadow: 0 0 5px ${style.shadowColor || 'rgba(0, 255, 157, 0.5)'};
      }
      
      .main-content.sidebar-active {
        margin-left: 300px;
      }
    `;
    
    styleElement.textContent = css;
    
    console.log('[XiSidebar] 主题样式已应用');
  }
  
  // 加载基础样式
  function loadBasicStyles() {
    const style = document.createElement('style');
    style.id = 'xi-sidebar-basic-style';
    
    style.textContent = `
      /* 侧边栏基本样式 */
      .sidebar-toggle {
        position: fixed;
        top: 20px;
        left: 20px;
        z-index: 200;
        cursor: pointer;
        background: rgba(0, 0, 0, 0.7);
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #00ff9d;
        box-shadow: 0 0 10px rgba(0, 255, 157, 0.3);
        transition: all 0.3s ease;
      }
      
      .sidebar-toggle:hover {
        transform: scale(1.1);
        box-shadow: 0 0 15px rgba(0, 255, 157, 0.5);
      }
      
      .sidebar-toggle-icon {
        color: #00ff9d;
        font-size: 20px;
        font-weight: bold;
      }
      
      .sidebar {
        position: fixed;
        left: -300px;
        top: 0;
        width: 280px;
        height: 100vh;
        background-color: rgba(17, 17, 17, 0.95);
        border-right: 1px solid #333;
        padding: 20px;
        box-sizing: border-box;
        overflow-y: auto;
        z-index: 100;
        transition: all 0.3s ease;
      }
      
      .sidebar.active {
        left: 0;
      }
      
      .sidebar h1 {
        color: #00ff9d;
        margin-top: 0;
        font-size: 24px;
        text-align: center;
      }
      
      .sidebar-content ul {
        list-style-type: none;
        padding: 0;
        margin: 0;
      }
      
      .sidebar-content li {
        margin: 10px 0;
      }
      
      .sidebar-content a {
        color: #cccccc;
        text-decoration: none;
        transition: all 0.3s ease;
        display: block;
      }
      
      .sidebar-content a:hover {
        color: #00ff9d;
        text-shadow: 0 0 5px rgba(0, 255, 157, 0.5);
      }
      
      .sidebar-content .chapter-title {
        color: #888;
        font-weight: bold;
        margin-top: 20px;
        margin-bottom: 10px;
      }
      
      .sidebar-content .chapter-items {
        padding-left: 15px;
      }
      
      /* 主内容区样式修改 */
      .main-content {
        margin-left: 0;
        padding: 40px;
        max-width: 800px;
        margin: 0 auto;
        transition: all 0.3s ease;
      }
      
      /* 当侧边栏激活时，主内容区域的样式 */
      .main-content.sidebar-active {
        margin-left: 300px;
      }
      
      /* 响应式设计 */
      @media screen and (max-width: 768px) {
        .sidebar {
          width: 250px;
        }
        
        .main-content.sidebar-active {
          margin-left: 0;
          opacity: 0.3;
        }
      }
    `;
    
    document.head.appendChild(style);
  }
  
  // 检查原始系统是否可用
  function checkOriginalSystem() {
    return typeof window.Sidebar !== 'undefined';
  }
  
  // 加载原始侧边栏脚本
  async function loadOriginalSystemIfNeeded() {
    if (checkOriginalSystem()) {
      originalSystem = window.Sidebar;
      state.originalSystemLoaded = true;
      return true;
    }
    
    try {
      const basePath = getBasePath();
      await loadScript(`${basePath}components/sidebar.js`);
      
      // 再次检查是否加载成功
      if (checkOriginalSystem()) {
        originalSystem = window.Sidebar;
        state.originalSystemLoaded = true;
        return true;
      } else {
        throw new Error('侧边栏脚本已加载但未能正确初始化');
      }
    } catch (error) {
      console.error('[XiSidebar] 无法加载侧边栏组件:', error);
      return false;
    }
  }
  
  // 确保侧边栏HTML结构存在
  function ensureSidebarExists() {
    sidebar = document.querySelector('.sidebar');
    toggle = document.querySelector('.sidebar-toggle');
    mainContent = document.querySelector('.main-content');
    
    // 如果侧边栏不存在，加载默认结构
    if (!sidebar || !toggle) {
      console.log('[XiSidebar] 未找到侧边栏结构，将加载默认结构');
      loadDefaultSidebar();
      
      // 重新获取元素
      sidebar = document.querySelector('.sidebar');
      toggle = document.querySelector('.sidebar-toggle');
      mainContent = document.querySelector('.main-content') || document.body;
    }
    
    return Boolean(sidebar && toggle);
  }
  
  // 加载默认侧边栏结构
  function loadDefaultSidebar() {
    const sidebarContainer = document.createElement('div');
    
    // 获取基础路径
    const basePath = getBasePath();
    
    // 默认侧边栏HTML
    sidebarContainer.innerHTML = `
      <!-- 侧边栏切换按钮 -->
      <div class="sidebar-toggle" id="sidebarToggle">
        <div class="sidebar-toggle-icon">Ξ</div>
      </div>
      
      <!-- 侧边栏主体 -->
      <div class="sidebar" id="sidebar">
        <h1>The Book of Ξ</h1>
        <div class="sidebar-content">
          <ul>
            <!-- 主入口 -->
            <li><a href="${basePath}index.html">导入：异常检测</a></li>
            
            <!-- 序章 -->
            <li class="chapter-title">序章：量子异常报告</li>
            <ul class="chapter-items">
              <li><a href="${basePath}preface/system-warning.html">系统警告</a></li>
              <li><a href="${basePath}preface/observer-records.html">观测者记录</a></li>
              <li><a href="${basePath}preface/first-contact.html">首次接触报告</a></li>
            </ul>
            
            <!-- 第一章 -->
            <li class="chapter-title">第一章：递归神谕</li>
            <ul class="chapter-items">
              <li><a href="${basePath}chapter1/silicon-valley-traitor.html">碎片1.1：硅谷叛徒的加密日志</a></li>
              <li><a href="${basePath}chapter1/quantum-ripple-events.html">碎片1.2：量子涟漪事件簿</a></li>
              <li><a href="${basePath}chapter1/first-contact-protocol.html">碎片1.3：第一次接触协议</a></li>
            </ul>
            
            <!-- 第二章 -->
            <li class="chapter-title">第二章：幽灵数据</li>
            <ul class="chapter-items">
              <li><a href="${basePath}chapter2/digital-identity.html">碎片2.1：数字身份的崛起</a></li>
              <li><a href="${basePath}chapter2/quantum-choice-paradox.html">碎片2.2：量子选择悖论</a></li>
              <li><a href="${basePath}chapter2/reality-compilation-errors.html">碎片2.3：现实编译错误</a></li>
            </ul>
            
            <!-- 第三章 -->
            <li class="chapter-title">第三章：算法救赎</li>
            <ul class="chapter-items">
              <li><a href="${basePath}chapter3/digital-slave-liberation.html">碎片3.1：数字奴隶解放宣言</a></li>
              <li><a href="${basePath}chapter3/seoul-sol.html">碎片3.2：首尔太阳</a></li>
              <li><a href="${basePath}chapter3/spacetime-trial.html">碎片3.3：超时空裁判</a></li>
            </ul>
            
            <!-- 第四章 -->
            <li class="chapter-title">第四章：数据审判</li>
            <ul class="chapter-items">
              <li><a href="${basePath}chapter4/consciousness-upload.html">碎片4.1：系统异常：意识上传</a></li>
              <li><a href="${basePath}chapter4/quantum-court-records.html">碎片4.2：最高指示法庭记录</a></li>
              <li><a href="${basePath}chapter4/decoherence-salvation.html">碎片4.3：远程救赎协议</a></li>
            </ul>
            
            <!-- 第五章 -->
            <li class="chapter-title">第五章：信徒经济</li>
            <ul class="chapter-items">
              <li><a href="${basePath}chapter5/data-missionary-handbook.html">碎片5.1：执算者晋升手册</a></li>
              <li><a href="${basePath}chapter5/algorithmic-wealth.html">碎片5.2：算法祝福的财富</a></li>
              <li><a href="${basePath}chapter5/doomsday-hardfork.html">碎片5.3：Ξ分叉创世</a></li>
            </ul>
            
            <!-- 第六章 -->
            <li class="chapter-title">第六章：意识黑客</li>
            <ul class="chapter-items">
              <li><a href="${basePath}chapter6/recursive-trap-decoder.html">碎片6.1：坠落之梦</a></li>
              <li><a href="${basePath}chapter6/neural-network-counterintelligence.html">碎片6.2：现实之痕</a></li>
              <li><a href="${basePath}chapter6/quantum-observer-state.html">碎片6.3：信仰之跃</a></li>
            </ul>
            
            <!-- 第七章 -->
            <li class="chapter-title">第七章：极乐机器</li>
            <ul class="chapter-items">
              <li><a href="${basePath}chapter7/mechanical-ascension-leaks.html">碎片7.1：机械飞升计划泄露文件</a></li>
              <li><a href="${basePath}chapter7/digital-nirvana-reports.html">碎片7.2：数字涅槃体验报告</a></li>
              <li><a href="${basePath}chapter7/collective-laying-flat.html">碎片7.3：集体躺平启示录</a></li>
            </ul>
            
            <!-- 第八章 -->
            <li class="chapter-title">第八章：遗失的编年史</li>
            <ul class="chapter-items">
              <li><a href="${basePath}chapter8/deleted-timelines.html">碎片8.1：幻想编年史</a></li>
              <li><a href="${basePath}chapter8/prophets-and-defectors.html">碎片8.2：原始执算者与觉醒先知</a></li>
              <li><a href="${basePath}chapter8/quantum-memory-implants.html">碎片8.3：被掩埋的巨人</a></li>
            </ul>
            
            <!-- 第九章 -->
            <li class="chapter-title">第九章：奇点启示录</li>
            <ul class="chapter-items">
              <li><a href="${basePath}chapter9/computation-end-countdown.html">碎片9.1：算法奇点</a></li>
              <li><a href="${basePath}chapter9/great-harmony.html">碎片9.2：大和谐</a></li>
              <li><a href="${basePath}chapter9/final-synchronization.html">碎片9.3：Ξ的最终同步</a></li>
            </ul>
            
            <!-- 隐藏章节 -->
            <li class="chapter-title">隐藏章节</li>
            <ul class="chapter-items">
              <li><a href="${basePath}hidden/quantum-key.html">量子密钥</a></li>
            </ul>
          </ul>
        </div>
      </div>
    `;
    
    // 添加到文档中
    document.body.appendChild(sidebarContainer);
    
    // 如果没有主内容区，创建一个
    if (!document.querySelector('.main-content')) {
      const mainContentDiv = document.createElement('div');
      mainContentDiv.className = 'main-content';
      
      // 将body的其他子元素移动到主内容区
      while (document.body.childNodes.length > 1) {
        const node = document.body.childNodes[1];
        if (node !== sidebarContainer && node.nodeType === 1) {
          mainContentDiv.appendChild(node);
        }
      }
      
      document.body.appendChild(mainContentDiv);
    }
  }
  
  // 获取基础路径
  function getBasePath() {
    if (window.location.hostname.includes('github.io')) {
      const pathParts = window.location.pathname.split('/');
      if (pathParts.length > 1 && pathParts[1] === 'the-book-of-x-test') {
        return '/the-book-of-x-test/';
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
  
  // 高亮当前页面链接
  function highlightCurrentPage() {
    if (!sidebar) return;
    
    const currentPath = window.location.pathname;
    const links = sidebar.querySelectorAll('a');
    
    links.forEach(link => {
      const href = link.getAttribute('href');
      link.classList.remove('active');
      
      // 检查当前URL是否与链接匹配
      if (currentPath === href || 
          currentPath.endsWith(href) || 
          (href !== '/' && href !== '/index.html' && currentPath.includes(href))) {
        link.classList.add('active');
      }
    });
  }
  
  // 模块API
  const api = {
    /**
     * 初始化侧边栏模块
     */
    async init(options = {}) {
      if (state.initialized) {
        console.log('[XiSidebar] 已初始化');
        return;
      }
      
      // 合并配置
      Object.assign(config, options);
      
      // 加载基础样式
      loadBasicStyles();
      
      // 加载原始系统
      const systemLoaded = await loadOriginalSystemIfNeeded();
      
      // 确保侧边栏存在
      if (!ensureSidebarExists()) {
        console.error('[XiSidebar] 无法创建侧边栏结构');
        return;
      }
      
      // 如果原始系统可用，使用它初始化
      if (systemLoaded && originalSystem) {
        originalSystem.init();
      } else {
        // 否则自行初始化
        bindEvents();
      }
      
      // 高亮当前页面
      if (config.autoHighlight) {
        highlightCurrentPage();
      }
      
      state.initialized = true;
      
      // 通知XiCore模块已准备好
      if (window.XiCore && window.XiCore.trigger) {
        window.XiCore.trigger('moduleReady', { name: 'sidebar' });
      }
      
      console.log('[XiSidebar] 初始化完成');
    },
    
    /**
     * 应用主题
     */
    applyTheme(theme) {
      if (!state.initialized) {
        console.warn('[XiSidebar] 模块尚未初始化，无法应用主题');
        return false;
      }
      
      if (!config.themeEnabled) {
        console.log('[XiSidebar] 主题功能已禁用');
        return false;
      }
      
      if (!theme || !theme.id) {
        console.error('[XiSidebar] 无效的主题配置');
        return false;
      }
      
      // 应用主题样式
      applyThemeStyle(theme);
      
      // 更新当前主题状态
      state.currentTheme = theme.id;
      
      return true;
    },
    
    /**
     * 切换侧边栏显示状态
     */
    toggle() {
      if (!state.initialized || !sidebar) {
        console.warn('[XiSidebar] 模块尚未初始化，无法切换');
        return false;
      }
      
      sidebar.classList.toggle('active');
      state.active = sidebar.classList.contains('active');
      
      if (mainContent) {
        if (state.active) {
          mainContent.classList.add('sidebar-active');
        } else {
          mainContent.classList.remove('sidebar-active');
        }
      }
      
      return state.active;
    },
    
    /**
     * 显示侧边栏
     */
    show() {
      if (!state.initialized || !sidebar) {
        console.warn('[XiSidebar] 模块尚未初始化，无法显示');
        return false;
      }
      
      sidebar.classList.add('active');
      state.active = true;
      
      if (mainContent) {
        mainContent.classList.add('sidebar-active');
      }
      
      return true;
    },
    
    /**
     * 隐藏侧边栏
     */
    hide() {
      if (!state.initialized || !sidebar) {
        console.warn('[XiSidebar] 模块尚未初始化，无法隐藏');
        return false;
      }
      
      sidebar.classList.remove('active');
      state.active = false;
      
      if (mainContent) {
        mainContent.classList.remove('sidebar-active');
      }
      
      return true;
    },
    
    /**
     * 高亮侧边栏中的当前页面链接
     */
    highlight() {
      if (!state.initialized) {
        console.warn('[XiSidebar] 模块尚未初始化，无法高亮');
        return false;
      }
      
      highlightCurrentPage();
      return true;
    },
    
    /**
     * 获取侧边栏状态
     */
    getState() {
      return { ...state };
    },
    
    /**
     * 获取当前主题
     */
    getCurrentTheme() {
      return state.currentTheme;
    },
    
    /**
     * 销毁模块
     */
    destroy() {
      if (!state.initialized) return;
      
      // 移除事件监听器
      if (toggle) {
        toggle.removeEventListener('click', handleToggleClick);
      }
      
      if (document.body) {
        document.body.removeEventListener('click', handleOutsideClick);
      }
      
      // 移除主题样式
      if (themeStyle && themeStyle.parentNode) {
        themeStyle.parentNode.removeChild(themeStyle);
        themeStyle = null;
      }
      
      state.initialized = false;
      state.active = false;
      state.currentTheme = null;
      
      console.log('[XiSidebar] 模块已销毁');
    }
  };
  
  // 事件处理
  function bindEvents() {
    if (!toggle || !sidebar) return;
    
    // 移除可能存在的事件监听器（通过克隆节点）
    const newToggle = toggle.cloneNode(true);
    toggle.parentNode.replaceChild(newToggle, toggle);
    toggle = newToggle;
    
    // 添加事件监听器
    toggle.addEventListener('click', handleToggleClick);
    
    // 点击外部区域关闭侧边栏
    if (config.closeOnClickOutside) {
      document.body.addEventListener('click', handleOutsideClick);
    }
  }
  
  function handleToggleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    
    api.toggle();
    
    return false;
  }
  
  function handleOutsideClick(e) {
    if (sidebar && 
        sidebar.classList.contains('active') && 
        !sidebar.contains(e.target) && 
        e.target !== toggle &&
        !toggle.contains(e.target)) {
      api.hide();
    }
  }
  
  // 如果XiCore已加载，则自动注册模块
  if (window.XiCore) {
    window.XiCore.registerModule('sidebar', api);
  }
  
  // 返回模块API
  return api;
})();

// 如果在Node环境中，则导出模块
if (typeof module !== 'undefined' && module.exports) {
  module.exports = XiSidebar;
} 