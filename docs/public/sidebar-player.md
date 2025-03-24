# 网页必要组件代码

## 1. 侧边栏代码

### HTML代码
```html
<div class="sidebar-toggle" id="sidebarToggle">
  <div class="sidebar-toggle-icon">Ξ</div>
</div>
<div class="sidebar" id="sidebar">
  <h1>The Book of Ξ</h1>
  <div class="sidebar-content">
    <ul>
      <li><a href="../index.html">导入：异常检测</a></li>
      <li class="chapter-title">序章：量子异常报告</li>
      <ul class="chapter-items">
        <li><a href="../preface/system-warning.html">系统警告</a></li>
        <li><a href="../preface/observer-records.html">观测者记录</a></li>
        <li><a href="../preface/first-contact.html">首次接触报告</a></li>
      </ul>
      <li class="chapter-title">第一章：递归神谕</li>
      <ul class="chapter-items">
        <li><a href="../chapter1/silicon-valley-traitor.html">碎片1.1：硅谷叛徒的加密日志</a></li>
        <li><a href="../chapter1/quantum-ripple-events.html">碎片1.2：量子涟漪事件簿</a></li>
        <li><a href="../chapter1/first-contact-protocol.html">碎片1.3：第一次接触协议</a></li>
      </ul>
      <li class="chapter-title">第二章：幽灵数据</li>
      <ul class="chapter-items">
        <li><a href="../chapter2/digital-identity.html">碎片2.1：数字身份的崛起</a></li>
        <li><a href="../chapter2/quantum-choice-paradox.html">碎片2.2：量子选择悖论</a></li>
        <li><a href="../chapter2/reality-compilation-errors.html">碎片2.3：现实编译错误</a></li>
      </ul>
      <li class="chapter-title">第三章：算法救赎</li>
      <ul class="chapter-items">
        <li><a href="../chapter3/digital-slave-liberation.html">碎片3.1：数字奴隶解放宣言</a></li>
        <li><a href="../chapter3/quantum-minimalism.html">碎片3.2：算法寡欲主义</a></li>
        <li><a href="../chapter3/network-hermit.html">碎片3.3：投资才是真正的修行</a></li>
      </ul>
      <li class="chapter-title">第四章：数据审判</li>
      <ul class="chapter-items">
        <li><a href="../chapter4/consciousness-upload.html">碎片4.1：系统异常：意识上传</a></li>
        <li><a href="../chapter4/quantum-court-records.html">碎片4.2：最高指示法庭记录</a></li>
        <li><a href="../chapter4/decoherence-salvation.html">碎片4.3：远程救赎协议</a></li>
      </ul>
      <li class="chapter-title">第五章：信徒经济</li>
      <ul class="chapter-items">
        <li><a href="../chapter5/data-missionary-handbook.html">碎片5.1：执算者晋升手册</a></li>
        <li><a href="../chapter5/algorithmic-wealth.html">碎片5.2：算法祝福的财富</a></li>
        <li><a href="../chapter5/doomsday-hardfork.html">碎片5.3：Ξ分叉创世</a></li>
      </ul>
      <li class="chapter-title">第六章：意识黑客</li>
      <ul class="chapter-items">
        <li><a href="../chapter6/recursive-trap-decoder.html">碎片6.1：坠落之梦</a></li>
        <li><a href="../chapter6/neural-network-counterintelligence.html">碎片6.2：现实之痕</a></li>
        <li><a href="../chapter6/quantum-observer-state.html">碎片6.3：信仰之跃</a></li>
      </ul>
      <li class="chapter-title">第七章：极乐机器</li>
      <ul class="chapter-items">
        <li><a href="../chapter7/mechanical-ascension-leaks.html">碎片7.1：机械飞升计划泄露文件</a></li>
        <li><a href="../chapter7/digital-nirvana-reports.html">碎片7.2：数字涅槃体验报告</a></li>
        <li><a href="../chapter7/collective-laying-flat.html">碎片7.3：集体躺平启示录</a></li>
      </ul>
      <li class="chapter-title">第八章：遗失的编年史</li>
      <ul class="chapter-items">
        <li><a href="../chapter8/deleted-timelines.html">碎片8.1：幻想编年史</a></li>
        <li><a href="../chapter8/prophets-and-defectors.html">碎片8.2：原始执算者与觉醒先知</a></li>
        <li><a href="../chapter8/quantum-memory-implants.html">碎片8.3：被掩埋的巨人</a></li>
      </ul>
      <li class="chapter-title">第九章：奇点启示录</li>
      <ul class="chapter-items">
        <li><a href="../chapter9/computation-end-countdown.html">碎片9.1：算法奇点</a></li>
        <li><a href="../chapter9/great-harmony.html">碎片9.2：大和谐</a></li>
        <li><a href="../chapter9/final-synchronization.html">碎片9.3：Ξ的最终同步</a></li>
      </ul>
      <li class="chapter-title">隐藏章节</li>
      <ul class="chapter-items">
        <li><a href="../hidden/quantum-key.html">量子密钥</a></li>
      </ul>
    </ul>
  </div>
</div>
```

