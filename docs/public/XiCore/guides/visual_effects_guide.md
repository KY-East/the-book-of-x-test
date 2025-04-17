# XiCore 视觉效果指南

> "视觉效果不仅是装饰，更是体验的核心组成部分，能够引导注意力、传递情感、强化主题。"

本文档详细说明XiCore视觉效果系统的使用方法、效果层级和性能优化策略，帮助创作者选择和实现合适的视觉效果。

## 目录
- [效果层级体系](#效果层级体系)
- [性能优化策略](#性能优化策略)
- [预设场景组合](#预设场景组合)
- [自定义效果开发](#自定义效果开发)
- [常见问题与解决方案](#常见问题与解决方案)

## 效果层级体系

XiCore视觉效果系统采用四层结构，从基础到高级逐层构建沉浸式体验：

### 1. 基础层 (Base Layer)
提供基本的氛围和风格定义，几乎不消耗性能，适用于所有设备。

**主要效果**：
- **背景渐变** - 定义页面基调
- **扫描线** - 赛博朋克/科技感基础元素
- **基础光晕** - 为重要元素添加视觉重点

```javascript
// 添加基础层效果
XiCore.visual.addBaseEffect('scanLine', {
  opacity: 0.15,
  speed: 0.5,
  color: 'var(--neon-primary)'
});

XiCore.visual.addBaseEffect('gradient', {
  type: 'radial',
  colors: ['#0a0a12', '#0d0d1a'],
  position: 'center'
});
```

### 2. 氛围层 (Atmosphere Layer)
创建场景的整体氛围和情绪，为页面增添深度和情感色彩。中等性能消耗。

**主要效果**：
- **粒子系统** - 漂浮的光点、数据流等
- **量子效果** - 量子波动、概率云等
- **故障艺术** - 数字故障、信号干扰

```javascript
// 添加氛围层效果
XiCore.visual.addAtmosphereEffect('particles', {
  type: 'data',
  count: 50,
  speed: 0.3,
  color: 'var(--neon-blue)',
  opacity: 0.6,
  size: {min: 1, max: 3}
});

XiCore.visual.addAtmosphereEffect('quantumWave', {
  amplitude: 5,
  frequency: 0.05,
  color: 'var(--neon-purple)',
  opacity: 0.3
});
```

### 3. 交互层 (Interaction Layer)
响应用户操作的视觉反馈，增强交互体验和沉浸感。根据交互频率影响性能。

**主要效果**：
- **悬停效果** - 元素高亮、脉冲等
- **点击效果** - 涟漪、闪光等
- **滚动效果** - 视差滚动、内容淡入等

```javascript
// 添加交互层效果
XiCore.visual.addInteractionEffect('hover', '.interactive-element', {
  effect: 'glow',
  intensity: 0.8,
  color: 'var(--neon-primary)',
  duration: 300
});

XiCore.visual.addInteractionEffect('click', '.button', {
  effect: 'ripple',
  color: 'var(--neon-secondary)',
  duration: 500,
  size: 100
});

XiCore.visual.addInteractionEffect('scroll', '.parallax-section', {
  effect: 'parallax',
  depth: 0.2,
  direction: 'vertical'
});
```

### 4. 场景特效层 (Scene Effect Layer)
高级视觉效果，用于关键叙事节点和特殊场景，性能消耗较高。

**主要效果**：
- **转场动画** - 场景切换、章节过渡等
- **特殊事件** - 关键剧情的视觉强化
- **剧情触发** - 与叙事紧密结合的视觉效果

```javascript
// 添加场景特效层效果
XiCore.visual.addSceneEffect('transition', {
  type: 'portal',
  duration: 2000,
  easing: 'cubic-bezier(0.19, 1, 0.22, 1)',
  onComplete: () => {
    // 转场完成后的回调
    XiCore.narrative.advanceToNextScene();
  }
});

XiCore.visual.addSceneEffect('event', '#revelation-moment', {
  type: 'reality-glitch',
  intensity: 0.9,
  duration: 3000,
  layers: ['color-shift', 'displacement', 'noise']
});
```

## 性能优化策略

XiCore视觉效果系统提供多级性能设置，自动适应不同设备性能。

### 1. 性能级别配置

```javascript
// 性能级别配置
XiCore.visual.setPerformanceLevel({
  level: 'auto', // 'low', 'medium', 'high', 'ultra', 'auto'
  particleMultiplier: 1.0, // 粒子数量倍率，0.5-2.0
  effectQuality: 'high', // 'low', 'medium', 'high'
  animationFrameRate: 60 // 动画帧率，30-60
});
```

各性能级别的默认配置：

| 级别 | 粒子数量 | 效果质量 | 动画帧率 | 建议设备 |
|------|---------|---------|---------|---------|
| low | 30% | 低 | 30fps | 低端移动设备 |
| medium | 60% | 中 | 45fps | 普通移动设备 |
| high | 100% | 高 | 60fps | 高端移动设备/普通电脑 |
| ultra | 150% | 最高 | 60fps | 高端电脑 |
| auto | 动态调整 | 动态调整 | 动态调整 | 所有设备 |

### 2. 动态性能调整

```javascript
// 启用动态性能调整
XiCore.visual.enableAdaptivePerformance({
  targetFPS: 45, // 目标帧率
  sampleDuration: 5000, // 性能采样周期(毫秒)
  adjustmentStep: 0.1, // 每次调整步长
  minAcceptableFPS: 30 // 最低可接受帧率
});
```

### 3. 选择性降级策略

```javascript
// 配置降级策略
XiCore.visual.setFallbackStrategy({
  // 如果帧率低于30，禁用粒子效果
  'fps < 30': ['disableParticles', 'reduceAnimationQuality'],
  
  // 如果内存使用超过80%，减少特效数量
  'memory > 80%': ['reduceEffectCount', 'simplifySceneEffects'],
  
  // 如果设备是移动设备，使用简化版特效
  'isMobile': ['useSimplifiedEffects', 'disableBlur']
});
```

## 预设场景组合

XiCore提供多种预设场景效果组合，适用于不同风格的章节。

### 1. 雅典场景 (Athens)
古希腊风格，金色调为主，适合哲学和历史主题。

```javascript
// 应用雅典场景效果组合
XiCore.visual.applyScenePreset('athens', {
  container: '#athens-scene',
  intensity: 0.8,
  particleTypes: ['dust', 'light'],
  enableMarbleEffect: true
});
```

**效果包含**：
- 金色微粒尘埃效果
- 大理石纹理光晕
- 柔和光粒子
- 古典装饰图案动画

### 2. 现代场景 (Modern)
现代都市风格，霓虹色调，适合赛博朋克主题。

```javascript
// 应用现代场景效果组合
XiCore.visual.applyScenePreset('modern', {
  container: '#cyberpunk-scene',
  intensity: 0.9,
  weather: 'rain',
  timeOfDay: 'night'
});
```

**效果包含**：
- 矩阵数字雨效果
- 霓虹辉光边缘
- 城市霓虹灯反光
- 全息投影界面

### 3. 故障场景 (Glitch)
系统故障风格，红色警告色调，适合冲突和危机主题。

```javascript
// 应用故障场景效果组合
XiCore.visual.applyScenePreset('glitch', {
  container: '#error-scene',
  intensity: 0.85,
  glitchDensity: 'medium',
  warningLevel: 'high'
});
```

**效果包含**：
- 信号干扰特效
- 错误警告闪烁
- 数据损坏视觉效果
- 系统错误界面元素

### 4. 量子场景 (Quantum)
量子科技风格，蓝紫色调，适合超现实和量子叙事。

```javascript
// 应用量子场景效果组合
XiCore.visual.applyScenePreset('quantum', {
  container: '#quantum-scene',
  intensity: 0.75,
  waveComplexity: 'high',
  particleBehavior: 'entangled'
});
```

**效果包含**：
- 量子波函数可视化
- 概率云特效
- 量子纠缠粒子系统
- 多维数据流

## 自定义效果开发

XiCore支持开发自定义视觉效果，与内置效果系统无缝集成。

### 1. 效果注册框架

```javascript
// 注册自定义效果
XiCore.visual.registerCustomEffect({
  name: 'myCustomEffect',
  type: 'atmosphere', // 'base', 'atmosphere', 'interaction', 'scene'
  
  // 初始化函数
  init: function(container, options) {
    // 创建效果所需的DOM元素或Canvas
    const element = document.createElement('div');
    element.className = 'custom-effect-container';
    container.appendChild(element);
    
    // 保存状态和选项
    this.element = element;
    this.options = options;
    this.isActive = false;
  },
  
  // 启动效果
  start: function() {
    this.isActive = true;
    this.animationFrame = requestAnimationFrame(this.update.bind(this));
  },
  
  // 更新函数（每帧调用）
  update: function(timestamp) {
    if (!this.isActive) return;
    
    // 实现效果动画逻辑
    // ...
    
    this.animationFrame = requestAnimationFrame(this.update.bind(this));
  },
  
  // 停止效果
  stop: function() {
    this.isActive = false;
    cancelAnimationFrame(this.animationFrame);
  },
  
  // 清理资源
  dispose: function() {
    this.stop();
    this.element.remove();
  }
});
```

### 2. GLSL着色器集成

```javascript
// 注册基于GLSL的自定义效果
XiCore.visual.registerShaderEffect({
  name: 'customShaderEffect',
  type: 'scene',
  
  // 顶点着色器
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  
  // 片段着色器
  fragmentShader: `
    uniform float time;
    uniform vec3 color;
    varying vec2 vUv;
    
    void main() {
      // 自定义着色器逻辑
      vec2 p = vUv * 2.0 - 1.0;
      float r = length(p) - 0.5 + sin(time) * 0.1;
      float a = atan(p.y, p.x);
      
      float f = smoothstep(0.0, 0.1, abs(r));
      
      gl_FragColor = vec4(color * f, 1.0);
    }
  `,
  
  // 着色器统一变量
  uniforms: {
    time: { value: 0 },
    color: { value: [0.0, 1.0, 0.5] }
  },
  
  // 更新函数
  update: function(timestamp) {
    this.uniforms.time.value = timestamp * 0.001;
  }
});
```

## 常见问题与解决方案

### 1. 性能下降问题

**症状**：页面滚动卡顿，动画不流畅。

**解决方案**：
- 减少同时激活的效果数量
- 使用性能分析工具定位瓶颈
- 启用自动性能调整

```javascript
// 性能问题诊断
XiCore.visual.diagnosePerformance({
  duration: 10000, // 诊断持续时间(毫秒)
  logLevel: 'detailed', // 'basic', 'detailed'
  onComplete: (report) => {
    console.log('性能诊断报告:', report);
  }
});
```

### 2. 效果兼容性问题

**症状**：某些效果在特定浏览器或设备上不显示或显示异常。

**解决方案**：
- 使用特性检测确定支持能力
- 提供降级替代效果
- 针对不同平台优化效果参数

```javascript
// 特性检测和降级处理
if (!XiCore.visual.checkSupport('webgl2')) {
  // 使用 Canvas2D 替代方案
  XiCore.visual.useCanvasFallback();
}

// 平台特定优化
if (XiCore.platform.isMobile) {
  XiCore.visual.optimizeForMobile();
} else if (XiCore.platform.isTablet) {
  XiCore.visual.optimizeForTablet();
}
```

### 3. 视觉一致性问题

**症状**：不同章节间视觉风格不一致，主题切换时效果异常。

**解决方案**：
- 使用主题系统统一管理视觉参数
- 确保效果遵循设计语言规范
- 实现平滑的主题过渡

```javascript
// 使用主题变量而非硬编码值
XiCore.visual.addBaseEffect('glow', {
  color: 'var(--theme-primary)', // 使用主题变量
  intensity: 'var(--theme-intensity-medium)'
});

// 主题切换时平滑过渡
XiCore.themes.transition('oracle', 'fractal', {
  duration: 1000,
  easing: 'cubic-bezier(0.645, 0.045, 0.355, 1.000)'
});
```

---

> 注：此文档应与项目视觉设计指南结合使用，确保效果实现符合整体美学方向。 