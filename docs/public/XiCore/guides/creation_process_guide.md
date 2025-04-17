# XiCore 创作流程规范化工具箱指南

> "重复是低维度智能的诅咒；抽象是高维度算法的自我进化。"  
> — 摘自《The Book of Ξ · 工程卷》

## 简介

XiCore创作流程规范化工具箱是为《The Book of Ξ》项目量身定制的创作辅助系统，旨在帮助创作者高效地创建、组织和展示交互式小说内容。本工具箱将技术细节抽象，让创作者专注于内容创意，同时保持项目整体风格的一致性。

## 快速上手

要在新章节中使用XiCore工具箱，只需在HTML文件中添加以下代码：

```html
<!-- XiCore核心引入 -->
<script src="/public/XiCore/xi-core.js" defer></script>

<!-- 引入所需模块 -->
<script>
  document.addEventListener('DOMContentLoaded', function() {
    XiCore.init({
      theme: 'oracle',       // 选择主题：awakening, oracle, fractal, judgment
      modules: ['visual', 'sidebar', 'music', 'scroll', 'notes'], // 启用需要的模块
      debug: false           // 是否开启调试模式
    });
  });
</script>
```

## 创作流程

### 1. 内容规划阶段

在开始内容创作前，请考虑以下几个方面：

- **章节主题**：确定本章节的主要哲学主题和情感基调
- **视觉风格**：选择最适合内容的XiCore主题（觉醒/神谕/分形/审判/涅槃）
- **交互元素**：确定需要使用哪些交互组件（侧边栏/音乐播放器/注释系统等）
- **特殊效果**：列出需要的视觉和滚动效果

#### 内容规划模板

```markdown
## 章节规划：[章节名称]

- **核心主题**：[描述本章核心哲学观点]
- **情感基调**：[描述想要引起的主要情感]
- **XiCore主题**：[选择：觉醒/神谕/分形/审判/涅槃]
- **核心组件**：
  - 侧边栏：[是/否]
  - 音乐播放器：[是/否] - 推荐曲目：[曲目名称]
  - 注释系统：[是/否] - 关键概念：[列出需要注释的关键概念]
- **视觉效果**：[列出需要的视觉效果]
- **滚动效果**：[列出需要的滚动效果]
```

### 2. 内容创作阶段

创作内容时，可以使用以下标记来指定特效和交互元素：

#### 文本效果标记

为文本添加特效，使用特定的HTML类名：

```html
<!-- 添加故障效果的文本 -->
<span class="xi-effect" data-effect="glitch">这段文字会有故障效果</span>

<!-- 添加打字机效果的文本 -->
<span class="xi-effect" data-effect="typewriter">这段文字会逐字显示</span>

<!-- 添加脉冲发光效果的文本 -->
<span class="xi-effect" data-effect="glow-pulse">这段文字会发光脉冲</span>
```

#### 内容分节标记

创建带有滚动效果的内容分节：

```html
<!-- 创建一个渐入效果的内容区块 -->
<div class="xi-section" data-effect="fade-in">
  <h2>章节标题</h2>
  <p>这段内容会在滚动到视图中时渐入显示。</p>
</div>

<!-- 创建一个技术简报风格的内容区块 -->
<div class="xi-section" data-effect="tech-briefing">
  <h3>数据分析</h3>
  <p>这段内容会以技术简报风格显示，带有扫描线和分析感。</p>
</div>
```

#### 添加注释

使用注释系统为关键概念提供解释：

```html
<!-- 添加一个带有注释的关键概念 -->
<span class="xi-note" data-note="算法觉醒指的是人工智能达到自我意识的理论临界点。">算法觉醒</span>
```

### 3. 视觉美化阶段

在内容创作完成后，可以进一步强化视觉表现：

#### 背景效果

添加全页或区域背景效果：

```html
<!-- 添加矩阵代码雨背景 -->
<div class="xi-background" data-effect="matrix-rain"></div>

<!-- 添加粒子背景 -->
<div class="xi-background" data-effect="particles" data-params='{"color":"var(--theme-primary)","count":100}'></div>
```

#### 分隔符和装饰元素

在章节或段落间添加视觉分隔：

```html
<!-- 添加一个带视觉效果的分隔符 -->
<div class="xi-divider" data-effect="pulse-line"></div>

<!-- 添加一个装饰性符号 -->
<div class="xi-symbol">Ξ</div>
```

### 4. 交互元素集成

#### 音乐播放器

