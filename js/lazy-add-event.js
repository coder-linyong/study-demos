let addEvent = function (elem, type, handler) {
  //第一次执行时会先进行判断，然后将要执行的函数绑定到addEvent指针
  if (window.addEventListener) {
    //第二次及以后的调用都是这个新函数
    addEvent = function (elem, type, handler) {
      elem.addEventListener(type, handler, false)
    }
  } else if (window.attachEvent) {
    addEvent = function (elem, type, handler) {
      elem.attachEvent('on' + type, handler)
    }
  }
  addEvent(elem, type, handler)
}
