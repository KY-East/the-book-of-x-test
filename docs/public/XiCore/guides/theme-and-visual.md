# 主题系统与纯模块化视觉效果系统对比指南

> "不同的工具，不同的使命。为了相同的目标，我们选择更好的路径。"  
> — 《The Book of Ξ · 工程卷》

## 概述

XiCore提供了两套视觉效果系统，用于实现《The Book of Ξ》项目中的各种视觉效果：

1. **旧版主题系统**：基于预设主题包的整体视觉风格
2. **纯模块化视觉效果系统**：自由组合的模块化视觉效果API

本文档旨在帮助创作者理解这两个系统的区别，并在适当的场景下选择合适的系统。

## 系统对比

| 特性 | 主题系统 | 纯模块化视觉效果系统 |
|------|---------|------------------|
| **文件** | 使用 `xi-visual.js` | 使用 `xi-visual-core.js`, `xi-visual-text.js`, `xi-visual-background.js`, `xi-visual-element.js` |
| **灵活性** | 受限于预设主题 | 完全自由组合各类视觉效果 |
| **使用复杂度** | 简单（一行代码切换整体风格） | 中等（需单独配置每种效果） |
| **性能** | 可能包含不需要的效果 | 只加载需要的效果组件 |
| **适用场景** | 维护现有章节 | **新章节开发（推荐）** |
| **自定义程度** | 低 | 高 |

## 重要使用规则

> [!IMPORTANT]  
> **新章节开发必须使用纯模块化视觉效果系统！**

为了项目的长期维护和性能优化，所有新章节必须遵循以下规则：

1. 不使用主题系统（`XiCore.setTheme()`）
2. 直接使用纯模块化视觉效果API
3. 自由组合视觉效果以满足内容需求

## 使用方法对比

### 旧版主题系统（不推荐用于新章节）

```javascript
// 初始化XiCore
XiCore.init({
  modules: ['visual', 'sidebar', 'music', 'scroll', 'notes'],
  defaultTheme: 'fractal'
});

// 设置主题
XiCore.setTheme('judgment');
```

### 纯模块化视觉效果系统（推荐用于新章节）

```javascript
// 初始化XiCore - 注意使用visual-core等模块
XiCore.init({
  modules: ['visual-core', 'visual-text', 'visual-background', 'visual-element', 'sidebar', 'scroll', 'notes'],
  debug: false
});

// 单独添加背景效果
XiCore.visual.background.add('matrixRain', {
  color: '#00c3ff',
  density: 0.8,
  speed: 1.2
});

// 为特定元素添加文本效果
const title = document.querySelector('.chapter-title');
XiCore.visual.text.add('glitch', title, {
  intensity: 0.7,
  color: '#ff3366'
});

// 添加元素效果
XiCore.visual.element.add('scanline', document.querySelector('.terminal'), {
  opacity: 0.3,
  speed: 2
});
```

## 为什么推荐纯模块化系统？

1. **精确控制**：可以针对每个元素和效果进行精细调整
2. **性能优化**：只加载实际需要的效果
3. **更好的扩展性**：可以轻松添加新的效果模块
4. **避免依赖**：不依赖预设主题包
5. **更符合内容需求**：可以根据章节内容自由组合效果

## 实用技巧

### 背景效果组合示例

```javascript
// 添加分形背景
XiCore.visual.background.add('fractal', {
  color: '#0066ff',
  complexity: 0.7,
  speed: 0.5
});

// 同时添加轻微扫描线效果
XiCore.visual.background.add('scanlines', {
  opacity: 0.1,
  color: '#00ffcc'
});
```

### 文本效果链式调用

```javascript
// 为不同元素应用不同效果
document.querySelectorAll('.concept-text').forEach(element => {
  XiCore.visual.text.add('highlight', element, {
    color: '#ffcc00',
    pulseIntensity: 0.3
  });
});

// 为标题添加打字机效果
XiCore.visual.text.add('typewriter', document.querySelector('h1'), {
  speed: 50,
  delay: 500
});
```

## 过渡与兼容处理

如果您在维护现有使用主题系统的章节，可以考虑逐步迁移到纯模块化系统：

```javascript
// 加载两套系统
XiCore.init({
  modules: ['visual', 'visual-core', 'visual-text', 'visual-background', 'visual-element'],
  defaultTheme: 'fractal'
});

// 主题系统处理全局效果
XiCore.setTheme('fractal');

// 使用模块化系统添加额外效果
XiCore.visual.text.add('distortion', document.querySelector('.special-text'), {
  intensity: 0.8
});
```

## 结语

纯模块化视觉效果系统代表了XiCore的未来发展方向。通过采用这一系统，我们可以实现更高效、更灵活的视觉效果管理，同时保持较高的性能表现。所有新章节开发都应当优先考虑使用纯模块化视觉效果系统。 