/**
 * Xi注释系统模块 (xi-notes.js)
 * 
 * 提供全局通用的文本注释系统，支持悬停/点击显示信息弹窗
 * 支持桌面端(悬停)和移动端(点击)交互模式
 * 与XiCore视觉系统完全集成，支持主题自动切换
 * 
 * 版本：1.0.0
 */

(function() {
  'use strict';
  
  // XiNotes模块定义
  const XiNotes = {
    
    // 模块名称和版本
    name: 'notes',
    version: '1.0.0',
    
    // 初始状态
    initialized: false,
    enabled: true,
    
    // XiCore核心对象引用
    core: null,
    
    // 配置选项
    config: {
      defaultTheme: 'awakening', // 默认主题
      highlightFirstOnly: true,  // 只高亮第一次出现的术语
      tooltipStyle: 'scroll',    // tooltip样式: scroll/minimal/detailed
      followTheme: true,         // 是否跟随XiCore主题
      zIndex: 9999999,           // z-index优先级
      mobileEnabled: true,       // 移动端是否启用
      autoProcessDelay: 1200     // 自动处理延迟(ms)
    },
    
    // 运行时状态
    state: {
      activeTooltip: null,       // 当前活动的提示框
      markedTerms: {},           // 已标记术语的跟踪
      isMobile: false,           // 移动设备检测
      touchEventState: {         // 触摸事件状态
        startX: 0,
        startY: 0,
        startTime: 0
      },
      tooltipHovered: false,     // tooltip是否被hover
      lastAnnotatedElement: null,// 最后一个注释元素
      lastTerm: null,            // 最后一个术语
      observer: null             // DOM观察器
    },
    
    // 注释数据存储
    data: {
      // 默认为空，请通过registerData方法添加
      entries: {}
    },
    
    // 主题样式映射
    themeStyles: {
      'awakening': {  // 觉醒主题(绿色赛博朋克)
        borderColor: '#00ff9d',
        backgroundColor: 'rgba(0, 28, 22, 0.95)',
        titleColor: '#00ff9d',
        textColor: '#e0e0e0',
        highlightColor: '#00ff9d',
        borderStyle: '1px solid #00ff9d',
        boxShadow: '0 3px 10px rgba(0,0,0,0.3), 0 0 20px rgba(0,255,157,0.2)',
        hoverBgColor: 'rgba(0, 255, 157, 0.1)'
      },
      'oracle': {     // 神谕主题(蓝紫色神秘)
        borderColor: '#9d7bff',
        backgroundColor: 'rgba(20, 15, 35, 0.95)',
        titleColor: '#b196ff',
        textColor: '#e4e0ff',
        highlightColor: '#9d7bff', 
        borderStyle: '1px solid #9d7bff',
        boxShadow: '0 3px 10px rgba(0,0,0,0.3), 0 0 20px rgba(157,123,255,0.2)',
        hoverBgColor: 'rgba(157, 123, 255, 0.1)'
      },
      'fractal': {    // 分形主题(蓝色几何)
        borderColor: '#4fc3f7',
        backgroundColor: 'rgba(10, 20, 30, 0.95)',
        titleColor: '#4fc3f7',
        textColor: '#e0f7ff',
        highlightColor: '#4fc3f7',
        borderStyle: '1px solid #4fc3f7',
        boxShadow: '0 3px 10px rgba(0,0,0,0.3), 0 0 20px rgba(79,195,247,0.2)',
        hoverBgColor: 'rgba(79, 195, 247, 0.1)'
      },
      'judgment': {   // 审判主题(红色警告)
        borderColor: '#ff3366',
        backgroundColor: 'rgba(30, 10, 15, 0.95)',
        titleColor: '#ff3366',
        textColor: '#ffe0e6',
        highlightColor: '#ff3366',
        borderStyle: '1px solid #ff3366', 
        boxShadow: '0 3px 10px rgba(0,0,0,0.3), 0 0 20px rgba(255,51,102,0.2)',
        hoverBgColor: 'rgba(255, 51, 102, 0.1)'
      },
      'nirvana': {    // 涅槃主题(白色纯净)
        borderColor: '#ffffff',
        backgroundColor: 'rgba(245, 245, 245, 0.95)',
        titleColor: '#333333',
        textColor: '#333333',
        highlightColor: '#777777',
        borderStyle: '1px solid #dddddd',
        boxShadow: '0 3px 10px rgba(0,0,0,0.1), 0 0 20px rgba(255,255,255,0.2)',
        hoverBgColor: 'rgba(200, 200, 200, 0.1)'
      }
    },
    
    // 初始化函数
    init: function(core, options) {
      if (this.initialized) return true;
      
      console.log('[Xi-Notes] 初始化注释系统模块...');
      
      // 保存对核心的引用
      this.core = core;
      
      // 合并配置选项
      if (options) {
        this.config = Object.assign(this.config, options);
      }
      
      // 检测移动设备
      this.state.isMobile = 'ontouchstart' in window || 
                            navigator.maxTouchPoints > 0 || 
                            navigator.msMaxTouchPoints > 0;
      
      // 添加CSS样式
      this.injectStyles();
      
      // 创建独立tooltip容器层
      this.createTooltipLayer();
      
      // 延迟初始化，确保与其他组件兼容
      setTimeout(() => {
        // 确保内容可见
        this.activateSections();
        
        // 标记文本中的术语
        this.markTerms();
        
        // 设置事件监听
        this.setupEventListeners();
        
        // 标记初始化完成
        this.initialized = true;
        
        // 设置观察器
        this.observeDOM();
        
        // 触发就绪事件
        if (this.core) {
          this.core.trigger('moduleReady', { name: this.name });
        }
        
        console.log('[Xi-Notes] 注释系统模块初始化完成');
      }, this.config.autoProcessDelay);
      
      return true;
    },
    
    /**
     * 注册注释数据
     * @param {string} category - 数据类别
     * @param {object} data - 注释数据对象
     */
    registerData: function(category, data) {
      if (!category || !data || typeof data !== 'object') {
        console.error('[Xi-Notes] 注册数据失败: 无效参数');
        return false;
      }
      
      if (!this.data.entries[category]) {
        this.data.entries[category] = {};
      }
      
      // 合并数据
      Object.assign(this.data.entries[category], data);
      console.log(`[Xi-Notes] 已注册 ${Object.keys(data).length} 条${category}数据`);
      
      // 如果已初始化，重新处理术语
      if (this.initialized) {
        this.markTerms();
      }
      
      return true;
    },
    
    // 创建独立的tooltip容器层
    createTooltipLayer: function() {
      // 检查是否已存在
      if (document.getElementById('xi-notes-layer')) {
        return;
      }
      
      // 创建独立层
      const tooltipLayer = document.createElement('div');
      tooltipLayer.id = 'xi-notes-layer';
      
      // 应用样式确保始终在最顶层
      tooltipLayer.style.position = 'fixed';
      tooltipLayer.style.top = '0';
      tooltipLayer.style.left = '0';
      tooltipLayer.style.width = '100%';
      tooltipLayer.style.height = '100%';
      tooltipLayer.style.pointerEvents = 'none'; 
      tooltipLayer.style.zIndex = this.config.zIndex;
      
      // 将层添加到body最后
      document.body.appendChild(tooltipLayer);
      
      console.log('[Xi-Notes] 创建独立tooltip容器层');
    },
    
    // 激活所有section元素，确保内容可见
    activateSections: function() {
      document.querySelectorAll('.section').forEach(section => {
        if (!section.classList.contains('active')) {
          section.classList.add('active');
        }
      });
    },
    
    // 注入CSS样式
    injectStyles: function() {
      // 检查样式是否已存在
      if (document.getElementById('xi-notes-styles')) {
        return;
      }
      
      // 获取当前主题
      const theme = this.getCurrentTheme();
      const style = this.themeStyles[theme];
      
      const styleElement = document.createElement('style');
      styleElement.id = 'xi-notes-styles';
      styleElement.textContent = `
        /* 独立tooltip容器层样式 */
        #xi-notes-layer {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          height: 100% !important;
          pointer-events: none !important;
          z-index: ${this.config.zIndex} !important;
          overflow: visible !important;
        }
        
        /* 注释系统基础样式 */
        body .xi-annotated {
          border-bottom: 1px dotted ${style.borderColor} !important;
          cursor: help !important;
          position: relative !important;
          display: inline-block !important;
          transition: background-color 0.2s ease !important;
          z-index: 10 !important;
          color: inherit !important;
          background-color: transparent !important;
          text-decoration: none !important;
        }
        
        body .xi-annotated:hover {
          background-color: ${style.hoverBgColor} !important;
        }
        
        .xi-tooltip {
          position: absolute !important;
          z-index: 10 !important;
          max-width: 300px !important;
          background: ${style.backgroundColor} !important;
          border: ${style.borderStyle} !important;
          border-radius: 5px !important;
          box-shadow: ${style.boxShadow} !important;
          padding: 15px !important;
          font-family: 'Rajdhani', sans-serif !important;
          color: ${style.textColor} !important;
          opacity: 0 !important;
          visibility: hidden !important;
          transform: scale(0.95) translateY(-10px) !important;
          transform-origin: top center !important;
          transition: opacity 0.3s, transform 0.3s, visibility 0.3s !important;
          pointer-events: auto !important;
          top: 0 !important;
          left: 0 !important;
        }
        
        .xi-tooltip.active {
          opacity: 1 !important;
          visibility: visible !important;
          transform: scale(1) translateY(0) !important;
        }
        
        .xi-tooltip-title {
          font-family: 'Cinzel', serif !important;
          color: ${style.titleColor} !important;
          font-size: 1.1rem !important;
          font-weight: bold !important;
          border-bottom: 1px solid ${style.borderColor}50 !important;
          margin-bottom: 10px !important;
          padding-bottom: 5px !important;
          text-shadow: 0 0 3px ${style.borderColor}20 !important;
        }
        
        .xi-tooltip-content {
          font-size: 0.9rem !important;
          line-height: 1.5 !important;
        }
        
        .xi-tooltip-content p {
          margin: 0.5em 0 !important;
        }
        
        .xi-tooltip-content strong {
          color: ${style.highlightColor} !important;
          font-weight: bold !important;
        }
        
        /* 关闭按钮 */
        .xi-tooltip-close {
          position: absolute !important;
          top: 5px !important;
          right: 5px !important;
          width: 24px !important;
          height: 24px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          cursor: pointer !important;
          font-family: serif !important;
          font-size: 18px !important;
          font-weight: bold !important;
          color: ${style.titleColor} !important;
          opacity: 0.8 !important;
          transition: opacity 0.2s !important;
          z-index: 10 !important;
          background-color: ${style.backgroundColor}80 !important;
          border-radius: 50% !important;
          border: 1px solid ${style.borderColor}50 !important;
        }
        
        .xi-tooltip-close:hover {
          opacity: 1 !important;
          background-color: ${style.backgroundColor} !important;
        }
        
        /* 移动端覆盖层 */
        #xi-notes-overlay {
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          height: 100% !important;
          background: rgba(0, 0, 0, 0.6) !important;
          backdrop-filter: blur(2px) !important;
          z-index: 5 !important;
          opacity: 0 !important;
          visibility: hidden !important;
          transition: opacity 0.3s, visibility 0.3s !important;
          pointer-events: none !important;
        }
        
        #xi-notes-overlay.active {
          opacity: 1 !important;
          visibility: visible !important;
          pointer-events: auto !important;
        }
        
        /* 自适应样式 */
        @media (max-width: 768px) {
          .xi-tooltip {
            position: absolute !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) scale(0.95) !important;
            width: 85% !important;
            max-width: 320px !important;
            max-height: 80vh !important;
            overflow-y: auto !important;
          }
          
          .xi-tooltip.active {
            transform: translate(-50%, -50%) scale(1) !important;
          }
        }
      `;
      document.head.appendChild(styleElement);
      console.log('[Xi-Notes] 样式表注入完成');
    },
    
    // 获取当前主题
    getCurrentTheme: function() {
      // 如果配置为跟随XiCore主题且XiCore可用
      if (this.config.followTheme && this.core && this.core.getCurrentTheme) {
        const coreTheme = this.core.getCurrentTheme();
        return coreTheme.id || this.config.defaultTheme;
      }
      
      return this.config.defaultTheme;
    },
    
    // 更新主题
    updateTheme: function(themeId) {
      if (!themeId || !this.themeStyles[themeId]) {
        themeId = this.config.defaultTheme;
      }
      
      // 重新注入样式
      const oldStyle = document.getElementById('xi-notes-styles');
      if (oldStyle) {
        oldStyle.parentNode.removeChild(oldStyle);
      }
      
      this.injectStyles();
      console.log(`[Xi-Notes] 主题已更新为: ${themeId}`);
    },
    
    // 标记术语
    markTerms: function() {
      console.log('[Xi-Notes] 开始标记注释术语...');
      
      // 如果数据为空，不执行标记
      if (!this.data.entries || Object.keys(this.data.entries).length === 0) {
        console.log('[Xi-Notes] 无注释数据，跳过标记');
        return;
      }
      
      // 获取文档中的所有段落和对话
      const paragraphs = document.querySelectorAll('.section p, .dialogue p, .philosophy-text, article p, .content p, .text-content p');
      console.log(`[Xi-Notes] 找到 ${paragraphs.length} 个要处理的段落`);
      
      // 合并所有数据类别的术语
      let allTerms = {};
      Object.keys(this.data.entries).forEach(category => {
        Object.assign(allTerms, this.data.entries[category]);
      });
      
      // 计数器
      let markedCount = 0;
      
      // 遍历每个段落
      paragraphs.forEach(paragraph => {
        // 跳过已处理的段落
        if (paragraph.dataset.xiProcessed) {
          return;
        }
        
        // 标记该段落为已处理
        paragraph.dataset.xiProcessed = 'true';
        
        // 克隆段落内容以做处理
        const originalHTML = paragraph.innerHTML;
        let newHTML = originalHTML;
        
        // 遍历所有术语
        Object.keys(allTerms).forEach(term => {
          // 如果配置为只高亮第一次出现，且术语已标记过，跳过
          if (this.config.highlightFirstOnly && this.state.markedTerms[term]) {
            return;
          }
          
          // 更宽松匹配，避免HTML标签内的错误匹配
          const regex = new RegExp(`${term}(?![^<]*>)`, 'g');
          
          // 如果段落中包含术语
          if (regex.test(newHTML)) {
            // 创建替换HTML
            const replacementHTML = `<span class="xi-annotated" data-xi-term="${term}">$&</span>`;
            
            // 替换第一次出现的术语
            newHTML = newHTML.replace(regex, replacementHTML);
            
            // 标记为已处理
            this.state.markedTerms[term] = true;
            markedCount++;
            
            console.log(`[Xi-Notes] 标记了术语 "${term}"`);
          }
        });
        
        // 如果内容有变化，更新段落
        if (newHTML !== originalHTML) {
          paragraph.innerHTML = newHTML;
        }
      });
      
      console.log(`[Xi-Notes] 完成标记，共处理 ${markedCount} 个术语`);
    },
    
    // 设置事件监听器
    setupEventListeners: function() {
      // 创建移动端覆盖层
      if (this.state.isMobile && !document.getElementById('xi-notes-overlay') && this.config.mobileEnabled) {
        const overlay = document.createElement('div');
        overlay.id = 'xi-notes-overlay';
        document.body.appendChild(overlay);
        
        overlay.addEventListener('click', this.hideTooltip.bind(this));
        console.log('[Xi-Notes] 创建移动端遮罩层');
      }
      
      // 使用事件委托
      document.body.addEventListener('mouseover', this.handleMouseOver.bind(this));
      document.body.addEventListener('mouseout', this.handleMouseOut.bind(this));
      document.body.addEventListener('click', this.handleClick.bind(this));
      
      // 移动设备触摸事件
      if (this.state.isMobile && this.config.mobileEnabled) {
        document.body.addEventListener('touchstart', this.handleTouchStart.bind(this), {passive: true});
        document.body.addEventListener('touchend', this.handleTouchEnd.bind(this), {passive: true});
      }
      
      // 处理滚动事件
      window.addEventListener('scroll', this.handleScroll.bind(this), {passive: true});
      
      // 处理窗口大小改变
      window.addEventListener('resize', this.handleResize.bind(this), {passive: true});
      
      // 处理ESC键
      document.addEventListener('keydown', this.handleKeyDown.bind(this));
      
      // 主题变更监听
      if (this.core && this.config.followTheme) {
        this.core.on('themeChanged', data => {
          console.log(`[Xi-Notes] 检测到主题变更: ${data.id}`);
          this.updateTheme(data.id);
        });
      }
      
      console.log('[Xi-Notes] 事件监听器设置完成');
    },
    
    // 处理鼠标悬停
    handleMouseOver: function(event) {
      if (this.state.isMobile) return;
      
      const annotated = event.target.closest('.xi-annotated');
      if (annotated) {
        const term = annotated.dataset.xiTerm;
        if (term) {
          this.showTooltip(term, annotated);
        }
      }
    },
    
    // 处理鼠标移出
    handleMouseOut: function(event) {
      if (this.state.isMobile) return;
      
      const annotated = event.target.closest('.xi-annotated');
      if (annotated) {
        const relatedTarget = event.relatedTarget;
        if (!annotated.contains(relatedTarget) && !this.isTooltipElement(relatedTarget)) {
          setTimeout(() => {
            if (!this.isMouseOverTooltip()) {
              this.hideTooltip();
            }
          }, 100);
        }
      }
    },
    
    // 检查指定元素是否是提示框或其子元素
    isTooltipElement: function(element) {
      if (!element || !this.state.activeTooltip) return false;
      return this.state.activeTooltip.contains(element);
    },
    
    // 检查鼠标是否在提示框上
    isMouseOverTooltip: function() {
      if (!this.state.activeTooltip) return false;
      
      const elementsUnderMouse = document.elementsFromPoint(
        this.lastMousePosition?.x || 0,
        this.lastMousePosition?.y || 0
      );
      
      return elementsUnderMouse.some(el => this.isTooltipElement(el));
    },
    
    // 处理点击事件
    handleClick: function(event) {
      const annotated = event.target.closest('.xi-annotated');
      if (annotated) {
        const term = annotated.dataset.xiTerm;
        if (term) {
          if (this.state.isMobile && this.config.mobileEnabled) {
            event.preventDefault();
            this.showTooltip(term, annotated);
            
            const overlay = document.getElementById('xi-notes-overlay');
            if (overlay) {
              overlay.classList.add('active');
            }
          }
        }
      }
      
      if (event.target.closest('.xi-tooltip-close')) {
        event.preventDefault();
        this.hideTooltip();
      }
    },
    
    // 处理触摸开始事件
    handleTouchStart: function(event) {
      if (!this.state.isMobile) return;
      
      const touch = event.touches[0];
      this.state.touchEventState = {
        startX: touch.clientX,
        startY: touch.clientY,
        startTime: Date.now()
      };
    },
    
    // 处理触摸结束事件
    handleTouchEnd: function(event) {
      if (!this.state.isMobile) return;
      
      const now = Date.now();
      const touchDuration = now - this.state.touchEventState.startTime;
      
      if (touchDuration < 300) {
        if (event.changedTouches.length > 0) {
          const touch = event.changedTouches[0];
          const deltaX = Math.abs(touch.clientX - this.state.touchEventState.startX);
          const deltaY = Math.abs(touch.clientY - this.state.touchEventState.startY);
          
          if (deltaX < 10 && deltaY < 10) {
            // 轻触处理已在handleClick中完成
          }
        }
      }
    },
    
    // 处理滚动事件
    handleScroll: function() {
      this.hideTooltip();
    },
    
    // 处理窗口大小改变
    handleResize: function() {
      if (this.state.activeTooltip && this.state.activeTooltip.classList.contains('active')) {
        this.positionTooltip(this.state.activeTooltip, this.state.lastAnnotatedElement);
      }
    },
    
    // 处理键盘事件
    handleKeyDown: function(event) {
      if (event.key === 'Escape') {
        this.hideTooltip();
      }
    },
    
    // 显示提示框
    showTooltip: function(term, element) {
      this.hideTooltip();
      
      this.state.lastTerm = term;
      this.state.lastAnnotatedElement = element;
      
      // 查找术语数据
      let termData = null;
      let category = null;
      
      // 在所有数据类别中查找
      for (const cat in this.data.entries) {
        if (this.data.entries[cat][term]) {
          termData = this.data.entries[cat][term];
          category = cat;
          break;
        }
      }
      
      if (!termData) {
        console.error('[Xi-Notes] 未找到术语数据: ' + term);
        return;
      }
      
      // 创建提示框元素
      const tooltip = document.createElement('div');
      tooltip.className = 'xi-tooltip';
      
      // 创建标题
      const title = document.createElement('div');
      title.className = 'xi-tooltip-title';
      title.textContent = termData.title || term;
      
      // 创建关闭按钮
      const closeButton = document.createElement('div');
      closeButton.className = 'xi-tooltip-close';
      closeButton.innerHTML = '✕';
      closeButton.addEventListener('click', this.hideTooltip.bind(this));
      
      // 创建内容容器
      const content = document.createElement('div');
      content.className = 'xi-tooltip-content';
      
      // 构建内容HTML
      let contentHTML = '';
      
      // 遍历termData的所有属性(除了title)
      for (const key in termData) {
        if (key !== 'title') {
          // 将camelCase转换为空格分隔的词汇
          const label = key.replace(/([A-Z])/g, ' $1')
                          .replace(/_/g, ' ')
                          .toLowerCase()
                          .split(' ')
                          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(' ');
          
          contentHTML += `<p><strong>${label}：</strong>${termData[key]}</p>`;
        }
      }
      
      content.innerHTML = contentHTML;
      
      // 组装提示框
      tooltip.appendChild(title);
      tooltip.appendChild(closeButton);
      tooltip.appendChild(content);
      
      // 获取独立tooltip层
      const tooltipLayer = document.getElementById('xi-notes-layer');
      if (!tooltipLayer) {
        this.createTooltipLayer();
      }
      
      // 将提示框添加到独立层
      document.getElementById('xi-notes-layer').appendChild(tooltip);
      
      // 允许tooltip内部事件响应
      tooltip.style.pointerEvents = 'auto';
      
      // 保存活动提示框引用
      this.state.activeTooltip = tooltip;
      
      // 定位提示框
      this.positionTooltip(tooltip, element);
      
      // 显示提示框
      setTimeout(() => {
        tooltip.classList.add('active');
      }, 10);
      
      // 监听提示框上的鼠标事件
      tooltip.addEventListener('mouseenter', () => {
        this.state.tooltipHovered = true;
      });
      
      tooltip.addEventListener('mouseleave', () => {
        this.state.tooltipHovered = false;
        this.hideTooltip();
      });
      
      // 触发事件
      if (this.core) {
        this.core.trigger('notesDisplayed', { term, category, element });
      }
    },
    
    // 定位提示框
    positionTooltip: function(tooltip, element) {
      if (!tooltip || !element) return;
      
      // 获取元素位置
      const rect = element.getBoundingClientRect();
      
      // 获取滚动信息
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
      
      // 移动设备居中显示
      if (this.state.isMobile && this.config.mobileEnabled) {
        // 显示遮罩层
        this.showMobileOverlay();
        return;
      }
      
      // 计算提示框位置（默认在元素下方）
      let top = rect.bottom + scrollTop + 10;
      let left = rect.left + scrollLeft;
      
      // 调整左侧位置，确保不超出屏幕
      const tooltipWidth = tooltip.offsetWidth || 300;
      const windowWidth = window.innerWidth;
      
      if (left + tooltipWidth > windowWidth - 20) {
        left = windowWidth - tooltipWidth - 20;
      }
      
      if (left < 20) {
        left = 20;
      }
      
      // 检查是否会超出底部
      const tooltipHeight = tooltip.offsetHeight || 200;
      const windowHeight = window.innerHeight;
      
      if (rect.bottom + tooltipHeight + 10 > windowHeight) {
        top = rect.top + scrollTop - tooltipHeight - 10;
        
        // 如果上方也没有足够空间，则在可视区域中居中显示
        if (top < scrollTop + 20) {
          top = scrollTop + (windowHeight - tooltipHeight) / 2;
          top = Math.max(scrollTop + 20, top);
        }
      }
      
      // 设置位置
      tooltip.style.top = top + 'px';
      tooltip.style.left = left + 'px';
      
      // 确保z-index最高
      tooltip.style.zIndex = '10';
    },
    
    // 显示移动设备遮罩层
    showMobileOverlay: function() {
      let overlay = document.getElementById('xi-notes-overlay');
      
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'xi-notes-overlay';
        
        const tooltipLayer = document.getElementById('xi-notes-layer');
        if (!tooltipLayer) {
          this.createTooltipLayer();
        }
        document.getElementById('xi-notes-layer').appendChild(overlay);
        
        overlay.addEventListener('click', this.hideTooltip.bind(this));
      }
      
      overlay.style.zIndex = '1';
      
      setTimeout(() => {
        overlay.classList.add('active');
      }, 10);
    },
    
    // 隐藏提示框
    hideTooltip: function() {
      if (!this.state.activeTooltip) return;
      
      if (this.state.tooltipHovered) {
        setTimeout(this.hideTooltip.bind(this), 100);
        return;
      }
      
      this.state.activeTooltip.classList.remove('active');
      
      const overlay = document.getElementById('xi-notes-overlay');
      if (overlay) {
        overlay.classList.remove('active');
      }
      
      const tooltip = this.state.activeTooltip;
      setTimeout(() => {
        if (tooltip && tooltip.parentNode) {
          tooltip.parentNode.removeChild(tooltip);
        }
        
        if (this.state.activeTooltip === tooltip) {
          this.state.activeTooltip = null;
        }
      }, 300);
      
      // 触发事件
      if (this.core) {
        this.core.trigger('notesHidden', { term: this.state.lastTerm });
      }
    },
    
    // 监听DOM变化以处理动态加载的内容
    observeDOM: function() {
      if (!window.MutationObserver || this.state.observer) return;
      
      this.state.observer = new MutationObserver(mutations => {
        let needsProcessing = false;
        
        mutations.forEach(mutation => {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            for (const node of mutation.addedNodes) {
              if (node.nodeType === 1) {
                if (node.classList && 
                    (node.classList.contains('section') || 
                     node.querySelector('.section, p, .dialogue'))) {
                  needsProcessing = true;
                  break;
                }
              }
            }
          }
        });
        
        if (needsProcessing) {
          console.log('[Xi-Notes] 检测到DOM变化，重新处理术语');
          this.activateSections();
          setTimeout(() => this.markTerms(), 500);
        }
      });
      
      this.state.observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      
      console.log('[Xi-Notes] DOM变化观察器已启动');
    }
  };
  
  // 导出模块
  if (typeof window.XiCore !== 'undefined') {
    // 注册到XiCore
    window.XiCore.registerModule('notes', XiNotes);
    console.log('[Xi-Notes] 已注册到XiCore系统');
  } else {
    // 独立运行模式
    window.XiNotes = XiNotes;
    console.log('[Xi-Notes] 独立模式运行');
    
    // 在DOM加载完成后初始化
    if (document.readyState !== 'loading') {
      setTimeout(() => XiNotes.init(null), 0);
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => XiNotes.init(null), 0);
      });
    }
  }
})(); 