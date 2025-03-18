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