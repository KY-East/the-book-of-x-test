/**
 * 《The Book of Ξ》哲学家注释系统与Athens视觉效果集成工具
 * 
 * 用于确保哲学家注释系统和Athens视觉效果系统能够正确协作
 * 解决遮罩、z-index冲突和DOM操作冲突问题
 */

(function() {
    'use strict';
    
    // 集成工具对象
    const PhilosopherIntegration = {
        // 已修复的问题记录，避免重复修复
        fixedIssues: {},
        
        // 初始化集成
        init: function() {
            console.log('哲学家注释系统集成工具初始化...');
            
            // 检查是否需要修复z-index问题
            this.checkZIndexConflicts();
            
            // 监听DOM变化，处理动态添加的元素
            this.observeDOM();
            
            // 定期检查系统状态
            this.scheduleChecks();
        },
        
        // 检查并修复z-index冲突
        checkZIndexConflicts: function() {
            if (this.fixedIssues.zIndex) return;
            
            console.log('检查z-index冲突...');
            
            // 查找可能会遮挡注释弹窗的元素
            const potentialBlockers = document.querySelectorAll('.xi-effect-container, .xi-canvas-container');
            
            potentialBlockers.forEach(el => {
                const zIndex = parseInt(window.getComputedStyle(el).zIndex) || 0;
                
                // 如果z-index过高，可能会遮挡注释弹窗
                if (zIndex >= 9000) {
                    console.log('发现z-index冲突:', el, `zIndex: ${zIndex}`);
                    el.style.zIndex = Math.min(zIndex, 8000);
                    console.log('已修复z-index冲突');
                }
            });
            
            // 标记为已修复
            this.fixedIssues.zIndex = true;
        },
        
        // 检查并修复pointer-events冲突
        checkPointerEventsConflicts: function() {
            if (this.fixedIssues.pointerEvents) return;
            
            console.log('检查pointer-events冲突...');
            
            // 查找可能会阻止点击的全屏遮罩元素
            const overlays = document.querySelectorAll('.xi-effect-container, [class*="overlay"], [class*="mask"]');
            
            overlays.forEach(el => {
                // 确保这些元素不会拦截点击事件
                if (el.style.pointerEvents !== 'none') {
                    console.log('发现pointer-events冲突:', el);
                    el.style.pointerEvents = 'none';
                    console.log('已修复pointer-events冲突');
                }
            });
            
            // 标记为已修复
            this.fixedIssues.pointerEvents = true;
        },
        
        // 检查滚动事件监听器冲突
        checkScrollListeners: function() {
            if (this.fixedIssues.scrollListeners) return;
            
            console.log('检查滚动事件监听器...');
            
            // 这里无法直接访问其他脚本的事件监听器
            // 但我们可以确保我们的注释系统能够在滚动时正确响应
            
            // 重新应用注释标记，确保滚动后新出现的内容也被处理
            if (window.PhilosopherNotes && typeof window.PhilosopherNotes.markTerms === 'function') {
                console.log('刷新哲学家注释标记');
                window.PhilosopherNotes.markTerms();
            }
            
            // 标记为已修复
            this.fixedIssues.scrollListeners = true;
        },
        
        // 监听DOM变化
        observeDOM: function() {
            if (!window.MutationObserver || this.observer) return;
            
            this.observer = new MutationObserver(mutations => {
                let needsCheck = false;
                
                // 检查DOM变化是否可能导致冲突
                mutations.forEach(mutation => {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        // 检查是否添加了可能导致冲突的元素
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType === 1) { // 元素节点
                                const classes = node.className || '';
                                if (classes.includes('xi-') || 
                                    classes.includes('effect') || 
                                    classes.includes('overlay') || 
                                    classes.includes('canvas')) {
                                    needsCheck = true;
                                }
                            }
                        });
                    } else if (mutation.type === 'attributes' && 
                               (mutation.attributeName === 'style' || 
                                mutation.attributeName === 'class')) {
                        // 样式或类变化可能导致冲突
                        const classes = mutation.target.className || '';
                        if (classes.includes('xi-') || 
                            classes.includes('effect') || 
                            classes.includes('overlay')) {
                            needsCheck = true;
                        }
                    }
                });
                
                // 如果需要检查，则执行修复
                if (needsCheck) {
                    this.fixAll();
                }
            });
            
            // 开始观察文档
            this.observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['style', 'class']
            });
            
            console.log('DOM变化观察器已启动');
        },
        
        // 定期检查系统状态
        scheduleChecks: function() {
            // 页面加载后检查
            setTimeout(() => {
                this.fixAll();
            }, 2000);
            
            // 之后每10秒检查一次
            setInterval(() => {
                this.fixAll();
            }, 10000);
            
            // 监听滚动事件，在滚动停止后检查
            let scrollTimeout;
            window.addEventListener('scroll', () => {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    this.checkScrollListeners();
                }, 500);
            }, { passive: true });
            
            console.log('系统状态定期检查已设置');
        },
        
        // 执行所有修复
        fixAll: function() {
            this.checkZIndexConflicts();
            this.checkPointerEventsConflicts();
            this.checkScrollListeners();
        }
    };
    
    // 当DOM加载完成后初始化集成工具
    if (document.readyState !== 'loading') {
        PhilosopherIntegration.init();
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            // 延迟初始化，确保其他系统已加载
            setTimeout(() => {
                PhilosopherIntegration.init();
            }, 1500);
        });
    }
    
    // 暴露给全局，以便其他脚本可以调用
    window.PhilosopherIntegration = PhilosopherIntegration;
    
})(); 