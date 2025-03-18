document.addEventListener('DOMContentLoaded', function() {
  // 倒计时随机变化效果
  function updateCountdown() {
    const timer = document.getElementById('countdown-timer');
    if (!timer) return;
    
    // 随机决定是否显示具体数字
    if (Math.random() < 0.3) {
      timer.textContent = "——:——:——";
    } else {
      // 生成随机时间
      const hours = Math.floor(Math.random() * 24).toString().padStart(2, '0');
      const minutes = Math.floor(Math.random() * 60).toString().padStart(2, '0');
      const seconds = Math.floor(Math.random() * 60).toString().padStart(2, '0');
      
      timer.textContent = `${hours}:${minutes}:${seconds}`;
    }
    
    // 随机决定下次更新的时间
    setTimeout(updateCountdown, Math.random() * 3000 + 1000);
  }
  
  // 启动倒计时
  updateCountdown();
});