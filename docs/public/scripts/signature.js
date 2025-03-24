/**
 * signature.js - 签名功能
 * 为第一次接触协议页面提供数字签名功能
 */

(function() {
  document.addEventListener('DOMContentLoaded', function() {
    console.log("初始化签名功能...");

    // 获取DOM元素
    const signatureCanvas = document.getElementById('signatureCanvas');
    const signaturePlaceholder = document.querySelector('.signature-placeholder');
    const clearButton = document.getElementById('clearSignature');
    const confirmButton = document.getElementById('confirmSignature');
    const confirmationMessage = document.getElementById('confirmationMessage');
    const signatureSection = document.querySelector('.signature-section');

    // 验证元素是否存在
    if (!signatureCanvas || !clearButton || !confirmButton) {
      console.error('签名功能初始化失败: 无法找到必要的DOM元素');
      return;
    }

    // 获取canvas上下文
    const ctx = signatureCanvas.getContext('2d');
    
    // 状态变量
    let isDrawing = false;
    let hasSigned = false;
    let lastX = 0;
    let lastY = 0;

    // 设置画布大小和样式
    function resizeCanvas() {
      // 设置canvas的宽高为其容器的宽高
      signatureCanvas.width = signatureCanvas.offsetWidth;
      signatureCanvas.height = signatureCanvas.offsetHeight;
      
      // 设置线条样式
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#00ff9d'; // 克苏鲁风格的荧光绿
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      
      // 添加轻微的阴影效果
      ctx.shadowColor = '#00ff9d';
      ctx.shadowBlur = 2;
    }

    // 初始化时调整画布大小
    resizeCanvas();
    
    // 窗口大小改变时重新调整画布
    window.addEventListener('resize', resizeCanvas);

    // 开始绘制
    function startDrawing(e) {
      isDrawing = true;
      hasSigned = true;
      
      // 获取起始坐标
      const coords = getCoordinates(e);
      lastX = coords.x;
      lastY = coords.y;
      
      // 记录起始点
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(lastX, lastY);
      ctx.stroke();
      
      // 隐藏提示文字
      if (signaturePlaceholder) {
        signaturePlaceholder.style.display = 'none';
      }
      
      // 添加扭曲效果 - 克苏鲁风格
      addDistortionEffect();
    }

    // 绘制过程
    function draw(e) {
      if (!isDrawing) return;
      
      e.preventDefault(); // 防止触摸设备上的滚动
      
      // 获取当前坐标
      const coords = getCoordinates(e);
      
      // 绘制线条
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
      
      // 更新坐标
      lastX = coords.x;
      lastY = coords.y;
      
      // 随机添加轻微的颤抖效果 - 克苏鲁风格
      if (Math.random() > 0.92) {
        addTrembleEffect(coords.x, coords.y);
      }
    }

    // 获取坐标 (支持鼠标和触摸事件)
    function getCoordinates(e) {
      const rect = signatureCanvas.getBoundingClientRect();
      
      if (e.type.includes('touch')) {
        return {
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top
        };
      } else {
        return {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        };
      }
    }

    // 停止绘制
    function stopDrawing() {
      isDrawing = false;
      ctx.beginPath(); // 重置路径
    }

    // 清除签名
    function clearSignature() {
      ctx.clearRect(0, 0, signatureCanvas.width, signatureCanvas.height);
      hasSigned = false;
      
      if (signaturePlaceholder) {
        signaturePlaceholder.style.display = 'block';
      }
    }

    // 确认签名
    function confirmSignature() {
      if (!hasSigned) {
        alert('请先在框内签名以确认您的选择');
        return;
      }
      
      // 隐藏签名区，显示确认信息
      if (confirmationMessage) {
        signatureSection.style.display = 'none';
        confirmationMessage.style.display = 'block';
        
        // 添加出现动画
        setTimeout(function() {
          confirmationMessage.classList.add('show');
          
          // 添加克苏鲁风格的视觉干扰效果
          addPageDistortionEffect();
        }, 100);
      }
    }
    
    // 添加扭曲效果 - 克苏鲁风格
    function addDistortionEffect() {
      const glitchElements = document.querySelectorAll('.page-title, .protocol-title, .xi-symbol');
      
      glitchElements.forEach(element => {
        element.classList.add('glitch-effect');
        
        setTimeout(() => {
          element.classList.remove('glitch-effect');
        }, 1000);
      });
    }
    
    // 添加颤抖效果 - 更克苏鲁
    function addTrembleEffect(x, y) {
      // 绘制小的不规则形状
      ctx.save();
      
      // 随机颜色
      const colors = ['#00ff9d', '#1affff', '#0c1b38'];
      ctx.strokeStyle = colors[Math.floor(Math.random() * colors.length)];
      
      // 绘制小的符文或图形
      ctx.beginPath();
      const size = Math.random() * 4 + 1;
      const angle = Math.random() * Math.PI * 2;
      
      ctx.moveTo(x, y);
      ctx.lineTo(
        x + Math.cos(angle) * size,
        y + Math.sin(angle) * size
      );
      ctx.stroke();
      
      ctx.restore();
    }
    
    // 签名确认后的页面扭曲效果
    function addPageDistortionEffect() {
      // 添加全屏闪烁效果
      const glitchOverlay = document.createElement('div');
      glitchOverlay.className = 'glitch-overlay';
      document.body.appendChild(glitchOverlay);
      
      // 定时随机闪烁
      let glitchCount = 0;
      const maxGlitches = 5;
      
      const glitchInterval = setInterval(() => {
        glitchOverlay.style.opacity = Math.random() * 0.15;
        
        if (++glitchCount >= maxGlitches) {
          clearInterval(glitchInterval);
          
          // 最后淡出
          setTimeout(() => {
            glitchOverlay.style.transition = 'opacity 1s ease-out';
            glitchOverlay.style.opacity = '0';
            
            // 移除元素
            setTimeout(() => {
              document.body.removeChild(glitchOverlay);
            }, 1000);
          }, 500);
        }
      }, 200);
    }

    // 绑定事件监听
    // 鼠标事件
    signatureCanvas.addEventListener('mousedown', startDrawing);
    signatureCanvas.addEventListener('mousemove', draw);
    document.addEventListener('mouseup', stopDrawing);
    
    // 触摸事件
    signatureCanvas.addEventListener('touchstart', startDrawing, { passive: false });
    signatureCanvas.addEventListener('touchmove', draw, { passive: false });
    document.addEventListener('touchend', stopDrawing);
    
    // 按钮事件
    clearButton.addEventListener('click', clearSignature);
    confirmButton.addEventListener('click', confirmSignature);

    console.log("签名功能初始化完成");
  });
})(); 