/*
* 处理图片数据的线程
* 像素化方案有好几种，其中两种方案：
*   1.每个方块内颜色取所有像素颜色的均值，但是会有一个问题，容易出现虚化边，看起来没那么清晰
*   2.方块内所有像素点取方块内像素某个像素点的颜色（这里采取的是这种方案，虽然这不是最好的方案）
* */
addEventListener('message', (
  {
    data: {
      imgData,
      imgData: {
        data,
        width,
        height
      },
      size
    }
  }
) => {
  for (let x = 0; x < width; x += size) {
    for (let y = 0; y < height; y += size) {
      const offset = (y * width + x) * 4,
        r = data[offset],
        g = data[offset + 1],
        b = data[offset + 2],
        a = data[offset + 3]

      for (let i = 0; i < size && x + i < width; i++) {
        for (let j = 0; j < size && y + j < height; j++) {
          const start = ((y + j) * width + x + i) * 4
          data[start] = r
          data[start + 1] = g
          data[start + 2] = b
          data[start + 3] = a
        }
      }
    }
  }
  postMessage(imgData)
})