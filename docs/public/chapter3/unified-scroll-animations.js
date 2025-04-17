/**
 * 《The Book of Ξ》统一滚动动画系统
 * 为所有章节提供一致的滚动触发动画效果
 * 使用IntersectionObserver API实现高性能滚动监测
 */

(function() {
    // 当DOM加载完成时初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initUnifiedScrollSystem);
    } else {
        initUnifiedScrollSystem();
    }

    /**
     * 初始化统一滚动系统
     */
    function initUnifiedScrollSystem() {
        console.log('[统一滚动系统] 初始化...');
        
        // 清除可能的冲突状态
        resetAllAnimationStates();
        
        // 添加必要的CSS样式
        injectScrollStyles();
        
        // 创建IntersectionObserver实例
        const observer = createScrollObserver();
        
        // 找到并观察所有动画元素
        observeAllElements(observer);
        
        console.log('[统一滚动系统] 初始化完成');
    }
    
    /**
     * 重置所有元素的动画状态
     */
    function resetAllAnimationStates() {
        console.log('[统一滚动系统] 重置动画状态');
        
        // 重置section元素
        document.querySelectorAll('.section.active, .section.visible').forEach(el => {
            el.classList.remove('active', 'visible');
            console.log('[统一滚动系统] 重置元素:', el.id || '未命名元素');
        });
        
        // 重置fade-in-section元素
        document.querySelectorAll('.fade-in-section.visible').forEach(el => {
            el.classList.remove('visible');
        });
        
        // 重置其他可能的动画元素
        document.querySelectorAll('.separator.active, .circle-separator.active').forEach(el => {
            el.classList.remove('active');
        });
    }
    
    /**
     * 注入必要的CSS样式
     */
    function injectScrollStyles() {
        // 如果已经注入过样式，则不重复注入
        if (document.getElementById('unified-scroll-styles')) {
            return;
        }
        
        console.log('[统一滚动系统] 注入样式');
        
        const styleElement = document.createElement('style');
        styleElement.id = 'unified-scroll-styles';
        
        // 添加通用的滚动动画样式
        styleElement.textContent = `
            /* 基础淡入动画 */
            .section:not(.active):not(.visible),
            .fade-in-section:not(.visible) {
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.8s ease, transform 0.8s ease;
            }
            
            .section.active, .section.visible,
            .fade-in-section.visible {
                opacity: 1;
                transform: translateY(0);
            }
            
            /* 分隔符动画 */
            .separator:not(.active) {
                opacity: 0.3;
                transition: opacity 0.8s ease;
            }
            
            .separator.active {
                opacity: 1;
            }
            
            /* 圆形分隔符动画 */
            .circle-separator:not(.active) .circle {
                transform: scale(0.7);
                opacity: 0.5;
                transition: transform 0.8s ease, opacity 0.8s ease;
            }
            
            .circle-separator.active .circle {
                transform: scale(1);
                opacity: 1;
            }
        `;
        
        document.head.appendChild(styleElement);
    }
    
    /**
     * 创建滚动观察器
     */
    function createScrollObserver() {
        console.log('[统一滚动系统] 创建滚动观察器');
        
        return new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    
                    // 确定要添加的类名
                    const classToAdd = element.classList.contains('fade-in-section') ? 'visible' : 'active';
                    
                    // 应用动画类
                    if (!element.classList.contains(classToAdd)) {
                        // 添加延迟使动画序列化
                        setTimeout(() => {
                            element.classList.add(classToAdd);
                            console.log(`[统一滚动系统] 激活元素: ${element.id || element.className}`);
                        }, getAnimationDelay(element));
                    }
                    
                    // 对于某些元素，只触发一次动画
                    if (shouldUnobserve(element)) {
                        this.unobserve(element);
                    }
                }
            });
        }, {
            root: null, // 使用视口作为根
            threshold: 0.1, // 当10%的元素可见时触发
            rootMargin: '0px 0px -20% 0px' // 底部调整，提前触发
        });
    }
    
    /**
     * 获取元素的动画延迟
     */
    function getAnimationDelay(element) {
        // 获取data-delay属性值
        const dataDelay = element.dataset.delay;
        if (dataDelay) {
            return parseInt(dataDelay, 10);
        }
        
        // 根据元素类型设置默认延迟
        if (element.classList.contains('section')) {
            // 获取所有section，计算当前是第几个
            const allSections = Array.from(document.querySelectorAll('.section'));
            const index = allSections.indexOf(element);
            return index * 150; // 每个section错开150ms
        }
        
        return 0; // 默认无延迟
    }
    
    /**
     * 判断元素是否只需观察一次
     */
    function shouldUnobserve(element) {
        // 段落和标题通常只需触发一次
        return element.classList.contains('section') || 
               element.classList.contains('fade-in-section') ||
               element.tagName === 'H1' || 
               element.tagName === 'H2';
    }
    
    /**
     * 查找并观察所有需要动画的元素
     */
    function observeAllElements(observer) {
        console.log('[统一滚动系统] 开始观察元素');
        
        // 观察所有section元素
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            observer.observe(section);
            console.log('[统一滚动系统] 观察section:', section.id || '未命名section');
        });
        
        // 观察所有fade-in-section元素
        const fadeElements = document.querySelectorAll('.fade-in-section');
        fadeElements.forEach(element => {
            observer.observe(element);
            console.log('[统一滚动系统] 观察fade-in元素');
        });
        
        // 观察所有分隔符
        const separators = document.querySelectorAll('.separator, .circle-separator');
        separators.forEach(separator => {
            observer.observe(separator);
            console.log('[统一滚动系统] 观察分隔符');
        });
        
        console.log('[统一滚动系统] 总共观察:', {
            sections: sections.length,
            fadeElements: fadeElements.length,
            separators: separators.length
        });
    }
})(); 