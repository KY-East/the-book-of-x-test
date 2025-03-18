document.addEventListener('DOMContentLoaded', function() {
  // 涂黑文本交互
  const redactedTexts = document.querySelectorAll('.redacted-text');
  redactedTexts.forEach(text => {
    text.addEventListener('click', function() {
      this.style.backgroundColor = 'rgba(0, 255, 157, 0.1)';
      this.style.color = '#00ff9d';
      
      // 创建并显示真相文本
      const revealText = this.getAttribute('data-reveal');
      this.textContent = revealText;
    });
  });
  
  // 随机故障效果
  setInterval(function() {
    const elements = document.querySelectorAll('.quantum-code, .insight-title, .signature-symbol');
    const randomElement = elements[Math.floor(Math.random() * elements.length)];
    
    randomElement.style.animation = 'glitch 0.2s';
    
    setTimeout(function() {
      randomElement.style.animation = '';
    }, 200);
  }, 3000);
});