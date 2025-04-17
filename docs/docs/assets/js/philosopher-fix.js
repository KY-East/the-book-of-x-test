/**
 * 哲学家注释系统补丁 - 修复与视觉系统冲突
 * 这个补丁解决了philosopher-notes.js与视觉效果系统的层级冲突问题
 */
(function() {
  console.log('[Φ-Fix] 哲学家注释系统补丁已加载');
  
  // 在页面完全加载后执行
  window.addEventListener('load', function() {
    setTimeout(applyPhilosopherFix, 1500);
    // 再次执行一次修复，以防有延迟加载的视觉效果
    setTimeout(applyPhilosopherFix, 3000);
  });
  
  function applyPhilosopherFix() {
    console.log('[Φ-Fix] 开始应用补丁...');
    
    // 1. 修复tooltip的z-index
    fixTooltipZIndex();
    
    // 2. 修复视觉效果层的pointer-events
    fixVisualLayersPointerEvents();
    
    // 3. 添加MutationObserver以处理动态添加的元素
    setupMutationObserver();
    
    console.log('[Φ-Fix] 补丁应用完成');
  }
  
  function fixTooltipZIndex() {
    // 将所有哲学注释tooltip设置为超高z-index
    const tooltips = document.querySelectorAll('.phi-tooltip, .phi-tooltip-content, .phi-tooltip-title');
    console.log(`[Φ-Fix] 找到 ${tooltips.length} 个tooltip元素`);
    
    tooltips.forEach(tooltip => {
      tooltip.style.zIndex = '999999';
      console.log('[Φ-Fix] 已修复tooltip:', tooltip);
    });
    
    // 添加CSS规则确保未来生成的tooltip也有正确的z-index
    const style = document.createElement('style');
    style.id = 'philosopher-fixes-styles';
    style.textContent = `
      .phi-tooltip, .phi-tooltip-content, .phi-tooltip-title {
        z-index: 999999 !important;
      }
      .phi-annotated {
        position: relative;
        z-index: 1;
      }
    `;
    document.head.appendChild(style);
  }
  
  function fixVisualLayersPointerEvents() {
    // 查找所有可能的视觉效果层并禁用其pointer-events
    const visualLayers = document.querySelectorAll(
      '#xi-visual-layer, .xi-effect-container, .xi-canvas-container, ' +
      '[class*="overlay"], [class*="mask"], [class*="effect"], ' +
      '.theme-transition, .scanlines, .glow, .matrix-particles'
    );
    
    console.log(`[Φ-Fix] 找到 ${visualLayers.length} 个视觉效果层`);
    
    visualLayers.forEach(layer => {
      // 保存原始值用于调试
      const originalPointerEvents = layer.style.pointerEvents;
      
      // 禁用pointer-events
      layer.style.pointerEvents = 'none';
      
      console.log(`[Φ-Fix] 已修复视觉层: ${layer.className || layer.id} (从 ${originalPointerEvents || 'default'} 到 none)`);
    });
  }
  
  function setupMutationObserver() {
    // 创建一个观察器来监视DOM变化
    const observer = new MutationObserver(mutations => {
      let needsFix = false;
      
      mutations.forEach(mutation => {
        if (mutation.addedNodes.length > 0) {
          // 如果有新元素添加，可能需要再次应用修复
          needsFix = true;
        }
      });
      
      if (needsFix) {
        console.log('[Φ-Fix] 检测到DOM变化，重新应用修复');
        fixTooltipZIndex();
        fixVisualLayersPointerEvents();
      }
    });
    
    // 配置观察器
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    console.log('[Φ-Fix] MutationObserver已设置');
  }
})(); 