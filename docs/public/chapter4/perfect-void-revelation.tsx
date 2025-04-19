import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// 重大发现组件
const PerfectVoidRevelation = () => {
  // 状态管理
  const [currentScene, setCurrentScene] = useState(0);
  const [nameListRevealed, setNameListRevealed] = useState(false);
  const [nameHighlighted, setNameHighlighted] = useState(false);
  const [showDataTerminal, setShowDataTerminal] = useState(false);
  const [terminalProgress, setTerminalProgress] = useState(0);
  const [terminalText, setTerminalText] = useState('');
  
  // 引用
  const audioRef = useRef(null);
  const revelationSoundRef = useRef(null);
  const heartbeatSoundRef = useRef(null);
  
  // 终端文本引用
  const terminalTextRef = useRef([
    '> 正在连接安全数据库...',
    '> 建立连接...',
    '> 获取访问权限...',
    '> 正在下载失踪人员名单...',
    '> 文件已下载: missing_personnel.dat',
    '> 正在解析数据...',
    '> 解析完成',
    '> 显示结果:'
  ]);
  
  // 继续场景内容
  const scenes = [
    {
      id: 'scene-request-entry',
      text: '"我能进去看看吗？"他问。',
      background: 'void-edge',
      audio: 'void-ambience',
      character: 'rokke',
      interactive: false,
      duration: 4000
    },
    {
      id: 'scene-official-denial',
      text: '"不行，"一个冷硬的声音从后方传来。一名穿黑色制服的男子大步走来，领口别着国家安全局的徽章。"这里已经由国家接管。非授权人员需要立即撤离。"',
      background: 'void-edge',
      audio: 'void-ambience',
      character: 'official',
      interactive: false,
      duration: 8000
    },
    {
      id: 'scene-rokke-response',
      text: 'Røkke展示了他的警官证："Bergen刑事调查科，我奉命调查这起事件。"',
      background: 'void-edge',
      audio: 'void-ambience',
      character: 'rokke',
      interactive: false,
      duration: 5000
    },
    {
      id: 'scene-dismissal',
      text: '"不再是你们的管辖范围了，"黑衣男子干脆地说。"这已被定性为国家级研究事故，由国家科学安全委员会接手。"',
      background: 'void-edge',
      audio: 'void-ambience',
      character: 'official',
      interactive: false,
      duration: 7000
    },
    {
      id: 'scene-namelist-request',
      text: 'Røkke没有争辩，只是把证件收回口袋，目光仍然停留在那个不可思议的球形空洞上。作为警察，他见过各种各样的死亡现场——爆炸、火灾、坍塌。但从未见过任何事情像这样......整洁。没有混乱，没有碎片，没有残骸。只有一个完美的、不该存在的几何形状，像是被从现实中抹去的一块。',
      background: 'void-edge',
      audio: 'void-ambience',
      character: 'rokke',
      interactive: true,
      interactionText: '要求获取死者名单'
    },
    {
      id: 'scene-list-dialogue',
      text: '"我需要名单，"他对黑衣男子说，声音很轻但很坚定。"死者名单。"',
      background: 'void-edge',
      audio: 'void-ambience',
      character: 'rokke',
      interactive: false,
      duration: 5000
    },
    {
      id: 'scene-official-response',
      text: '黑衣男子皱眉："现在说\'死者\'为时过早。技术上讲，我们没有任何尸体。官方口径是\'人员失踪\'，直到我们确定——"',
      background: 'void-edge',
      audio: 'void-ambience',
      character: 'official',
      interactive: false,
      duration: 6000
    },
    {
      id: 'scene-rokke-insists',
      text: '"我需要名单，"Røkke重复道，这次声音更硬。',
      background: 'void-edge',
      audio: 'void-ambience',
      character: 'rokke',
      interactive: false,
      duration: 4000
    },
    {
      id: 'scene-official-concedes',
      text: '黑衣男子似乎想拒绝，但看了看Røkke的眼睛后，微微点头："联络处会发给你。不过别抱太大希望。"',
      background: 'void-edge',
      audio: 'void-ambience',
      character: 'official',
      interactive: false,
      duration: 6000
    },
    {
      id: 'scene-evidence-collection',
      text: 'Røkke没再说话，拿出手机，开始拍摄现场照片。然后他打开录像功能，缓慢绕着空洞边缘行走，录下周围的环境——案发现场、风声、远处的海浪、偶尔的鸟鸣，还有工作人员的低语。这是他的习惯，记录现场的"指纹"，有时能捕捉到肉眼看不见的细节。',
      background: 'void-walking',
      audio: 'void-ambience-recording',
      interactive: false,
      duration: 8000
    },
    {
      id: 'scene-technician-meeting',
      text: '当他走到空洞的另一侧时，一名穿着防化服的现场技术检测人员走过来与Røkke打招呼。原来是多年前刑事调查科的下属。在短暂的寒暄后，突然悄悄递给他一份打印文件：\n\n"我知道你一定需要，这是第一批确认的人员名单，还在核对中。"',
      background: 'void-walking',
      audio: 'void-ambience',
      interactive: true,
      interactionText: '检查名单'
    }
  ];
  
  // 失踪人员名单
  const missingPersonnel = [
    { id: 1, name: "Ada Lindberg", age: 42, department: "高能物理", position: "部门主管" },
    { id: 2, name: "Erik Solheim", age: 36, department: "计算系统", position: "系统架构师" },
    { id: 3, name: "Frida Johansen", age: 29, department: "数据分析", position: "研究助理" },
    { id: 4, name: "Henrik Nilsen", age: 51, department: "设施安全", position: "安全主管" },
    { id: 5, name: "Ingrid Voll", age: 33, department: "生物物理", position: "研究员" },
    { id: 6, name: "Johan Berg", age: 45, department: "材料科学", position: "高级研究员" },
    { id: 7, name: "Karina Moe", age: 27, department: "行政", position: "协调员" },
    { id: 8, name: "Lars Haugen", age: 39, department: "量子计算", position: "程序员" },
    { id: 9, name: "Mette Dahl", age: 47, department: "气候监测", position: "数据科学家" },
    { id: 10, name: "Nils Strand", age: 31, department: "深海研究", position: "研究员" },
    { id: 11, name: "Oda Bakken", age: 38, department: "工程", position: "系统工程师" },
    { id: 12, name: "Petter Holm", age: 44, department: "声学实验室", position: "声学工程师" },
    { id: 13, name: "Rolf Røkke", age: 34, department: "声学实验室", position: "高级研究助理" },
    { id: 14, name: "Solveig Torp", age: 29, department: "通信", position: "网络专家" },
    { id: 15, name: "Thomas Lie", age: 53, department: "管理", position: "运营总监" }
  ];
  
  // 场景切换逻辑
  useEffect(() => {
    if (!scenes[currentScene].interactive) {
      const sceneTimer = setTimeout(() => {
        if (currentScene < scenes.length - 1) {
          setCurrentScene(currentScene + 1);
        }
      }, scenes[currentScene].duration);
      
      return () => clearTimeout(sceneTimer);
    }
  }, [currentScene]);
  
  // 终端进度更新
  useEffect(() => {
    if (showDataTerminal && terminalProgress < terminalTextRef.current.length) {
      const timer = setTimeout(() => {
        setTerminalText(prev => prev + '\n' + terminalTextRef.current[terminalProgress]);
        setTerminalProgress(prev => prev + 1);
        
        // 播放终端音效
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(e => console.log('Audio play failed:', e));
        }
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [showDataTerminal, terminalProgress]);
  
  // 处理名单检查
  const handleCheckNamelist = () => {
    setNameListRevealed(true);
    setShowDataTerminal(true);
    
    // 播放发现音效
    if (revelationSoundRef.current) {
      revelationSoundRef.current.play().catch(e => console.log('Audio play failed:', e));
    }
  };
  
  // 处理名字点击
  const handleNameClick = (name) => {
    if (name === "Rolf Røkke") {
      setNameHighlighted(true);
      
      // 播放心跳音效
      if (heartbeatSoundRef.current) {
        heartbeatSoundRef.current.volume = 0.3;
        heartbeatSoundRef.current.play().catch(e => console.log('Audio play failed:', e));
        
        // 增加音量
        const fadeIn = setInterval(() => {
          if (heartbeatSoundRef.current.volume < 0.8) {
            heartbeatSoundRef.current.volume += 0.1;
          } else {
            clearInterval(fadeIn);
          }
        }, 1000);
      }
    }
  };
  
  // 渲染常规场景
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
               scene.character === 'official' ? '安全官员' : 
               'Technician'}
            </div>
          )}
          
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
              onClick={scene.id === 'scene-technician-meeting' ? handleCheckNamelist : () => setCurrentScene(currentScene + 1)}
            >
              {scene.interactionText}
            </motion.button>
          )}
        </div>
      </motion.div>
    );
  };
  
  // 渲染名单终端
  const renderNamelistTerminal = () => {
    return (
      <motion.div 
        className="terminal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="terminal-window"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="terminal-header">
            <div className="terminal-title">失踪人员数据库</div>
            <div className="terminal-controls">
              <div className="terminal-button red"></div>
              <div className="terminal-button yellow"></div>
              <div className="terminal-button green"></div>
            </div>
          </div>
          
          <div className="terminal-body">
            <pre className="terminal-text">{terminalText}</pre>
            
            {terminalProgress >= terminalTextRef.current.length && (
              <motion.div 
                className="name-list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>姓名</th>
                      <th>年龄</th>
                      <th>部门</th>
                      <th>职位</th>
                    </tr>
                  </thead>
                  <tbody>
                    {missingPersonnel.map(person => (
                      <tr 
                        key={person.id}
                        className={person.name === "Rolf Røkke" ? "highlight-row" : ""}
                        onClick={() => handleNameClick(person.name)}
                      >
                        <td>{person.id}</td>
                        <td>{person.name}</td>
                        <td>{person.age}</td>
                        <td>{person.department}</td>
                        <td>{person.position}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}
          </div>
          
          <div className="terminal-footer">
            <button 
              className="terminal-button-primary"
              onClick={() => {
                setTimeout(() => {
                  setCurrentScene(currentScene + 1);
                  setShowDataTerminal(false);
                }, 1000);
              }}
            >
              继续
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
  };
  
  // 渲染重大发现效果
  const renderRevelationEffect = () => {
    if (!nameHighlighted) return null;
    
    return (
      <motion.div 
        className="revelation-effect"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.8, 0] }}
        transition={{ duration: 3, times: [0, 0.2, 1] }}
      />
    );
  };
  
  // 震动效果
  const ShakeEffect = ({ children }) => {
    return (
      <motion.div
        animate={{ 
          x: [0, -2, 2, -2, 0],
          y: [0, 1, -1, 1, 0]
        }}
        transition={{ 
          duration: 0.5, 
          repeat: 2,
          repeatType: "reverse"
        }}
      >
        {children}
      </motion.div>
    );
  };
  
  return (
    <div className="perfect-void-revelation">
      {/* 音频元素 */}
      <div className="audio-container">
        <audio ref={audioRef}>
          <source src="/assets/audio/terminal-beep.mp3" type="audio/mpeg" />
        </audio>
        <audio ref={revelationSoundRef}>
          <source src="/assets/audio/revelation.mp3" type="audio/mpeg" />
        </audio>
        <audio ref={heartbeatSoundRef} loop>
          <source src="/assets/audio/heartbeat.mp3" type="audio/mpeg" />
        </audio>
      </div>
      
      {/* 主场景内容 */}
      <AnimatePresence mode="wait">
        {showDataTerminal ? renderNamelistTerminal() : renderNormalScene()}
      </AnimatePresence>
      
      {nameHighlighted && <ShakeEffect>{renderRevelationEffect()}</ShakeEffect>}
      
      {/* 装饰元素 */}
      <div className="overlay"></div>
      <div className="scanline"></div>
      <div className="noise"></div>
    </div>
  );
};

// 添加必要的样式
const styles = `
  .perfect-void-revelation {
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
  
  .character-marker.official {
    background-color: var(--neon-secondary);
    box-shadow: 0 0 10px rgba(255, 51, 102, 0.5);
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
  
  /* 终端界面样式 */
  .terminal-overlay {
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
  
  .terminal-window {
    width: 80%;
    max-width: 900px;
    height: 80vh;
    background-color: #0f0f17;
    border-radius: 5px;
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  
  .terminal-header {
    height: 30px;
    background-color: #1a1a2e;
    display: flex;
    align-items: center;
    padding: 0 10px;
    border-bottom: 1px solid #333;
  }
  
  .terminal-title {
    flex-grow: 1;
    color: #ddd;
    font-size: 0.9rem;
    font-family: 'Fira Code', monospace;
  }
  
  .terminal-controls {
    display: flex;
    gap: 8px;
  }
  
  .terminal-button {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: #333;
  }
  
  .terminal-button.red {
    background-color: #ff3b30;
  }
  
  .terminal-button.yellow {
    background-color: #ffcc00;
  }
  
  .terminal-button.green {
    background-color: #34c759;
  }
  
  .terminal-body {
    flex-grow: 1;
    padding: 15px;
    overflow-y: auto;
    position: relative;
  }
  
  .terminal-text {
    color: #00ff9d;
    font-family: 'Fira Code', monospace;
    font-size: 0.9rem;
    line-height: 1.6;
    margin: 0;
    white-space: pre-wrap;
  }
  
  .terminal-footer {
    height: 50px;
    background-color: #1a1a2e;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 0 15px;
    border-top: 1px solid #333;
  }
  
  .terminal-button-primary {
    background-color: transparent;
    border: 1px solid var(--neon-primary);
    color: var(--neon-primary);
    padding: 8px 15px;
    border-radius: 3px;
    font-family: 'Fira Code', monospace;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .terminal-button-primary:hover {
    background-color: rgba(0, 255, 157, 0.2);
    box-shadow: 0 0 10px rgba(0, 255, 157, 0.5);
  }
  
  /* 名单表格样式 */
  .name-list {
    margin-top: 20px;
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 5px;
    overflow: hidden;
  }
  
  .name-list table {
    width: 100%;
    border-collapse: collapse;
    color: #ddd;
    font-family: 'Fira Code', monospace;
    font-size: 0.85rem;
  }
  
  .name-list th {
    background-color: #1a1a2e;
    padding: 10px;
    text-align: left;
    color: var(--neon-primary);
    font-weight: normal;
    border-bottom: 1px solid #333;
  }
  
  .name-list td {
    padding: 8px 10px;
    border-bottom: 1px solid #222;
  }
  
  .name-list tr {
    transition: all 0.3s ease;
  }
  
  .name-list tr:hover {
    background-color: rgba(0, 255, 157, 0.1);
    cursor: pointer;
  }
  
  .name-list tr.highlight-row {
    background-color: rgba(255, 51, 102, 0.2);
    animation: pulse-highlight 2s infinite;
  }
  
  .name-list tr.highlight-row:hover {
    background-color: rgba(255, 51, 102, 0.3);
  }
  
  .revelation-effect {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 51, 102, 0.2);
    z-index: 100;
    pointer-events: none;
  }
  
  /* 场景背景 */
  .void-edge {
    background-image: linear-gradient(rgba(10, 10, 18, 0.7), rgba(10, 10, 18, 0.7)), url('/assets/images/void-edge.jpg');
    background-size: cover;
    background-position: center;
  }
  
  .void-walking {
    background-image: linear-gradient(rgba(10, 10, 18, 0.7), rgba(10, 10, 18, 0.7)), url('/assets/images/void-walking.jpg');
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
  
  @keyframes pulse-highlight {
    0%, 100% {
      background-color: rgba(255, 51, 102, 0.2);
    }
    50% {
      background-color: rgba(255, 51, 102, 0.3);
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
    
    .terminal-window {
      width: 95%;
      height: 90vh;
    }
    
    .name-list table {
      font-size: 0.75rem;
    }
  }
`;

export default () => (
  <>
    <style>{styles}</style>
    <PerfectVoidRevelation />
  </>
);