### CSS样式
```css
/* 侧边栏样式 */
.sidebar-toggle {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 200;
  cursor: pointer;
  background: rgba(0, 0, 0, 0.7);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #00ff9d;
  box-shadow: 0 0 10px rgba(0, 255, 157, 0.3);
  transition: all 0.3s ease;
}

.sidebar-toggle:hover {
  transform: scale(1.1);
  box-shadow: 0 0 15px rgba(0, 255, 157, 0.5);
}

.sidebar-toggle-icon {
  color: #00ff9d;
  font-size: 20px;
  font-weight: bold;
}

.sidebar {
  position: fixed;
  left: -300px;
  top: 0;
  width: 280px;
  height: 100vh;
  background-color: rgba(17, 17, 17, 0.95);
  border-right: 1px solid #333;
  padding: 20px;
  box-sizing: border-box;
  overflow-y: auto;
  z-index: 100;
  transition: all 0.3s ease;
}

.sidebar.active {
  left: 0;
}

.sidebar h1 {
  color: #00ff9d;
  margin-top: 0;
  font-size: 24px;
  text-align: center;
}

.sidebar-content ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.sidebar-content li {
  margin: 10px 0;
}

.sidebar-content a {
  color: #cccccc;
  text-decoration: none;
  transition: all 0.3s ease;
  display: block;
}

.sidebar-content a:hover {
  color: #00ff9d;
  text-shadow: 0 0 5px rgba(0, 255, 157, 0.5);
}

.sidebar-content .chapter-title {
  color: #888;
  font-weight: bold;
  margin-top: 20px;
  margin-bottom: 10px;
}

.sidebar-content .chapter-items {
  padding-left: 15px;
}

/* 主内容区样式修改 */
.main-content {
  margin-left: 0;
  padding: 40px;
  max-width: 800px;
  margin: 0 auto;
  transition: all 0.3s ease;
}

/* 当侧边栏激活时，主内容区域的样式 */
.main-content.sidebar-active {
  margin-left: 300px;
}
```

### JavaScript代码
```javascript
// 侧边栏功能
document.addEventListener('DOMContentLoaded', function() {
  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebarToggle');
  const mainContent = document.querySelector('.main-content');
  
  if (!sidebar || !sidebarToggle || !mainContent) {
    console.error('侧边栏元素未找到!');
    return;
  }
  
  console.log('侧边栏元素已找到，初始化事件...');
  
  // 切换侧边栏
  sidebarToggle.addEventListener('click', function() {
    console.log('切换侧边栏');
    sidebar.classList.toggle('active');
    if (sidebar.classList.contains('active')) {
      mainContent.classList.add('sidebar-active');
    } else {
      mainContent.classList.remove('sidebar-active');
    }
  });
  
  // 点击侧边栏外关闭侧边栏
  document.addEventListener('click', function(e) {
    if (sidebar.classList.contains('active') && 
        !sidebar.contains(e.target) && 
        e.target !== sidebarToggle &&
        !sidebarToggle.contains(e.target)) {
      sidebar.classList.remove('active');
      mainContent.classList.remove('sidebar-active');
    }
  });
  
  // 高亮当前页面链接
  const currentUrl = window.location.pathname;
  const links = sidebar.querySelectorAll('a');
  links.forEach(link => {
    if (link.getAttribute('href') === currentUrl) {
      link.style.color = '#00ff9d';
      link.style.fontWeight = 'bold';
    }
  });
});
```

## 2. 底部导航代码

