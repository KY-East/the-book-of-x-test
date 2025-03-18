function choosePill(pill) {
  if(pill === 'red') {
    // 红色药丸选择后的代码
    console.log("Red pill chosen");
    document.querySelector('.choice-text').innerHTML = "你选择了看见真相。准备好面对现实的断层了吗？";
    
    // 添加延迟跳转到下一章节的代码
    setTimeout(function() {
      window.location.href = "/content/reality-fracture";
    }, 3000);
  } else {
    // 蓝色药丸选择后的代码
    console.log("Blue pill chosen");
    document.querySelector('.choice-text').innerHTML = "你选择了继续沉睡。但梦境会持续提醒你...";
    
    // 添加返回主页的代码
    setTimeout(function() {
      window.location.href = "/";
    }, 3000);
  }
}

// 初始化动画效果
document.addEventListener('DOMContentLoaded', function() {
  // 添加淡入效果
  const dreamTexts = document.querySelectorAll('.dream-text');
  dreamTexts.forEach((text, index) => {
    setTimeout(() => {
      text.classList.add('fade-in');
    }, index * 1000);
  });
  
  // 添加药丸点击事件
  const redPill = document.querySelector('.red-pill');
  const bluePill = document.querySelector('.blue-pill');
  
  if (redPill) {
    redPill.addEventListener('click', () => choosePill('red'));
  }
  
  if (bluePill) {
    bluePill.addEventListener('click', () => choosePill('blue'));
  }
});