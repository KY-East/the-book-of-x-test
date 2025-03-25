/**
 * Xi Player UI - 播放器界面组件
 */

import xiPlayer from './xi-player.js';

class XiPlayerUI {
    constructor(container, playlist) {
        this.container = container;
        this.playlist = playlist;
        this.isDragging = false;
        
        // 创建UI元素
        this.createElements();
        // 绑定事件
        this.bindEvents();
        // 初始化播放列表
        this.initPlaylist();
        
        // 监听播放器事件
        this.listenToPlayerEvents();
        
        // 初始化时加载第一首歌
        this.loadInitialTrack();
    }
    
    loadInitialTrack() {
        const track = this.playlist[0];
        if (track) {
            xiPlayer.state.currentTrack = 0;
            xiPlayer.load(track.url).then(() => {
                this.updateMusicInfo();
            }).catch(error => {
                console.error('初始化加载失败:', error);
                this.elements.statusDisplay.textContent = `状态：加载失败 - ${error}`;
            });
        }
    }
    
    createElements() {
        // 播放器容器
        this.elements = {
            toggle: this.container.querySelector('.player-toggle'),
            playerContainer: this.container.querySelector('.player-container'),
            playPauseBtn: this.container.querySelector('.play-pause'),
            prevBtn: this.container.querySelector('.prev-track'),
            nextBtn: this.container.querySelector('.next-track'),
            volumeControl: this.container.querySelector('.volume-control'),
            musicInfo: this.container.querySelector('.music-info'),
            statusDisplay: this.container.querySelector('.status'),
            progressBar: this.container.querySelector('.progress-bar'),
            progressCurrent: this.container.querySelector('.progress-current'),
            currentTimeDisplay: this.container.querySelector('.current-time'),
            totalTimeDisplay: this.container.querySelector('.total-time'),
            playlistDisplay: this.container.querySelector('.playlist-display')
        };
    }
    
    bindEvents() {
        // 播放器显示/隐藏
        this.elements.toggle.addEventListener('click', () => {
            const display = this.elements.playerContainer.style.display;
            this.elements.playerContainer.style.display = display === 'none' || !display ? 'block' : 'none';
        });
        
        // 播放/暂停
        this.elements.playPauseBtn.addEventListener('click', () => {
            xiPlayer.togglePlay();
        });
        
        // 上一曲
        this.elements.prevBtn.addEventListener('click', () => {
            this.playPrevious();
        });
        
        // 下一曲
        this.elements.nextBtn.addEventListener('click', () => {
            this.playNext();
        });
        
        // 音量控制
        this.elements.volumeControl.addEventListener('input', (e) => {
            xiPlayer.setVolume(parseFloat(e.target.value));
        });
        
        // 进度条事件 - 重写进度条事件处理
        let isProgressDragging = false;
        let wasPlaying = false;
        
        // 鼠标按下时
        this.elements.progressBar.addEventListener('mousedown', (e) => {
            isProgressDragging = true;
            wasPlaying = xiPlayer.state.isPlaying;
            if (wasPlaying) {
                xiPlayer.pause();
            }
            this.updateProgressFromEvent(e);
        });
        
        // 鼠标移动时
        document.addEventListener('mousemove', (e) => {
            if (isProgressDragging) {
                this.updateProgressFromEvent(e);
            }
        });
        
        // 鼠标松开时
        document.addEventListener('mouseup', () => {
            if (isProgressDragging) {
                isProgressDragging = false;
                if (wasPlaying) {
                    xiPlayer.play();
                }
            }
        });
        
        // 进度条点击
        this.elements.progressBar.addEventListener('click', (e) => {
            if (!isProgressDragging) {
                this.updateProgressFromEvent(e);
            }
        });
    }
    
    initPlaylist() {
        this.elements.playlistDisplay.innerHTML = '';
        this.playlist.forEach((track, index) => {
            const li = document.createElement('li');
            li.textContent = track.title;
            li.style.cursor = 'pointer';
            li.onclick = () => {
                this.playTrack(index);
            };
            this.elements.playlistDisplay.appendChild(li);
        });
    }
    
    listenToPlayerEvents() {
        // 播放状态更新
        xiPlayer.on('play', () => {
            this.elements.playPauseBtn.textContent = '⏸';
            this.updateMusicInfo();
        });
        
        xiPlayer.on('pause', () => {
            this.elements.playPauseBtn.textContent = '▶';
            this.updateMusicInfo();
        });
        
        // 时间更新
        xiPlayer.on('timeupdate', (data) => {
            if (!this.isDragging) {
                this.updateProgress(data);
            }
        });
        
        // 加载状态
        xiPlayer.on('loadstart', () => {
            this.elements.statusDisplay.textContent = '状态：加载中...';
        });
        
        xiPlayer.on('canplay', () => {
            this.elements.statusDisplay.textContent = '状态：就绪';
        });
        
        // 错误处理
        xiPlayer.on('error', (error) => {
            this.elements.statusDisplay.textContent = `状态：错误 - ${error}`;
        });
        
        // 播放结束
        xiPlayer.on('ended', () => {
            this.playNext();
        });
    }
    
    updateProgressFromEvent(e) {
        const rect = this.elements.progressBar.getBoundingClientRect();
        const percentage = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
        xiPlayer.seekByPercentage(percentage);
    }
    
    updateProgress(data) {
        const { currentTime, duration, progress } = data;
        
        // 更新进度条
        this.elements.progressCurrent.style.width = `${progress * 100}%`;
        
        // 更新时间显示
        const currentMins = Math.floor(currentTime / 60);
        const currentSecs = Math.floor(currentTime % 60);
        const totalMins = Math.floor(duration / 60);
        const totalSecs = Math.floor(duration % 60);
        
        this.elements.currentTimeDisplay.textContent = 
            `${currentMins}:${currentSecs < 10 ? '0' + currentSecs : currentSecs}`;
        this.elements.totalTimeDisplay.textContent = 
            `${totalMins}:${totalSecs < 10 ? '0' + totalSecs : totalSecs}`;
    }
    
    updateMusicInfo() {
        const currentTrack = this.playlist[xiPlayer.state.currentTrack];
        this.elements.musicInfo.textContent = currentTrack.title;
        this.elements.statusDisplay.textContent = 
            `状态：${xiPlayer.state.isPlaying ? '播放中' : '已暂停'}`;
    }
    
    async playTrack(index) {
        try {
            const track = this.playlist[index];
            xiPlayer.state.currentTrack = index;
            await xiPlayer.load(track.url);
            await xiPlayer.play();
        } catch (error) {
            console.error('播放失败:', error);
            this.elements.statusDisplay.textContent = `状态：播放失败 - ${error}`;
        }
    }
    
    playNext() {
        const nextTrack = (xiPlayer.state.currentTrack + 1) % this.playlist.length;
        this.playTrack(nextTrack);
    }
    
    playPrevious() {
        const prevTrack = (xiPlayer.state.currentTrack - 1 + this.playlist.length) % this.playlist.length;
        this.playTrack(prevTrack);
    }
}

export default XiPlayerUI; 