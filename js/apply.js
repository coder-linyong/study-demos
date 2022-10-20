function apply(fn, target, args) {
  // 传入值不对则为空数组
  if (args === undefined || args === null) {
    args = []
  }
  // 如果没有传入this，则使用全局this
  if (target === null || target === undefined) {
    target = window || global
  }

  // 包装成对象，方便设置属性
  target = Object(target)

  // 当前函数设置到目标对象上，目标该函数运行的this就会是目标对象
  const targetFnKey = Symbol('targetFnKey')// Symbol防止属性名重复
  target[targetFnKey] = fn

  // 获取运行结果，并删除函数
  const result = target[targetFnKey](...args)
  delete target[targetFnKey]

  return result
}