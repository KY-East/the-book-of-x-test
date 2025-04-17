# XiCore 交互组件指南

> "交互即叙事，每一个组件不仅要功能完备，更要与世界观共鸣，成为故事的一部分。"

本文档详细介绍XiCore交互组件系统的使用方法、组合规则和定制开发流程，帮助创作者构建沉浸式交互体验。

## 目录
- [组件类型概览](#组件类型概览)
- [核心交互模式](#核心交互模式)
- [组件组合规则](#组件组合规则)
- [定制组件开发](#定制组件开发)
- [辅助功能与无障碍](#辅助功能与无障碍)
- [问题排查与优化](#问题排查与优化)

## 组件类型概览

XiCore交互组件系统围绕四大类核心组件构建，每种组件都有其特定的设计原则和使用场景。

### 1. 导航类组件

用于不同场景、视角或叙事线之间的切换，是读者探索的主要途径。

**主要组件**：
- **Xi-Nav**：主导航组件，管理章节和场景切换
- **Xi-Portal**：空间跳跃门户，用于关键场景转换
- **Xi-TimeLine**：时间线导航，用于时间序列探索
- **Xi-Breadcrumb**：探索路径导航，显示当前位置和返回路径

```javascript
// 初始化导航组件
const mainNav = XiCore.component.create('xi-nav', {
  container: '#navigation-container',
  style: 'oracle', // 可选：'oracle', 'neural', 'terminal', 'vintage'
  transitions: {
    default: 'fade',
    special: 'portal'
  },
  itemMapping: {
    'chapter1': {label: '起源', icon: 'seed'},
    'chapter2': {label: '错误编译', icon: 'code'},
    'chapter3': {label: '超时空审判', icon: 'scales'}
  }
});

// 添加导航事件监听
mainNav.on('before-navigate', (targetId) => {
  // 导航前处理，如保存状态
  XiCore.state.save();
});

mainNav.on('after-navigate', (targetId) => {
  // 导航后处理，如更新界面状态
  XiCore.ui.updateActiveState(targetId);
});
```

### 2. 交互式叙事组件

将文字叙事与交互元素融合，增强阅读体验和沉浸感。

**主要组件**：
- **Xi-Dialog**：对话系统，支持角色对话和选择
- **Xi-Terminal**：终端交互，命令行式体验
- **Xi-Codex**：知识库界面，百科全书式内容展示
- **Xi-Reveal**：渐进式内容揭示，随用户行为展开故事

```javascript
// 初始化对话组件
const dialogSystem = XiCore.component.create('xi-dialog', {
  container: '#dialog-container',
  characters: {
    'oracle': {
      name: '神谕',
      avatar: 'assets/characters/oracle.png',
      textColor: 'var(--neon-blue)',
      typingSpeed: 50 // 毫秒/字符
    },
    'compiler': {
      name: '编译者',
      avatar: 'assets/characters/compiler.png',
      textColor: 'var(--neon-green)',
      typingSpeed: 30
    }
  },
  dialogStyle: 'holographic',
  allowSkip: true,
  autoplay: false
});

// 添加对话内容
dialogSystem.addDialog([
  {
    character: 'oracle',
    text: '欢迎来到量子纠缠网络。你的意识已经成功上传。',
    animation: 'glow',
    onStart: () => XiCore.visual.addAtmosphereEffect('quantum', {intensity: 0.8})
  },
  {
    character: 'compiler',
    text: '检测到异常波动。意识同步率：78%。建议进行记忆校准。',
    choices: [
      {
        text: '接受校准',
        next: 'calibration_path',
        consequence: () => XiCore.state.set('memory_calibrated', true)
      },
      {
        text: '拒绝校准',
        next: 'resistance_path',
        consequence: () => XiCore.state.set('resistance_level', XiCore.state.get('resistance_level', 0) + 1)
      }
    ]
  }
]);

// 开始对话
dialogSystem.start('intro_sequence');
```

### 3. 环境交互组件

允许用户与故事世界的环境和元素互动，打造更具深度的沉浸体验。

**主要组件**：
- **Xi-Object**：可交互对象，支持检查、使用、组合等操作
- **Xi-Environment**：环境交互层，控制背景、天气、时间等
- **Xi-Puzzle**：谜题组件，集成各类解谜挑战
- **Xi-Map**：空间导航地图，可视化探索空间

```javascript
// 创建可交互对象
const ancientDevice = XiCore.component.create('xi-object', {
  id: 'ancient-device',
  container: '#scene-container',
  model: {
    type: '2d', // 或 '3d'
    source: 'assets/objects/ancient-device.png',
    states: {
      'inactive': {class: 'state-inactive', frame: 0},
      'active': {class: 'state-active', frame: 1},
      'overloaded': {class: 'state-overloaded', frame: 2}
    }
  },
  initialState: 'inactive',
  interactionPoints: [
    {
      id: 'power-crystal',
      position: {x: 120, y: 85},
      radius: 20,
      cursor: 'pointer',
      tooltip: '能量水晶',
      action: 'toggle'
    },
    {
      id: 'ancient-symbols',
      position: {x: 200, y: 150},
      radius: 25,
      cursor: 'magnify',
      tooltip: '古代符文',
      action: 'examine'
    }
  ],
  inventory: {
    acceptItems: ['energy-crystal', 'decryption-key'],
    dropZones: [
      {
        id: 'crystal-slot',
        position: {x: 120, y: 85},
        radius: 30,
        acceptedItems: ['energy-crystal'],
        onItemPlace: (item) => {
          ancientDevice.setState('active');
          return true; // 消耗物品
        }
      }
    ]
  }
});

// 注册交互事件
ancientDevice.on('state-change', (newState, oldState) => {
  if (newState === 'active') {
    // 触发环境变化
    XiCore.component.get('environment').setProperty('lighting', 'mystical');
    // 解锁新的叙事内容
    XiCore.narrative.unlock('ancient_knowledge');
  }
});

ancientDevice.on('examine', (point) => {
  if (point.id === 'ancient-symbols') {
    // 显示详细信息
    XiCore.component.get('codex').showEntry('ancient-language');
  }
});
```

### 4. 数据和系统组件

展示和操作数据、状态和系统信息，为叙事提供技术层面的支持。

**主要组件**：
- **Xi-Inventory**：物品栏系统，管理收集的物品和资源
- **Xi-Status**：状态显示，展示角色属性和系统状态
- **Xi-Network**：网络连接可视化，展示实体间关系
- **Xi-Console**：开发控制台，用于调试和高级操作

```javascript
// 初始化物品栏系统
const inventory = XiCore.component.create('xi-inventory', {
  container: '#inventory-container',
  layout: 'grid', // 'grid', 'list', 'radial'
  slots: 12,
  categorized: true,
  categories: {
    'data': {icon: 'database', label: '数据'},
    'tools': {icon: 'wrench', label: '工具'},
    'artifacts': {icon: 'artifact', label: '神器'}
  },
  defaultCategory: 'data',
  dragAndDrop: true,
  contextMenu: true
});

// 添加物品
inventory.addItem({
  id: 'decryption-key',
  name: '解密密钥',
  description: '用于解锁加密数据的量子密钥。',
  category: 'tools',
  icon: 'assets/items/key.png',
  stackable: false,
  unique: true,
  usable: true,
  onUse: (targetElement) => {
    if (targetElement && targetElement.hasAttribute('data-encrypted')) {
      return {success: true, message: '数据已解密'};
    }
    return {success: false, message: '此处无法使用密钥'};
  }
});

// 监听物品事件
inventory.on('item-added', (item) => {
  XiCore.notification.show({
    type: 'item',
    title: '获得物品',
    message: `已添加到物品栏：${item.name}`,
    icon: item.icon
  });
});

inventory.on('item-used', (item, target, result) => {
  if (result.success) {
    // 处理使用成功的逻辑
    XiCore.sound.play('item-use-success');
  }
});
```

## 核心交互模式

XiCore交互系统基于以下核心交互模式，确保一致且沉浸的用户体验。

### 1. 渐进式揭示

内容随用户探索和交互逐步揭示，保持好奇心和探索欲。

```javascript
// 配置渐进式揭示组件
const revelationSystem = XiCore.component.create('xi-reveal', {
  container: '#narrative-container',
  revealTriggers: {
    'scroll': true,
    'interact': true,
    'time': true,
    'condition': true
  },
  initialVisibility: 0.3, // 初始可见内容比例
  revealSteps: [0.3, 0.6, 0.8, 1.0],
  animations: {
    in: 'fade-in',
    attention: 'pulse'
  }
});

// 添加条件触发内容
revelationSystem.addConditionalContent({
  id: 'hidden-truth',
  condition: () => XiCore.state.get('found_clues', 0) >= 3,
  content: `<div class="revelation">
    <h3>隐藏的真相</h3>
    <p>随着拼图的完成，一个更深层次的真相浮出水面...</p>
  </div>`,
  onReveal: () => {
    XiCore.sound.play('revelation');
    XiCore.visual.addSceneEffect('epiphany', {duration: 3000});
  }
});
```

### 2. 上下文感知

组件根据当前叙事上下文、用户历史和状态调整其行为和外观。

```javascript
// 配置上下文感知系统
XiCore.context.configure({
  trackedStates: ['character_trust', 'knowledge_level', 'system_access'],
  historyDepth: 10,
  environmentFactors: ['time_of_day', 'location', 'story_phase']
});

// 创建上下文感知的终端组件
const terminal = XiCore.component.create('xi-terminal', {
  container: '#terminal-container',
  contextual: true, // 启用上下文感知
  promptTemplate: '{{location}}/{{access_level}}> ',
  contextRules: [
    {
      condition: (context) => context.get('system_access') < 3,
      effect: {
        availableCommands: ['help', 'status', 'scan'],
        theme: 'restricted',
        messages: {
          welcome: '欢迎使用基础终端。权限受限。'
        }
      }
    },
    {
      condition: (context) => context.get('system_access') >= 3,
      effect: {
        availableCommands: ['help', 'status', 'scan', 'access', 'decrypt', 'override'],
        theme: 'full-access',
        messages: {
          welcome: '管理员访问已授权。所有系统功能可用。'
        }
      }
    }
  ]
});

// 更新上下文
XiCore.context.update('system_access', 3);
// 此时终端会自动更新其外观和可用命令
```

### 3. 多层次反馈

为用户操作提供视觉、听觉和叙事多层次反馈，增强互动的满足感。

```javascript
// 配置反馈系统
XiCore.feedback.configure({
  layers: {
    visual: true,
    audio: true,
    haptic: false, // 是否支持触觉反馈
    narrative: true
  },
  intensity: 0.8, // 反馈强度
  adaptToPlatform: true // 根据平台调整反馈类型
});

// 注册交互反馈
XiCore.component.get('ancient-device').on('interact', (point) => {
  // 多层次反馈
  XiCore.feedback.trigger('device-activation', {
    // 视觉反馈
    visual: {
      effect: 'pulse',
      target: '#ancient-device',
      duration: 800,
      color: 'var(--energy-color)'
    },
    // 音频反馈
    audio: {
      sound: 'device-power-up',
      volume: 0.7,
      spatial: {x: 120, y: 85, z: 0}
    },
    // 叙事反馈
    narrative: {
      type: 'environmental',
      text: '设备发出低沉的嗡鸣声，古老的机械开始运转。',
      duration: 4000
    }
  });
});
```

## 组件组合规则

XiCore组件遵循一定的组合规则，以确保一致性和可扩展性。

### 1. 嵌套与组合

组件可以相互嵌套和组合，创造复杂的交互结构。

```javascript
// 创建组合组件
const puzzleTerminal = XiCore.component.createComposite({
  id: 'quantum-puzzle-terminal',
  container: '#puzzle-area',
  components: [
    {
      type: 'xi-terminal',
      id: 'puzzle-cmd',
      config: {
        theme: 'quantum',
        position: 'left',
        height: '100%',
        width: '40%'
      }
    },
    {
      type: 'xi-puzzle',
      id: 'quantum-lock',
      config: {
        type: 'sequence',
        difficulty: 'medium',
        position: 'right',
        height: '100%',
        width: '60%'
      }
    }
  ],
  // 定义组件间的交互关系
  interactions: [
    {
      from: 'puzzle-cmd',
      event: 'command-executed',
      to: 'quantum-lock',
      action: 'processCommand',
      transformer: (command) => ({input: command.text})
    },
    {
      from: 'quantum-lock',
      event: 'state-changed',
      to: 'puzzle-cmd',
      action: 'updatePrompt',
      transformer: (state) => ({prompt: `quantum[${state.phase}]> `})
    }
  ]
});
```

### 2. 响应式布局规则

组件应当自适应不同屏幕尺寸和设备类型，提供一致的体验。

```javascript
// 配置响应式布局
XiCore.layout.configureResponsive({
  breakpoints: {
    small: 576,
    medium: 768,
    large: 992,
    xlarge: 1200
  },
  componentRules: [
    // 小屏幕规则
    {
      breakpoint: 'small',
      rules: [
        {component: 'xi-nav', config: {orientation: 'vertical', compact: true}},
        {component: 'xi-dialog', config: {width: '100%', height: 'auto'}}
      ]
    },
    // 大屏幕规则
    {
      breakpoint: 'large',
      rules: [
        {component: 'xi-nav', config: {orientation: 'horizontal', compact: false}},
        {component: 'xi-dialog', config: {width: '60%', height: '300px'}}
      ]
    }
  ]
});

// 应用响应式配置到组件
XiCore.component.create('xi-nav', {
  // ...基本配置
  responsive: true // 启用响应式规则
});
```

### 3. 主题一致性规则

组件应遵循主题系统，确保视觉语言一致性。

```javascript
// 配置组件主题
XiCore.themes.defineComponentStyles('oracle', {
  'xi-terminal': {
    background: 'var(--oracle-bg)',
    fontFamily: 'var(--terminal-font)',
    color: 'var(--oracle-text)',
    promptColor: 'var(--oracle-prompt)',
    borderRadius: '4px',
    borderStyle: 'solid',
    borderWidth: '1px',
    borderColor: 'var(--oracle-border)',
    boxShadow: '0 0 15px var(--oracle-glow)'
  },
  'xi-dialog': {
    background: 'var(--oracle-dialog-bg)',
    characterNameColor: 'var(--oracle-accent)',
    dialogBorder: '1px solid var(--oracle-border)',
    choiceButtonStyle: 'oracle-button'
  }
});

// 应用主题到组件
XiCore.component.create('xi-terminal', {
  // ...基本配置
  theme: XiCore.themes.current // 使用当前活动主题
});
```

## 定制组件开发

XiCore支持开发定制交互组件，扩展系统功能。

### 1. 组件开发框架

```javascript
// 创建自定义组件类
XiCore.component.define('xi-biometric', {
  // 组件元数据
  meta: {
    name: 'Biometric Scanner',
    description: '用于生物识别验证的交互组件',
    version: '1.0.0',
    author: 'Xi Dev Team',
    dependencies: ['xi-core:>=1.2.0']
  },
  
  // 默认配置
  defaults: {
    scanDuration: 2000,
    successRate: 0.9,
    authMethods: ['fingerprint', 'retina', 'voice'],
    uiTemplate: 'minimal'
  },
  
  // 初始化方法
  init: function(container, options) {
    this.container = typeof container === 'string' 
                      ? document.querySelector(container) 
                      : container;
    
    this.options = Object.assign({}, this.defaults, options);
    this.authenticated = false;
    this.scanInProgress = false;
    
    // 创建DOM结构
    this._buildUI();
    
    // 绑定事件
    this._bindEvents();
    
    // 发布初始化完成事件
    this.trigger('initialized');
    
    return this;
  },
  
  // 私有方法：构建UI
  _buildUI: function() {
    this.element = document.createElement('div');
    this.element.className = `xi-component xi-biometric-scanner ${this.options.uiTemplate}`;
    
    const templateHTML = `
      <div class="scanner-display">
        <div class="scan-area"></div>
        <div class="scan-indicator"></div>
      </div>
      <div class="controls">
        ${this.options.authMethods.map(method => 
          `<button class="auth-method" data-method="${method}">
            ${method.charAt(0).toUpperCase() + method.slice(1)}
          </button>`
        ).join('')}
      </div>
      <div class="status-display">准备就绪</div>
    `;
    
    this.element.innerHTML = templateHTML;
    this.container.appendChild(this.element);
    
    // 获取UI元素引用
    this.scanArea = this.element.querySelector('.scan-area');
    this.scanIndicator = this.element.querySelector('.scan-indicator');
    this.statusDisplay = this.element.querySelector('.status-display');
  },
  
  // 私有方法：绑定事件
  _bindEvents: function() {
    const methodButtons = this.element.querySelectorAll('.auth-method');
    
    methodButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const method = e.target.getAttribute('data-method');
        this.startScan(method);
      });
    });
  },
  
  // 公共方法：开始扫描
  startScan: function(method) {
    if (this.scanInProgress) return;
    
    this.scanInProgress = true;
    this.statusDisplay.textContent = `正在进行${method}扫描...`;
    this.element.classList.add('scanning');
    
    // 触发扫描开始事件
    this.trigger('scan-start', {method});
    
    // 模拟扫描过程
    setTimeout(() => {
      const success = Math.random() <= this.options.successRate;
      this.completeScan(success);
    }, this.options.scanDuration);
  },
  
  // 公共方法：完成扫描
  completeScan: function(success) {
    this.scanInProgress = false;
    this.element.classList.remove('scanning');
    
    if (success) {
      this.authenticated = true;
      this.statusDisplay.textContent = '验证成功';
      this.element.classList.add('auth-success');
      
      // 触发成功事件
      this.trigger('auth-success', {timestamp: Date.now()});
    } else {
      this.statusDisplay.textContent = '验证失败';
      this.element.classList.add('auth-fail');
      
      // 触发失败事件
      this.trigger('auth-fail');
      
      // 重置失败状态
      setTimeout(() => {
        this.element.classList.remove('auth-fail');
        this.statusDisplay.textContent = '准备就绪';
      }, 2000);
    }
  },
  
  // 公共方法：重置组件
  reset: function() {
    this.authenticated = false;
    this.scanInProgress = false;
    this.element.classList.remove('auth-success', 'auth-fail', 'scanning');
    this.statusDisplay.textContent = '准备就绪';
    
    // 触发重置事件
    this.trigger('reset');
  },
  
  // 公共方法：销毁组件
  destroy: function() {
    // 解绑事件
    const methodButtons = this.element.querySelectorAll('.auth-method');
    methodButtons.forEach(button => {
      button.removeEventListener('click', this.startScan);
    });
    
    // 移除DOM元素
    this.element.remove();
    
    // 触发销毁事件
    this.trigger('destroyed');
  }
});

// 使用自定义组件
const biometricScanner = XiCore.component.create('xi-biometric', {
  container: '#security-system',
  scanDuration: 1500,
  authMethods: ['fingerprint', 'facial'],
  uiTemplate: 'holographic'
});

// 监听认证事件
biometricScanner.on('auth-success', (data) => {
  XiCore.security.grantAccess(data.timestamp);
  // 解锁新内容
  XiCore.narrative.advance('security_cleared');
});
```

### 2. 组件集成指南

```javascript
// 注册组件到系统
XiCore.registerComponent({
  name: 'xi-biometric',
  path: 'modules/security/xi-biometric.js',
  dependencies: ['xi-security', 'xi-ui-core'],
  autoLoad: false
});

// 组件生命周期钩子
XiCore.component.hooks.register('xi-biometric', {
  beforeCreate: (config) => {
    // 组件创建前的预处理
    XiCore.logger.info('Preparing biometric component');
    return config;
  },
  afterCreate: (instance) => {
    // 组件创建后的处理
    XiCore.security.registerAuthMethod('biometric', instance);
  },
  beforeDestroy: (instance) => {
    // 组件销毁前的清理
    XiCore.security.unregisterAuthMethod('biometric');
  }
});
```

## 辅助功能与无障碍

XiCore交互组件内置辅助功能支持，确保更广泛的用户可访问性。

### 1. 无障碍配置

```javascript
// 配置系统级无障碍设置
XiCore.accessibility.configure({
  highContrast: false,
  largeText: false,
  screenReader: false,
  reducedMotion: false,
  keyboardNavigation: true,
  audioCues: true
});

// 应用无障碍设置到所有组件
XiCore.component.configureAll({
  accessibility: XiCore.accessibility.getSettings()
});

// 监听无障碍设置变化
XiCore.accessibility.on('settings-changed', (newSettings) => {
  // 更新所有组件的无障碍设置
  XiCore.component.updateAll({accessibility: newSettings});
});
```

### 2. 组件级无障碍实现

```javascript
// 创建支持无障碍的对话组件
const accessibleDialog = XiCore.component.create('xi-dialog', {
  // ...基本配置
  accessibility: {
    ariaLive: 'polite',
    ariaLabelled: true,
    screenReaderText: true,
    keyboardControls: {
      'next': ['Space', 'ArrowRight'],
      'prev': ['ArrowLeft'],
      'choice1': ['1', 'Digit1'],
      'choice2': ['2', 'Digit2'],
      'choice3': ['3', 'Digit3']
    }
  }
});

// 添加无障碍支持的方法
accessibleDialog.setScreenReaderText = function(text) {
  this.srElement = this.srElement || (() => {
    const el = document.createElement('div');
    el.className = 'sr-only';
    el.setAttribute('aria-live', 'polite');
    this.element.appendChild(el);
    return el;
  })();
  
  this.srElement.textContent = text;
};
```

## 问题排查与优化

### 1. 性能优化

```javascript
// 组件性能分析
XiCore.performance.analyzeComponent('xi-terminal', {
  duration: 5000, // 分析持续时间(毫秒)
  events: ['render', 'update', 'user-input'],
  onComplete: (report) => {
    console.log('组件性能报告:', report);
    
    // 基于报告自动优化
    if (report.renderTime > 16) { // 如果渲染时间超过16ms
      XiCore.component.get('xi-terminal').optimize({
        batchUpdates: true,
        renderThrottleInterval: 32
      });
    }
  }
});
```

### 2. 组件调试

```javascript
// 启用组件调试
XiCore.debug.enableComponentInspector({
  showBoundingBox: true,
  logEvents: true,
  showPerformance: true,
  highlightUpdates: true
});

// 监控特定组件的活动
XiCore.debug.monitor('xi-puzzle', {
  stateChanges: true,
  methodCalls: true,
  userInteractions: true,
  renderCycles: true
});
```

### 3. 常见问题解决

**问题1: 组件交互没有响应**

**解决方案**:
1. 检查事件绑定，确保目标元素存在并正确绑定事件
2. 验证组件初始化顺序，确保依赖组件已加载
3. 检查控制台错误，查找JavaScript异常

```javascript
// 组件健康检查
XiCore.diagnostics.checkComponent('xi-object', {
  verifyDOM: true,
  checkEventBindings: true,
  validateState: true,
  onIssueFound: (issue) => {
    console.warn(`组件问题: ${issue.type} - ${issue.message}`);
    XiCore.diagnostics.suggestFix(issue);
  }
});
```

**问题2: 视觉和交互不协调**

**解决方案**:
1. 确保视觉效果和交互事件的时间同步
2. 检查组件的状态转换是否正确反映在UI上
3. 验证主题应用是否一致

```javascript
// 同步检查
XiCore.diagnostics.checkSynchronization({
  components: ['xi-visual-effect', 'xi-interaction'],
  tolerance: 50, // 毫秒
  onIssueFound: (issue) => {
    console.warn(`同步问题: ${issue.message}`);
    // 自动修复尝试
    XiCore.diagnostics.synchronize(issue.components);
  }
});
```

---

> 注：交互组件的设计应遵循叙事一致性原则，确保每个交互都服务于更大的故事目标和用户体验。 