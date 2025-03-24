/**
 * sidebar.js - 从first-contact-protocol.html提取
 * 提取时间: 2025-03-20T02:04:12.666Z
 * 功能: 侧边栏功能
 */

(function() {
// 侧边栏功能
document.addEventListener('DOMContentLoaded', function() {
  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebarToggle');
  const mainContent = document.querySelector('.main-content');
  
  if (!sidebar || !sidebarToggle || !mainContent) {
    console.error('侧边栏元素未找到!');
    return;
  }
  
  console.log('侧边栏元素已找到，初始化事件...');
  
  // 切换侧边栏
  sidebarToggle.addEventListener('click', function() {
    console.log('切换侧边栏');
    sidebar.classList.toggle('active');
    if (sidebar.classList.contains('active')) {
      mainContent.classList.add('sidebar-active');
    } else {
      mainContent.classList.remove('sidebar-active');
    }
  });
  
  // 点击侧边栏外关闭侧边栏
  document.addEventListener('click', function(e) {
    if (sidebar.classList.contains('active') && 
        !sidebar.contains(e.target) && 
        e.target !== sidebarToggle &&
        !sidebarToggle.contains(e.target)) {
      sidebar.classList.remove('active');
      mainContent.classList.remove('sidebar-active');
    }
  });
  
  // 高亮当前页面链接
  const currentUrl = window.location.pathname;
  const links = sidebar.querySelectorAll('a');
  links.forEach(link => {
    if (link.getAttribute('href') === currentUrl) {
      link.style.color = '#00ff9d';
      link.style.fontWeight = 'bold';
    }
  });
});

})();
