/**
 * 时空星光背景效果 - 为超时空裁判章节专门设计
 * 实现时空交错、古今融合的星光背景效果，替代原波纹
 */

(function() {
  // 配置参数
  const config = {
    starCount: 150,            // 背景星星数量
    clickStarCount: 15,        // 点击产生的星星数量
    minSize: 1,                // 最小星星尺寸
    maxSize: 3,                // 最大星星尺寸
    minSpeed: 0.001,           // 最小闪烁速度
    maxSpeed: 0.005,           // 最大闪烁速度
    ancientColor: '#d4af37',   // 古代颜色（金色）
    modernColor: '#00aaff',    // 现代颜色（蓝色）
    opacity: 0.7,              // 基础透明度
    containerZIndex: -5,       // 容器层级（背景）
    glowIntensity: 3,          // 发光强度
    fadeSpeed: 0.01,           // 点击星星消失速度
    lifetime: 3000,            // 点击星星生命周期(毫秒)
    moveSpeed: 0.15,           // 星星移动速度
    moveProbability: 0.6       // 会移动的星星比例
  };

  // 状态管理
  let stars = [];
  let animationId = null;
  let container = null;
  let canvas = null;
  let ctx = null;
  let isInitialized = false;
  
  // 星星类
  class Star {
    constructor(x, y, isClickStar = false) {
      this.x = x || Math.random() * window.innerWidth;
      this.y = y || Math.random() * window.innerHeight;
      this.size = Math.random() * (config.maxSize - config.minSize) + config.minSize;
      this.color = Math.random() > 0.5 ? config.ancientColor : config.modernColor;
      this.alpha = Math.random() * config.opacity * 0.8 + config.opacity * 0.2;
      this.speed = Math.random() * (config.maxSpeed - config.minSpeed) + config.minSpeed;
      this.phase = Math.random() * Math.PI * 2; // 随机相位
      this.isClickStar = isClickStar;
      
      // 移动相关属性
      this.canMove = Math.random() < config.moveProbability;
      // 移动角度 (0-2π)
      this.moveAngle = Math.random() * Math.PI * 2;
      // 移动速度
      this.moveSpeed = Math.random() * config.moveSpeed * (this.isClickStar ? 3 : 1);
      // 根据角度计算x和y方向的速度
      this.vx = Math.cos(this.moveAngle) * this.moveSpeed;
      this.vy = Math.sin(this.moveAngle) * this.moveSpeed;
      // 运动路径改变计时器
      this.directionChangeTime = Math.random() * 300 + 200;
      this.directionTimer = 0;
      
      // 点击产生的星星特性
      if (isClickStar) {
        this.size = this.size * 1.5; // 略大一些
        this.createdAt = Date.now();
        this.velocity = {
          x: (Math.random() - 0.5) * 1.5,
          y: (Math.random() - 0.5) * 1.5
        };
      }
    }
    
    // 更新星星状态
    update() {
      // 闪烁效果
      this.phase += this.speed;
      this.currentAlpha = this.alpha * (0.5 + 0.5 * Math.sin(this.phase));
      
      // 点击星星的特殊处理
      if (this.isClickStar) {
        // 移动
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        
        // 逐渐消失
        const age = Date.now() - this.createdAt;
        if (age > config.lifetime) {
          return false; // 生命周期结束，移除星星
        }
        
        // 生命周期的最后30%开始淡出
        if (age > config.lifetime * 0.7) {
          this.currentAlpha *= (1 - (age - config.lifetime * 0.7) / (config.lifetime * 0.3));
        }
      }
      // 普通星星移动
      else if (this.canMove) {
        // 更新位置
        this.x += this.vx;
        this.y += this.vy;
        
        // 边界处理 - 循环回到另一侧
        if (this.x < -10) this.x = window.innerWidth + 10;
        if (this.x > window.innerWidth + 10) this.x = -10;
        if (this.y < -10) this.y = window.innerHeight + 10;
        if (this.y > window.innerHeight + 10) this.y = -10;
        
        // 随机改变运动方向
        this.directionTimer++;
        if (this.directionTimer >= this.directionChangeTime) {
          // 有30%的几率改变方向
          if (Math.random() < 0.3) {
            // 新的移动角度 - 在当前角度基础上偏转一部分
            this.moveAngle += (Math.random() - 0.5) * Math.PI / 2;
            // 重新计算速度向量
            this.vx = Math.cos(this.moveAngle) * this.moveSpeed;
            this.vy = Math.sin(this.moveAngle) * this.moveSpeed;
          }
          // 重置计时器
          this.directionTimer = 0;
          this.directionChangeTime = Math.random() * 300 + 200;
        }
      }
      
      return true; // 保留星星
    }
    
    // 绘制星星
    draw(ctx) {
      // 设置透明度
      ctx.globalAlpha = this.currentAlpha;
      
      // 绘制星点
      ctx.beginPath();
      ctx.fillStyle = this.color;
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      
      // 绘制光晕
      ctx.beginPath();
      const glowSize = this.size * config.glowIntensity;
      const gradient = ctx.createRadialGradient(
        this.x, this.y, 0, 
        this.x, this.y, glowSize
      );
      
      // 设置渐变颜色
      gradient.addColorStop(0, this.color + Math.floor(this.currentAlpha * 255).toString(16).padStart(2, '0'));
      gradient.addColorStop(1, this.color + '00'); // 完全透明
      
      ctx.fillStyle = gradient;
      ctx.arc(this.x, this.y, glowSize, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 初始化函数
  function init() {
    if (isInitialized) return;
    
    // 移除星光背景
    removeStarBackground();
    
    // 创建容器
    container = document.createElement('div');
    container.className = 'spacetime-stars-container';
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: ${config.containerZIndex};
    `;
    document.body.appendChild(container);

    // 创建canvas
    canvas = document.createElement('canvas');
    canvas.className = 'spacetime-stars-canvas';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    `;
    container.appendChild(canvas);

    // 获取上下文
    ctx = canvas.getContext('2d');

    // 创建初始背景星星
    stars = [];
    for (let i = 0; i < config.starCount; i++) {
      stars.push(new Star());
    }

    // 添加点击事件监听器（设置为可穿透，这样不会阻挡页面交互）
    document.addEventListener('click', handleClick);
    
    // 添加窗口大小变化监听器
    window.addEventListener('resize', handleResize);
    
    // 标记为已初始化
    isInitialized = true;
    
    // 开始动画
    animate();
  }
  
  // 移除原有的星光背景
  function removeStarBackground() {
    // 隐藏原有的星星/分形背景
    const starElements = document.querySelectorAll('.stars-container, .stars, .fractal-container');
    starElements.forEach(element => {
      element.style.display = 'none';
    });
  }

  // 点击事件处理
  function handleClick(event) {
    // 在点击位置创建一组星星
    for (let i = 0; i < config.clickStarCount; i++) {
      const clickStar = new Star(event.clientX, event.clientY, true);
      stars.push(clickStar);
    }
  }

  // 处理窗口大小变化
  function handleResize() {
    if (!canvas) return;
    
    // 调整canvas大小
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // 可以选择重新创建一些星星以填充新的空间
    if (window.innerWidth > canvas.width || window.innerHeight > canvas.height) {
      const newStarsCount = Math.floor(config.starCount * 0.2); // 增加20%的星星
      for (let i = 0; i < newStarsCount; i++) {
        stars.push(new Star());
      }
    }
  }

  // 动画循环
  function animate() {
    if (!ctx) return;
    
    // 清除画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 更新和绘制所有星星
    for (let i = stars.length - 1; i >= 0; i--) {
      const star = stars[i];
      const keepStar = star.update();
      
      if (keepStar) {
        star.draw(ctx);
      } else {
        // 移除生命周期结束的星星
        stars.splice(i, 1);
        
        // 如果是点击星星，有概率生成新的背景星星
        if (star.isClickStar && Math.random() > 0.7) {
          stars.push(new Star());
        }
      }
    }
    
    // 继续动画循环
    animationId = requestAnimationFrame(animate);
  }

  // 停止效果并清理
  function stopEffect() {
    // 停止动画
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    
    // 移除事件监听器
    document.removeEventListener('click', handleClick);
    window.removeEventListener('resize', handleResize);
    
    // 移除DOM元素
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
    
    // 重置状态
    container = null;
    canvas = null;
    ctx = null;
    stars = [];
    isInitialized = false;
  }
  
  // 更新颜色配置
  function updateColors(ancient, modern) {
    config.ancientColor = ancient || config.ancientColor;
    config.modernColor = modern || config.modernColor;
    
    // 更新现有星星的颜色
    stars.forEach(star => {
      // 只为背景星星更新颜色，点击星星保持原色
      if (!star.isClickStar) {
        star.color = Math.random() > 0.5 ? config.ancientColor : config.modernColor;
      }
    });
  }
  
  // 设置星星密度
  function setDensity(density) {
    const newCount = Math.floor(density * 150); // 基于密度调整星星数量
    
    // 如果需要增加星星
    if (newCount > stars.length) {
      const addCount = newCount - stars.length;
      for (let i = 0; i < addCount; i++) {
        stars.push(new Star());
      }
    } 
    // 如果需要减少星星
    else if (newCount < stars.length) {
      // 只移除非点击产生的星星
      const backgroundStars = stars.filter(s => !s.isClickStar);
      const clickStars = stars.filter(s => s.isClickStar);
      
      // 保留适量的背景星星
      const keepCount = Math.min(newCount, backgroundStars.length);
      stars = [...backgroundStars.slice(0, keepCount), ...clickStars];
    }
  }

  // 向外暴露API
  window.SpacetimeRipple = {
    // 初始化时空星光背景
    initialize: init,
    
    // 停止效果并清理
    destroy: stopEffect,
    
    // 更新颜色配置
    updateColors: updateColors,
    
    // 设置星星密度
    setDensity: setDensity,
    
    // 设置星星移动概率
    setMoveProbability: function(probability) {
      // 限制在0-1之间
      config.moveProbability = Math.max(0, Math.min(1, probability));
      
      // 更新现有星星的移动状态
      stars.forEach(star => {
        if (!star.isClickStar) {
          // 随机决定是否可以移动
          star.canMove = Math.random() < config.moveProbability;
          if (star.canMove && !star.vx) {
            // 初始化移动参数
            star.moveAngle = Math.random() * Math.PI * 2;
            star.moveSpeed = Math.random() * config.moveSpeed;
            star.vx = Math.cos(star.moveAngle) * star.moveSpeed;
            star.vy = Math.sin(star.moveAngle) * star.moveSpeed;
          }
        }
      });
    },
    
    // 模拟点击效果
    simulateClick: function(x, y) {
      if (!isInitialized) init();
      
      // 在指定位置创建星星
      const posX = x || Math.random() * window.innerWidth;
      const posY = y || Math.random() * window.innerHeight;
      
      for (let i = 0; i < config.clickStarCount; i++) {
        stars.push(new Star(posX, posY, true));
      }
    },
    
    // 时空闪烁效果
    flashTimeShift: function() {
      if (!isInitialized) init();
      
      // 保存原始颜色
      const originalAncient = config.ancientColor;
      const originalModern = config.modernColor;
      
      // 执行三次闪烁
      let flashCount = 0;
      
      function flash() {
        if (flashCount >= 6) {
          // 恢复原来的颜色
          updateColors(originalAncient, originalModern);
          return;
        }
        
        // 交替颜色
        if (flashCount % 2 === 0) {
          // 闪烁时设为白色
          updateColors('#ffffff', '#ffffff');
          
          // 添加额外的星星
          for (let i = 0; i < 20; i++) {
            stars.push(new Star(null, null, true));
          }
        } else {
          // 恢复原来的颜色
          updateColors(originalAncient, originalModern);
        }
        
        flashCount++;
        setTimeout(flash, 100);
      }
      
      flash();
    }
  };
})(); 