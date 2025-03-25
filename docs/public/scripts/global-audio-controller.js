/**
 * global-audio-controller.js
 * 全局音频控制系统 - 实现跨页面持续播放
 */

// 使用单例模式确保只有一个音频控制器实例
const GlobalAudioController = (function() {
  let instance;
  
  // 私有变量和方法
  function createInstance() {
    // 创建音频上下文
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let audioElement = null;
    let mediaSource = null;
    let gainNode = null;
    
    // 播放状态
    const state = {
      currentTrack: 0,
      isPlaying: false,
      volume: 0.3,
      currentTime: 0,
      duration: 0,
      playlist: []
    };
    
    // 事件监听器列表
    const listeners = {
      onTrackChange: [],
      onPlayStateChange: [],
      onVolumeChange: [],
      onTimeUpdate: [],
      onPlaylistUpdate: []
    };
    
    // 初始化音频系统
    function initAudio() {
      if (!audioElement) {
        audioElement = new Audio();
        mediaSource = audioContext.createMediaElementSource(audioElement);
        gainNode = audioContext.createGain();
        
        // 连接节点
        mediaSource.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // 设置初始音量
        gainNode.gain.value = state.volume;
        
        // 添加事件监听
        audioElement.addEventListener('timeupdate', handleTimeUpdate);
        audioElement.addEventListener('ended', handleTrackEnd);
        audioElement.addEventListener('error', handleError);
      }
    }
    
    // 事件处理函数
    function handleTimeUpdate() {
      state.currentTime = audioElement.currentTime;
      state.duration = audioElement.duration;
      notifyListeners('onTimeUpdate', {
        currentTime: state.currentTime,
        duration: state.duration
      });
    }
    
    function handleTrackEnd() {
      playNext();
    }
    
    function handleError(error) {
      console.error('音频播放错误:', error);
      // 尝试播放下一曲
      setTimeout(playNext, 1000);
    }
    
    // 通知所有监听器
    function notifyListeners(event, data) {
      listeners[event].forEach(callback => callback(data));
    }
    
    // 播放控制
    function play() {
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
      
      if (!state.isPlaying) {
        audioElement.play()
          .then(() => {
            state.isPlaying = true;
            notifyListeners('onPlayStateChange', { isPlaying: true });
          })
          .catch(error => {
            console.error('播放失败:', error);
          });
      }
    }
    
    function pause() {
      if (state.isPlaying) {
        audioElement.pause();
        state.isPlaying = false;
        notifyListeners('onPlayStateChange', { isPlaying: false });
      }
    }
    
    function playNext() {
      if (state.playlist.length > 0) {
        state.currentTrack = (state.currentTrack + 1) % state.playlist.length;
        loadAndPlay();
      }
    }
    
    function playPrevious() {
      if (state.playlist.length > 0) {
        state.currentTrack = (state.currentTrack - 1 + state.playlist.length) % state.playlist.length;
        loadAndPlay();
      }
    }
    
    function loadAndPlay() {
      if (state.playlist.length > 0) {
        const track = state.playlist[state.currentTrack];
        audioElement.src = track.url;
        play();
        notifyListeners('onTrackChange', { track });
      }
    }
    
    // 公共接口
    return {
      init() {
        initAudio();
        
        // 从localStorage恢复状态
        const savedState = JSON.parse(localStorage.getItem('globalAudioState') || '{}');
        if (savedState.volume) state.volume = savedState.volume;
        if (savedState.currentTrack) state.currentTrack = savedState.currentTrack;
        if (savedState.currentTime) state.currentTime = savedState.currentTime;
        
        // 定期保存状态
        setInterval(() => {
          localStorage.setItem('globalAudioState', JSON.stringify({
            volume: state.volume,
            currentTrack: state.currentTrack,
            currentTime: state.currentTime
          }));
        }, 1000);
      },
      
      // 播放控制
      play,
      pause,
      playNext,
      playPrevious,
      
      // 播放列表管理
      setPlaylist(playlist) {
        state.playlist = playlist;
        notifyListeners('onPlaylistUpdate', { playlist });
      },
      
      // 音量控制
      setVolume(volume) {
        state.volume = volume;
        gainNode.gain.value = volume;
        notifyListeners('onVolumeChange', { volume });
      },
      
      // 播放位置控制
      seek(time) {
        if (audioElement) {
          audioElement.currentTime = time;
        }
      },
      
      // 状态查询
      getState() {
        return { ...state };
      },
      
      // 事件监听
      addEventListener(event, callback) {
        if (listeners[event]) {
          listeners[event].push(callback);
        }
      },
      
      removeEventListener(event, callback) {
        if (listeners[event]) {
          listeners[event] = listeners[event].filter(cb => cb !== callback);
        }
      }
    };
  }
  
  return {
    getInstance() {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    }
  };
})();

// 创建全局访问点
window.globalAudioController = GlobalAudioController.getInstance();

// 在页面加载时初始化
document.addEventListener('DOMContentLoaded', () => {
  window.globalAudioController.init();
}); 