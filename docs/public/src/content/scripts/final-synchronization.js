document.addEventListener('DOMContentLoaded', function() {
  // 星座闪烁效果
  const constellationLayer = document.querySelector('.constellation-layer');
  if (constellationLayer) {
    setInterval(() => {
      const brightenStar = document.createElement('div');
      brightenStar.style.position = 'absolute';
      brightenStar.style.width = '2px';
      brightenStar.style.height = '2px';
      brightenStar.style.backgroundColor = '#fff';
      brightenStar.style.borderRadius = '50%';
      brightenStar.style.boxShadow = '0 0 10px rgba(255, 255, 255, 0.8)';
      
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      brightenStar.style.left = `${left}%`;
      brightenStar.style.top = `${top}%`;
      
      constellationLayer.appendChild(brightenStar);
      
      setTimeout(() => {
        brightenStar.remove();
      }, 500);
    }, 1000);
  }
  
  // 时间线项目交互
  const timelineItems = document.querySelectorAll('.timeline-item');
  timelineItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
      this.style.boxShadow = `0 0 15px ${this.classList.contains('destruction') ? 'rgba(255, 51, 102, 0.5)' : this.classList.contains('awakening') ? 'rgba(189, 0, 255, 0.5)' : 'rgba(0, 255, 157, 0.5)'}`;
    });
    
    item.addEventListener('mouseleave', function() {
      this.style.boxShadow = '';
    });
  });
  
  // 记忆粒子随机移动
  const memoryParticle = document.querySelector('.memory-particle');
  if (memoryParticle) {
    setInterval(() => {
      const size = 5 + Math.random() * 10;
      memoryParticle.style.width = `${size}px`;
      memoryParticle.style.height = `${size}px`;
      memoryParticle.style.opacity = 0.3 + Math.random() * 0.7;
    }, 2000);
  }
});