/*
1.绘制基本的雪花（雪花类）
2.雪花运动
  雪花数量随机，雪花运动运用正弦/余弦函数，近大远小（大的重量大，下降速度快）
  下降超出屏幕范围删除或者重新设定位置
* */

function randomFloat (min, max) {
  return Math.random() * (max - min) + min
}

function randomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

class Shape {
  constructor (x, y) {
    this.x = x
    this.y = y
  }

  draw () {

  }
}

/**
 * 多边形类，有一角始终垂直向下
 */
class Polygon extends Shape {
  constructor (x, y, radius, borderNum = randomInt(4, 10)) {
    super(x, y)
    this.radius = radius
    this.borderNum = borderNum
  }

  draw (ctx, color = '#fff') {
    const {
      radius,
      borderNum
    } = this
    const step = Math.PI * 2 / borderNum
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate(Math.PI)
    ctx.beginPath()
    for (let i = 0; i < Math.PI * 2; i += step) {
      ctx.lineTo(radius * Math.cos(i), radius * Math.sin(i))
    }
    ctx.closePath()
    ctx.fill()
    ctx.restore()
  }
}

/**
 * 方块
 */
class Cube extends Shape {
  constructor (x, y, width, height) {
    super(x, y)
    this.width = width
    this.height = height
  }

  draw (ctx) {
    const {
      width,
      height
    } = this
    ctx.fillRect(0, -height / 2, width, height)
  }
}

/**
 * 锤形
 */
class Hammer extends Shape {
  constructor (x, y, width, height, level = 1, radian = randomFloat(-Math.PI / 2, Math.PI / 2), borderNum = randomInt(3, 12)) {
    super(x, y)
    this.radian = radian
    this.width = width
    this.height = height
    this.borderNum = borderNum
    const headerRadius = randomFloat(0.1 * width, 0.25 * width)

    const cube = new Cube(x, y, width + 10 - headerRadius, height)
    const shapes = this.shapes = [cube]
    if (Math.random() > 0.5) {
      shapes.push(new Polygon(width, 0, headerRadius, borderNum))
    }

    const hammers = this.hammers = []
    if (Math.random() > level * 0.3) {
      for (let i = 0; i < randomInt(2, 7); i++) {
        const radian = randomFloat(-Math.PI / 2, Math.PI / 2)
        const borderNum = randomInt(4, 12)
        const x = randomFloat(0, width * 0.7)
        const w = randomFloat(width * 0.2, width * 0.4)
        const h = randomFloat(height * 0.2, height * 0.4)
        hammers.push(new Hammer(x, 0, w, h, level + 1, radian, borderNum))
      }
    }
  }

  draw (ctx) {
    const {
      x,
      y,
      radian,
      shapes,
      hammers
    } = this
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(radian)
    shapes.forEach(shape => shape.draw(ctx))
    hammers.forEach(shape => {
      shape.draw(ctx)
      shape.reverseDraw(ctx)
    })
    ctx.restore()
  }

  reverseDraw (ctx) {
    this.radian = -this.radian
    this.draw(ctx)
  }
}

class Snowflake extends Polygon {
  constructor (x, y, radius, borderNum = randomInt(4, 10)) {
    super(x, y, radius, borderNum)
    this.rotateRadian = 0
    this.setRandomParams()

    this.hammer = new Hammer(0, 0, radius, randomFloat(radius * 0.05, radius * 0.1))
  }

  setRandomParams () {
    const { radius } = this
    const amplitude = this.amplitude = radius * randomFloat(0.08, 0.15)// 振幅
    const cycle = this.cycle = 1 / radius / randomFloat(0.2, 1)// 周期
    this.speed = Math.random() * Math.random() * Math.random() * radius * amplitude * cycle
    this.yOffset = randomFloat(0, 2)
    this.rotateRadianOffset = randomFloat(-Math.PI / 180, Math.PI / 180) * radius * 0.1
  }

  draw (ctx, color = '#fff') {
    const {
      x,
      y,
      hammer,
      rotateRadian,
      borderNum
    } = this
    const step = Math.PI * 2 / borderNum
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(rotateRadian)

    for (let i = 0; i < borderNum; i++) {
      ctx.rotate(step)
      hammer.draw(ctx)
    }
    ctx.restore()
  }

  falling (maxWidth, maxHeight) {
    const {
      yOffset,
      amplitude,
      cycle,
      radius,
      rotateRadianOffset,
      speed
    } = this
    const y = this.y += yOffset
    this.x += amplitude * Math.sin(y * cycle + speed)
    this.rotateRadian += rotateRadianOffset
    if (this.y > maxHeight + radius * 2) {
      this.x = randomInt(0, maxWidth)
      this.y = 0
      this.setRandomParams()
    }
  }

  inScreen (w, h) {
    const {
      x,
      radius,
      y
    } = this
    return x > -radius * 2 && x < w + radius * 2 && y > 0 && y < h + radius * 2
  }
}

let i = 0
const snowflakes = []
let outCanvas
let outCtx

function init (width, height) {
  outCanvas = new OffscreenCanvas(width, height)
  outCtx = outCanvas.getContext('2d')

  outCanvas.width = width
  outCanvas.height = height
  outCtx.fillStyle = '#fff'

  for (let i = 0; i < 20; i++) {
    const snowflake = new Snowflake(randomInt(0, outCanvas.width), 0, randomInt(3, 30), randomInt(6, 12))
    snowflakes.push(snowflake)
  }

  render()
}

function render () {
  const w = outCanvas.width
  const h = outCanvas.height
  outCtx.clearRect(0, 0, w, h)
  snowflakes.sort((s1, s2) => s1.radius - s2.radius)
  for (let j = 0; j < snowflakes.length; j++) {
    const snowflake = snowflakes[j]
    snowflake.inScreen(w, h) && snowflake.draw(outCtx)
    snowflake.falling(w, h)
  }
  if (i++ % 10 === 0 && snowflakes.length < 140) {
    const snowflake = new Snowflake(randomInt(0, w), 0, randomInt(3, 30), randomInt(6, 12))
    snowflakes.push(snowflake)
  }
  self.postMessage({
    type: 'frame',
    data: {
      imageBitmap: outCanvas.transferToImageBitmap()
    }
  })
  requestAnimationFrame(render)
}

self.addEventListener('message', e => {
  const data = e.data
  if (data.type === 'init') {
    init(data.data.width, data.data.height)
  }
})
