/**
 *任务工作者需要做的事情：
 * - 管理自己的状态，即是否处于忙碌状态
 * - 执行分发的任务并返回结果
 */
export default class TaskWorker extends Worker {
  constructor (complete, ...args) {
    super(...args)
    this.complete = complete
    // 初始状态不可用，当线程初始化完成之后才变成可用状态
    this.available = false
    this.onmessage = () => this.setAvailable()
  }

  /**
   * 分发任务，由线程池执行
   * @param resolve 来自Promise
   * @param reject 来自Promise
   * @param msgArgs 发行信息参数
   */
  dispatch ({
    resolve,
    reject,
    msgArgs
  }) {
    this.available = false
    // 接收到来自线程的数据时
    this.onmessage = ({ data }) => {
      this.setAvailable()
      resolve(data)
    }

    this.onerror = (e) => {
      reject(e)
      this.setAvailable()
    }
    this.postMessage(...msgArgs)
  }

  /**
   * 设置为可用状态并请求任务
   */
  setAvailable () {
    this.available = true
    this.complete()
  }
}
