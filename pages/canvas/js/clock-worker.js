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
        return Math.ceil(x/step)*step
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
        return Math.ceil(y/step)*step
      }
    }
  }
}

addEventListener('message', ({data: {type, imgData, W, H, step}}) => {
  switch (type) {
    case 'startX':
      postMessage(getStartX(imgData.data, W, H, step))
      break
    case 'endX':
      postMessage(getEndX(imgData.data, W, H, step))
      break
    case 'startY':
      postMessage(getStartY(imgData.data, W, H, step))
      break
    default:
      postMessage(getEndY(imgData.data, W, H, step))
  }
})