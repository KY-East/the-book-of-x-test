import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// 主组件
const PerfectVoid = ({ onComplete }) => {
  // 状态管理
  const [currentScene, setCurrentScene] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [showIntroduction, setShowIntroduction] = useState(true);
  const [readingPosition, setReadingPosition] = useState(0);

  // 音频引用
  const ambienceRef = useRef(null);
  const narratorRef = useRef(null);
  
  // 场景内容
  const scenes = [
    {
      id: 'scene-intro',
      text: '挪威西部峡湾，凌晨3点14分。',
      background: 'fjord-dawn',
      audio: 'ambience-fjord-night',
      narration: 'narrator-intro',
      duration: 5000
    },
    {
      id: 'scene-horizon',
      text: '地平线总保有一丝微光，如同银色的轮廓线勾勒着远方的山脉。4月的挪威夜晚已经缩短，天空呈现一种不自然的深蓝——既非完全的黑暗，也非白昼的明亮，而是某种介于两者之间的状态。',
      background: 'fjord-horizon',
      audio: 'ambience-fjord-night',
      narration: 'narrator-horizon',
      duration: 12000
    },
    {
      id: 'scene-driving',
      text: 'Knut Røkke沿着峡湾边缘的碎石路驾驶，轮胎碾过积雪留下的融水。他的警车仪表盘显示气温-2℃，异常的寒冷，即使在挪威的初夏。峡湾水面平静如镜，反射着四周陡峭的山壁，唯有偶尔飘过的薄雾打破这完美对称。',
      background: 'fjord-road',
      audio: 'ambience-car-driving',
      narration: 'narrator-driving',
      duration: 15000
    },
    {
      id: 'scene-dialogue-1',
      text: '"距离目标还有两公里，"副驾驶座上的Hamar技术员说，眼睛盯着GPS屏幕。他年轻，戴着标准发的灰色耳机，从上车起就没摘下过。',
      background: 'fjord-road',
      audio: 'ambience-car-interior',
      narration: 'narrator-dialogue-1',
      duration: 8000,
      character: 'hamar'
    },
    {
      id: 'scene-dialogue-2',
      text: 'Røkke只是点头。他不是话多的人，尤其是在这种半夜被从床上叫起来的任务中。作为Bergen地区资深刑事调查员，他习惯了半夜的紧急电话，但很少来这么远的地方。Veifjord是挪威最深、最窄的峡湾之一，几乎与世隔绝，除了一条蜿蜒的山路和水路，没有其他通行方式。',
      background: 'fjord-road',
      audio: 'ambience-car-interior',
      narration: 'narrator-dialogue-2',
      duration: 15000,
      character: 'rokke'
    },
    // 更多场景将在下一个组件中继续...
  ];

  // 加载完成后的效果
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
      setShowIntroduction(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  // 音频控制
  useEffect(() => {
    if (audioEnabled && ambienceRef.current) {
      ambienceRef.current.volume = 0.3;
      ambienceRef.current.play().catch(e => console.log('Audio play failed:', e));
    }
    
    return () => {
      if (ambienceRef.current) {
        ambienceRef.current.pause();
      }
    };
  }, [audioEnabled, currentScene]);

  // 场景切换逻辑
  useEffect(() => {
    if (!loaded || showIntroduction) return;
    
    const sceneTimer = setTimeout(() => {
      if (currentScene < scenes.length - 1) {
        setCurrentScene(prev => prev + 1);
      } else if (typeof onComplete === 'function') {
        // 当所有场景都已展示，通知完成
        onComplete();
      }
    }, scenes[currentScene].duration);
    
    return () => clearTimeout(sceneTimer);
  }, [currentScene, loaded, showIntroduction, scenes.length, onComplete]);

  // 处理音频开启
  const handleEnableAudio = () => {
    setAudioEnabled(true);
    setShowIntroduction(false);
  };

  // 处理阅读进度
  const handleScroll = (e) => {
    const scrollPosition = e.target.scrollTop;
    const scrollHeight = e.target.scrollHeight - e.target.clientHeight;
    const position = scrollPosition / scrollHeight;
    setReadingPosition(position);
  };

  // 渲染进度指示器
  const renderProgressIndicator = () => {
    return (
      <div className="progress-container">
        <div 
          className="progress-bar"
          style={{ height: `${readingPosition * 100}%` }}
        />
      </div>
    );
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
              {scene.character === 'rokke' ? 'Røkke' : 'Hamar'}
            </div>
          )}
          <p className="scene-text">{scene.text}</p>
        </div>
      </motion.div>
    );
  };

  // 渲染引导介绍
  const renderIntroduction = () => {
    return (
      <motion.div 
        className="introduction"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="intro-title">完美的空洞</h1>
        <p className="intro-subtitle">风暴之喉 - 第一章</p>
        <p className="intro-description">
          一个深夜的紧急任务，一个与世隔绝的峡湾，一个刑事调查员即将面对的谜团...
        </p>
        <button 
          className="start-button"
          onClick={handleEnableAudio}
        >
          开启旅程
          <span className="button-glow"></span>
        </button>
        <p className="intro-hint">推荐佩戴耳机以获得最佳体验</p>
      </motion.div>
    );
  };

  // 粒子效果背景
  const ParticleBackground = () => {
    const canvasRef = useRef(null);
    
    useEffect(() => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      let animationFrameId;
      let particles = [];
      
      // 设置画布尺寸
      const setCanvasSize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };
      
      // 创建粒子
      const createParticles = () => {
        particles = [];
        const particleCount = Math.floor(canvas.width * canvas.height / 10000);
        
        for (let i = 0; i < particleCount; i++) {
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 1.5 + 0.5,
            color: `rgba(0, 255, 157, ${Math.random() * 0.5 + 0.2})`,
            velocity: {
              x: Math.random() * 0.5 - 0.25,
              y: Math.random() * 0.5 - 0.25
            }
          });
        }
      };
      
      // 动画循环
      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
          ctx.fillStyle = particle.color;
          ctx.fill();
          
          // 更新位置
          particle.x += particle.velocity.x;
          particle.y += particle.velocity.y;
          
          // 边界检查
          if (particle.x < 0 || particle.x > canvas.width) particle.velocity.x *= -1;
          if (particle.y < 0 || particle.y > canvas.height) particle.velocity.y *= -1;
        });
        
        animationFrameId = requestAnimationFrame(animate);
      };
      
      // 初始化
      setCanvasSize();
      createParticles();
      animate();
      
      // 窗口大小变化时重新设置
      window.addEventListener('resize', () => {
        setCanvasSize();
        createParticles();
      });
      
      return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('resize', setCanvasSize);
      };
    }, []);
    
    return <canvas ref={canvasRef} className="particle-canvas" />;
  };

  return (
    <div className="perfect-void-container" onScroll={handleScroll}>
      <ParticleBackground />
      
      {renderProgressIndicator()}
      
      <div className="audio-container">
        <audio ref={ambienceRef} loop>
          <source src={`/assets/audio/${scenes[currentScene]?.audio}.mp3`} type="audio/mpeg" />
        </audio>
        <audio ref={narratorRef}>
          <source src={`/assets/audio/${scenes[currentScene]?.narration}.mp3`} type="audio/mpeg" />
        </audio>
      </div>
      
      <AnimatePresence mode="wait">
        {showIntroduction ? (
          renderIntroduction()
        ) : (
          renderScene()
        )}
      </AnimatePresence>
      
      <div className="overlay"></div>
      <div className="scanline"></div>
      <div className="noise"></div>
    </div>
  );
};

