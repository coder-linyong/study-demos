
/*
  实现思路：
    1.获取本地时间，然后绘制到canvas上（文字一定要有颜色）
    2.利用getImageData获取文字的像素坐标（每四个数据为一个坐标的颜色值，第四个数据不为0时为文字的一个像素），
      为了点位看起来不那么密集，可以设定每隔一定距离取一个像素点
      小技巧：遍历数据时由y及x会将图像变化达到最小
    3.生成最大像素点点数（88:88:88所需要的像素点数比较多）
    4.初始渲染时将各粒子点位打断，然后获取时间文本点位，设置点位运动终点为像素点位
    5.每一帧动画由开始点位往终点点位移动一段距离

   优化：
    1.getImageData()方法非常耗时，在较大屏幕中如果取全屏像素数据极其耗时，
      可获取文字绘制区域，只获取和操作那个区域的像素数据要比较省资源。
 */

function getStartX(imgData, W, H, step) {
  for (let x = 0; x < W; x++) {
    for (let y = 0; y < H; y++) {
      if (imgData[(y * W + x) * 4] > 0) {
        return x - x % step
      }
    }
  }
}

function getEndX(imgData, W, H, step) {
  for (let x = W - 1; x >= 0; x--) {
    for (let y = 0; y < H; y++) {
      if (imgData[(y * W + x) * 4] > 0) {
        return Math.ceil(x / step) * step
      }
    }
  }
}

function getStartY(imgData, W, H, step) {
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (imgData[(y * W + x) * 4] > 0) {
        return y - y % step
      }
    }
  }
}

function getEndY(imgData, W, H, step) {
  for (let y = H - 1; y >= 0; y--) {
    for (let x = 0; x < W; x++) {
      if (imgData[(y * W + x) * 4] > 0) {
        return Math.ceil(y / step) * step
      }
    }
  }
}

Array.prototype.shuffle = function () {
  const arr = this
  let i = arr.length - 1
  do {
    const n = randomInt(0, arr.length - 1),
      tem = arr[n]
    arr[n] = arr[i]
    arr[i--] = tem
  } while (i >= 0)
  return arr
}

function randomFloat(min, max) {
  return Math.random() * (max - min) + min
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

//生成亮色
function generateColor() {
  const n1 = randomInt(150, 250),
    n2 = randomInt(100, 250),
    n3 = randomInt(0, 50),
    colorArr = [n1, n2, n3]
  colorArr.shuffle()
  return `rgba(${colorArr[0]},${colorArr[1]},${colorArr[2]},0.8)`
}

class Particle {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.color = generateColor()
    this.size = randomFloat(7, 15)
    this.setStartPos(x, y)
  }

  get speedX() {
    return (this.startX - this.x) / 10
  }

  get speedY() {
    return (this.startY - this.y) / 10
  }

  setStartPos(x, y) {
    const radian = randomFloat(0, 2 * PI),
      offset = randomInt(W / 2, H / 2)
    this.startX = x + Math.cos(radian) * offset
    this.startY = y + Math.sin(radian) * offset
    this.x = this.startX
    this.y = this.startY
  }

  move() {
    const {
      x,
      y,
      startX,
      startY,
      speedX,
      speedY
    } = this
    if (startX !== x || startY !== y) {
      this.startY = Math.floor(startY) === y ? y : startY - speedY
      this.startX = Math.floor(startX) === x ? x : startX - speedX
    }
  }

  static getOffScreenPos() {
    const radius = Math.sqrt(W ** 2 + H ** 2),
      radian = randomFloat(-PI / 4, PI / 4),
      x = W + Math.cos(radian) * radius,
      y = H + Math.sin(radian) * radius
    return {
      x,
      y
    }
  }
}

const {PI} = Math,
  step = 15,
  particleNum = 500,
  particles = []
let START_X,//取数据区域x轴开始位置
  END_X,//取数据区域x轴结束位置
  START_Y,//取数据区域Y轴开始位置
  END_Y,//取数据区域Y轴结束位置
  selectWidth,//取数据区域宽度
  selectHeight,//取数据区域高度
  W,
  H,
  canvas,
  ctx

/**
 * 根据ImageData获取字的像素坐标，每隔15个像素取一个
 * @returns {[]} 返回{x,y}格式的坐标对象
 */
function getTextPosArr() {
  const date = new Date(),
    posArr = []
  let hour = date.getHours(),
    minutes = date.getMinutes(),
    seconds = date.getSeconds(),
    imgData
  hour = hour > 9 ? hour : `0${hour}`
  minutes = minutes > 9 ? minutes : `0${minutes}`
  seconds = seconds > 9 ? seconds : `0${seconds}`

  ctx.clearRect(0, 0, W, H)
  ctx.fillText(`${hour}:${minutes}:${seconds}`, W / 2, H / 2)

  imgData = ctx.getImageData(START_X, START_Y, selectWidth, selectHeight).data
  for (let j = 0; j < selectWidth; j += step) {
    for (let i = 0; i < selectHeight; i += step) {
      if (imgData[(i * selectWidth + j) * 4] > 0) {
        posArr.push({
          x: START_X + j,
          y: START_Y + i
        })
      }
    }
  }
  ctx.clearRect(0, 0, W, H)
  return posArr
}

function render() {
  const posArr = getTextPosArr()
  let i = particles.length - 1
  do {
    const particle = particles[i]
    let pos = posArr[i--] ?? Particle.getOffScreenPos()
    particle.x = pos.x
    particle.y = pos.y
  } while (i >= 0)
  posArr.forEach((pos, i) => {
    particles[i].x = pos.x
    particles[i].y = pos.y
  })
  ctx.clearRect(0,0,W,H)
  for (const particle of particles) {
    const {startX, startY, x, y} = particle
    ctx.beginPath()
    ctx.arc(startX, startY, particle.size, 0, 2 * PI)
    ctx.fillStyle = particle.color
    ctx.fill()
    ctx.closePath()
    if (startX !== x || startY !== y) {
      particle.move()
    }
  }
  const imageBitmap=canvas.transferToImageBitmap()
  postMessage(imageBitmap,[imageBitmap])
  requestAnimationFrame(render)
}

function init() {
  ctx.fillStyle = 'red'
  ctx.font = '300px Avenir'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('88:88:88', W / 2, H / 2)

  const imgData = ctx.getImageData(0, 0, W, H).data
  ctx.clearRect(0, 0, W, H)
  //利用线程扫描绘制区域的开始结束x/y轴位置，后续取像素数据和遍历数据根据这些位置，能够有效减少去像素数据和遍历的时间
  START_X = getStartX(imgData, W, H, step)
  END_X = getEndX(imgData, W, H, step)
  START_Y = getStartY(imgData, W, H, step)
  END_Y = getEndY(imgData, W, H, step)

  selectWidth = END_X - START_X
  selectHeight = END_Y - START_Y

  const posArr = getTextPosArr()
  let i = 0
  do {
    const pos = posArr[i++] ?? Particle.getOffScreenPos()
    particles.push(new Particle(pos.x, pos.y))
  } while (i < particleNum)
  ctx.globalCompositeOperation = 'lighten'

  render()
}

addEventListener('message', ({data: {clientWidth, clientHeight}}) => {
  W = clientWidth
  H = clientHeight
  if (canvas) {
    canvas.width=W
    canvas.height=H
  }else {
    canvas = new OffscreenCanvas(W, H);
    ctx = canvas.getContext('2d')
  }

  init()
})