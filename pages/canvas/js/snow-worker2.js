/*
1.绘制基本的雪花（雪花类）
  雪花由方块和多边形组合而成，绘制时通过path闭合路径填充而成，
  注意：不要频繁创建path然后addPath，会导致非常耗内存
2.雪花运动
  雪花数量随机，雪花运动运用正弦/余弦函数，近大远小（大的重量大，下降速度快）
  下降超出屏幕范围删除或者重新设定位置
* */

function randomFloat(min, max) {
  return Math.random() * (max - min) + min
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

class Shape {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
}

/**
 * 多边形类
 */
class Polygon extends Shape {
  constructor(x, y, radius, borderNum = randomInt(4, 10)) {
    super(x, y)
    this.radius = radius
    this.borderNum = borderNum
  }

  draw(radian, path, color = '#fff') {
    const {
      radius,
      borderNum,
      x,
      y
    } = this
    const step = Math.PI * 2 / borderNum
    for (let i = 0; i <= borderNum; i++) {
      const ra = radian + Math.PI + i * step,
        posX = x + radius * Math.cos(ra),
        posY = y + radius * Math.sin(ra)
      path.lineTo(posX, posY)
    }
    path.closePath()
  }
}

/**
 * 方块
 */
class Cube extends Shape {
  constructor(x, y, width, height) {
    super(x, y)
    this.width = width
    this.height = height
  }

  draw(radian, path) {
    const {
      x,
      y,
      width,
      height
    } = this
    const r = height / 2,
      ra1 = -Math.PI / 2 + radian,
      ra2 = Math.PI / 2 + radian,
      x1 = x + Math.cos(ra1) * r,
      y1 = y + Math.sin(ra1) * r,
      x2 = x + Math.cos(ra2) * r,
      y2 = y + Math.sin(ra2) * r
    path.moveTo(x1, y1)
    path.lineTo(x2, y2)
    path.lineTo(x2 + Math.cos(radian) * width, y2 + Math.sin(radian) * width)
    path.lineTo(x1 + Math.cos(radian) * width, y1 + Math.sin(radian) * width)
    path.closePath()
  }
}

class Hammer extends Shape {
  /**
   * 锤形
   * @param x x轴位置
   * @param y y轴位置
   * @param width 长度
   * @param height 宽度
   * @param level 层级
   * @param borderNum 边数
   */
  constructor(x, y, width, height, level = 1, radian = 0, borderNum = randomInt(3, 10)) {
    super(x, y)
    this.width = width
    this.height = height
    this.radian = radian
    const headerRadius = randomFloat(0.1 * width, 0.25 * width)

    const cube = new Cube(x, y, width + 10 - headerRadius, height)
    const shapes = this.shapes = [cube]
    if (Math.random() > 0.5) {
      shapes.push(new Polygon(x + width, y, headerRadius, borderNum))
    }

    const hammers = this.hammers = []
    if (Math.random() > level * 0.3) {
      for (let i = 0; i < randomInt(1, 4); i++) {
        const posX = x + randomFloat(0, width * 0.8),
          radian = randomFloat(-Math.PI / 2, Math.PI / 2),
          w = randomFloat(width * 0.2, width * 0.4),
          h = randomFloat(height * 0.2, height * 0.4),
          hammer = new Hammer(posX, y, w, h, level + 1, radian)
        hammer.posX = posX - x
        hammers.push(hammer)
      }
    }
  }

  draw(radian = randomFloat(-Math.PI / 2, Math.PI / 2), path) {
    const {
      shapes,
      hammers
    } = this
    this.setShapesPos(radian)
    shapes.forEach(shape => {
      shape.draw(radian, path)
    })
    hammers.forEach(hammer => {
      hammer.draw(radian + hammer.radian, path)
      hammer.draw(radian - hammer.radian, path)
    })
  }

  setShapesPos(radian) {
    const {
      x,
      y,
      shapes,
      hammers,
      width
    } = this
    shapes.forEach(shape => {
      if (shape instanceof Polygon) {
        shape.x = x + width * Math.cos(radian)
        shape.y = y + width * Math.sin(radian)
      } else {
        shape.x = x
        shape.y = y
      }
    })
    hammers.forEach(hammer => {
      hammer.x = x + hammer.posX * Math.cos(radian)
      hammer.y = y + hammer.posX * Math.sin(radian)
    })
  }
}

class Snowflake extends Polygon {
  /**
   * 雪花
   * @param x x轴位置
   * @param y y轴位置
   * @param radius 半径
   * @param borderNum 边数量
   */
  constructor(x, y, radius, borderNum = randomInt(3, 8)) {
    super(x, y, radius, borderNum)
    this.rotateRadian = 0
    this.setRandomParams()
    this.path = new Path2D()

    this.hammer = new Hammer(x, y, radius, randomFloat(radius * 0.05, radius * 0.1))
  }

  setRandomParams() {
    const {radius} = this,
      amplitude = this.amplitude = radius * randomFloat(0.1, 0.25),// 振幅
      cycle = this.cycle = 1 / radius / randomFloat(0.5, 2)// 周期
    this.speed = Math.random() * Math.random() * Math.random() * radius * amplitude * cycle
    this.yOffset = randomFloat(0.5, 3)
    this.rotateRadianOffset = randomFloat(-Math.PI / 180, Math.PI / 180) * radius * 0.1
  }

  draw(path, color = '#fff') {
    const {
        hammer,
        rotateRadian,
        borderNum
      } = this,
      step = Math.PI * 2 / borderNum

    for (let i = 0; i < borderNum; i++) {
      hammer.draw(rotateRadian + i * step, path)
    }
  }

  falling(maxWidth, maxHeight) {
    const {
        yOffset,
        amplitude,
        cycle,
        radius,
        hammer,
        rotateRadianOffset,
        speed
      } = this,
      y = this.y += yOffset
    this.x += Math.floor(amplitude * Math.sin(y * cycle + speed))
    this.rotateRadian += rotateRadianOffset

    if (this.y > maxHeight + radius * 2) {
      this.x = randomInt(0, maxWidth)
      this.y = 0
      this.setRandomParams()
    }

    hammer.x = this.x
    hammer.y = this.y
  }

  inScreen(w, h) {
    const {
      x,
      radius,
      y
    } = this
    return x > -radius * 2 && x < w + radius * 2 && y > 0 && y < h + radius * 2
  }
}

let i = 0,
  outCanvas,
  outCtx
const snowflakes = []

function render() {
  const w = outCanvas.width,
    h = outCanvas.height,
    path = new Path2D(),
    {length} = snowflakes
  let j = length - 1
  outCtx.clearRect(0, 0, w, h)
  snowflakes.sort((s1, s2) => s1.radius - s2.radius)
  do {
    const snowflake = snowflakes[j--]
    snowflake.inScreen(w, h) && snowflake.draw(path)
    snowflake.falling(w, h)
  } while (j >= 0)
  outCtx.fill(path)
  if (i++ % 10 === 0 && length < 140) {
    snowflakes.push(new Snowflake(randomInt(0, w), 0, randomInt(3, 30), randomInt(6, 12)))
  }
  postMessage(outCanvas.transferToImageBitmap())
  requestAnimationFrame(render)
}

function init(width, height) {
  outCanvas = new OffscreenCanvas(width, height)
  outCtx = outCanvas.getContext('2d')

  outCanvas.width = width
  outCanvas.height = height
  outCtx.fillStyle = '#fff'
  outCtx.strokeStyle = 'red'

  for (let i = 0; i < 20; i++) {
    const snowflake = new Snowflake(randomInt(0, outCanvas.width), 0, randomInt(3, 30), randomInt(6, 12))
    snowflakes.push(snowflake)
  }

  render()
}

addEventListener('message', ({data: {width, height}}) => {
  init(width, height)
})