// 添加必要的样式
const styles = `
  .perfect-void-container {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    background-color: #0a0a12;
    color: #e0e0e0;
    font-family: 'Rajdhani', 'Noto Sans SC', sans-serif;
  }
  
  .particle-canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
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
  
  .progress-container {
    position: fixed;
    top: 0;
    right: 0;
    width: 4px;
    height: 100vh;
    background-color: rgba(255, 255, 255, 0.1);
    z-index: 10;
  }
  
  .progress-bar {
    width: 100%;
    background-color: rgba(0, 255, 157, 0.7);
    box-shadow: 0 0 10px rgba(0, 255, 157, 0.5);
    transition: height 0.3s ease;
  }
  
  .introduction {
    position: relative;
    z-index: 5;
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    text-align: center;
  }
  
  .intro-title {
    font-family: 'Orbitron', 'ZCOOL QingKe HuangYou', sans-serif;
    font-size: 3rem;
    font-weight: 700;
    color: var(--neon-primary);
    text-shadow: 0 0 15px rgba(0, 255, 157, 0.7);
    margin-bottom: 20px;
    animation: pulse 4s infinite;
  }
  
  .intro-subtitle {
    font-family: 'ZCOOL XiaoWei', serif;
    font-size: 1.5rem;
    color: var(--neon-secondary);
    margin-bottom: 40px;
  }
  
  .intro-description {
    font-size: 1.2rem;
    line-height: 1.6;
    margin-bottom: 40px;
    color: rgba(255, 255, 255, 0.8);
  }
  
  .start-button {
    position: relative;
    font-family: 'Orbitron', 'ZCOOL QingKe HuangYou', sans-serif;
    background-color: transparent;
    color: var(--neon-primary);
    border: 2px solid var(--neon-primary);
    padding: 12px 30px;
    font-size: 1.2rem;
    text-transform: uppercase;
    letter-spacing: 2px;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-bottom: 30px;
    outline: none;
    overflow: hidden;
  }
  
  .start-button:hover {
    background-color: rgba(0, 255, 157, 0.1);
    box-shadow: 0 0 15px rgba(0, 255, 157, 0.5);
    transform: translateY(-2px);
  }
  
  .button-glow {
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(0, 255, 157, 0.3), transparent);
    animation: button-glow 2s infinite;
  }
  
  .intro-hint {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.6);
    font-style: italic;
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
  
  /* Scene backgrounds */
  .fjord-dawn {
    background-image: linear-gradient(rgba(10, 10, 18, 0.7), rgba(10, 10, 18, 0.7)), url('/assets/images/fjord-dawn.jpg');
    background-size: cover;
    background-position: center;
  }
  
  .fjord-horizon {
    background-image: linear-gradient(rgba(10, 10, 18, 0.7), rgba(10, 10, 18, 0.7)), url('/assets/images/fjord-horizon.jpg');
    background-size: cover;
    background-position: center;
  }
  
  .fjord-road {
    background-image: linear-gradient(rgba(10, 10, 18, 0.7), rgba(10, 10, 18, 0.7)), url('/assets/images/fjord-road.jpg');
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
    0%, 100% {
      opacity: 1;
      text-shadow: 0 0 15px rgba(0, 255, 157, 0.7);
    }
    50% {
      opacity: 0.8;
      text-shadow: 0 0 25px rgba(0, 255, 157, 0.9);
    }
  }
  
  @keyframes button-glow {
    0% {
      left: -100%;
    }
    100% {
      left: 100%;
    }
  }
  
  /* Media queries */
  @media (max-width: 768px) {
    .intro-title {
      font-size: 2.2rem;
    }
    
    .intro-subtitle {
      font-size: 1.2rem;
    }
    
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
    <PerfectVoid />
    </>
  );