import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// 球形空洞探索组件
const PerfectVoidExploration = () => {
  // 状态管理
  const [currentScene, setCurrentScene] = useState(0);
  const [hoveredDetail, setHoveredDetail] = useState(null);
  const [voidPulse, setVoidPulse] = useState(false);
  const [interactionCount, setInteractionCount] = useState(0);
  const [cameraMode, setCameraMode] = useState(false);
  const [photoTaken, setPhotoTaken] = useState(false);
  
  // 引用
  const containerRef = useRef(null);
  const voidSoundRef = useRef(null);
  const cameraSoundRef = useRef(null);
  
  // 场景内容继续
  const scenes = [
    {
      id: 'scene-approach-void',
      text: 'Røkke向前走到凹陷边缘。弯下腰，他看着那光滑得不自然的边缘。没有融化痕迹，没有压缩变形，没有任何能量释放的迹象。就好像有人用世界上最锋利的刀，从现实中精确地切除了一个球体，留下这个......空洞。',
      background: 'void-edge',
      audio: 'void-ambience',
      character: 'rokke',
      interactive: true,
      interactiveType: 'void-details'
    },
    {
      id: 'scene-dialogue-9',
      text: '"什么能做到这种事？"他低声问，更像是自言自语。',
      background: 'void-edge',
      audio: 'void-ambience',
      character: 'rokke',
      interactive: false
    },
    {
      id: 'scene-dialogue-10',
      text: '"从物理学上讲，什么都不能，"白衣女子说，"我是Solveig Hansen，国家地质勘测局。我们已经用三种不同的设备扫描了这个空洞。没有辐射，没有化学残留，没有热能痕迹。温度与周围环境完全一致，就像它一直存在于此。"',
      background: 'void-edge',
      audio: 'void-ambience',
      character: 'scientist',
      interactive: false
    },
    {
      id: 'scene-dialogue-11',
      text: '"伤亡人数？"Røkke恢复了职业本能，拿出记事本。',
      background: 'void-edge',
      audio: 'void-ambience',
      character: 'rokke',
      interactive: false
    },
    {
      id: 'scene-dialogue-12',
      text: '"根据初步名单，87人。研究人员、技术员、维护人员。夜班有36人在岗，另有一些人员住在站内宿舍。"',
      background: 'void-edge',
      audio: 'void-ambience',
      character: 'scientist',
      interactive: false
    },
    {
      id: 'scene-dialogue-13',
      text: 'Røkke的笔尖在纸上顿了一下。"名单，"他说，"我需要完整名单。"',
      background: 'void-edge',
      audio: 'void-ambience',
      character: 'rokke',
      interactive: true,
      interactiveType: 'camera-mode'
    },
    {
      id: 'scene-photo-interface',
      text: 'Hansen看了他一眼："国家安全局正在处理这个。他们十分钟前刚到。"',
      background: 'void-edge',
      audio: 'void-ambience',
      character: 'scientist',
      interactive: true,
      interactiveType: 'photo-mode'
    },
    {
      id: 'scene-dialogue-14',
      text: 'Røkke点点头，继续走向空洞边缘。他俯身观察那完美光滑的切面——混凝土、钢筋、电缆、管道，所有建筑材料都被整齐地切断，表面光滑如镜。没有熔化，没有粉碎，没有任何他见过的爆炸或坍塌迹象。',
      background: 'void-close-edge',
      audio: 'void-ambience',
      character: 'rokke',
      interactive: false
    }
  ];
  
  // 空洞详情数据
  const voidDetails = [
    {
      id: 'detail-edge',
      position: { top: '45%', left: '30%' },
      title: '切面边缘',
      description: '完美光滑的边缘，没有任何熔化、压缩或撕裂的痕迹。就像被某种无限锋利的工具精确切割一样。'
    },
    {
      id: 'detail-material',
      position: { top: '60%', left: '40%' },
      title: '材料截面',
      description: '可以看到地面和地下设施的截面，包括混凝土、钢筋、管道和电缆，全部被整齐地切断，表面平滑如镜。'
    },
    {
      id: 'detail-geometry',
      position: { top: '30%', left: '60%' },
      title: '完美球形',
      description: '凹陷呈现精确的球形，半径约为20米，从表面到底部的曲率完全一致，精度超出常规工程可能。'
    },
    {
      id: 'detail-atmosphere',
      position: { top: '50%', left: '70%' },
      title: '异常大气现象',
      description: '空洞上方的空气有微妙的扭曲，类似于热浪效应，但温度测量显示与周围环境一致。'
    }
  ];

  // 空洞脉动效果
  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setVoidPulse(true);
      setTimeout(() => setVoidPulse(false), 1000);
    }, 8000);
    
    return () => clearInterval(pulseInterval);
  }, []);
  
  // 场景切换逻辑
  useEffect(() => {
    if (!scenes[currentScene].interactive || 
        (scenes[currentScene].interactiveType === 'void-details' && interactionCount >= 2) ||
        (scenes[currentScene].interactiveType === 'camera-mode' && cameraMode) ||
        (scenes[currentScene].interactiveType === 'photo-mode' && photoTaken)) {
      
      const nextSceneTimer = setTimeout(() => {
        if (currentScene < scenes.length - 1) {
          setCurrentScene(prev => prev + 1);
        }
      }, 6000);
      
      return () => clearTimeout(nextSceneTimer);
    }
  }, [currentScene, interactionCount, cameraMode, photoTaken]);
  
  // 音频效果
  useEffect(() => {
    if (voidSoundRef.current) {
      voidSoundRef.current.volume = 0.3;
      voidSoundRef.current.play().catch(e => console.log('Audio play failed:', e));
    }
    
    return () => {
      if (voidSoundRef.current) {
        voidSoundRef.current.pause();
      }
    };
  }, []);
  
  // 处理详情交互
  const handleDetailInteraction = (detailId) => {
    if (scenes[currentScene].interactiveType === 'void-details') {
      setInteractionCount(prev => prev + 1);
      
      // 播放探索音效
      if (voidSoundRef.current) {
        voidSoundRef.current.volume = 0.6;
        setTimeout(() => {
          if (voidSoundRef.current) voidSoundRef.current.volume = 0.3;
        }, 1000);
      }
    }
  };
  
  // 处理相机模式切换
  const handleCameraMode = () => {
    setCameraMode(true);
    
    // 播放相机切换音效
    if (cameraSoundRef.current) {
      cameraSoundRef.current.currentTime = 0;
      cameraSoundRef.current.play().catch(e => console.log('Audio play failed:', e));
    }
  };
  
  // 处理拍照
  const handleTakePhoto = () => {
    setPhotoTaken(true);
    
    // 播放快门音效
    if (cameraSoundRef.current) {
      cameraSoundRef.current.currentTime = 0;
      cameraSoundRef.current.play().catch(e => console.log('Audio play failed:', e));
    }
    
    // 闪光效果
    const flashElement = document.createElement('div');
    flashElement.className = 'camera-flash';
    containerRef.current.appendChild(flashElement);
    
    setTimeout(() => {
      containerRef.current.removeChild(flashElement);
    }, 500);
  };
  
  // 渲染正常场景内容
  const renderNormalScene = () => {
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
               scene.character === 'scientist' ? 'Hansen' : scene.character}
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
          
          {scene.interactiveType === 'camera-mode' && !cameraMode && (
            <motion.button
              className="interaction-button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              onClick={handleCameraMode}
            >
              [开启相机模式]
            </motion.button>
          )}
        </div>
        
        {scene.interactiveType === 'void-details' && (
          <div className="interactive-details-container">
            {voidDetails.map(detail => (
              <motion.div
                key={detail.id}
                className="detail-marker"
                style={{ 
                  top: detail.position.top, 
                  left: detail.position.left 
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: 1, 
                  scale: hoveredDetail === detail.id ? 1.2 : 1 
                }}
                transition={{ delay: Math.random(), duration: 0.5 }}
                onMouseEnter={() => setHoveredDetail(detail.id)}
                onMouseLeave={() => setHoveredDetail(null)}
                onClick={() => handleDetailInteraction(detail.id)}
              >
                <div className="detail-pulse"></div>
                {hoveredDetail === detail.id && (
                  <motion.div 
                    className="detail-info"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3>{detail.title}</h3>
                    <p>{detail.description}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    );
  };
  
  // 渲染相机模式
  const renderCameraMode = () => {
    return (
      <motion.div 
        className="camera-interface"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="camera-viewfinder">
          <div className="camera-frame"></div>
          <div className="camera-crosshair"></div>
          <div className="camera-info">
            <span>ISO 800</span>
            <span>F/2.8</span>
            <span>1/60s</span>
          </div>
          <div className="camera-focus-points">
            <div className="focus-point top-left"></div>
            <div className="focus-point top-right"></div>
            <div className="focus-point bottom-left"></div>
            <div className="focus-point bottom-right"></div>
            <div className="focus-point center active"></div>
          </div>
        </div>
        
        <div className="camera-controls">
          {!photoTaken ? (
            <button className="shutter-button" onClick={handleTakePhoto}>
              <div className="shutter-inner"></div>
            </button>
          ) : (
            <div className="processing-indicator">处理中...</div>
          )}
        </div>
        
        <div className="camera-overlay"></div>
      </motion.div>
    );
  };
  
  // 渲染空洞脉动效果
  const renderVoidPulseEffect = () => {
    if (!voidPulse) return null;
    
    return (
      <motion.div
        className="void-pulse"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: [0, 0.3, 0], scale: [0.8, 1.2, 1.5] }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />
    );
  };
  
  // 空洞粒子效果
  const VoidParticles = () => {
    const canvasRef = useRef(null);
    
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
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
        const particleCount = 100;
        
        for (let i = 0; i < particleCount; i++) {
          const angle = Math.random() * Math.PI * 2;
          const radius = 100 + Math.random() * 100;
          const x = canvas.width / 2 + Math.cos(angle) * radius;
          const y = canvas.height / 2 + Math.sin(angle) * radius;
          
          particles.push({
            x,
            y,
            size: Math.random() * 2 + 1,
            speedX: Math.cos(angle) * (Math.random() * 0.5 + 0.1),
            speedY: Math.sin(angle) * (Math.random() * 0.5 + 0.1),
            color: `rgba(0, 255, 157, ${Math.random() * 0.5 + 0.3})`,
            life: Math.random() * 100 + 50
          });
        }
      };
      
      // 更新粒子
      const updateParticles = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 绘制中心光晕
        const gradient = ctx.createRadialGradient(
          canvas.width / 2, canvas.height / 2, 0,
          canvas.width / 2, canvas.height / 2, 150
        );
        gradient.addColorStop(0, 'rgba(0, 255, 157, 0.2)');
        gradient.addColorStop(1, 'rgba(0, 255, 157, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, 150, 0, Math.PI * 2);
        ctx.fill();
        
        // 更新并绘制粒子
        particles.forEach((particle, index) => {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = particle.color;
          ctx.fill();
          
          // 向中心移动
          particle.x -= particle.speedX;
          particle.y -= particle.speedY;
          
          // 减少生命值
          particle.life--;
          
          // 如果生命值耗尽，重新创建粒子
          if (particle.life <= 0) {
            const angle = Math.random() * Math.PI * 2;
            const radius = 150 + Math.random() * 50;
            particle.x = canvas.width / 2 + Math.cos(angle) * radius;
            particle.y = canvas.height / 2 + Math.sin(angle) * radius;
            particle.speedX = Math.cos(angle) * (Math.random() * 0.5 + 0.1);
            particle.speedY = Math.sin(angle) * (Math.random() * 0.5 + 0.1);
            particle.life = Math.random() * 100 + 50;
          }
        });
        
        animationFrameId = requestAnimationFrame(updateParticles);
      };
      
      // 初始化
      setCanvasSize();
      createParticles();
      updateParticles();
      
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
    
    return <canvas ref={canvasRef} className="void-particles-canvas" />;
  };
  
  return (
    <div className="perfect-void-exploration" ref={containerRef}>
      <div className="audio-container">
        <audio ref={voidSoundRef} loop>
          <source src="/assets/audio/void-ambience.mp3" type="audio/mpeg" />
        </audio>
        <audio ref={cameraSoundRef}>
          <source src="/assets/audio/camera-shutter.mp3" type="audio/mpeg" />
        </audio>
      </div>
      
      <VoidParticles />
      {renderVoidPulseEffect()}
      
      <AnimatePresence mode="wait">
        {cameraMode ? renderCameraMode() : renderNormalScene()}
      </AnimatePresence>
      
      <div className="overlay"></div>
      <div className="scanline"></div>
      <div className="noise"></div>
    </div>
  );
};

// 添加必要的样式
const styles = `
  .perfect-void-exploration {
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
  
  .void-particles-canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    pointer-events: none;
  }
  
  .void-pulse {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0, 255, 157, 0.3) 0%, rgba(0, 255, 157, 0) 70%);
    z-index: 5;
    pointer-events: none;
  }
  
  .interactive-details-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 6;
  }
  
  .detail-marker {
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: rgba(0, 255, 157, 0.7);
    box-shadow: 0 0 10px rgba(0, 255, 157, 0.5);
    cursor: pointer;
    pointer-events: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 7;
  }
  
  .detail-marker::before {
    content: '+';
    color: #000;
    font-weight: bold;
  }
  
  .detail-pulse {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: rgba(0, 255, 157, 0.5);
    animation: detail-pulse 2s infinite;
  }
  
  .detail-info {
    position: absolute;
    width: 250px;
    background-color: rgba(0, 10, 20, 0.9);
    border: 1px solid var(--neon-primary);
    padding: 15px;
    border-radius: 5px;
    z-index: 8;
    top: -120px;
    left: 25px;
    pointer-events: none;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
  }
  
  .detail-info h3 {
    color: var(--neon-primary);
    margin-top: 0;
    margin-bottom: 10px;
    font-size: 1rem;
  }
  
  .detail-info p {
    margin: 0;
    font-size: 0.9rem;
    line-height: 1.5;
  }
  
  /* 相机模式样式 */
  .camera-interface {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
    background-color: rgba(0, 0, 0, 0.8);
  }
  
  .camera-viewfinder {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    height: 60%;
    border: 2px solid rgba(255, 255, 255, 0.3);
    overflow: hidden;
  }
  
  .camera-frame {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 1px solid rgba(255, 255, 255, 0.5);
    box-sizing: border-box;
  }
  
  .camera-crosshair {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 30px;
    height: 30px;
    transform: translate(-50%, -50%);
    border: 1px solid rgba(255, 255, 255, 0.7);
    border-radius: 50%;
  }
  
  .camera-crosshair::before,
  .camera-crosshair::after {
    content: '';
    position: absolute;
    background-color: rgba(255, 255, 255, 0.7);
  }
  
  .camera-crosshair::before {
    top: 50%;
    left: -5px;
    right: -5px;
    height: 1px;
    transform: translateY(-50%);
  }
  
  .camera-crosshair::after {
    left: 50%;
    top: -5px;
    bottom: -5px;
    width: 1px;
    transform: translateX(-50%);
  }
  
  .camera-info {
    position: absolute;
    bottom: 10px;
    right: 10px;
    color: rgba(255, 255, 255, 0.7);
    font-family: 'Fira Code', monospace;
    font-size: 0.8rem;
  }
  
  .camera-info span {
    margin-left: 15px;
  }
  
  .camera-focus-points {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  
  .focus-point {
    position: absolute;
    width: 15px;
    height: 15px;
    border: 1px solid rgba(255, 255, 255, 0.5);
  }
  
  .focus-point.top-left {
    top: 20px;
    left: 20px;
  }
  
  .focus-point.top-right {
    top: 20px;
    right: 20px;
  }
  
  .focus-point.bottom-left {
    bottom: 20px;
    left: 20px;
  }
  
  .focus-point.bottom-right {
    bottom: 20px;
    right: 20px;
  }
  
  .focus-point.center {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  
  .focus-point.active {
    border-color: var(--neon-primary);
    background-color: rgba(0, 255, 157, 0.3);
  }
  
  .camera-controls {
    position: absolute;
    bottom: 30px;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .shutter-button {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.2);
    border: 2px solid rgba(255, 255, 255, 0.5);
    padding: 0;
    cursor: pointer;
    position: relative;
    transition: all 0.3s ease;
  }
  
  .shutter-button:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
  
  .shutter-inner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: white;
  }
  
  .camera-flash {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: white;
    z-index: 100;
    opacity: 0;
    animation: camera-flash 0.5s ease-out;
  }
  
  .processing-indicator {
    color: white;
    font-family: 'Fira Code', monospace;
    animation: blink 1s infinite;
  }
  
  .camera-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at center, transparent 40%, rgba(0, 0, 0, 0.8) 100%);
    pointer-events: none;
  }
  
  /* Scene backgrounds */
  .void-edge {
    background-image: linear-gradient(rgba(10, 10, 18, 0.7), rgba(10, 10, 18, 0.7)), url('/assets/images/void-edge.jpg');
    background-size: cover;
    background-position: center;
  }
  
  .void-close-edge {
    background-image: linear-gradient(rgba(10, 10, 18, 0.7), rgba(10, 10, 18, 0.7)), url('/assets/images/void-close-edge.jpg');
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
  
  @keyframes detail-pulse {
    0% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 0.5;
    }
    100% {
      transform: translate(-50%, -50%) scale(1.5);
      opacity: 0;
    }
  }
  
  @keyframes camera-flash {
    0% {
      opacity: 0;
    }
    20% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
  
  @keyframes blink {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
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
    
    .detail-info {
      width: 200px;
    }
    
    .camera-viewfinder {
      width: 90%;
      height: 50%;
    }
  }
