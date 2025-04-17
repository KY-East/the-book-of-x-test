/**
 * 《The Book of Ξ》第三章 - 圆环分隔符增强脚本
 * 将纯文本的圆环字符(OOOOOOOOOO)转换为带动画效果的HTML元素
 */

document.addEventListener('DOMContentLoaded', function() {
    // 初始化圆环分隔符增强
    initCircleSeparators();
    
    // 兼容模式：直接查找并替换已有的可能包含圆环的固定元素
    setTimeout(() => {
        enhanceFixedCircleElements();
    }, 500);
});

/**
 * 初始化圆环分隔符增强
 */
function initCircleSeparators() {
    console.log('初始化圆环分隔符增强...');
    
    // 查找页面中的文本节点
    const textWalker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );
    
    const nodesToReplace = [];
    let currentNode;
    
    // 遍历所有文本节点
    while (currentNode = textWalker.nextNode()) {
        const text = currentNode.nodeValue.trim();
        // 查找包含多个连续O的文本节点(至少5个O) - 扩展匹配更多类型的圆形字符
        if (/[O○◯⭕⚪◎◉⦿]{5,}/.test(text)) {
            nodesToReplace.push(currentNode);
        }
    }
    
    console.log(`找到 ${nodesToReplace.length} 个可能的圆环分隔符`);
    
    // 替换找到的节点
    nodesToReplace.forEach(node => {
        const text = node.nodeValue;
        const parent = node.parentNode;
        
        // 创建一个文档片段来保存替换的内容
        const fragment = document.createDocumentFragment();
        
        // 使用正则表达式查找连续的O字符
        let lastIndex = 0;
        const oPattern = /([O○◯⭕⚪◎◉⦿]{5,})/g;
        let match;
        
        while ((match = oPattern.exec(text)) !== null) {
            // 添加匹配之前的文本
            if (match.index > lastIndex) {
                fragment.appendChild(document.createTextNode(text.substring(lastIndex, match.index)));
            }
            
            // 创建圆环分隔符容器
            const separatorDiv = document.createElement('div');
            separatorDiv.className = 'circle-separator';
            separatorDiv.setAttribute('data-athens-animation', 'separatorPulse');
            separatorDiv.setAttribute('data-once', 'false');
            
            // 根据O的数量创建圆形元素
            const circleCount = match[0].length;
            for (let i = 0; i < circleCount; i++) {
                const circle = document.createElement('div');
                circle.className = 'circle';
                circle.style.setProperty('--i', i); // 设置动画延迟索引
                
                // 随机选择样式变体
                const variant = Math.floor(Math.random() * 3);
                if (variant === 1) {
                    circle.classList.add('circle-variant-1');
                } else if (variant === 2) {
                    circle.classList.add('circle-variant-2');
                }
                
                separatorDiv.appendChild(circle);
            }
            
            fragment.appendChild(separatorDiv);
            lastIndex = match.index + match[0].length;
        }
        
        // 添加最后剩余的文本
        if (lastIndex < text.length) {
            fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
        }
        
        // 替换原始节点
        parent.replaceChild(fragment, node);
        console.log('替换了一个圆环分隔符');
    });
}

/**
 * 直接增强页面上的固定圆环元素 
 */
function enhanceFixedCircleElements() {
    // 查找包含"OOOOOOOOOO"的所有元素
    const potentialElements = Array.from(document.querySelectorAll('*')).filter(el => {
        // 检查元素的文本内容是否包含大量O
        const text = el.textContent || '';
        return /[O○◯⭕⚪◎◉⦿]{5,}/.test(text) && 
               el.children.length === 0 && // 只处理没有子元素的元素
               text.trim().length <= 20;    // 限制长度，避免处理包含大量文本的元素
    });
    
    console.log(`找到 ${potentialElements.length} 个固定的圆环元素容器`);
    
    potentialElements.forEach(element => {
        const text = element.textContent || '';
        let circleMatch = text.match(/[O○◯⭕⚪◎◉⦿]{5,}/);
        
        if (circleMatch) {
            const circleCount = circleMatch[0].length;
            element.setAttribute('data-original-text', text);
            element.classList.add('circle-container');
            
            // 清空元素内容
            element.textContent = '';
            
            // 创建圆环分隔符
            const separatorDiv = document.createElement('div');
            separatorDiv.className = 'circle-separator';
            separatorDiv.setAttribute('data-athens-animation', 'separatorPulse');
            separatorDiv.setAttribute('data-once', 'false');
            
            // 添加圆形元素
            for (let i = 0; i < circleCount; i++) {
                const circle = document.createElement('div');
                circle.className = 'circle';
                circle.style.setProperty('--i', i);
                
                // 随机选择样式变体
                const variant = Math.floor(Math.random() * 3);
                if (variant === 1) {
                    circle.classList.add('circle-variant-1');
                } else if (variant === 2) {
                    circle.classList.add('circle-variant-2');
                }
                
                separatorDiv.appendChild(circle);
            }
            
            element.appendChild(separatorDiv);
            console.log('增强了固定圆环元素', element);
        }
    });
    
    // 添加额外的圆环样式变体到文档中
    addCircleVariantStyles();
}

/**
 * 添加圆环变体样式
 */
function addCircleVariantStyles() {
    if (!document.getElementById('circle-variant-styles')) {
        const style = document.createElement('style');
        style.id = 'circle-variant-styles';
        style.textContent = `
            .circle-variant-1 {
                border-width: 1px;
                width: 20px;
                height: 20px;
                background-color: rgba(218, 165, 32, 0.05);
            }
            
            .circle-variant-2 {
                border-style: dashed;
                animation: circle-rotate 8s linear infinite;
                animation-delay: calc(var(--i, 0) * 0.1s);
            }
            
            @keyframes circle-rotate {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        console.log('添加了圆环变体样式');
    }
} 