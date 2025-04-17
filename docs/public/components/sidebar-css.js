/**
 * sidebar-css.js - 侧边栏样式组件
 * 
 * 这个脚本用于动态添加侧边栏样式，确保样式与脚本一起被引入，
 * 减少外部依赖，使得侧边栏组件可以独立工作。
 * 
 * 使用方法：
 * 1. 在HTML中引入此脚本：<script src="/components/sidebar-css.js"></script>
 * 2. 在引入sidebar.js之前引入此脚本
 * 
 * 版本：1.0.0
 * 日期：2024-03-27
 */

(function() {
  // 定义侧边栏的CSS样式
  const sidebarCSS = `
    /* 侧边栏基础样式 */
    .sidebar {
      position: fixed;
      left: 0;
      top: 0;
      width: 280px;
      height: 100vh;
      background-color: rgba(5, 5, 10, 0.9);
      border-right: 1px solid #00ff9d;
      box-shadow: 0 0 15px rgba(0, 255, 157, 0.3);
      z-index: 1000;
      transition: transform 0.3s ease;
      display: flex;
      flex-direction: column;
      transform: translateX(-100%);
      overflow-y: auto;
      color: #fff;
      font-family: 'Rajdhani', sans-serif, 'Arial';
    }
    
    .sidebar.active {
      transform: translateX(0);
    }
    
    .sidebar h1 {
      padding: 1rem;
      border-bottom: 1px solid #00ff9d;
      margin: 0;
      font-size: 1.5rem;
      text-align: center;
      color: #00ff9d;
      font-weight: 700;
      letter-spacing: 1px;
      text-shadow: 0 0 5px rgba(0, 255, 157, 0.5);
    }
    
    .sidebar-content {
      flex: 1;
      overflow-y: auto;
      padding: 1rem 0;
    }
    
    .sidebar ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    .sidebar ul li {
      margin-bottom: 0.5rem;
    }
    
    .sidebar a {
      display: block;
      padding: 0.4rem 1rem;
      color: #fff;
      text-decoration: none;
      transition: all 0.2s ease;
      font-size: 0.9rem;
    }
    
    .sidebar a:hover {
      background-color: rgba(0, 255, 157, 0.1);
      color: #00ff9d;
      transform: translateX(5px);
    }
    
    .chapter-title {
      font-weight: bold;
      padding: 0.7rem 1rem;
      color: #00ff9d;
      border-bottom: 1px solid rgba(0, 255, 157, 0.2);
      margin-top: 0.5rem;
      font-size: 1rem;
      letter-spacing: 0.5px;
      background-color: rgba(0, 255, 157, 0.05);
    }
    
    .chapter-items {
      padding-left: 1rem;
    }
    
    /* 侧边栏切换按钮 */
    .sidebar-toggle {
      position: fixed;
      top: 1rem;
      left: 1rem;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: rgba(5, 5, 10, 0.9);
      border: 1px solid #00ff9d;
      cursor: pointer;
      z-index: 1001;
      display: flex;
      justify-content: center;
      align-items: center;
      box-shadow: 0 0 10px rgba(0, 255, 157, 0.5);
      color: #00ff9d;
      font-size: 18px;
      transition: all 0.3s ease;
    }
    
    .sidebar-toggle:hover {
      transform: scale(1.1);
      box-shadow: 0 0 15px rgba(0, 255, 157, 0.7);
    }
    
    /* 主内容区调整 */
    .main-content {
      transition: margin-left 0.3s ease;
    }
    
    /* 媒体查询，响应式设计 */
    @media screen and (min-width: 769px) {
      .sidebar {
        transform: translateX(0);
      }
      
      .main-content {
        margin-left: 280px;
      }
      
      .sidebar-toggle {
        display: none;
      }
    }
    
    @media screen and (max-width: 768px) {
      .sidebar {
        width: 250px;
      }
      
      .main-content.sidebar-active {
        opacity: 0.7;
      }
      
      .sidebar-toggle {
        display: flex;
      }
    }
    
    /* 滚动条样式 */
    .sidebar::-webkit-scrollbar {
      width: 5px;
    }
    
    .sidebar::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.3);
    }
    
    .sidebar::-webkit-scrollbar-thumb {
      background: rgba(0, 255, 157, 0.5);
      border-radius: 3px;
    }
    
    .sidebar::-webkit-scrollbar-thumb:hover {
      background: rgba(0, 255, 157, 0.7);
    }
  `;

  // 创建样式元素并添加到页面头部
  function addSidebarStyles() {
    // 检查是否已经添加了样式
    if (document.getElementById('xi-sidebar-styles')) {
      console.log('[侧边栏样式] 已存在，跳过添加');
      return;
    }

    const styleElement = document.createElement('style');
    styleElement.id = 'xi-sidebar-styles';
    styleElement.textContent = sidebarCSS;
    document.head.appendChild(styleElement);
    console.log('[侧边栏样式] 已成功添加到页面');
  }

  // 在DOMContentLoaded时添加样式
  document.addEventListener('DOMContentLoaded', addSidebarStyles);

  // 如果页面已加载完成，则立即添加
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    addSidebarStyles();
  }

  // 暴露API
  window.XiSidebarCSS = {
    add: addSidebarStyles
  };
})(); 