function reduce(arr, callback, initVal) {
  const {length} = arr

  if (!length && !initVal) {
    throw Error('Reduce of empty array with no initial value')
  }

  let i = initVal ? 0 : 1
  initVal = initVal || arr[0]
  while (i++ < length) {
    initVal = callback(initVal, arr[i], i, arr)
  }

  return initVal
}