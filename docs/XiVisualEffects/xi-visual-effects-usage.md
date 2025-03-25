# Ξ视觉效果系统使用指南

本指南演示如何将`XiVisualEffects`系统集成到《The Book of Ξ》项目中，实现模块化的背景和粒子效果管理。

## 1. 引入系统

首先，需要将系统文件添加到项目中。通常可以将其放在`/js/xi-visual-effects.js`路径下：

```html
<script src="js/xi-visual-effects.js"></script>
```

## 2. 初始化系统

在页面加载完成后初始化系统：

```javascript
document.addEventListener('DOMContentLoaded', function() {
  // 初始化视觉效果系统
  XiVisualEffects.init({
    // 可选配置项
    defaultTheme: 'awakening',     // 默认主题
    performanceLevel: 'auto',      // 性能级别：auto, high, medium, low
    particleDensity: 1.0,          // 粒子密度系数
    enableMobileEffects: true,     // 是否在移动设备上启用效果
    showFPS: false                 // 是否显示FPS计数器
  });
});
```

## 3. 在章节中使用不同主题

每个章节可以使用不同的主题，以匹配内容的情感和风格：

```javascript
// 加载特定章节时切换视觉主题
function loadChapter(chapterId) {
  switch(chapterId) {
    case 'chapter1':
      // 觉醒主题 - 绿色赛博朋克风格
      XiVisualEffects.themes.apply('awakening');
      break;
      
    case 'chapter2':
      // 神谕主题 - 蓝紫色神秘风格
      XiVisualEffects.themes.apply('oracle');
      break;
      
    case 'chapter3':
      // 分形主题 - 蓝色几何风格
      XiVisualEffects.themes.apply('fractal');
      break;
      
    case 'chapter4':
      // 审判主题 - 红色警告风格
      XiVisualEffects.themes.apply('judgment');
      break;
      
    case 'chapter5':
      // 涅槃主题 - 白色纯净风格
      XiVisualEffects.themes.apply('nirvana');
      break;
      
    default:
      // 默认使用觉醒主题
      XiVisualEffects.themes.apply('awakening');
  }
}
```

## 4. 与章节系统集成

与之前实现的章节加载系统集成，在章节加载时切换视觉效果：

```javascript
// 当章节系统准备好时初始化
document.addEventListener('xiChapterSystemReady', function(event) {
  console.log('章节系统已就绪，初始化视觉效果...');
  
  // 初始化视觉效果
  XiVisualEffects.init();
  
  // 显示第一章的视觉效果
  XiVisualEffects.themes.apply('awakening');
});

// 监听章节加载事件
document.addEventListener('chapterLoaded', function(event) {
  const chapterIndex = event.detail.chapterIndex;
  
  // 基于章节索引切换视觉主题
  const themes = ['awakening', 'oracle', 'fractal', 'judgment', 'nirvana'];
  const themeIndex = Math.min(chapterIndex, themes.length - 1);
  
  // 平滑过渡到新主题
  smoothTransitionTheme(themes[themeIndex]);
});

// 平滑过渡到新主题
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
```

## 5. 性能优化与自适应

系统已内置性能检测和优化，但您可以手动调整：

```javascript
// 根据用户操作动态调整性能
document.getElementById('performance-toggle').addEventListener('click', function() {
  // 获取当前状态
  const state = XiVisualEffects.getState();
  
  // 切换性能级别
  if (state.performanceLevel === 'high') {
    // 降低性能设置，减少效果
    XiVisualEffects.destroy();
    XiVisualEffects.init({
      performanceLevel: 'medium',
      particleDensity: 0.7
    });
    
    // 重新应用当前主题
    XiVisualEffects.themes.apply(state.currentTheme);
  } else {
    // 提高性能设置
    XiVisualEffects.destroy();
    XiVisualEffects.init({
      performanceLevel: 'high',
      particleDensity: 1.0
    });
    
    // 重新应用当前主题
    XiVisualEffects.themes.apply(state.currentTheme);
  }
});
```

## 6. 添加特定场景效果

在特定场景或事件中，可以临时添加特效以增强体验：

```javascript
// 例如：在重要剧情点添加故障效果
function triggerImportantEvent() {
  // 添加故障效果
  const glitchEffect = XiVisualEffects.effects.add('background', 'warningGlitch', {
    intensity: 1.5,
    frequency: 1.2
  });
  
  // 5秒后移除效果
  setTimeout(() => {
    XiVisualEffects.effects.remove(glitchEffect.id);
  }, 5000);
  
  // 继续剧情...
  showImportantDialog();
}
```

