/**
 * xi-music.js - XiCore音乐播放器模块
 * 
 * 精简版 - 仅包含核心功能，移除主题系统
 * 版本: 2.4.1
 * 日期: 2025-05-04
 * 更新: 歌词区域始终显示，移除切换按钮
 */

const XiMusic = (function() {
  // 是否作为独立脚本运行
  const isStandalone = typeof window.XiCore === 'undefined';
  
  // 存储前缀
  const STORAGE_PREFIX = 'xiMusic_';
  
  // 移动设备检测
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // 播放模式枚举
  const PLAY_MODES = {
    NORMAL: 'normal',      // 普通模式（播放完列表停止）
    LOOP_ALL: 'loop_all',  // 列表循环（播放完列表从头开始）
    LOOP_ONE: 'loop_one',  // 单曲循环（重复播放当前歌曲）
    RANDOM: 'random'       // 随机播放（随机选择下一首）
  };
  
  // 模块状态
  const state = {
    initialized: false,
    playing: false,
    currentTrack: localStorage.getItem(`${STORAGE_PREFIX}currentTrack`) 
      ? parseInt(localStorage.getItem(`${STORAGE_PREFIX}currentTrack`)) : 0,
    currentPlaylist: localStorage.getItem(`${STORAGE_PREFIX}currentPlaylist`) || 'default',
    volume: localStorage.getItem(`${STORAGE_PREFIX}volume`) 
      ? parseFloat(localStorage.getItem(`${STORAGE_PREFIX}volume`)) : 0.5,
    muted: localStorage.getItem(`${STORAGE_PREFIX}muted`) === 'true',
    uiVisible: localStorage.getItem(`${STORAGE_PREFIX}uiVisible`) === 'true' || false,
    lastPosition: localStorage.getItem(`${STORAGE_PREFIX}lastPosition`) 
      ? parseFloat(localStorage.getItem(`${STORAGE_PREFIX}lastPosition`)) : 0,
    playMode: localStorage.getItem(`${STORAGE_PREFIX}playMode`) || PLAY_MODES.RANDOM, // 默认为随机播放
    randomHistory: [], // 记录随机播放历史，用于返回上一曲
    lyricsVisible: true, // 歌词始终显示
    currentLyrics: null, // 当前歌曲的歌词数据
    currentLyricIndex: -1 // 当前正在显示的歌词索引
  };
  
  // 播放位置保存间隔（毫秒）
  const POSITION_SAVE_INTERVAL = 3000; // 每3秒保存一次
  
  // 播放位置保存定时器
  let positionSaveTimer = null;
  
  // DOM元素引用
  let playerContainer = null;
  let audioElement = null;
  let playPauseBtn = null;
  let prevBtn = null;
  let nextBtn = null;
  let volumeControl = null;
  let progressBar = null;
  let progressCurrent = null;
  let musicInfo = null;
  let playlistElement = null;
  let currentTimeDisplay = null;
  let totalTimeDisplay = null;
  let playModeBtn = null;
  let lyricsContainer = null;
  let currentLyricElement = null;
  let nextLyricElement = null;
  
  // 获取基础路径
  function getBasePath() {
    return window.location.hostname.includes('github.io') || window.location.pathname.includes('/the-book-of-x-test/') 
      ? '/the-book-of-x-test' 
      : '';
  }
  
  // 播放列表
  const playlists = {
    default: [
      { id: 'burning', title: "燃烧", file: '/music/燃烧.mp3' },
      { id: 'metaphysics', title: "《Metaphysics》 (Remastered)", file: '/music/《Metaphysics》 (Remastered).mp3' },
      { id: 'budapest', title: "Budapest (Cover) (Remastered)", file: '/music/Budapest (Cover) (Remastered).mp3' },
      { id: 'moonfall', title: "Moonfall", file: '/music/Moonfall.mp3' },
      { id: 'worldinwords', title: "The World in Words", file: '/music/The World in Words.mp3' },
      { id: 'maze', title: "The Maze", file: '/music/The Maze.mp3' },
      { id: 'moth', title: "Moth (Remastered)", file: '/music/Moth (Remastered).mp3' },
      { id: 'fissure', title: "裂隙", file: '/music/裂隙.mp3' },
      { id: 'pferd', title: "Das Pferd von Turin (Remastered)", file: '/music/Das Pferd von Turin (Remastered).mp3' },
      { id: 'postrock1', title: "Post-Rock示例", file: '/music/postrock1.mp3' },
      { id: 'ambient1', title: "环境音乐1", file: '/music/ambient1.mp3' },
      { id: 'ambient2', title: "环境音乐2", file: '/music/ambient2.mp3' }
    ]
  };
  
  // 安全地删除现有的播放器组件
  function safelyRemoveExistingPlayer() {
    // 删除音频元素
    const audioElements = document.querySelectorAll('audio#xiMusicAudio');
    audioElements.forEach(el => {
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
    });
    
    // 删除播放器UI
    const playerElements = document.querySelectorAll('.xi-music-player');
    playerElements.forEach(el => {
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
    });
    
    console.log('[XiMusic] 清理完成');
    return true;
  }
  
  // 创建播放器UI
  function createPlayerUI() {
    const idPrefix = 'xiMusic_';
    
    // 检查播放器是否已存在
    if (document.querySelector('.xi-music-player')) {
      return document.querySelector('.xi-music-player');
    }
    
    // 根据播放模式获取显示图标
    const playModeIcon = getPlayModeIcon(state.playMode);
    
    // 创建播放器HTML - 始终显示歌词，移除切换按钮
  const playerHTML = `
  <div class="xi-music-player ${isMobile ? 'mobile' : ''}">
    <button id="${idPrefix}playerToggle" class="player-toggle">
      <i class="toggle-icon">🎵</i>
    </button>
    <div class="player-container ${state.uiVisible ? 'active' : ''}">
      <div class="player-header">
        <div class="header-content">
        <div id="${idPrefix}musicInfo">未播放</div>
          <div class="header-controls">
            <button id="${idPrefix}playMode" class="play-mode-btn" title="切换播放模式">${playModeIcon}</button>
          </div>
        </div>
        <div id="${idPrefix}status" style="font-size: 10px; color: #999;">状态：就绪</div>
      </div>
      <div id="${idPrefix}lyricsContainer" class="lyrics-container">
        <div id="${idPrefix}currentLyric" class="current-lyric">等待歌词加载...</div>
        <div id="${idPrefix}nextLyric" class="next-lyric"></div>
      </div>
      <div class="player-controls">
        <button id="${idPrefix}prevTrack" class="touch-target">⏮</button>
        <button id="${idPrefix}playPause" class="touch-target">▶</button>
        <button id="${idPrefix}nextTrack" class="touch-target">⏭</button>
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
        <input type="range" id="${idPrefix}volumeControl" min="0" max="1" step="0.1" value="${state.volume}" class="touch-range">
      </div>
      <div class="playlist-container">
        <h3>播放列表</h3>
        <ul id="${idPrefix}playlist" class="${isMobile ? 'touch-list' : ''}"></ul>
      </div>
    </div>
      </div>
    `;
    
  // 创建样式 - 修改歌词相关样式
  const playerStyles = `
  .xi-music-player {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 9999;
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
    z-index: 10000;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  /* 移动设备上更大的触摸区域 */
  .xi-music-player.mobile .player-toggle {
    width: 45px;
    height: 45px;
    font-size: 18px;
    bottom: 5px;
    right: 5px;
  }
  
  .xi-music-player .player-toggle:hover,
  .xi-music-player .player-toggle:active {
    transform: scale(1.1);
    box-shadow: 0 0 10px rgba(0, 255, 157, 0.7);
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
  
  /* 移动设备上的容器样式 */
  .xi-music-player.mobile .player-container {
    bottom: 50px;
    width: 85vw;
    max-width: 320px;
    padding: 15px;
    right: 5px;
  }
  
  /* 针对小屏幕设备的优化 */
  @media (max-width: 480px) {
    .xi-music-player.mobile .player-container {
      width: 85vw;
      right: 0;
    }
    
    .xi-music-player.mobile .player-toggle {
      width: 40px;
      height: 40px;
      font-size: 16px;
      opacity: 0.85;
    }
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
  
  .xi-music-player .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 3px;
  }
  
  .xi-music-player .header-controls {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .xi-music-player .player-header #xiMusic_musicInfo {
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: bold;
    color: #00ff9d;
    flex: 1;
    margin-right: 10px;
  }
  
  /* 移动设备上更大的文字 */
  .xi-music-player.mobile .player-header #xiMusic_musicInfo {
    font-size: 16px;
  }
  
  .xi-music-player .play-mode-btn,
  .xi-music-player .lyrics-toggle-btn {
    background-color: transparent;
    border: none;
    color: #00ff9d;
    cursor: pointer;
    font-size: 16px;
    padding: 0;
    margin: 0;
    width: auto;
    height: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s ease;
  }
  
  .xi-music-player.mobile .play-mode-btn,
  .xi-music-player.mobile .lyrics-toggle-btn {
    font-size: 18px;
  }
  
  .xi-music-player .play-mode-btn:hover,
  .xi-music-player .play-mode-btn:active,
  .xi-music-player .lyrics-toggle-btn:hover,
  .xi-music-player .lyrics-toggle-btn:active {
    transform: scale(1.2);
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
  }
  
  /* 移动设备上的按钮优化 */
  .xi-music-player.mobile .player-controls .touch-target {
    width: 55px;
    height: 55px;
    font-size: 20px;
    margin: 0 5px;
  }
  
  /* 通用触摸目标样式 */
  .xi-music-player .touch-target {
    min-width: 48px;
    min-height: 48px;
  }
  
  .xi-music-player .player-controls button:hover,
  .xi-music-player .player-controls button:active {
    background-color: rgba(0, 255, 157, 0.2);
    box-shadow: 0 0 8px rgba(0, 255, 157, 0.5);
  }
  
  .xi-music-player .progress-bar {
    height: 5px;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
    margin-bottom: 5px;
    cursor: pointer;
  }
  
  /* 移动设备上的进度条优化 */
  .xi-music-player.mobile .progress-bar {
    height: 8px;
    margin: 10px 0;
  }
  
  .xi-music-player .progress-current {
    height: 100%;
    background-color: #00ff9d;
    border-radius: 2px;
    width: 0%;
  }
  
  .xi-music-player .progress-time {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #ccc;
    margin-bottom: 10px;
  }
  
  /* 移动设备上的时间显示 */
  .xi-music-player.mobile .progress-time {
    font-size: 14px;
    margin-bottom: 15px;
  }
  
  .xi-music-player .volume-container {
    display: flex;
    align-items: center;
        margin: 15px 0;
  }
  
  .xi-music-player .volume-container label {
    margin-right: 10px;
    font-size: 12px;
  }
  
  /* 移动设备上更大的标签 */
  .xi-music-player.mobile .volume-container label {
    font-size: 14px;
    margin-right: 15px;
  }
  
  .xi-music-player input[type="range"] {
    flex: 1;
    height: 5px;
    -webkit-appearance: none;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
  }
  
  /* 移动设备上更大的滑块 */
  .xi-music-player.mobile .touch-range {
    height: 8px;
  }
  
  .xi-music-player input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: #00ff9d;
    cursor: pointer;
  }
  
  /* 移动设备上更大的滑块拇指 */
  .xi-music-player.mobile input[type="range"]::-webkit-slider-thumb {
    width: 20px;
    height: 20px;
  }
  
  .xi-music-player .playlist-container {
        max-height: 150px;
    overflow-y: auto;
    border-top: 1px solid rgba(0, 255, 157, 0.3);
    padding-top: 10px;
  }
  
  /* 移动设备上更大的播放列表 */
  .xi-music-player.mobile .playlist-container {
    max-height: 200px;
    padding-top: 15px;
  }
  
  .xi-music-player .playlist-container h3 {
    font-size: 14px;
    margin-top: 0;
        margin-bottom: 5px;
    color: #00ff9d;
  }
  
  /* 移动设备上更大的标题 */
  .xi-music-player.mobile .playlist-container h3 {
    font-size: 16px;
    margin-bottom: 10px;
  }
  
  .xi-music-player ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .xi-music-player ul li {
    padding: 5px 10px;
    cursor: pointer;
    font-size: 12px;
    border-radius: 3px;
    transition: all 0.2s ease;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  /* 移动设备上的列表项优化 */
  .xi-music-player.mobile .touch-list li {
    padding: 12px 15px;
    font-size: 14px;
    margin-bottom: 5px;
  }
  
  .xi-music-player ul li:hover,
  .xi-music-player ul li:active {
    background-color: rgba(0, 255, 157, 0.2);
      }
      
      .xi-music-player ul li.active {
        background-color: rgba(0, 255, 157, 0.3);
    color: #fff;
  }
  
  /* 歌词容器样式 */
  .xi-music-player .lyrics-container {
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 15px;
    border-left: 2px solid #00ff9d;
    display: block;
  }
  
  .xi-music-player .current-lyric {
        color: #00ff9d;
    font-size: 13px;
    margin-bottom: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    animation: fadeIn 0.5s ease;
  }
  
  .xi-music-player .next-lyric {
    color: rgba(255, 255, 255, 0.7);
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .xi-music-player.mobile .current-lyric {
    font-size: 14px;
  }
  
  .xi-music-player.mobile .next-lyric {
    font-size: 13px;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(5px); }
    to { opacity: 1; transform: translateY(0); }
      }
    `;
    
    // 添加样式到头部
  const styleElement = document.createElement('style');
  styleElement.textContent = playerStyles;
  document.head.appendChild(styleElement);
  
    // 添加播放器到文档
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = playerHTML;
    const playerElement = tempContainer.firstElementChild;
    document.body.appendChild(playerElement);
    
    return playerElement;
  }
  
  // 创建音频元素
  function createAudioElement() {
    // 删除任何现有的音频元素
    const existingAudio = document.getElementById('xiMusicAudio');
    if (existingAudio && existingAudio.parentNode) {
      existingAudio.parentNode.removeChild(existingAudio);
    }
    
    // 创建新的音频元素
    const audio = document.createElement('audio');
    audio.id = 'xiMusicAudio';
    
    // 添加恢复播放相关属性
    audio.preload = 'auto';  // 预加载音频
    audio.autoplay = true;   // 尝试自动播放
    audio.crossOrigin = 'anonymous'; // 处理跨域资源
    
    // 添加到文档
    document.body.appendChild(audio);
    
    return audio;
  }
  
  // 显示播放列表
  function renderPlaylist() {
    if (!playlistElement) return;
    
    const playlist = playlists[state.currentPlaylist];
    if (!playlist) return;
    
    // 清空列表
    playlistElement.innerHTML = '';
    
    // 添加列表项
    playlist.forEach((track, index) => {
        const li = document.createElement('li');
        li.textContent = track.title;
      
      // 高亮当前曲目
      if (index === state.currentTrack) {
        li.classList.add('active');
      }
      
      // 点击播放
      li.addEventListener('click', () => {
        state.currentTrack = index;
        localStorage.setItem(`${STORAGE_PREFIX}currentTrack`, index);
          loadAndPlayTrack();
      });
      
      playlistElement.appendChild(li);
    });
  }
  
  // 加载并播放当前曲目
  function loadAndPlayTrack() {
    if (!audioElement || state.currentTrack >= playlists[state.currentPlaylist].length) return;
    
    // 获取当前曲目
    const currentTrack = state.currentTrack;
    const track = playlists[state.currentPlaylist][currentTrack];
    
    // 保存当前曲目
    localStorage.setItem(`${STORAGE_PREFIX}currentTrack`, currentTrack);
    localStorage.setItem(`${STORAGE_PREFIX}currentPlaylist`, state.currentPlaylist);
    
    // 重置歌词状态
    state.currentLyrics = null;
    state.currentLyricIndex = -1;
    
    try {
      // 获取音频URL
      const basePath = getBasePath();
      const fullPath = `${basePath}${track.file}`;
    
      // 更新显示
    if (musicInfo) {
        musicInfo.textContent = `加载中... ${track.title}`;
    }
    
      // 更新状态显示
      const statusElement = document.getElementById('xiMusic_status');
      if (statusElement) {
        statusElement.textContent = "状态：加载中...";
      }
      
      // 加载歌词
      loadLyrics(track.id);
    
    // 设置音频源
    audioElement.src = fullPath;
      audioElement.load();
    
      // 检查是否是同一首歌并且有上次播放位置
      const resumePosition = state.lastPosition > 0 && 
                             localStorage.getItem(`${STORAGE_PREFIX}lastTrack`) === currentTrack.toString() &&
                             localStorage.getItem(`${STORAGE_PREFIX}lastPlaylist`) === state.currentPlaylist;
      
      // 如果需要从上次位置继续，设置当前时间
      if (resumePosition) {
        audioElement.currentTime = state.lastPosition;
      } else {
        // 重置上次播放位置
        state.lastPosition = 0;
        localStorage.setItem(`${STORAGE_PREFIX}lastPosition`, 0);
      }
    
    // 播放
    const playPromise = audioElement.play();
      
    if (playPromise !== undefined) {
      playPromise.then(() => {
          // 播放成功
        state.playing = true;
        localStorage.setItem(`${STORAGE_PREFIX}isPlaying`, 'true');
        
          // 保存当前曲目信息用于恢复播放位置
          localStorage.setItem(`${STORAGE_PREFIX}lastTrack`, currentTrack);
          localStorage.setItem(`${STORAGE_PREFIX}lastPlaylist`, state.currentPlaylist);
          
          // 启动位置保存定时器
          startPositionSaveTimer();
          
        if (playPauseBtn) {
            playPauseBtn.textContent = '❚❚';
        }
          
          // 更新曲目信息
          if (musicInfo) {
            musicInfo.textContent = track.title;
          }
          
          // 更新状态显示
          if (statusElement) {
            statusElement.textContent = resumePosition ? "状态：从上次位置继续播放" : "状态：正在播放";
            
            // 如果从上次位置继续，延迟2秒后恢复正常状态显示
            if (resumePosition) {
              setTimeout(() => {
                if (statusElement && state.playing) {
                  statusElement.textContent = "状态：正在播放";
                }
              }, 2000);
            }
          }
          
          // 更新播放列表高亮
          renderPlaylist();
      }).catch(error => {
          // 播放失败（通常是浏览器限制自动播放）
        console.error('[XiMusic] 播放失败:', error);
        
        // 重要：即使播放失败，仍然记录"正在播放"状态，以便下次加载页面时可以再次尝试播放
        // 这样页面跳转后回来，音乐播放器会尝试继续播放
        localStorage.setItem(`${STORAGE_PREFIX}isPlaying`, 'true');
        
        // 为提示用户交互而临时设置为非播放状态
        state.playing = false;
          
        // 停止位置保存定时器
        stopPositionSaveTimer();
          
        if (playPauseBtn) {
          playPauseBtn.textContent = '▶';
        }
          
        // 更新状态显示
        if (statusElement) {
          statusElement.textContent = "状态：点击播放按钮开始，浏览器已阻止自动播放";
        }
      });
    }
  } catch (error) {
    console.error('[XiMusic] 加载音频失败:', error);
    
    // 更新状态显示
    const statusElement = document.getElementById('xiMusic_status');
    if (statusElement) {
      statusElement.textContent = "状态：加载失败";
    }
    
    // 停止位置保存定时器
    stopPositionSaveTimer();
  }
}
  
  // 暂停播放
  function pausePlayback() {
    if (!audioElement) return;
    
    audioElement.pause();
    state.playing = false;
    localStorage.setItem(`${STORAGE_PREFIX}isPlaying`, 'false');
    
    // 保存当前播放位置
    saveCurrentPosition();
    
    // 停止位置保存定时器
    stopPositionSaveTimer();
    
    if (playPauseBtn) {
      playPauseBtn.textContent = '▶';
    }
    
    // 更新状态显示
    const statusElement = document.getElementById('xiMusic_status');
    if (statusElement) {
      statusElement.textContent = "状态：已暂停";
    }
  }
  
  // 启动播放位置保存定时器
  function startPositionSaveTimer() {
    // 先清除旧的定时器
    stopPositionSaveTimer();
    
    // 启动新定时器
    positionSaveTimer = setInterval(() => {
      saveCurrentPosition();
    }, POSITION_SAVE_INTERVAL);
  }
  
  // 停止播放位置保存定时器
  function stopPositionSaveTimer() {
    if (positionSaveTimer) {
      clearInterval(positionSaveTimer);
      positionSaveTimer = null;
    }
  }
  
  // 保存当前播放位置
  function saveCurrentPosition() {
    if (!audioElement || !audioElement.duration) return;
    
    // 只有当播放时间大于1秒时才保存位置，避免保存无意义的位置
    if (audioElement.currentTime > 1) {
      state.lastPosition = audioElement.currentTime;
      localStorage.setItem(`${STORAGE_PREFIX}lastPosition`, audioElement.currentTime);
      console.log(`[XiMusic] 保存播放位置: ${audioElement.currentTime}秒`);
    }
  }
  
  // 获取播放模式图标
  function getPlayModeIcon(mode) {
    switch (mode) {
      case PLAY_MODES.LOOP_ONE:
        return '🔂'; // 单曲循环
      case PLAY_MODES.LOOP_ALL:
        return '🔁'; // 列表循环
      case PLAY_MODES.RANDOM:
        return '🔀'; // 随机播放
      case PLAY_MODES.NORMAL:
      default:
        return '➡️'; // 顺序播放
    }
  }
  
  // 加载歌词文件
  async function loadLyrics(trackId) {
    try {
      // 清空当前歌词状态
      state.currentLyrics = null;
      state.currentLyricIndex = -1;
      
      // 更新DOM
      if (currentLyricElement) {
        currentLyricElement.textContent = "加载歌词中...";
      }
      if (nextLyricElement) {
        nextLyricElement.textContent = "";
      }
      
      // 获取基础路径
      const basePath = getBasePath();
      const lyricsPath = `${basePath}/music/lyrics/${trackId}.json`;
      
      // 尝试加载歌词文件
      const response = await fetch(lyricsPath);
      
      // 如果文件不存在
      if (!response.ok) {
        if (currentLyricElement) {
          currentLyricElement.textContent = "无歌词";
        }
        return false;
      }
      
      // 解析歌词JSON
      const lyricsData = await response.json();
      
      // 验证歌词格式
      if (!Array.isArray(lyricsData.lyrics)) {
        throw new Error("歌词格式不正确");
      }
      
      // 存储歌词数据
      state.currentLyrics = lyricsData.lyrics;
      
      // 显示第一句歌词(如果有)
      updateLyricDisplay();
    
        return true;
    } catch (error) {
      console.error('[XiMusic] 加载歌词失败:', error);
      
      if (currentLyricElement) {
        currentLyricElement.textContent = "歌词加载失败";
      }
      
      return false;
    }
  }
  
  // 更新歌词显示
  function updateLyricDisplay() {
    if (!state.currentLyrics || !currentLyricElement || !nextLyricElement) return;
    
    // 如果没有歌词显示"无歌词"
    if (state.currentLyrics.length === 0) {
      currentLyricElement.textContent = "无歌词";
      nextLyricElement.textContent = "";
      return;
    }
    
    // 如果当前歌词索引有效，更新显示
    if (state.currentLyricIndex >= 0 && state.currentLyricIndex < state.currentLyrics.length) {
      // 显示当前歌词
      currentLyricElement.textContent = state.currentLyrics[state.currentLyricIndex].text;
      
      // 显示下一句歌词（如果有）
      if (state.currentLyricIndex + 1 < state.currentLyrics.length) {
        nextLyricElement.textContent = state.currentLyrics[state.currentLyricIndex + 1].text;
      } else {
        nextLyricElement.textContent = "";
      }
    }
  }
  
  // 同步歌词显示
  function syncLyrics(currentTime) {
    if (!state.currentLyrics || !state.lyricsVisible) return;
    
    // 使用二分查找算法优化大型歌词文件的查找速度
    let left = 0;
    let right = state.currentLyrics.length - 1;
    let foundIndex = -1;
    
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const lyricTime = state.currentLyrics[mid].time;
      
      if (lyricTime <= currentTime) {
        foundIndex = mid;
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
    
    // 如果找到了新的歌词，且与当前歌词不同，更新显示
    if (foundIndex !== -1 && foundIndex !== state.currentLyricIndex) {
      state.currentLyricIndex = foundIndex;
      updateLyricDisplay();
    }
  }
  
  // 切换播放模式
  function togglePlayMode() {
    // 按顺序循环切换模式
    switch (state.playMode) {
      case PLAY_MODES.NORMAL:
        state.playMode = PLAY_MODES.LOOP_ALL;
        break;
      case PLAY_MODES.LOOP_ALL:
        state.playMode = PLAY_MODES.LOOP_ONE;
        break;
      case PLAY_MODES.LOOP_ONE:
        state.playMode = PLAY_MODES.RANDOM;
        break;
      case PLAY_MODES.RANDOM:
      default:
        state.playMode = PLAY_MODES.NORMAL;
        break;
    }
    
    // 保存到本地存储
    localStorage.setItem(`${STORAGE_PREFIX}playMode`, state.playMode);
    
    // 更新按钮图标
    if (playModeBtn) {
      playModeBtn.innerHTML = getPlayModeIcon(state.playMode);
    }
    
    // 更新状态显示
    const statusElement = document.getElementById('xiMusic_status');
    if (statusElement) {
      let modeText = '';
      switch (state.playMode) {
        case PLAY_MODES.LOOP_ONE:
          modeText = '单曲循环';
          break;
        case PLAY_MODES.LOOP_ALL:
          modeText = '列表循环';
          break;
        case PLAY_MODES.RANDOM:
          modeText = '随机播放';
          break;
        case PLAY_MODES.NORMAL:
          modeText = '顺序播放';
          break;
      }
      
      statusElement.textContent = `状态：已切换到${modeText}模式`;
      
      // 2秒后恢复原状态显示
      setTimeout(() => {
        if (statusElement) {
          if (state.playing) {
            statusElement.textContent = "状态：正在播放";
          } else {
            statusElement.textContent = "状态：已暂停";
          }
        }
      }, 2000);
    }
    
    console.log(`[XiMusic] 播放模式已切换: ${state.playMode}`);
    return state.playMode;
  }
  
  // 下一曲（增加播放模式处理）
  function playNext() {
    const playlist = playlists[state.currentPlaylist];
    if (!playlist || playlist.length === 0) return false;
    
    // 保存当前播放位置（如果有必要的话）
    saveCurrentPosition();
    
    // 重置位置和曲目信息
    state.lastPosition = 0;
    localStorage.setItem(`${STORAGE_PREFIX}lastPosition`, 0);
    
    // 根据播放模式选择下一曲
    switch (state.playMode) {
      case PLAY_MODES.LOOP_ONE:
        // 单曲循环直接重新加载当前歌曲
        return loadAndPlayTrack();
        
      case PLAY_MODES.RANDOM:
        // 随机播放模式，随机选择一首歌曲
        // 保存当前曲目到历史
        if (state.currentTrack !== undefined) {
          state.randomHistory.push(state.currentTrack);
        }
        
        // 如果只有一首歌，直接返回
        if (playlist.length === 1) {
          return loadAndPlayTrack();
        }
        
        // 随机选择与当前不同的曲目
        let randomIndex;
        do {
          randomIndex = Math.floor(Math.random() * playlist.length);
        } while (randomIndex === state.currentTrack && playlist.length > 1);
        
        state.currentTrack = randomIndex;
        break;
        
      case PLAY_MODES.LOOP_ALL:
      case PLAY_MODES.NORMAL:
      default:
        // 常规顺序播放，到列表末尾时的处理有所不同
        if (state.currentTrack === playlist.length - 1) {
          // 列表末尾
          if (state.playMode === PLAY_MODES.LOOP_ALL) {
            // 列表循环模式：回到列表开始
            state.currentTrack = 0;
          } else {
            // 普通模式：保持在最后一曲，不播放
            return pausePlayback();
          }
        } else {
          // 正常切换到下一曲
    state.currentTrack = (state.currentTrack + 1) % playlist.length;
        }
        break;
    }
    
    // 保存当前曲目索引
    localStorage.setItem(`${STORAGE_PREFIX}currentTrack`, state.currentTrack);
    
    return loadAndPlayTrack();
  }
  
  // 上一曲（增加播放模式处理）
  function playPrevious() {
    const playlist = playlists[state.currentPlaylist];
    if (!playlist || playlist.length === 0) return false;
    
    // 保存当前播放位置（如果有必要的话）
    saveCurrentPosition();
    
    // 重置位置和曲目信息
    state.lastPosition = 0;
    localStorage.setItem(`${STORAGE_PREFIX}lastPosition`, 0);
    
    // 根据播放模式选择上一曲
    switch (state.playMode) {
      case PLAY_MODES.LOOP_ONE:
        // 单曲循环模式下，仍然返回上一曲
    state.currentTrack = (state.currentTrack - 1 + playlist.length) % playlist.length;
        break;
        
      case PLAY_MODES.RANDOM:
        // 随机播放模式下，从历史记录返回
        if (state.randomHistory.length > 0) {
          state.currentTrack = state.randomHistory.pop();
        } else {
          // 没有历史记录时，按顺序返回上一曲
          state.currentTrack = (state.currentTrack - 1 + playlist.length) % playlist.length;
        }
        break;
        
      case PLAY_MODES.LOOP_ALL:
      case PLAY_MODES.NORMAL:
      default:
        // 常规模式，顺序返回上一曲
        state.currentTrack = (state.currentTrack - 1 + playlist.length) % playlist.length;
        break;
    }
    
    // 保存当前曲目索引
    localStorage.setItem(`${STORAGE_PREFIX}currentTrack`, state.currentTrack);
    
    return loadAndPlayTrack();
  }
  
  // 更新播放进度
  function updateProgress() {
    if (!audioElement || !progressCurrent || !currentTimeDisplay || !totalTimeDisplay) return;
    
    if (audioElement.duration) {
      // 计算百分比
      const percentage = (audioElement.currentTime / audioElement.duration) * 100;
      progressCurrent.style.width = `${percentage}%`;
      
      // 更新时间显示
      const currentMins = Math.floor(audioElement.currentTime / 60);
      const currentSecs = Math.floor(audioElement.currentTime % 60);
      const totalMins = Math.floor(audioElement.duration / 60);
      const totalSecs = Math.floor(audioElement.duration % 60);
      
      currentTimeDisplay.textContent = `${currentMins}:${currentSecs < 10 ? '0' + currentSecs : currentSecs}`;
      totalTimeDisplay.textContent = `${totalMins}:${totalSecs < 10 ? '0' + totalSecs : totalSecs}`;
      
      // 同步歌词
      syncLyrics(audioElement.currentTime);
      
      // 更新状态显示
      const statusElement = document.getElementById('xiMusic_status');
      if (statusElement) {
        if (state.playing) {
          statusElement.textContent = "状态：正在播放";
        } else {
          statusElement.textContent = "状态：已暂停";
        }
      }
    }
  }
  
  // 切换播放/暂停
    function togglePlay() {
    if (state.playing) {
      pausePlayback();
      } else {
        loadAndPlayTrack();
      }
    }
    
  // 绑定事件
  function bindEvents() {
    if (!audioElement) return;
    
    // 监听播放结束事件，根据播放模式自动处理
    audioElement.addEventListener('ended', () => {
      // 清除位置记忆
      state.lastPosition = 0;
      localStorage.setItem(`${STORAGE_PREFIX}lastPosition`, 0);
      
      // 根据播放模式处理播放结束事件
      switch (state.playMode) {
        case PLAY_MODES.LOOP_ONE:
          // 单曲循环：重新播放当前曲目
          audioElement.currentTime = 0;
          audioElement.play();
          break;
          
        default:
          // 其他模式：播放下一曲
          playNext();
          break;
      }
    });
    
    // 监听时间更新事件，更新进度条
    audioElement.addEventListener('timeupdate', updateProgress);
    
    // 绑定播放/暂停按钮
    if (playPauseBtn) {
      playPauseBtn.addEventListener('click', togglePlay);
    }
    
    // 绑定上一曲按钮
    if (prevBtn) {
      prevBtn.addEventListener('click', playPrevious);
    }
    
    // 绑定下一曲按钮
    if (nextBtn) {
      nextBtn.addEventListener('click', playNext);
    }
    
    // 绑定音量控制
    if (volumeControl) {
      volumeControl.addEventListener('input', (e) => {
        if (!audioElement) return;
        
        const volume = parseFloat(e.target.value);
        audioElement.volume = volume;
        state.volume = volume;
        
        // 保存音量设置
        localStorage.setItem(`${STORAGE_PREFIX}volume`, volume);
        
        // 如果音量大于0，取消静音状态
        if (volume > 0 && state.muted) {
          state.muted = false;
          audioElement.muted = false;
          localStorage.setItem(`${STORAGE_PREFIX}muted`, 'false');
        }
      });
    }
    
    // 绑定进度条点击事件
    if (progressBar) {
      // 替换点击事件处理，同时支持鼠标和触摸事件
      const handleProgressBarInteraction = (e) => {
        if (!audioElement || !audioElement.duration) return;
        
        // 获取鼠标或触摸位置
        const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const rect = progressBar.getBoundingClientRect();
        const clickPosition = clientX - rect.left;
        const percentage = clickPosition / rect.width;
        
        // 设置当前播放位置
        audioElement.currentTime = percentage * audioElement.duration;
      };
      
      // 移除旧的事件监听器
      progressBar.removeEventListener('click', handleProgressBarInteraction);
      
      // 添加鼠标和触摸事件支持
      progressBar.addEventListener('click', handleProgressBarInteraction);
      
      // 触摸设备支持
      if (isMobile) {
        progressBar.addEventListener('touchstart', handleProgressBarInteraction);
      }
    }
    
    // 绑定播放器切换按钮
    const playerToggle = document.getElementById('xiMusic_playerToggle');
    const playerContainer = document.querySelector('.player-container');
    
    if (playerToggle && playerContainer) {
      playerToggle.addEventListener('click', () => {
        playerContainer.classList.toggle('active');
        // 保存UI显示状态到本地存储
        state.uiVisible = playerContainer.classList.contains('active');
        localStorage.setItem(`${STORAGE_PREFIX}uiVisible`, state.uiVisible);
      });
    }
    
    // 绑定播放模式切换按钮
    playModeBtn = document.getElementById('xiMusic_playMode');
    if (playModeBtn) {
      playModeBtn.addEventListener('click', togglePlayMode);
      }
  }
  
  // 初始化播放器
  function initializePlayer() {
    // 创建UI
    playerContainer = createPlayerUI();
    
    // 创建音频元素
    audioElement = createAudioElement();
    
    // 获取UI元素
    playPauseBtn = document.getElementById('xiMusic_playPause');
    prevBtn = document.getElementById('xiMusic_prevTrack');
    nextBtn = document.getElementById('xiMusic_nextTrack');
    volumeControl = document.getElementById('xiMusic_volumeControl');
    progressBar = document.getElementById('xiMusic_progressBar');
    progressCurrent = document.getElementById('xiMusic_progressCurrent');
    musicInfo = document.getElementById('xiMusic_musicInfo');
    playlistElement = document.getElementById('xiMusic_playlist');
    currentTimeDisplay = document.getElementById('xiMusic_currentTime');
    totalTimeDisplay = document.getElementById('xiMusic_totalTime');
    playModeBtn = document.getElementById('xiMusic_playMode');
    lyricsContainer = document.getElementById('xiMusic_lyricsContainer');
    currentLyricElement = document.getElementById('xiMusic_currentLyric');
    nextLyricElement = document.getElementById('xiMusic_nextLyric');
    
    // 设置音量
    if (audioElement && volumeControl) {
      audioElement.volume = state.volume;
      audioElement.muted = state.muted;
      volumeControl.value = state.volume;
    }
    
    // 渲染播放列表
    renderPlaylist();
    
    // 绑定事件
    bindEvents();
    
    // 设置初始状态
    const statusElement = document.getElementById('xiMusic_status');
    if (statusElement) {
      statusElement.textContent = "状态：就绪";
    }
    
    // 如果之前在播放，则自动继续播放
    const wasPlaying = localStorage.getItem(`${STORAGE_PREFIX}isPlaying`) === 'true';
    if (wasPlaying) {
      // 延迟一下再播放，等待UI完全初始化
      setTimeout(() => {
        // 强制自动播放，无需用户交互
        loadAndPlayTrack();
        // 如果因浏览器策略无法自动播放，设置状态提示用户点击
        if (audioElement && audioElement.paused) {
          if (statusElement) {
            statusElement.textContent = "状态：点击播放按钮继续";
          }
          console.log('[XiMusic] 自动播放受阻，需要用户交互');
        }
      }, 500);
    } else {
      // 只加载曲目信息
      const track = playlists[state.currentPlaylist][state.currentTrack];
      if (track && musicInfo) {
        musicInfo.textContent = track.title;
      }
    }
    
    // 标记为已初始化
    state.initialized = true;
    
    return true;
  }
  
  // 销毁播放器时清理
  function cleanupBeforeDestroy() {
    // 停止位置保存定时器
    stopPositionSaveTimer();
    
    // 如果正在播放，保存当前位置
    if (state.playing && audioElement) {
      saveCurrentPosition();
    }
  }
  
  // 模块API
  const api = {
    // 初始化
    init() {
      if (state.initialized) return;
      initializePlayer();
    },
    
    // 播放
    play() {
      if (!state.initialized) this.init();
      return loadAndPlayTrack();
    },
    
    // 暂停
    pause() {
      if (!state.initialized) return false;
      return pausePlayback();
    },
    
    // 切换播放/暂停
    togglePlay() {
      if (!state.initialized) this.init();
      return togglePlay();
    },
    
    // 下一曲
    next() {
      if (!state.initialized) this.init();
      return playNext();
    },
    
    // 上一曲
    previous() {
      if (!state.initialized) this.init();
      return playPrevious();
    },
    
    // 设置音量
    setVolume(volume) {
      if (typeof volume !== 'number' || volume < 0 || volume > 1) return false;
      
      state.volume = volume;
      if (audioElement) {
        audioElement.volume = volume;
      }
      
      if (volumeControl) {
        volumeControl.value = volume;
      }
      
      localStorage.setItem(`${STORAGE_PREFIX}volume`, volume);
      return true;
    },
    
    // 切换静音
    toggleMute() {
      state.muted = !state.muted;
      
      if (audioElement) {
        audioElement.muted = state.muted;
      }
      
      localStorage.setItem(`${STORAGE_PREFIX}muted`, state.muted ? 'true' : 'false');
      return state.muted;
    },
    
    // 加载播放列表
    loadPlaylist(playlistId) {
      if (!playlists[playlistId]) return false;
      
      state.currentPlaylist = playlistId;
      localStorage.setItem(`${STORAGE_PREFIX}currentPlaylist`, playlistId);
      
      renderPlaylist();
      return true;
    },
    
    // 播放特定曲目
    playTrack(trackId) {
      const playlist = playlists[state.currentPlaylist];
      if (!playlist) return false;
      
      const trackIndex = playlist.findIndex(track => track.id === trackId);
      if (trackIndex === -1) return false;
      
      state.currentTrack = trackIndex;
      localStorage.setItem(`${STORAGE_PREFIX}currentTrack`, trackIndex);
      
      return loadAndPlayTrack();
    },
    
    // 获取当前状态
    getState() {
      return { ...state };
    },
    
    // 切换UI显示
    toggleUI() {
      const container = document.querySelector('.xi-music-player .player-container');
      if (container) {
        container.classList.toggle('active');
        // 保存UI显示状态到本地存储
        state.uiVisible = container.classList.contains('active');
        localStorage.setItem(`${STORAGE_PREFIX}uiVisible`, state.uiVisible);
        return state.uiVisible;
      }
      return false;
    },
    
    // 添加自定义播放列表
    addPlaylist(id, tracks) {
      if (!id || !Array.isArray(tracks) || tracks.length === 0) return false;
      
      playlists[id] = tracks;
    return true;
    },
    
    // 销毁播放器
    destroy() {
      if (!state.initialized) return;
      
      // 清理资源
      cleanupBeforeDestroy();
      
      if (audioElement) {
        audioElement.pause();
        audioElement.src = '';
      }
      
      safelyRemoveExistingPlayer();
      state.initialized = false;
    },
    
    // 检查是否在移动设备上
    isMobileDevice() {
      return isMobile;
    },
    
    // 获取上次播放位置
    getLastPosition() {
      return state.lastPosition;
    },
    
    // 设置上次播放位置
    setLastPosition(position) {
      if (typeof position !== 'number' || position < 0) return false;
      
      state.lastPosition = position;
      localStorage.setItem(`${STORAGE_PREFIX}lastPosition`, position);
      
      if (audioElement && state.playing) {
        audioElement.currentTime = position;
      }
      
      return true;
    },
    
    // 清除播放位置记忆
    clearLastPosition() {
      state.lastPosition = 0;
      localStorage.setItem(`${STORAGE_PREFIX}lastPosition`, 0);
      return true;
    },
    
    // 获取当前播放模式
    getPlayMode() {
      return state.playMode;
    },
    
    // 设置播放模式
    setPlayMode(mode) {
      if (!Object.values(PLAY_MODES).includes(mode)) {
        return false;
      }
      
      state.playMode = mode;
      localStorage.setItem(`${STORAGE_PREFIX}playMode`, mode);
      
      // 更新按钮图标
      if (playModeBtn) {
        playModeBtn.innerHTML = getPlayModeIcon(mode);
      }
      
      return true;
    },
    
    // 获取播放模式枚举
    getPlayModes() {
      return { ...PLAY_MODES };
    },
    
    // 循环切换播放模式
    togglePlayMode() {
      return togglePlayMode();
    },
    
    // 获取当前歌词数据
    getCurrentLyrics() {
      return state.currentLyrics ? [...state.currentLyrics] : null;
    },
    
    // 获取当前歌词索引
    getCurrentLyricIndex() {
      return state.currentLyricIndex;
    },
    
    // 手动加载歌词
    loadLyrics(trackId) {
      return loadLyrics(trackId);
    }
  };
  
  // 如果XiCore已加载，注册模块
  if (window.XiCore) {
    window.XiCore.registerModule('music', api);
  } 
  
  // 独立模式自动初始化
  if (isStandalone) {
    console.log('[XiMusic] 作为独立播放器运行');
    setTimeout(() => {
      api.init();
    }, 0);
  }
  
  // 全局接口，确保与global-music-player.js兼容
  window.MusicPlayer = api;
  
  return api;
})();

// 确保在Node环境中可导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = XiMusic;
} 