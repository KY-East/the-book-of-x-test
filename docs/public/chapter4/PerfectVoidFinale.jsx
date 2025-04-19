import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// 最终章节组件
const PerfectVoidFinale = ({ onComplete }) => {
  // 状态管理
  const [currentScene, setCurrentScene] = useState(0);
  const [userInteracted, setUserInteracted] = useState(false);
  const [showEpilogue, setShowEpilogue] = useState(false);
  const [showCredits, setShowCredits] = useState(false);
  const [particleCount, setParticleCount] = useState(0);
  
  // 音频引用
  const ambienceRef = useRef(null);
  const effectSoundRef = useRef(null);
  const finaleRef = useRef(null);
  
  // 最终场景内容
  const scenes = [
    {
      id: 'scene-finale-1',
      text: '珂恩比亚内陆区科学院紧急会议，三天后。\n\n一屋子严肃的脸庞，科学家和政府官员围坐在长桌旁。Røkke坐在桌子尽头，面前放着他的笔记本和一杯几乎没动过的咖啡。',
      background: 'meeting-room',
      audio: 'ambience-meeting',
      duration: 15000,
      interactive: false
    },
    {
      id: 'scene-finale-2',
      text: '"所以，让我确认一下，"首席科学官说，她的语气中带着怀疑，"你声称虚空中有某种...存在？一种能够通过设备与你通信的实体？"',
      background: 'meeting-room',
      audio: 'ambience-meeting',
      duration: 10000,
      character: 'scientist',
      interactive: false
    },
    {
      id: 'scene-finale-3',
      text: 'Røkke平静地点头。"我知道这听起来很荒谬。但我们的设备记录了频率变化，这种变化没有已知的自然解释。而且这种变化发生在我...意识到它的存在后。"',
      background: 'meeting-room',
      audio: 'ambience-meeting',
      duration: 12000,
      character: 'rokke',
      interactive: false
    },
    {
      id: 'scene-finale-4',
      text: '一位身着军装的人清了清嗓子。"Hamar探险队的其他成员并没有报告类似的体验。"',
      background: 'meeting-room',
      audio: 'ambience-meeting',
      duration: 7000,
      character: 'military',
      interactive: false
    },
    {
      id: 'scene-finale-5',
      text: '"他们没有像我一样长时间凝视虚空，"Røkke回答，"他们没有...感受它的脉动。"',
      background: 'meeting-room',
      audio: 'ambience-meeting',
      duration: 8000,
      character: 'rokke',
      interactive: false
    },
    {
      id: 'scene-finale-6',
      text: '首席科学官叹了口气。"Røkke先生，我们理解你经历了非常消耗精力的探险。虚空地带的环境条件可能导致感知错误和幻觉。"',
      background: 'meeting-room',
      audio: 'ambience-meeting',
      duration: 10000,
      character: 'scientist',
      interactive: false
    },
    {
      id: 'scene-finale-7',
      text: '"不是幻觉。"Røkke的语气坚定，"我看到的是真实的。它...它对我们很好奇。它想要了解我们。"',
      background: 'meeting-room',
      audio: 'ambience-meeting',
      duration: 8000,
      character: 'rokke',
      interactive: true,
      interactionText: '[ 展示波形记录 ]',
      interactionEffect: 'show-evidence'
    },
    {
      id: 'scene-finale-evidence-1',
      text: 'Røkke打开笔记本，调出波形数据。他放大了一段特定的波形，屏幕上显示出规律的、几乎呈现韵律的波动。',
      background: 'meeting-screens',
      audio: 'ambience-meeting',
      duration: 10000,
      interactive: false
    },
    {
      id: 'scene-finale-evidence-2',
      text: '"这些模式超出了任何已知的自然现象。如果将其转换为声音..."他按下一个按钮，房间里回荡起一种奇异的、几乎具有超验性的声音序列，像是某种词语或表达，但又完全不像人类语言。',
      background: 'meeting-screens',
      audio: 'effect-void-language',
      duration: 15000,
      character: 'rokke',
      interactive: false
    },
    {
      id: 'scene-finale-evidence-3',
      text: '房间里的每个人都瞪大了眼睛。军官小声地说了些什么，而科学家们交换着震惊的眼神。首席科学官慢慢地合上了自己的笔记本。',
      background: 'meeting-screens',
      audio: 'ambience-meeting',
      duration: 12000,
      interactive: false
    },
    {
      id: 'scene-finale-8',
      text: '"Røkke先生，"首席科学官最终开口，"我认为我们需要更深入地研究这些数据。军方也会参与这个项目的后续阶段。同时，这些发现必须严格保密。"',
      background: 'meeting-room',
      audio: 'ambience-meeting',
      duration: 15000,
      character: 'scientist',
      interactive: false
    },
    {
      id: 'scene-finale-9',
      text: '会议结束后，Røkke独自一人站在科学院的观景台上，凝视着夜空中的星星。他知道那虚空不只是他们世界的一个怪异现象——它是某种窗口，通向另一个维度，另一种存在形式。',
      background: 'observatory-night',
      audio: 'ambience-night',
      duration: 15000,
      interactive: false
    },
    {
      id: 'scene-finale-10',
      text: '他掏出手机，找到了Hamar的号码。他必须告诉他真相，告诉他他们在那虚空中真正发现了什么。因为那个存在——无论它是什么——已经注意到了他们。',
      background: 'observatory-night',
      audio: 'ambience-night',
      duration: 12000,
      interactive: true,
      interactionText: '[ 拨打电话 ]',
      interactionEffect: 'call-hamar'
    },
    {
      id: 'scene-finale-call-1',
      text: '"Hamar，是我。"Røkke说，声音低沉而紧张，"关于虚空，还有更多。那里有某种...意识。它通过我们的设备与我交流了。"',
      background: 'phone-call',
      audio: 'effect-phone-call',
      duration: 12000,
      character: 'rokke',
      interactive: false
    },
    {
      id: 'scene-finale-call-2',
      text: '电话那头沉默了一会儿。然后，Hamar用一种Røkke从未听过的严肃语气说:"我知道。我也感觉到了什么，但不敢确定。他们让你保密了，对吧？"',
      background: 'phone-call',
      audio: 'effect-phone-call',
      duration: 15000,
      character: 'hamar',
      interactive: false
    },
    {
      id: 'scene-finale-call-3',
      text: '"是的，但这太重要了，我不能就这样...这件事不仅关乎科学发现，Hamar。这改变了一切。我们不是宇宙中唯一的智能形式。"',
      background: 'phone-call',
      audio: 'effect-phone-call',
      duration: 12000,
      character: 'rokke',
      interactive: false
    },
    {
      id: 'scene-finale-call-4',
      text: '"我们需要谨慎行事，老朋友。"Hamar说，"我明天来找你，我们当面谈。这些...实体，无论它们是什么，已经对我们产生了兴趣。这可能是人类历史上最重要的接触。"',
      background: 'phone-call',
      audio: 'effect-phone-call',
      duration: 15000,
      character: 'hamar',
      interactive: false
    },
    {
      id: 'scene-finale-11',
      text: 'Røkke挂断电话，再次望向夜空。在无尽的星海之外，在宇宙的无数黑暗角落，也许还有无数个虚空，无数个窗口。在他们的世界之外，有某种存在正在探究，正在观察——就像他们观察虚空一样。',
      background: 'observatory-night',
      audio: 'ambience-night',
      duration: 20000,
      interactive: true,
      interactionText: '[ 结束章节 ]',
      interactionEffect: 'finish-chapter'
    }
  ];

  // 尾声和致谢文本
  const epilogueText = `在之后的几个月里，珂恩比亚内陆区发起了一项秘密研究计划，代号"回声"。Røkke和Hamar成为了项目的核心顾问。

他们建立了更精密的设备，尝试与虚空中的实体建立更清晰的通信。随着时间推移，他们逐渐建立了一种基础的"语言"——通过波形和频率模式。

虚空实体传达的信息片段揭示了一个令人震惊的事实：它们居住在一个与我们平行但维度更高的现实中。对它们来说，我们的整个宇宙只是它们现实的一个"投影"或"截面"。

而完美虚空只是我们两个现实之间的一个罕见交汇点，一扇稍微打开的门。

故事仍在继续...`;

  const creditsText = `《完美虚空》

作者：《Ξ之书》创作团队
设计：网络先知工作室
音效：量子声波实验室

特别感谢所有支持这一探索性叙事体验的读者。

"现实的边界不在星辰之间，而在于我们感知的边缘。"`;

  // 场景切换逻辑
  useEffect(() => {
    if (!userInteracted) {
      const sceneTimer = setTimeout(() => {
        if (currentScene < scenes.length - 1 && !scenes[currentScene].interactive) {
          setCurrentScene(prev => prev + 1);
        }
      }, scenes[currentScene].duration);
      
      return () => clearTimeout(sceneTimer);
    }
  }, [currentScene, userInteracted, scenes]);

  // 处理音频
  useEffect(() => {
    const scene = scenes[currentScene];
    
    // 更新环境音效
    if (ambienceRef.current) {
      ambienceRef.current.src = `/assets/audio/${scene.audio}.mp3`;
      ambienceRef.current.load();
      ambienceRef.current.play().catch(e => console.log('Audio play failed:', e));
    }
  }, [currentScene, scenes]);

  // 结局粒子效果
  useEffect(() => {
    if (showEpilogue) {
      const particleInterval = setInterval(() => {
        if (particleCount < 50) {
          setParticleCount(prev => prev + 1);
        } else {
          clearInterval(particleInterval);
        }
      }, 200);
      
      return () => clearInterval(particleInterval);
    }
  }, [showEpilogue, particleCount]);

  // 处理结局音乐
  useEffect(() => {
    if (showEpilogue && finaleRef.current) {
      finaleRef.current.play().catch(e => console.log('Finale audio play failed:', e));
    }
  }, [showEpilogue]);

  // 处理交互
  const handleInteraction = (effect) => {
    setUserInteracted(true);
    
    // 播放交互音效
    if (effectSoundRef.current) {
      effectSoundRef.current.src = `/assets/audio/effect-${effect}.mp3`;
      effectSoundRef.current.load();
      effectSoundRef.current.play().catch(e => console.log('Effect audio play failed:', e));
    }
    
    // 特殊交互 - 结束章节
    if (effect === 'finish-chapter') {
      setTimeout(() => {
        setShowEpilogue(true);
        
        // 在显示尾声10秒后显示致谢
        setTimeout(() => {
          setShowCredits(true);
          
          // 在显示致谢5秒后调用onComplete
          if (typeof onComplete === 'function') {
            setTimeout(() => onComplete(), 5000);
          }
        }, 20000);
      }, 2000);
    } else {
      // 普通交互
      setTimeout(() => {
        setUserInteracted(false);
        setCurrentScene(prev => prev + 1);
      }, 2000);
    }
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
               scene.character === 'scientist' ? '首席科学官' :
               scene.character === 'military' ? '军官' : scene.character}
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

  // 渲染尾声部分
  const renderEpilogue = () => {
    return (
      <motion.div 
        className="epilogue"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 3 }}
      >
        <div className="epilogue-content">
          {epilogueText.split('\n\n').map((paragraph, index) => (
            <motion.p 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 1.5 + 1, duration: 2 }}
              className="epilogue-paragraph"
            >
              {paragraph}
            </motion.p>
          ))}
        </div>
        
        {Array.from({ length: particleCount }).map((_, index) => (
          <div 
            key={index}
            className="epilogue-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </motion.div>
    );
  };

  // 渲染致谢部分
  const renderCredits = () => {
    return (
      <motion.div 
        className="credits"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 4 }}
      >
        <div className="credits-content">
          {creditsText.split('\n\n').map((section, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 1.5, duration: 2 }}
              className="credits-section"
            >
              {section.split('\n').map((line, lineIndex) => (
                <p key={lineIndex} className="credits-line">{line}</p>
              ))}
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="perfect-void-finale-container">
      <div className="audio-container">
        <audio ref={ambienceRef} loop>
          <source src={`/assets/audio/${scenes[currentScene]?.audio}.mp3`} type="audio/mpeg" />
        </audio>
        <audio ref={effectSoundRef}>
          <source src="/assets/audio/effect-click.mp3" type="audio/mpeg" />
        </audio>
        <audio ref={finaleRef} loop>
          <source src="/assets/audio/finale-theme.mp3" type="audio/mpeg" />
        </audio>
      </div>
      
      <AnimatePresence mode="wait">
        {!showEpilogue && renderScene()}
        {showEpilogue && !showCredits && renderEpilogue()}
        {showCredits && renderCredits()}
      </AnimatePresence>
      
      <div className="overlay"></div>
      <div className="scanline"></div>
    </div>
  );
};

