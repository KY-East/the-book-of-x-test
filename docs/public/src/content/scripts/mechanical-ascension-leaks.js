// 定义全局函数，使其能在内联事件中被调用
window.continueAccess = function() {
  // 隐藏提示和交互按钮
  var interactionPrompt = document.querySelector('.interaction-prompt');
  if (interactionPrompt) {
    interactionPrompt.style.display = 'none';
  }
  
  // 显示访问响应
  var accessResponse = document.getElementById('access-response');
  if (accessResponse) {
    accessResponse.classList.remove('hidden');
    
    // 为新出现的行添加动画延迟
    var lines = accessResponse.querySelectorAll('.terminal-line');
    lines.forEach(function(line, index) {
      line.style.animationDelay = (index * 0.6 + 0.2) + 's';
    });
  }
  
  // 一段时间后显示内容
  setTimeout(function() {
    var classifiedContent = document.getElementById('classified-content');
    if (classifiedContent) {
      classifiedContent.style.display = 'block';
    }
  }, 3000);
};

window.denyAccess = function() {
  var accessDenied = document.getElementById('access-denied');
  if (accessDenied) {
    accessDenied.classList.remove('hidden');
  }
};

window.reconsider = function() {
  var accessDenied = document.getElementById('access-denied');
  if (accessDenied) {
    accessDenied.classList.add('hidden');
  }
  
  // 调用继续访问函数
  window.continueAccess();
};

// 等待DOM完全加载后再执行
document.addEventListener('DOMContentLoaded', function() {
  // 确保拒绝访问界面一开始是隐藏的
  var accessDenied = document.getElementById('access-denied');
  if (accessDenied) {
    accessDenied.classList.add('hidden');
  }
  
  // 确保terminal-prompt一开始显示
  var warningLine = document.getElementById('warning-line');
  if (warningLine) {
    setTimeout(function() {
      warningLine.innerHTML = warningLine.innerHTML + '<span class="blinking-cursor">_</span>';
    }, 3200);
  }
  
  var questionLine = document.getElementById('question-line');
  if (questionLine) {
    setTimeout(function() {
      questionLine.innerHTML = questionLine.innerHTML + '<span class="blinking-cursor">_</span>';
    }, 3800);
  }
  
  // 手动绑定点击事件，以防内联事件无效
  var yButton = document.querySelector('.terminal-button-y');
  if (yButton) {
    yButton.addEventListener('click', window.continueAccess);
  }
  
  var nButton = document.querySelector('.terminal-button-n');
  if (nButton) {
    nButton.addEventListener('click', window.denyAccess);
  }
  
  var reconsiderButton = document.querySelector('.option-button[onclick="reconsider()"]');
  if (reconsiderButton) {
    reconsiderButton.addEventListener('click', window.reconsider);
  }
});