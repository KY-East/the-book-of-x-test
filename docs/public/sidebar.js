// 最精简侧边栏操作脚本
document.addEventListener('DOMContentLoaded', function() {
  console.log('加载精简侧边栏脚本');
  
  // 清理重复元素
  var sidebars = document.querySelectorAll('.sidebar');
  if (sidebars.length > 1) {
    for (var i = 1; i < sidebars.length; i++) {
      if (sidebars[i].parentNode) {
        sidebars[i].parentNode.removeChild(sidebars[i]);
      }
    }
  }
  
  var toggles = document.querySelectorAll('.sidebar-toggle');
  if (toggles.length > 1) {
    for (var i = 1; i < toggles.length; i++) {
      if (toggles[i].parentNode) {
        toggles[i].parentNode.removeChild(toggles[i]);
      }
    }
  }
  
  // 获取剩余的元素
  var sidebar = document.querySelector('.sidebar');
  var toggle = document.querySelector('.sidebar-toggle');
  var mainContent = document.querySelector('.main-content');
  
  if (!sidebar || !toggle) {
    console.error('找不到侧边栏元素');
    return;
  }
  
  // 为GitHub Pages修复链接
  if (window.location.hostname.includes('github.io')) {
    const links = sidebar.querySelectorAll('a');
    const repoName = '/the-book-of-x-test';
    
    links.forEach(link => {
      // 避免处理外部链接
      if (!link.href.startsWith('http') || link.href.includes(window.location.hostname)) {
        // 解析链接路径
        let path = link.getAttribute('href');
        if (path && !path.startsWith(repoName) && !path.startsWith('#')) {
          // 修复路径
          link.href = repoName + '/' + path;
        }
      }
    });
  }
  
  // 绑定点击事件
  toggle.onclick = function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    // 切换侧边栏状态
    if (sidebar.classList.contains('active')) {
      sidebar.classList.remove('active');
      if (mainContent) mainContent.classList.remove('sidebar-active');
    } else {
      sidebar.classList.add('active');
      if (mainContent) mainContent.classList.add('sidebar-active');
    }
    
    return false;
  };
  
  // 点击页面其他区域关闭侧边栏
  document.body.onclick = function(e) {
    if (sidebar.classList.contains('active') && 
        !sidebar.contains(e.target) && 
        e.target !== toggle &&
        !toggle.contains(e.target)) {
      sidebar.classList.remove('active');
      if (mainContent) mainContent.classList.remove('sidebar-active');
    }
  };
}); 