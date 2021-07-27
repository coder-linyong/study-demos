/*
* 线程池需要做的事情：
* - 维护一个未执行的任务队列
* - 维护指定数量工作者线程
* - 添加任务到队列
* - 关闭线程池
* */
import TaskWorker from './task-worker.js'

export default class ThreadPool {
  taskQueue = []//任务队列
  workers = []//线程池的工作者线程

  constructor(poolSize, ...workerArgs) {
    this.poolSize = poolSize
    for (let i = 0; i < poolSize; i++) {
      this.workers.push(new TaskWorker(this.addTask.bind(this), ...workerArgs))
    }
  }


  /**
   * 入列任务，基于期约
   * @param msgArgs postMessage函数的参数
   * @returns {Promise<unknown>}
   */
  enqueue(...msgArgs) {
    return new Promise((resolve, reject) => {
      this.taskQueue.push({
        resolve,
        reject,
        msgArgs
      })
      this.addTask()
    })
  }

  /**
   * 添加任务到空闲的工作者线程
   */
  addTask() {
    const {
      workers,
      taskQueue
    } = this
    for (const worker of taskQueue.length ? workers : []) {
      //如果工作者线程可用，就出列任务，然后分发给工作者线程
      if (worker.available) {
        const task = taskQueue.shift()
        worker.dispatch(task)
        break
      }
    }
  }


  close() {
    this.workers.forEach(worker => worker.terminate())
  }
}
