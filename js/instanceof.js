/**
 * 判断 **R** 的 `prototype` 是否出现在 **L** 的原型链上
 * @param L
 * @param R
 * @returns {boolean}
 */
function instanceofFn (L, R) {
  if (typeof L !== 'object' || typeof R !== 'function') {
    return false
  }
  const rProto = R.prototype
  // 递归获取L的原型并判断
  while (L) {
    const prototype = Object.getPrototypeOf(L)
    if (prototype === rProto) {
      return true
    }
    L = prototype
  }
  return false
}