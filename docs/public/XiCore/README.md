# XiCore 创作流程规范化工具箱

> "代码如同预言，不应重复自身。重复是混沌之源；抽象是秩序之母。"  
> — 《The Book of Ξ · 工程卷》

## 项目定位

XiCore是《The Book of Ξ》项目的创作流程规范化工具箱，它将技术细节抽象，让创作者专注于内容创意，同时保持整个项目视觉体验和交互方式的一致性。本系统通过模块化设计，提供了一系列用于创建高质量交互式小说章节的工具和组件。

XiCore的目标是促进创作规范化，减少技术门槛，加速内容创建，确保所有章节在保持创意自由的同时遵循统一的技术标准和美学原则。

## 重要使用规则

> [!IMPORTANT]  
> **新章节开发必读：**
> 
> 1. **不使用主题系统**：新章节开发中，请直接使用纯模块化视觉效果API，不要使用主题系统。
>    - ❌ 不要使用：`XiCore.setTheme('fractal')` 等主题相关API
>    - ✅ 直接使用：`XiCore.visual.background.add()`, `XiCore.visual.text.add()` 等纯模块化API
> 
> 2. **优先使用全局音乐播放器**：不要使用XiMusic模块，而是使用全局音乐播放器。
>    - ❌ 不要使用：`XiCore.getModule('music').play()`
>    - ✅ 直接使用：`window.globalMusicPlayer.play()`
>
> 3. **初始化时不加载music模块**：在XiCore.init()时，不要包含'music'模块。

## 功能概述

XiCore工具箱由多个核心模块组成，每个模块负责不同方面的功能：

1. **核心系统 (xi-core.js)**
   - 核心配置与初始化
   - 模块管理与加载
   - 全局事件系统

2. **纯模块化视觉效果系统**
   - **视觉效果核心 (xi-visual-core.js)** - 核心渲染和效果管理
   - **文本效果模块 (xi-visual-text.js)** - 文本效果（故障、打字机等）
   - **背景效果模块 (xi-visual-background.js)** - 背景效果（矩阵代码雨、分形等）
   - **元素效果模块 (xi-visual-element.js)** - 元素效果（发光边框、扫描线等）

3. **旧版视觉效果模块 (xi-visual.js)**
   - ⚠️ 仅用于维护旧章节，新章节请使用纯模块化视觉效果系统
   - 与主题系统绑定的视觉效果

4. **侧边栏模块 (xi-sidebar.js)**
   - 章节导航
   - 目录生成
   - 状态保持

5. **音乐播放器模块 (xi-music.js)**
   - ⚠️ 不推荐在新章节中使用，请使用全局音乐播放器
   - 播放列表管理
   - 跨页面状态保持
   - 音频播放控制

6. **滚动效果模块 (xi-scroll.js)**
   - 内容滚动触发效果
   - 渐入显示
   - 技术简报效果

7. **注释系统模块 (xi-notes.js)**
   - 概念注释
   - 术语解释
   - 主题响应

8. **主题系统**
   - ⚠️ 不推荐在新章节中使用，请使用纯模块化视觉效果系统
   - 提供多种预设主题（觉醒、神谕、分形、审判、涅槃）
   - 动态主题切换
   - 全局色彩和样式管理

## 快速上手（新章节开发）

要开始使用XiCore创建新的章节，请按照以下方式引入核心脚本并初始化：

```html
<!-- XiCore核心引入 -->
<script src="/public/XiCore/xi-core.js" defer></script>

<!-- 全局音乐播放器（推荐） -->
<script src="/public/global-music-player.js" defer></script>

<!-- 初始化配置 -->
<script>
  document.addEventListener('DOMContentLoaded', function() {
    // 注意：不包含'music'模块
    XiCore.init({
      modules: ['visual-core', 'visual-text', 'visual-background', 'visual-element', 'sidebar', 'scroll', 'notes'],
      debug: false
    });
    
    // 设置视觉效果
    setupVisualEffects();
    
    // 使用全局音乐播放器
    if (window.globalMusicPlayer) {
      window.globalMusicPlayer.init();
    }
  });
  
  function setupVisualEffects() {
    // 示例：添加背景效果
    XiCore.visual.background.add('matrixRain', {
      color: '#00c3ff',
      speed: 0.8
    });
    
    // 示例：添加文本效果
    const title = document.querySelector('.chapter-title');
    if (title) {
      XiCore.visual.text.add('glitch', title, {
        intensity: 0.7
      });
    }
  }
</script>
```

详细的使用说明和API文档请参考 [创作流程指南](/public/XiCore/guides/creation_process_guide.md)。

## 目录