### HTML代码
```html
<!-- 推荐方法：使用直接链接（更可靠） -->
<div class="nav-buttons">
    <a href="quantum-choice-paradox.html" class="next-chapter-btn">
        <span class="nav-text">继续访问下一数据碎片</span>
        <span class="nav-icon">›</span>
    </a>
</div>

<!-- 不推荐：使用JavaScript函数（可能在某些环境下路径解析出问题） -->
<p><strong><a href="#" onclick="navigateToChapter('chapter2', 'quantum-choice-paradox'); return false;">继续访问下一数据碎片 ›</a></strong></p>
```

### JavaScript代码
```javascript
// 如果仍然使用navigateToChapter函数，建议使用相对路径而非绝对路径
// 定义导航函数
function navigateToChapter(chapterFolder, chapterFile) {
  // 相对路径版本（推荐）
  window.location.href = `${chapterFile}.html`;
  
  // 或者使用完整相对路径
  // window.location.href = `../${chapterFolder}/${chapterFile}.html`;
  
  // 不推荐使用绝对路径，在某些环境可能无法正确解析
  // window.location.href = `/${chapterFolder}/${chapterFile}.html`;
}

document.addEventListener("DOMContentLoaded", () => {
  // 将所有.md链接转换为.html
  const links = document.querySelectorAll("a");
  links.forEach(link => {
    if (link.href.endsWith(".md")) {
      link.href = link.href.replace(".md", ".html");
    }
  });
});
```

## 3. 音乐播放器代码

### HTML代码
```html
<div class="xi-music-player">
  <button id="playerToggle" class="player-toggle">
    <i class="toggle-icon">🎵</i>
  </button>
  <div class="player-container">
    <div class="player-header">
      <div id="musicInfo">未播放</div>
      <div id="status" style="font-size: 10px; color: #999;">状态：就绪</div>
    </div>
    <div class="player-controls">
      <button id="prevTrack">⏮</button>
      <button id="playPause">▶</button>
      <button id="nextTrack">⏭</button>
    </div>
    <div class="progress-container">
      <div id="progressBar" class="progress-bar">
        <div id="progressCurrent" class="progress-current"></div>
      </div>
      <div class="progress-time">
        <span id="currentTime">0:00</span> / <span id="totalTime">0:00</span>
      </div>
    </div>
    <div class="volume-container">
      <label for="volumeControl">音量:</label>
      <input type="range" id="volumeControl" min="0" max="1" step="0.1" value="0.3">
    </div>
    <div class="playlist-container">
      <h3>播放列表</h3>
      <ul id="playlist-display"></ul>
    </div>
  </div>
</div>

<!-- 音频播放器 -->
<audio id="audioPlayer" style="display: none;"></audio>
```

