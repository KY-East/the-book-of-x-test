import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// 第三部分探索组件
const PerfectVoidExploration = ({ onComplete }) => {
  // 状态管理
  const [currentScene, setCurrentScene] = useState(0);
  const [userInteracted, setUserInteracted] = useState(false);
  const [showAura, setShowAura] = useState(false);
  const [showWhisper, setShowWhisper] = useState(false);
  const [auraText, setAuraText] = useState('');
  const [pulseIntensity, setPulseIntensity] = useState(0);
  const [interactionCount, setInteractionCount] = useState(0);
  const [cameraMode, setCameraMode] = useState(false);
  const [photoTaken, setPhotoTaken] = useState(false);
  
  // 音频引用
  const ambienceRef = useRef(null);
  const effectSoundRef = useRef(null);
  const pulseRef = useRef(null);
  
  // 探索场景内容
  const scenes = [
    {
      id: 'scene-dialogue-9',
      text: '"这不可能。"Røkke摇着头，"不管什么爆炸，都不可能做到这么精确的切割。"',
      background: 'perfect-void',
      audio: 'ambience-void-hum',
      duration: 7000,
      character: 'rokke',
      interactive: false
    },
    {
      id: 'scene-dialogue-10',
      text: '"没错，这不是爆炸。"科学家说，"我们也排除了地质现象、已知武器、自然塌陷......所有已知现象。"',
      background: 'perfect-void',
      audio: 'ambience-void-hum',
      duration: 10000,
      character: 'scientist',
      interactive: false
    },
    {
      id: 'scene-exploration-1',
      text: 'Røkke走到警戒线前，注视着那个完美的球形空洞。他的专业本能告诉他，应该进一步调查，但直觉却在警告他远离这个地方。',
      background: 'perfect-void',
      audio: 'ambience-void-hum',
      duration: 10000,
      interactive: true,
      interactionText: '[ 越过警戒线 ]',
      interactionEffect: 'approach-void'
    },
    {
      id: 'scene-exploration-2',
      text: '他忽略了直觉的警告，钻过警戒带，朝着空洞边缘走去。随着距离缩短，一种奇怪的感觉开始笼罩他——就像有人在观察他，但那感觉并非来自某个特定方向，而是四面八方。',
      background: 'void-edge',
      audio: 'ambience-void-pulse',
      duration: 12000,
      interactive: false
    },
    {
      id: 'scene-exploration-3',
      text: '他停在距离边缘大约五米处，不确定是否应该继续靠近。球形空洞的表面光滑如镜，但并不反光。那黑暗似乎能吸收光线，就像一个完美的黑洞。',
      background: 'void-edge',
      audio: 'ambience-void-pulse',
      duration: 10000,
      interactive: true,
      interactionText: '[ 再靠近一点 ]',
      interactionEffect: 'approach-edge'
    },
    {
      id: 'scene-exploration-4',
      text: '再向前几步，他现在能清楚看到空洞的内部——或者说，他应该能看到内部，但事实上里面什么都没有。不是黑暗，而是完全的虚无。没有光线，没有阴影，没有内部结构，甚至没有边界感——只有一种视觉上的，完全的不存在。',
      background: 'void-close',
      audio: 'ambience-void-intense',
      duration: 15000,
      interactive: false
    },
    {
      id: 'scene-exploration-5',
      text: '一阵寒意沿着他的脊柱蔓延。这种感觉如此强烈，以至于他不由自主地想要后退，但专业素养又使他强迫自己站在原地。',
      background: 'void-close',
      audio: 'ambience-void-intense',
      duration: 8000,
      interactive: true,
      interactionText: '[ 伸手触摸边缘 ]',
      interactionEffect: 'touch-void'
    },
    {
      id: 'scene-exploration-pulse-1',
      text: '当他的手指距离虚空表面只有几厘米时，一种强烈的心跳声在他脑中响起——但那不是他自己的心跳，而是某种...脉冲。随着脉冲，虚空表面似乎轻微波动，像液体一样。',
      background: 'void-touch',
      audio: 'ambience-void-intense',
      duration: 12000,
      pulse: 0.3,
      interactive: false
    },
    {
      id: 'scene-exploration-pulse-2',
      text: '脉冲越来越强烈，节奏加快。现在他确定这不是幻觉——虚空正在"感知"他的存在。科学家们一定是错了，这不是简单的物质消失，这是某种有意识的存在。',
      background: 'void-touch',
      audio: 'ambience-void-intense',
      duration: 15000,
      pulse: 0.6,
      interactive: false
    },
    {
      id: 'scene-exploration-pulse-3',
      text: '又一次脉冲，这次强烈到令人疼痛。Røkke感觉到一种非语言的交流——虚空在"呼唤"他。',
      background: 'void-touch',
      audio: 'ambience-void-intense',
      duration: 10000,
      pulse: 0.9,
      aura: '进入......',
      interactive: true,
      interactionText: '[ 后退 ]',
      interactionEffect: 'retreat'
    },
    {
      id: 'scene-exploration-6',
      text: '恐慌淹没了他，Røkke踉跄着后退，但那脉冲依然回荡在他的脑海中。他摇着头，试图甩开那种感觉，但无济于事——那种连接已经建立。',
      background: 'void-close',
      audio: 'ambience-void-intense',
      duration: 10000,
      pulse: 0.7,
      whisper: '我们已经找到你了，Røkke',
      interactive: false
    },
    {
      id: 'scene-exploration-7',
      text: '"你还好吗？"科学家喊道，已经冲到了警戒线边。\n\nRøkke依然盯着那个虚空，瞳孔放大，额头上渗出冷汗。"它...想和我交流。"',
      background: 'void-close',
      audio: 'ambience-void-intense',
      duration: 12000,
      pulse: 0.4,
      character: 'rokke',
      interactive: false
    },
    {
      id: 'scene-exploration-8',
      text: '科学家的表情从关切变为惊讶，又变为兴奋："你说什么？你感觉到了什么？"',
      background: 'void-close',
      audio: 'ambience-void-intense',
      duration: 8000,
      pulse: 0.2,
      character: 'scientist',
      interactive: false
    },
    {
      id: 'scene-exploration-9',
      text: 'Røkke看着她，意识到自己在说什么。他摇摇头，试图恢复专业的态度："我们需要更多设备和人手。这里发生了严重的事情，超出了常规安全事故的范畴。"',
      background: 'void-close',
      audio: 'ambience-void-intense',
      duration: 10000,
      whisper: '回来......',
      character: 'rokke',
      interactive: false
    }
  ];

  // 场景切换逻辑
  useEffect(() => {
    if (!scenes[currentScene].interactive || 
        (scenes[currentScene].interactiveType === 'void-details' && interactionCount >= 2) ||
        (scenes[currentScene].interactiveType === 'camera-mode' && cameraMode) ||
        (scenes[currentScene].interactiveType === 'photo-mode' && photoTaken)) {
      
      const nextSceneTimer = setTimeout(() => {
        if (currentScene < scenes.length - 1) {
          setCurrentScene(prev => prev + 1);
        } else if (typeof onComplete === 'function') {
          // 当所有场景都展示完毕时，调用onComplete
          onComplete();
        }
      }, 6000);
      
      return () => clearTimeout(nextSceneTimer);
    }
  }, [currentScene, interactionCount, cameraMode, photoTaken, onComplete]);

  // 处理音频
  useEffect(() => {
    const scene = scenes[currentScene];
    
    // 更新环境音效
    if (ambienceRef.current) {
      ambienceRef.current.src = `/assets/audio/${scene.audio}.mp3`;
      ambienceRef.current.load();
      ambienceRef.current.play().catch(e => console.log('Audio play failed:', e));
    }
    
    // 更新脉冲强度
    if (scene.pulse !== undefined) {
      setPulseIntensity(scene.pulse);
      if (pulseRef.current) {
        pulseRef.current.volume = scene.pulse;
        pulseRef.current.play().catch(e => console.log('Pulse audio play failed:', e));
      }
    } else {
      setPulseIntensity(0);
      if (pulseRef.current) {
        pulseRef.current.pause();
      }
    }
    
    // 设置光环文本
    if (scene.aura) {
      setAuraText(scene.aura);
      setShowAura(true);
      setTimeout(() => setShowAura(false), 4000);
    } else {
      setShowAura(false);
    }
    
    // 设置低语文本
    if (scene.whisper) {
      setShowWhisper(true);
      setTimeout(() => setShowWhisper(false), 4000);
    } else {
      setShowWhisper(false);
    }
  }, [currentScene, scenes]);

  // 处理交互
  const handleInteraction = (effect) => {
    setUserInteracted(true);
    
    // 播放交互音效
    if (effectSoundRef.current) {
      effectSoundRef.current.src = `/assets/audio/effect-${effect}.mp3`;
      effectSoundRef.current.load();
      effectSoundRef.current.play().catch(e => console.log('Effect audio play failed:', e));
    }
    
    setTimeout(() => {
      setUserInteracted(false);
      setCurrentScene(prev => prev + 1);
      setInteractionCount(prev => prev + 1);
    }, 2000);
  };

  // 渲染场景内容
  const renderScene = () => {
    const scene = scenes[currentScene];
    
    return (
      <motion.div 
        key={scene.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.5 }}
        className={`scene ${scene.background}`}
      >
        <div className="scene-content">
          {scene.character && (
            <div className={`character-marker ${scene.character}`}>
              {scene.character === 'rokke' ? 'Røkke' : 
               scene.character === 'hamar' ? 'Hamar' : 
               scene.character === 'scientist' ? '科学家' : scene.character}
            </div>
          )}
          
          <p className="scene-text">
            {scene.text.split('\n').map((paragraph, index) => (
              <React.Fragment key={index}>
                {paragraph}
                {index < scene.text.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
          
          {scene.interactive && (
            <motion.button
              className="interaction-button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              onClick={() => handleInteraction(scene.interactionEffect)}
            >
              {scene.interactionText}
            </motion.button>
          )}
        </div>
      </motion.div>
    );
  };

  // 渲染脉冲效果
  const PulseEffect = () => {
    return (
      <div 
        className="pulse-effect" 
        style={{ 
          opacity: pulseIntensity, 
          animation: pulseIntensity > 0 ? 'pulse 1.5s infinite' : 'none' 
        }}
      />
    );
  };

  // 渲染光环效果
  const AuraEffect = () => {
    return (
      <AnimatePresence>
        {showAura && (
          <motion.div 
            className="aura-effect"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 2 }}
          >
            {auraText}
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  // 渲染低语效果
  const WhisperEffect = () => {
    return (
      <AnimatePresence>
        {showWhisper && (
          <motion.div 
            className="whisper-effect"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
          >
            {scenes[currentScene].whisper}
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  return (
    <div className="perfect-void-exploration-container">
      <div className="audio-container">
        <audio ref={ambienceRef} loop>
          <source src={`/assets/audio/${scenes[currentScene]?.audio}.mp3`} type="audio/mpeg" />
        </audio>
        <audio ref={effectSoundRef}>
          <source src="/assets/audio/effect-approach.mp3" type="audio/mpeg" />
        </audio>
        <audio ref={pulseRef} loop>
          <source src="/assets/audio/void-pulse.mp3" type="audio/mpeg" />
        </audio>
      </div>
      
      <AnimatePresence mode="wait">
        {renderScene()}
      </AnimatePresence>
      
      <PulseEffect />
      <AuraEffect />
      <WhisperEffect />
      
      <div className="overlay"></div>
      <div className="scanline"></div>
      <div className="noise"></div>
    </div>
  );
};

// 添加必要的样式
const styles = `
  .perfect-void-exploration-container {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    background-color: #0a0a12;
    color: #e0e0e0;
    font-family: 'Rajdhani', 'Noto Sans SC', sans-serif;
  }
  
  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, rgba(10, 10, 18, 0.8), rgba(20, 20, 30, 0.7));
    z-index: 2;
    pointer-events: none;
  }
  
  .scanline {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(to right, transparent, rgba(0, 255, 157, 0.5), transparent);
    opacity: 0.3;
    z-index: 3;
    pointer-events: none;
    animation: scanline 5s linear infinite;
  }
  
  .scene {
    position: relative;
    z-index: 5;
    height: 100vh;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }
  
  .scene-content {
    max-width: 800px;
    padding: 30px;
    background-color: rgba(10, 10, 18, 0.7);
    border: 1px solid rgba(0, 255, 157, 0.3);
    border-radius: 5px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
    position: relative;
  }
  
  .scene-text {
    font-size: 1.3rem;
    line-height: 1.8;
    margin: 0;
  }
  
  .character-marker {
    position: absolute;
    top: -15px;
    left: 20px;
    background-color: var(--neon-primary);
    color: var(--bg-primary);
    padding: 5px 15px;
    font-weight: bold;
    border-radius: 3px;
    box-shadow: 0 0 10px rgba(0, 255, 157, 0.5);
  }
  
  .character-marker.rokke {
    background-color: var(--neon-primary);
    box-shadow: 0 0 10px rgba(0, 255, 157, 0.5);
  }
  
  .character-marker.scientist {
    background-color: var(--neon-purple);
    box-shadow: 0 0 10px rgba(204, 0, 255, 0.5);
  }
  
  .interaction-button {
    display: block;
    margin: 20px auto 0;
    background-color: transparent;
    border: 1px solid var(--neon-primary);
    color: var(--neon-primary);
    padding: 10px 20px;
    font-family: 'Fira Code', monospace;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .interaction-button:hover {
    background-color: rgba(0, 255, 157, 0.2);
    box-shadow: 0 0 10px rgba(0, 255, 157, 0.5);
    transform: translateY(-2px);
  }
  
  /* 探索特效 */
  .pulse-effect {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at center, rgba(0, 255, 157, 0.1), transparent);
    z-index: 4;
    pointer-events: none;
  }
  
  .aura-effect {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 4rem;
    font-weight: 300;
    color: rgba(0, 255, 157, 0.8);
    text-shadow: 0 0 20px rgba(0, 255, 157, 0.8);
    z-index: 15;
    pointer-events: none;
    font-family: 'Orbitron', 'Noto Sans SC', sans-serif;
  }
  
  .whisper-effect {
    position: fixed;
    bottom: 50px;
    left: 0;
    width: 100%;
    text-align: center;
    font-size: 1.5rem;
    font-style: italic;
    color: rgba(204, 0, 255, 0.7);
    text-shadow: 0 0 10px rgba(204, 0, 255, 0.5);
    z-index: 15;
    pointer-events: none;
    font-family: 'Rajdhani', 'Noto Sans SC', sans-serif;
  }
  
  /* Scene backgrounds */
  .void-edge {
    background-image: linear-gradient(rgba(10, 10, 18, 0.6), rgba(10, 10, 18, 0.6)), url('/assets/images/void-edge.jpg');
    background-size: cover;
    background-position: center;
  }
  
  .void-close {
    background-image: linear-gradient(rgba(10, 10, 18, 0.5), rgba(10, 10, 18, 0.5)), url('/assets/images/void-close.jpg');
    background-size: cover;
    background-position: center;
  }
  
  .void-touch {
    background-image: linear-gradient(rgba(10, 10, 18, 0.4), rgba(10, 10, 18, 0.4)), url('/assets/images/void-touch.jpg');
    background-size: cover;
    background-position: center;
  }
  
  /* Animations */
  @keyframes scanline {
    0% {
      top: -100px;
    }
    100% {
      top: 100%;
    }
  }
  
  @keyframes pulse {
    0% {
      opacity: 0.2;
      transform: scale(1);
    }
    50% {
      opacity: 0.5;
      transform: scale(1.05);
    }
    100% {
      opacity: 0.2;
      transform: scale(1);
    }
  }
  
  /* Media queries */
  @media (max-width: 768px) {
    .scene-content {
      padding: 20px;
      margin: 0 20px;
    }
    
    .scene-text {
      font-size: 1.1rem;
    }
    
    .aura-effect {
      font-size: 3rem;
    }
    
    .whisper-effect {
      font-size: 1.2rem;
    }
  }
`;

export default () => (
  <>
    <style>{styles}</style>
    <PerfectVoidExploration />
  </>
); 