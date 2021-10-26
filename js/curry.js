/**
 * 柯里化函数
 * @param func 需要柯里化的函数
 * @param len 限制函数参数个数
 * @param args 函数参数，默认不用传
 * @return {any} 柯里化后的函数
 */
export function curry(func, len = func.length, args = []) {
  return function () {
    const length = arguments.length
    args.push(...arguments)
    if (length < len) {
      return curry(func, len - length, args)
    }
    return func(...args)
  }
}

/**
 * 性能更好写法更优美的柯里化函数
 * @param fn 需要柯里化的函数
 * @return {any} 柯里化后的函数
 */
export const curry3 = fn => {
  const judge = (...args) =>
    args.length === fn.length
      ? fn(...args)
      : (arg) => judge(...args, arg)
  return judge
}