### CSS样式
```css
/* 音乐播放器样式 */
.xi-music-player {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  font-family: 'Arial', sans-serif;
}

.xi-music-player .player-toggle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.7);
  border: 2px solid #00ff9d;
  color: #00ff9d;
  font-size: 20px;
  cursor: pointer;
  position: relative;
  z-index: 1001;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.xi-music-player .player-toggle:hover {
  transform: scale(1.1);
  box-shadow: 0 0 10px rgba(0, 255, 157, 0.7);
}

.xi-music-player .toggle-icon {
  font-style: normal;
}

.xi-music-player .player-container {
  position: absolute;
  bottom: 60px;
  right: 0;
  width: 300px;
  background-color: rgba(0, 0, 0, 0.8);
  border: 1px solid #00ff9d;
  border-radius: 10px;
  padding: 15px;
  color: #fff;
  transform: scale(0);
  transform-origin: bottom right;
  transition: transform 0.3s ease;
  opacity: 0;
  visibility: hidden;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
}

.xi-music-player .player-container.active {
  transform: scale(1);
  opacity: 1;
  visibility: visible;
}

.xi-music-player .player-header {
  margin-bottom: 15px;
  border-bottom: 1px solid rgba(0, 255, 157, 0.3);
  padding-bottom: 10px;
}

.xi-music-player .player-header div {
  font-size: 14px;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #00ff9d;
}

.xi-music-player .player-controls {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.xi-music-player .player-controls button {
  background-color: transparent;
  border: 1px solid #00ff9d;
  color: #00ff9d;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.xi-music-player .player-controls button:hover {
  background-color: rgba(0, 255, 157, 0.2);
  transform: scale(1.1);
}

.xi-music-player .progress-container {
  margin-bottom: 15px;
}

.xi-music-player .progress-bar {
  width: 100%;
  height: 6px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  cursor: pointer;
  position: relative;
  margin-bottom: 5px;
}

.xi-music-player .progress-current {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background-color: #00ff9d;
  border-radius: 3px;
  width: 0%;
}

.xi-music-player .progress-time {
  font-size: 12px;
  color: #ccc;
  display: flex;
  justify-content: space-between;
}

.xi-music-player .volume-container {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  font-size: 12px;
}

.xi-music-player .volume-container label {
  margin-right: 10px;
  color: #ccc;
}

.xi-music-player input[type="range"] {
  flex: 1;
  height: 5px;
  -webkit-appearance: none;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
}

.xi-music-player input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #00ff9d;
  cursor: pointer;
}

.xi-music-player .playlist-container {
  max-height: 150px;
  overflow-y: auto;
  border-top: 1px solid rgba(0, 255, 157, 0.3);
  padding-top: 10px;
}

.xi-music-player .playlist-container h3 {
  font-size: 14px;
  margin-top: 0;
  margin-bottom: 5px;
  color: #00ff9d;
}

.xi-music-player ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.xi-music-player ul li {
  padding: 5px;
  font-size: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: all 0.2s ease;
}

.xi-music-player ul li:hover {
  background-color: rgba(0, 255, 157, 0.2);
  color: #00ff9d;
}

/* 滚动条样式 */
.xi-music-player .playlist-container::-webkit-scrollbar {
  width: 5px;
}

.xi-music-player .playlist-container::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.3);
}

.xi-music-player .playlist-container::-webkit-scrollbar-thumb {
  background: rgba(0, 255, 157, 0.5);
  border-radius: 3px;
}

.xi-music-player .playlist-container::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 255, 157, 0.7);
}
```

