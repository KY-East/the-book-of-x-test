/**
 * 音乐播放器添加脚本 - 安全版
 * 
 * 此脚本用于向任何HTML页面添加音乐播放器组件
 * 确保在页面之间导航时音乐继续播放
 * 特别注意安全清理已存在的播放器元素，避免破坏页面其他功能
 * 
 * 使用方法：
 * 1. 在浏览器控制台中运行此脚本
 * 2. 或者将其添加到HTML文件的末尾
 */

console.log('[音乐播放器] 初始化...');

// 安全地删除现有的播放器组件
function safelyRemoveExistingPlayer() {
  // 记录删除过程
  let log = {
    removedElements: [],
    errors: []
  };
  
  try {
    console.log('[音乐播放器] 开始检查现有播放器元素...');
    
    // 1. 删除隐藏的音频元素 - 最常见的播放器组件
    const audioElements = document.querySelectorAll('audio#audioPlayer, audio[style*="display:none"]');
    audioElements.forEach((el, index) => {
      try {
        const parentNode = el.parentNode;
        if (parentNode) {
          console.log(`[音乐播放器] 删除音频元素 #${index+1}: ${el.id || '无ID'}`);
          parentNode.removeChild(el);
          log.removedElements.push(`音频元素 #${index+1}: ${el.id || '无ID'}`);
        }
      } catch (err) {
        console.error(`[音乐播放器] 删除音频元素 #${index+1} 时出错:`, err);
        log.errors.push(`音频元素 #${index+1}: ${err.message}`);
      }
    });
    
    // 2. 删除已存在的类似播放器UI元素（只删除确定的播放器元素）
    const playerElements = document.querySelectorAll('.xi-music-player, .player-container, .music-player');
    playerElements.forEach((el, index) => {
      try {
        const parentNode = el.parentNode;
        if (parentNode) {
          console.log(`[音乐播放器] 删除播放器UI元素 #${index+1}: ${el.className}`);
          parentNode.removeChild(el);
          log.removedElements.push(`播放器UI元素 #${index+1}: ${el.className}`);
        }
      } catch (err) {
        console.error(`[音乐播放器] 删除播放器UI元素 #${index+1} 时出错:`, err);
        log.errors.push(`播放器UI元素 #${index+1}: ${err.message}`);
      }
    });
    
    // 3. 删除播放器切换按钮
    const toggleButtons = document.querySelectorAll('#playerToggle, .player-toggle');
    toggleButtons.forEach((el, index) => {
      try {
        const parentNode = el.parentNode;
        if (parentNode) {
          console.log(`[音乐播放器] 删除播放器切换按钮 #${index+1}: ${el.id || el.className}`);
          parentNode.removeChild(el);
          log.removedElements.push(`播放器切换按钮 #${index+1}: ${el.id || el.className}`);
        }
      } catch (err) {
        console.error(`[音乐播放器] 删除播放器切换按钮 #${index+1} 时出错:`, err);
        log.errors.push(`播放器切换按钮 #${index+1}: ${err.message}`);
      }
    });
    
    console.log('[音乐播放器] 现有播放器元素清理完成');
    console.log('[音乐播放器] 清理摘要:', log);
    
    return {
      success: true,
      log: log
    };
  } catch (err) {
    console.error('[音乐播放器] 删除现有播放器时发生严重错误:', err);
    log.errors.push(`严重错误: ${err.message}`);
    
    return {
      success: false,
      error: err,
      log: log
    };
  }
}

// 执行安全删除
const cleanupResult = safelyRemoveExistingPlayer();

// 如果安全删除成功，添加新的播放器
if (cleanupResult.success) {
  console.log('[音乐播放器] 开始添加新的播放器...');
  addMusicPlayer();
  console.log('[音乐播放器] 新播放器已添加');
} else {
  console.error('[音乐播放器] 由于清理过程中出现严重错误，跳过添加新播放器');
}

/**
 * 添加音乐播放器到页面
 */
