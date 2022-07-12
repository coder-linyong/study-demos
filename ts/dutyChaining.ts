/**
 * 将多个职责函数串联起来形成职责链，返回一个职责链函数，这些函数有如下要求：
 * - 参数一致
 * - 均返回true/false表示是否完成职责
 * @param {(...args: A) => boolean} fns 职责函数
 * @returns {(...args: A) => (boolean)} 职责链函数
 */
export function dutyChain<A extends Array<any>> (...fns: Array<(...args: A) => boolean>) {
  return function (...args: A) {
    for (const fn of fns) {
      if (fn.apply(this, args)) {
        return true
      }
    }
    return false
  }
}
