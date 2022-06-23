function currying(fn) {
  const args = []//用于记录每次调用的参数
  //返回已柯里化的函数
  return function curried() {
    if (arguments.length) {
      //如果传了参数，则记录传递参数，并返回已经柯里化的函数
      [].push.apply(args, arguments)
      return curried
    } else {
      //如果没有传递参数，则代表需要求值，将所有参数传递到需要柯里化的函数中执行并返回结果
      return fn.apply(this, args)
    }
  }
}
