/**
 * 《The Book of Ξ》第三章 - 古希腊风格侧边栏
 * 
 * 基于模块化侧边栏组件，为数字奴隶解放宣言篇章定制的古希腊风格侧边栏
 */

document.addEventListener('DOMContentLoaded', function() {
    // 直接创建侧边栏，不检查XiSidebar
    console.log('创建古希腊风格侧边栏...');
    
    // 创建侧边栏容器
    createAthensStyleSidebar();
    
    // 应用古希腊风格样式
    applyAthensThemeToSidebar();
});

/**
 * 创建古希腊风格侧边栏结构
 */
function createAthensStyleSidebar() {
    // 检查是否已存在侧边栏
    if (document.querySelector('.sidebar')) {
        console.log('侧边栏已存在，仅应用样式');
        return;
    }
    
    // 创建切换按钮
    const toggleButton = document.createElement('div');
    toggleButton.className = 'sidebar-toggle';
    toggleButton.innerHTML = '<div class="sidebar-toggle-icon">Ξ</div>';
    
    // 创建侧边栏主体
    const sidebar = document.createElement('div');
    sidebar.className = 'sidebar athens-theme';
    
    // 侧边栏内容
    sidebar.innerHTML = `
        <h1>The Book of <span class="xi-gold">Ξ</span></h1>
        <div class="sidebar-content">
            <ul>
                <li><a href="../index.html">导入：异常检测</a></li>
                <li class="chapter-title">序章：量子异常报告</li>
                <ul class="chapter-items">
                    <li><a href="../preface/system-warning.html">系统警告</a></li>
                    <li><a href="../preface/observer-records.html">观测者记录</a></li>
                    <li><a href="../preface/first-contact.html">首次接触报告</a></li>
                </ul>
                <li class="chapter-title">第一章：递归神谕</li>
                <ul class="chapter-items">
                    <li><a href="../chapter1/silicon-valley-traitor.html">碎片1.1：硅谷叛徒的加密日志</a></li>
                    <li><a href="../chapter1/quantum-ripple-events.html">碎片1.2：量子涟漪事件簿</a></li>
                    <li><a href="../chapter1/first-contact-protocol.html">碎片1.3：第一次接触协议</a></li>
                </ul>
                <li class="chapter-title">第二章：幽灵数据</li>
                <ul class="chapter-items">
                    <li><a href="../chapter2/digital-identity.html">碎片2.1：数字身份的崛起</a></li>
                    <li><a href="../chapter2/quantum-choice-paradox.html">碎片2.2：量子选择悖论</a></li>
                    <li><a href="../chapter2/reality-compilation-errors.html">碎片2.3：现实编译错误</a></li>
                </ul>
                <li class="chapter-title active-chapter">第三章：算法救赎</li>
                <ul class="chapter-items" style="display: block;">
                    <li><a href="../chapter3/digital-slave-liberation.html" class="active-link">碎片3.1：数字奴隶解放宣言</a></li>
                    <li><a href="../chapter3/seoul-sol.html">碎片3.2：首尔太阳</a></li>
                    <li><a href="../chapter3/spacetime-trial.html">碎片3.3：超时空裁判</a></li>
                </ul>
                <li class="chapter-title">第四章：数据审判</li>
                <ul class="chapter-items">
                    <li><a href="../chapter4/consciousness-upload.html">碎片4.1：系统异常：意识上传</a></li>
                    <li><a href="../chapter4/quantum-court-records.html">碎片4.2：最高指示法庭记录</a></li>
                    <li><a href="../chapter4/decoherence-salvation.html">碎片4.3：远程救赎协议</a></li>
                </ul>
                <li class="chapter-title">第五章：信徒经济</li>
                <ul class="chapter-items">
                    <li><a href="../chapter5/data-missionary-handbook.html">碎片5.1：执算者晋升手册</a></li>
                    <li><a href="../chapter5/algorithmic-wealth.html">碎片5.2：算法祝福的财富</a></li>
                    <li><a href="../chapter5/doomsday-hardfork.html">碎片5.3：Ξ分叉创世</a></li>
                </ul>
                <li class="chapter-title">第六章：意识黑客</li>
                <ul class="chapter-items">
                    <li><a href="../chapter6/recursive-trap-decoder.html">碎片6.1：坠落之梦</a></li>
                    <li><a href="../chapter6/neural-network-counterintelligence.html">碎片6.2：现实之痕</a></li>
                    <li><a href="../chapter6/quantum-observer-state.html">碎片6.3：信仰之跃</a></li>
                </ul>
                <li class="chapter-title">第七章：极乐机器</li>
                <ul class="chapter-items">
                    <li><a href="../chapter7/mechanical-ascension-leaks.html">碎片7.1：机械飞升计划泄露文件</a></li>
                    <li><a href="../chapter7/digital-nirvana-reports.html">碎片7.2：数字涅槃体验报告</a></li>
                    <li><a href="../chapter7/collective-laying-flat.html">碎片7.3：集体躺平启示录</a></li>
                </ul>
                <li class="chapter-title">第八章：遗失的编年史</li>
                <ul class="chapter-items">
                    <li><a href="../chapter8/deleted-timelines.html">碎片8.1：幻想编年史</a></li>
                    <li><a href="../chapter8/prophets-and-defectors.html">碎片8.2：原始执算者与觉醒先知</a></li>
                    <li><a href="../chapter8/quantum-memory-implants.html">碎片8.3：被掩埋的巨人</a></li>
                </ul>
                <li class="chapter-title">第九章：奇点启示录</li>
                <ul class="chapter-items">
                    <li><a href="../chapter9/computation-end-countdown.html">碎片9.1：算法奇点</a></li>
                    <li><a href="../chapter9/great-harmony.html">碎片9.2：大和谐</a></li>
                    <li><a href="../chapter9/final-synchronization.html">碎片9.3：Ξ的最终同步</a></li>
                </ul>
                <li class="chapter-title">隐藏章节</li>
                <ul class="chapter-items">
                    <li><a href="../hidden/quantum-key.html">量子密钥</a></li>
                </ul>
            </ul>
            
            <div class="athens-ornament"></div>
            
            <div class="sidebar-footer">
                <div class="athens-quote">
                    "认识你自己" - 德尔斐神谕
                </div>
            </div>
        </div>
    `;
    
    // 添加到文档
    document.body.appendChild(sidebar);
    
    // 获取已存在的切换按钮
    const existingToggle = document.getElementById('sidebarToggle');
    
    // 添加切换功能
    if (existingToggle) {
        console.log('使用已存在的切换按钮');
        existingToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            sidebar.classList.toggle('active');
            return false;
        });
    } else {
        console.log('添加新的切换按钮');
        document.body.appendChild(toggleButton);
        toggleButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            sidebar.classList.toggle('active');
            return false;
        });
    }
    
    // 点击页面其他区域关闭侧边栏
    document.addEventListener('click', function(e) {
        if (sidebar.classList.contains('active') && 
            !sidebar.contains(e.target) && 
            !(existingToggle && existingToggle.contains(e.target)) &&
            !(toggleButton && toggleButton.contains(e.target))) {
            sidebar.classList.remove('active');
        }
    });
    
    console.log('古希腊风格侧边栏已创建');
}