// 添加必要的样式
const styles = `
  .perfect-void-finale-container {
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
  
  .character-marker.hamar {
    background-color: var(--neon-secondary);
    box-shadow: 0 0 10px rgba(255, 51, 102, 0.5);
  }
  
  .character-marker.scientist {
    background-color: var(--neon-purple);
    box-shadow: 0 0 10px rgba(204, 0, 255, 0.5);
  }
  
  .character-marker.military {
    background-color: var(--neon-blue);
    box-shadow: 0 0 10px rgba(0, 102, 255, 0.5);
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
  
  /* Epilogue styles */
  .epilogue {
    position: relative;
    z-index: 5;
    height: 100vh;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    background-image: linear-gradient(rgba(10, 10, 18, 0.7), rgba(10, 10, 18, 0.7)), url('/assets/images/stars-bg.jpg');
    background-size: cover;
    background-position: center;
  }
  
  .epilogue-content {
    max-width: 800px;
    padding: 30px;
    background-color: rgba(10, 10, 18, 0.7);
    border: 1px solid rgba(0, 255, 157, 0.3);
    border-radius: 5px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
    z-index: 10;
  }
  
  .epilogue-paragraph {
    font-size: 1.3rem;
    line-height: 1.8;
    margin-bottom: 1.5rem;
  }
  
  .epilogue-particle {
    position: absolute;
    width: 3px;
    height: 3px;
    background: var(--neon-primary);
    border-radius: 50%;
    box-shadow: 0 0 10px var(--neon-primary);
    animation: float 10s infinite ease-in-out;
    z-index: 1;
    opacity: 0.7;
  }
  
  /* Credits styles */
  .credits {
    position: relative;
    z-index: 5;
    height: 100vh;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    background-image: linear-gradient(rgba(10, 10, 18, 0.8), rgba(10, 10, 18, 0.8)), url('/assets/images/void-bg.jpg');
    background-size: cover;
    background-position: center;
  }
  
  .credits-content {
    max-width: 600px;
    text-align: center;
  }
  
  .credits-section {
    margin-bottom: 2rem;
  }
  
  .credits-line {
    margin: 0.5rem 0;
    font-size: 1.2rem;
  }
  
  .credits-line:first-child {
    font-size: 2rem;
    font-family: 'Orbitron', sans-serif;
    color: var(--neon-primary);
    margin-bottom: 1.5rem;
  }
  
  /* Scene backgrounds */
  .meeting-room {
    background-image: linear-gradient(rgba(10, 10, 18, 0.6), rgba(10, 10, 18, 0.6)), url('/assets/images/meeting-room.jpg');
    background-size: cover;
    background-position: center;
  }
  
  .meeting-screens {
    background-image: linear-gradient(rgba(10, 10, 18, 0.5), rgba(10, 10, 18, 0.5)), url('/assets/images/meeting-screens.jpg');
    background-size: cover;
    background-position: center;
  }
  
  .observatory-night {
    background-image: linear-gradient(rgba(10, 10, 18, 0.5), rgba(10, 10, 18, 0.5)), url('/assets/images/observatory-night.jpg');
    background-size: cover;
    background-position: center;
  }
  
  .phone-call {
    background-image: linear-gradient(rgba(10, 10, 18, 0.7), rgba(10, 10, 18, 0.7)), url('/assets/images/phone-call.jpg');
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
  
  @keyframes float {
    0% {
      transform: translateY(0) translateX(0);
    }
    25% {
      transform: translateY(-20px) translateX(10px);
    }
    50% {
      transform: translateY(-40px) translateX(-10px);
    }
    75% {
      transform: translateY(-60px) translateX(5px);
    }
    100% {
      transform: translateY(-100px) translateX(0);
      opacity: 0;
    }
  }
  
  /* Media queries */
  @media (max-width: 768px) {
    .scene-content, .epilogue-content {
      padding: 20px;
      margin: 0 20px;
    }
    
    .scene-text, .epilogue-paragraph {
      font-size: 1.1rem;
    }
    
    .credits-line:first-child {
      font-size: 1.7rem;
    }
    
    .credits-line {
      font-size: 1rem;
    }
  }
`;

export default () => (
  <>
    <style>{styles}</style>
    <PerfectVoidFinale />
  </>
); 