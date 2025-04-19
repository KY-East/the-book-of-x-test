import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// 导入所有组件
import PerfectVoid from './perfect-void.jsx';
import PerfectVoidScenes from './PerfectVoidScenes.jsx';
import PerfectVoidExploration from './PerfectVoidExploration.jsx';
import PerfectVoidRevelation from './PerfectVoidRevelation.jsx';
import PerfectVoidFinale from './PerfectVoidFinale.jsx';

// 主包装器组件
const PerfectVoidMainWrapper = () => {
  // 故事部分状态
  const [currentPart, setCurrentPart] = useState(0);
  const [userProgress, setUserProgress] = useState(() => {
    // 尝试从本地存储加载进度
    if (typeof window !== 'undefined') {
      const savedProgress = localStorage.getItem('perfectVoidProgress');
      return savedProgress ? parseInt(savedProgress, 10) : 0;
    }
    return 0;
  });
  const [showMenu, setShowMenu] = useState(false);
  const [loadingNext, setLoadingNext] = useState(false);
  
  // 故事部分
  const storyParts = [
    { id: 'intro', component: PerfectVoid, title: '引言' },
    { id: 'scenes', component: PerfectVoidScenes, title: '深夜呼唤' },
    { id: 'exploration', component: PerfectVoidExploration, title: '探索空洞' },
    { id: 'revelation', component: PerfectVoidRevelation, title: '重大发现' },
    { id: 'finale', component: PerfectVoidFinale, title: '尾声' }
  ];
  
  // 保存进度
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('perfectVoidProgress', userProgress.toString());
    }
  }, [userProgress]);
  
  // 检查用户是否完成当前部分
  const handlePartCompletion = (partIndex) => {
    if (partIndex > userProgress) {
      setUserProgress(partIndex);
    }
    
    // 设置加载下一部分
    setLoadingNext(true);
    setTimeout(() => {
      setCurrentPart(partIndex + 1);
      setLoadingNext(false);
    }, 1500);
  };
  
  // 渲染菜单
  const renderMenu = () => {
    return (
      <motion.div 
        className="story-menu"
        initial={{ opacity: 0, x: -300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -300 }}
        transition={{ duration: 0.3 }}
      >
        <div className="menu-header">
          <h2>完美的空洞</h2>
          <button className="close-button" onClick={() => setShowMenu(false)}>×</button>
        </div>
        
        <div className="menu-parts">
          {storyParts.map((part, index) => (
            <button 
              key={part.id}
              className={`menu-part-button ${index <= userProgress ? 'unlocked' : 'locked'}`}
              onClick={() => {
                if (index <= userProgress) {
                  setCurrentPart(index);
                  setShowMenu(false);
                }
              }}
            >
              <span className="part-number">{index + 1}</span>
              <span className="part-title">{part.title}</span>
              {index > userProgress && <span className="lock-icon">🔒</span>}
            </button>
          ))}
        </div>
        
        <div className="menu-footer">
          <button className="reset-button" onClick={() => {
            if (typeof window !== 'undefined' && window.confirm('确定要重置进度吗？这将删除您的阅读记录。')) {
              localStorage.removeItem('perfectVoidProgress');
              setUserProgress(0);
              setCurrentPart(0);
              setShowMenu(false);
            }
          }}>
            重置进度
          </button>
        </div>
      </motion.div>
    );
  };
  
  // 渲染加载界面
  const renderLoading = () => {
    return (
      <div className="loading-screen">
        <div className="loading-spinner">
          <div className="spinner-inner"></div>
        </div>
        <div className="loading-text">正在加载下一章节...</div>
      </div>
    );
  };
  
  // 动态渲染当前部分
  const renderCurrentPart = () => {
    if (currentPart >= storyParts.length) {
      // 所有章节都完成，显示结束界面
      return (
        <div className="story-completed">
          <h1>恭喜您完成了第一章</h1>
          <p>请静候下一章节的到来</p>
          <button className="restart-button" onClick={() => setCurrentPart(0)}>
            重新开始
          </button>
        </div>
      );
    }
    
    const CurrentComponent = storyParts[currentPart].component;
    return <CurrentComponent onComplete={() => handlePartCompletion(currentPart)} />;
  };
  
  return (
    <div className="perfect-void-wrapper">
      {/* 菜单按钮 */}
      <button 
        className="menu-toggle"
        onClick={() => setShowMenu(!showMenu)}
      >
        <span className="menu-icon">≡</span>
      </button>
      
      {/* 菜单 */}
      <AnimatePresence>
        {showMenu && renderMenu()}
      </AnimatePresence>
      
      {/* 内容区域 */}
      <div className="content-area">
        {loadingNext ? renderLoading() : renderCurrentPart()}
      </div>
    </div>
  );
};

