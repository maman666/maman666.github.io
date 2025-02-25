

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