// 添加点击特效
function addClickHeartEffect() {
  document.body.addEventListener("click", (e) => {
    const x = e.pageX;
    const y = e.pageY;
    const heart = document.createElement("div");
    heart.style.position = "absolute";
    heart.style.left = x + "px";
    heart.style.top = y + "px";
    heart.innerHTML = "💖";
    heart.style.animation = "pop 0.5s linear";
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 500);
  });
}

// 打字机效果
function typewriter(element, options = {}) {
  // 默认配置
  const config = {
    speed: 75, // 打字速度（毫秒）
    cursorChar: "_", // 光标字符
    cursorBlink: true, // 是否闪烁光标
    startDelay: 0, // 开始前延迟
    onComplete: null, // 完成回调
  };

  // 合并用户配置
  Object.assign(config, options);

  const originalText = element.innerHTML;
  let progress = 0;
  element.innerHTML = "";

  // 处理HTML标签和特殊字符
  function processNextChar() {
    if (progress >= originalText.length) {
      return progress;
    }

    // 处理 &nbsp;
    if (originalText.substr(progress, 6) === "&nbsp;") {
      return progress + 6;
    }

    // 处理HTML标签
    if (originalText[progress] === "<") {
      const closeIndex = originalText.indexOf(">", progress);
      return closeIndex !== -1 ? closeIndex + 1 : progress + 1;
    }

    return progress + 1;
  }

  let lastTime = 0;
  // 开始打字效果
  function startTyping(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const elapsed = timestamp - lastTime;
    if (elapsed >= config.speed) {
      progress = processNextChar();

      // 显示当前文本和光标
      const displayText = originalText.substring(0, progress);
      element.innerHTML =
        displayText +
        (config.cursorBlink && progress & 1 ? config.cursorChar : "");

      // 检查是否完成
      if (progress < originalText.length) {
        lastTime = timestamp;
        requestAnimationFrame(startTyping);
      } else {
        element.innerHTML = originalText;
        // 调用完成回调
        if (typeof config.onComplete === "function") {
          config.onComplete();
        }
      }
    } else {
      requestAnimationFrame(startTyping);
    }
  }

  // 处理开始延迟
  if (config.startDelay > 0) {
    setTimeout(() => requestAnimationFrame(startTyping), config.startDelay);
  } else {
    requestAnimationFrame(startTyping);
  }
}

// 节流函数
const throttle = (fn, delay) => {
  let timer = null;
  return function (...args) {
    if (timer) return;
    timer = setTimeout(() => {
      fn.apply(this, args);
      timer = null;
    }, delay);
  };
};

// 弹性运动
/**
 * 弹性运动函数
 * @param {HTMLElement} element - 需要移动的DOM元素
 * @param {Object} options - 配置选项
 * @param {number} options.target - 目标位置
 * @param {string} options.property - 要改变的属性(left/top/right/bottom)
 * @param {number} options.damping - 阻力系数(0-1之间，默认0.75)
 * @param {number} options.spring - 弹性系数(默认8)
 * @param {number} options.interval - 定时器间隔(默认30ms)
 * @returns {Function} 返回停止动画的函数
 */
function elasticMove(element, options) {
  // 参数校验和默认值
  if (!element || !options || !options.target) {
    throw new Error('Missing required parameters');
  }

  const config = {
    property: 'left',
    damping: 0.75,
    spring: 8,
    onComplete: null,
    ...options
  };

  // 速度变量
  let speed = 0;
  // 新增一个变量来记录循环次数
  let loopCount = 0;
  // 最大循环次数，可根据实际情况调整
  const maxLoopCount = 80; 

  // 获取当前位置
  const getCurrentPosition = () => {
    const position = getComputedStyle(element)[config.property];
    return parseInt(position) || 0;
  };

  function animate() {
    const currentPosition = getCurrentPosition();
  
    // 计算速度
    speed += (config.target - currentPosition) / config.spring;
    speed *= config.damping;
  
    // 判断是否到达目标
    const isNearTarget = Math.abs(speed) <= 0.1 && Math.abs(config.target - currentPosition) <= 0.1;
    const isMaxLoopReached = loopCount >= maxLoopCount;
  
    if (isNearTarget || isMaxLoopReached) {
      console.log('停止弹性运动');
      element.style[config.property] = `${config.target}px`;
      speed = 0;
      // 调用完成回调
      if (typeof config.onComplete === 'function') {
        config.onComplete();
      }
    } else {
      element.style[config.property] = `${currentPosition + speed}px`;
      loopCount++;
      requestAnimationFrame(animate);
    }
  }

  // 开始运动
  requestAnimationFrame(animate);

  // 返回停止函数
  return () => cancelAnimationFrame(animate);
}

// 自由落体运动
function freeFall(element, options = {}) {
  if (!element) {
    throw new Error('Element is required');
  }

  // 默认配置
  const config = {
    gravity: 3, // 控制重力加速度
    bounce: 0.75, // 控制反弹系数
    onBounce: null,
    ...options
  };

  let speed = 0;

  function animate() {
    // 添加重力加速度
    speed += config.gravity;

    // 计算新位置
    let newTop = element.offsetTop + speed;
    
    const maxTop = document.documentElement.clientHeight - element.offsetHeight;

    // 检查是否触底
    if (newTop > maxTop) {
      newTop = maxTop;
      speed *= -1; // 反向
      speed *= config.bounce; // 能量损耗

      // 触发碰撞回调
      if (typeof config.onBounce === 'function') {
        config.onBounce();
      }

      // 如果速度很小，就停止运动
      if (Math.abs(speed) < 2) {
        console.log('停止自由落体');
        return;
      }
    }

    // 更新位置
    element.style.top = `${newTop}px`;
    requestAnimationFrame(animate);
  }

  // 开始动画
  requestAnimationFrame(animate);

  // 返回停止函数
  return () => cancelAnimationFrame(animate);
}