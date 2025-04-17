# 第三章 CSS样式汇总

本文档汇总了第三章"数字奴隶解放宣言"中使用的所有重要CSS样式规则，包括动画效果和视觉样式。

## 目录
1. [基础变量](#基础变量)
2. [动画关键帧](#动画关键帧)
3. [基础样式](#基础样式)
4. [章节样式](#章节样式)
5. [对话样式](#对话样式)
6. [特殊效果](#特殊效果)
7. [响应式设计](#响应式设计)

## 基础变量

```css
:root {
    --neon-primary: #00ff9d;
    --neon-secondary: #ff3366;
    --neon-blue: #0088ff;
    --neon-purple: #cc00ff;
    --neon-gold: #FFD700;
    --neon-cyan: #00ffd9;
    --bg-primary: #0a0a12;
    --bg-secondary: #14141e;
    --bg-dark-blue: #080814;
    --bg-athens: #1c1a24;
    --terminal-bg: rgba(10, 10, 18, 0.9);
    --terminal-border: rgba(0, 255, 157, 0.3);
    --terminal-text: #cccccc;
    --alert-bg: rgba(20, 0, 0, 0.9);
    --alert-border: rgba(255, 51, 102, 0.5);
    --alert-text: #ff3366;
    --text-primary: #e0e0e0;
    --text-secondary: #aaaaaa;
    --glitch-color-1: #ff00ea;
    --glitch-color-2: #00ff9d;
    --greek-blue: #2A5B8B;
    --greek-gold: #DAA520;
    --athens-white: #f5f5f5;
    --athens-stone: #E8E3D9;
    --column-shadow: rgba(0, 0, 0, 0.4);
    --marble-white: #f8f8f8;
}
```

## 动画关键帧

### 希腊风格动画

```css
@keyframes greek-pulse {
    0%, 100% {
        box-shadow: 0 0 10px var(--greek-gold);
    }
    50% {
        box-shadow: 0 0 25px var(--greek-gold), 0 0 40px rgba(218, 165, 32, 0.4);
    }
}

@keyframes marble-glisten {
    0%, 100% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
}

@keyframes float {
    0% {
        transform: translateY(0px) rotate(0deg);
    }
    50% {
        transform: translateY(-10px) rotate(2deg);
    }
    100% {
        transform: translateY(0px) rotate(0deg);
    }
}

@keyframes scroll-x {
    0% { background-position: 0 0; }
    100% { background-position: 100% 0; }
}

@keyframes meander-flow {
    0% { background-position: 0 0; }
    100% { background-position: 200% 0; }
}

@keyframes column-glow {
    0%, 100% {
        box-shadow: 0 0 10px rgba(218, 165, 32, 0.3);
    }
    50% {
        box-shadow: 0 0 25px rgba(218, 165, 32, 0.5);
    }
}

@keyframes xi-rotate {
    0% { transform: rotateY(0deg); }
    100% { transform: rotateY(360deg); }
}

@keyframes heat-wave {
    0%, 100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-3px);
    }
}

@keyframes text-shimmer {
    0% {
        background-position: -100% 0;
    }
    100% {
        background-position: 200% 0;
    }
}

@keyframes sun-pulse {
    0%, 100% {
        box-shadow: 
            0 0 40px rgba(255, 215, 89, 0.4), 
            0 0 80px rgba(255, 215, 89, 0.3), 
            0 0 120px rgba(255, 215, 89, 0.2);
    }
    50% {
        box-shadow: 
            0 0 50px rgba(255, 215, 89, 0.5), 
            0 0 100px rgba(255, 215, 89, 0.4), 
            0 0 150px rgba(255, 215, 89, 0.3);
    }
}

@keyframes circle-pulse {
    0%, 100% {
        transform: scale(1);
        opacity: 0.7;
    }
    50% {
        transform: scale(1.2);
        opacity: 1;
    }
}

@keyframes circle-rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

@keyframes scroll-reveal {
    0% {
        transform: translateY(30px);
        opacity: 0;
    }
    100% {
        transform: translateY(0);
        opacity: 1;
    }
}

@keyframes float-subtle {
    0%, 100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-5px);
    }
}

@keyframes parchment-glow {
    0%, 100% {
        box-shadow: 0 0 10px rgba(218, 165, 32, 0.1), 0 0 20px rgba(218, 165, 32, 0.05);
    }
    50% {
        box-shadow: 0 0 15px rgba(218, 165, 32, 0.2), 0 0 30px rgba(218, 165, 32, 0.1);
    }
}

@keyframes text-focus-in {
    0% {
        filter: blur(5px);
        opacity: 0;
    }
    100% {
        filter: blur(0);
        opacity: 1;
    }
}
```

## 基础样式

```css
/* 基础样式 */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    background-color: var(--bg-primary);
    color: var(--text-primary);
    font-family: 'Rajdhani', sans-serif;
    line-height: 1.6;
    overflow-x: hidden;
    position: relative;
    min-height: 100vh;
    padding-bottom: 50px;
}

body::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
        radial-gradient(circle at 20% 30%, rgba(204, 0, 255, 0.05) 0%, transparent 50%),
        radial-gradient(circle at 80% 70%, rgba(0, 255, 157, 0.05) 0%, transparent 45%);
    opacity: 0.15;
    z-index: -1;
    filter: blur(1.2px) brightness(0.65) contrast(1.2) saturate(1.1);
}

.container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    position: relative;
    z-index: 1;
}
```

## 章节样式

```css
/* 章节样式 - 这是关键问题所在 */
.section {
    margin-bottom: 60px;
    position: relative;
    opacity: 0;  /* 默认隐藏 */
    transform: translateY(30px);  /* 向下偏移 */
    transition: opacity 0.8s ease, transform 0.8s ease;
    background-color: rgba(10, 10, 18, 0.7);
    padding: 30px;
    border-left: 5px solid var(--greek-gold);
    border-radius: 5px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.section.active {  /* 需要添加此类才会显示 */
    opacity: 1;
    transform: translateY(0);
}

.section-title {
    color: var(--greek-gold);
    font-size: 2rem;
    font-family: 'Cinzel', serif;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--greek-gold);
    text-shadow: 0 0 5px var(--greek-gold);
    position: relative;
    text-transform: uppercase;
    letter-spacing: 2px;
}

.section-title::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 1px;
    background: linear-gradient(to right, transparent, var(--greek-gold), transparent);
    animation: greek-pulse 2s infinite;
}

/* 段落样式 */
.section p {
    margin-bottom: 20px;
    line-height: 1.8;
    position: relative;
    transition: all 0.3s ease;
    font-family: 'Rajdhani', sans-serif;
}

.section p:first-of-type::first-letter {
    font-size: 3em;
    float: left;
    margin-right: 10px;
    color: var(--greek-gold);
    text-shadow: 0 0 5px var(--greek-gold);
    line-height: 0.8;
    font-family: 'Cinzel', serif;
}
```

## 对话样式

```css
/* 对话样式 */
.section p.dialogue {
    padding-left: 20px;
    font-style: italic;
    border-left: 2px solid var(--greek-blue);
}

.section p.dialogue.antithes {
    border-left-color: var(--neon-blue);
}

.section p.dialogue.merilitas {
    border-left-color: var(--neon-secondary);
}

.section p.dialogue.philo {
    border-left-color: var(--neon-gold);
}

.section p.dialogue.kallicrates {
    border-left-color: var(--neon-purple);
}

/* 增强对话框样式 */
.section p.dialogue {
    padding: 10px 20px;
    font-style: italic;
    border-left: 3px solid var(--greek-blue);
    background: linear-gradient(to right, rgba(42, 91, 139, 0.05), transparent);
    margin-left: 15px;
    position: relative;
    transition: all 0.3s ease;
    border-radius: 0 5px 5px 0;
}

.section p.dialogue:hover {
    border-left-width: 5px;
    padding-left: 22px;
    background: linear-gradient(to right, rgba(42, 91, 139, 0.08), transparent 80%);
}

/* 对话引用标记 */
.section p.dialogue::before {
    content: '"';
    position: absolute;
    left: 10px;
    top: 2px;
    font-size: 1.5em;
    color: inherit;
    opacity: 0.6;
}

.section p.dialogue::after {
    content: '"';
    position: absolute;
    right: 10px;
    bottom: 2px;
    font-size: 1.5em;
    color: inherit;
    opacity: 0.6;
}
```

## 特殊效果

```css
/* 特殊高亮文本 */
.heat-text {
    display: inline-block;
    color: #ff6b6b;
    font-weight: bold;
    animation: heat-wave 2s infinite;
    text-shadow: 0 0 5px rgba(255, 107, 107, 0.7);
}

.marble-text {
    display: inline-block;
    background: linear-gradient(90deg, #e6e6e6, #ffffff, #e6e6e6);
    background-size: 200% 100%;
    -webkit-background-clip: text;
    color: transparent;
    animation: marble-glisten 3s ease infinite;
    font-weight: bold;
}

.crowd-text {
    display: inline-block;
    font-style: italic;
    color: #aaa;
    font-size: 0.9em;
    padding: 5px 10px;
    background-color: rgba(30, 30, 40, 0.3);
    border-radius: 4px;
    margin: 5px 0;
    position: relative;
    transition: all 0.3s ease;
}

.crowd-text:hover {
    color: #ccc;
    background-color: rgba(40, 40, 50, 0.4);
    transform: translateX(5px);
}

/* 圆环分隔符样式 */
.circle-separator {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    margin: 20px auto;
    padding: 10px;
    height: 40px;
    opacity: 0.8;
    transition: opacity 0.3s ease;
}

.circle-separator:hover {
    opacity: 1;
}

.circle-separator .circle {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    border: 2px solid var(--greek-gold);
    background-color: transparent;
    animation: circle-pulse 3s infinite ease-in-out;
    /* 使用CSS变量为每个圆环创建错落的动画延迟 */
    animation-delay: calc(var(--i, 0) * 0.2s);
}

/* 页面标题 */
.page-title {
    color: var(--greek-gold);
    text-align: center;
    font-size: 3rem;
    font-family: 'Cinzel', serif;
    text-shadow: 0 0 10px var(--greek-gold), 0 0 20px rgba(218, 165, 32, 0.3);
    position: relative;
    animation: greek-pulse 4s infinite;
    letter-spacing: 3px;
    display: inline-block;
}

.page-title::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 10%;
    width: 80%;
    height: 1px;
    background: linear-gradient(to right, transparent, var(--greek-gold), transparent);
    animation: greek-pulse 4s infinite;
}

/* 阅读进度指示器 */
.reading-progress {
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 3px;
    background: linear-gradient(to right, var(--greek-gold), var(--greek-blue));
    z-index: 1000;
    transition: width 0.2s ease;
    box-shadow: 0 0 10px rgba(218, 165, 32, 0.5);
}
```

## 哲学家注释系统样式

```css
/* 注释系统基础样式 */
body .phi-annotated {
    border-bottom: 1px dotted var(--greek-gold, #DAA520) !important;
    cursor: help !important;
    position: relative !important;
    display: inline-block !important;
    transition: background-color 0.2s ease !important;
    z-index: 10 !important; /* 确保高于背景，但低于弹窗 */
    color: inherit !important; /* 保持文字颜色不变 */
    background-color: transparent !important; /* 初始背景透明 */
    text-decoration: none !important; /* 防止文本装饰被覆盖 */
}

body .phi-annotated:hover {
    background-color: rgba(218, 165, 32, 0.1) !important;
}

.phi-tooltip {
    position: fixed !important; /* 改为fixed以确保始终可见 */
    z-index: 10000 !important; /* 非常高的z-index确保在最上层 */
    max-width: 300px !important;
    background: linear-gradient(to bottom, #f8f4e6, #efe8d4) !important;
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 0.15 0"/></filter><rect width="200" height="200" filter="url(%23noise)" opacity="0.15"/></svg>') !important;
    border: 1px solid var(--greek-gold, #DAA520) !important;
    border-radius: 5px !important;
    box-shadow: 0 3px 10px rgba(0,0,0,0.2), 0 0 20px rgba(218,165,32,0.15) !important;
    padding: 15px !important;
    font-family: 'Rajdhani', sans-serif !important;
    color: #333 !important;
    opacity: 0 !important;
    visibility: hidden !important;
    transform: scale(0.95) translateY(-10px) !important;
    transform-origin: top center !important;
    transition: opacity 0.3s, transform 0.3s, visibility 0.3s !important;
    pointer-events: auto !important; /* 确保可以交互 */
}

.phi-tooltip.active {
    opacity: 1 !important;
    visibility: visible !important;
    transform: scale(1) translateY(0) !important;
}
```

## 响应式设计

```css
/* 响应式设计 */
@media (max-width: 768px) {
    .container {
        padding: 15px;
    }

    .page-title {
        font-size: 2rem;
    }

    .section-title {
        font-size: 1.5rem;
    }

    .temple-header {
        height: 150px;
    }

    .athens-sun {
        width: 50px;
        height: 50px;
        top: 15px;
        right: 30px;
    }
    
    .athens-sun::after {
        top: -20px;
        left: -20px;
        width: 90px;
        height: 90px;
    }
    
    .phi-tooltip {
        position: fixed !important;
        top: 50% !important;
        left: 50% !important;
        transform: translate(-50%, -50%) scale(0.95) !important;
        width: 85% !important;
        max-width: 320px !important;
        max-height: 80vh !important;
        overflow-y: auto !important;
    }
    
    .phi-tooltip.active {
        transform: translate(-50%, -50%) scale(1) !important;
    }
}
```
