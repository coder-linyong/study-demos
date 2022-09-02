/**
 * 一个错误包裹器（无this版本），包裹中的函数全部会在包裹器内被捕获
 */

/**
 * 函数的错误包裹器，如果发生错误，会在包裹器内部捕获；可指定捕获处理函数
 * @param fun 需要捕获的函数
 * @param catchHandler 捕获处理函数
 */
const catchWrapper = <A extends Array<any>, R> (fun: (...args: A) => R, catchHandler?: (e: Error) => void) => {
  return function (...args: A): R {
    try {
      return fun(...args)
    } catch (e) {
      if (catchHandler) {
        catchHandler(e)
      } else {
        console.log('❗[user action collector]: an error occurred！！！')
        console.error(e)
      }
    }
  }
}

/**
 * 函数的错误包裹器，如果发生错误，会在包裹器内部捕获；可指定捕获处理函数
 * @param fun 需要捕获的函数
 * @param catchHandler 捕获处理函数
 */
export function catchAsyncWrapper<A extends Array<any>, R> (fun: (...args: A) => Promise<R>, catchHandler?: (e: Error) => void, finallyHandler?: () => void) {
  return function (...args: A): Promise<R> {
    const promise = fun(...args)
    promise
      .catch(catchHandler || console.error)
      .finally(finallyHandler)
    return promise
  }
}


export type AnyFunction = (...args: any[]) => any;

/**
 * 函数的错误包裹器（this版本），如果发生错误，会在包裹器内部捕获；可指定捕获处理函数
 * @param {F} fun
 * @param {(e: Error) => void} catchHandler需要捕获的函数
 * @returns {(...args: Parameters<F>) => ReturnType<F>}捕获处理函数
 */
function catchWrapperHasThis<F extends AnyFunction> (fun: F, catchHandler?: (e: Error) => void): ((...args: Parameters<F>) => ReturnType<F>) {
  return function (this: ThisParameterType<F>, ...args: Parameters<F>) {
    try {
      return fun.apply(this, args)
    } catch (e) {
      if (catchHandler) {
        catchHandler(e)
      } else {
        console.log('❗[user action collector]: an error occurred！！！')
        console.error(e)
      }
    }
  }
}