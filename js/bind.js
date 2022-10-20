/*
https://github.com/mqyqingfeng/Blog/issues/12
*/
function bind(context, fn, ...bindArgs) {
  if (typeof fn !== 'function') {
    throw Error('fn is not a function')
  }
  const F = function F() {
  }
  F.prototype = fn.prototype
  const bound = function (...args) {
    // 如果this的原型链中有F，代表是通过new构造的
    return fn.apply(this instanceof F ? this : context || this, [...bindArgs, ...args])
  }
  // bound函数原型设置为中间构造函数F的实例，避免修改返回函数的原型原函数原型也被更改
  bound.prototype = new F()
  return bound
}