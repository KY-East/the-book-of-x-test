document.addEventListener('DOMContentLoaded', function() {
  // 添加鼠标悬停效果到隐藏消息
  const hiddenMessage = document.getElementById('hidden-text');
  if (hiddenMessage) {
    hiddenMessage.addEventListener('mouseover', function() {
      this.style.color = '#ff3366';
    });
    hiddenMessage.addEventListener('mouseout', function() {
      this.style.color = '#333';
    });
  }

  // 随机化扫描结果
  setTimeout(function() {
    const scanResult = document.getElementById('scan-result');
    if (scanResult) {
      const randomMatch = Math.random() * 100;
      if (randomMatch > 95) {
        scanResult.textContent = "匹配度: 99.7% - 警告! 非人类模式检测";
        scanResult.style.color = '#ff3366';
      } else {
        scanResult.textContent = `匹配度: ${randomMatch.toFixed(1)}% - 人类范围内`;
        scanResult.style.color = '#00ff9d';
      }
    }
  }, 3000);

  // 添加页面扰动效果
  document.body.addEventListener('mousemove', function(e) {
    const distortedText = document.querySelectorAll('.distorted-text');
    distortedText.forEach(function(el) {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      el.style.transform = `skew(${x}deg, ${y}deg)`;
    });
  });

  // 添加随机闪烁效果
  setInterval(function() {
    if (Math.random() > 0.95) {
      document.body.style.backgroundColor = '#100505';
      setTimeout(function() {
        document.body.style.backgroundColor = '#0a0a0c';
      }, 50);
    }
  }, 5000);
});