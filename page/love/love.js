let gardenCtx, gardenCanvas, garden;
let clientWidth = window.innerWidth;
let clientHeight = window.innerHeight;
let offsetX, offsetY;

// 在 window.onload 中添加错误处理
window.onload = function () {
  try {
    // setup garden
    const loveHeart = document.getElementById("loveHeart");
    if (!loveHeart) {
      console.error("Element 'loveHeart' not found");
      return;
    }
    offsetX = loveHeart.offsetWidth / 2;
    offsetY = loveHeart.offsetHeight / 2 - 55;

    gardenCanvas = document.getElementById("garden");
    if (!gardenCanvas) {
      console.error("Element 'garden' not found");
      return;
    }
    gardenCanvas.width = loveHeart.offsetWidth;
    gardenCanvas.height = loveHeart.offsetHeight;
    gardenCtx = gardenCanvas.getContext("2d");
    if (!gardenCtx) {
      console.error("Failed to get 2D context for 'garden' canvas");
      return;
    }
    gardenCtx.globalCompositeOperation = "lighter";
    garden = new Garden(gardenCtx, gardenCanvas);

    const loveContent = document.getElementById("love-content");
    const code = document.getElementById("code");
    if (!loveContent || !code) {
      console.error("Element 'love-content' or 'code' not found");
      return;
    }
    // 将 love-content 的宽度设置为 loveHeart 和 code 两个元素宽度之和
    loveContent.style.width = loveHeart.offsetWidth + code.offsetWidth + "px";
    // 将 love-content 的宽度设置为 loveHeart 和 code 两个元素宽度之和
    loveContent.style.height =
      Math.max(loveHeart.offsetHeight, code.offsetHeight) + "px";
    // 设置 love-content 的 margin-top 和 margin-left 计算上边距使内容垂直居中/水平居中 同时确保最小边距为10px
    loveContent.style.marginTop =
      Math.max((window.innerHeight - loveContent.offsetHeight) / 2, 10) + "px";

    // renderLoop
    setInterval(function () {
      garden.render();
    }, Garden.options.growSpeed);
  } catch (error) {
    console.error("An error occurred during window.onload:", error);
  }
};

window.onresize = function () {
  const newWidth = window.innerWidth;
  const newHeight = window.innerHeight;
  if (newWidth != clientWidth && newHeight != clientHeight) {
    location.replace(location);
  }
};

function getHeartPoint(angle) {
  const t = angle / Math.PI;
  const x = 19.5 * (16 * Math.sin(t) ** 3);
  const y =
    -20 *
    (13 * Math.cos(t) -
      5 * Math.cos(2 * t) -
      2 * Math.cos(3 * t) -
      Math.cos(4 * t));
  return [offsetX + x, offsetY + y];
}

function startHeartAnimation(fn) {
  const interval = 50;
  let angle = 10;
  const heart = [];
  const animationTimer = setInterval(function () {
    const bloom = getHeartPoint(angle);
    let draw = true;
    for (let i = 0; i < heart.length; i++) {
      const p = heart[i];
      const distance = Math.sqrt(
        Math.pow(p[0] - bloom[0], 2) + Math.pow(p[1] - bloom[1], 2)
      );
      if (distance < Garden.options.bloomRadius.max * 1.3) {
        draw = false;
        break;
      }
    }
    if (draw) {
      heart.push(bloom);
      garden.createRandomBloom(bloom[0], bloom[1]);
    }
    if (angle >= 30) {
      clearInterval(animationTimer);
      showMessages(() => {
        fn && fn();
      });
    } else {
      angle += 0.2;
    }
  }, interval);
}

