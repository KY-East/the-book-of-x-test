import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PerfectVoidFinale = () => {
  const [currentScene, setCurrentScene] = useState(0);
  const [showPortrait, setShowPortrait] = useState(false);
  const [auroraIntensity, setAuroraIntensity] = useState(0);
  const [whisperVolume, setWhisperVolume] = useState(0);
  const [showEndCredits, setShowEndCredits] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  
  const containerRef = useRef(null);
  const ambienceRef = useRef(null);
  const whisperRef = useRef(null);
  const portraitRef = useRef(null);
  
  const scenes = [
    {
      id: 'scene-cabin',
      text: '当夜晚再次降临，或者说当半极昼暂时减弱到接近黄昏的程度时，Røkke回到了他在城镇边的小屋。屋子是他祖父留下的，木质结构，建在悬崖边，俯瞰整个哈当厄尔（Hardangerfjord）。他在这里住了十五年，远离城市，远离人群，只有海浪和山风作伴。',
      background: 'cabin-evening',
      audio: 'ambience-cabin',
      duration: 10000,
      interactive: false
    },
    {
      id: 'scene-whiskey',
      text: '他坐在门廊的椅子上，手中握着一杯12年原桶高地威士忌，没有开灯。事实上，他已经忘了开灯。黑暗中，他的思绪回到那个完美的球形空洞，以及名单上的那个名字。',
      background: 'cabin-porch',
      audio: 'ambience-cabin',
      duration: 8000,
      interactive: false
    },
    {
      id: 'scene-memories',
      text: 'Rolf。他上一次见到弟弟是在前年圣诞节，他们在奥斯陆短暂相聚，交换了礼物——Rolf送了他一套高级音响，而他送了弟弟一把祖父的旧猎刀。他们喝了酒，聊了工作，但都小心翼翼地避开了童年的话题。不是因为有什么创伤，只是……距离。',
      background: 'cabin-porch',
      audio: 'ambience-cabin',
      duration: 10000,
      interactive: false
    },
    {
      id: 'scene-regret',
      text: '父亲和新妻子搬到奥斯陆后，他留在了西北部老家，而Rolf则跟随父亲去了南方。他们成长在不同的家庭里，变成了不同的人。\n\nRolf和他说过去年可能回老家附近的一个峡湾协助一个项目，但是他当时应该是在忙一个亚美尼亚黑帮的勒索杀人案，几天都没休息，忘了回复，后来就更不知道怎么回复，哪怕两人可能只隔了80英里，却一直都没见过面。',
      background: 'cabin-porch-darker',
      audio: 'ambience-cabin',
      duration: 10000,
      interactive: true,
      interactionText: '查看弟弟的照片'
    },
    {
      id: 'scene-aurora',
      text: 'Røkke的思绪被一道突然的光芒打断。他抬起头，看到夜空中极光开始舞动——起初只是淡绿色的光带，但迅速变得强烈，开始呈现出不寻常的色彩——深紫、鲜红、电蓝色彼此交织，形成复杂的图案。',
      background: 'cabin-aurora',
      audio: 'ambience-aurora',
      duration: 8000,
      interactive: false
    },
    {
      id: 'scene-aurora-description',
      text: '挪威的极光并不罕见，但如此强烈、如此多彩的极光在四月却极为少见。更奇怪的是，极光似乎集中在某个区域，形成一种环形结构，就像......\n\n就像天空中出现了一个洞。',
      background: 'cabin-aurora-ring',
      audio: 'ambience-aurora',
      duration: 8000,
      interactive: false
    },
    {
      id: 'scene-ring-observation',
      text: 'Røkke站起身，盯着那奇异的景象。极光在环形边缘最为强烈，而中心区域却异常黑暗，形成了一个近乎完美的圆形。这个"洞"正对着研究站消失的方向，仿佛天空与地面相呼应。',
      background: 'cabin-aurora-ring',
      audio: 'ambience-aurora',
      duration: 8000,
      interactive: false
    },
    {
      id: 'scene-footage-review',
      text: 'Røkke回到小屋，倒了杯威士忌，打开笔记本电脑。他习惯性地连接手机，传输今天在现场拍摄的视频材料。二十年的刑侦工作让他养成了详尽记录的习惯——尤其是这种超出常规的案件。',
      background: 'cabin-interior',
      audio: 'ambience-cabin-interior',
      duration: 8000,
      interactive: false
    },
    {
      id: 'scene-video-anomaly',
      text: '视频在屏幕上播放，画面晃动着扫过那个完美的球形空洞。他注意到自己的呼吸声在背景中，偶尔传来技术人员的交谈。就在镜头扫向空洞中心时，他看到一种奇怪的视觉扭曲——不是光线折射，而是画面本身似乎出现了微妙的波纹。',
      background: 'cabin-computer',
      audio: 'ambience-cabin-interior',
      whisperAudio: 'whispering-soft',
      duration: 8000,
      interactive: false
    },
    {
      id: 'scene-audio-anomaly',
      text: '他皱眉，倒回那段视频，降低播放速度。没错，确实有异常——当镜头对准空洞中心时，画面边缘出现了轻微但明确的波动，像水波一样扩散。而且伴随这种视觉异常，音轨中出现了一种奇怪的杂音。\n\n他调高音量，过滤环境声。',
      background: 'cabin-computer-closeup',
      audio: 'ambience-cabin-interior',
      whisperAudio: 'whispering-medium',
      duration: 10000,
      interactive: false
    },
    {
      id: 'scene-final-revelation',
      text: '那声音有着异常的节奏和结构，不像任何自然产生的噪音。更奇怪的是，当某段杂音特别清晰时，他似乎听到了一个熟悉的声调——Rolf说话时特有的那种音调变化。\n\n"见鬼..."',
      background: 'cabin-computer-closeup',
      audio: 'ambience-cabin-interior',
      whisperAudio: 'whispering-loud',
      duration: 8000,
      interactive: false
    },
    {
      id: 'scene-final',
      text: '他立即摇头，将这归因于应激反应和疲劳。人类大脑总是试图在随机噪声中寻找熟悉的模式，尤其是当你刚刚失去一个人的时候。\n\nRøkke关闭电脑，走到窗前。\n\n极光在夜空中形成完美的环形，冷酷且精确。',
      background: 'cabin-window-aurora',
      audio: 'ambience-aurora',
      whisperAudio: 'rolf-voice',
      duration: 10000,
      interactive: true,
      interactionText: '完成第一章'
    }
  ];

  useEffect(() => {
    if (audioEnabled && ambienceRef.current) {
      ambienceRef.current.volume = 0.3;
      ambienceRef.current.play().catch(e => console.log('Audio play failed:', e));
    }
    
    return () => {
      if (ambienceRef.current) {
        ambienceRef.current.pause();
      }
      if (whisperRef.current) {
        whisperRef.current.pause();
      }
    };
  }, [audioEnabled, currentScene]);

  useEffect(() => {
    if (!audioEnabled) return;
    
    const scene = scenes[currentScene];
    if (ambienceRef.current && scene.audio) {
      ambienceRef.current.src = `/assets/audio/${scene.audio}.mp3`;
      ambienceRef.current.load();
      ambienceRef.current.play().catch(e => console.log('Audio play failed:', e));
    }
    
    if (whisperRef.current && scene.whisperAudio) {
      whisperRef.current.src = `/assets/audio/${scene.whisperAudio}.mp3`;
      whisperRef.current.load();
      whisperRef.current.volume = 0.1;
      whisperRef.current.play().catch(e => console.log('Audio play failed:', e));
      
      if (scene.id === 'scene-final') {
        const volumeInterval = setInterval(() => {
          if (whisperRef.current && whisperRef.current.volume < 0.4) {
            whisperRef.current.volume += 0.05;
          } else {
            clearInterval(volumeInterval);
          }
        }, 1000);
        
        return () => clearInterval(volumeInterval);
      }
    }
  }, [currentScene, audioEnabled]);

  useEffect(() => {
    if (scenes[currentScene].background.includes('aurora')) {
      setAuroraIntensity(50);
      
      const intensityInterval = setInterval(() => {
        setAuroraIntensity(prev => {
          const newValue = prev + (Math.random() > 0.5 ? 5 : -5);
          return Math.max(40, Math.min(70, newValue));
        });
      }, 2000);
      
      return () => clearInterval(intensityInterval);
    } else {
      setAuroraIntensity(0);
    }
  }, [currentScene]);
  
  useEffect(() => {
    if (!scenes[currentScene].interactive && !showPortrait) {
      const timer = setTimeout(() => {
        if (currentScene < scenes.length - 1) {
          setCurrentScene(prev => prev + 1);
        }
      }, scenes[currentScene].duration);
      
      return () => clearTimeout(timer);
    }
  }, [currentScene, showPortrait]);
  
  useEffect(() => {
    if (scenes[currentScene].whisperAudio) {
      setWhisperVolume(prev => Math.min(1, prev + 0.1));
    } else {
      setWhisperVolume(0);
    }
  }, [currentScene]);
  
  const handleViewPortrait = () => {
    setShowPortrait(true);
    
    setTimeout(() => {
      setShowPortrait(false);
      setCurrentScene(prev => prev + 1);
    }, 5000);
  };
  
  const handleFinish = () => {
    setShowEndCredits(true);
  };
  
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
          <p className="scene-text">
            {scene.text.split('\n').map((paragraph, index) => (
              <React.Fragment key={index}>
                {paragraph}
                {index < scene.text.split('\n').length - 1 && <br /><br />}
              </React.Fragment>
            ))}
          </p>
          
          {scene.interactive && (
            <motion.button
              className="interaction-button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              onClick={scene.id === 'scene-regret' ? handleViewPortrait : handleFinish}
            >
              {scene.interactionText}
            </motion.button>
          )}
        </div>
      </motion.div>
    );
  };
  
  const renderPortrait = () => {
    return (
      <motion.div
        className="portrait-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="portrait-container"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="portrait-frame">
            <div className="portrait-image" ref={portraitRef}></div>
            <div className="portrait-caption">Rolf Røkke，摄于奥斯陆，2022年圣诞节</div>
          </div>
        </motion.div>
      </motion.div>
    );
  };
  
  const renderEndCredits = () => {
    return (
      <motion.div
        className="end-credits"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        <h1 className="end-title">完美的空洞</h1>
        <h2 className="end-subtitle">风暴之喉 - 第一章</h2>
        
        <div className="end-quote">
          <p>"真相并非总在可见之处，有时它藏在完美的空洞中，仿佛被从现实中切除的一部分。"</p>
        </div>
        
        <div className="credits-section">
          <p className="credits-heading">故事将继续...</p>
          <p className="credits-note">请在下一章中继续探索深入峡湾底部的谜团</p>
        </div>
        
        <div className="credits-footer">
          <div className="xi-symbol">Ξ</div>
          <p>The Book of Ξ</p>
        </div>
      </motion.div>
    );
  };
  
  const renderIntro = () => {
    return (
      <motion.div
        className="intro-overlay"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 2, duration: 1 }}
        onAnimationComplete={() => setAudioEnabled(true)}
      >
        <div className="intro-content">
          <h1>完美的空洞</h1>
          <h2>尾声</h2>
          <p>推荐佩戴耳机以获得最佳体验</p>
        </div>
      </motion.div>
    );
  };
  
  const AuroraEffect = () => {
    const canvasRef = useRef(null);
    
    useEffect(() => {
      if (auroraIntensity === 0) return;
      
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      let animationFrameId;
      
      const setCanvasSize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };
      
      const drawAurora = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 3;
        const outerRadius = canvas.width / 3;
        const innerRadius = canvas.width / 4;
        const auroraWidth = 50 + auroraIntensity;
        
        const gradient = ctx.createRadialGradient(
          centerX, centerY, innerRadius,
          centerX, centerY, outerRadius
        );
        
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0.8)');
        gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.6)');
        gradient.addColorStop(0.8, 'rgba(76, 0, 153, 0.5)');
        gradient.addColorStop(0.85, 'rgba(120, 0, 255, 0.6)');
        gradient.addColorStop(0.9, 'rgba(0, 255, 157, 0.7)');
        gradient.addColorStop(0.95, 'rgba(0, 191, 255, 0.5)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        for (let i = 0; i < 20; i++) {
          const angle = Math.random() * Math.PI * 2;
          const length = innerRadius + Math.random() * auroraWidth;
          
          const startX = centerX + Math.cos(angle) * innerRadius;
          const startY = centerY + Math.sin(angle) * innerRadius;
          
          const endX = centerX + Math.cos(angle) * length;
          const endY = centerY + Math.sin(angle) * length;
          
          const beamGradient = ctx.createLinearGradient(startX, startY, endX, endY);
          beamGradient.addColorStop(0, 'rgba(0, 255, 157, 0.7)');
          beamGradient.addColorStop(1, 'rgba(0, 255, 157, 0)');
          
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(endX, endY);
          ctx.lineWidth = 1 + Math.random() * 2;
          ctx.strokeStyle = beamGradient;
          ctx.stroke();
        }
        
        animationFrameId = requestAnimationFrame(drawAurora);
      };
      
      setCanvasSize();
      drawAurora();
      
      window.addEventListener('resize', setCanvasSize);
      
      return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('resize', setCanvasSize);
      };
    }, [auroraIntensity]);
    
    if (auroraIntensity === 0) return null;
    
    return <canvas ref={canvasRef} className="aurora-canvas" />;
  };
  
  const WhisperEffect = () => {
    if (whisperVolume === 0) return null;
    
    return (
      <div 
        className="whisper-overlay"
        style={{ opacity: whisperVolume * 0.3 }}
      >
        <div className="whisper-text" style={{ opacity: whisperVolume }}>
          {Array(10).fill(0).map((_, i) => (
            <div 
              key={i}
              className="floating-whisper"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDuration: `${5 + Math.random() * 10}s`,
                animationDelay: `${Math.random() * 5}s`,
                opacity: Math.random() * 0.7 + 0.3
              }}
            >
              rolf...
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <div className="perfect-void-finale" ref={containerRef}>
      <div className="audio-container">
        <audio ref={ambienceRef} loop>
          <source src="/assets/audio/ambience-cabin.mp3" type="audio/mpeg" />
        </audio>
        <audio ref={whisperRef} loop>
          <source src="/assets/audio/whispering-soft.mp3" type="audio/mpeg" />
        </audio>
      </div>
      
      <AuroraEffect />
      <WhisperEffect />
      
      <AnimatePresence mode="wait">
        {!audioEnabled && renderIntro()}
        {showEndCredits && renderEndCredits()}
        {showPortrait && renderPortrait()}
        {!showEndCredits && audioEnabled && renderScene()}
      </AnimatePresence>
      
      <div className="overlay"></div>
      <div className="scanline"></div>
      <div className="noise"></div>
    </div>
  );
};

// 添加必要的样式
const styles = `
  .perfect-void-finale {
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
  
  .noise {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAADkElEQVRogc2aS2tUQRDHfzOjMYm+8IHvmBgUfEQFxYUKunHhSgQXfgbBhQvBjRvRrQu/gR9AFMGFD4wodCHiRhCSqARBDTFGE01EQtR4LaoH7qTvnDMzc3Jv/eHAnT7ddaqru6u6e+Cfc8AFoE4bUgcmgbOAJdABRiXJbsDW27xkArhn9rQl7Yg1ZAN4C5wEugLPcqMLeAR8BHo60JFeMTHO9B3gIHAVaAA/gZf6rQHU9KymY5xLx0JQ0Q2k1JKVeR4wCLwGbgLDwFpgFdANVHQ01SWmL2cAO4CfCaXyFhguuI8dWj+vInlRNvOMfCnhfZzLEbPM8wH81kPfaC5uJLAn8w2/wVqsN2sMv+FapMzOTqwsRvDPHYDJwJ4oFsgYN8nRnUCrJQyshkduZfEicyZV6zOK9bF46vAe24YV1mpXiMPSiawwXCJJlv+tHCqQHTtsmXAKfysq7N8NSL15VyBJNzgJfCPuLOJDXX0yYOq8ThdlxRJ6SVwZdTXEHPYJo6FKzIvmxD7TTySG2gkNmrCTbsDYSDWUMTYq5ucXUya8TXKf+l4OhZ3GHvWtzjK2ThnbHkYAjZrw1pj7Q4pklzRqwvUSjlVkr/oWI8s2ZeynGVtODGnCG2buhYEkmVJNSfLFyJhtyvgxM7YcaOjnMnPnLUfmzWdTk4bI0Z5Kp+yTIVP0HJFtGDrJpXQKuBxJaHm+BtI7PaU8qL7fEiZ5Sdy5q77jZqzFI0PrJcmjaDOywHHc5yPgVCSBfZgq8+vDlOJn5n4jrvJhGHfZ8wC4H0lgH8aNzDbTTySOvkdIoTPSBZxGGsGAJ4H0T5c+y/RR4BbSNLbTB2wDDiD1ox+4g9SRZ/pf2WR/gDx+yovZFIIvVcAhdjCkMQO8Qhr/YaQ8XmGXuZb63iXcWz5kmn4/pCfvI63OIXN/HbPVxvXAZeALMjcm1beGfFCcMc8u0SpWrWLWr2nfvwIfzB7XdMwLFhhETuIIcAzYhTR9K3JktR+4BtxGCg8hn+BF3gW+A3cLrI3JdqSsmVZHfYwOHkJqyAB+53kCPAb2aeyPOhZUnB1K5jJbvgMX1yjyxeM9UAW2h5JnQQ/ueeDT0R9IOXGiC/gVsBnfTteCR5Gi5yucj3F2cJXe4U2WnXmVDRyc3eQ5sK/DMklnJT8CN/ByQ1U2tBu/ASW2hKJJI3bPAAAAAElFTkSuQmCC');
    opacity: 0.05;
    z-index: 4;
    pointer-events: none;
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
  
  .aurora-canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    pointer-events: none;
  }
  
  .whisper-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 10;
  }
  
  .whisper-text {
    position: relative;
    width: 100%;
    height: 100%;
  }
  
  .floating-whisper {
    position: absolute;
    color: rgba(255, 255, 255, 0.5);
    font-family: 'Fira Code', monospace;
    font-size: 0.9rem;
    text-shadow: 0 0 5px rgba(0, 255, 157, 0.7);
    animation: float-whisper infinite linear;
  }
  
  .portrait-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 20;
  }
  
  .portrait-container {
    width: 350px;
    background-color: #111;
    padding: 10px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  }
  
  .portrait-frame {
    position: relative;
    width: 100%;
    height: 500px;
    overflow: hidden;
    border: 1px solid #333;
  }
  
  .portrait-image {
    width: 100%;
    height: 100%;
    background-image: url('/assets/images/rolf-portrait.jpg');
    background-size: cover;
    background-position: center;
    filter: sepia(0.2) contrast(1.1);
    transition: all 0.5s ease;
  }
  
  .portrait-image:hover {
    filter: sepia(0) contrast(1);
  }
  
  .portrait-caption {
    margin-top: 10px;
    text-align: center;
    font-size: 0.9rem;
    color: #aaa;
    font-style: italic;
  }
  
  .end-credits {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #0a0a12;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 50px 20px;
    text-align: center;
    z-index: 100;
  }
  
  .end-title {
    font-family: 'Orbitron', 'ZCOOL QingKe HuangYou', sans-serif;
    font-size: 3rem;
    color: var(--neon-primary);
    margin-bottom: 10px;
    text-shadow: 0 0 15px rgba(0, 255, 157, 0.7);
  }
  
  .end-subtitle {
    font-family: 'ZCOOL XiaoWei', serif;
    font-size: 1.5rem;
    color: var(--neon-secondary);
    margin-bottom: 50px;
  }
  
  .end-quote {
    max-width: 700px;
    margin: 0 auto 50px;
    font-style: italic;
    color: #ddd;
    font-size: 1.2rem;
    line-height: 1.6;
    padding: 20px;
    border-top: 1px solid rgba(0, 255, 157, 0.3);
    border-bottom: 1px solid rgba(0, 255, 157, 0.3);
  }
  
  .credits-section {
    margin-bottom: 50px;
  }
  
  .credits-heading {
    color: var(--neon-primary);
    font-size: 1.5rem;
    margin-bottom: 10px;
  }
  
  .credits-note {
    color: #aaa;
    font-size: 1rem;
  }
  
  .credits-footer {
    margin-top: 50px;
  }
  
  .xi-symbol {
    font-size: 2.5rem;
    color: var(--neon-primary);
    margin-bottom: 10px;
    text-shadow: 0 0 10px rgba(0, 255, 157, 0.7);
  }
  
  .intro-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #0a0a12;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
  }
  
  .intro-content {
    text-align: center;
  }
  
  .intro-content h1 {
    font-family: 'Orbitron', 'ZCOOL QingKe HuangYou', sans-serif;
    font-size: 3rem;
    color: var(--neon-primary);
    margin-bottom: 10px;
    text-shadow: 0 0 15px rgba(0, 255, 157, 0.7);
  }
  
  .intro-content h2 {
    font-family: 'ZCOOL XiaoWei', serif;
    font-size: 1.5rem;
    color: var(--neon-secondary);
    margin-bottom: 30px;
  }
  
  .intro-content p {
    color: #aaa;
    font-size: 1rem;
    font-style: italic;
  }
  
  /* 场景背景 */
  .cabin-evening {
    background-image: linear-gradient(rgba(10, 10, 18, 0.7), rgba(10, 10, 18, 0.7)), url('/assets/images/cabin-evening.jpg');
    background-size: cover;
    background-position: center;
  }
  
  .cabin-porch {
    background-image: linear-gradient(rgba(10, 10, 18, 0.7), rgba(10, 10, 18, 0.7)), url('/assets/images/cabin-porch.jpg');
    background-size: cover;
    background-position: center;
  }
  
  .cabin-porch-darker {
    background-image: linear-gradient(rgba(5, 5, 10, 0.8), rgba(5, 5, 10, 0.8)), url('/assets/images/cabin-porch.jpg');
    background-size: cover;
    background-position: center;
  }
  
  .cabin-aurora {
    background-image: linear-gradient(rgba(10, 10, 18, 0.5), rgba(10, 10, 18, 0.5)), url('/assets/images/cabin-aurora.jpg');
    background-size: cover;
    background-position: center;
  }
  
  .cabin-aurora-ring {
    background-image: linear-gradient(rgba(10, 10, 18, 0.5), rgba(10, 10, 18, 0.5)), url('/assets/images/cabin-aurora-ring.jpg');
    background-size: cover;
    background-position: center;
  }
  
  .cabin-interior {
    background-image: linear-gradient(rgba(10, 10, 18, 0.7), rgba(10, 10, 18, 0.7)), url('/assets/images/cabin-interior.jpg');
    background-size: cover;
    background-position: center;
  }
  
  .cabin-computer {
    background-image: linear-gradient(rgba(10, 10, 18, 0.7), rgba(10, 10, 18, 0.7)), url('/assets/images/cabin-computer.jpg');
    background-size: cover;
    background-position: center;
  }
  
  .cabin-computer-closeup {
    background-image: linear-gradient(rgba(10, 10, 18, 0.7), rgba(10, 10, 18, 0.7)), url('/assets/images/cabin-computer-closeup.jpg');
    background-size: cover;
    background-position: center;
  }
  
  .cabin-window-aurora {
    background-image: linear-gradient(rgba(10, 10, 18, 0.5), rgba(10, 10, 18, 0.5)), url('/assets/images/cabin-window-aurora.jpg');
    background-size: cover;
    background-position: center;
  }
  
  /* 动画 */
  @keyframes scanline {
    0% {
      top: -100px;
    }
    100% {
      top: 100%;
    }
  }
  
  @keyframes float-whisper {
    0% {
      transform: translate(0, 0) rotate(0deg);
    }
    50% {
      transform: translate(10px, -15px) rotate(5deg);
    }
    100% {
      transform: translate(0, 0) rotate(0deg);
    }
  }
  
  /* 媒体查询 */
  @media (max-width: 768px) {
    .scene-content {
      padding: 20px;
      margin: 0 20px;
    }
    
    .scene-text {
      font-size: 1.1rem;
    }
    
    .end-title {
      font-size: 2.2rem;
    }
    
    .end-subtitle {
      font-size: 1.2rem;
    }
    
    .portrait-container {
      width: 300px;
    }
    
    .portrait-frame {
      height: 400px;
    }
  }
`;

export default () => (
  <>
    <style>{styles}</style>
    <PerfectVoidFinale />
  </>
);
