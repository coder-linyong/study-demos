self.addEventListener('message', async ({ data }) => {
  let sum = 0
  // 创建视图来获取ArrayBuffer中的数据
  const view = new Float32Array(data.buffer)
  for (let i = data.start; i < data.end; i++) {
    sum += +(view[i])
  }
  self.postMessage(sum)
})
self.postMessage('ready')