function timeElapse(date) {
  // 处理输入参数
  let startDate;
  if (date instanceof Date) {
    startDate = date;
  } else if (typeof date === "string") {
    // 处理日期字符串
    startDate = new Date(date.replace(/\./g, "-"));
  } else {
    console.error(
      "Invalid date parameter. Please use Date object or YYYY.MM.DD string format"
    );
    return;
  }

  // 确保日期有效
  if (isNaN(startDate.getTime())) {
    console.error("Invalid date. Please check your input");
    return;
  }

  // 获取当前时间
  const current = new Date();

  // 计算时间差（毫秒）
  let timeDiff = current - startDate;

  // 如果是未来日期，显示0
  if (timeDiff < 0) {
    timeDiff = 0;
  }

  // 转换为秒
  let seconds = Math.floor(timeDiff / 1000);

  // 计算天数
  const days = Math.floor(seconds / (3600 * 24));
  seconds = seconds % (3600 * 24);

  // 计算小时
  let hours = Math.floor(seconds / 3600);
  seconds = seconds % 3600;

  // 计算分钟
  let minutes = Math.floor(seconds / 60);
  seconds = seconds % 60;

  // 格式化显示（补零）
  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  // 构建显示字符串
  const result = `<span class="digit">${days}</span> days 
                 <span class="digit">${hours}</span> hours 
                 <span class="digit">${minutes}</span> minutes 
                 <span class="digit">${seconds}</span> seconds`;

  // 更新显示
  const clockElement = document.getElementById("elapseClock");
  if (clockElement) {
    clockElement.innerHTML = result;
  } else {
    console.error("Element 'elapseClock' not found");
  }
}

function showMessages(fn) {
  adjustWordsPosition();
  const messages = document.getElementById("messages");
  messages.style.opacity = 0;
  messages.style.display = "block";

  let opacity = 0;
  const fadeIn = setInterval(function () {
    opacity += 0.02;
    messages.style.opacity = opacity;
    if (opacity >= 1) {
      clearInterval(fadeIn);
      showLoveU(() => {
        fn && fn();
      });
    }
  }, 50);
}

function adjustWordsPosition() {
  const words = document.getElementById("words");
  const garden = document.getElementById("garden");
  words.style.position = "absolute";
  words.style.top = garden.offsetTop + 195 + "px";
  words.style.left = garden.offsetLeft + 70 + "px";
}

function showLoveU(fn) {
  const loveU = document.getElementById("loveu");
  loveU.style.opacity = 0;
  loveU.style.display = "block";

  let opacity = 0;
  const fadeIn = setInterval(function () {
    opacity += 0.02;
    loveU.style.opacity = opacity;
    if (opacity >= 1) {
      clearInterval(fadeIn);
      fn && fn();
    }
  }, 50);
}

function Vector(x, y) {
  this.x = x;
  this.y = y;
}

Vector.prototype = {
  rotate: function (theta) {
    var x = this.x;
    var y = this.y;
    this.x = Math.cos(theta) * x - Math.sin(theta) * y;
    this.y = Math.sin(theta) * x + Math.cos(theta) * y;
    return this;
  },
  mult: function (f) {
    this.x *= f;
    this.y *= f;
    return this;
  },
  clone: function () {
    return new Vector(this.x, this.y);
  },
  length: function () {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  },
  subtract: function (v) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  },
  set: function (x, y) {
    this.x = x;
    this.y = y;
    return this;
  },
};

function Petal(stretchA, stretchB, startAngle, angle, growFactor, bloom) {
  this.stretchA = stretchA;
  this.stretchB = stretchB;
  this.startAngle = startAngle;
  this.angle = angle;
  this.bloom = bloom;
  this.growFactor = growFactor;
  this.r = 1;
  this.isfinished = false;
  //this.tanAngleA = Garden.random(-Garden.degrad(Garden.options.tanAngle), Garden.degrad(Garden.options.tanAngle));
  //this.tanAngleB = Garden.random(-Garden.degrad(Garden.options.tanAngle), Garden.degrad(Garden.options.tanAngle));
}
Petal.prototype = {
  draw: function () {
    var ctx = this.bloom.garden.ctx;
    var v1, v2, v3, v4;
    v1 = new Vector(0, this.r).rotate(Garden.degrad(this.startAngle));
    v2 = v1.clone().rotate(Garden.degrad(this.angle));
    v3 = v1.clone().mult(this.stretchA); //.rotate(this.tanAngleA);
    v4 = v2.clone().mult(this.stretchB); //.rotate(this.tanAngleB);
    ctx.strokeStyle = this.bloom.c;
    ctx.beginPath();
    ctx.moveTo(v1.x, v1.y);
    ctx.bezierCurveTo(v3.x, v3.y, v4.x, v4.y, v2.x, v2.y);
    ctx.stroke();
  },
  render: function () {
    if (this.r <= this.bloom.r) {
      this.r += this.growFactor; // / 10;
      this.draw();
    } else {
      this.isfinished = true;
    }
  },
};

