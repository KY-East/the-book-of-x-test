document.addEventListener('DOMContentLoaded', function() {
  // 中央符号动画增强
  const symbol = document.querySelector('.central-symbol');
  if (symbol) {
    setInterval(() => {
      symbol.style.textShadow = '0 0 30px rgba(255, 255, 255, 0.8)';
      setTimeout(() => {
        symbol.style.textShadow = '0 0 10px rgba(255, 255, 255, 0.3)';
      }, 200);
    }, 5000);
  }
  
  // 记忆碎片动画
  document.querySelectorAll('.memory-fragment').forEach(fragment => {
    fragment.style.opacity = 0;
  });
  
  setTimeout(() => {
    document.querySelectorAll('.memory-fragment').forEach((fragment, index) => {
      setTimeout(() => {
        fragment.style.opacity = 1;
        fragment.style.transform = 'translateY(0)';
      }, index * 1500 + 500);
    });
  }, 1000);
});