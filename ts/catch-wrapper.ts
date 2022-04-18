/**
 * 一个错误包裹器，包裹中的函数全部会在包裹器内被捕获
 */
type CatchWrappedFunction<Args extends any[], F extends (...args: Args) => any> = (this: ThisParameterType<F>, ...args: Args & Parameters<F>) => ReturnType<F>

export function catchWrapper<Args extends any[], F extends (...args: Args) => any> (fun: F, catchHandler?: (e: Error) => void): CatchWrappedFunction<Args, F> {
  return function (this: ThisParameterType<F>, ...args: Args) {
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