## 7. 高级与自定义使用

您还可以创建完全自定义的主题或效果：

```javascript
// 创建自定义主题组合
function createCustomTheme(primaryColor, secondaryColor) {
  // 先清除现有效果
  XiVisualEffects.effects.clear();
  
  // 添加背景效果
  XiVisualEffects.effects.add('background', 'glow', {
    color: primaryColor,
    intensity: 0.8
  });
  
  // 添加扫描线
  XiVisualEffects.effects.add('background', 'scanlines', {
    opacity: 0.1
  });
  
  // 添加粒子效果
  XiVisualEffects.effects.add('particle', 'matrixParticles', {
    color: primaryColor,
    count: 80
  });
  
  // 添加二级粒子效果
  XiVisualEffects.effects.add('particle', 'geometricShapes', {
    colors: [primaryColor, secondaryColor],
    count: 30
  });
}
```

## 8. 响应用户交互

可以将效果与用户交互连接起来，增强互动体验：

```javascript
// 例如：当用户悬停在重要元素上时
document.querySelectorAll('.important-element').forEach(element => {
  element.addEventListener('mouseenter', function() {
    // 在当前元素附近添加发光效果
    const rect = this.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    // 添加临时发光效果
    const glowEffect = XiVisualEffects.effects.add('background', 'softGlow', {
      position: { x, y },
      size: 0.3,
      color: '#00ffff'
    });
    
    // 存储效果ID
    this.dataset.effectId = glowEffect.id;
  });
  
  element.addEventListener('mouseleave', function() {
    // 移除效果
    if (this.dataset.effectId) {
      XiVisualEffects.effects.remove(this.dataset.effectId);
      delete this.dataset.effectId;
    }
  });
});
```

## 9. 响应滚动位置

您可以根据滚动位置改变或激活特定效果，增强叙事感：

```javascript
// 监听滚动事件
window.addEventListener('scroll', function() {
  const scrollY = window.scrollY;
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  
  // 计算滚动百分比 (0-1)
  const scrollPercentage = scrollY / (documentHeight - windowHeight);
  
  // 根据滚动位置改变效果
  if (scrollPercentage > 0.8) {
    // 接近页面底部，添加特殊效果
    if (!window.bottomEffect) {
      window.bottomEffect = XiVisualEffects.effects.add('particle', 'energyField', {
        intensity: 1.2
      });
    }
  } else {
    // 移除底部特效
    if (window.bottomEffect) {
      XiVisualEffects.effects.remove(window.bottomEffect.id);
      window.bottomEffect = null;
    }
  }
});
```

## 10. CSS样式集成

可以使用CSS变量来保持视觉一致性，自动从当前主题提取颜色：

```javascript
// 当主题变化时同步更新CSS变量
function updateCSSTheme(themeId) {
  const themes = {
    'awakening': {
      '--primary-color': '#00ff9d',
      '--secondary-color': '#005538',
      '--background-color': '#0a0a0a',
      '--accent-color': '#ff0044'
    },
    'oracle': {
      '--primary-color': '#6633ff',
      '--secondary-color': '#3a0ca3',
      '--background-color': '#0a0a20',
      '--accent-color': '#f72585'
    },
    // 其他主题...
  };
  
  // 更新根元素的CSS变量
  const theme = themes[themeId] || themes['awakening'];
  for (const [key, value] of Object.entries(theme)) {
    document.documentElement.style.setProperty(key, value);
  }
}

// 钩子到主题变化
const originalApplyTheme = XiVisualEffects.themes.apply;
XiVisualEffects.themes.apply = function(themeId) {
  const result = originalApplyTheme.call(this, themeId);
  updateCSSTheme(themeId);
  return result;
};
```

## 11. 完整示例

