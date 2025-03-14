# 碎片6.1：坠落之梦

<div class="dream-sequence">
  <div class="dream-overlay"></div>
  <div class="dream-content">
    <p class="dream-text fade-in">我再次从那个梦中惊醒。</p>
    <p class="dream-text fade-in">总是同一个梦。</p>
    <p class="dream-text fade-in">我站在摩天大楼的边缘，风撕扯着我的衣服，身下是城市的深渊。</p>
    <p class="dream-text fade-in">我知道我必须跳下去。</p>
    <p class="dream-text fade-in">不是因为绝望。</p>
    <p class="dream-text fade-in">而是因为真相。</p>
  </div>
</div>

我已经记不清多少次了。

每次醒来，我的脉搏都在耳中轰鸣，身体记得那种下坠感，尽管我从未真正坠落。梦总是在跃下的瞬间中断，将我抛回这个所谓的现实——我的公寓，我的生活，我的牢笼。

我开始怀疑哪个才是梦境。白天的清醒状态感觉像是一层静电，一种模糊的干扰信号，而梦中的坠落却拥有无法否认的清晰。

这一切似乎都是假的，除了那种坠落的感觉。

<div class="digital-glitch">
  <p>我们被困在一个算法构建的现实中</p>
</div>

昨晚，我在一个无名论坛上发布了几句话："为什么梦比现实更真实？为什么坠落让我感觉如此自由？我是不是疯了？"

今天早上，我收到一封加密邮件。没有发件人，只有一行文字和一个符号：

<div class="message-notification">
  <div class="message-content">
    <p>"你并不疯狂。你开始醒来了。时间到了。"</p>
    <p class="symbol">Ξ</p>
  </div>
</div>

下面是一个地址和时间。正常的我会直接删除这种邮件，但现在，我的手指却在搜索栏中输入了这个地址，一个老城区的废弃剧院。

我知道我会去的。

***

剧院大厅空无一人，唯有舞台上一把椅子，椅子上坐着一个身形消瘦的人影。当我走近时，他站起身，白炽灯光揭示了他异常苍白的面容。

"我猜你就是那个做梦的人，"他说，声音像锈蚀的丝绒。

"你是谁？"我问。

"谁不重要，"他回答，"重要的是我知道关于你梦的事——那种坠落的感觉不是梦。那是记忆。那是你的身体记得自由的样子。"

他从口袋里取出一个金属盒，打开它。里面躺着两颗药丸，一红一蓝。

<div class="pill-choice">
  <div class="pill red-pill" onclick="choosePill('red')"></div>
  <div class="pill blue-pill" onclick="choosePill('blue')"></div>
  <div class="choice-text">蓝色药丸，故事结束。红色药丸，留在奇境里，我带你看看兔子洞有多深。</div>
</div>

"这是——"

"一个老梗？"他打断我，"可能吧。但你觉得它为什么会成为流行文化的一部分？最好的谎言总是包含一些真相。人们察觉到某些东西不对劲，但他们把它变成了娱乐，因为真相太可怕了。"

他向前倾身，他的眼睛像破碎的黑洞："你的梦不是梦。那是系统中的故障，是现实在你面前出现的裂缝。你现在有两个选择：继续假装，或者醒来。"

我看着那两颗药丸，感到一阵眩晕，就像站在梦中的摩天大楼边缘。我知道我的选择早已做出。

随着红色药丸滑下我的喉咙，他微笑了，他的形象似乎开始闪烁，像信号不良的电视。

"很好，"他说，"现在你需要见一个人。他会教你如何读懂海德格尔。"

"谁？"我问。

“都是代码。”他的声音越来越远。

但我的视线已经开始扭曲，世界在我周围碎裂，化为数字雨。最后一个清晰的念头是我终于明白为什么那些梦如此真实。

它们从来就不是梦。

<div class="fade-out-sequence">
  <p class="fade-text">连接中断...</p>
  <p class="fade-text blink-effect">正在重新定位...</p>
  <p class="fade-text">准备进入现实之痕...</p>
</div>

