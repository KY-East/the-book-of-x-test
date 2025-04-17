/**
 * theme-judgment.js - 审判主题配置
 * 
 * 红色警告风格主题，用于《The Book of Ξ》项目的第四章
 * 
 * 版本: 1.0.0
 * 日期: 2024-07-31
 */

(function() {
  // 确保XiCore已加载
  if (!window.XiCore) {
    console.error('[Theme:Judgment] XiCore系统未加载，无法注册主题');
    return;
  }
  
  // 主题颜色配置
  const colors = {
    primary: '#ff3333',       // 主色调 - 警告红
    secondary: '#990000',     // 辅助色 - 深红色
    accent: '#ffcc00',        // 强调色 - 警告黄
    background: '#1a0000',    // 背景色 - 深暗红色
    text: '#ffffff',          // 文本色 - 白色
    textSecondary: '#cccccc', // 次要文本色 - 灰色
    border: '#cc0000',        // 边框色 - 红色
    shadow: 'rgba(255, 51, 51, 0.6)', // 阴影色 - 半透明红色
    overlay: 'rgba(26, 0, 0, 0.85)'   // 遮罩层色 - 半透明深暗红色
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
    '--warning-glow': '0 0 15px rgba(255, 51, 51, 0.7)',
    '--judgment-font': '"Rajdhani", sans-serif',
    '--terminal-line-height': '1.5',
    '--terminal-padding': '16px',
    '--terminal-border-radius': '2px',
    '--terminal-background': 'rgba(26, 0, 0, 0.9)',
    '--terminal-border': '1px solid #ff3333',
    '--alert-color': '#ffcc00',
    '--warning-color': '#ff3333',
    '--alert-background': 'rgba(255, 204, 0, 0.1)',
    '--warning-background': 'rgba(255, 51, 51, 0.1)',
    '--grid-size': '30px'
  };
  
  // 视觉效果配置
  const visualEffects = {
    // 背景效果
    background: [
      {
        type: 'background',
        name: 'warningOutline',
        params: {
          color: colors.primary,
          opacity: 0.15,
          size: 30,
          type: 'diagonal'
        }
      },
      {
        type: 'background',
        name: 'pulsingVignette',
        params: {
          color: colors.background,
          intensity: 0.8,
          pulseSpeed: 3
        }
      }
    ],
    
    // 粒子效果
    particles: [
      {
        type: 'particle',
        name: 'warningParticles',
        params: {
          colors: [colors.primary, colors.accent],
          speed: 1.2,
          density: 0.3,
          size: {min: 1, max: 3},
          blinking: true
        }
      }
    ],
    
    // 遮罩或故障效果
    overlay: [
      {
        type: 'overlay',
        name: 'scanlines',
        params: {
          opacity: 0.1,
          color: colors.primary,
          speed: 5
        }
      },
      {
        type: 'overlay',
        name: 'warningGlitch',
        params: {
          intensity: 0.3,
          frequency: 10,
          color: colors.primary
        }
      },
      {
        type: 'overlay',
        name: 'noise',
        params: {
          opacity: 0.05,
          speed: 0.5
        }
      }
    ]
  };
  
  // 侧边栏样式
  const sidebarStyle = {
    backgroundColor: 'rgba(26, 0, 0, 0.95)',
    borderColor: colors.primary,
    textColor: colors.text,
    accentColor: colors.primary,
    highlightColor: colors.accent,
    shadowColor: colors.shadow,
    toggleButtonColor: colors.primary,
    toggleButtonBackground: 'rgba(26, 0, 0, 0.9)',
    headerBackground: 'rgba(51, 0, 0, 0.7)',
    fontSize: '0.9rem',
    itemHoverBackground: 'rgba(255, 51, 51, 0.15)'
  };
  
  // 音乐播放器样式
  const musicPlayerStyle = {
    backgroundColor: 'rgba(26, 0, 0, 0.95)',
    borderColor: colors.primary,
    textColor: colors.text,
    accentColor: colors.primary,
    controlColor: colors.text,
    controlHoverColor: colors.accent,
    progressBackground: '#330000',
    progressFillColor: colors.primary,
    playlists: {
      default: [
        '燃烧',
        '示例 - Judgment Day (电子音乐)',
        'Moonfall',
        '《Metaphysics》 (Remastered)',
        'Budapest (Cover) (Remastered)'
      ]
    }
  };
  
  // 滚动动画样式
  const scrollAnimationStyle = {
    baseColor: colors.primary,
    fadeInDuration: '0.6s',
    slideUpDistance: '10px',
    fadeInDelay: '0.15s',
    terminalProgressColor: colors.accent,
    typewriterCursorColor: colors.primary
  };
  
  // 完整主题配置
  const themeConfig = {
    id: 'judgment',
    name: '审判主题',
    description: '红色警告风格，适合第四章节',
    
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
      document.body.classList.add('theme-judgment');
      
      // 移除其他主题类
      document.body.classList.remove('theme-awakening', 'theme-oracle', 'theme-fractal');
      
      console.log('[Theme:Judgment] 主题已应用');
    },
    
    // 主题移除函数
    remove: function() {
      // 移除主题特有的类
      document.body.classList.remove('theme-judgment');
      
      console.log('[Theme:Judgment] 主题已移除');
    }
  };
  
  // 注册主题到XiCore系统
  XiCore.registerTheme(themeConfig);
  
  console.log('[Theme:Judgment] 审判主题已加载');
})(); 