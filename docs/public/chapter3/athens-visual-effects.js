/**
 * 《The Book of Ξ》第三章 - 古希腊视觉效果专用配置
 * 此文件为数字奴隶解放宣言篇章提供古希腊风格的视觉增强
 */

// 确保页面加载时正确引入XiVisualEffects
document.addEventListener('DOMContentLoaded', function() {
    // 确保XiVisualEffects已加载
    if (typeof XiVisualEffects === 'undefined') {
        console.error('错误：XiVisualEffects未加载！');
        return;
    } else {
        console.log('Athens：XiVisualEffects已成功加载');
    }

    // 加载特殊的古希腊风格效果
    initAthensEffects();
});

/**
 * 初始化古希腊风格视觉效果
 */
function initAthensEffects() {
    console.log('初始化古希腊风格效果...');
    
    // 确保XiVisualEffects已加载
    if (typeof XiVisualEffects === 'undefined') {
        console.error('无法初始化特效，XiVisualEffects未加载');
        return;
    }
    
    try {
        // 检查XiVisualEffects是否已经初始化
        const isInitialized = XiVisualEffects.isInitialized && XiVisualEffects.isInitialized();
        
        if (!isInitialized && typeof XiVisualEffects.init === 'function') {
            // 如果未初始化，则进行初始化
            XiVisualEffects.init({ 
                showFPS: true,
                performanceLevel: 'high',
                particleDensity: 1.0 
            });
            console.log('从athens-visual-effects.js初始化XiVisualEffects成功');
        }
        
        // 添加自定义特效
        addAthensEffects();
        
        // 添加页面滚动交互效果
        setupScrollInteractions();
    } catch (e) {
        console.error('初始化古希腊特效时发生错误:', e);
    }
}

/**
 * 添加古希腊风格的视觉效果
 */
function addAthensEffects() {
    // 添加各种特效
    try {
        if (XiVisualEffects.effects && typeof XiVisualEffects.effects.add === 'function') {
            // 1. 大理石纹理效果
            XiVisualEffects.effects.add('particle', 'marbleTexture', {
                color: '#F5F5F5',
                opacity: 0.01, // 提高了不透明度
                scale: 1.5,
                speed: 0.01
            });
            
            // 2. 星空效果
            XiVisualEffects.effects.add('particle', 'stars', {
                count: 50,
                color: '#FFFFFF',
                opacity: 0.5,
                size: {min: 1, max: 2},
                speed: 0.02
            });
            
            // 3. 金色粒子
            XiVisualEffects.effects.add('particle', 'goldenDust', {
                count: 30,
                color: '#DAA520',
                opacity: 0.3, 
                size: {min: 1, max: 3},
                speed: 0.3,
                area: { top: 0, left: 0, width: 100, height: 100 }
            });
            
            // 4. 希腊波纹效果 - 暂时注释掉以移除网格效果
            /* 
            XiVisualEffects.effects.add('particle', 'greekWaves', {
                color: '#2A5B8B',
                opacity: 0.15,
                amplitude: 5,
                frequency: 0.05,
                speed: 0.5
            });
            */
            
            console.log('已添加古希腊风格特效');
        } else {
            console.error('XiVisualEffects.effects.add方法不可用');
        }
    } catch (e) {
        console.error('添加特效时发生错误:', e);
    }
}

/**
 * 设置滚动交互效果
 */
function setupScrollInteractions() {
    // 监听滚动事件
    // 保存所有滚动创建的特效用于清理
    const scrollEffects = [];
    let lastScrollUpdateTime = 0;
    const SCROLL_UPDATE_INTERVAL = 500; // 限制更新频率，每500ms最多更新一次
    const MAX_PARTICLE_EFFECTS = 5; // 设置最大粒子效果数量
    
    window.addEventListener('scroll', function() {
        // 获取滚动百分比
        const scrollPercent = (document.documentElement.scrollTop || document.body.scrollTop) / 
            (document.documentElement.scrollHeight - document.documentElement.clientHeight) * 100;
        
        // 限制更新频率，避免频繁创建特效
        const now = Date.now();
        if (now - lastScrollUpdateTime < SCROLL_UPDATE_INTERVAL) {
            return;
        }
        lastScrollUpdateTime = now;
        
        try {
            // 随着滚动增加金色光尘效果
            if (scrollPercent > 30 && XiVisualEffects.effects && typeof XiVisualEffects.effects.add === 'function') {
                // 清理过多的特效
                while (scrollEffects.length >= MAX_PARTICLE_EFFECTS) {
                    const oldEffect = scrollEffects.shift();
                    if (oldEffect && oldEffect.id) {
                        try {
                            XiVisualEffects.effects.remove(oldEffect.id);
                        } catch (e) {
                            console.warn('清理旧特效失败:', e);
                        }
                    }
                }
                
                // 添加新的粒子
                window.prevScrollEffect = XiVisualEffects.effects.add('particle', 'goldenDust', {
                    count: Math.min(30 + Math.floor((scrollPercent - 30) / 2), 70),
                    color: '#DAA520',
                    opacity: 0.3,
                    size: {min: 1, max: 3},
                    speed: 0.3
                });
            }
        } catch (e) {
            console.error('滚动交互效果错误:', e);
        }
    });
    
    // 添加页面卸载时清理所有特效
    window.addEventListener('beforeunload', function() {
        scrollEffects.forEach(effect => {
            if (effect && effect.id) {
                try {
                    XiVisualEffects.effects.remove(effect.id);
                } catch (e) {}
            }
        });
    });
    
    // 为特定段落添加特效触发
    setupAthensElementInteractions();
}

