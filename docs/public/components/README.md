# The Book of Ξ 组件库

这个目录包含了网站中使用的可复用组件，旨在提供模块化、易于集成的功能单元，减少代码重复并确保一致的用户体验。

## 组件列表

### 侧边栏组件

侧边栏组件提供了网站的主要导航功能，可以在所有页面中使用相同的导航结构。

#### 文件：

- `sidebar.js` - 侧边栏核心功能，处理交互和状态管理
- `sidebar-css.js` - 侧边栏样式，可动态添加到页面
- `sidebar-structure.html` - 侧边栏HTML结构模板，可复制使用

#### 使用方法：

1. 在HTML文件的`<head>`部分引入样式脚本：
   ```html
   <script src="/components/sidebar-css.js"></script>
   ```

2. 在HTML文件的`<body>`部分添加侧边栏结构（可从`sidebar-structure.html`复制）

3. 在`<body>`底部引入功能脚本：
   ```html
   <script src="/components/sidebar.js"></script>
   ```

#### 特性：

- 自动清理重复元素，避免多个侧边栏同时显示
- 响应式设计，在移动设备上自动折叠
- 当前页面链接高亮显示
- 多重初始化策略，确保在各种场景下都能正常工作

## 如何使用组件库

1. **引入组件**：在HTML文件中使用`<script>`标签引入所需组件

2. **添加HTML结构**：按照组件要求添加相应的HTML标记

3. **自定义行为**：需要时，使用组件提供的API进行自定义配置

## API参考

### XiSidebar

侧边栏组件的全局API对象，提供以下方法：

```javascript
// 初始化侧边栏
XiSidebar.init();

// 高亮当前页面链接
XiSidebar.highlight();

// 清理重复的侧边栏元素
XiSidebar.cleanup();
```

### XiSidebarCSS

侧边栏样式组件的全局API对象：

```javascript
// 手动添加侧边栏样式（通常不需要手动调用）
XiSidebarCSS.add();
```

## 贡献指南

向组件库添加新组件时，请遵循以下原则：

1. 组件应该是独立的，不依赖于特定页面结构
2. 提供清晰的API和文档
3. 包含适当的错误处理和调试信息
4. 遵循项目的设计语言和风格指南

## 版本历史

### v1.0.0 (2024-03-27)
- 初始版本
- 添加了侧边栏组件 