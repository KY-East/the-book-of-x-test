/**
 * xi-music.js - XiCore音乐播放器模块
 * 
 * 精简版 - 仅包含核心功能，移除主题系统
 * 版本: 2.0.0
 * 日期: 2024-07-28
 */

const XiMusic = (function() {
  // 是否作为独立脚本运行
  const isStandalone = typeof window.XiCore === 'undefined';
  
  // 存储前缀
  const STORAGE_PREFIX = 'xiMusic_';
  
  // 模块状态
  const state = {
    initialized: false,
    playing: false,
    currentTrack: localStorage.getItem(`${STORAGE_PREFIX}currentTrack`) 
      ? parseInt(localStorage.getItem(`${STORAGE_PREFIX}currentTrack`)) : 0,
    currentPlaylist: localStorage.getItem(`${STORAGE_PREFIX}currentPlaylist`) || 'default',
    volume: localStorage.getItem(`${STORAGE_PREFIX}volume`) 
      ? parseFloat(localStorage.getItem(`${STORAGE_PREFIX}volume`)) : 0.5,
    muted: localStorage.getItem(`${STORAGE_PREFIX}muted`) === 'true'
  };
  
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
    
    // 创建播放器HTML
  const playerHTML = `
  <div class="xi-music-player">
    <button id="${idPrefix}playerToggle" class="player-toggle">
      <i class="toggle-icon">🎵</i>
    </button>
    <div class="player-container">
      <div class="player-header">
        <div id="${idPrefix}musicInfo">未播放</div>
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
            <input type="range" id="${idPrefix}volumeControl" min="0" max="1" step="0.1" value="${state.volume}">
      </div>
      <div class="playlist-container">
        <h3>播放列表</h3>
            <ul id="${idPrefix}playlist"></ul>
      </div>
    </div>
      </div>
    `;
    
    // 创建样式
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
  
  .xi-music-player .player-toggle:hover {
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
  }
  
  .xi-music-player .progress-bar {
    height: 5px;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
    margin-bottom: 5px;
    cursor: pointer;
  }
  
  .xi-music-player .progress-current {
    height: 100%;
    background-color: #00ff9d;
    border-radius: 2px;
    width: 0%;
  }
  
  .xi-music-player .volume-container {
    display: flex;
    align-items: center;
        margin: 15px 0;
  }
  
  .xi-music-player .volume-container label {
    margin-right: 10px;
  }
  
  .xi-music-player .playlist-container {
        max-height: 150px;
    overflow-y: auto;
  }
  
  .xi-music-player .playlist-container h3 {
    font-size: 14px;
        margin-bottom: 5px;
  }
  
  .xi-music-player ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .xi-music-player ul li {
        padding: 5px;
    font-size: 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    cursor: pointer;
  }
  
  .xi-music-player ul li:hover {
    background-color: rgba(0, 255, 157, 0.2);
      }
      
      .xi-music-player ul li.active {
        background-color: rgba(0, 255, 157, 0.3);
        color: #00ff9d;
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
    // 检查是否已存在
    let audio = document.getElementById('xiMusicAudio');
    
    if (!audio) {
      audio = document.createElement('audio');
      audio.id = 'xiMusicAudio';
      audio.style.display = 'none';
      document.body.appendChild(audio);
    }
    
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
    const playlist = playlists[state.currentPlaylist];
    if (!playlist || playlist.length === 0) return false;
    
    // 获取当前曲目
    const track = playlist[state.currentTrack];
    if (!track) return false;
    
    // 更新UI
    if (musicInfo) {
      musicInfo.textContent = track.title;
    }
    
    // 播放列表高亮
    renderPlaylist();
    
    // 处理路径
    const basePath = getBasePath();
    const filePath = track.file.startsWith('/') ? track.file.substring(1) : track.file;
    const fullPath = `${basePath}/${filePath}`;
    
    // 设置音频源
    audioElement.src = fullPath;
    
    // 恢复位置（如果有）
    const savedTime = localStorage.getItem(`${STORAGE_PREFIX}currentTime`);
    if (savedTime) {
      audioElement.currentTime = parseFloat(savedTime);
    }
    
    // 设置音量
    audioElement.volume = state.volume;
    audioElement.muted = state.muted;
    
    // 播放
    const playPromise = audioElement.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        state.playing = true;
        localStorage.setItem(`${STORAGE_PREFIX}isPlaying`, 'true');
        
        // 更新播放/暂停按钮
        if (playPauseBtn) {
          playPauseBtn.textContent = '⏸';
        }
      }).catch(error => {
        console.error('[XiMusic] 播放失败:', error);
        state.playing = false;
      });
    }
    
    return true;
  }
  
  // 暂停播放
  function pausePlayback() {
    if (!audioElement) return false;
    
    audioElement.pause();
    state.playing = false;
    localStorage.setItem(`${STORAGE_PREFIX}isPlaying`, 'false');
    
    // 更新播放/暂停按钮
    if (playPauseBtn) {
      playPauseBtn.textContent = '▶';
    }
    
        return true;
  }
  
  // 下一曲
  function playNext() {
    const playlist = playlists[state.currentPlaylist];
    if (!playlist || playlist.length === 0) return false;
    
    state.currentTrack = (state.currentTrack + 1) % playlist.length;
    localStorage.setItem(`${STORAGE_PREFIX}currentTrack`, state.currentTrack);
    
    return loadAndPlayTrack();
  }
  
  // 上一曲
  function playPrevious() {
    const playlist = playlists[state.currentPlaylist];
    if (!playlist || playlist.length === 0) return false;
    
    state.currentTrack = (state.currentTrack - 1 + playlist.length) % playlist.length;
    localStorage.setItem(`${STORAGE_PREFIX}currentTrack`, state.currentTrack);
    
    return loadAndPlayTrack();
  }
  
  // 更新播放进度
  function updateProgress() {
    if (!audioElement || !progressCurrent) return;
    
    if (audioElement.duration) {
      // 更新进度条
      const percentage = (audioElement.currentTime / audioElement.duration) * 100;
      progressCurrent.style.width = `${percentage}%`;
      
      // 更新时间
      const currentMinutes = Math.floor(audioElement.currentTime / 60);
      const currentSeconds = Math.floor(audioElement.currentTime % 60);
      const totalMinutes = Math.floor(audioElement.duration / 60);
      const totalSeconds = Math.floor(audioElement.duration % 60);
      
      if (currentTimeDisplay) {
        currentTimeDisplay.textContent = `${currentMinutes}:${currentSeconds < 10 ? '0' : ''}${currentSeconds}`;
      }
      
      if (totalTimeDisplay) {
        totalTimeDisplay.textContent = `${totalMinutes}:${totalSeconds < 10 ? '0' : ''}${totalSeconds}`;
      }
      
      // 每秒存储一次进度（避免频繁写入）
      if (Math.floor(audioElement.currentTime) % 1 === 0) {
        localStorage.setItem(`${STORAGE_PREFIX}currentTime`, audioElement.currentTime);
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
    // 播放器切换按钮
    const playerToggle = document.getElementById('xiMusic_playerToggle');
    if (playerToggle) {
      playerToggle.addEventListener('click', () => {
        const container = document.querySelector('.xi-music-player .player-container');
        if (container) {
          container.classList.toggle('active');
        }
      });
    }
    
    // 播放/暂停按钮
    if (playPauseBtn) {
      playPauseBtn.addEventListener('click', togglePlay);
    }
    
    // 上一曲按钮
    if (prevBtn) {
      prevBtn.addEventListener('click', playPrevious);
    }
    
    // 下一曲按钮
    if (nextBtn) {
      nextBtn.addEventListener('click', playNext);
    }
    
    // 音量控制
    if (volumeControl) {
      volumeControl.value = state.volume;
      volumeControl.addEventListener('input', () => {
        state.volume = parseFloat(volumeControl.value);
        if (audioElement) {
          audioElement.volume = state.volume;
        }
        localStorage.setItem(`${STORAGE_PREFIX}volume`, state.volume);
      });
    }
    
    // 进度条点击
    if (progressBar) {
      progressBar.addEventListener('click', (e) => {
        if (!audioElement || !audioElement.duration) return;
        
        const rect = progressBar.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        audioElement.currentTime = pos * audioElement.duration;
        localStorage.setItem(`${STORAGE_PREFIX}currentTime`, audioElement.currentTime);
      });
    }
    
    // 音频事件
    if (audioElement) {
      // 播放进度更新
      audioElement.addEventListener('timeupdate', updateProgress);
      
      // 播放结束自动下一曲
      audioElement.addEventListener('ended', playNext);
      
      // 元数据加载完成
      audioElement.addEventListener('loadedmetadata', updateProgress);
    }
    
    // 页面关闭前保存状态
    window.addEventListener('beforeunload', () => {
      if (audioElement) {
        localStorage.setItem(`${STORAGE_PREFIX}currentTime`, audioElement.currentTime);
        localStorage.setItem(`${STORAGE_PREFIX}isPlaying`, state.playing ? 'true' : 'false');
        localStorage.setItem(`${STORAGE_PREFIX}currentTrack`, state.currentTrack);
        localStorage.setItem(`${STORAGE_PREFIX}currentPlaylist`, state.currentPlaylist);
        localStorage.setItem(`${STORAGE_PREFIX}volume`, state.volume);
        localStorage.setItem(`${STORAGE_PREFIX}muted`, state.muted ? 'true' : 'false');
      }
    });
  }
  
  // 初始化播放器
  function initializePlayer() {
    // 清理现有播放器
    safelyRemoveExistingPlayer();
    
    // 创建播放器UI
    playerContainer = createPlayerUI();
    
    // 创建音频元素
    audioElement = createAudioElement();
    
    // 获取UI元素引用
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
    
    // 绑定事件
    bindEvents();
    
    // 渲染播放列表
    renderPlaylist();
    
    // 如果之前正在播放，恢复播放
    const wasPlaying = localStorage.getItem(`${STORAGE_PREFIX}isPlaying`) === 'true';
    if (wasPlaying) {
      loadAndPlayTrack();
    }
    
    state.initialized = true;
    console.log('[XiMusic] 初始化完成');
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
        return container.classList.contains('active');
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
      
      if (audioElement) {
        audioElement.pause();
        audioElement.src = '';
      }
      
      safelyRemoveExistingPlayer();
      state.initialized = false;
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