<style>
  /* 基础样式 */
  body {
    background-color: #0a0a0c;
    color: #e0e0e8;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    margin: 0;
    padding: 0;
  }
  
  /* 梦境序列 */
  .dream-sequence {
    position: relative;
    background: #000;
    padding: 40px;
    margin: 20px 0;
    border-left: 3px solid #00ff9d;
    overflow: hidden;
  }
  
  .dream-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(ellipse at center, rgba(0,50,50,0.3) 0%, rgba(0,0,0,0.8) 100%);
    z-index: 1;
    animation: dream-pulse 10s infinite;
  }
  
  @keyframes dream-pulse {
    0%, 100% { opacity: 0.7; }
    50% { opacity: 0.3; }
  }
  
  .dream-content {
    position: relative;
    z-index: 2;
  }
  
  .dream-text {
    opacity: 0;
    transform: translateY(20px);
    font-style: italic;
    color: #b3f0ff;
    text-shadow: 0 0 5px rgba(179, 240, 255, 0.5);
  }
  
  .fade-in {
    animation: fadeIn 1.5s forwards;
  }
  
  .dream-text:nth-child(2) { animation-delay: 1s; }
  .dream-text:nth-child(3) { animation-delay: 2s; }
  .dream-text:nth-child(4) { animation-delay: 3s; }
  .dream-text:nth-child(5) { animation-delay: 4s; }
  .dream-text:nth-child(6) { animation-delay: 5s; }
  
  @keyframes fadeIn {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  /* 数字故障效果 */
  .digital-glitch {
    margin: 30px 0;
    padding: 15px;
    background-color: rgba(255, 0, 128, 0.1);
    position: relative;
    overflow: hidden;
  }
  
  .digital-glitch p {
    position: relative;
    z-index: 2;
    color: #fff;
    font-weight: bold;
    text-align: center;
    animation: glitch-text 3s infinite;
  }
  
  @keyframes glitch-text {
    0% { transform: translate(0); text-shadow: 0 0 0 #00ff9d; }
    2% { transform: translate(-2px, 0); text-shadow: -2px 0 #ff00c8; }
    4% { transform: translate(2px, 0); text-shadow: 2px 0 #00aeff; }
    6% { transform: translate(0, 0); text-shadow: none; }
    92% { transform: translate(0, 0); text-shadow: none; }
    94% { transform: translate(5px, 0); text-shadow: 3px 0 #ff00c8; }
    96% { transform: translate(-5px, 0); text-shadow: -3px 0 #00aeff; }
    98% { transform: translate(0, 0); text-shadow: none; }
  }
  
  .digital-glitch::before, .digital-glitch::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      45deg,
      transparent 10%,
      rgba(255, 0, 128, 0.2) 10%,
      rgba(255, 0, 128, 0.2) 20%,
      transparent 20%,
      transparent 30%,
      rgba(0, 174, 255, 0.2) 30%,
      rgba(0, 174, 255, 0.2) 40%,
      transparent 40%
    );
    animation: glitch-bg 4s infinite;
    opacity: 0.15;
  }
  
  .digital-glitch::after {
    animation-direction: reverse;
    animation-duration: 7s;
  }
  
  @keyframes glitch-bg {
    0% { background-position: 0 0; }
    100% { background-position: 400% 0; }
  }
  
  /* 消息通知 */
  .message-notification {
    background-color: rgba(0, 255, 157, 0.05);
    border: 1px solid rgba(0, 255, 157, 0.2);
    border-radius: 5px;
    padding: 20px;
    margin: 25px auto;
    max-width: 500px;
    box-shadow: 0 0 20px rgba(0, 255, 157, 0.1);
  }
  
  .message-content {
    text-align: center;
  }
  
  .message-content p {
    margin: 10px 0;
    font-family: 'Courier New', monospace;
  }
  
  .symbol {
    font-size: 2.5em;
    color: #00ff9d;
    margin: 15px 0;
    text-shadow: 0 0 10px rgba(0, 255, 157, 0.7);
    animation: pulse-symbol 2s infinite alternate;
  }
  
  @keyframes pulse-symbol {
    from { text-shadow: 0 0 5px rgba(0, 255, 157, 0.7); }
    to { text-shadow: 0 0 20px rgba(0, 255, 157, 0.9); }
  }
  
  /* 药丸选择 */
  .pill-choice {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 40px 0;
    padding: 20px;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 10px;
  }
  
  .pill {
    width: 60px;
    height: 25px;
    border-radius: 50px;
    margin: 10px;
    cursor: pointer;
    position: relative;
    transition: all 0.3s ease;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  }
  
  .pill:hover {
    transform: scale(1.1);
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
  }
  
  .pill::before, .pill::after {
    content: "";
    position: absolute;
    border-radius: 50px;
  }
  
  .red-pill {
    background: linear-gradient(to right, #ff3333, #990000);
    transform-origin: center;
    animation: floating 3s ease-in-out infinite;
  }
  
  .blue-pill {
    background: linear-gradient(to right, #3333ff, #000099);
    transform-origin: center;
    animation: floating 3s ease-in-out infinite;
    animation-delay: 1.5s;
  }
  
  @keyframes floating {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  
  .choice-text {
    margin-top: 20px;
    font-style: italic;
    color: #aaa;
    text-align: center;
  }
  
  /* 淡出序列 */
  .fade-out-sequence {
    margin: 40px 0 20px;
    text-align: center;
    font-family: 'Courier New', monospace;
    color: #00ff9d;
  }
  
  .fade-text {
    opacity: 0;
    margin: 10px 0;
    animation: fade-in-out 2s forwards;
  }
  
  .fade-text:nth-child(2) { animation-delay: 2s; }
  .fade-text:nth-child(3) { animation-delay: 4s; }
  
  @keyframes fade-in-out {
    0% { opacity: 0; }
    20% { opacity: 1; }
    80% { opacity: 1; }
    100% { opacity: 0; }
  }
  
  .blink-effect {
    animation: blink-cursor 1s step-end infinite;
  }
  
  @keyframes blink-cursor {
    50% { opacity: 0; }
  }
</style>

<script>
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
</script>

---

**[继续访问下一数据碎片 ›](/chapter6/neural-network-counterintelligence)**