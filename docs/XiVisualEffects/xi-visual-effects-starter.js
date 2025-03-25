/**
 * Ξ视觉效果系统 快速启动示例
 * 只需将此代码添加到您的页面中，即可轻松激活视觉效果系统
 */

document.addEventListener('DOMContentLoaded', function() {
  // 确保XiVisualEffects已加载
  if (typeof XiVisualEffects === 'undefined') {
    console.error('错误：XiVisualEffects未加载！请先引入xi-visual-effects.js文件');
    return;
  }
  
  // 初始化视觉效果系统
  XiVisualEffects.init({
    // 默认配置，可根据需要修改
    defaultTheme: 'awakening',    // 默认主题：awakening, oracle, fractal, judgment, nirvana
    performanceLevel: 'auto',     // 性能级别：auto, high, medium, low
    particleDensity: 1.0,         // 粒子密度系数 (0.1-2.0)
    showFPS: false,               // 是否显示FPS计数器
    enableMobileEffects: true     // 是否在移动设备上启用效果
  });
  
  // 与章节系统集成（如果存在）
  if (window.xiChapterSystem) {
    // 监听章节加载事件
    document.addEventListener('chapterLoaded', function(event) {
      // 获取已加载的章节索引
      const chapterIndex = event.detail.chapterIndex;
      
      // 根据章节索引选择适当的主题
      const themes = ['awakening', 'oracle', 'fractal', 'judgment', 'nirvana'];
      const themeIndex = Math.min(chapterIndex, themes.length - 1);
      
      // 使用平滑过渡切换主题
      smoothTransitionTheme(themes[themeIndex]);
    });
  }
  
  // 添加一些用户交互控制（可选）
  addUserControls();
});

/**
 * 平滑过渡到新主题
 * @param {string} newTheme - 新主题ID
 */
function smoothTransitionTheme(newTheme) {
  // 创建过渡遮罩
  const transition = document.createElement('div');
  transition.className = 'theme-transition';
  transition.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    opacity: 0;
    transition: opacity 0.5s ease;
    z-index: 1000;
    pointer-events: none;
  `;
  
  document.body.appendChild(transition);
  
  // 淡入遮罩
  setTimeout(() => {
    transition.style.opacity = '1';
  }, 50);
  
  // 切换主题
  setTimeout(() => {
    XiVisualEffects.themes.apply(newTheme);
    
    // 淡出遮罩
    setTimeout(() => {
      transition.style.opacity = '0';
      
      // 移除遮罩
      setTimeout(() => {
        if (transition.parentNode) {
          transition.parentNode.removeChild(transition);
        }
      }, 500);
    }, 300);
  }, 550);
}

/**
 * 添加用户控制界面（可选）
 */
function addUserControls() {
  // 创建控制面板
  const controls = document.createElement('div');
  controls.className = 'xi-visual-controls';
  controls.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: rgba(0, 0, 0, 0.7);
    border: 1px solid #00ff9d;
    border-radius: 5px;
    padding: 8px;
    z-index: 9998;
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-family: monospace;
    font-size: 12px;
    opacity: 0.3;
    transition: opacity 0.3s ease;
  `;
  
  // 悬停时显示
  controls.addEventListener('mouseenter', () => {
    controls.style.opacity = '1';
  });
  
  controls.addEventListener('mouseleave', () => {
    controls.style.opacity = '0.3';
  });
  
  // 创建主题切换按钮
  const themeBtn = createButton('更换主题', () => {
    const themes = XiVisualEffects.themes.list();
    const currentTheme = XiVisualEffects.themes.getCurrent();
    const currentIndex = themes.findIndex(theme => theme.id === currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    
    smoothTransitionTheme(themes[nextIndex].id);
  });
  
  // 创建性能模式切换按钮
  const perfBtn = createButton('性能模式', () => {
    const state = XiVisualEffects.getState();
    
    if (state.performanceLevel === 'high') {
      // 切换到平衡模式
      XiVisualEffects.destroy();
      XiVisualEffects.init({
        performanceLevel: 'medium',
        defaultTheme: state.currentTheme,
        particleDensity: 0.7
      });
      perfBtn.textContent = '性能模式: 平衡';
    } else {
      // 切换到高性能模式
      XiVisualEffects.destroy();
      XiVisualEffects.init({
        performanceLevel: 'high',
        defaultTheme: state.currentTheme,
        particleDensity: 1.0
      });
      perfBtn.textContent = '性能模式: 高';
    }
  });
  
  // 创建暂停/恢复按钮
  const pauseBtn = createButton('暂停效果', () => {
    const isPaused = XiVisualEffects.control.toggle();
    pauseBtn.textContent = isPaused ? '恢复效果' : '暂停效果';
  });
  
  // 添加按钮到控制面板
  controls.appendChild(themeBtn);
  controls.appendChild(perfBtn);
  controls.appendChild(pauseBtn);
  
  // 添加控制面板到文档
  document.body.appendChild(controls);
}

/**
 * 创建控制按钮
 * @param {string} text - 按钮文本
 * @param {Function} onClick - 点击回调
 * @returns {HTMLButtonElement} 按钮元素
 */
function createButton(text, onClick) {
  const button = document.createElement('button');
  button.textContent = text;
  button.style.cssText = `
    background: transparent;
    color: #00ff9d;
    border: 1px solid #00ff9d;
    border-radius: 3px;
    padding: 5px 10px;
    cursor: pointer;
    font-family: monospace;
    transition: all 0.3s ease;
  `;
  
  button.addEventListener('mouseover', () => {
    button.style.backgroundColor = 'rgba(0, 255, 157, 0.2)';
    button.style.boxShadow = '0 0 10px rgba(0, 255, 157, 0.5)';
  });
  
  button.addEventListener('mouseout', () => {
    button.style.backgroundColor = 'transparent';
    button.style.boxShadow = 'none';
  });
  
  button.addEventListener('click', onClick);
  
  return button;
}