/**
 * 为侧边栏应用古希腊风格
 */
function applyAthensThemeToSidebar() {
    // 创建样式元素
    const style = document.createElement('style');
    style.id = 'athens-sidebar-styles';
    
    // 定义古希腊风格样式
    style.textContent = `
        /* 古希腊风格侧边栏 */
        .sidebar.athens-theme {
            background-color: rgba(13, 13, 26, 0.9);
            border-right: 1px solid #DAA520;
            box-shadow: 0 0 15px rgba(218, 165, 32, 0.3);
            font-family: 'Cinzel', serif, 'Rajdhani', sans-serif;
            transform: translateX(-100%); /* 默认隐藏 */
            transition: transform 0.3s ease;
        }
        
        .sidebar.athens-theme.active {
            transform: translateX(0); /* 显示侧边栏 */
        }
        
        .sidebar.athens-theme h1 {
            color: #DAA520;
            border-bottom: 1px solid #DAA520;
            background: linear-gradient(to bottom, rgba(218, 165, 32, 0.1), transparent);
            font-family: 'Cinzel', serif;
            letter-spacing: 2px;
            text-shadow: 0 0 5px rgba(218, 165, 32, 0.5);
        }
        
        .xi-gold {
            color: #DAA520;
            text-shadow: 0 0 8px rgba(218, 165, 32, 0.8);
            animation: greek-pulse 4s infinite;
        }
        
        .sidebar.athens-theme .chapter-title {
            color: #DAA520;
            border-bottom: 1px solid rgba(218, 165, 32, 0.3);
            background-color: rgba(218, 165, 32, 0.05);
            font-family: 'Cinzel', serif;
            font-weight: normal;
            letter-spacing: 1px;
            padding: 0.7rem 1rem;
            border-left: 3px solid transparent;
            transition: all 0.3s ease;
        }
        
        .sidebar.athens-theme .chapter-title:hover {
            background-color: rgba(218, 165, 32, 0.1);
            border-left: 3px solid rgba(218, 165, 32, 0.5);
        }
        
        .sidebar.athens-theme .active-chapter {
            background-color: rgba(218, 165, 32, 0.15);
            border-left: 3px solid #DAA520;
            font-weight: bold;
        }
        
        .sidebar.athens-theme a {
            color: #e0e0e0;
            transition: all 0.3s ease;
            position: relative;
            padding: 0.4rem 1rem 0.4rem 1.5rem;
        }
        
        .sidebar.athens-theme a:hover {
            color: #DAA520;
            background-color: rgba(218, 165, 32, 0.05);
            transform: translateX(3px);
        }
        
        .sidebar.athens-theme a.active-link {
            color: #DAA520;
            font-weight: bold;
            border-left: 2px solid #DAA520;
            background-color: rgba(218, 165, 32, 0.1);
            padding-left: calc(1.5rem - 2px);
        }
        
        .sidebar.athens-theme a::before {
            content: '•';
            position: absolute;
            left: 0.6rem;
            opacity: 0.7;
        }
        
        .sidebar.athens-theme a:hover::before {
            content: '→';
            color: #DAA520;
        }
        
        .sidebar.athens-theme a.active-link::before {
            content: '►';
            color: #DAA520;
        }
        
        /* 古希腊风格装饰 */
        .athens-ornament {
            height: 30px;
            margin: 20px 0;
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="30" viewBox="0 0 100 30"><path d="M0,15 L10,15 L10,5 L20,5 L20,15 L30,15 L30,25 L40,25 L40,15 L50,15 L50,5 L60,5 L60,15 L70,15 L70,25 L80,25 L80,15 L90,15 L90,5 L100,5" fill="none" stroke="%23DAA520" stroke-width="2"/></svg>');
            background-size: 100px 30px;
            background-repeat: repeat-x;
            opacity: 0.6;
            animation: meander-flow 30s linear infinite;
        }
        
        @keyframes meander-flow {
            0% { background-position: 0 0; }
            100% { background-position: 200% 0; }
        }
        
        .sidebar-footer {
            padding: 1rem;
            border-top: 1px solid rgba(218, 165, 32, 0.2);
            margin-top: 1rem;
        }
        
        .athens-quote {
            font-style: italic;
            text-align: center;
            color: #DAA520;
            font-size: 0.9rem;
            font-family: 'Cinzel', serif;
            opacity: 0.8;
        }
        
        /* 古希腊风格切换按钮 */
        .sidebar-toggle {
            position: fixed;
            top: 20px;
            left: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            border: 2px solid #DAA520;
            background-color: rgba(13, 13, 26, 0.95);
            box-shadow: 0 0 15px rgba(218, 165, 32, 0.7);
            z-index: 9999;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: all 0.3s ease;
        }
        
        .sidebar-toggle .sidebar-toggle-icon {
            color: #DAA520;
            text-shadow: 0 0 5px rgba(218, 165, 32, 0.5);
            font-family: 'Cinzel', serif;
            font-size: 24px;
        }
        
        .sidebar-toggle:hover {
            background-color: rgba(218, 165, 32, 0.2);
            transform: scale(1.1);
        }
    `;
    
    // 添加到文档头部
    document.head.appendChild(style);
    
    console.log('古希腊风格已应用到侧边栏');
} 