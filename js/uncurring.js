Function.prototype.uncurrying = function () {
  const self = this//保存函数本身
  //返回反柯里化的函数
  return function () {
    //去除this
    const context = [].shift.call(arguments)
    //指定this调用函数
    return self.apply(context, arguments)
  }
}
