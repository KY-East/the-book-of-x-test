/**
 * global-music-player.js - 全局音乐播放器组件
 * 
 * 简化版 - 直接加载XiCore音乐模块
 * 版本: 2.0.0
 * 日期: 2024-07-28
 */

(function() {
  console.log('[全局播放器] 开始初始化...');
  
  // 获取基础路径
  function getBasePath() {
    const host = window.location.hostname;
    const path = window.location.pathname;
    
    if (host.includes('github.io') || path.includes('/the-book-of-x-test/')) {
      return '/the-book-of-x-test';
    }
    return '';
  }
  
  const basePath = getBasePath();
  
  // 检查音乐播放器是否已加载
  if (typeof window.MusicPlayer !== 'undefined') {
    console.log('[全局播放器] 音乐播放器已加载，重用现有实例');
    return;
  }
  
  // 加载XiCore音乐模块
  const scriptPath = `${basePath}/XiCore/modules/xi-music.js`;
  
  console.log(`[全局播放器] 加载音乐模块: ${scriptPath}`);
  
  // 创建脚本元素
  const script = document.createElement('script');
  script.src = scriptPath;
  script.async = true;
  
  // 设置加载处理
  script.onload = function() {
    console.log('[全局播放器] 音乐模块加载成功');
    
    // 确保全局音乐播放器接口
    window.globalMusicPlayer = window.MusicPlayer;
    
    // 自动初始化
    if (window.MusicPlayer && !window.MusicPlayer.getState().initialized) {
      setTimeout(function() {
        window.MusicPlayer.init();
      }, 100);
    }
  };
  
  script.onerror = function() {
    console.error('[全局播放器] 无法加载音乐模块');
    
    // 显示错误提示
    const errorDiv = document.createElement('div');
    errorDiv.style.position = 'fixed';
    errorDiv.style.bottom = '10px';
    errorDiv.style.right = '10px';
    errorDiv.style.backgroundColor = 'rgba(255, 0, 0, 0.7)';
    errorDiv.style.color = 'white';
    errorDiv.style.padding = '10px';
    errorDiv.style.borderRadius = '5px';
    errorDiv.style.zIndex = '9999';
    errorDiv.textContent = '音乐播放器加载失败，请刷新页面重试';
    
    document.body.appendChild(errorDiv);
    
    // 5秒后自动关闭提示
    setTimeout(function() {
      if (errorDiv.parentNode) {
        errorDiv.parentNode.removeChild(errorDiv);
      }
    }, 5000);
  };
  
  // 添加到文档
  document.head.appendChild(script);
  
  console.log('[全局播放器] 脚本已添加到文档');
})(); 