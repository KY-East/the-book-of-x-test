/**
 * The Book of Ξ - 章节按需加载系统
 * 这个系统允许章节内容根据用户滚动行为逐步加载和显示
 */

document.addEventListener('DOMContentLoaded', function() {
  // 配置项
  const config = {
    // 章节加载触发点 - 当前章节显示的百分比触发下一章节加载
    loadTriggerPercentage: 70,
    // 动画延迟基础值 (ms)
    baseAnimationDelay: 200,
    // 是否启用平滑滚动
    smoothScroll: true,
    // 章节之间的过渡动画时长 (ms)
    transitionDuration: 800,
    // 是否显示阅读进度指示器
    showProgressIndicator: true,
    // 是否根据性能自动调整动画复杂度
    adaptivePerformance: true
  };
  
  // 获取所有章节容器
  const chapterContainers = document.querySelectorAll('.chapter-container');
  if (!chapterContainers.length) return;
  
  // 章节状态跟踪
  const chapterState = {
    totalChapters: chapterContainers.length,
    loadedChapters: 1, // 默认首章已加载
    activeChapterIndex: 0,
    isTransitioning: false,
    performanceLevel: 'high' // 'high', 'medium', 'low'
  };
  
  // 初始化时只显示第一章，其他章节设为隐藏
  function initializeChapters() {
    chapterContainers.forEach((chapter, index) => {
      // 设置章节ID
      if (!chapter.id) {
        chapter.id = `chapter-${index}`;
      }
      
      // 首章显示，其他隐藏
      if (index === 0) {
        chapter.classList.add('active-chapter');
        initializeAnimations(chapter);
      } else {
        chapter.classList.add('hidden-chapter');
        chapter.style.opacity = '0';
        chapter.style.transform = 'translateY(50px)';
        chapter.style.transition = `opacity ${config.transitionDuration}ms ease, transform ${config.transitionDuration}ms ease`;
      }
      
      // 如果不是最后一章，添加继续阅读按钮
      if (index < chapterState.totalChapters - 1) {
        addContinueButton(chapter, index);
      }
    });
    
    // 检测设备性能
    if (config.adaptivePerformance) {
      detectPerformance();
    }
    
    // 添加阅读进度指示器
    if (config.showProgressIndicator) {
      addProgressIndicator();
    }
  }
  
  // 性能检测
  function detectPerformance() {
    const start = performance.now();
    let count = 0;
    
    while (performance.now() - start < 5) {
      count++;
    }
    
    // 基于5ms内的循环次数评估性能
    if (count < 10000) {
      chapterState.performanceLevel = 'low';
      document.body.classList.add('low-performance-device');
    } else if (count < 50000) {
      chapterState.performanceLevel = 'medium';
      document.body.classList.add('medium-performance-device');
    }
    
    console.log(`性能级别: ${chapterState.performanceLevel} (循环次数: ${count})`);
  }
  
  // 为章节添加继续阅读按钮
  function addContinueButton(chapter, chapterIndex) {
    const continueButton = document.createElement('div');
    continueButton.className = 'continue-button animate-on-scroll';
    continueButton.innerHTML = `
      <div class="button-content">
        <span class="continue-text">继续探索</span>
        <span class="continue-icon">⇣</span>
      </div>
      <div class="button-shine"></div>
    `;
    
    continueButton.addEventListener('click', function() {
      loadNextChapter(chapterIndex);
    });
    
    chapter.appendChild(continueButton);
  }
  
  // 添加阅读进度指示器
  function addProgressIndicator() {
    // 创建进度条容器
    const progressContainer = document.createElement('div');
    progressContainer.className = 'reading-progress-container';
    
    // 创建进度条
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress-bar';
    progressBar.id = 'readingProgressBar';
    
    // 创建章节标记
    for (let i = 0; i < chapterState.totalChapters; i++) {
      const chapterMarker = document.createElement('div');
      chapterMarker.className = 'chapter-marker';
      if (i === 0) chapterMarker.classList.add('active');
      chapterMarker.setAttribute('data-chapter', i);
      
      // 点击标记跳转到对应章节
      chapterMarker.addEventListener('click', function() {
        const targetChapter = document.getElementById(`chapter-${i}`);
        if (targetChapter && !targetChapter.classList.contains('hidden-chapter')) {
          targetChapter.scrollIntoView({
            behavior: config.smoothScroll ? 'smooth' : 'auto',
            block: 'start'
          });
        }
      });
      
      progressContainer.appendChild(chapterMarker);
    }
    
    progressContainer.appendChild(progressBar);
    document.body.appendChild(progressContainer);
    
    // 更新进度条
    window.addEventListener('scroll', updateProgressBar);
  }
  
  // 更新阅读进度条
  function updateProgressBar() {
    const progressBar = document.getElementById('readingProgressBar');
    if (!progressBar) return;
    
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercentage = (scrollPosition / scrollHeight) * 100;
    
    progressBar.style.width = `${scrollPercentage}%`;
    
    // 更新当前章节标记
    updateActiveChapterMarker();
  }
  
  // 更新活动章节标记
  function updateActiveChapterMarker() {
    // 获取所有可见章节
    const visibleChapters = Array.from(chapterContainers).filter(
      chapter => !chapter.classList.contains('hidden-chapter')
    );
    
    // 确定当前可视章节
    let activeChapterIndex = 0;
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    
    for (let i = 0; i < visibleChapters.length; i++) {
      const chapter = visibleChapters[i];
      const chapterTop = chapter.offsetTop;
      const chapterHeight = chapter.offsetHeight;
      
      // 如果滚动位置在当前章节范围内
      if (scrollPosition >= chapterTop && scrollPosition < chapterTop + chapterHeight) {
        activeChapterIndex = parseInt(chapter.id.split('-')[1]);
        break;
      }
    }
    
    // 更新章节标记
    const chapterMarkers = document.querySelectorAll('.chapter-marker');
    chapterMarkers.forEach((marker, index) => {
      if (index === activeChapterIndex) {
        marker.classList.add('active');
      } else {
        marker.classList.remove('active');
      }
    });
    
    // 如果接近章节底部，加载下一章
    const currentChapter = visibleChapters[activeChapterIndex];
    if (currentChapter) {
      const chapterBottom = currentChapter.offsetTop + currentChapter.offsetHeight;
      const currentIndex = parseInt(currentChapter.id.split('-')[1]);
      const scrollBottom = scrollPosition + window.innerHeight;
      
      // 如果已经滚动到当前章节的指定百分比
      const triggerPosition = currentChapter.offsetTop + (currentChapter.offsetHeight * config.loadTriggerPercentage / 100);
      
      if (scrollBottom >= triggerPosition) {
        loadNextChapter(currentIndex);
      }
    }
  }
  
  // 加载下一章
  function loadNextChapter(currentIndex) {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= chapterState.totalChapters || chapterState.isTransitioning) {
      return;
    }
    
    const nextChapter = document.getElementById(`chapter-${nextIndex}`);
    if (!nextChapter || !nextChapter.classList.contains('hidden-chapter')) {
      return;
    }
    
    // 标记转场状态，防止多次触发
    chapterState.isTransitioning = true;
    
    // 显示下一章
    nextChapter.classList.remove('hidden-chapter');
    nextChapter.classList.add('loading-chapter');
    
    // 使用RAF确保DOM更新后执行动画
    requestAnimationFrame(() => {
      nextChapter.style.opacity = '1';
      nextChapter.style.transform = 'translateY(0)';
      
      // 初始化新章节的动画
      initializeAnimations(nextChapter);
      
      // 转场结束后重置状态
      setTimeout(() => {
        nextChapter.classList.remove('loading-chapter');
        nextChapter.classList.add('active-chapter');
        chapterState.loadedChapters++;
        chapterState.isTransitioning = false;
        
        // 发送章节加载事件
        dispatchChapterEvent('chapterLoaded', { 
          chapterIndex: nextIndex,
          totalLoaded: chapterState.loadedChapters,
          totalChapters: chapterState.totalChapters
        });
      }, config.transitionDuration);
    });
  }
  
  // 初始化章节内动画元素
  function initializeAnimations(chapter) {
    // 获取章节内所有需要动画的元素
    const animatedElements = chapter.querySelectorAll('.animate-on-scroll');
    
    animatedElements.forEach((element, index) => {
      // 标记为尚未动画
      element.setAttribute('data-animated', 'false');
      
      // 根据性能级别设置动画复杂度
      if (chapterState.performanceLevel === 'low') {
        element.classList.add('simple-animation');
      }
      
      // 设置初始隐藏状态
      if (!element.classList.contains('initially-hidden')) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        // 根据不同元素类型设置不同的过渡效果
        if (element.classList.contains('terminal-window')) {
          element.style.transition = 'opacity 1s ease, transform 1s ease';
        } else if (element.classList.contains('anomaly-container')) {
          element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        } else {
          element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        }
      }
      
      // 计算元素动画延迟
      const baseDelay = parseInt(element.getAttribute('data-delay')) || config.baseAnimationDelay;
      const calculatedDelay = baseDelay + (index * 50); // 级联延迟
      element.setAttribute('data-calculated-delay', calculatedDelay);
    });
    
    // 触发初始动画检查
    setTimeout(() => {
      checkElementVisibility(chapter);
    }, 100);
  }
  
  // 检查元素可见性并触发动画
  function checkElementVisibility(container) {
    const animatedElements = container.querySelectorAll('.animate-on-scroll[data-animated="false"]');
    
    animatedElements.forEach(element => {
      if (isElementInViewport(element)) {
        triggerAnimation(element);
      }
    });
  }
  
  // 检查元素是否在视口中
  function isElementInViewport(element, offset = 100) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight - offset) &&
      rect.bottom >= offset &&
      rect.left <= (window.innerWidth - offset) &&
      rect.right >= offset
    );
  }
  
  // 触发元素动画
  function triggerAnimation(element) {
    // 标记为已动画
    element.setAttribute('data-animated', 'true');
    
    // 获取计算后的延迟
    const delay = parseInt(element.getAttribute('data-calculated-delay')) || 0;
    
    // 延迟后启动动画
    setTimeout(() => {
      // 移除初始隐藏类（如果有）
      if (element.classList.contains('initially-hidden')) {
        element.classList.remove('initially-hidden');
      } else {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }
      
      // 获取并应用动画类
      const animationType = element.getAttribute('data-animation-type');
      if (animationType) {
        element.classList.add(animationType);
      }
      
      // 处理特定元素类型的动画
      if (element.classList.contains('terminal-progress')) {
        startTerminalProgress(element);
      } else if (element.classList.contains('anomaly-bar')) {
        animateAnomalyBar(element);
      } else if (element.classList.contains('typewriter')) {
        typeWriter(element);
      } else if (element.classList.contains('matrix-rain')) {
        initMatrixRain(element);
      }
      
      // 分发动画完成事件
      element.dispatchEvent(new CustomEvent('animation-triggered'));
    }, delay);
  }
  
  // 终端进度条动画
  function startTerminalProgress(element) {
    const progressBar = element.querySelector('.progress-bar');
    const progressEmpty = element.querySelector('.progress-empty');
    const progressPercent = element.querySelector('.progress-percent');
    const terminalComplete = element.closest('.terminal-body').querySelector('.terminal-complete');
    
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
    
    // 更快的动画速度取决于性能
    const speedFactor = chapterState.performanceLevel === 'low' ? 2 : 1;
    
    // 使用更可靠的动画方式
    const terminalInterval = setInterval(function() {
      if (progress < 78) {
        progress += (1 * speedFactor);
        updateProgress();
      } else if (progress === 78) {
        clearInterval(terminalInterval);
        
        setTimeout(function() {
          const slowInterval = setInterval(function() {
            if (progress < 100) {
              progress += (1 * speedFactor);
              updateProgress();
            } else {
              clearInterval(slowInterval);
              if (terminalComplete) {
                terminalComplete.classList.remove('hidden');
              }
            }
          }, 100 / speedFactor);
        }, 1000 / speedFactor);
      }
    }, 50 / speedFactor);
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
    
    // 调整动画速度基于性能
    const speedFactor = chapterState.performanceLevel === 'low' ? 2 : 1;
    
    const valueInterval = setInterval(function() {
      if (currentValue < value) {
        currentValue += (increment * speedFactor);
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
    }, 20 / speedFactor);
  }
  
  // 打字机效果
  function typeWriter(element) {
    const text = element.getAttribute('data-text') || element.textContent;
    const speed = parseInt(element.getAttribute('data-speed') || '50', 10);
    
    // 调整速度基于性能
    const adjustedSpeed = chapterState.performanceLevel === 'low' ? speed / 2 : speed;
    
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
    }, adjustedSpeed);
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
    
    // 根据性能调整复杂度
    let columns;
    if (chapterState.performanceLevel === 'low') {
      columns = Math.floor(canvas.width / 30); // 减少列数
    } else if (chapterState.performanceLevel === 'medium') {
      columns = Math.floor(canvas.width / 25);
    } else {
      columns = Math.floor(canvas.width / 20);
    }
    
    const drops = [];
    
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }
    
    function draw() {
      // 根据性能调整透明度
      let alphaValue;
      if (chapterState.performanceLevel === 'low') {
        alphaValue = 0.1; // 更高的透明度 = 更少的尾迹 = 更好的性能
      } else if (chapterState.performanceLevel === 'medium') {
        alphaValue = 0.07;
      } else {
        alphaValue = 0.05;
      }
      
      ctx.fillStyle = `rgba(0, 0, 0, ${alphaValue})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#00ff9d';
      ctx.font = '15px monospace';
      
      for (let i = 0; i < drops.length; i++) {
        const text = characters[Math.floor(Math.random() * characters.length)];
        ctx.fillText(text, i * (canvas.width / columns), drops[i] * 20);
        
        if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        
        drops[i]++;
      }
      
      // 低性能设备降低帧率
      if (chapterState.performanceLevel === 'low' && Math.random() > 0.5) {
        setTimeout(() => window.requestAnimationFrame(draw), 50);
      } else {
        window.requestAnimationFrame(draw);
      }
    }
    
    draw();
  }
  
  // 发送章节事件
  function dispatchChapterEvent(eventName, detail) {
    const event = new CustomEvent(eventName, { 
      detail: detail,
      bubbles: true
    });
    document.dispatchEvent(event);
  }
  
  // 初始化滚动观察器
  function initScrollObserver() {
    // 注册滚动事件监听器
    window.addEventListener('scroll', function() {
      // 遍历所有已加载的章节进行动画检查
      for (let i = 0; i < chapterState.loadedChapters; i++) {
        const chapter = document.getElementById(`chapter-${i}`);
        if (chapter) {
          checkElementVisibility(chapter);
        }
      }
    }, { passive: true });
  }
  
  // 初始化所有功能
  function init() {
    initializeChapters();
    initScrollObserver();
    
    // 发送初始化完成事件
    dispatchChapterEvent('xiChapterSystemReady', {
      totalChapters: chapterState.totalChapters
    });
  }
  
  // 启动系统
  init();
  
  // 暴露API供外部使用
  window.xiChapterSystem = {
    loadNextChapter,
    jumpToChapter: function(index) {
      // 确保所有之前的章节都已加载
      for (let i = 0; i <= index; i++) {
        if (i >= chapterState.loadedChapters && i < chapterState.totalChapters) {
          loadNextChapter(i - 1);
        }
      }
      
      // 滚动到目标章节
      setTimeout(() => {
        const targetChapter = document.getElementById(`chapter-${index}`);
        if (targetChapter && !targetChapter.classList.contains('hidden-chapter')) {
          targetChapter.scrollIntoView({
            behavior: config.smoothScroll ? 'smooth' : 'auto',
            block: 'start'
          });
        }
      }, 500);
    },
    refreshAnimations: function() {
      for (let i = 0; i < chapterState.loadedChapters; i++) {
        const chapter = document.getElementById(`chapter-${i}`);
        if (chapter) {
          checkElementVisibility(chapter);
        }
      }
    },
    getState: function() {
      return { ...chapterState };
    },
    updateConfig: function(newConfig) {
      Object.assign(config, newConfig);
    }
  };
});
