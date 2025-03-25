/**
 * Xi Player - 全局音频播放器组件
 * 特性：
 * 1. 全局单例播放器
 * 2. 状态持久化
 * 3. 页面间播放状态保持
 * 4. 完整的错误处理
 */

class XiPlayer {
    constructor() {
        if (XiPlayer.instance) {
            return XiPlayer.instance;
        }
        XiPlayer.instance = this;
        
        // 存储前缀
        this.storagePrefix = 'xiPlayer_';
        
        // 初始化状态
        this.state = {
            currentTrack: 0,
            isPlaying: false,
            volume: 0.3,
            currentTime: 0,
            duration: 0,
            buffered: 0,
            loading: false,
            error: null
        };
        
        // 创建音频元素
        this.audio = new Audio();
        this.audio.preload = 'auto';
        
        // 绑定事件处理器
        this.bindEvents();
        
        // 恢复上次的播放状态
        this.restoreState();
        
        return this;
    }
    
    // 绑定音频事件
    bindEvents() {
        // 时间更新
        this.audio.addEventListener('timeupdate', () => {
            this.state.currentTime = this.audio.currentTime;
            this.state.duration = this.audio.duration;
            this.saveState();
            this.emit('timeupdate', {
                currentTime: this.audio.currentTime,
                duration: this.audio.duration,
                progress: this.audio.currentTime / this.audio.duration
            });
        });
        
        // 加载进度
        this.audio.addEventListener('progress', () => {
            if (this.audio.buffered.length > 0) {
                this.state.buffered = this.audio.buffered.end(this.audio.buffered.length - 1);
                this.emit('buffer', {
                    buffered: this.state.buffered,
                    duration: this.audio.duration
                });
            }
        });
        
        // 加载状态
        this.audio.addEventListener('loadstart', () => {
            this.state.loading = true;
            this.emit('loadstart');
        });
        
        this.audio.addEventListener('canplay', () => {
            this.state.loading = false;
            this.emit('canplay');
        });
        
        // 播放状态
        this.audio.addEventListener('play', () => {
            this.state.isPlaying = true;
            this.saveState();
            this.emit('play');
        });
        
        this.audio.addEventListener('pause', () => {
            this.state.isPlaying = false;
            this.saveState();
            this.emit('pause');
        });
        
        // 错误处理
        this.audio.addEventListener('error', (e) => {
            this.state.error = this.getErrorMessage(e);
            this.state.loading = false;
            this.emit('error', this.state.error);
        });
        
        // 播放结束
        this.audio.addEventListener('ended', () => {
            this.emit('ended');
        });
    }
    
    // 保存状态到localStorage
    saveState() {
        const state = {
            currentTrack: this.state.currentTrack,
            isPlaying: this.state.isPlaying,
            volume: this.state.volume,
            currentTime: this.state.currentTime
        };
        
        Object.entries(state).forEach(([key, value]) => {
            localStorage.setItem(`${this.storagePrefix}${key}`, JSON.stringify(value));
        });
    }
    
    // 从localStorage恢复状态
    restoreState() {
        try {
            // 恢复音量
            const volume = parseFloat(localStorage.getItem(`${this.storagePrefix}volume`)) || 0.3;
            this.setVolume(volume);
            
            // 恢复当前曲目
            const currentTrack = parseInt(localStorage.getItem(`${this.storagePrefix}currentTrack`)) || 0;
            this.state.currentTrack = currentTrack;
            
            // 恢复播放位置
            const currentTime = parseFloat(localStorage.getItem(`${this.storagePrefix}currentTime`)) || 0;
            if (currentTime > 0) {
                this.audio.currentTime = currentTime;
            }
            
            // 恢复播放状态
            const isPlaying = localStorage.getItem(`${this.storagePrefix}isPlaying`) === 'true';
            if (isPlaying) {
                this.play().catch(() => {
                    console.log('需要用户交互才能恢复播放');
                });
            }
        } catch (error) {
            console.error('恢复播放状态失败:', error);
        }
    }
    
