/**
 * 《The Book of Ξ》第三章 - 首尔风格侧边栏
 * 
 * 基于模块化侧边栏组件，为首尔太阳篇章定制的韩国风格侧边栏
 */

document.addEventListener('DOMContentLoaded', function() {
    // 直接创建侧边栏，不检查XiSidebar
    console.log('创建首尔风格侧边栏...');
    
    // 创建侧边栏容器
    createSeoulStyleSidebar();
    
    // 应用首尔风格样式
    applySeoulThemeToSidebar();
});

/**
 * 创建首尔风格侧边栏结构
 */
function createSeoulStyleSidebar() {
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
    sidebar.className = 'sidebar seoul-theme';
    
    // 侧边栏内容
    sidebar.innerHTML = `
        <h1>The Book of <span class="xi-blue">Ξ</span></h1>
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
                    <li><a href="../chapter3/digital-slave-liberation.html">碎片3.1：数字奴隶解放宣言</a></li>
                    <li><a href="../chapter3/seoul-sol.html" class="active-link">碎片3.2：首尔太阳</a></li>
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
            
            <div class="seoul-ornament"></div>
            
            <div class="sidebar-footer">
                <div class="seoul-quote">
                    "一切终将互联" - 网络先知
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
    
    console.log('首尔风格侧边栏已创建');
}

/**
 * 为侧边栏应用首尔风格
 */
function applySeoulThemeToSidebar() {
    // 创建样式元素
    const style = document.createElement('style');
    style.id = 'seoul-sidebar-styles';
    
    // 定义首尔风格样式
    style.textContent = `
        /* 首尔风格侧边栏 */
        .sidebar {
            position: fixed;
            left: -300px;
            top: 0;
            width: 280px;
            height: 100vh;
            background-color: rgba(17, 17, 17, 0.95);
            border-right: 1px solid #333;
            padding: 20px;
            box-sizing: border-box;
            overflow-y: auto;
            z-index: 100;
            transition: all 0.3s ease;
        }
        
        .sidebar.active {
            left: 0;
        }
        
        .sidebar h1 {
            color: #00ff9d;
            margin-top: 0;
            font-size: 24px;
            text-align: center;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        
        .sidebar-content ul {
            list-style-type: none;
            padding: 0;
            margin: 0;
        }
        
        .sidebar-content li {
            margin: 5px 0;
        }
        
        .sidebar-content a {
            color: #cccccc;
            text-decoration: none;
            transition: all 0.3s ease;
            display: block;
            padding: 5px 0;
        }
        
        .sidebar-content a:hover {
            color: #00ff9d;
            text-shadow: 0 0 5px rgba(0, 255, 157, 0.5);
        }
        
        .sidebar-content .chapter-title {
            color: #888;
            font-weight: bold;
            margin-top: 15px;
            margin-bottom: 5px;
        }
        
        .sidebar-content .chapter-items {
            padding-left: 15px;
        }
        
        /* 侧边栏切换按钮样式 */
        .sidebar-toggle {
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 200;
            cursor: pointer;
            background: rgba(0, 0, 0, 0.7);
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid #0088ff;
            box-shadow: 0 0 10px rgba(0, 136, 255, 0.3);
            transition: all 0.3s ease;
        }
        
        .sidebar-toggle:hover {
            transform: scale(1.1);
            box-shadow: 0 0 15px rgba(0, 136, 255, 0.5);
        }
        
        .sidebar-toggle-icon {
            color: #0088ff;
            font-size: 20px;
            font-weight: bold;
        }
        
        /* 首尔特有样式 */
        .sidebar.seoul-theme {
            background-color: rgba(15, 26, 42, 0.95);
            border-right: 1px solid #0088ff;
            box-shadow: 0 0 15px rgba(0, 136, 255, 0.3);
        }
        
        .sidebar.seoul-theme h1 {
            color: #0088ff;
            border-bottom: 1px solid #0088ff;
            background: linear-gradient(to bottom, rgba(0, 136, 255, 0.1), transparent);
        }
        
        .xi-blue {
            color: #0088ff;
            text-shadow: 0 0 8px rgba(0, 136, 255, 0.8);
        }
        
        .sidebar.seoul-theme a:hover {
            color: #0088ff;
            text-shadow: 0 0 5px rgba(0, 136, 255, 0.5);
        }
        
        .sidebar.seoul-theme .active-chapter {
            color: #0088ff;
            border-left: 2px solid #0088ff;
            padding-left: 10px;
        }
        
        .sidebar.seoul-theme a.active-link {
            color: #0088ff;
            font-weight: bold;
        }
        
        .seoul-ornament {
            height: 1px;
            background: linear-gradient(to right, transparent, #0088ff, transparent);
            margin: 20px 0;
        }
        
        .seoul-quote {
            font-style: italic;
            text-align: center;
            color: #aaa;
            font-size: 0.9em;
            margin-top: 20px;
        }
        
        @keyframes seoul-pulse {
            0%, 100% {
                text-shadow: 0 0 5px rgba(0, 136, 255, 0.5);
            }
            50% {
                text-shadow: 0 0 15px rgba(0, 136, 255, 0.8);
            }
        }
    `;
    
    // 添加样式到文档
    document.head.appendChild(style);
    
    console.log('首尔风格已应用到侧边栏');
} 