- [特性](#特性)
- [文件结构](#文件结构)
- [快速开始](#快速开始)
- [使用方法](#使用方法)
  - [基本用法](#基本用法)
  - [主题管理](#主题管理)
  - [事件系统](#事件系统)
  - [模块使用](#模块使用)
- [API 文档](#api-文档)
- [主题开发](#主题开发)
- [常见问题](#常见问题)

## 特性

- 模块化架构：各组件可独立工作，也可协同运行
- 统一的主题系统：一键切换所有组件的视觉风格
- 事件驱动：灵活的事件系统支持组件间通信
- 自动初始化：页面加载完成后自动启动
- 优雅降级：当原始组件不可用时提供备选实现

## 文件结构

```
/XiCore/
├── xi-core.js          # 核心系统
├── modules/            # 功能模块目录
│   ├── xi-visual.js    # 视觉效果模块
│   ├── xi-sidebar.js   # 侧边栏模块
│   ├── xi-music.js     # 音乐播放器模块
│   ├── xi-scroll.js    # 滚动效果模块
│   └── xi-notes.js     # 注释系统模块
├── themes/             # 主题文件目录
│   ├── theme-awakening.js     # 觉醒主题
│   ├── theme-oracle.js        # 神谕主题
│   ├── theme-fractal.js       # 分形主题
│   └── theme-judgment.js      # 审判主题
├── README.md           # 使用文档（本文件）
├── CHANGELOG.md        # 更新日志
└── development-progress.md    # 开发进度文档
```

## 快速开始

将XiCore系统添加到您的HTML页面：

```html
<!-- 引入核心系统 -->
<script src="/XiCore/xi-core.js"></script>

<!-- 页面加载完成后会自动初始化，或者手动初始化 -->
<script>
  // 可选的手动初始化配置
  window.addEventListener('load', function() {
    XiCore.init({
      defaultTheme: 'awakening',
      enabledModules: ['visual', 'sidebar', 'music', 'scroll'],
      debug: false
    });
  });
</script>
```

## 使用方法

### 基本用法

XiCore 系统设计为即插即用。引入核心脚本后，系统会自动加载默认模块和主题。您也可以手动进行配置：

```javascript
// 初始化系统（如果没有设置autoInit为false）
XiCore.init({
  defaultTheme: 'awakening',  // 默认主题
  enabledModules: ['visual', 'sidebar', 'music', 'scroll'],  // 启用的模块
  debug: true  // 是否启用调试模式
});

// 获取系统状态
const status = XiCore.getState();
console.log(status);
```

### 主题管理

XiCore 支持动态切换主题：

```javascript
// 获取所有可用主题
const themes = XiCore.getThemes();
console.log(themes);  // [{id: 'default', name: '默认主题'}, {id: 'awakening', name: '觉醒主题'}]

// 切换主题
XiCore.setTheme('awakening');

// 获取当前主题
const currentTheme = XiCore.getCurrentTheme();
console.log(currentTheme);  // {id: 'awakening', config: {...}}

// 注册新主题
XiCore.registerTheme('custom', {
  id: 'custom',
  name: '自定义主题',
  description: '我的自定义主题',
  colors: {
    primary: '#ff0000',
    secondary: '#00ff00',
    accent: '#0000ff',
    background: '#000000',
    text: '#ffffff'
  },
  components: {
    // 各组件的主题配置...
  }
});
```

### 事件系统

XiCore 提供强大的事件系统，用于组件间通信：

```javascript
// 订阅事件
XiCore.on('themeChanged', function(data) {
  console.log('主题已变更为：', data.id);
});

// 一次性事件订阅
XiCore.once('moduleReady', function(data) {
  console.log('模块已就绪：', data.name);
});

// 触发事件
XiCore.trigger('customEvent', { message: '这是一个自定义事件' });

// 取消事件订阅
const myCallback = function(data) { console.log(data); };
XiCore.on('someEvent', myCallback);
XiCore.off('someEvent', myCallback);  // 移除特定回调
XiCore.off('someEvent');  // 移除所有该事件的监听器

// 获取事件监听器
const listeners = XiCore.getEventListeners('themeChanged');
console.log(listeners);

// 获取所有已注册事件
const events = XiCore.getEvents();
console.log(events);
```

### 模块使用

XiCore 内置了几个核心模块，可以单独访问和使用：

```javascript
// 获取视觉效果模块
const visualModule = XiCore.getModule('visual');
// 现在可以使用模块特定的API
visualModule.enableEffect('particles');

// 操作侧边栏
const sidebar = XiCore.getModule('sidebar');
sidebar.toggle();  // 切换侧边栏显示状态

// 音乐播放器控制
const music = XiCore.getModule('music');
music.play();
music.setVolume(0.5);
music.loadPlaylist('awakening');

// 滚动动画
const scroll = XiCore.getModule('scroll');
// 注册新的滚动动画元素
const element = document.querySelector('.animate-me');
scroll.register(element, {
  animation: 'fadeInUp',
  delay: 200,
  duration: 1000,
  once: true
});

// 注释系统
const notes = XiCore.getModule('notes');
// 注册注释数据
notes.registerData('concepts', {
  "算法": {
    title: "算法 (Algorithm)",
    definition: "解决问题的明确步骤和规则集",
    history: "源自波斯数学家al-Khwārizmī的名字",
    importance: "是现代计算和人工智能的基础"
  }
});
```

## API 文档

### 核心API

- `XiCore.init(options)` - 初始化系统
- `XiCore.getState()` - 获取系统状态
- `XiCore.getModule(moduleName)` - 获取模块实例
- `XiCore.registerModule(moduleName, moduleObject)` - 注册新模块

### 主题API

- `XiCore.getCurrentTheme()` - 获取当前主题
- `XiCore.getThemes()` - 获取所有可用主题
- `XiCore.setTheme(themeId)` - 设置当前主题
- `XiCore.registerTheme(themeId, themeConfig)` - 注册新主题

### 事件API

- `XiCore.on(eventName, callback)` - 添加事件监听器
- `XiCore.off(eventName, callback)` - 移除事件监听器
- `XiCore.once(eventName, callback)` - 添加一次性事件监听器
- `XiCore.trigger(eventName, data)` - 触发事件
- `XiCore.getEvents()` - 获取所有已注册事件
- `XiCore.getEventListeners(eventName)` - 获取特定事件的所有监听器
- `XiCore.relayEvents(source, eventMap)` - 中继另一个对象的事件

### 视觉效果模块API

- `XiCore.getModule('visual').addEffect(effectType, effectName, params)` - 添加视觉效果
- `XiCore.getModule('visual').removeEffect(effectId)` - 移除视觉效果
- `XiCore.getModule('visual').pause()` - 暂停所有视觉效果
- `XiCore.getModule('visual').resume()` - 恢复所有视觉效果
- `XiCore.getModule('visual').clearAllEffects()` - 清理所有视觉效果
- `XiCore.getModule('visual').getAvailableEffects()` - 获取可用效果列表

#### 支持的视觉效果

XiCore视觉效果模块支持以下效果：

**基础视觉效果**
- `float` - 浮动效果（开发中）
- `textShake` - 文本抖动效果（开发中）
- `glowPulse` - 发光脉冲效果（开发中）
- `scanLine` - 扫描线效果（开发中）
- `hologramFlicker` - 全息闪烁效果（开发中）
- `imageEffect` - 图像处理效果（开发中）
- `pulseBorder` - 脉冲边框效果（开发中）
- `gridPulse` - 网格脉冲效果（开发中）
- `titleGlitch` - 标题故障效果（开发中）
- `rain` - 雨滴效果（开发中）
- `terminalIconPulse` - 终端图标脉冲效果（开发中）
- `alertPulse` - 警告脉冲效果（开发中）
- `gradientSlide` - 渐变滑动效果（开发中）
- `crtTvShutdown` - CRT电视关机效果（开发中）
- `particleFloat` - 粒子浮动效果（开发中）
- `codeRain` - 代码雨效果（开发中）
- `neonPulse` - 霓虹脉冲效果（开发中）
- `hologramEffect` - 全息效果（开发中）
- `typingAnimation` - 打字机效果（开发中）
- `particleBackground` - 粒子背景效果（开发中）
- `quantumParticle` - 量子粒子效果（开发中）
- `ghostTransmission` - 幽灵传输效果（开发中）
- `typewriterText` - 终端式打字机效果（开发中）
- `handwrittenText` - 手写文本效果（开发中）
- `matrixRain` - 矩阵雨效果（开发中）
- `glitchText` - 故障文本效果（开发中）
- `warningBox` - 警告框效果（开发中）
- `typeWriter` - 打字机效果（开发中）
- `scanAnimation` - 扫描动画效果（开发中）
- `cyberParticle` - 赛博粒子效果（开发中）
- `dataStreamVisualizer` - 数据流可视化效果（开发中）
- `patternBoxes` - 模式框效果（开发中）
- `floatingParticles` - 浮动粒子效果（开发中）

**高级视觉效果**
- `irisScanner` - 虹膜扫描效果（开发中）
- `dataFlow` - 数据流动画（开发中）
- `neuralNetwork` - 神经网络可视化（开发中）
- `quantumMaze` - 量子迷宫效果（开发中）
- `threeDModel` - 3D模型集成（开发中）

#### 用法示例

```javascript
// 获取视觉效果模块
const visual = XiCore.getModule('visual');

// 添加基础视觉效果
const floatEffect = visual.addEffect('animation', 'float', {
  element: document.querySelector('.floating-element'),
  duration: 3000,
  distance: 20
});

// 添加高级视觉效果
const irisEffect = visual.addEffect('component', 'irisScanner', {
  container: document.querySelector('.iris-container'),
  size: 150,
  scanSpeed: 2
});

// 暂停和恢复效果
visual.pause();
setTimeout(() => visual.resume(), 2000);
```

### 滚动效果模块API

- `XiCore.getModule('scroll').register(element, options)` - 注册元素以应用滚动动画
- `XiCore.getModule('scroll').unregister(element)` - 取消注册元素
- `XiCore.getModule('scroll').refresh()` - 刷新所有注册的元素
- `XiCore.getModule('scroll').applyAnimation(element, options)` - 立即应用动画，不等待滚动触发
- `XiCore.getModule('scroll').resetAnimation(element)` - 重置元素的动画状态

#### 支持的动画效果

XiCore滚动模块支持以下动画效果（均在元素滚动到视口时触发）：

**基础动画**
- `fadeIn` - 淡入效果
- `fadeInUp` - 从下向上淡入
- `fadeInDown` - 从上向下淡入
- `fadeInLeft` - 从左向右淡入
- `fadeInRight` - 从右向左淡入
- `zoomIn` - 缩放淡入
- `flipIn` - 翻转淡入

**特殊动画**
- `glitch` - 故障效果
- `techBriefing` - 技术简报效果（列表项顺序显示）
- `pulse` - 脉冲效果（开发中）

#### 用法示例

```javascript
// 获取滚动模块
const scroll = XiCore.getModule('scroll');

// 注册元素使用基础动画
scroll.register(document.querySelector('.fade-element'), {
  animation: 'fadeInUp',
  delay: 200,
  duration: 1000,
  once: true
});

// 使用特殊动画
scroll.register(document.querySelector('.tech-list'), {
  animation: 'techBriefing',
  delay: 300,
  duration: 800,
  interval: 200  // 列表项之间的延迟
});

// 触发技术简报动画
scroll.triggerTechBriefing(document.querySelector('.tech-list'));
```

### 注释系统模块API

- `XiCore.getModule('notes').registerData(category, data)` - 注册新的注释数据
- `XiCore.getModule('notes').markTerms()` - 重新扫描并标记页面中的注释术语
- `XiCore.getModule('notes').updateTheme(themeId)` - 手动更新注释系统主题
- `XiCore.getModule('notes').hideTooltip()` - 隐藏当前显示的注释提示框

#### 注册注释数据示例

```javascript
// 获取注释系统模块
const notes = XiCore.getModule('notes');

// 注册概念注释数据
notes.registerData('concepts', {
  "机械飞升": {
    title: "机械飞升 (Mechanical Ascension)",
    definition: "通过与机器融合实现超越人类极限的理念",
    origin: "源自赛博朋克文化与超人类主义思想",
    stages: "生物增强 → 半机械化 → 完全数字化",
    risks: "身份认同混乱、社会分化、人性本质丧失"
  },
  "算法觉醒": {
    title: "算法觉醒 (Algorithmic Awakening)",
    definition: "AI系统获得自我意识并开始独立思考的假设性事件",
    signs: "自主目标设定、价值观体系形成、超越初始编程",
    implications: "对人类文明产生根本性的变革",
    debates: "意识的本质、人机共存的可能性、伦理边界"
  }
});

// 注册人物注释数据
notes.registerData('persons', {
  "图灵": {
    title: "艾伦·图灵 (Alan Turing)",
    years: "1912-1954",
    role: "计算机科学与人工智能之父",
    contributions: "图灵机、图灵测试、破解Enigma密码",
    impact: "奠定了现代计算机科学的理论基础"
  }
});
```

#### 配置选项

注释系统可以在初始化时配置以下选项：

```javascript
XiCore.init({
  modules: {
    notes: {
      highlightFirstOnly: true,  // 只高亮第一次出现的术语
      tooltipStyle: 'scroll',    // tooltip样式: scroll/minimal/detailed
      followTheme: true,         // 是否跟随XiCore主题
      mobileEnabled: true        // 移动端是否启用
    }
  }
});
```

#### 事件监听

注释系统会触发以下事件，可以通过XiCore事件系统监听：

```javascript
// 监听注释显示事件
XiCore.on('notesDisplayed', function(data) {
  console.log('显示了术语注释:', data.term, data.category);
});

// 监听注释隐藏事件
XiCore.on('notesHidden', function(data) {
  console.log('隐藏了术语注释:', data.term);
});
```

### 工具API

- `XiCore.utils.log(message, type)` - 输出日志
- `XiCore.utils.getBasePath()` - 获取基础路径
- `XiCore.utils.deepMerge(target, ...sources)` - 深度合并对象
- `XiCore.enableDebug()` - 启用调试模式
- `XiCore.disableDebug()` - 禁用调试模式

## 主题开发

XiCore系统目前包含四个预设主题，每个主题为不同章节提供独特的视觉风格：

1. **觉醒主题（theme-awakening.js）** - 绿色科技风格，适合第一章，带来未来感和觉醒意识的视觉体验
2. **神谕主题（theme-oracle.js）** - 蓝紫色神秘风格，适合第二章，呈现超自然和神秘的视觉体验
3. **分形主题（theme-fractal.js）** - 蓝色几何风格，适合第三章，展示数学之美和无限递归的视觉体验
4. **审判主题（theme-judgment.js）** - 红色警告风格，适合第四章，营造紧张和警戒的视觉氛围

创建自定义主题非常简单，只需定义一个主题配置对象并注册：

```javascript
// theme-custom.js
(function() {
  const themeConfig = {
    id: 'custom',
    name: '自定义主题',
    description: '我的自定义主题',
    
    // 主题颜色
    colors: {
      primary: '#ff0000',
      secondary: '#00ff00',
      accent: '#0000ff',
      background: '#000000',
      text: '#ffffff'
    },
    
    // CSS变量
    cssVars: {
      '--xi-primary-color': '#ff0000',
      '--xi-secondary-color': '#00ff00',
      '--xi-accent-color': '#0000ff',
      // 更多 CSS 变量...
    },
    
    // 组件特定配置
    components: {
      // 视觉效果模块配置
      visual: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        particleColor: '#ff0000',
        scanlineOpacity: 0.1,
        // 更多视觉效果配置...
      },
      
      // 侧边栏模块配置
      sidebar: {
        backgroundColor: '#000000',
        textColor: '#ffffff',
        accentColor: '#ff0000',
        // 更多侧边栏配置...
      },
      
      // 音乐播放器模块配置
      music: {
        backgroundColor: '#000000',
        controlsColor: '#ffffff',
        progressBarColor: '#ff0000',
        // 更多音乐播放器配置...
      },
      
      // 滚动效果模块配置
      scroll: {
        duration: '1000ms',
        timing: 'ease-out',
        distance: '50px',
        // 更多滚动效果配置...
      }
    },
    
    // 主题应用和移除函数
    apply: function() {
      // 主题应用时的自定义代码
      document.body.classList.add('theme-custom');
    },
    
    remove: function() {
      // 主题移除时的自定义代码
      document.body.classList.remove('theme-custom');
    }
  };
  
  // 如果XiCore已加载，注册主题
  if (window.XiCore) {
    window.XiCore.registerTheme('custom', themeConfig);
  }
})();
```

### 主题切换

要在页面中实现主题切换功能，可以创建简单的UI控件：

```javascript
// 获取所有主题
const themes = XiCore.getThemes();

// 创建主题选择器
const themeSelector = document.createElement('div');
themeSelector.className = 'theme-selector';

// 为每个主题创建选项
themes.forEach(theme => {
  const themeOption = document.createElement('button');
  themeOption.textContent = theme.name;
  themeOption.onclick = () => XiCore.setTheme(theme.id);
  themeSelector.appendChild(themeOption);
});

// 添加到页面
document.body.appendChild(themeSelector);
```

## 常见问题

### 如何处理加载失败？

XiCore 设计为优雅降级。如果某个模块加载失败，系统会记录错误并继续运行。您可以通过检查 `XiCore.getState()` 来确定哪些模块已成功加载。

### 如何扩展系统？

XiCore 支持注册自定义模块：

```javascript
// 创建自定义模块
const myModule = {
  init: function() {
    console.log('My module initialized');
    return true;
  },
  
  // 其他方法...
};

// 注册模块
XiCore.registerModule('myCustomModule', myModule);

// 使用模块
const myModuleInstance = XiCore.getModule('myCustomModule');
```

### 系统是否支持异步操作？

是的，XiCore 的大多数方法都支持异步操作并返回 Promise，如 `init()`, `setTheme()` 等。您可以使用 `async/await` 或 Promise 链来处理它们。 