/*
用promise实现图片批量加载
 */
const urls = [
  'https://th.wallhaven.cc/lg/kx/kx98xd.jpg',
  'https://th.wallhaven.cc/lg/zy/zygeko.jpg',
  'https://th.wallhaven.cc/lg/kx/kx36mq.jpg',
  'https://th.wallhaven.cc/small/o5/o59gvl1.jpg',
  'https://th.wallhaven.cc/lg/m9/m9xyg8.jpg',
  'https://th.wallhaven.cc/small/o5/o59gvl.jpg',
  'https://th.wallhaven.cc/small/28/28p95m.jpg',
  'https://th.wallhaven.cc/small/e7/e7jj6r.jpg',
  'https://th.wallhaven.cc/small/9m/9mjoy1.jpg',
  'https://th.wallhaven.cc/small/j3/j3m8y5.jpg'
]

/**
 * 模拟加载图片，为了效果明显，特地等待一段时间
 * @param url
 * @returns {Promise<unknown>}
 */
function loadImg(url) {
  const promise = new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => setTimeout(() => {
      document.body.appendChild(img)
      console.log(url)
      resolve(url)
    }, 5000 * Math.random())
    img.onerror = reject
    img.src = url
  })
  // 记录url方便删除队列中的Promise
  promise.url = url
  return promise
}

/**
 * 分批加载图片
 * @param urls 图片地址列表
 * @param limit 每次加载多少个，默认全部加载
 * @returns {Promise<Awaited<unknown>[]>|*}
 */
function loadImgLimit(urls, limit = Infinity) {
  if (urls.length < limit) {
    return Promise.all(urls.map(loadImg))
  }
  const promises = urls.splice(0, limit).map(url => loadImg(url))
  return urls.reduce((p, url) =>
      // 利用Promise.race将先加载完的图片Promise从队列中删除，然后再添加新的图片进入队列
      p.then(() => Promise.race(promises))
        .catch(e => console.log(e))
        .then(resolveUrl => {
          const delIndex = promises.findIndex(p => p.url === resolveUrl)
          promises.splice(delIndex, 1)
          promises.push(loadImg(url))
        }),
    Promise.resolve())
}

loadImgLimit(urls, 3)