// 添加必要的样式
const styles = `
  .perfect-void-wrapper {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    background-color: #0a0a12;
    color: #e0e0e0;
    font-family: 'Rajdhani', 'Noto Sans SC', sans-serif;
  }
  
  .menu-toggle {
    position: fixed;
    top: 20px;
    left: 20px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.5);
    border: 1px solid var(--neon-primary);
    color: var(--neon-primary);
    font-size: 1.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    z-index: 1000;
    transition: all 0.3s ease;
    box-shadow: 0 0 10px rgba(0, 255, 157, 0.3);
  }
  
  .menu-toggle:hover {
    background-color: rgba(0, 255, 157, 0.2);
    transform: scale(1.1);
    box-shadow: 0 0 15px rgba(0, 255, 157, 0.5);
  }
  
  .story-menu {
    position: fixed;
    top: 0;
    left: 0;
    width: 300px;
    height: 100vh;
    background-color: rgba(10, 10, 18, 0.95);
    border-right: 1px solid rgba(0, 255, 157, 0.3);
    z-index: 999;
    display: flex;
    flex-direction: column;
    box-shadow: 5px 0 20px rgba(0, 0, 0, 0.5);
  }
  
  .menu-header {
    padding: 20px;
    border-bottom: 1px solid rgba(0, 255, 157, 0.3);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .menu-header h2 {
    margin: 0;
    color: var(--neon-primary);
    font-family: 'Orbitron', sans-serif;
    font-size: 1.5rem;
    text-shadow: 0 0 10px rgba(0, 255, 157, 0.5);
  }
  
  .close-button {
    background: none;
    border: none;
    color: var(--neon-primary);
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0;
    margin: 0;
    line-height: 1;
  }
  
  .menu-parts {
    flex-grow: 1;
    padding: 20px;
    overflow-y: auto;
  }
  
  .menu-part-button {
    display: block;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(0, 255, 157, 0.3);
    margin-bottom: 10px;
    padding: 15px;
    text-align: left;
    color: #ddd;
    cursor: pointer;
    position: relative;
    transition: all 0.3s ease;
    border-radius: 3px;
  }
  
  .menu-part-button.unlocked:hover {
    background-color: rgba(0, 255, 157, 0.1);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }
  
  .menu-part-button.locked {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  .part-number {
    display: inline-block;
    width: 25px;
    height: 25px;
    line-height: 25px;
    text-align: center;
    background-color: var(--neon-primary);
    color: #000;
    border-radius: 50%;
    margin-right: 10px;
    font-weight: bold;
  }
  
  .part-title {
    font-weight: 500;
  }
  
  .lock-icon {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
  }
  
  .menu-footer {
    padding: 20px;
    border-top: 1px solid rgba(0, 255, 157, 0.3);
  }
  
  .reset-button {
    width: 100%;
    background-color: rgba(255, 51, 102, 0.2);
    border: 1px solid var(--neon-secondary);
    color: var(--neon-secondary);
    padding: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
    border-radius: 3px;
  }
  
  .reset-button:hover {
    background-color: rgba(255, 51, 102, 0.3);
    box-shadow: 0 0 10px rgba(255, 51, 102, 0.5);
  }
  
  .content-area {
    width: 100%;
    height: 100%;
  }
  
  .loading-screen {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: rgba(10, 10, 18, 0.9);
  }
  
  .loading-spinner {
    width: 60px;
    height: 60px;
    border: 2px solid transparent;
    border-top-color: var(--neon-primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    position: relative;
    margin-bottom: 20px;
  }
  
  .spinner-inner {
    position: absolute;
    top: 5px;
    left: 5px;
    right: 5px;
    bottom: 5px;
    border: 2px solid transparent;
    border-top-color: var(--neon-secondary);
    border-radius: 50%;
    animation: spin 1.5s linear infinite reverse;
  }
  
  .loading-text {
    color: var(--neon-primary);
    font-family: 'Fira Code', monospace;
    font-size: 1rem;
    animation: pulse 1.5s infinite;
  }
  
  .story-completed {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    text-align: center;
    padding: 20px;
  }
  
  .story-completed h1 {
    font-family: 'Orbitron', 'ZCOOL QingKe HuangYou', sans-serif;
    font-size: 2.5rem;
    color: var(--neon-primary);
    margin-bottom: 20px;
    text-shadow: 0 0 15px rgba(0, 255, 157, 0.7);
  }
  
  .story-completed p {
    color: #aaa;
    font-size: 1.2rem;
    margin-bottom: 40px;
  }
  
  .restart-button {
    background-color: transparent;
    border: 1px solid var(--neon-primary);
    color: var(--neon-primary);
    padding: 10px 20px;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    border-radius: 3px;
  }
  
  .restart-button:hover {
    background-color: rgba(0, 255, 157, 0.2);
    box-shadow: 0 0 10px rgba(0, 255, 157, 0.5);
    transform: translateY(-2px);
  }
  
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
  
  @media (max-width: 768px) {
    .story-menu {
      width: 280px;
    }
    
    .menu-toggle {
      top: 10px;
      left: 10px;
    }
    
    .story-completed h1 {
      font-size: 2rem;
    }
  }
`;

export default () => (
  <>
    <style>{styles}</style>
    <PerfectVoidMainWrapper />
  </>
); 