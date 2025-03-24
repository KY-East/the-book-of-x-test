/**
 * music-player.js - 从first-contact-protocol.html提取
 * 提取时间: 2025-03-20T02:04:12.666Z
 * 功能: 音乐播放器功能
 */

(function() {
// 音乐播放器功能
    document.addEventListener('DOMContentLoaded', function() {
      // 音乐播放列表
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
      
      // 创建音频元素
      let audioPlayer;
      if (!document.getElementById('audioPlayer')) {
        audioPlayer = document.createElement('audio');
        audioPlayer.id = 'audioPlayer';
        audioPlayer.style.display = 'none';
        document.body.appendChild(audioPlayer);
      } else {
        audioPlayer = document.getElementById('audioPlayer');
      }
      
      // 获取DOM元素
      const playerToggle = document.getElementById('playerToggle');
      const playerContainer = document.querySelector('.player-container');
      const playPauseBtn = document.getElementById('playPause');
      const prevBtn = document.getElementById('prevTrack');
      const nextBtn = document.getElementById('nextTrack');
      const volumeControl = document.getElementById('volumeControl');
      const musicInfo = document.getElementById('musicInfo');
      const progressBar = document.getElementById('progressBar');
      const progressCurrent = document.getElementById('progressCurrent');
      const currentTimeDisplay = document.getElementById('currentTime');
      const totalTimeDisplay = document.getElementById('totalTime');
      
      // 状态变量
      let currentTrack = 0;
      let isPlaying = false;
      
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
        }
      }
      
      // 更新音乐信息
      function updateMusicInfo() {
        musicInfo.textContent = playlist[currentTrack].title;
      }
      
      // 加载并播放当前曲目
      function loadAndPlayTrack() {
        musicInfo.textContent = `加载中... ${playlist[currentTrack].title}`;
        
        try {
          // 设置音频源
          const encodedUrl = encodeURI(playlist[currentTrack].url);
          audioPlayer.src = encodedUrl;
          
          // 播放音频
          audioPlayer.play()
            .then(function() {
              playPauseBtn.textContent = '⏸';
              updateMusicInfo();
              isPlaying = true;
            })
            .catch(function(error) {
              console.error('播放错误:', error);
              musicInfo.textContent = `无法播放: ${playlist[currentTrack].title}`;
              
              // 尝试播放下一首
              setTimeout(function() {
                currentTrack = (currentTrack + 1) % playlist.length;
                loadAndPlayTrack();
              }, 2000);
            });
        } catch (error) {
          console.error('音频加载错误:', error);
          musicInfo.textContent = `错误: ${playlist[currentTrack].title}`;
          
          // 尝试播放下一首
          setTimeout(function() {
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
        } else {
          loadAndPlayTrack();
        }
      }
      
      // 播放下一首
      function playNext() {
        currentTrack = (currentTrack + 1) % playlist.length;
        if (isPlaying) {
          loadAndPlayTrack();
        } else {
          updateMusicInfo();
        }
      }
      
      // 播放上一首
      function playPrev() {
        currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
        if (isPlaying) {
          loadAndPlayTrack();
        } else {
          updateMusicInfo();
        }
      }
      
      // 设置音频属性
      audioPlayer.volume = 0.3;
      
      // 进度条点击事件
      progressBar.addEventListener('click', function(e) {
        const percentage = (e.offsetX / this.offsetWidth);
        audioPlayer.currentTime = percentage * audioPlayer.duration;
      });
      
      // 绑定事件
      playPauseBtn.addEventListener('click', togglePlay);
      nextBtn.addEventListener('click', playNext);
      prevBtn.addEventListener('click', playPrev);
      volumeControl.addEventListener('input', function(e) {
        audioPlayer.volume = e.target.value;
      });
      
      // 监听播放进度
      audioPlayer.addEventListener('timeupdate', updateProgress);
      
      // 监听音频结束事件
      audioPlayer.addEventListener('ended', playNext);
      
      // 初始化显示
      updateMusicInfo();
    });
    
})();
