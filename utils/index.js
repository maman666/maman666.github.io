

// 添加点击特效
function addClickHeartEffect() {
  document.body.addEventListener('click', (e) => {
    const x = e.pageX;
    const y = e.pageY;
    const heart = document.createElement('div');
    heart.style.position = 'absolute';
    heart.style.left = x + 'px';
    heart.style.top = y + 'px';
    heart.innerHTML = '💖';
    heart.style.animation = 'pop 0.5s linear';
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 500);
  });
}

// 打字机效果
function typewriter(element, options = {}) {
  // 默认配置
  const config = {
    speed: 75,                    // 打字速度（毫秒）
    cursorChar: '_',             // 光标字符
    cursorBlink: true,           // 是否闪烁光标
    startDelay: 0,               // 开始前延迟
    onComplete: null             // 完成回调
  };

  // 合并用户配置
  Object.assign(config, options);

  const originalText = element.innerHTML;
  let progress = 0;
  element.innerHTML = '';

  // 处理HTML标签和特殊字符
  function processNextChar() {
    if (progress >= originalText.length) {
      return progress;
    }

    // 处理 &nbsp;
    if (originalText.substr(progress, 6) === '&nbsp;') {
      return progress + 6;
    }

    // 处理HTML标签
    if (originalText[progress] === '<') {
      const closeIndex = originalText.indexOf('>', progress);
      return closeIndex !== -1 ? closeIndex + 1 : progress + 1;
    }

    return progress + 1;
  }

  // 开始打字效果
  function startTyping() {
    const timer = setInterval(() => {
      progress = processNextChar();
      
      // 显示当前文本和光标
      const displayText = originalText.substring(0, progress);
      element.innerHTML = displayText + (config.cursorBlink && (progress & 1) ? config.cursorChar : '');

      // 检查是否完成
      if (progress >= originalText.length) {
        clearInterval(timer);
        element.innerHTML = originalText;
        
        // 调用完成回调
        if (typeof config.onComplete === 'function') {
          config.onComplete();
        }
      }
    }, config.speed);

    // 返回清理函数
    return () => clearInterval(timer);
  }

  // 处理开始延迟
  if (config.startDelay > 0) {
    setTimeout(startTyping, config.startDelay);
  } else {
    startTyping();
  }
}


// 流星雨
// 更新后的流星生成函数
function createMeteors() {
  const container = document.getElementById('meteorContainer');
  const meteorCount = 20; // 增加流星数量

  for (let i = 0; i < meteorCount; i++) {
      const meteor = document.createElement('div');
      meteor.className = 'meteor';
      
      // 随机参数
      const size = Math.random() * 2 + 1;
      const delay = Math.random() * 15;
      const duration = Math.random() * 3 + 2;
      
      // 样式设置
      meteor.style.left = Math.random() * 30 + 70 + '%';
      meteor.style.top = Math.random() * 30 + '%';
      meteor.style.animationDelay = delay + 's';
      meteor.style.animationDuration = duration + 's';
      meteor.style.borderBottomWidth = size + 'px';
      meteor.style.filter = `drop-shadow(0 0 ${size * 3}px rgba(255,105,180,0.8))`;
      
      // 拖尾样式
      meteor.style.setProperty('--tail-length', Math.random() * 100 + 150 + 'px');
      meteor.style.setProperty('--tail-opacity', Math.random() * 0.5 + 0.3);
      
      // 创建拖尾
      const tail = document.createElement('div');
      tail.className = 'tail';
      meteor.appendChild(tail);
      
      container.appendChild(meteor);
  }
}