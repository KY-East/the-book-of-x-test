import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// 第四部分揭示组件
const PerfectVoidRevelation = ({ onComplete }) => {
  // 状态管理
  const [currentScene, setCurrentScene] = useState(0);
  const [userInteracted, setUserInteracted] = useState(false);
  const [showGlitch, setShowGlitch] = useState(false);
  const [showVoice, setShowVoice] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [glitchIntensity, setGlitchIntensity] = useState(0);
  
  // 音频引用
  const ambienceRef = useRef(null);
  const effectSoundRef = useRef(null);
  const glitchRef = useRef(null);
  
  // 揭示场景内容
  const scenes = [
    {
      id: 'scene-revelation-1',
      text: '回到营地后，Røkke无法摆脱脑海中回荡的声音和感觉。那晚他失眠了，脑中全是虚空的影像——那个完美的球形，那种被观察的感觉，那种脉冲......',
      background: 'camp-night',
      audio: 'ambience-night',
      duration: 10000,
      interactive: false
    },
    {
      id: 'scene-revelation-2',
      text: '第二天凌晨，他离开了睡袋，独自走向实验室帐篷。科学家们已经安装了一堆设备，屏幕上显示着各种读数和扫描结果。',
      background: 'lab-tent',
      audio: 'ambience-lab',
      duration: 8000,
      interactive: false
    },
    {
      id: 'scene-revelation-3',
      text: '"早安，Røkke先生。"一位科学家说，"您看起来很疲惫。"',
      background: 'lab-tent',
      audio: 'ambience-lab',
      duration: 5000,
      character: 'scientist',
      interactive: false
    },
    {
      id: 'scene-revelation-4',
      text: '"我需要看所有的数据。"Røkke直接说，"特别是关于那个...空洞边缘区域的。"',
      background: 'lab-tent',
      audio: 'ambience-lab',
      duration: 7000,
      character: 'rokke',
      interactive: false
    },
    {
      id: 'scene-revelation-5',
      text: '科学家点点头，调出几组数据。"我们检测到了一些非常奇怪的读数。空洞边缘存在某种...波动。它不是静态的，而是在以微小但可测量的频率振荡。"',
      background: 'lab-screens',
      audio: 'ambience-lab',
      duration: 12000,
      character: 'scientist',
      interactive: true,
      interactionText: '[ 分析波形图 ]',
      interactionEffect: 'analyse-data'
    },
    {
      id: 'scene-revelation-data-1',
      text: 'Røkke仔细查看波形图，心跳开始加速——这个频率...他认得这个模式。这与他昨天感受到的脉冲频率惊人地相似。',
      background: 'lab-screens',
      audio: 'ambience-lab',
      duration: 10000,
      glitch: 0.2,
      interactive: false
    },
    {
      id: 'scene-revelation-data-2',
      text: '"你们看，"他指着屏幕说，"这不是随机振荡。这有规律...有结构...这是某种信息。"',
      background: 'lab-screens',
      audio: 'ambience-lab',
      duration: 8000,
      glitch: 0.3,
      voice: '正确......',
      character: 'rokke',
      interactive: false
    },
    {
      id: 'scene-revelation-data-3',
      text: '科学家们面面相觑，显然没有想到这种可能性。"你是说...这是某种通信尝试？"',
      background: 'lab-screens',
      audio: 'ambience-lab',
      duration: 8000,
      glitch: 0.4,
      character: 'scientist',
      interactive: false
    },
    {
      id: 'scene-revelation-6',
      text: 'Røkke没有回答，而是盯着显示屏，就像他昨天盯着虚空一样。屏幕上的波形似乎在...回应他的注视。当他专注地看向某段波形，它的振幅就会轻微增加。',
      background: 'lab-screens',
      audio: 'ambience-lab',
      duration: 12000,
      glitch: 0.5,
      interactive: true,
      interactionText: '[ 集中注意力 ]',
      interactionEffect: 'focus-mind'
    },
    {
      id: 'scene-revelation-focus-1',
      text: '随着他的专注，屏幕上的波形开始发生变化，变得更有规律，更...有意识。就像它正在学习如何更清晰地表达自己。',
      background: 'lab-screens-active',
      audio: 'ambience-revelation',
      duration: 10000,
      glitch: 0.6,
      interactive: false
    },
    {
      id: 'scene-revelation-focus-2',
      text: '科学家们惊讶地后退一步。"这不可能...系统没有交互功能。它只是在被动记录数据。"',
      background: 'lab-screens-active',
      audio: 'ambience-revelation',
      duration: 8000,
      glitch: 0.7,
      character: 'scientist',
      interactive: false
    },
    {
      id: 'scene-revelation-focus-3',
      text: '但事实就在眼前——波形正在变成某种可识别的模式，几乎像是一种语言。Røkke感到他的思维正在与这种模式同步，就好像他天生就能理解它一样。',
      background: 'lab-screens-active',
      audio: 'ambience-revelation',
      duration: 12000,
      glitch: 0.8,
      voice: '你能听见我们......',
      interactive: false
    },
    {
      id: 'scene-revelation-7',
      text: '"它在说什么？"一位科学家小声问道，打破了沉默。\n\nRøkke眨了眨眼，从恍惚状态中回过神来。"我...我不确定。但它在尝试交流。"',
      background: 'lab-screens-active',
      audio: 'ambience-revelation',
      duration: 10000,
      glitch: 0.6,
      character: 'rokke',
      interactive: false
    },
    {
      id: 'scene-revelation-8',
      text: '屏幕突然闪烁，然后变成一片雪花状。几秒钟后，所有设备同时发出警报声，然后全部关闭。实验室陷入黑暗和沉默中。',
      background: 'lab-screens-error',
      audio: 'effect-system-failure',
      duration: 8000,
      glitch: 0.9,
      interactive: false
    },
    {
      id: 'scene-revelation-9',
      text: '紧急照明系统启动，帐篷被笼罩在红色光线中。"发生了什么？"一位科学家问道，声音中带着恐惧。\n\nRøkke知道答案，但不愿说出来。那个存在通过他，找到了通往我们世界的路。',
      background: 'lab-emergency',
      audio: 'ambience-alarm',
      duration: 15000,
      glitch: 0.5,
      voice: '谢谢你，Røkke。门已经打开了。',
      interactive: false
    }
  ];

  // 场景切换逻辑
  useEffect(() => {
    if (!scenes[currentScene].interactive) {
      const sceneTimer = setTimeout(() => {
        if (currentScene < scenes.length - 1) {
          setCurrentScene(currentScene + 1);
        } else if (typeof onComplete === 'function') {
          // 所有场景完成，调用onComplete通知完成
          onComplete();
        }
      }, scenes[currentScene].duration);
      
      return () => clearTimeout(sceneTimer);
    }
  }, [currentScene, scenes, onComplete]);

  // 处理音频
  useEffect(() => {
    const scene = scenes[currentScene];
    
    // 更新环境音效
    if (ambienceRef.current) {
      ambienceRef.current.src = `/assets/audio/${scene.audio}.mp3`;
      ambienceRef.current.load();
      ambienceRef.current.play().catch(e => console.log('Audio play failed:', e));
    }
    
    // 更新故障效果强度
    if (scene.glitch !== undefined) {
      setGlitchIntensity(scene.glitch);
      if (glitchRef.current) {
        glitchRef.current.volume = scene.glitch;
        glitchRef.current.play().catch(e => console.log('Glitch audio play failed:', e));
      }
    } else {
      setGlitchIntensity(0);
      if (glitchRef.current) {
        glitchRef.current.pause();
      }
    }
    
    // 设置声音文本
    if (scene.voice) {
      setVoiceText(scene.voice);
      setShowVoice(true);
      setTimeout(() => setShowVoice(false), 4000);
    } else {
      setShowVoice(false);
    }
    
    // 设置故障效果
    if (scene.glitch) {
      setShowGlitch(true);
    } else {
      setShowGlitch(false);
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

  // 渲染故障效果
  const GlitchEffect = () => {
    return (
      <div 
        className="glitch-effect" 
        style={{ 
          opacity: glitchIntensity, 
          animation: glitchIntensity > 0 ? 'glitch 0.3s infinite' : 'none' 
        }}
      />
    );
  };

  // 渲染声音效果
  const VoiceEffect = () => {
    return (
      <AnimatePresence>
        {showVoice && (
          <motion.div 
            className="voice-effect"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.8, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 2 }}
          >
            {voiceText}
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  return (
    <div className="perfect-void-revelation-container">
      <div className="audio-container">
        <audio ref={ambienceRef} loop>
          <source src={`/assets/audio/${scenes[currentScene]?.audio}.mp3`} type="audio/mpeg" />
        </audio>
        <audio ref={effectSoundRef}>
          <source src="/assets/audio/effect-analyse.mp3" type="audio/mpeg" />
        </audio>
        <audio ref={glitchRef} loop>
          <source src="/assets/audio/effect-glitch.mp3" type="audio/mpeg" />
        </audio>
      </div>
      
      <AnimatePresence mode="wait">
        {renderScene()}
      </AnimatePresence>
      
      <GlitchEffect />
      <VoiceEffect />
      
      <div className="overlay"></div>
      <div className="scanline"></div>
      <div className="noise"></div>
    </div>
  );
};

// 添加必要的样式
const styles = `
  .perfect-void-revelation-container {
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
  
  /* 揭示特效 */
  .glitch-effect {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(rgba(204, 0, 255, 0.1), rgba(255, 0, 128, 0.1));
    z-index: 4;
    pointer-events: none;
    mix-blend-mode: overlay;
  }
  
  .voice-effect {
    position: fixed;
    bottom: 30%;
    left: 0;
    width: 100%;
    text-align: center;
    font-size: 2rem;
    color: rgba(0, 255, 255, 0.8);
    text-shadow: 0 0 15px rgba(0, 255, 255, 0.6);
    z-index: 15;
    pointer-events: none;
    font-family: 'Orbitron', 'Noto Sans SC', sans-serif;
    letter-spacing: 3px;
  }
  
  /* Scene backgrounds */
  .camp-night {
    background-image: linear-gradient(rgba(10, 10, 18, 0.7), rgba(10, 10, 18, 0.7)), url('/assets/images/camp-night.jpg');
    background-size: cover;
    background-position: center;
  }
  
  .lab-tent {
    background-image: linear-gradient(rgba(10, 10, 18, 0.6), rgba(10, 10, 18, 0.6)), url('/assets/images/lab-tent.jpg');
    background-size: cover;
    background-position: center;
  }
  
  .lab-screens {
    background-image: linear-gradient(rgba(10, 10, 18, 0.5), rgba(10, 10, 18, 0.5)), url('/assets/images/lab-screens.jpg');
    background-size: cover;
    background-position: center;
  }
  
  .lab-screens-active {
    background-image: linear-gradient(rgba(10, 10, 18, 0.4), rgba(10, 10, 18, 0.4)), url('/assets/images/lab-screens-active.jpg');
    background-size: cover;
    background-position: center;
  }
  
  .lab-screens-error {
    background-image: linear-gradient(rgba(10, 10, 18, 0.5), rgba(10, 10, 18, 0.5)), url('/assets/images/lab-screens-error.jpg');
    background-size: cover;
    background-position: center;
  }
  
  .lab-emergency {
    background-image: linear-gradient(rgba(10, 10, 18, 0.5), rgba(10, 10, 18, 0.5)), url('/assets/images/lab-emergency.jpg');
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
  
  @keyframes glitch {
    0% {
      opacity: 0.2;
      transform: translateX(0);
    }
    25% {
      opacity: 0.5;
      transform: translateX(5px);
    }
    50% {
      opacity: 0.3;
      transform: translateX(-5px);
    }
    75% {
      opacity: 0.4;
      transform: translateX(2px);
    }
    100% {
      opacity: 0.2;
      transform: translateX(0);
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
    
    .voice-effect {
      font-size: 1.5rem;
    }
  }
`;

export default () => (
  <>
    <style>{styles}</style>
    <PerfectVoidRevelation />
  </>
); 