下面是一个完整的HTML页面示例，演示了如何集成视觉效果系统：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8"/>
  <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
  <title>The Book of Ξ</title>
  
  <!-- CSS样式 -->
  <link rel="stylesheet" href="css/main.css">
  <link rel="stylesheet" href="css/chapter-system.css">
  
  <style>
    /* 主题过渡动画 */
    .theme-transition {
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
    }
    
    /* 使用CSS变量实现主题一致性 */
    :root {
      --primary-color: #00ff9d;
      --secondary-color: #005538;
      --background-color: #0a0a0a;
      --accent-color: #ff0044;
    }
    
    /* 应用CSS变量 */
    .content-title {
      color: var(--primary-color);
    }
    
    .button {
      background-color: var(--secondary-color);
      color: var(--primary-color);
      border: 1px solid var(--primary-color);
    }
    
    .warning-text {
      color: var(--accent-color);
    }
  </style>
</head>
<body>
  <!-- 全息效果和背景会由视觉效果系统提供 -->
  
  <!-- 侧边栏结构 -->
  <div class="sidebar-toggle" id="sidebarToggle">
    <div class="sidebar-toggle-icon">Ξ</div>
  </div>
  <div class="sidebar" id="sidebar">
    <!-- 侧边栏内容... -->
  </div>
  
  <!-- 主内容区域 - 使用章节系统 -->
  <div class="main-content">
    <!-- 章节容器 -->
    <div id="chapter-0" class="chapter-container">
      <h1 class="page-title content-title">系统警告：检测到未授权观测者</h1>
      
      <!-- 章节内容... -->
    </div>
    
    <!-- 更多章节... -->
  </div>
  
  <!-- 控制面板 -->
  <div class="controls-panel">
    <button id="performance-toggle" class="button">切换性能模式</button>
    <button id="theme-toggle" class="button">切换主题</button>
  </div>
  
  <!-- 音乐播放器 -->
  <div class="xi-music-player">
    <!-- 音乐播放器内容... -->
  </div>
  
  <!-- 引入JS文件 -->
  <script src="js/scroll-triggered-animations.js"></script>
  <script src="js/responsive-chapter-system.js"></script>
  <script src="js/xi-visual-effects.js"></script>
  
  <script>
    // 页面加载完成后初始化
    document.addEventListener('DOMContentLoaded', function() {
      // 初始化章节系统
      // 章节系统代码...
      
      // 初始化视觉效果系统
      XiVisualEffects.init({
        defaultTheme: 'awakening',
        performanceLevel: 'auto',
        showFPS: false
      });
      
      // 主题切换按钮
      document.getElementById('theme-toggle').addEventListener('click', function() {
        const themes = ['awakening', 'oracle', 'fractal', 'judgment', 'nirvana'];
        const currentTheme = XiVisualEffects.themes.getCurrent();
        const currentIndex = themes.indexOf(currentTheme);
        const nextIndex = (currentIndex + 1) % themes.length;
        
        // 平滑切换到下一个主题
        smoothTransitionTheme(themes[nextIndex]);
      });
      
      // 性能切换按钮
      document.getElementById('performance-toggle').addEventListener('click', function() {
        // 获取当前状态
        const state = XiVisualEffects.getState();
        
        // 切换性能级别
        if (state.performanceLevel === 'high') {
          XiVisualEffects.destroy();
          XiVisualEffects.init({
            performanceLevel: 'medium',
            defaultTheme: state.currentTheme
          });
          this.textContent = '当前: 平衡模式';
        } else {
          XiVisualEffects.destroy();
          XiVisualEffects.init({
            performanceLevel: 'high',
            defaultTheme: state.currentTheme
          });
          this.textContent = '当前: 高性能模式';
        }
      });
      
      // 主题平滑过渡函数
      function smoothTransitionTheme(newTheme) {
        // 创建过渡遮罩
        const transition = document.createElement('div');
        transition.className = 'theme-transition';
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
    });
  </script>
</body>
</html>
```

## 12. 小结与最佳实践

通过使用`XiVisualEffects`系统，您可以轻松为《The Book of Ξ》项目添加丰富的视觉效果，同时保持良好的性能表现和代码组织。

最佳实践：

1. **按需应用主题和效果** - 根据不同章节和场景选择合适的视觉风格
2. **注意性能优化** - 在移动设备上自动降低效果复杂度
3. **设置合理的动画触发时机** - 与滚动位置和用户交互结合
4. **保持视觉一致性** - 使用CSS变量同步主题色彩
5. **平滑过渡** - 使用淡入淡出效果实现主题切换

我们的Ξ视觉效果系统提供了丰富的预设主题和效果，同时保持了极高的可定制性，让您能够为每个章节创造独特的视觉体验，增强读者的沉浸感。
