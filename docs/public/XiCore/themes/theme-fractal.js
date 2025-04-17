/**
 * theme-fractal.js - 分形主题配置
 * 
 * 蓝色几何风格主题，用于《The Book of Ξ》项目的第三章
 * 
 * 版本: 1.0.0
 * 日期: 2024-07-31
 */

(function() {
  // 确保XiCore已加载
  if (!window.XiCore) {
    console.error('[Theme:Fractal] XiCore系统未加载，无法注册主题');
    return;
  }
  
  // 主题颜色配置
  const colors = {
    primary: '#00aaff',       // 主色调 - 亮蓝色
    secondary: '#0066cc',     // 辅助色 - 深蓝色
    accent: '#00ffcc',        // 强调色 - 青绿色
    background: '#001a33',    // 背景色 - 深蓝黑色
    text: '#ffffff',          // 文本色 - 白色
    textSecondary: '#aaccee', // 次要文本色 - 淡蓝色
    border: '#0088cc',        // 边框色 - 中蓝色
    shadow: 'rgba(0, 170, 255, 0.5)', // 阴影色 - 半透明蓝色
    overlay: 'rgba(0, 26, 51, 0.8)'   // 遮罩层色 - 半透明深蓝色
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
    '--fractal-glow': '0 0 15px rgba(0, 170, 255, 0.6)',
    '--fractal-font': '"Share Tech Mono", monospace',
    '--terminal-line-height': '1.5',
    '--terminal-padding': '16px',
    '--terminal-border-radius': '0',
    '--terminal-background': 'rgba(0, 26, 51, 0.9)',
    '--terminal-border': '1px solid #00aaff',
    '--grid-color': 'rgba(0, 170, 255, 0.15)',
    '--grid-size': '20px',
    '--pattern-opacity': '0.12',
    '--pattern-speed': '10s',
    '--code-highlight': '#00ffcc'
  };
  
  // 视觉效果配置
  const visualEffects = {
    // 背景效果
    background: [
      {
        type: 'background',
        name: 'geometricGrid',
        params: {
          color: colors.primary,
          opacity: 0.12,
          size: 20,
          type: 'triangular'
        }
      },
      {
        type: 'background',
        name: 'fractals',
        params: {
          color: colors.primary,
          secondaryColor: colors.accent,
          complexity: 0.7,
          speed: 0.2
        }
      }
    ],
    
    // 粒子效果
    particles: [
      {
        type: 'particle',
        name: 'geometricParticles',
        params: {
          colors: [colors.primary, colors.accent, colors.secondary],
          shapes: ['triangle', 'square', 'circle', 'line'],
          speed: 0.5,
          density: 0.4,
          size: {min: 2, max: 6},
          connections: true
        }
      }
    ],
    
    // 遮罩或故障效果
    overlay: [
      {
        type: 'background',
        name: 'dataGrid',
        params: {
          opacity: 0.05,
          color: colors.primary,
          size: 30
        }
      },
      {
        type: 'background',
        name: 'vignette',
        params: {
          intensity: 0.6,
          color: colors.background
        }
      }
    ]
  };
  
  // 侧边栏样式
  const sidebarStyle = {
    backgroundColor: 'rgba(0, 26, 51, 0.95)',
    borderColor: colors.primary,
    textColor: colors.text,
    accentColor: colors.primary,
    highlightColor: colors.accent,
    shadowColor: colors.shadow,
    toggleButtonColor: colors.primary,
    toggleButtonBackground: 'rgba(0, 26, 51, 0.9)',
    headerBackground: 'rgba(0, 38, 77, 0.7)',
    fontSize: '0.9rem',
    itemHoverBackground: 'rgba(0, 170, 255, 0.1)'
  };
  
  // 音乐播放器样式
  const musicPlayerStyle = {
    backgroundColor: 'rgba(0, 26, 51, 0.95)',
    borderColor: colors.primary,
    textColor: colors.text,
    accentColor: colors.primary,
    controlColor: colors.text,
    controlHoverColor: colors.accent,
    progressBackground: '#00264d',
    progressFillColor: colors.primary,
    playlists: {
      default: [
        'Moonfall',
        '燃烧',
        '示例 - Fractal Synthesis (电子音乐)',
        '《Metaphysics》 (Remastered)',
        'Budapest (Cover) (Remastered)'
      ]
    }
  };
  
  // 滚动动画样式
  const scrollAnimationStyle = {
    baseColor: colors.primary,
    fadeInDuration: '0.7s',
    slideUpDistance: '15px',
    fadeInDelay: '0.2s',
    terminalProgressColor: colors.accent,
    typewriterCursorColor: colors.accent
  };
  
  // 完整主题配置
  const themeConfig = {
    id: 'fractal',
    name: '分形主题',
    description: '蓝色几何风格，适合第三章节',
    
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
      document.body.classList.add('theme-fractal');
      
      // 移除其他主题类
      document.body.classList.remove('theme-awakening', 'theme-oracle', 'theme-judgment');
      
      console.log('[Theme:Fractal] 主题已应用');
    },
    
    // 主题移除函数
    remove: function() {
      // 移除主题特有的类
      document.body.classList.remove('theme-fractal');
      
      console.log('[Theme:Fractal] 主题已移除');
    }
  };
  
  // 注册主题到XiCore系统
  XiCore.registerTheme(themeConfig);
  
  console.log('[Theme:Fractal] 分形主题已加载');
})(); 