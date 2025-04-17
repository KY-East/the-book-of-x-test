/**
 * 《The Book of Ξ》哲学家与概念注释系统（整合版）
 * 
 * 为古希腊背景下的哲学家和难解概念提供优雅的悬停/点击注释
 * 支持桌面端(悬停)和移动端(点击)交互模式
 * 
 * 版本：1.1.0 - 2024-07-XX
 * 更新：修复了正则匹配问题、初始化冲突和与视觉效果系统的兼容性
 */

// 使用IIFE模式避免全局命名空间污染
(function() {
  // 严格模式
  'use strict';

  // 数据存储
  const PhilosopherNotes = {
    // 注释数据
    data: {
      // 哲学家和历史人物数据
      philosophers: {
        "柏拉图": {
          title: "柏拉图 (Plato)",
          years: "公元前427-347年",
          role: "学院派创始人",
          works: "《理想国》《斐多篇》《会饮篇》",
          thoughts: "理念论，认为现实世界只是理念世界的影子",
          contributions: "创立"学院"，提出洞穴理论，影响整个西方哲学2000多年"
        },
        "亚里士多德": {
          title: "亚里士多德 (Aristotle)",
          years: "公元前384-322年",
          role: "柏拉图的学生",
          works: "《形而上学》《尼各马可伦理学》《政治学》",
          thoughts: "经验主义，目的论，形式逻辑",
          contributions: "系统化了西方逻辑学，为自然科学奠定基础"
        },
        "第欧根尼": {
          title: "第欧根尼 (Diogenes)",
          years: "公元前412-323年",
          role: "犬儒学派代表人物",
          thoughts: "极端简朴生活，蔑视社会规范，追求自然",
          anecdotes: "住在木桶里，白天提着灯笼寻找"真正的人"",
          contributions: "通过实际行动挑战社会规范，影响后世哲学思想"
        },
        "阿斯帕西娅": {
          title: "阿斯帕西娅 (Aspasia)",
          years: "公元前470-400年",
          origin: "米利都人",
          role: "伯里克利的伴侣，雅典政治圈重要影响者",
          contributions: "在男性主导的雅典社会中扮演罕见的女性知识分子角色",
          characteristics: "智慧与雄辩并重，据称影响了伯里克利的演说"
        },
        "索福克勒斯": {
          title: "索福克勒斯 (Sophocles)",
          years: "公元前497-406年",
          role: "三大悲剧作家之一",
          works: "《俄狄浦斯王》《安提戈涅》《埃勒克特拉》",
          contributions: "发展了悲剧艺术，增加了第三位演员",
          thoughts: "探索人类与命运、神意的关系"
        },
        "伊索克拉底": {
          title: "伊索克拉底 (Isocrates)",
          years: "公元前436-338年",
          role: "修辞学大师",
          works: "《泛雅典演说》《和平》",
          contributions: "建立修辞学校，影响西方教育传统",
          characteristics: "强调修辞的道德和政治价值"
        },
        "色雷斯人": {
          title: "色雷斯人 (Thracians)",
          type: "古希腊北部和东部的部族集合",
          culture: "战士传统，独特的宗教仪式",
          relations: "许多色雷斯人在雅典作为奴隶或雇佣兵",
          image: "希腊人眼中的"野蛮人"，但也以勇武著称"
        },
        "阿尔西比亚德": {
          title: "阿尔西比亚德 (Alcibiades)",
          years: "公元前450-404年",
          role: "雅典政治家和将军",
          identity: "伯里克利的侄子，苏格拉底的学生",
          career: "多次变换立场，曾叛逃斯巴达",
          characteristics: "英俊、才华横溢但野心过盛"
        }
      },
      
      // 复杂概念数据
      concepts: {
        "德尔斐神谕": {
          title: "德尔斐神谕 (Delphic Oracle)",
          location: "位于希腊德尔斐的阿波罗神庙",
          function: "通过女祭司皮提亚传达阿波罗神的预言",
          sayings: ""认识你自己"和"凡事不要过度"",
          influence: "古希腊城邦和个人重大决策常先咨询神谕"
        },
        "城邦": {
          title: "城邦 (Polis)",
          definition: "古希腊的独立城市国家政治组织形式",
          characteristics: "自治、有自己的政府、法律和军队",
          examples: "雅典、斯巴达、科林斯等",
          significance: "希腊文明发展的基本单位"
        },
        "提坦之战": {
          title: "提坦之战 (Titanomachy)",
          description: "希腊神话中宙斯领导的奥林匹斯诸神与提坦巨神之间的战争",
          result: "宙斯胜利，取代父亲克洛诺斯成为神王",
          symbolism: "新旧秩序的更替，权力更迭的永恒主题",
          influence: "许多文学艺术作品的主题"
        },
        "学院派": {
          title: "学院派 (Academy)",
          definition: "柏拉图在雅典创立的哲学学校",
          location: "位于雅典城外，以英雄阿卡德摩斯命名",
          content: "强调数学、几何和辩证法学习",
          influence: "存续近900年，直到公元529年被查士丁尼关闭"
        },
        "犬儒学派": {
          title: "犬儒学派 (Cynicism)",
          founder: "安提斯泰尼（苏格拉底的学生）",
          representative: "第欧根尼",
          philosophy: "蔑视社会习俗，追求自然简朴生活",
          etymology: ""犬儒"源自希腊语"犬"，因其生活方式像狗一样不拘礼节"
        },
        "洞穴理论": {
          title: "洞穴理论 (Allegory of the Cave)",
          source: "柏拉图《理想国》第七卷",
          content: "描述被囚禁在洞穴中只能看到影子的人，被释放后看到真实世界的寓言",
          significance: "说明感官经验与真实知识的区别",
          influence: "说明哲学家启蒙大众的困难"
        },
        "希顿": {
          title: "希顿 (Chiton)",
          definition: "古希腊的基本服装",
          material: "亚麻或羊毛制成的长方形布料",
          style: "在肩部固定，腰部束带，男女通用",
          significance: "反映希腊人的审美和实用性"
        },
        "帕特农神庙": {
          title: "帕特农神庙 (Parthenon)",
          definition: "位于雅典卫城的雅典娜神庙",
          construction: "公元前447-432年，佩里克利时代",
          architecture: "多立克柱式，大理石建造",
          significance: "雅典民主和文明的象征"
        },
        "僭越": {
          title: "僭越 (Transgression)",
          definition: "超越正常界限或法则的行为",
          greekConcept: "与"休布里斯"(hubris)相关，指对神明不敬",
          politicalMeaning: "质疑既定权力结构",
          philosophicalMeaning: "挑战主流认知框架"
        },
        "公民大会": {
          title: "公民大会 (Ecclesia)",
          definition: "雅典民主制中所有公民参与的立法和决策机构",
          participants: "仅成年男性公民可参与（约全人口的10-20%）",
          functions: "就战争、和平、财政等重大决策投票",
          significance: "世界最早的直接民主形式之一"
        }
      }
    },
    
    // 已标记术语的跟踪
    markedTerms: {},
    
    // 当前活动的提示框元素
    activeTooltip: null,
    
    // 移动设备检测
    isMobile: false,
    
    // 触摸事件状态
    touchEventState: {
      startX: 0,
      startY: 0,
      startTime: 0
    },
    
    // 初始化函数
    init: function() {
      // 先确认其他视觉系统已完成初始化
      console.log('[Φ] 开始初始化哲学家与概念注释系统...');
      
      // 检测移动设备
      this.isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
      
      // 添加CSS样式
      this.injectStyles();
      
      // 添加初始化完成标记
      this.initialized = false;
      
      // 创建独立tooltip容器层
      this.createTooltipLayer();
      
      // 立即检查并修复可能的视觉系统冲突
      this.fixVisualSystemConflicts();
      
      // 延迟初始化，确保与其他组件兼容
      setTimeout(() => {
        // 先激活所有section，确保内容可见
        this.activateSections();
        
        // 再次修复可能的视觉系统冲突
        this.fixVisualSystemConflicts();
        
        // 标记文本中的术语
        this.markTerms();
        
        // 设置事件监听
        this.setupEventListeners();
        
        // 标记初始化完成
        this.initialized = true;
        
        // 设置观察器
        this.observeDOM();
        
        console.log('[Φ] 哲学家与概念注释系统初始化完成');
      }, 1200);
      
      // 安排定期的视觉冲突检查
      setInterval(() => {
        if (this.initialized) {
          this.fixVisualSystemConflicts();
        }
      }, 5000);
      
      // 页面滚动时重新检查冲突
      window.addEventListener('scroll', () => {
        if (this.initialized) {
          this.fixVisualSystemConflicts();
        }
      }, { passive: true });
      
      // 窗口大小改变时检查冲突
      window.addEventListener('resize', () => {
        if (this.initialized) {
          this.fixVisualSystemConflicts();
        }
      }, { passive: true });
    },
    
    // 创建独立的tooltip容器层
    createTooltipLayer: function() {
      // 检查是否已存在
      if (document.getElementById('phi-tooltip-layer')) {
        return;
      }
      
      // 创建独立层
      const tooltipLayer = document.createElement('div');
      tooltipLayer.id = 'phi-tooltip-layer';
      
      // 应用样式确保始终在最顶层
      tooltipLayer.style.position = 'fixed';
      tooltipLayer.style.top = '0';
      tooltipLayer.style.left = '0';
      tooltipLayer.style.width = '100%';
      tooltipLayer.style.height = '100%';
      tooltipLayer.style.pointerEvents = 'none'; // 默认不拦截事件
      tooltipLayer.style.zIndex = '9999999'; // 超高z-index
      
      // 将层添加到body最后
      document.body.appendChild(tooltipLayer);
      
      console.log('[Φ] 创建独立tooltip容器层');
    },
    
    // 激活所有section元素，确保内容可见
    activateSections: function() {
      document.querySelectorAll('.section').forEach(section => {
        if (!section.classList.contains('active')) {
          console.log('[Φ] 激活section:', section);
          section.classList.add('active');
        }
      });
    },
    
    // 修复可能的视觉系统冲突
    fixVisualSystemConflicts: function() {
      console.log('[Φ] 开始修复视觉系统冲突...');
      
      // 1. 处理所有可能的视觉效果层
      const visualLayers = document.querySelectorAll(
        '#xi-visual-layer, .xi-effect-container, .xi-canvas-container, ' + 
        '[class*="overlay"], [class*="mask"], [class*="effect"], ' + 
        '.theme-transition, .scanlines, .glow, .matrix-particles, ' +
        'canvas, svg, .xi-canvas, [class*="animation"], .particle-container'
      );
      
      console.log('[Φ] 找到 ' + visualLayers.length + ' 个视觉效果层');
      
      visualLayers.forEach(el => {
        // 记录修改前状态用于调试
        const originalPointerEvents = el.style.pointerEvents;
        const originalZIndex = window.getComputedStyle(el).zIndex;
        
        // 强制设置所有视觉元素不拦截点击
        el.style.pointerEvents = 'none';
        
        // 降低z-index防止遮挡
        const zIndex = parseInt(originalZIndex) || 0;
        if (zIndex > 9000) {
          el.style.zIndex = Math.min(zIndex, 8000);
          console.log('[Φ] 降低高z-index元素: ' + (el.className || el.id || 'unnamed') + ', 从 ' + originalZIndex + ' 到 ' + el.style.zIndex);
        }
      });
      
      // 2. 确保tooltip层有最高优先级
      // 对现有的tooltip设置超高z-index
      document.querySelectorAll('.phi-tooltip, .phi-tooltip-content, .phi-tooltip-title').forEach(tooltip => {
        tooltip.style.zIndex = '999999';
      });
      
      // 3. 添加CSS规则确保未来生成的tooltip也有正确的z-index
      if (!document.getElementById('phi-fix-styles')) {
        const fixStyle = document.createElement('style');
        fixStyle.id = 'phi-fix-styles';
        fixStyle.textContent = 
          '.phi-tooltip, .phi-tooltip-content, .phi-tooltip-title {' +
          '  z-index: 999999 !important;' +
          '}' +
          '.phi-annotated {' +
          '  position: relative;' +
          '  z-index: 2 !important;' +
          '}';
        document.head.appendChild(fixStyle);
        console.log('[Φ] 添加修复样式规则');
      }
      
      console.log('[Φ] 视觉系统冲突修复完成');
    },
    
    // 注入CSS样式
    injectStyles: function() {
      // 检查样式是否已存在
      if (document.getElementById('philosopher-notes-styles')) {
        console.log('[Φ] 样式表已存在，跳过注入');
        return;
      }
      
      const styleElement = document.createElement('style');
      styleElement.id = 'philosopher-notes-styles';
      styleElement.textContent = `
        /* 独立tooltip容器层样式 */
        #phi-tooltip-layer {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          height: 100% !important;
          pointer-events: none !important;
          z-index: 9999999 !important; /* 超高z-index */
          overflow: visible !important;
        }
        
        /* 注释系统基础样式 - 增加权重以避免被覆盖 */
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
          position: absolute !important; /* 相对于容器层定位 */
          z-index: 10 !important; /* 相对于容器层，不需要非常高 */
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
          top: 0 !important; /* 添加默认位置以防止显示问题 */
          left: 0 !important; /* 添加默认位置以防止显示问题 */
        }
        
        .phi-tooltip.active {
          opacity: 1 !important;
          visibility: visible !important;
          transform: scale(1) translateY(0) !important;
        }
        
        /* 其他样式保持不变，但添加!important以确保优先级 */
        .phi-tooltip-title {
          font-family: 'Cinzel', serif !important;
          color: var(--greek-gold, #DAA520) !important;
          font-size: 1.1rem !important;
          font-weight: bold !important;
          border-bottom: 1px solid rgba(218,165,32,0.3) !important;
          margin-bottom: 10px !important;
          padding-bottom: 5px !important;
          text-shadow: 0 0 3px rgba(218,165,32,0.1) !important;
        }
        
        .phi-tooltip-content {
          font-size: 0.9rem !important;
          line-height: 1.5 !important;
        }
        
        .phi-tooltip-content p {
          margin: 0.5em 0 !important;
        }
        
        .phi-tooltip-content strong {
          color: var(--greek-gold, #DAA520) !important;
          font-weight: bold !important;
        }
        
        /* 关闭按钮增强 */
        .phi-tooltip-close {
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
          color: var(--greek-gold, #DAA520) !important;
          opacity: 0.8 !important;
          transition: opacity 0.2s !important;
          z-index: 10 !important; /* 相对于tooltip */
          background-color: rgba(255, 255, 255, 0.8) !important;
          border-radius: 50% !important;
          border: 1px solid rgba(218, 165, 32, 0.3) !important;
        }
        
        .phi-tooltip-close:hover {
          opacity: 1 !important;
          background-color: rgba(255, 255, 255, 1) !important;
        }
        
        /* 卷轴装饰 */
        .phi-tooltip:before, .phi-tooltip:after {
          content: '' !important;
          position: absolute !important;
          height: 12px !important;
          background: linear-gradient(to right, rgba(218,165,32,0.05), rgba(218,165,32,0.3), rgba(218,165,32,0.05)) !important;
          left: 10px !important;
          right: 10px !important;
          border-radius: 2px !important;
        }
        
        .phi-tooltip:before {
          top: -7px !important;
        }
        
        .phi-tooltip:after {
          bottom: -7px !important;
        }
        
        /* 移动端覆盖层单独设置样式 */
        #phi-mobile-overlay {
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          height: 100% !important;
          background: rgba(0, 0, 0, 0.6) !important;
          backdrop-filter: blur(2px) !important;
          z-index: 5 !important; /* 在tooltip层内部，不需要很高 */
          opacity: 0 !important;
          visibility: hidden !important;
          transition: opacity 0.3s, visibility 0.3s !important;
          pointer-events: none !important;
        }
        
        #phi-mobile-overlay.active {
          opacity: 1 !important;
          visibility: visible !important;
          pointer-events: auto !important;
        }
        
        /* 自适应样式 */
        @media (max-width: 768px) {
          .phi-tooltip {
            position: absolute !important;
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
      `;
      document.head.appendChild(styleElement);
      console.log('[Φ] 样式表注入完成');
    },
    
    // 标记术语 - 修复了中文匹配问题
    markTerms: function() {
      console.log('[Φ] 开始标记哲学术语...');
      
      // 获取文档中的所有段落和对话
      const paragraphs = document.querySelectorAll('.section p, .dialogue p, .philosophy-text');
      console.log(`[Φ] 找到 ${paragraphs.length} 个要处理的段落`);
      
      // 合并哲学家和概念数据以便遍历
      const allTerms = {...this.data.philosophers, ...this.data.concepts};
      
      // 计数器
      let markedCount = 0;
      
      // 遍历每个段落
      paragraphs.forEach(paragraph => {
        // 跳过已处理的段落
        if (paragraph.dataset.phiProcessed) {
          return;
        }
        
        // 标记该段落为已处理
        paragraph.dataset.phiProcessed = 'true';
        
        // 克隆段落内容以做处理
        const originalHTML = paragraph.innerHTML;
        let newHTML = originalHTML;
        
        // 遍历所有术语
        Object.keys(allTerms).forEach(term => {
          // 如果术语已标记过，跳过
          if (this.markedTerms[term]) return;
          
          // 修复：更宽松匹配，避免HTML标签内的错误匹配
          const regex = new RegExp(`${term}(?![^<]*>)`, 'g');
          
          // 如果段落中包含术语
          if (regex.test(newHTML)) {
            // 创建替换HTML
            const replacementHTML = `<span class="phi-annotated" data-phi-term="${term}">$&</span>`;
            
            // 替换第一次出现的术语 (使用$&匹配整个模式)
            newHTML = newHTML.replace(regex, replacementHTML);
            
            // 标记为已处理
            this.markedTerms[term] = true;
            markedCount++;
            
            // 只替换第一个匹配项，然后继续下一个术语
            console.log(`[Φ] 标记了术语 "${term}"`);
          }
        });
        
        // 如果内容有变化，更新段落
        if (newHTML !== originalHTML) {
          paragraph.innerHTML = newHTML;
        }
      });
      
      console.log(`[Φ] 完成标记，共处理 ${markedCount} 个术语`);
    },
    
    // 设置事件监听器
    setupEventListeners: function() {
      // 创建移动端覆盖层
      if (this.isMobile && !document.getElementById('phi-mobile-overlay')) {
        const overlay = document.createElement('div');
        overlay.id = 'phi-mobile-overlay';
        document.body.appendChild(overlay);
        
        overlay.addEventListener('click', this.hideTooltip.bind(this));
        console.log('[Φ] 创建移动端遮罩层');
      }
      
      // 使用事件委托以提高性能
      document.body.addEventListener('mouseover', this.handleMouseOver.bind(this));
      document.body.addEventListener('mouseout', this.handleMouseOut.bind(this));
      document.body.addEventListener('click', this.handleClick.bind(this));
      
      // 移动设备触摸事件
      if (this.isMobile) {
        document.body.addEventListener('touchstart', this.handleTouchStart.bind(this), {passive: true});
        document.body.addEventListener('touchend', this.handleTouchEnd.bind(this), {passive: true});
      }
      
      // 处理滚动事件（隐藏提示框）
      window.addEventListener('scroll', this.handleScroll.bind(this), {passive: true});
      
      // 处理窗口大小改变
      window.addEventListener('resize', this.handleResize.bind(this), {passive: true});
      
      // 处理ESC键（隐藏提示框）
      document.addEventListener('keydown', this.handleKeyDown.bind(this));
      
      console.log('[Φ] 事件监听器设置完成');
    },
    
    // 处理鼠标悬停
    handleMouseOver: function(event) {
      // 如果是移动设备，跳过悬停处理
      if (this.isMobile) return;
      
      // 查找最近的注释元素
      const annotated = event.target.closest('.phi-annotated');
      if (annotated) {
        // 获取术语名称
        const term = annotated.dataset.phiTerm;
        if (term) {
          // 显示提示框
          this.showTooltip(term, annotated);
        }
      }
    },
    
    // 处理鼠标移出
    handleMouseOut: function(event) {
      // 如果是移动设备，跳过处理
      if (this.isMobile) return;
      
      // 查找最近的注释元素
      const annotated = event.target.closest('.phi-annotated');
      if (annotated) {
        // 检查鼠标是否真的离开了元素（避免移到子元素触发）
        const relatedTarget = event.relatedTarget;
        if (!annotated.contains(relatedTarget) && !this.isTooltipElement(relatedTarget)) {
          // 延迟隐藏提示框，给用户时间移到提示框上
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
      if (!element || !this.activeTooltip) return false;
      return this.activeTooltip.contains(element);
    },
    
    // 检查鼠标是否在提示框上
    isMouseOverTooltip: function() {
      if (!this.activeTooltip) return false;
      
      // 获取当前鼠标位置相关元素
      const elementsUnderMouse = document.elementsFromPoint(
        this.lastMousePosition?.x || 0,
        this.lastMousePosition?.y || 0
      );
      
      // 检查提示框是否在鼠标下方的元素列表中
      return elementsUnderMouse.some(el => this.isTooltipElement(el));
    },
    
    // 处理点击事件
    handleClick: function(event) {
      // 查找最近的注释元素
      const annotated = event.target.closest('.phi-annotated');
      if (annotated) {
        // 获取术语名称
        const term = annotated.dataset.phiTerm;
        if (term) {
          // 如果是移动设备，显示提示框
          if (this.isMobile) {
            event.preventDefault();
            this.showTooltip(term, annotated);
            
            // 显示遮罩层
            const overlay = document.getElementById('phi-mobile-overlay');
            if (overlay) {
              overlay.classList.add('active');
            }
          }
        }
      }
      
      // 处理点击提示框关闭按钮
      if (event.target.closest('.phi-tooltip-close')) {
        event.preventDefault();
        this.hideTooltip();
      }
    },
    
    // 处理触摸开始事件
    handleTouchStart: function(event) {
      if (!this.isMobile) return;
      
      const touch = event.touches[0];
      this.touchEventState = {
        startX: touch.clientX,
        startY: touch.clientY,
        startTime: Date.now()
      };
    },
    
    // 处理触摸结束事件
    handleTouchEnd: function(event) {
      if (!this.isMobile) return;
      
      // 检查是否是轻触（非滑动）
      const now = Date.now();
      const touchDuration = now - this.touchEventState.startTime;
      
      if (touchDuration < 300) { // 300ms以内视为轻触
        // 判断是否滑动距离很小
        if (event.changedTouches.length > 0) {
          const touch = event.changedTouches[0];
          const deltaX = Math.abs(touch.clientX - this.touchEventState.startX);
          const deltaY = Math.abs(touch.clientY - this.touchEventState.startY);
          
          if (deltaX < 10 && deltaY < 10) { // 移动距离很小视为点击
            // 点击处理已在handleClick中完成
          }
        }
      }
    },
    
    // 处理滚动事件
    handleScroll: function() {
      // 隐藏提示框
      this.hideTooltip();
    },
    
    // 处理窗口大小改变
    handleResize: function() {
      // 如果提示框打开，重新定位
      if (this.activeTooltip && this.activeTooltip.classList.contains('active')) {
        this.positionTooltip(this.activeTooltip, this.lastAnnotatedElement);
      }
    },
    
    // 处理键盘事件
    handleKeyDown: function(event) {
      // ESC键隐藏提示框
      if (event.key === 'Escape') {
        this.hideTooltip();
      }
    },
    
    // 显示提示框
    showTooltip: function(term, element) {
      // 关闭已打开的提示框
      this.hideTooltip();
      
      // 保存术语和元素引用
      this.lastTerm = term;
      this.lastAnnotatedElement = element;
      
      // 获取术语数据
      const philosophers = this.data.philosophers;
      const concepts = this.data.concepts;
      const termData = philosophers[term] || concepts[term];
      
      if (!termData) {
        console.error('[Φ] 未找到术语数据: ' + term);
        return;
      }
      
      // 创建提示框元素
      const tooltip = document.createElement('div');
      tooltip.className = 'phi-tooltip';
      
      // 创建内容
      const title = document.createElement('div');
      title.className = 'phi-tooltip-title';
      title.textContent = termData.title || term;
      
      // 创建关闭按钮
      const closeButton = document.createElement('div');
      closeButton.className = 'phi-tooltip-close';
      closeButton.innerHTML = '✕';
      closeButton.addEventListener('click', this.hideTooltip.bind(this));
      
      // 创建内容容器
      const content = document.createElement('div');
      content.className = 'phi-tooltip-content';
      
      // 根据类型不同构建内容
      const isPhilosopher = !!philosophers[term];
      
      let contentHTML = '';
      
      if (isPhilosopher) {
        // 哲学家条目
        if (termData.years) contentHTML += '<p><strong>生卒年份：</strong>' + termData.years + '</p>';
        if (termData.role) contentHTML += '<p><strong>身份：</strong>' + termData.role + '</p>';
        if (termData.works) contentHTML += '<p><strong>代表作：</strong>' + termData.works + '</p>';
        if (termData.thoughts) contentHTML += '<p><strong>主要思想：</strong>' + termData.thoughts + '</p>';
        if (termData.contributions) contentHTML += '<p><strong>贡献：</strong>' + termData.contributions + '</p>';
        if (termData.anecdotes) contentHTML += '<p><strong>轶事：</strong>' + termData.anecdotes + '</p>';
        if (termData.characteristics) contentHTML += '<p><strong>特点：</strong>' + termData.characteristics + '</p>';
        if (termData.origin) contentHTML += '<p><strong>出身：</strong>' + termData.origin + '</p>';
        if (termData.identity) contentHTML += '<p><strong>身份：</strong>' + termData.identity + '</p>';
        if (termData.career) contentHTML += '<p><strong>生平：</strong>' + termData.career + '</p>';
        if (termData.type) contentHTML += '<p><strong>类型：</strong>' + termData.type + '</p>';
        if (termData.culture) contentHTML += '<p><strong>文化：</strong>' + termData.culture + '</p>';
        if (termData.relations) contentHTML += '<p><strong>与雅典关系：</strong>' + termData.relations + '</p>';
        if (termData.image) contentHTML += '<p><strong>形象：</strong>' + termData.image + '</p>';
      } else {
        // 概念条目
        if (termData.definition) contentHTML += '<p><strong>定义：</strong>' + termData.definition + '</p>';
        if (termData.location) contentHTML += '<p><strong>位置：</strong>' + termData.location + '</p>';
        if (termData.function) contentHTML += '<p><strong>功能：</strong>' + termData.function + '</p>';
        if (termData.sayings) contentHTML += '<p><strong>箴言：</strong>' + termData.sayings + '</p>';
        if (termData.influence) contentHTML += '<p><strong>影响：</strong>' + termData.influence + '</p>';
        if (termData.characteristics) contentHTML += '<p><strong>特点：</strong>' + termData.characteristics + '</p>';
        if (termData.examples) contentHTML += '<p><strong>例子：</strong>' + termData.examples + '</p>';
        if (termData.significance) contentHTML += '<p><strong>意义：</strong>' + termData.significance + '</p>';
        if (termData.description) contentHTML += '<p><strong>描述：</strong>' + termData.description + '</p>';
        if (termData.result) contentHTML += '<p><strong>结果：</strong>' + termData.result + '</p>';
        if (termData.symbolism) contentHTML += '<p><strong>象征：</strong>' + termData.symbolism + '</p>';
        if (termData.content) contentHTML += '<p><strong>内容：</strong>' + termData.content + '</p>';
        if (termData.material) contentHTML += '<p><strong>材质：</strong>' + termData.material + '</p>';
        if (termData.style) contentHTML += '<p><strong>款式：</strong>' + termData.style + '</p>';
        if (termData.construction) contentHTML += '<p><strong>建造：</strong>' + termData.construction + '</p>';
        if (termData.architecture) contentHTML += '<p><strong>建筑风格：</strong>' + termData.architecture + '</p>';
        if (termData.greekConcept) contentHTML += '<p><strong>希腊概念：</strong>' + termData.greekConcept + '</p>';
        if (termData.politicalMeaning) contentHTML += '<p><strong>政治含义：</strong>' + termData.politicalMeaning + '</p>';
        if (termData.philosophicalMeaning) contentHTML += '<p><strong>哲学含义：</strong>' + termData.philosophicalMeaning + '</p>';
        if (termData.participants) contentHTML += '<p><strong>参与者：</strong>' + termData.participants + '</p>';
        if (termData.functions) contentHTML += '<p><strong>职能：</strong>' + termData.functions + '</p>';
        if (termData.source) contentHTML += '<p><strong>出处：</strong>' + termData.source + '</p>';
        if (termData.founder) contentHTML += '<p><strong>创始人：</strong>' + termData.founder + '</p>';
        if (termData.representative) contentHTML += '<p><strong>代表人物：</strong>' + termData.representative + '</p>';
        if (termData.philosophy) contentHTML += '<p><strong>哲学思想：</strong>' + termData.philosophy + '</p>';
        if (termData.etymology) contentHTML += '<p><strong>词源：</strong>' + termData.etymology + '</p>';
      }
      
      content.innerHTML = contentHTML;
      
      // 组装提示框
      tooltip.appendChild(title);
      tooltip.appendChild(closeButton);
      tooltip.appendChild(content);
      
      // 获取独立tooltip层
      const tooltipLayer = document.getElementById('phi-tooltip-layer');
      if (!tooltipLayer) {
        this.createTooltipLayer();
      }
      
      // 将提示框添加到独立层而非直接添加到body
      const layer = document.getElementById('phi-tooltip-layer');
      layer.appendChild(tooltip);
      
      // 允许tooltip内部事件响应
      tooltip.style.pointerEvents = 'auto';
      
      // 保存活动提示框引用
      this.activeTooltip = tooltip;
      
      // 定位提示框
      this.positionTooltip(tooltip, element);
      
      // 显示提示框（使用延迟以启用过渡动画）
      setTimeout(() => {
        tooltip.classList.add('active');
      }, 10);
      
      // 监听提示框上的鼠标事件
      tooltip.addEventListener('mouseenter', () => {
        this.tooltipHovered = true;
      });
      
      tooltip.addEventListener('mouseleave', () => {
        this.tooltipHovered = false;
        this.hideTooltip();
      });
    },
    
    // 定位提示框
    positionTooltip: function(tooltip, element) {
      if (!tooltip || !element) return;
      
      console.log('[Φ] 开始定位提示框');
      
      // 获取元素位置
      const rect = element.getBoundingClientRect();
      
      // 获取滚动信息
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
      
      // 移动设备居中显示
      if (this.isMobile) {
        // 显示遮罩层
        this.showMobileOverlay();
        console.log('[Φ] 移动设备模式：提示框居中显示');
        return;
      }
      
      // 计算提示框位置（默认在元素下方）
      let top = rect.bottom + scrollTop + 10; // 元素底部下方10px
      let left = rect.left + scrollLeft;
      
      // 调整左侧位置，确保不超出屏幕
      const tooltipWidth = tooltip.offsetWidth || 300; // 默认宽度
      const windowWidth = window.innerWidth;
      
      if (left + tooltipWidth > windowWidth - 20) {
        left = windowWidth - tooltipWidth - 20; // 距离右侧20px
      }
      
      if (left < 20) {
        left = 20; // 距离左侧20px
      }
      
      // 检查是否会超出底部，如果是则显示在元素上方
      const tooltipHeight = tooltip.offsetHeight || 200; // 预估高度
      const windowHeight = window.innerHeight;
      
      if (rect.bottom + tooltipHeight + 10 > windowHeight) {
        top = rect.top + scrollTop - tooltipHeight - 10; // 元素顶部上方10px
        
        // 如果上方也没有足够空间，则在可视区域中居中显示
        if (top < scrollTop + 20) {
          // 如果上下都没有足够空间，则居中显示
          top = scrollTop + (windowHeight - tooltipHeight) / 2;
          // 确保至少有20px的间距
          top = Math.max(scrollTop + 20, top);
        }
      }
      
      // 设置位置
      tooltip.style.top = top + 'px';
      tooltip.style.left = left + 'px';
      
      // 确保z-index最高
      tooltip.style.zIndex = '999999';
      
      console.log('[Φ] 提示框位置设置完成 - 位置:', { top, left });
    },
    
    // 显示移动设备遮罩层
    showMobileOverlay: function() {
      // 检查是否已存在遮罩层
      let overlay = document.getElementById('phi-mobile-overlay');
      
      // 如果不存在，创建一个
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'phi-mobile-overlay';
        
        // 将遮罩添加到独立tooltip层而非body
        const tooltipLayer = document.getElementById('phi-tooltip-layer');
        if (!tooltipLayer) {
          this.createTooltipLayer();
        }
        document.getElementById('phi-tooltip-layer').appendChild(overlay);
        
        // 点击遮罩层关闭提示框
        overlay.addEventListener('click', this.hideTooltip.bind(this));
      }
      
      // 确保z-index正确
      overlay.style.zIndex = '1'; // 相对于父容器的z-index
      
      // 显示遮罩层
      setTimeout(() => {
        overlay.classList.add('active');
      }, 10);
    },
    
    // 隐藏提示框
    hideTooltip: function() {
      if (!this.activeTooltip) return;
      
      // 如果鼠标在提示框上，延迟执行
      if (this.tooltipHovered) {
        setTimeout(this.hideTooltip.bind(this), 100);
        return;
      }
      
      // 移除active类以触发过渡效果
      this.activeTooltip.classList.remove('active');
      
      // 隐藏遮罩层
      const overlay = document.getElementById('phi-mobile-overlay');
      if (overlay) {
        overlay.classList.remove('active');
      }
      
      // 延迟后移除元素
      const tooltip = this.activeTooltip;
      setTimeout(() => {
        if (tooltip && tooltip.parentNode) {
          tooltip.parentNode.removeChild(tooltip);
        }
        
        // 如果当前活动提示框就是要移除的，清除引用
        if (this.activeTooltip === tooltip) {
          this.activeTooltip = null;
        }
      }, 300); // 300ms是过渡动画的持续时间
    },
    
    // 监听DOM变化以处理动态加载的内容
    observeDOM: function() {
      if (!window.MutationObserver || this.observer) return;
      
      this.observer = new MutationObserver(mutations => {
        let needsProcessing = false;
        
        mutations.forEach(mutation => {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            for (const node of mutation.addedNodes) {
              if (node.nodeType === 1) { // 元素节点
                if (node.classList && 
                    (node.classList.contains('section') || 
                     node.querySelector('.section'))) {
                  needsProcessing = true;
                  break;
                }
              }
            }
          }
        });
        
        if (needsProcessing) {
          console.log('[Φ] 检测到DOM变化，重新处理术语');
          this.activateSections();
          setTimeout(() => this.markTerms(), 500);
        }
      });
      
      this.observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      
      console.log('[Φ] DOM变化观察器已启动');
    },
    
    // 定期检查系统状态
    scheduleChecks: function() {
      // 页面加载后检查
      setTimeout(() => {
        this.fixVisualSystemConflicts();
        this.activateSections();
        this.markTerms();
      }, 2000);
      
      // 之后每10秒检查一次
      setInterval(() => {
        this.fixVisualSystemConflicts();
      }, 10000);
      
      // 监听滚动事件，在滚动停止后重新检查术语
      let scrollTimeout;
      window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          this.markTerms();
        }, 500);
      }, { passive: true });
      
      console.log('[Φ] 系统状态定期检查已设置');
    }
  };
  
  // 挂载到全局以便调试和其他模块调用
  window.PhilosopherNotes = PhilosopherNotes;
  
  // 初始化时机判断
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => PhilosopherNotes.init(), 1200);
    });
  } else {
    setTimeout(() => PhilosopherNotes.init(), 1200);
  }
})(); 