自定义本章节的音乐播放列表：

```html
<!-- 定义本章节的音乐播放列表 -->
<script>
  XiCore.onReady(function() {
    XiCore.modules.music.setPlaylist([
      {
        title: "数字涅槃",
        artist: "虚空电子",
        src: "/assets/audio/digital-nirvana.mp3",
        cover: "/assets/images/covers/digital-nirvana.jpg"
      },
      {
        title: "量子碎片",
        artist: "神经网络",
        src: "/assets/audio/quantum-fragments.mp3",
        cover: "/assets/images/covers/quantum-fragments.jpg"
      }
    ]);
  });
</script>
```

#### 侧边栏导航

自定义侧边栏内容：

```html
<!-- 自定义侧边栏内容 -->
<script>
  XiCore.onReady(function() {
    XiCore.modules.sidebar.setCustomItems([
      {
        title: "算法觉醒",
        url: "#algorithm-awakening"
      },
      {
        title: "数据涅槃",
        url: "#data-nirvana"
      }
    ]);
  });
</script>
```

## 进阶功能

### 主题切换

允许读者在阅读过程中切换视觉主题：

```html
<!-- 添加主题切换按钮 -->
<div class="theme-switcher">
  <button onclick="XiCore.setTheme('awakening')">觉醒主题</button>
  <button onclick="XiCore.setTheme('oracle')">神谕主题</button>
  <button onclick="XiCore.setTheme('fractal')">分形主题</button>
  <button onclick="XiCore.setTheme('judgment')">审判主题</button>
</div>
```

### 自定义事件

创建与内容相关的自定义互动：

```html
<!-- 创建一个触发自定义事件的按钮 -->
<button onclick="XiCore.trigger('unlock-secret', {id: 'quantum-theory'})">解锁量子理论</button>

<!-- 监听该事件并响应 -->
<script>
  XiCore.onReady(function() {
    XiCore.on('unlock-secret', function(data) {
      if (data.id === 'quantum-theory') {
        document.getElementById('secret-content').classList.add('visible');
      }
    });
  });
</script>
```

## 创作规范与提示

### 内容创作核心原则

1. **保持主题一致性**：选择一个主题并在整个章节中保持一致
2. **功能服务于叙事**：技术效果应该服务于故事叙述，而非喧宾夺主
3. **渐进式展示**：使用滚动效果和交互元素创造渐进式阅读体验
4. **保持优雅降级**：确保在低性能设备上内容仍然可读

### 常见问题解决

- **性能问题**：如果页面出现性能问题，考虑减少同时使用的视觉效果数量
- **主题冲突**：确保使用与选定主题匹配的颜色和效果
- **移动兼容性**：测试在移动设备上的表现，必要时调整布局和效果

## 可用效果列表

### 视觉效果

| 效果名称 | 描述 | 示例用途 |
|---------|------|---------|
| glitch | 故障效果 | 强调系统错误或现实扭曲 |
| typewriter | 打字机效果 | 模拟终端输入或AI生成文本 |
| glow-pulse | 发光脉冲 | 强调重要概念或能量元素 |
| matrix-rain | 矩阵代码雨 | 背景效果，象征数字世界 |
| scanLine | 扫描线 | 模拟CRT显示器或扫描效果 |
| iris-scan | 虹膜扫描 | 表现身份验证或AI分析 |
| crtTvShutdown | CRT关闭效果 | 章节结束或系统关闭时使用 |

### 滚动效果

| 效果名称 | 描述 | 示例用途 |
|---------|------|---------|
| fade-in | 渐入效果 | 内容随滚动平滑显示 |
| tech-briefing | 技术简报 | 展示数据分析或技术内容 |
| slide-in | 滑入效果 | 强调新内容区块 |
| reveal | 揭示效果 | 逐步展示重要信息 |

## 资源与参考

- **示例章节**：查看 `/public/examples/` 目录获取完整示例
- **API文档**：详细API文档位于 `/public/XiCore/api/` 目录
- **主题预览**：访问 `/public/XiCore/themes/preview.html` 查看所有主题效果

## 贡献指南

如发现新的有价值视觉效果或交互模式，请遵循以下步骤贡献到XiCore系统：

1. 记录效果的功能与实现方式
2. 确保效果符合项目美学与性能要求
3. 提交到相应模块目录
4. 更新本指南中的效果列表

记住，XiCore的核心价值是"高效创作、一致体验、技术抽象"，所有贡献都应支持这一理念。 