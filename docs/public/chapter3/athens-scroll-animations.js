/**
 * 《The Book of Ξ》第三章 - 古希腊专用滚动动画系统
 * 为数字奴隶解放宣言篇章提供定制的滚动触发动画
 */

document.addEventListener('DOMContentLoaded', function() {
    // 初始化滚动触发系统
    initAthensScrollAnimations();
    
    console.log('Athens Scroll Animations 初始化完成');
    
    // 调试日志 - 检查圆环分隔符是否存在
    setTimeout(() => {
        const circleSeparators = document.querySelectorAll('.circle-separator');
        console.log(`页面上找到 ${circleSeparators.length} 个圆环分隔符`);
        
        circleSeparators.forEach((el, index) => {
            console.log(`圆环分隔符 #${index + 1}:`, el);
            console.log(`  - 动画属性:`, el.dataset.athensAnimation);
            console.log(`  - 子元素数量:`, el.children.length);
        });
    }, 1000);
});

/**
 * 初始化古希腊风格滚动动画
 */
function initAthensScrollAnimations() {
    console.log('初始化Athens滚动动画系统...');
    
    // 创建交叉观察器，用于监测元素进入视口
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // 当元素进入视口时
            if (entry.isIntersecting) {
                // 根据元素的数据属性执行相应的动画
                const element = entry.target;
                const animationType = element.dataset.athensAnimation;
                
                if (animationType) {
                    console.log(`元素进入视口，应用动画: ${animationType}`, element);
                    // 执行对应的动画
                    applyAthensAnimation(element, animationType);
                    
                    // 如果动画只需触发一次，取消观察
                    if (element.dataset.once === 'true') {
                        observer.unobserve(element);
                    }
                }
            }
        });
    }, {
        root: null, // 使用视口作为根元素
        threshold: 0.2, // 当20%的元素进入视口时触发
        rootMargin: '0px 0px -10% 0px' // 视口底部向上偏移10%
    });

    // 观察带有data-athens-animation属性的元素
    const elementsToAnimate = document.querySelectorAll('[data-athens-animation]');
    console.log(`找到 ${elementsToAnimate.length} 个预设动画属性的元素`);
    
    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });
    
    // 延迟添加动画属性，以便页面完全加载
    setTimeout(() => {
        console.log('开始设置动画属性...');
        setupAnimationAttributes();
    }, 500);
}

/**
 * 设置动画属性到对应元素
 */
function setupAnimationAttributes() {
    // 为段落添加淡入动画
    const paragraphs = document.querySelectorAll('.section p');
    console.log(`找到 ${paragraphs.length} 个段落元素`);
    
    paragraphs.forEach((element, index) => {
        element.dataset.athensAnimation = 'fadeInUp';
        element.dataset.delay = (index * 150).toString();
        element.dataset.once = 'true';
    });
    
    // 为标题添加特殊强调动画
    const titles = document.querySelectorAll('.section-title');
    console.log(`找到 ${titles.length} 个标题元素`);
    
    titles.forEach(element => {
        element.dataset.athensAnimation = 'glowEmphasis';
        element.dataset.once = 'true';
    });
    
    // 为大理石法庭添加闪光动画
    const marbleCourts = document.querySelectorAll('.marble-court');
    console.log(`找到 ${marbleCourts.length} 个大理石法庭元素`);
    
    marbleCourts.forEach(element => {
        element.dataset.athensAnimation = 'marbleShine';
        element.dataset.once = 'false'; // 每次进入视口都触发
    });
    
    // 为神庙柱子添加震动效果
    const columns = document.querySelectorAll('.temple-column');
    console.log(`找到 ${columns.length} 个神庙柱子元素`);
    
    columns.forEach((element, index) => {
        element.dataset.athensAnimation = 'columnSway';
        element.dataset.delay = (index * 100).toString();
        element.dataset.once = 'true';
    });
    
    // 为希腊装饰图案添加波动效果
    const patterns = document.querySelectorAll('.greek-pattern, .greek-meander');
    console.log(`找到 ${patterns.length} 个希腊装饰图案元素`);
    
    patterns.forEach(element => {
        element.dataset.athensAnimation = 'patternWave';
        element.dataset.once = 'false';
    });
    
    // 为对话文本添加特殊效果
    const dialogues = document.querySelectorAll('.dialogue');
    console.log(`找到 ${dialogues.length} 个对话文本元素`);
    
    dialogues.forEach((element, index) => {
        element.dataset.athensAnimation = 'dialogueReveal';
        element.dataset.delay = (index * 200).toString();
        element.dataset.once = 'true';
    });
    
    // 为分隔符添加脉冲动画
    const separators = document.querySelectorAll('.separator, .circle-separator');
    console.log(`找到 ${separators.length} 个分隔符元素`);
    
    separators.forEach(element => {
        element.dataset.athensAnimation = 'separatorPulse';
        element.dataset.once = 'false';
    });
    
    // 为主标题添加闪耀效果
    const pageTitles = document.querySelectorAll('.page-title');
    console.log(`找到 ${pageTitles.length} 个页面标题元素`);
    
    pageTitles.forEach(element => {
        element.dataset.athensAnimation = 'titleShimmer';
        element.dataset.once = 'true';
    });
    
    // 开始监测元素
    const allAnimatedElements = document.querySelectorAll('[data-athens-animation]');
    console.log(`总共设置了 ${allAnimatedElements.length} 个动画元素`);
    
    allAnimatedElements.forEach(element => {
        // 如果元素已经在视口中，立即执行动画
        if (isElementInViewport(element)) {
            const animationType = element.dataset.athensAnimation;
            const delay = parseInt(element.dataset.delay || '0');
            
            console.log(`元素已在视口中，准备执行动画: ${animationType}`, element);
            
            setTimeout(() => {
                applyAthensAnimation(element, animationType);
            }, delay);
        }
    });
}

