export function debounce(fn, wait) {
  let timer
  return function () {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(fn, 1000, ...arguments)
  }
}
