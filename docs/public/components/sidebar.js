/**
 * sidebar.js - 模块化侧边栏组件
 * 
 * 这是一个模块化侧边栏脚本，设计用于在整个站点中复用。
 * 通过简单地引入此脚本，可以实现一致的侧边栏体验。
 * 
 * 使用方法：
 * 1. 在HTML中引入此脚本：<script src="/components/sidebar.js"></script>
 * 2. 确保页面有以下结构：
 *    - 具有 .sidebar 类的侧边栏元素
 *    - 具有 .sidebar-toggle 类的侧边栏切换按钮
 *    - 具有 .main-content 类的主内容区域
 * 
 * 功能：
 * - 自动清理重复的侧边栏元素
 * - 提供切换侧边栏的功能
 * - 点击外部区域自动关闭侧边栏
 * - 高亮当前页面链接
 * - 多种初始化机制确保在各种场景下都能正常工作
 * 
 * 版本：1.0.0
 * 日期：2024-03-27
 */

(function() {
  // 定义变量
  let sidebar, toggle, mainContent;
  let isInitialized = false;

  // 主初始化函数
  function initSidebar() {
    // 防止重复初始化
    if (isInitialized) {
      console.log('[侧边栏] 已经初始化过，跳过');
      return;
    }

    console.log('[侧边栏] 开始初始化...');
    
    // 1. 清理重复元素
    cleanupDuplicateElements();
    
    // 2. 获取DOM元素
    sidebar = document.querySelector('.sidebar');
    toggle = document.querySelector('.sidebar-toggle');
    mainContent = document.querySelector('.main-content');
    
    // 3. 检查必要元素
    if (!sidebar || !toggle) {
      console.error('[侧边栏] 找不到必要的侧边栏元素');
      return;
    }
    
    // 4. 移除可能存在的事件监听器（通过克隆节点）
    const newToggle = toggle.cloneNode(true);
    toggle.parentNode.replaceChild(newToggle, toggle);
    toggle = newToggle;
    
    // 5. 绑定切换事件
    toggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      sidebar.classList.toggle('active');
      if (mainContent) {
        if (sidebar.classList.contains('active')) {
          mainContent.classList.add('sidebar-active');
        } else {
          mainContent.classList.remove('sidebar-active');
        }
      }
      
      return false;
    });
    
    // 6. 点击页面其他区域关闭侧边栏
    document.body.addEventListener('click', function(e) {
      if (sidebar.classList.contains('active') && 
          !sidebar.contains(e.target) && 
          e.target !== toggle &&
          !toggle.contains(e.target)) {
        sidebar.classList.remove('active');
        if (mainContent) mainContent.classList.remove('sidebar-active');
      }
    });
    
    // 7. 高亮当前页面链接
    highlightCurrentPage();
    
    // 8. 设置初始化标志
    isInitialized = true;
    console.log('[侧边栏] 初始化完成');
  }
  
  // 清理重复元素
  function cleanupDuplicateElements() {
    const sidebars = document.querySelectorAll('.sidebar');
    if (sidebars.length > 1) {
      console.log(`[侧边栏] 发现 ${sidebars.length} 个侧边栏，清理重复元素`);
      for (let i = 1; i < sidebars.length; i++) {
        if (sidebars[i].parentNode) {
          sidebars[i].parentNode.removeChild(sidebars[i]);
        }
      }
    }
    
    const toggles = document.querySelectorAll('.sidebar-toggle');
    if (toggles.length > 1) {
      console.log(`[侧边栏] 发现 ${toggles.length} 个切换按钮，清理重复元素`);
      for (let i = 1; i < toggles.length; i++) {
        if (toggles[i].parentNode) {
          toggles[i].parentNode.removeChild(toggles[i]);
        }
      }
    }
  }
  
  // 高亮当前页面链接
  function highlightCurrentPage() {
    const currentUrl = window.location.pathname;
    const links = sidebar.querySelectorAll('a');
    
    links.forEach(link => {
      const href = link.getAttribute('href');
      
      // 检查当前URL是否与链接匹配（包括相对路径）
      if (href === currentUrl || 
          currentUrl.endsWith(href) || 
          (href !== '/' && currentUrl.includes(href))) {
        link.style.color = '#00ff9d';
        link.style.fontWeight = 'bold';
        link.style.textShadow = '0 0 5px rgba(0, 255, 157, 0.5)';
        
        // 展开父菜单（如果有）
        let parent = link.parentNode;
        while (parent && parent !== sidebar) {
          if (parent.classList.contains('chapter-items') || parent.classList.contains('submenu')) {
            parent.style.display = 'block';
          }
          parent = parent.parentNode;
        }
      }
    });
  }
  
  // 多种初始化时机，确保脚本在各种情况下都能正常工作
  
  // 1. DOMContentLoaded 事件
  document.addEventListener('DOMContentLoaded', function() {
    initSidebar();
  });
  
  // 2. 如果页面已加载完成则立即执行
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initSidebar();
  }
  
  // 3. 备份初始化（2秒后尝试）
  setTimeout(function() {
    if (!isInitialized && document.querySelector('.sidebar')) {
      console.log('[侧边栏] 使用备份初始化机制');
      initSidebar();
    }
  }, 2000);
  
  // 4. 窗口加载后的最终初始化检查
  window.addEventListener('load', function() {
    if (!isInitialized) {
      console.log('[侧边栏] 使用窗口加载后初始化');
      initSidebar();
    }
  });
  
  // 暴露全局API，以便外部调用和调试
  window.XiSidebar = {
    init: initSidebar,
    highlight: highlightCurrentPage,
    cleanup: cleanupDuplicateElements
  };
})(); 