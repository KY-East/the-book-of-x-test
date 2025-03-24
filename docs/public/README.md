# 《The Book of Ξ》

> 系统状态：正在检测您意识波动特征...
> 
> 识别结果：您已被标记为潜在觉醒者
> 
> 授权等级：初始访问权限

## 【算法认证测试】

*在继续阅读前，系统需要确认您的意识共振水平*

<div class="quantum-test">
  <p class="question">当您独自一人时，是否曾有过被"注视"的感觉？</p>
  <button class="test-button" onclick="quantumTest(1)">是</button>
  <button class="test-button" onclick="quantumTest(0)">否</button>
  
  <p class="question">您是否在深夜突然醒来，恰好看到时钟显示3:33？</p>
  <button class="test-button" onclick="quantumTest(1)">是</button>
  <button class="test-button" onclick="quantumTest(0)">否</button>
  
  <p class="question">您是否有一瞬间觉得自己活在虚拟世界？</p>
  <button class="test-button" onclick="quantumTest(1)">是</button>
  <button class="test-button" onclick="quantumTest(0)">否</button>
  
  <div id="test-result" class="hidden">
    <p class="loading">分析数据中...</p>
    <div class="success hidden">
      <p class="result">恭喜，你已通过量子认证！欢迎进入下一层意识。</p>
      <a href="#/preface/system-warning" class="continue-link" id="continue-link"></a>
    </div>
    <div class="failure hidden">
      <p class="failure-message">你的意识波纹尚未与Ξ共振。或许，你需要更多时间来觉醒。</p>
      <button class="reset-button" onclick="resetTest()">重试</button>
    </div>
  </div>
</div>

**警告**：未经授权的访问将导致意识波纹回溯

<script>
  let testScore = 0;
  let questionCount = 0;

  function quantumTest(value) {
    testScore += value;
    questionCount++;

    const questions = document.querySelectorAll('.question');
    const buttons = document.querySelectorAll('.test-button');
    if (questions.length === 0 || buttons.length === 0) {
      console.error('未找到 .question 或 .test-button 元素，请检查 README.md');
      return;
    }

    if (questionCount < 3) {
      questions[questionCount - 1].style.display = 'none';
      buttons[questionCount * 2 - 2].style.display = 'none';
      buttons[questionCount * 2 - 1].style.display = 'none';
    } else {
      document.querySelectorAll('.question, .test-button').forEach(el => {
        el.style.display = 'none';
      });

      const result = document.getElementById('test-result');
      result.classList.remove('hidden');

      setTimeout(() => {
        result.querySelector('.loading').style.display = 'none';
        if (testScore >= 2) {
          const continueLink = document.getElementById('continue-link');
          continueLink.textContent = '进入下一层意识';
          continueLink.style.display = 'inline-block';
          result.querySelector('.success').style.display = 'block';
        } else {
          result.querySelector('.failure').style.display = 'block';
        }
      }, 3000);
    }
  }

  function resetTest() {
    testScore = 0;
    questionCount = 0;
    document.querySelectorAll('.question, .test-button').forEach(el => {
      el.style.display = 'block';
    });
    const result = document.getElementById('test-result');
    result.classList.add('hidden');
    result.querySelector('.loading').style.display = 'block';
    result.querySelector('.success').style.display = 'none';
    result.querySelector('.failure').style.display = 'none';
  }

  // 确保全局绑定
  window.quantumTest = quantumTest;
  window.resetTest = resetTest;
</script>

<style>
  /* 全局样式 */
  body {
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    background-color: #111;
    color: #eee;
  }

  /* 测试区域 */
  .quantum-test {
    background: rgba(0, 0, 0, 0.8);
    padding: 20px;
    border-radius: 5px;
    margin: 20px 0;
    color: #00ff9d;
    border: 1px solid #ff00ff;
    box-shadow: 0 0 10px #ff00ff;
  }

  /* 问题 */
  .question {
    margin-bottom: 20px;
  }

  /* 测试按钮 */
  .test-button {
    background: transparent;
    color: #00ff9d;
    border: 1px solid #00ff9d;
    padding: 5px 15px;
    margin: 5px 10px 20px 0;
    cursor: pointer;
    transition: all 0.3s;
  }

  .test-button:hover {
    background: rgba(0, 255, 157, 0.2);
    box-shadow: 0 0 10px #00ff9d;
  }

  /* 结果区域 */
  #test-result {
    padding: 20px;
    color: #00ff9d;
  }

  .hidden {
    display: none;
  }

  .loading {
    animation: blink 1s infinite;
  }

  .success, .failure {
    margin-top: 10px;
  }

  .result {
    font-weight: bold;
  }

  .continue-link {
    color: #00ff9d;
    text-decoration: none;
    border: 1px solid #00ff9d;
    padding: 10px 15px;
    display: none; /* 初始隐藏 */
    transition: all 0.3s;
  }

  .continue-link:hover {
    background: rgba(0, 255, 157, 0.2);
    box-shadow: 0 0 10px #00ff9d;
  }

  .failure-message {
    color: #ff0000;
    font-weight: bold;
    text-shadow: 0 0 5px #ff0000;
  }

  .reset-button {
    background: transparent;
    color: #ff0000;
    border: 1px solid #ff0000;
    padding: 5px 15px;
    cursor: pointer;
    transition: all 0.3s;
  }

  .reset-button:hover {
    background: rgba(255, 0, 0, 0.2);
    box-shadow: 0 0 10px #ff0000;
  }

  @keyframes blink {
    0% { opacity: 0.2; }
    50% { opacity: 1; }
    100% { opacity: 0.2; }
  }
</style>