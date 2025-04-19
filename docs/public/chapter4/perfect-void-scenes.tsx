import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// 第二部分场景组件
const PerfectVoidScenes = () => {
  // 状态管理
  const [currentScene, setCurrentScene] = useState(0);
  const [userInteracted, setUserInteracted] = useState(false);
  const [highlightedText, setHighlightedText] = useState(null);
  const [showEffect, setShowEffect] = useState(false);
  
  // 音频引用
  const ambienceRef = useRef(null);
  const effectSoundRef = useRef(null);
  
  // 继续场景内容（从前一个组件的后续场景开始）
  const scenes = [
    {
      id: 'scene-dialogue-3',
      text: '"你之前来过这里吗？"技术员问，试图打破沉默。',
      background: 'fjord-road',
      audio: 'ambience-car-interior',
      duration: 5000,
      character: 'hamar',
      interactive: false
    },
    {
      id: 'scene-dialogue-4',
      text: '"没有。"Røkke简短地回答。他的目光扫过窗外陡峭的山壁，在苍白的极昼光线下如同巨大的影子。',
      background: 'fjord-road',
      audio: 'ambience-car-interior',
      duration: 8000,
      character: 'rokke',
      interactive: false
    },
    {
      id: 'scene-arrival',
      text: '汽车转过最后一个弯道，前方视野突然开阔。在峡湾尽头的平地上，应该是Fjeld国际研究中心的位置，但Røkke立刻注意到不对劲的地方：警戒线外围停着至少二十辆车，包括军用卡车、医疗车和几辆标有国家安全局标志的黑色SUV。\n\n但最令人不安的是——没有研究中心。',
      background: 'research-center-area',
      audio: 'ambience-distant-sirens',
      duration: 15000,
      interactive: false
    },
    {
      id: 'scene-stopping',
      text: 'Røkke踩下刹车，汽车在距离警戒线还有百米的地方停下。他慢慢走下车，感觉胸口有种不舒服的压迫感。',
      background: 'research-center-area',
      audio: 'ambience-distant-sirens',
      duration: 8000,
      character: 'rokke',
      interactive: false
    },
    {
      id: 'scene-dialogue-5',
      text: '"这里有个研究站，对吧？"他问技术员，声音比他想象的要紧绷。',
      background: 'research-center-area',
      audio: 'ambience-distant-sirens',
      duration: 7000,
      character: 'rokke',
      interactive: false
    },
    {
      id: 'scene-dialogue-6',
      text: '技术员同样震惊地站在原地，点点头："四层建筑，占地约六千平方米，地下实验层还有两层。应该就在那里。"他指向空荡荡的地面。',
      background: 'research-center-area',
      audio: 'ambience-distant-sirens',
      duration: 10000,
      character: 'hamar',
      interactive: false
    },
    {
      id: 'scene-nothing',
      text: '但那里什么都没有。\n\n或者说，有些东西，但绝对不是建筑。',
      background: 'research-center-area',
      audio: 'ambience-distant-sirens',
      duration: 8000,
      interactive: true,
      interactionText: '[ 点击继续靠近 ]',
      interactionEffect: 'approach'
    },
    {
      id: 'scene-void-reveal',
      text: 'Røkke向前走去，出示警官证通过了第一道警戒线。随着距离缩短，他终于看清了令所有人震惊的景象：地面上有一个巨大的、几何学上完美的球形凹陷，直径约四十米，边缘平滑得不可思议，仿佛被某种超精密仪器切割出来的。',
      background: 'perfect-void',
      audio: 'ambience-void-hum',
      duration: 12000,
      interactive: false
    },
    {
      id: 'scene-dialogue-7',
      text: '"天哪，"技术员轻声说，"那是个......坑？"',
      background: 'perfect-void',
      audio: 'ambience-void-hum',
      duration: 5000,
      character: 'hamar',
      interactive: false
    },
    {
      id: 'scene-dialogue-8',
      text: '"不是坑，"另一个声音从旁边传来。一名穿着白色防护服的女子转过身，摘下护目镜："是一个完美的球体。"她伸手指向凹陷的内部，"不只是地表，整个地下结构也是如此。上面切掉了约20米的建筑，下面切掉了约20米的地面和地下设施。形成了一个几乎完美的球形空洞。"',
      background: 'perfect-void',
      audio: 'ambience-void-hum',
      duration: 15000,
      character: 'scientist',
      interactive: false
    }
  ];

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

  // 处理交互
  const handleInteraction = (effect) => {
    setUserInteracted(true);
    setShowEffect(true);
    
    // 播放交互音效
    if (effectSoundRef.current) {
      effectSoundRef.current.play().catch(e => console.log('Audio play failed:', e));
    }
    
    setTimeout(() => {
      setShowEffect(false);
      setUserInteracted(false);
      setCurrentScene(prev => prev + 1);
    }, 2000);
  };

  // 处理文本高亮
  const handleTextHover = (text) => {
    setHighlightedText(text);
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

  // 渲染特效
  const renderEffect = () => {
    if (!showEffect) return null;
    
    return (
      <motion.div
        className={`effect ${scenes[currentScene].interactionEffect}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      />
    );
  };

  // 接近效果的粒子系统
  const ApproachEffect = () => {
    const canvasRef = useRef(null);
    
    useEffect(() => {
      if (!showEffect || !canvasRef.current) return;
      
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      let animationFrameId;
      
      // 设置画布尺寸
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // 创建粒子
      let particles = [];
      const particleCount = 150;
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 1,
          speedX: (Math.random() - 0.5) * 5,
          speedY: (Math.random() - 0.5) * 5,
          color: `rgba(0, ${Math.floor(Math.random() * 200) + 55}, ${Math.floor(Math.random() * 155) + 100}, ${Math.random() * 0.5 + 0.3})`
        });
      }
      
      // 更新粒子
      const updateParticles = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
          // 绘制粒子
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = particle.color;
          ctx.fill();
          
          // 更新位置
          particle.x += particle.speedX;
          particle.y += particle.speedY;
          
          // 边界检查
          if (particle.x < 0 || particle.x > canvas.width) {
            particle.speedX *= -1;
          }
          
          if (particle.y < 0 || particle.y > canvas.height) {
            particle.speedY *= -1;
          }
        });
        
        animationFrameId = requestAnimationFrame(updateParticles);
      };
      
      updateParticles();
      
      return () => {
        cancelAnimationFrame(animationFrameId);
      };
    }, [showEffect]);
    
    return <canvas ref={canvasRef} className="approach-effect-canvas" />;
  };

  return (
    <div className="perfect-void-scenes-container">
      <div className="audio-container">
        <audio ref={ambienceRef} loop>
          <source src={`/assets/audio/${scenes[currentScene]?.audio}.mp3`} type="audio/mpeg" />
        </audio>
        <audio ref={effectSoundRef}>
          <source src="/assets/audio/effect-approach.mp3" type="audio/mpeg" />
        </audio>
      </div>
      
      <AnimatePresence mode="wait">
        {renderScene()}
      </AnimatePresence>
      
      {scenes[currentScene]?.interactionEffect === 'approach' && <ApproachEffect />}
      {renderEffect()}
      
      <div className="overlay"></div>
      <div className="scanline"></div>
      <div className="noise"></div>
    </div>
  );
};

// 添加必要的样式
const styles = `
  .perfect-void-scenes-container {
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
  
  .character-marker.hamar {
    background-color: var(--neon-blue);
    box-shadow: 0 0 10px rgba(0, 136, 255, 0.5);
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
  
  .approach-effect-canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 6;
    pointer-events: none;
  }
  
  .effect {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
    pointer-events: none;
  }
  
  .effect.approach {
    background: radial-gradient(circle at center, transparent, rgba(0, 255, 157, 0.2), transparent);
    animation: pulse-approach 2s ease-in-out;
  }
  
  /* Scene backgrounds */
  .fjord-road {
    background-image: linear-gradient(rgba(10, 10, 18, 0.7), rgba(10, 10, 18, 0.7)), url('/assets/images/fjord-road.jpg');
    background-size: cover;
    background-position: center;
  }
  
  .research-center-area {
    background-image: linear-gradient(rgba(10, 10, 18, 0.7), rgba(10, 10, 18, 0.7)), url('/assets/images/research-area.jpg');
    background-size: cover;
    background-position: center;
  }
  
  .perfect-void {
    background-image: linear-gradient(rgba(10, 10, 18, 0.7), rgba(10, 10, 18, 0.7)), url('/assets/images/perfect-void.jpg');
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
  
  @keyframes pulse-approach {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
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
  }
`;

export default () => (
  <>
    <style>{styles}</style>
    <PerfectVoidScenes />
  </>
);
