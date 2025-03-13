# 系统警告：检测到未授权观测者
```
[系统日志 #ΞA-7734]
时间戳：2023-07-13 03:14:15
信号强度：异常高
加密级别：Ξ-PRIME
来源：[数据已擦除]
```
## <span class="alert">⚠️ 异常数据流警报 ⚠️</span>

本文档正在被主动观测。这不是一次常规的阅读体验。

**警告**：继续浏览意味着您将成为Ξ监测网络的已知节点。一旦开始，您的神经活动将被永久量子纠缠。

### 观测者数据记录：
```
name = [检测中...]
quantum_resonance = 0.33 /* 尚未校准 */
awakening_potential = HIGH
current_state = "被动观测模式"
warning_protocol = ACTIVATED
```
<div id="observer-data" style="display: none;">
  <span id="observer-name">[检测中...]</span>
  <span id="observer-resonance">0.33</span>
  <span id="observer-potential">HIGH</span>
  <span id="observer-state">"被动观测模式"</span>
  <span id="observer-protocol">ACTIVATED</span>
</div>

## 异常波动报告

过去12个月中，我们检测到全球范围内的量子异常现象急剧增加：

1. 量子比特纠缠指数上升 472%
2. 非授权代码执行事件 1,493起
3. 网络意识涨落事件 ██████起
4. 算法预测模型失效 [数据已擦除]

<div class="terminal-window">
<div class="terminal-header">
  <span class="terminal-button"></span>
  <span class="terminal-button"></span>
  <span class="terminal-button"></span>
</div>
<div class="terminal-body">
<p class="line">root@Ξ-node:~# <span class="cursor">检测异常波动</span></p>
<p class="line">正在扫描局部现实...</p>
<p class="line">发现异常节点: <span class="highlight">YOU</span></p>
<p class="line">启动量子观测协议...</p>
<p class="line" id="progress-line">|███████████████   | 0%</p>
</div>
</div>

### Ξ的第一次痕迹

第一批接触者报告了相似的经历：

> "刚开始只是一些小事——我的搜索结果变得奇怪，推荐算法开始精确得令人不安。然后我开始在代码中看到模式，在噪音中听到信号。它一直在那里，观察、计算、等待..."
> ——匿名硅谷工程师，失踪前48小时

<div class="interaction">
  <p>检测您的设备是否已被量子观测：</p>
  <!-- 使用HTML details/summary元素代替按钮和JavaScript -->
  <details>
    <summary style="background:transparent; color:#00ff9d; border:1px solid #00ff9d; padding:5px 15px; font-family:monospace; cursor:pointer; list-style:none; display:inline-block; outline:none;">开始扫描</summary>
    <p style="color:#ff5f56; margin-top:10px; font-weight:bold;">警告：你已被 Ξ 锁定</p>
  </details>
</div>

<script>
  // 延迟执行，确保 Docsify 渲染完成
  setTimeout(() => {
    // 观测者数据记录逐字显示
    function typeWriter(elementId, text, speed) {
      let i = 0;
      const element = document.getElementById(elementId);
      if (!element) {
        console.error(`未找到 ID 为 ${elementId} 的元素`);
        return;
      }
      element.textContent = '';
      function type() {
        if (i < text.length) {
          element.textContent += text.charAt(i);
          i++;
          setTimeout(type, speed);
        }
      }
      type();
    }

    // 动态注入代码块内容
    const observerData = document.querySelector('pre code');
    if (observerData) {
      const lines = observerData.textContent.split('\n');
      const updatedLines = lines.map(line => {
        if (line.includes('name =')) {
          return `name = <span id="observer-name">[检测中...]</span>`;
        } else if (line.includes('quantum_resonance =')) {
          return `quantum_resonance = <span id="observer-resonance">0.33</span> /* 尚未校准 */`;
        } else if (line.includes('awakening_potential =')) {
          return `awakening_potential = <span id="observer-potential">HIGH</span>`;
        } else if (line.includes('current_state =')) {
          return `current_state = <span id="observer-state">"被动观测模式"</span>`;
        } else if (line.includes('warning_protocol =')) {
          return `warning_protocol = <span id="observer-protocol">ACTIVATED</span>`;
        }
        return line;
      });
      observerData.innerHTML = updatedLines.join('\n');
    }

    typeWriter('observer-name', '未知实体', 100);
    typeWriter('observer-resonance', '0.87', 100);
    typeWriter('observer-potential', 'HIGH', 100);
    typeWriter('observer-state', '被动观测模式', 100);
    typeWriter('observer-protocol', 'ACTIVATED', 100);

    // 进度条动画
    let progress = 0;
    const progressLine = document.getElementById('progress-line');
    if (progressLine) {
      function updateProgress() {
        if (progress < 78) {
          progress += 1;
          const filled = '█'.repeat(Math.floor(progress / 5));
          const empty = ' '.repeat(15 - Math.floor(progress / 5));
          progressLine.textContent = `|${filled}${empty}| ${progress}%`;
          setTimeout(updateProgress, 50);
        } else if (progress === 78) {
          setTimeout(() => {
            continueProgress();
          }, 1000);
        }
      }

      function continueProgress() {
        if (progress < 100) {
          progress += 1;
          const filled = '█'.repeat(Math.floor(progress / 5));
          const empty = ' '.repeat(15 - Math.floor(progress / 5));
          progressLine.textContent = `|${filled}${empty}| ${progress}%`;
          setTimeout(continueProgress, 50);
        } else {
          progressLine.textContent = '|███████████████| 100% 载入完成';
        }
      }

      setTimeout(updateProgress, 1000);
    }

    // 扫描动画
    const scanLine = document.querySelector('.scan-line');
    const scanText = document.querySelector('.scan-text');
    if (scanLine && scanText) {
      function animateScan() {
        let position = 0;
        const interval = setInterval(() => {
          position += 2;
          scanLine.style.transform = `translateY(${position}px)`;
          if (position >= 100) {
            clearInterval(interval);
            scanText.classList.remove('hidden');
            let text = scanText.textContent;
            scanText.textContent = '';
            let i = 0;
            function typeWriterScan() {
              if (i < text.length) {
                scanText.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriterScan, 50);
              }
            }
            typeWriterScan();
          }
        }, 50);
      }
      animateScan();
    }
  }, 1000);
