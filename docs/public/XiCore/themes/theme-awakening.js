/**
 * theme-awakening.js - 觉醒主题配置
 * 
 * 绿色赛博朋克风格主题，用于《The Book of Ξ》项目的第一章
 * 
 * 版本: 1.0.0
 * 日期: 2024-07-28
 */

(function() {
  // 确保XiCore已加载
  if (!window.XiCore) {
    console.error('[Theme:Awakening] XiCore系统未加载，无法注册主题');
    return;
  }
  
  // 主题颜色配置
  const colors = {
    primary: '#00ff9d',       // 主色调 - 霓虹绿
    secondary: '#4590ff',     // 辅助色 - 蓝色
    accent: '#ff3366',        // 强调色 - 粉色
    background: '#05050a',    // 背景色 - 深黑色
    text: '#ffffff',          // 文本色 - 白色
    textSecondary: '#aaaaaa', // 次要文本色 - 灰色
    border: '#00aa77',        // 边框色 - 深绿色
    shadow: 'rgba(0, 255, 157, 0.5)', // 阴影色 - 半透明绿色
    overlay: 'rgba(5, 5, 10, 0.8)'    // 遮罩层色 - 半透明黑色
  };
  
  // CSS变量（可应用于根元素）
  const cssVariables = {
    '--primary-color': colors.primary,
    '--secondary-color': colors.secondary,
    '--accent-color': colors.accent,
    '--background-color': colors.background,
    '--text-color': colors.text,
    '--text-secondary-color': colors.textSecondary,
    '--border-color': colors.border,
    '--shadow-color': colors.shadow,
    '--overlay-color': colors.overlay,
    
    // 特有的主题变量
    '--neon-glow': '0 0 10px rgba(0, 255, 157, 0.7)',
    '--terminal-font': '"Fira Code", monospace',
    '--terminal-line-height': '1.6',
    '--terminal-padding': '16px',
    '--terminal-border-radius': '4px',
    '--terminal-background': 'rgba(0, 10, 5, 0.85)',
    '--terminal-border': '1px solid #00ff9d',
    '--grid-color': 'rgba(0, 255, 157, 0.1)',
    '--grid-size': '20px',
    '--scanline-opacity': '0.1',
    '--scanline-speed': '6s'
  };
  
  // 视觉效果配置
  const visualEffects = {
    // 背景效果
    background: [
      {
        type: 'background',
        name: 'scanlines',
        params: {
          color: colors.primary,
          opacity: 0.1,
          speed: 6
        }
      },
      {
        type: 'background',
        name: 'grid',
        params: {
          color: colors.primary,
          opacity: 0.08,
          size: 20
        }
      }
    ],
    
    // 粒子效果
    particles: [
      {
        type: 'particle',
        name: 'matrixRain',
        params: {
          color: colors.primary,
          speed: 1.2,
          density: 0.7,
          size: 1.2
        }
      }
    ],
    
    // 遮罩或故障效果
    overlay: [
      {
        type: 'background',
        name: 'noise',
        params: {
          opacity: 0.03,
          speed: 0.5
        }
      },
      {
        type: 'background',
        name: 'vignette',
        params: {
          intensity: 0.7,
          color: colors.background
        }
      }
    ]
  };
  
  // 侧边栏样式
  const sidebarStyle = {
    backgroundColor: 'rgba(5, 5, 10, 0.9)',
    borderColor: colors.primary,
    textColor: colors.text,
    accentColor: colors.primary,
    highlightColor: colors.primary,
    shadowColor: colors.shadow,
    toggleButtonColor: colors.primary,
    toggleButtonBackground: 'rgba(5, 5, 10, 0.9)',
    headerBackground: 'rgba(0, 0, 0, 0.5)',
    fontSize: '0.9rem',
    itemHoverBackground: 'rgba(0, 255, 157, 0.1)'
  };
  
  // 音乐播放器样式
  const musicPlayerStyle = {
    backgroundColor: 'rgba(5, 5, 10, 0.9)',
    borderColor: colors.primary,
    textColor: colors.text,
    accentColor: colors.primary,
    controlColor: colors.text,
    controlHoverColor: colors.primary,
    progressBackground: '#333',
    progressFillColor: colors.primary,
    playlists: {
      default: [
        '燃烧',
        '《Metaphysics》 (Remastered)',
        'Budapest (Cover) (Remastered)',
        'Moonfall',
        '示例 - Algorithms (电子音乐)'
      ]
    }
  };
  
  // 滚动动画样式
  const scrollAnimationStyle = {
    baseColor: colors.primary,
    fadeInDuration: '0.8s',
    slideUpDistance: '20px',
    fadeInDelay: '0.2s',
    terminalProgressColor: colors.primary,
    typewriterCursorColor: colors.primary
  };
  
  // 完整主题配置
  const themeConfig = {
    id: 'awakening',
    name: '觉醒主题',
    description: '绿色赛博朋克风格，适合第一章节',
    
    // 基础颜色
    colors: colors,
    
    // CSS变量
    cssVariables: cssVariables,
    
    // 视觉效果配置
    visualEffects: visualEffects,
    
    // 组件样式
    components: {
      sidebar: sidebarStyle,
      musicPlayer: musicPlayerStyle,
      scrollAnimation: scrollAnimationStyle
    },
    
    // 主题应用函数
    apply: function() {
      // 应用CSS变量到根元素
      const root = document.documentElement;
      Object.entries(this.cssVariables).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });
      
      // 添加主题特有的类
      document.body.classList.add('theme-awakening');
      
      console.log('[Theme:Awakening] 主题已应用');
    },
    
    // 主题移除函数
    remove: function() {
      // 移除主题特有的类
      document.body.classList.remove('theme-awakening');
      
      console.log('[Theme:Awakening] 主题已移除');
    }
  };
  
  // 注册主题到XiCore
  window.XiCore.registerTheme('awakening', themeConfig);
  
  console.log('[Theme:Awakening] 主题已注册');
})(); 