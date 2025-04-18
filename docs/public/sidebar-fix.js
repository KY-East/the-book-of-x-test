// 侧边栏功能脚本 - 强化版
(function() {
  // 在DOM加载完成后执行
  document.addEventListener('DOMContentLoaded', function() {
    initSidebar();
  });
  
  // 定义初始化侧边栏函数
  function initSidebar() {
    console.log("初始化侧边栏...");
    
    // 获取DOM元素
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const mainContent = document.querySelector('.main-content');
    
    // 如果必要元素不存在，中止
    if (!sidebar || !sidebarToggle || !mainContent) {
      console.error('必要的侧边栏元素未找到!');
      return;
    }
    
    // 移除所有可能存在的事件监听器
    const newSidebarToggle = sidebarToggle.cloneNode(true);
    sidebarToggle.parentNode.replaceChild(newSidebarToggle, sidebarToggle);
    
    // 添加新的事件监听器
    newSidebarToggle.addEventListener('click', function(e) {
      e.stopPropagation(); // 阻止事件冒泡
      sidebar.classList.toggle('active');
      
      if (sidebar.classList.contains('active')) {
        mainContent.classList.add('sidebar-active');
      } else {
        mainContent.classList.remove('sidebar-active');
      }
    });
    
    // 点击侧边栏外部时关闭侧边栏
    document.addEventListener('click', function(e) {
      if (sidebar.classList.contains('active') && 
          !sidebar.contains(e.target) && 
          e.target !== newSidebarToggle && 
          !newSidebarToggle.contains(e.target)) {
        sidebar.classList.remove('active');
        mainContent.classList.remove('sidebar-active');
      }
    });
    
    // 高亮当前页面链接
    const currentUrl = window.location.pathname;
    const links = sidebar.querySelectorAll('a');
    links.forEach(link => {
      if (link.getAttribute('href') === currentUrl || 
          currentUrl.endsWith(link.getAttribute('href'))) {
        link.style.color = '#00ff9d';
        link.style.fontWeight = 'bold';
      }
    });
    
    console.log("侧边栏初始化完成!");
  }
  
  // 设置备份初始化计时器(2秒后尝试初始化)
  setTimeout(function() {
    if (document.getElementById('sidebar')) {
      console.log("备份初始化侧边栏...");
      initSidebar();
    }
  }, 2000);
  
  // 如果页面已经加载完成则立即执行
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    console.log("页面已加载，立即初始化侧边栏...");
    initSidebar();
  }
  
  // 暴露初始化函数，以便于调试
  window.reinitSidebar = initSidebar;
})(); 