document.addEventListener('DOMContentLoaded', function() {
  // 添加扫描线效果
  const scanlineEffect = function() {
    const scanline = document.querySelector('.interface-scanline');
    if (scanline) {
      scanline.style.top = '0';
      setTimeout(() => {
        scanline.style.transition = 'top 4s linear';
        scanline.style.top = '100%';
      }, 100);
    }
  };
  
  // 每4秒刷新一次扫描线效果
  setInterval(scanlineEffect, 4000);
  
  // 初始调用一次
  scanlineEffect();
  
  // 添加数据节点悬停效果
  const dataNodes = document.querySelectorAll('.data-node');
  dataNodes.forEach(node => {
    node.addEventListener('mouseenter', function() {
      // 播放轻微的电子声音效果（此处仅占位，实际实现需要音频文件）
      // const sound = new Audio('data-access.mp3');
      // sound.volume = 0.2;
      // sound.play();
    });
  });
});