function addMusicPlayer() {
  // 生成唯一ID前缀，避免冲突
  const idPrefix = 'xi_player_' + Math.random().toString(36).substring(2, 9) + '_';
  
  // 1. 添加HTML结构
  const playerHTML = `
  <div class="xi-music-player">
    <button id="${idPrefix}playerToggle" class="player-toggle">
      <i class="toggle-icon">🎵</i>
    </button>
    <div class="player-container">
      <div class="player-header">
        <div id="${idPrefix}musicInfo">未播放</div>
        <div id="${idPrefix}status" style="font-size: 10px; color: #999;">状态：就绪</div>
      </div>
      <div class="player-controls">
        <button id="${idPrefix}prevTrack">⏮</button>
        <button id="${idPrefix}playPause">▶</button>
        <button id="${idPrefix}nextTrack">⏭</button>
      </div>
      <div class="progress-container">
        <div id="${idPrefix}progressBar" class="progress-bar">
          <div id="${idPrefix}progressCurrent" class="progress-current"></div>
        </div>
        <div class="progress-time">
          <span id="${idPrefix}currentTime">0:00</span> / <span id="${idPrefix}totalTime">0:00</span>
        </div>
      </div>
      <div class="volume-container">
        <label for="${idPrefix}volumeControl">音量:</label>
        <input type="range" id="${idPrefix}volumeControl" min="0" max="1" step="0.1" value="0.3">
      </div>
      <div class="playlist-container">
        <h3>播放列表</h3>
        <ul id="${idPrefix}playlist-display"></ul>
      </div>
    </div>
  </div>`;
  
  // 将播放器添加到body末尾
  const tempContainer = document.createElement('div');
  tempContainer.innerHTML = playerHTML;
  document.body.appendChild(tempContainer.firstElementChild);
  
  // 2. 添加CSS样式
  const playerStyles = `
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
  
  .xi-music-player .playlist-container ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .xi-music-player .playlist-container li {
    padding: 5px 10px;
    cursor: pointer;
    font-size: 12px;
    border-radius: 3px;
    transition: all 0.2s ease;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .xi-music-player .playlist-container li:hover {
    background-color: rgba(0, 255, 157, 0.2);
  }
  
  .xi-music-player .playlist-container li.active {
    background-color: rgba(0, 255, 157, 0.3);
    color: #fff;
  }
  `;
  
  // 创建样式元素并添加到页面头部
  const styleElement = document.createElement('style');
  styleElement.textContent = playerStyles;
  document.head.appendChild(styleElement);
  
  // 3. 初始化播放器功能
  
  // 创建音频元素
  const audioPlayer = document.createElement('audio');
  audioPlayer.id = idPrefix + 'audioPlayer';
  audioPlayer.style.display = 'none';
  audioPlayer.preload = 'auto';
  document.body.appendChild(audioPlayer);
  
  // 基础路径检测和处理
  const basePath = getBasePath();
  function getBasePath() {
    // 检测当前环境是本地开发还是GitHub Pages
    const host = window.location.hostname;
    const path = window.location.pathname;
    
    // 如果是GitHub Pages域名或路径中包含仓库名
    if (host.includes('github.io') || path.includes('/the-book-of-x-test/')) {
      return '/the-book-of-x-test';
    }
    
    // 本地开发环境
    return '';
  }
  
  // 全局共享存储前缀 - 确保跨页面使用相同的键
  const storagePrefix = 'xiMusic_global_';
  
  // 音乐播放列表
  const playlist = [
    {
      title: "燃烧",
      url: `${basePath}/music/燃烧.mp3`
    },
    {
      title: "《Metaphysics》 (Remastered)",
      url: `${basePath}/music/《Metaphysics》 (Remastered).mp3`
    },
    {
      title: "Budapest (Cover) (Remastered)",
      url: `${basePath}/music/Budapest (Cover) (Remastered).mp3`
    },
    {
      title: "Moonfall",
      url: `${basePath}/music/Moonfall.mp3`
    },
    {
      title: "The World in Words",
      url: `${basePath}/music/The World in Words.mp3`
    },
    {
      title: "The Maze",
      url: `${basePath}/music/The Maze.mp3`
    },
    {
      title: "Moth (Remastered)",
      url: `${basePath}/music/Moth (Remastered).mp3`
    },
    {
      title: "裂隙",
      url: `${basePath}/music/裂隙.mp3`
    },
    {
      title: "Das Pferd von Turin (Remastered)",
      url: `${basePath}/music/Das Pferd von Turin (Remastered).mp3`
    },
    {
      title: "Post-Rock示例",
      url: `${basePath}/music/postrock1.mp3`
    },
    {
      title: "环境音乐1",
      url: `${basePath}/music/ambient1.mp3`
    },
    {
      title: "环境音乐2",
      url: `${basePath}/music/ambient2.mp3`
    }
  ];
  
  // 从localStorage获取播放器状态
  let currentTrack = localStorage.getItem(`${storagePrefix}currentTrack`) 
    ? parseInt(localStorage.getItem(`${storagePrefix}currentTrack`)) : 0;
  let isPlaying = localStorage.getItem(`${storagePrefix}isPlaying`) === 'true';
  let currentTime = localStorage.getItem(`${storagePrefix}currentTime`) 
    ? parseFloat(localStorage.getItem(`${storagePrefix}currentTime`)) : 0;
  let currentVolume = localStorage.getItem(`${storagePrefix}volume`) 
    ? parseFloat(localStorage.getItem(`${storagePrefix}volume`)) : 0.3;
  let lastUrl = localStorage.getItem(`${storagePrefix}lastUrl`) || '';
  
  // 获取DOM元素
  const playerToggle = document.getElementById(idPrefix + 'playerToggle');
  // 直接获取播放器容器元素，不再重复声明playerContainer变量
  const playerContainer = playerToggle.nextElementSibling; // 获取切换按钮后的下一个元素，即播放器容器
  const playPauseBtn = document.getElementById(idPrefix + 'playPause');
  const prevBtn = document.getElementById(idPrefix + 'prevTrack');
  const nextBtn = document.getElementById(idPrefix + 'nextTrack');
  const volumeControl = document.getElementById(idPrefix + 'volumeControl');
  const musicInfo = document.getElementById(idPrefix + 'musicInfo');
  const statusInfo = document.getElementById(idPrefix + 'status');
  const progressBar = document.getElementById(idPrefix + 'progressBar');
  const progressCurrent = document.getElementById(idPrefix + 'progressCurrent');
  const currentTimeDisplay = document.getElementById(idPrefix + 'currentTime');
  const totalTimeDisplay = document.getElementById(idPrefix + 'totalTime');
  const playlistDisplay = document.getElementById(idPrefix + 'playlist-display');
  
  // 显示播放列表
  function updatePlaylist() {
    playlistDisplay.innerHTML = '';
    
    playlist.forEach((track, index) => {
      const li = document.createElement('li');
      li.textContent = track.title;
      li.classList.toggle('active', index === currentTrack);
      
      li.addEventListener('click', () => {
        currentTrack = index;
        if (isPlaying) {
          loadAndPlayTrack();
        } else {
          updateMusicInfo();
        }
      });
      
      playlistDisplay.appendChild(li);
    });
  }
  
  // 切换播放器显示
  playerToggle.addEventListener('click', () => {
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
    }
  }
  
  // 更新音乐信息
  function updateMusicInfo() {
    musicInfo.textContent = playlist[currentTrack].title;
    statusInfo.textContent = isPlaying ? '状态：播放中' : '状态：已暂停';
    
    // 更新播放列表高亮
    const listItems = playlistDisplay.querySelectorAll('li');
    listItems.forEach((item, index) => {
      item.classList.toggle('active', index === currentTrack);
    });
  }
  
  // 当播放进度变化时保存状态
  audioPlayer.addEventListener('timeupdate', () => {
    if (isPlaying) {
      localStorage.setItem(`${storagePrefix}currentTime`, audioPlayer.currentTime);
    }
  });
  
  // 当音量变化时保存状态
  audioPlayer.addEventListener('volumechange', () => {
    localStorage.setItem(`${storagePrefix}volume`, audioPlayer.volume);
  });
  
  // 保存播放器状态
  function savePlayerState() {
    localStorage.setItem(`${storagePrefix}currentTime`, audioPlayer.currentTime);
    localStorage.setItem(`${storagePrefix}isPlaying`, isPlaying ? 'true' : 'false');
    localStorage.setItem(`${storagePrefix}currentTrack`, currentTrack);
    localStorage.setItem(`${storagePrefix}volume`, audioPlayer.volume);
    localStorage.setItem(`${storagePrefix}lastUrl`, window.location.href);
  }
  
  // 加载并播放当前曲目
  function loadAndPlayTrack() {
    try {
      const track = playlist[currentTrack];
      audioPlayer.src = track.url;
      audioPlayer.volume = currentVolume;
      
      // 如果从其他页面切换过来，尝试恢复播放位置
      if (lastUrl && lastUrl !== window.location.href) {
        audioPlayer.currentTime = currentTime;
      }
      
      // 更新音乐信息显示
      musicInfo.textContent = `正在播放: ${track.title}`;
      
      // 如果应该播放，则播放
      if (isPlaying) {
        audioPlayer.play()
          .then(() => {
            playPauseBtn.textContent = '❚❚';
            statusInfo.textContent = '状态：播放中';
            savePlayerState();
          })
          .catch(error => {
            console.error('[音乐播放器] 播放错误:', error);
            statusInfo.textContent = '状态：播放失败';
            musicInfo.textContent = `无法播放: ${track.title}`;
            
            // 尝试播放下一首
            setTimeout(() => {
              currentTrack = (currentTrack + 1) % playlist.length;
              loadAndPlayTrack();
            }, 2000);
          });
      } else {
        playPauseBtn.textContent = '▶';
        statusInfo.textContent = '状态：已暂停';
      }
    } catch (error) {
      console.error('[音乐播放器] 音频加载错误:', error);
      statusInfo.textContent = '状态：加载失败';
      musicInfo.textContent = `错误: ${track.title}`;
      
      // 尝试播放下一首
      setTimeout(() => {
        currentTrack = (currentTrack + 1) % playlist.length;
        loadAndPlayTrack();
      }, 2000);
    }
  }
  
  // 播放/暂停
  function togglePlay() {
    if (isPlaying) {
      audioPlayer.pause();
      playPauseBtn.textContent = '▶';
      isPlaying = false;
      statusInfo.textContent = '状态：已暂停';
      savePlayerState();
    } else {
      audioPlayer.play()
        .then(() => {
          playPauseBtn.textContent = '❚❚';
          isPlaying = true;
          statusInfo.textContent = '状态：播放中';
          savePlayerState();
        })
        .catch(err => {
          console.error('[音乐播放器] 播放失败:', err);
          statusInfo.textContent = '状态：播放失败';
        });
    }
  }
  
  // 上一曲
  function prevTrack() {
    currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
    loadAndPlayTrack();
    savePlayerState();
  }
  
  // 下一曲
  function nextTrack() {
    currentTrack = (currentTrack + 1) % playlist.length;
    loadAndPlayTrack();
    savePlayerState();
  }
  
  // 初始化播放器设置
  audioPlayer.volume = currentVolume;
  
  // 更新音量显示
  volumeControl.value = currentVolume;
  
  // 进度条点击事件
  progressBar.addEventListener('click', (e) => {
    if (audioPlayer.duration) {
      const percentage = e.offsetX / progressBar.offsetWidth;
      audioPlayer.currentTime = percentage * audioPlayer.duration;
    }
  });
  
  // 绑定事件
  playPauseBtn.addEventListener('click', togglePlay);
  nextBtn.addEventListener('click', nextTrack);
  prevBtn.addEventListener('click', prevTrack);
  volumeControl.addEventListener('input', (e) => {
    audioPlayer.volume = e.target.value;
  });
  
  // 监听播放进度
  audioPlayer.addEventListener('timeupdate', updateProgress);
  
  // 监听音频结束事件
  audioPlayer.addEventListener('ended', nextTrack);
  
  // 初始化显示
  updateMusicInfo();
  updatePlaylist();
  
  // 尝试恢复之前的播放状态 (localStorage实现持久性)
  try {
    const savedState = localStorage.getItem('xi-player-state');
    if (savedState) {
      const state = JSON.parse(savedState);
      if (state && typeof state === 'object') {
        // 恢复音量
        if (typeof state.volume === 'number') {
          audioPlayer.volume = state.volume;
          volumeControl.value = state.volume;
        }
        
        // 恢复曲目
        if (typeof state.track === 'number' && state.track >= 0 && state.track < playlist.length) {
          currentTrack = state.track;
          updateMusicInfo();
          
          // 恢复播放状态
          if (state.playing === true) {
            setTimeout(() => {
              loadAndPlayTrack();
            }, 1000);
          }
          
          console.log('[音乐播放器] 成功恢复播放状态');
        }
      }
    }
  } catch (err) {
    console.error('[音乐播放器] 恢复状态时出错:', err);
  }
  
  // 定期保存状态
  setInterval(savePlayerState, 5000);
  
  // 页面关闭前保存状态
  window.addEventListener('beforeunload', savePlayerState);
  
  console.log('[音乐播放器] 播放器初始化完成');
}
  