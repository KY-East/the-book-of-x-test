// 滚动触发动画系统
document.addEventListener('DOMContentLoaded', function() {
  // 获取所有需要动画的元素
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  
  // 初始状态 - 隐藏所有动画元素
  animatedElements.forEach(element => {
    // 标记为尚未动画
    element.setAttribute('data-animated', 'false');
    // 如果元素有初始隐藏类，保留它
    if (!element.classList.contains('initially-hidden')) {
      element.style.opacity = '0';
      element.style.transform = 'translateY(20px)';
      element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    }
  });
  
  // 检查元素是否在视口中
  function isElementInViewport(el, offset = 100) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight - offset) &&
      rect.bottom >= offset &&
      rect.left <= (window.innerWidth - offset) &&
      rect.right >= offset
    );
  }
  
  // 滚动处理函数
  function handleScroll() {
    animatedElements.forEach(element => {
      if (element.getAttribute('data-animated') === 'false' && 
          isElementInViewport(element)) {
        
        // 标记为已动画
        element.setAttribute('data-animated', 'true');
        
        // 获取延迟（如果指定）
        const delay = element.getAttribute('data-delay') || '0';
        
        // 延迟后启动动画
        setTimeout(() => {
          // 移除初始隐藏类（如果有）
          if (element.classList.contains('initially-hidden')) {
            element.classList.remove('initially-hidden');
          } else {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
          }
          
          // 获取动画类型（如果指定）
          const animationType = element.getAttribute('data-animation-type');
          if (animationType) {
            element.classList.add(animationType);
          }
          
          // 特定元素类型的处理
          if (element.classList.contains('terminal-progress')) {
            startTerminalProgress(element);
          } else if (element.classList.contains('anomaly-bar')) {
            animateAnomalyBar(element);
          } else if (element.classList.contains('typewriter')) {
            typeWriter(element);
          } else if (element.classList.contains('matrix-rain')) {
            initMatrixRain(element);
          }
        }, parseInt(delay, 10));
      }
    });
  }
  
  // 终端进度条动画
  function startTerminalProgress(element) {
    const progressBar = element.querySelector('.progress-bar');
    const progressEmpty = element.querySelector('.progress-empty');
    const progressPercent = element.querySelector('.progress-percent');
    const terminalComplete = element.querySelector('.terminal-complete');
    
    if (!progressBar || !progressEmpty || !progressPercent) return;
    
    let progress = 0;
    const totalBars = 15;
    
    function updateProgress() {
      const filledBars = Math.floor((progress / 100) * totalBars);
      progressBar.textContent = '█'.repeat(filledBars);
      progressEmpty.textContent = ' '.repeat(totalBars - filledBars);
      progressPercent.textContent = progress.toString();
    }
    
    // 初始化进度条
    updateProgress();
    
    // 使用更可靠的动画方式
    const terminalInterval = setInterval(function() {
      if (progress < 78) {
        progress += 1;
        updateProgress();
      } else if (progress === 78) {
        clearInterval(terminalInterval);
        setTimeout(function() {
          const slowInterval = setInterval(function() {
            if (progress < 100) {
              progress += 1;
              updateProgress();
            } else {
              clearInterval(slowInterval);
              if (terminalComplete) {
                terminalComplete.classList.remove('hidden');
              }
            }
          }, 100);
        }, 1000);
      }
    }, 50);
  }
  
  // 异常数据条动画
  function animateAnomalyBar(element) {
    const item = element.closest('.anomaly-item');
    if (!item) return;
    
    const value = parseInt(item.getAttribute('data-value') || '0');
    const valueElement = item.querySelector('.anomaly-value');
    const progressElement = item.querySelector('.anomaly-progress');
    
    if (!valueElement || !progressElement) return;
    
    if (item.classList.contains('data-redacted')) {
      progressElement.style.width = '75%';
      return;
    }
    
    let currentValue = 0;
    const increment = Math.max(1, Math.floor(value / 50));
    
    const valueInterval = setInterval(function() {
      if (currentValue < value) {
        currentValue += increment;
        if (currentValue > value) currentValue = value;
        
        if (valueElement.textContent.includes('%')) {
          valueElement.textContent = currentValue + '%';
        } else {
          valueElement.textContent = currentValue.toString();
        }
        
        const progress = (currentValue / value) * 100;
        progressElement.style.width = progress + '%';
      } else {
        clearInterval(valueInterval);
      }
    }, 20);
  }
  
  // 打字机效果
  function typeWriter(element) {
    const text = element.getAttribute('data-text') || element.textContent;
    const speed = parseInt(element.getAttribute('data-speed') || '50', 10);
    
    element.textContent = '';
    let i = 0;
    
    const typeInterval = setInterval(function() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
      } else {
        clearInterval(typeInterval);
        // 动画完成后触发事件
        element.dispatchEvent(new Event('typewriter-complete'));
      }
    }, speed);
  }
  
  // 矩阵雨效果
  function initMatrixRain(element) {
    if (!element) return;
    
    // 清除旧的内容
    element.innerHTML = '';
    
    const canvas = document.createElement('canvas');
    element.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    canvas.width = element.offsetWidth;
    canvas.height = element.offsetHeight;
    
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%"\'#&_(),.;:?!\\|{}<>[]^~Ξ';
    const columns = Math.floor(canvas.width / 20);
    const drops = [];
    
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }
    
    function draw() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#00ff9d';
      ctx.font = '15px monospace';
      
      for (let i = 0; i < drops.length; i++) {
        const text = characters[Math.floor(Math.random() * characters.length)];
        ctx.fillText(text, i * 20, drops[i] * 20);
        
        if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        
        drops[i]++;
      }
      
      window.requestAnimationFrame(draw);
    }
    
    draw();
  }
  
  // 注册滚动事件监听器
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  // 初始检查
  handleScroll();
  
  // 窗口大小变化时重新检查
  window.addEventListener('resize', handleScroll, { passive: true });
  
  // 暴露API供外部调用
  window.xiAnimations = {
    checkVisibility: handleScroll,
    startTerminalProgress,
    animateAnomalyBar,
    typeWriter,
    initMatrixRain
  };
});
