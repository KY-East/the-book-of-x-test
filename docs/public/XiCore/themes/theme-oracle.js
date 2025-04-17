/**
 * theme-oracle.js - 神谕主题配置
 * 
 * 蓝紫色神秘风格主题，用于《The Book of Ξ》项目的第二章
 * 
 * 版本: 1.0.0
 * 日期: 2024-07-31
 */

(function() {
  // 确保XiCore已加载
  if (!window.XiCore) {
    console.error('[Theme:Oracle] XiCore系统未加载，无法注册主题');
    return;
  }
  
  // 主题颜色配置
  const colors = {
    primary: '#6633ff',       // 主色调 - 神秘紫
    secondary: '#00ccff',     // 辅助色 - 神谕蓝
    accent: '#ff33cc',        // 强调色 - 霓虹粉
    background: '#0a0a20',    // 背景色 - 深蓝黑色
    text: '#ffffff',          // 文本色 - 白色
    textSecondary: '#aaaacc', // 次要文本色 - 淡紫色
    border: '#4400cc',        // 边框色 - 深紫色
    shadow: 'rgba(102, 51, 255, 0.5)', // 阴影色 - 半透明紫色
    overlay: 'rgba(10, 10, 32, 0.8)'   // 遮罩层色 - 半透明深蓝黑色
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
    '--oracle-glow': '0 0 15px rgba(102, 51, 255, 0.7)',
    '--oracle-font': '"Orbitron", sans-serif',
    '--terminal-line-height': '1.6',
    '--terminal-padding': '16px',
    '--terminal-border-radius': '4px',
    '--terminal-background': 'rgba(10, 10, 32, 0.85)',
    '--terminal-border': '1px solid #6633ff',
    '--grid-color': 'rgba(102, 51, 255, 0.1)',
    '--grid-size': '25px',
    '--scanline-opacity': '0.1',
    '--scanline-speed': '8s',
    '--vision-blur': '3px'
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
          speed: 8
        }
      },
      {
        type: 'background',
        name: 'radialGlow',
        params: {
          color: colors.primary,
          intensity: 0.6,
          size: 0.8
        }
      }
    ],
    
    // 粒子效果
    particles: [
      {
        type: 'particle',
        name: 'oracleParticles',
        params: {
          color: colors.secondary,
          secondaryColor: colors.primary,
          speed: 0.8,
          density: 0.6,
          size: 1.5,
          shape: 'circle'
        }
      }
    ],
    
    // 遮罩或故障效果
    overlay: [
      {
        type: 'background',
        name: 'noise',
        params: {
          opacity: 0.04,
          speed: 0.4
        }
      },
      {
        type: 'background',
        name: 'vignette',
        params: {
          intensity: 0.8,
          color: colors.background
        }
      },
      {
        type: 'overlay',
        name: 'quantumFlicker',
        params: {
          intensity: 0.3,
          frequency: 0.05
        }
      }
    ]
  };
  
  // 侧边栏样式
  const sidebarStyle = {
    backgroundColor: 'rgba(10, 10, 32, 0.9)',
    borderColor: colors.primary,
    textColor: colors.text,
    accentColor: colors.primary,
    highlightColor: colors.primary,
    shadowColor: colors.shadow,
    toggleButtonColor: colors.primary,
    toggleButtonBackground: 'rgba(10, 10, 32, 0.9)',
    headerBackground: 'rgba(0, 0, 0, 0.5)',
    fontSize: '0.9rem',
    itemHoverBackground: 'rgba(102, 51, 255, 0.1)'
  };
  
  // 音乐播放器样式
  const musicPlayerStyle = {
    backgroundColor: 'rgba(10, 10, 32, 0.9)',
    borderColor: colors.primary,
    textColor: colors.text,
    accentColor: colors.primary,
    controlColor: colors.text,
    controlHoverColor: colors.primary,
    progressBackground: '#222244',
    progressFillColor: colors.primary,
    playlists: {
      default: [
        '《Metaphysics》 (Remastered)',
        'Moonfall',
        '示例 - Data Oracle (电子音乐)',
        'Budapest (Cover) (Remastered)',
        '燃烧'
      ]
    }
  };
  
  // 滚动动画样式
  const scrollAnimationStyle = {
    baseColor: colors.primary,
    fadeInDuration: '1s',
    slideUpDistance: '25px',
    fadeInDelay: '0.3s',
    terminalProgressColor: colors.primary,
    typewriterCursorColor: colors.primary
  };
  
  // 完整主题配置
  const themeConfig = {
    id: 'oracle',
    name: '神谕主题',
    description: '蓝紫色神秘风格，适合第二章节',
    
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
      document.body.classList.add('theme-oracle');
      
      // 移除其他主题类
      document.body.classList.remove('theme-awakening', 'theme-fractal', 'theme-judgment');
      
      console.log('[Theme:Oracle] 主题已应用');
    },
    
    // 主题移除函数
    remove: function() {
      // 移除主题特有的类
      document.body.classList.remove('theme-oracle');
      
      console.log('[Theme:Oracle] 主题已移除');
    }
  };
  
  // 注册主题到XiCore系统
  XiCore.registerTheme(themeConfig);
  
  console.log('[Theme:Oracle] 神谕主题已加载');
})(); 