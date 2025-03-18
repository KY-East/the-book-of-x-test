function choosePill(pill) {
  if(pill === 'red') {
    // 可以添加红色药丸选择后的代码
    console.log("Red pill chosen");
    document.querySelector('.choice-text').innerHTML = "你选择了看见真相。准备好面对现实的断层了吗？";
    
    // 添加延迟跳转到下一章节的代码
    setTimeout(function() {
      window.location.href = "chapter6/reality-fracture";
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