/**
 * 为古希腊场景的特定元素添加交互效果
 */
function setupAthensElementInteractions() {
    try {
        // 为神庙头部添加发光效果
        const templeHeader = document.querySelector('.temple-header');
        if (templeHeader) {
            // 跟踪当前激活的发光效果
            let activeTempleGlow = null;
            
            // 鼠标进入时添加效果
            templeHeader.addEventListener('mouseenter', function() {
                if (XiVisualEffects.effects && typeof XiVisualEffects.effects.add === 'function') {
                    // 获取神庙元素的位置和尺寸
                    const rect = this.getBoundingClientRect();
                    const position = {
                        x: rect.left + rect.width / 2,
                        y: rect.top + rect.height / 2
                    };
                    
                    // 添加局部发光效果
                    activeTempleGlow = XiVisualEffects.effects.add('particle', 'softGlow', {
                        color: '#DAA520',
                        intensity: 0.1,
                        pulsate: true,
                        size: 100,
                        position: position, // 设置发光位置在神庙元素中心
                        container: this     // 将容器设置为神庙元素
                    });
                }
            });
            
            // 鼠标离开时移除效果
            templeHeader.addEventListener('mouseleave', function() {
                if (activeTempleGlow && XiVisualEffects.effects && typeof XiVisualEffects.effects.remove === 'function') {
                    // 使用延迟，实现渐变消失效果
                    setTimeout(() => {
                        XiVisualEffects.effects.remove(activeTempleGlow.id);
                        activeTempleGlow = null;
                    }, 300); // 300ms后移除效果
                }
            });
        }
        
        // 为Xi符号添加特殊效果
        document.querySelectorAll('.xi-symbol').forEach(xiElement => {
            xiElement.addEventListener('mouseenter', function() {
                if (XiVisualEffects.effects && typeof XiVisualEffects.effects.add === 'function') {
                    // 添加爆发效果
                    const rect = this.getBoundingClientRect();
                    const position = {
                        x: rect.left + rect.width / 2,
                        y: rect.top + rect.height / 2
                    };
                    
                    XiVisualEffects.effects.add('particle', 'burstEffect', {
                        position: position,
                        count: 10, // 减少数量
                        color: '#DAA520',
                        duration: 800, // 缩短持续时间
                        spread: 30  // 减小扩散范围
                    });
                }
            });
        });
        
        // 为对话文本添加淡淡的光晕效果 - 禁用
        /*
        document.querySelectorAll('.dialogue').forEach(dialogue => {
            dialogue.addEventListener('mouseenter', function() {
                if (XiVisualEffects.effects && typeof XiVisualEffects.effects.add === 'function') {
                    const color = getDialogueColor(this);
                    const rect = this.getBoundingClientRect();
                    const position = {
                        x: rect.left + rect.width / 2,
                        y: rect.top
                    };
                    
                    // 添加淡淡的光晕
                    XiVisualEffects.effects.add('particle', 'softGlow', {
                        color: color,
                        intensity: 0.3,
                        pulsate: true,
                        size: 200,
                        position: position
                    });
                }
            });
        });
        */
    } catch (e) {
        console.error('元素交互效果错误:', e);
    }
}

/**
 * 获取对话元素的对应颜色
 * @param {HTMLElement} dialogueElement - 对话元素
 * @returns {string} - 对应的颜色代码
 */
function getDialogueColor(dialogueElement) {
    if (dialogueElement.classList.contains('philo')) {
        return '#FFD700'; // 金色
    } else if (dialogueElement.classList.contains('merilitas')) {
        return '#ff3366'; // 红色
    } else if (dialogueElement.classList.contains('kallicrates')) {
        return '#cc00ff'; // 紫色
    } else if (dialogueElement.classList.contains('antithes')) {
        return '#0088ff'; // 蓝色
    } else {
        return '#2A5B8B'; // 默认希腊蓝
    }
}

// 确保在页面退出时清理资源
window.addEventListener('beforeunload', function() {
    if (typeof XiVisualEffects !== 'undefined' && XiVisualEffects.effects && 
        typeof XiVisualEffects.effects.clear === 'function') {
        XiVisualEffects.effects.clear();
    }
}); 