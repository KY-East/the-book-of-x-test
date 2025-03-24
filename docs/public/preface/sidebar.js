// 修复版侧边栏操作脚本
(function() {
  // 定义事件处理函数（放在顶层，避免闭包问题）
  function toggleSidebar(e) {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('侧边栏切换按钮被点击');
    
    var sidebar = document.querySelector('.sidebar');
    var mainContent = document.querySelector('.main-content');
    
    if (!sidebar) return;
    
    // 切换侧边栏状态
    sidebar.classList.toggle('active');
    
    if (mainContent) {
      if (sidebar.classList.contains('active')) {
        mainContent.classList.add('sidebar-active');
      } else {
        mainContent.classList.remove('sidebar-active');
      }
    }
  }
  
  function closeSidebarOnOutsideClick(e) {
    var sidebar = document.querySelector('.sidebar');
    var toggle = document.querySelector('.sidebar-toggle');
    var mainContent = document.querySelector('.main-content');
    
    if (!sidebar || !toggle) return;
    
    if (sidebar.classList.contains('active') && 
        !sidebar.contains(e.target) && 
        e.target !== toggle &&
        !toggle.contains(e.target)) {
      console.log('检测到外部点击，关闭侧边栏');
      sidebar.classList.remove('active');
      if (mainContent) mainContent.classList.remove('sidebar-active');
    }
  }
  
  function initSidebar() {
    console.log('初始化侧边栏...');
    
    // 清理重复元素
    var sidebars = document.querySelectorAll('.sidebar');
    if (sidebars.length > 1) {
      console.log('检测到多个侧边栏，正在清理...');
      for (var i = 1; i < sidebars.length; i++) {
        if (sidebars[i] && sidebars[i].parentNode) {
          sidebars[i].parentNode.removeChild(sidebars[i]);
        }
      }
    }
    
    var toggles = document.querySelectorAll('.sidebar-toggle');
    if (toggles.length > 1) {
      console.log('检测到多个侧边栏切换按钮，正在清理...');
      for (var i = 1; i < toggles.length; i++) {
        if (toggles[i] && toggles[i].parentNode) {
          toggles[i].parentNode.removeChild(toggles[i]);
        }
      }
    }
    
    // 获取剩余的元素
    var sidebar = document.querySelector('.sidebar');
    var toggle = document.querySelector('.sidebar-toggle');
    
    if (!sidebar || !toggle) {
      console.error('找不到侧边栏元素');
      return;
    }
    
    console.log('侧边栏元素已找到，初始化事件...');
    
    // 移除所有现有监听器 - 使用clone节点的方式彻底移除
    var newToggle = toggle.cloneNode(true);
    if (toggle.parentNode) {
      toggle.parentNode.replaceChild(newToggle, toggle);
    }
    toggle = newToggle;
    
    // 重新绑定事件 - 直接绑定函数引用
    toggle.addEventListener('click', toggleSidebar);
    
    // 移除并重新绑定文档点击事件
    document.removeEventListener('click', closeSidebarOnOutsideClick);
    document.addEventListener('click', closeSidebarOnOutsideClick);
    
    // 确保侧边栏按钮可见并正常工作
    toggle.style.zIndex = '1000';
    toggle.style.visibility = 'visible';
    toggle.style.opacity = '1';
    toggle.style.pointerEvents = 'auto';
    toggle.style.cursor = 'pointer';
    
    // 添加内联样式确保按钮始终可点击
    var style = document.createElement('style');
    style.textContent = `
      .sidebar-toggle {
        z-index: 1000 !important;
        visibility: visible !important;
        opacity: 1 !important;
        pointer-events: auto !important;
        cursor: pointer !important;
        position: fixed !important;
      }
      .sidebar {
        z-index: 999 !important;
      }
    `;
    document.head.appendChild(style);
    
    // 高亮当前页面链接
    var currentPath = window.location.pathname;
    var links = sidebar.querySelectorAll('a');
    links.forEach(function(link) {
      var href = link.getAttribute('href');
      // 检查链接是否匹配当前页面路径
      if (href && 
          (href === currentPath || 
           currentPath.endsWith(href) || 
           href.endsWith(currentPath))) {
        console.log('当前页面链接已高亮: ' + href);
        link.style.color = '#00ff9d';
        link.style.fontWeight = 'bold';
      }
    });
    
    console.log('侧边栏初始化完成');
  }
  
  // 确保代码在多种情况下都能执行
  function ensureInit() {
    console.log('确保侧边栏初始化...');
    initSidebar();
  }
  
  // 在多个时间点调用初始化以确保执行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureInit);
  } else {
    // 如果DOMContentLoaded已经触发，立即初始化
    ensureInit();
  }
  
  // 延迟调用初始化，作为备份策略
  setTimeout(ensureInit, 500);
  setTimeout(ensureInit, 1500);
  
  // 添加到窗口对象，便于调试和手动调用
  window.reinitSidebar = ensureInit;
  
  // 监听可能的页面加载和路由变化事件
  window.addEventListener('load', ensureInit);
  window.addEventListener('hashchange', ensureInit);
  window.addEventListener('popstate', ensureInit);
})(); 