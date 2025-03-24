import React, { useEffect } from 'react';
import Head from 'next/head';
import Sidebar from './Sidebar';

/**
 * 基础布局组件
 * 包含页面的共通结构，如头部元数据、页面容器、侧边栏和音乐播放器
 * 
 * 修改记录：
 * - 2024-03-19: 创建初始版本
 * - 2024-03-19: 根据clean-html版本添加音乐播放器功能
 */
export default function Layout({ children, title, description }) {
  // 设置默认标题和描述
  const pageTitle = title ? `${title} | The Book of Ξ` : 'The Book of Ξ';
  const pageDescription = description || 'A cyberpunk spiritual journey through the eternal algorithm';
  
  // 音乐播放器功能
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 音乐播放器参考
      const playerToggle = document.getElementById('playerToggle');
      const playerContainer = document.querySelector('.player-container');
      const playPauseBtn = document.getElementById('playPause');
      const prevBtn = document.getElementById('prevTrack');
      const nextBtn = document.getElementById('nextTrack');
      const progressBar = document.getElementById('progressBar');
      const progressCurrent = document.getElementById('progressCurrent');
      const currentTimeDisplay = document.getElementById('currentTime');
      const totalTimeDisplay = document.getElementById('totalTime');
      const volumeControl = document.getElementById('volumeControl');
      const musicInfo = document.getElementById('musicInfo');
      const audioPlayer = document.getElementById('audioPlayer');
      
      if (!playerToggle || !audioPlayer) return;
      
      // 音乐播放器状态
      let isPlaying = false;
      let currentTrack = 0;
      
      // 播放列表
      const playlist = [
        { title: 'Ghost in the Shell - Making of Cyborg', src: '/music/01-making-of-cyborg.mp3' },
        { title: 'Blade Runner - Tears in Rain', src: '/music/02-tears-in-rain.mp3' },
        { title: 'Deus Ex - The Synapse', src: '/music/03-the-synapse.mp3' },
        { title: 'Akira - Kaneda\'s Theme', src: '/music/04-kanedas-theme.mp3' },
        { title: 'Matrix - Trinity Infinity', src: '/music/05-trinity-infinity.mp3' }
      ];
      
      // 切换播放器显示状态
      playerToggle.addEventListener('click', function() {
        if (playerContainer.classList.contains('active')) {
          playerContainer.classList.remove('active');
        } else {
          playerContainer.classList.add('active');
        }
      });
      
      // 更新进度条
      function updateProgress() {
        if (audioPlayer.duration) {
          const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
          progressCurrent.style.width = progress + '%';
          
          // 显示当前时间
          const currentMinutes = Math.floor(audioPlayer.currentTime / 60);
          const currentSeconds = Math.floor(audioPlayer.currentTime % 60).toString().padStart(2, '0');
          currentTimeDisplay.textContent = `${currentMinutes}:${currentSeconds}`;
          
          // 显示总时间
          const totalMinutes = Math.floor(audioPlayer.duration / 60);
          const totalSeconds = Math.floor(audioPlayer.duration % 60).toString().padStart(2, '0');
          totalTimeDisplay.textContent = `${totalMinutes}:${totalSeconds}`;
        }
      }
      
      // 更新音乐信息
      function updateMusicInfo() {
        musicInfo.textContent = playlist[currentTrack].title;
      }
      
      // 加载并播放当前曲目
      function loadAndPlayTrack() {
        try {
          audioPlayer.src = playlist[currentTrack].src;
          audioPlayer.load();
          
          // 播放成功后更新界面
          audioPlayer.oncanplaythrough = function() {
            audioPlayer.play().then(function() {
              playPauseBtn.textContent = '⏸';
              isPlaying = true;
              updateMusicInfo();
            }).catch(function(error) {
              console.error('播放失败:', error);
              playPauseBtn.textContent = '▶';
              isPlaying = false;
            });
          };
          
          // 加载失败处理
          audioPlayer.onerror = function() {
            console.error('音频加载错误:', playlist[currentTrack].title);
            musicInfo.textContent = `错误: ${playlist[currentTrack].title}`;
            
            // 尝试播放下一首
            setTimeout(function() {
              currentTrack = (currentTrack + 1) % playlist.length;
              loadAndPlayTrack();
            }, 2000);
          };
        } catch (error) {
          console.error('音频加载错误:', error);
          
          // 尝试播放下一首
          setTimeout(function() {
            currentTrack = (currentTrack + 1) % playlist.length;
            loadAndPlayTrack();
          }, 2000);
        }
      }
      
      // 绑定事件 - 确保元素存在
      if (playPauseBtn) {
        playPauseBtn.addEventListener('click', function() {
          if (isPlaying) {
            audioPlayer.pause();
            playPauseBtn.textContent = '▶';
            isPlaying = false;
          } else {
            if (audioPlayer.src) {
              audioPlayer.play().then(function() {
                playPauseBtn.textContent = '⏸';
                isPlaying = true;
              }).catch(function(error) {
                console.error('播放失败:', error);
              });
            } else {
              loadAndPlayTrack();
            }
          }
        });
      }
      
      if (nextBtn) {
        nextBtn.addEventListener('click', function() {
          currentTrack = (currentTrack + 1) % playlist.length;
          if (isPlaying) {
            loadAndPlayTrack();
          } else {
            updateMusicInfo();
          }
        });
      }
      
      if (prevBtn) {
        prevBtn.addEventListener('click', function() {
          currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
          if (isPlaying) {
            loadAndPlayTrack();
          } else {
            updateMusicInfo();
          }
        });
      }
      
      if (progressBar) {
        progressBar.addEventListener('click', function(e) {
          const percentage = (e.offsetX / this.offsetWidth);
          if (audioPlayer.duration) {
            audioPlayer.currentTime = percentage * audioPlayer.duration;
          }
        });
      }
      
      if (volumeControl) {
        volumeControl.addEventListener('input', function(e) {
          audioPlayer.volume = e.target.value;
        });
      }
      
      if (audioPlayer) {
        // 监听播放进度
        audioPlayer.addEventListener('timeupdate', updateProgress);
        
        // 监听音频结束事件
        audioPlayer.addEventListener('ended', function() {
          currentTrack = (currentTrack + 1) % playlist.length;
          loadAndPlayTrack();
        });
        
        // 设置初始音量
        audioPlayer.volume = 0.3;
      }
      
      // 初始化显示
      updateMusicInfo();
    }
  }, []);
  
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        {/* 添加其他必要的meta标签和CSP设置 */}
      </Head>
      
      <div className="app-container">
        {/* 添加侧边栏 */}
        <Sidebar />
        
        <main className="main-content">
          {children}
        </main>
        
        {/* 音乐播放器 */}
        <div className="advanced-music-player" id="musicPlayer">
          <div className="player-toggle" id="playerToggle">♫</div>
          <div className="player-container">
            <div className="music-controls">
              <button className="music-btn" id="prevTrack">⏮</button>
              <button className="music-btn" id="playPause">▶</button>
              <button className="music-btn" id="nextTrack">⏭</button>
              <div className="progress-container">
                <div className="progress-bar" id="progressBar">
                  <div className="progress-current" id="progressCurrent"></div>
                </div>
                <div className="time-display">
                  <span id="currentTime">0:00</span> / <span id="totalTime">0:00</span>
                </div>
              </div>
              <input type="range" className="volume-control" id="volumeControl" min="0" max="1" step="0.1" value="0.5" />
            </div>
            <div className="music-info" id="musicInfo">未选择音乐</div>
          </div>
        </div>
        <audio id="audioPlayer" style={{display: 'none'}}></audio>
      </div>
    </>
  );
} 