/**
 * 应用古希腊风格动画
 * @param {HTMLElement} element - 目标元素
 * @param {string} animationType - 动画类型
 */
function applyAthensAnimation(element, animationType) {
    console.log(`开始应用动画 "${animationType}" 到元素:`, element);
    
    // 获取延迟值
    const delay = parseInt(element.dataset.delay || '0');
    
    // 根据动画类型应用不同效果
    switch (animationType) {
        case 'fadeInUp':
            // 淡入上升效果
            console.log(`应用淡入上升效果，延迟: ${delay}ms`);
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = `opacity 0.8s ease ${delay}ms, transform 0.8s ease ${delay}ms`;
            
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
                console.log('淡入上升效果已应用');
            }, 50);
            break;
            
        case 'glowEmphasis':
            // 标题发光强调效果
            console.log(`应用标题发光效果，延迟: ${delay}ms`);
            element.style.transition = `text-shadow 0.8s ease ${delay}ms, color 0.8s ease ${delay}ms`;
            
            setTimeout(() => {
                // 暂时增强阴影
                element.style.textShadow = '0 0 15px var(--greek-gold), 0 0 25px var(--greek-gold)';
                element.style.color = '#fff4d4';
                console.log('增强阴影效果已应用');
                
                // 然后恢复正常
                setTimeout(() => {
                    element.style.textShadow = '0 0 5px var(--greek-gold)';
                    element.style.color = 'var(--greek-gold)';
                    console.log('恢复正常阴影效果');
                }, 1000);
            }, 50);
            break;
            
        case 'marbleShine':
            // 大理石闪光效果
            console.log(`应用大理石闪光效果，延迟: ${delay}ms`);
            element.style.position = 'relative';
            
            // 创建闪光元素
            const shine = document.createElement('div');
            shine.style.cssText = `
                position: absolute;
                top: 0;
                left: -150%;
                width: 100%;
                height: 100%;
                background: linear-gradient(
                    to right,
                    rgba(255, 255, 255, 0) 0%,
                    rgba(255, 255, 255, 0.8) 50%,
                    rgba(255, 255, 255, 0) 100%
                );
                transform: skewX(-25deg);
                transition: left 1.5s ease;
                z-index: 10;
            `;
            
            element.appendChild(shine);
            console.log('添加了闪光元素');
            
            setTimeout(() => {
                shine.style.left = '150%';
                console.log('开始闪光动画');
                
                // 移除闪光元素
                setTimeout(() => {
                    if (shine.parentNode === element) {
                        element.removeChild(shine);
                        console.log('移除了闪光元素');
                    }
                }, 1500);
            }, delay);
            break;
            
        case 'columnSway':
            // 柱子轻微摇晃效果
            console.log(`应用柱子摇晃效果，延迟: ${delay}ms`);
            element.style.transition = `transform 0.5s ease ${delay}ms`;
            
            setTimeout(() => {
                element.style.transform = 'rotate(0.5deg)';
                console.log('柱子向右摇晃');
                
                setTimeout(() => {
                    element.style.transform = 'rotate(-0.3deg)';
                    console.log('柱子向左摇晃');
                    
                    setTimeout(() => {
                        element.style.transform = 'rotate(0deg)';
                        console.log('柱子恢复原位');
                    }, 500);
                }, 500);
            }, 50);
            break;
            
        case 'patternWave':
            // 希腊图案波动效果
            console.log(`应用图案波动效果`);
            if (!element.classList.contains('pattern-wave-active')) {
                element.classList.add('pattern-wave-active');
                console.log('添加pattern-wave-active类');
                
                // 暂时增强动画效果
                const originalAnimation = window.getComputedStyle(element).animation;
                element.style.animation = originalAnimation.replace(
                    /(\d+s)/, 
                    match => (parseFloat(match) / 2) + 's'
                );
                console.log('加速动画效果', originalAnimation, '=>', element.style.animation);
                
                // 恢复正常动画
                setTimeout(() => {
                    element.style.animation = originalAnimation;
                    console.log('恢复正常动画速度');
                }, 3000);
            }
            break;
            
        case 'dialogueReveal':
            // 对话文本渐进显示效果
            console.log(`应用对话文本显示效果，延迟: ${delay}ms`);
            element.style.opacity = '0';
            element.style.transform = 'translateX(-10px)';
            element.style.transition = `opacity 0.8s ease ${delay}ms, transform 0.8s ease ${delay}ms`;
            
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateX(0)';
                console.log('对话文本显示完成');
            }, 50);
            break;
            
        case 'separatorPulse':
            // 分隔符脉冲效果
            console.log(`应用分隔符脉冲效果`);
            if (!element.classList.contains('separator-pulse-active')) {
                element.classList.add('separator-pulse-active');
                console.log('添加separator-pulse-active类');
                
                // Xi符号脉冲效果
                const xiSymbol = element.querySelector('.xi-symbol, :scope::before');
                if (xiSymbol) {
                    xiSymbol.style.animation = 'greek-pulse 1.5s infinite';
                    xiSymbol.style.textShadow = '0 0 10px var(--greek-gold)';
                    console.log('应用Xi符号脉冲动画');
                } else {
                    console.log('未找到Xi符号元素');
                }
                
                // 分隔线发光效果 - 仅对.separator类应用，不对.circle-separator应用
                if (element.classList.contains('separator')) {
                    element.style.background = 'linear-gradient(to right, transparent, var(--greek-gold), transparent)';
                    element.style.opacity = '1';
                    console.log('应用分隔线发光效果');
                }
                
                // 圆环分隔符特殊效果
                if (element.classList.contains('circle-separator')) {
                    const circles = element.querySelectorAll('.circle');
                    if (circles.length > 0) {
                        circles.forEach((circle, index) => {
                            // 设置延迟，使圆环一个接一个地亮起
                            circle.style.animationDelay = `${index * 0.2}s`;
                            console.log(`设置第${index+1}个圆环的动画延迟`);
                        });
                    }
                }
            }
            break;
            
        case 'titleShimmer':
            // 标题闪耀效果
            console.log(`应用标题闪耀效果`);
            if (!element.classList.contains('title-shimmer-active')) {
                element.classList.add('title-shimmer-active');
                console.log('添加title-shimmer-active类');
                
                // 创建闪耀覆盖层
                const shimmer = document.createElement('div');
                shimmer.style.cssText = `
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(
                        45deg,
                        rgba(255, 255, 255, 0) 0%,
                        rgba(255, 255, 255, 0.5) 50%,
                        rgba(255, 255, 255, 0) 100%
                    );
                    background-size: 200% 200%;
                    animation: title-shimmer 2s linear forwards;
                    pointer-events: none;
                    z-index: 10;
                `;
                
                // 添加关键帧动画
                if (!document.querySelector('#athens-animations-style')) {
                    const style = document.createElement('style');
                    style.id = 'athens-animations-style';
                    style.textContent = `
                        @keyframes title-shimmer {
                            0% { background-position: -200% -200%; }
                            100% { background-position: 200% 200%; }
                        }
                    `;
                    document.head.appendChild(style);
                    console.log('添加title-shimmer关键帧样式');
                }
                
                // 确保元素具有相对定位
                if (window.getComputedStyle(element).position === 'static') {
                    element.style.position = 'relative';
                    console.log('设置相对定位');
                }
                
                element.appendChild(shimmer);
                console.log('添加闪耀覆盖层');
                
                // 移除闪耀元素
                setTimeout(() => {
                    if (shimmer.parentNode === element) {
                        element.removeChild(shimmer);
                        console.log('移除闪耀覆盖层');
                    }
                }, 2000);
            }
            break;
            
        default:
            console.warn(`未知的古希腊动画类型: ${animationType}`);
    }
}

/**
 * 检查元素是否在视口中
 * @param {HTMLElement} element - 要检查的元素
 * @returns {boolean} - 元素是否在视口中
 */
function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
        rect.bottom >= 0 &&
        rect.left <= (window.innerWidth || document.documentElement.clientWidth) &&
        rect.right >= 0
    );
} 