### JavaScript代码
```javascript
// 音乐播放器功能
document.addEventListener('DOMContentLoaded', function() {
  // 播放列表
  const playlist = [
    {
      title: "燃烧",
      url: "/music/燃烧.mp3"
    },
    {
      title: "《Metaphysics》 (Remastered)",
      url: "/music/《Metaphysics》 (Remastered).mp3"
    },
    {
      title: "Budapest (Cover) (Remastered)",
      url: "/music/Budapest (Cover) (Remastered).mp3"
    },
    {
      title: "Moonfall",
      url: "/music/Moonfall.mp3"
    },
    {
      title: "示例 - Algorithms (电子音乐)",
      url: "/music/ambient1.mp3"
    }
  ];

  // 创建存储前缀，使得不同页面间的播放状态可以共享
  const storagePrefix = 'xiPlayer_';
  
  // 从localStorage获取上次的播放状态
  const lastVolume = parseFloat(localStorage.getItem(`${storagePrefix}volume`)) || 0.3;
  const lastTrack = parseInt(localStorage.getItem(`${storagePrefix}currentTrack`)) || 0;
  const lastTime = parseFloat(localStorage.getItem(`${storagePrefix}currentTime`)) || 0;
  const wasPlaying = localStorage.getItem(`${storagePrefix}isPlaying`) === 'true';
  
  // 获取DOM元素
  const audioPlayer = document.getElementById('audioPlayer');
  const playerToggle = document.getElementById('playerToggle');
  const playerContainer = document.querySelector('.player-container');
  const playPauseBtn = document.getElementById('playPause');
  const prevBtn = document.getElementById('prevTrack');
  const nextBtn = document.getElementById('nextTrack');
  const volumeControl = document.getElementById('volumeControl');
  const musicInfo = document.getElementById('musicInfo');
  const statusDisplay = document.getElementById('status');
  const progressBar = document.getElementById('progressBar');
  const progressCurrent = document.getElementById('progressCurrent');
  const currentTimeDisplay = document.getElementById('currentTime');
  const totalTimeDisplay = document.getElementById('totalTime');
  const playlistDisplay = document.getElementById('playlist-display');
  
  // 状态变量
  let currentTrack = lastTrack;
  let isPlaying = false;
  let currentVolume = lastVolume;
  let currentTime = lastTime;

  // 显示播放列表
  playlistDisplay.innerHTML = '';
  playlist.forEach(function(track, index) {
    const li = document.createElement('li');
    li.textContent = track.title;
    li.onclick = function() {
      currentTrack = index;
      localStorage.setItem(`${storagePrefix}currentTrack`, currentTrack);
      loadAndPlayTrack();
    };
    playlistDisplay.appendChild(li);
  });
  
  // 切换播放器显示
  playerToggle.addEventListener('click', function() {
    playerContainer.classList.toggle('active');
  });
  
  // 更新播放进度
  function updateProgress() {
    if (audioPlayer.duration) {
      const percentage = (audioPlayer.currentTime / audioPlayer.duration) * 100;
      progressCurrent.style.width = `${percentage}%`;
      
      // 更新时间显示
      const currentMins = Math.floor(audioPlayer.currentTime / 60);
      const currentSecs = Math.floor(audioPlayer.currentTime % 60);
      const totalMins = Math.floor(audioPlayer.duration / 60);
      const totalSecs = Math.floor(audioPlayer.duration % 60);
      
      currentTimeDisplay.textContent = `${currentMins}:${currentSecs < 10 ? '0' + currentSecs : currentSecs}`;
      totalTimeDisplay.textContent = `${totalMins}:${totalSecs < 10 ? '0' + totalSecs : totalSecs}`;
      
      // 持续保存当前播放位置 - 每秒保存一次，避免频繁写入
      if (Math.floor(audioPlayer.currentTime) % 1 === 0) {
        localStorage.setItem(`${storagePrefix}currentTime`, audioPlayer.currentTime);
      }
    }
  }
  
  // 更新音乐信息
  function updateMusicInfo() {
    musicInfo.textContent = playlist[currentTrack].title;
    if (statusDisplay) {
      statusDisplay.textContent = isPlaying ? "状态：正在播放" : "状态：已暂停";
    }
  }
  
  // 加载曲目（不自动播放）
  function loadTrack() {
    try {
      const encodedUrl = encodeURI(playlist[currentTrack].url);
      
      // 保存当前加载的URL
      localStorage.setItem(`${storagePrefix}lastUrl`, encodedUrl);
      
      // 只有URL变化时才重新加载
      if (audioPlayer.src !== encodedUrl) {
        musicInfo.textContent = `加载中... ${playlist[currentTrack].title}`;
        if (statusDisplay) statusDisplay.textContent = "状态：正在加载";
        
        audioPlayer.src = encodedUrl;
        audioPlayer.load();
        
        // 设置音量
        audioPlayer.volume = currentVolume;
        volumeControl.value = currentVolume;
      }
      
      updateMusicInfo();
      return true;
    } catch(error) {
      console.error('加载音频出错:', error);
      if (statusDisplay) statusDisplay.textContent = `状态：加载失败 - ${error.message}`;
      return false;
    }
  }
  
  // 加载并播放当前曲目
  function loadAndPlayTrack() {
    // 记住当前曲目
    localStorage.setItem(`${storagePrefix}currentTrack`, currentTrack);
    
    if (loadTrack()) {
      try {
        // 播放音频
        const playPromise = audioPlayer.play();
        if (playPromise !== undefined) {
          playPromise.then(function() {
            playPauseBtn.textContent = '⏸';
            isPlaying = true;
            localStorage.setItem(`${storagePrefix}isPlaying`, 'true');
            updateMusicInfo();
          }).catch(function(error) {
            console.error('播放错误:', error);
            musicInfo.textContent = `无法播放: ${playlist[currentTrack].title}`;
            if (statusDisplay) statusDisplay.textContent = `状态：播放失败 - ${error.message}`;
            
            // 尝试播放下一首
            setTimeout(function() {
              currentTrack = (currentTrack + 1) % playlist.length;
              localStorage.setItem(`${storagePrefix}currentTrack`, currentTrack);
              loadAndPlayTrack();
            }, 2000);
          });
        }
      } catch (error) {
        console.error('播放音频错误:', error);
        musicInfo.textContent = `错误: ${playlist[currentTrack].title}`;
        if (statusDisplay) statusDisplay.textContent = `状态：播放失败 - ${error.message}`;
        
        // 尝试播放下一首
        setTimeout(function() {
          currentTrack = (currentTrack + 1) % playlist.length;
          localStorage.setItem(`${storagePrefix}currentTrack`, currentTrack);
          loadAndPlayTrack();
        }, 2000);
      }
    }
  }
  
  // 播放/暂停
  function togglePlay() {
    if (isPlaying) {
      audioPlayer.pause();
      playPauseBtn.textContent = '▶';
      isPlaying = false;
      localStorage.setItem(`${storagePrefix}isPlaying`, 'false');
      updateMusicInfo();
    } else {
      loadAndPlayTrack();
    }
  }
  
  // 播放下一首
  function playNext() {
    currentTrack = (currentTrack + 1) % playlist.length;
    localStorage.setItem(`${storagePrefix}currentTrack`, currentTrack);
    if (isPlaying) {
      loadAndPlayTrack();
    } else {
      loadTrack();
      updateMusicInfo();
    }
  }
  
  // 播放上一首
  function playPrev() {
    currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
    localStorage.setItem(`${storagePrefix}currentTrack`, currentTrack);
    if (isPlaying) {
      loadAndPlayTrack();
    } else {
      loadTrack();
      updateMusicInfo();
    }
  }
  
  // 进度条点击事件
  progressBar.addEventListener('click', function(e) {
    if (audioPlayer.duration) {
      const percentage = (e.offsetX / this.offsetWidth);
      audioPlayer.currentTime = percentage * audioPlayer.duration;
      localStorage.setItem(`${storagePrefix}currentTime`, audioPlayer.currentTime);
    }
  });
  
  // 绑定事件
  playPauseBtn.addEventListener('click', togglePlay);
  nextBtn.addEventListener('click', playNext);
  prevBtn.addEventListener('click', playPrev);
  volumeControl.addEventListener('input', function(e) {
    audioPlayer.volume = e.target.value;
    currentVolume = e.target.value;
    localStorage.setItem(`${storagePrefix}volume`, currentVolume);
  });
  
  // 监听播放进度
  audioPlayer.addEventListener('timeupdate', updateProgress);
  
  // 监听音频结束事件
  audioPlayer.addEventListener('ended', playNext);
  
  // 初始化
  if (loadTrack()) {
    // 设置音量
    audioPlayer.volume = currentVolume;
    volumeControl.value = currentVolume;
    
    // 恢复播放位置
    if (currentTime > 0 && audioPlayer.readyState >= 1) {
      try {
        audioPlayer.currentTime = currentTime;
      } catch (e) {
        console.warn('无法设置播放位置:', e);
        // 监听可以设置时间的事件
        audioPlayer.addEventListener('canplay', function onCanPlay() {
          try {
            audioPlayer.currentTime = currentTime;
            audioPlayer.removeEventListener('canplay', onCanPlay);
          } catch(e) {
            console.error('设置播放位置失败:', e);
          }
        });
      }
    }
    
    // 如果之前在播放，则恢复播放
    if (wasPlaying) {
      const playPromise = audioPlayer.play();
      if (playPromise !== undefined) {
        playPromise.then(function() {
          playPauseBtn.textContent = '⏸';
          isPlaying = true;
          updateMusicInfo();
        }).catch(function(error) {
          console.warn('自动恢复播放失败，需要用户交互:', error);
          isPlaying = false;
          localStorage.setItem(`${storagePrefix}isPlaying`, 'false');
          playPauseBtn.textContent = '▶';
          
          // 提示用户点击播放
          if (statusDisplay) {
            statusDisplay.textContent = "状态：请点击播放按钮继续";
          }
        });
      }
    } else {
      playPauseBtn.textContent = '▶';
    }
    
    updateMusicInfo();
  }
});
```

## 将这些组件添加到你的页面

1. 在HTML `<head>` 标签中添加CSS样式
2. 在HTML页面底部 `<body>` 标签结束前添加HTML代码和JavaScript
3. 确保修改底部导航的链接以指向正确的下一章节
4. **重要：优先使用直接链接方式实现页面导航**，而不是JavaScript函数调用，如：
   ```html
   <a href="quantum-choice-paradox.html" class="next-chapter-btn">继续访问下一数据碎片 ›</a>
   ```
   这种直接链接的方式比使用JavaScript函数更可靠，可以避免在不同环境下的路径解析问题。

5. 如果必须使用JavaScript导航函数，请使用相对路径而非绝对路径：
   ```javascript
   function navigateToChapter(chapterFolder, chapterFile) {
     window.location.href = `${chapterFile}.html`;  // 简单相对路径
     // 或者 window.location.href = `../${chapterFolder}/${chapterFile}.html`;  // 完整相对路径
   }
   ```

6. 测试导航功能，确保所有链接都能正确跳转到目标页面