function Bloom(p, r, c, pc, garden) {
  this.p = p;
  this.r = r;
  this.c = c;
  this.pc = pc;
  this.petals = [];
  this.garden = garden;
  this.init();
  this.garden.addBloom(this);
}
Bloom.prototype = {
  draw: function () {
    var p,
      isfinished = true;
    this.garden.ctx.save();
    this.garden.ctx.translate(this.p.x, this.p.y);
    for (var i = 0; i < this.petals.length; i++) {
      p = this.petals[i];
      p.render();
      isfinished *= p.isfinished;
    }
    this.garden.ctx.restore();
    if (isfinished == true) {
      this.garden.removeBloom(this);
    }
  },
  init: function () {
    var angle = 360 / this.pc;
    var startAngle = Garden.randomInt(0, 90);
    for (var i = 0; i < this.pc; i++) {
      this.petals.push(
        new Petal(
          Garden.random(
            Garden.options.petalStretch.min,
            Garden.options.petalStretch.max
          ),
          Garden.random(
            Garden.options.petalStretch.min,
            Garden.options.petalStretch.max
          ),
          startAngle + i * angle,
          angle,
          Garden.random(
            Garden.options.growFactor.min,
            Garden.options.growFactor.max
          ),
          this
        )
      );
    }
  },
};

function Garden(ctx, element) {
  this.blooms = [];
  this.element = element;
  this.ctx = ctx;
}
Garden.prototype = {
  render: function () {
    for (var i = 0; i < this.blooms.length; i++) {
      this.blooms[i].draw();
    }
  },
  addBloom: function (b) {
    this.blooms.push(b);
  },
  removeBloom: function (b) {
    var bloom;
    for (var i = 0; i < this.blooms.length; i++) {
      bloom = this.blooms[i];
      if (bloom === b) {
        this.blooms.splice(i, 1);
        return this;
      }
    }
  },
  createRandomBloom: function (x, y) {
    this.createBloom(
      x,
      y,
      Garden.randomInt(
        Garden.options.bloomRadius.min,
        Garden.options.bloomRadius.max
      ),
      Garden.randomrgba(
        Garden.options.color.rmin,
        Garden.options.color.rmax,
        Garden.options.color.gmin,
        Garden.options.color.gmax,
        Garden.options.color.bmin,
        Garden.options.color.bmax,
        Garden.options.color.opacity
      ),
      Garden.randomInt(
        Garden.options.petalCount.min,
        Garden.options.petalCount.max
      )
    );
  },
  createBloom: function (x, y, r, c, pc) {
    new Bloom(new Vector(x, y), r, c, pc, this);
  },
  clear: function () {
    this.blooms = [];
    this.ctx.clearRect(0, 0, this.element.width, this.element.height);
  },
};

Garden.options = {
  petalCount: {
    min: 8,
    max: 15,
  },
  petalStretch: {
    min: 0.1,
    max: 3,
  },
  growFactor: {
    min: 0.1,
    max: 1,
  },
  bloomRadius: {
    min: 8,
    max: 10,
  },
  density: 10,
  growSpeed: 1000 / 60,
  color: {
    rmin: 128,
    rmax: 255,
    gmin: 0,
    gmax: 128,
    bmin: 0,
    bmax: 128,
    opacity: 0.1,
  },
  tanAngle: 60,
};
Garden.random = function (min, max) {
  return Math.random() * (max - min) + min;
};
Garden.randomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
Garden.circle = 2 * Math.PI;
Garden.degrad = function (angle) {
  return (Garden.circle / 360) * angle;
};
Garden.raddeg = function (angle) {
  return (angle / Garden.circle) * 360;
};
Garden.rgba = function (r, g, b, a) {
  return "rgba(" + r + "," + g + "," + b + "," + a + ")";
};
Garden.randomrgba = function (rmin, rmax, gmin, gmax, bmin, bmax, a) {
  var r = Math.round(Garden.random(rmin, rmax));
  var g = Math.round(Garden.random(gmin, gmax));
  var b = Math.round(Garden.random(bmin, bmax));
  var limit = 5;
  if (
    Math.abs(r - g) <= limit &&
    Math.abs(g - b) <= limit &&
    Math.abs(b - r) <= limit
  ) {
    return Garden.rgba(rmin, rmax, gmin, gmax, bmin, bmax, a);
  } else {
    return Garden.rgba(r, g, b, a);
  }
};
