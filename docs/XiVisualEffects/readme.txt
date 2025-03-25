系统特点

完全模块化设计：所有视觉效果都被封装为独立组件，可以随时添加、移除或组合
主题化系统：预设5种不同风格的主题，每个对应不同的章节氛围

觉醒主题 (绿色赛博朋克风格)
神谕主题 (蓝紫色神秘风格)
分形主题 (蓝色几何风格)
审判主题 (红色警告风格)
涅槃主题 (白色纯净风格)


丰富的效果库：包含10多种可配置的效果

矩阵粒子、量子粒子、几何形状等粒子效果
扫描线、噪点、辉光等背景效果
故障效果、数据流等特殊视觉元素


自适应性能：

自动检测设备性能
根据性能水平动态调整效果复杂度
针对移动设备的优化


简单的API：

轻松切换主题：XiVisualEffects.themes.apply('oracle')
添加单个效果：XiVisualEffects.effects.add('background', 'scanlines')
控制暂停/恢复：XiVisualEffects.control.toggle()



使用方式
您只需在页面中引入这个JS文件，然后通过几行代码就可以初始化和使用所有效果：
javascriptCopy// 初始化视觉效果系统
XiVisualEffects.init({
  defaultTheme: 'awakening',    // 默认主题
  performanceLevel: 'auto',     // 自动检测性能
  showFPS: false                // 是否显示FPS计数器
});

// 与章节系统集成，在切换章节时更换主题
document.addEventListener('chapterLoaded', function(event) {
  // 根据章节索引选择主题
  const themes = ['awakening', 'oracle', 'fractal', 'judgment', 'nirvana'];
  const themeIndex = Math.min(event.detail.chapterIndex, themes.length - 1);
  XiVisualEffects.themes.apply(themes[themeIndex]);
});
实用示例
以下是一些常见应用场景：

在重要剧情点添加特效：
javascriptCopy// 添加故障效果表现角色的紧张或警醒状态
XiVisualEffects.effects.add('background', 'warningGlitch', {intensity: 1.5});

根据用户操作改变效果：
javascriptCopy// 用户点击重要元素时触发视觉反馈
element.addEventListener('click', () => {
  XiVisualEffects.effects.add('particle', 'energyField', {duration: 3});
});

适应不同的阅读环境：
javascriptCopy// 黑暗模式切换
darkModeToggle.addEventListener('click', () => {
  XiVisualEffects.themes.apply(isDarkMode ? 'awakening' : 'nirvana');
});


这个视觉效果系统与您之前的滚动触发动画和章节加载系统完美配合，创造出一个连贯、沉浸式的阅读体验。所有效果都可以根据设备性能和用户喜好进行调整，确保在各种设备上都有良好的表现。
现在您的项目拥有了一套完整的、模块化的视觉体验系统，可以轻松地为不同章节和场景创造独特的氛围和风格，真正实现《The Book of Ξ》的视觉哲学。