    // 设置音量
    setVolume(volume) {
        volume = Math.max(0, Math.min(1, volume));
        this.audio.volume = volume;
        this.state.volume = volume;
        this.saveState();
        this.emit('volumechange', volume);
    }
    
    // 设置播放位置
    seek(time) {
        try {
            if (!this.audio.duration) return;
            
            time = Math.max(0, Math.min(time, this.audio.duration));
            this.audio.currentTime = time;
            this.state.currentTime = time;
            this.saveState();
            
            // 发出时间更新事件
            this.emit('timeupdate', {
                currentTime: this.audio.currentTime,
                duration: this.audio.duration,
                progress: this.audio.currentTime / this.audio.duration
            });
        } catch (error) {
            console.error('设置播放位置失败:', error);
            this.state.error = error.message;
            this.emit('error', error.message);
        }
    }
    
    // 设置播放位置（百分比）
    seekByPercentage(percentage) {
        try {
            if (!this.audio.duration) return;
            
            percentage = Math.max(0, Math.min(1, percentage));
            const time = this.audio.duration * percentage;
            this.seek(time);
        } catch (error) {
            console.error('设置播放位置失败:', error);
            this.state.error = error.message;
            this.emit('error', error.message);
        }
    }
    
    // 加载音频
    load(url) {
        return new Promise((resolve, reject) => {
            try {
                // 如果当前有音频在播放，先暂停
                if (this.audio.src) {
                    this.audio.pause();
                }
                
                this.state.loading = true;
                this.emit('loadstart');
                
                this.audio.src = url;
                this.audio.load();
                
                const onCanPlay = () => {
                    this.state.loading = false;
                    this.audio.removeEventListener('canplay', onCanPlay);
                    this.audio.removeEventListener('error', onError);
                    this.emit('canplay');
                    resolve();
                };
                
                const onError = (e) => {
                    this.state.loading = false;
                    this.audio.removeEventListener('canplay', onCanPlay);
                    this.audio.removeEventListener('error', onError);
                    const error = this.getErrorMessage(e);
                    this.state.error = error;
                    this.emit('error', error);
                    reject(error);
                };
                
                this.audio.addEventListener('canplay', onCanPlay);
                this.audio.addEventListener('error', onError);
            } catch (error) {
                this.state.loading = false;
                this.state.error = error.message;
                this.emit('error', error.message);
                reject(error);
            }
        });
    }
    
    // 播放
    async play() {
        try {
            if (this.state.loading) {
                throw new Error('音频正在加载中');
            }
            
            if (!this.audio.src) {
                throw new Error('没有加载音频');
            }
            
            await this.audio.play();
            this.state.isPlaying = true;
            this.saveState();
        } catch (error) {
            console.error('播放失败:', error);
            this.state.error = error.message;
            this.emit('error', error.message);
            throw error;
        }
    }
    
    // 暂停
    pause() {
        try {
            this.audio.pause();
            this.state.isPlaying = false;
            this.saveState();
        } catch (error) {
            console.error('暂停失败:', error);
            this.state.error = error.message;
            this.emit('error', error.message);
        }
    }
    
    // 切换播放/暂停
    togglePlay() {
        if (this.state.isPlaying) {
            this.pause();
        } else {
            this.play().catch(error => {
                console.error('切换播放状态失败:', error);
                this.state.error = error.message;
                this.emit('error', error.message);
            });
        }
    }
    
    // 获取错误信息
    getErrorMessage(error) {
        if (!error) return '未知错误';
        
        switch (error.code) {
            case 1:
                return '加载被中止';
            case 2:
                return '网络错误';
            case 3:
                return '解码错误';
            case 4:
                return '音频格式不支持';
            default:
                return error.message || '未知错误';
        }
    }
    
    // 事件处理
    listeners = {};
    
    on(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }
    
    off(event, callback) {
        if (this.listeners[event]) {
            this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
        }
    }
    
    emit(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => callback(data));
        }
    }
}

// 创建并导出单例实例
const xiPlayer = new XiPlayer();
export default xiPlayer; 