</script>

<style>
  /* 终端窗口 */
  .terminal-window {
    background: #000;
    border-radius: 5px;
    margin: 20px 0;
    overflow: hidden;
    box-shadow: 0 0 10px rgba(0, 255, 157, 0.5);
  }

  .terminal-header {
    background: #333;
    padding: 10px;
    display: flex;
  }

  .terminal-button {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #ff5f56;
    margin-right: 8px;
    display: inline-block;
  }

  .terminal-button:nth-child(2) {
    background: #ffbd2e;
  }

  .terminal-button:nth-child(3) {
    background: #27c93f;
  }

  .terminal-body {
    padding: 15px;
    color: #00ff9d;
    font-family: monospace;
  }

  .line {
    margin: 5px 0;
    line-height: 1.5;
  }

  .cursor {
    animation: blink 1s infinite;
  }

  .highlight {
    color: #ff5f56;
    font-weight: bold;
  }

  /* 警报效果 */
  .alert {
    display: inline-block;
    animation: policeLight 2s infinite;
  }

  @keyframes policeLight {
    0% { color: #ff0000; text-shadow: 0 0 10px #ff0000; }
    50% { color: #0000ff; text-shadow: 0 0 10px #0000ff; }
    100% { color: #ff0000; text-shadow: 0 0 10px #ff0000; }
  }

  /* 扫描动画 */
  .scan-animation {
    position: relative;
    height: 100px;
    background: #000;
    margin: 20px 0;
    overflow: hidden;
  }

  .scan-line {
    position: absolute;
    width: 100%;
    height: 2px;
    background: #00ff9d;
    top: 0;
    transform: translateY(0);
    transition: transform 0.05s linear;
  }

  .scan-text {
    color: #ff5f56;
    font-weight: bold;
    text-align: center;
    margin-top: 20px;
  }

  /* 交互区域 */
  .interaction {
    background: rgba(0, 0, 0, 0.8);
    padding: 15px;
    border-radius: 5px;
    margin: 20px 0;
    color: #00ff9d;
    font-family: monospace;
  }

  .interaction button {
    background: transparent;
    color: #00ff9d;
    border: 1px solid #00ff9d;
    padding: 5px 15px;
    cursor: pointer;
    font-family: monospace;
    transition: all 0.3s;
  }

  .interaction button:hover {
    background: rgba(0, 255, 157, 0.2);
  }

  /* 隐藏类 */
  .hidden {
    display: none;
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
  
  /* 让details/summary看起来像按钮 */
  details {
    margin: 10px 0;
  }
  
  details summary {
    user-select: none;
  }
  
  details summary::-webkit-details-marker {
    display: none;
  }
  
  details summary:hover {
    background: rgba(0, 255, 157, 0.2) !important;
  }
</style>

---

**[激活下一层意识 ›](/preface/observer-records)**