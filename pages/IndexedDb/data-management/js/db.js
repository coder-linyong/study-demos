/*
* 注意：
*   1.当代码从数据库操作请求到事件循环中时，事务会被关闭，也就是说所有请求必须同步发送，所以每次执行数据库操作时新开一个事物
* */
export default class Db {
  static storeName = 'commodity'
  static indexArr = ['type', 'brand']
  static types = ['家电', '食品酒饮', '家居厨具', '手机', '个护清洁', '医药保健', '数码', '图书文娱',
    '男装', '电脑办公', '运动户外', '鞋靴', '母婴童装', '家居家装', '内衣配饰', '女装', '宠物鲜花',
    '生鲜', '箱包', '钟表珠宝', '玩具乐器', '气摩生活', '美妆护肤', '奢侈品', '计生情趣', '生活旅行',
    '教育培训', '工业品',]

  dbName
  version
  db

  constructor(dbName, version) {
    this.dbName = dbName
    this.version = version
  }

  open() {
    return new Promise((resolve, reject) => {
      const dbRequest = indexedDB.open(this.dbName, this.version)

      dbRequest.onupgradeneeded = ev => {
        const db = ev.target.result
        if (!db.objectStoreNames.contains(Db.storeName)) {
          const commodity = db.createObjectStore(Db.storeName, {
            keyPath: 'id',
            autoIncrement: true
          })
          for (const name of Db.indexArr) {
            commodity.createIndex(name, name, { unique: false })
          }
        }
      }

      dbRequest.onerror = ev => {
        throw ev.target.error
      }

      dbRequest.onsuccess = ev => {
        const db = this.db = ev.target.result

        db.onversionchange = () => {
          db.close()
        }

        resolve(ev.target.result)
      }
    })
  }

  getStore() {
    const transaction = this.db.transaction(Db.storeName, 'readwrite')
    return transaction.objectStore(Db.storeName)
  }

  put(data) {
    Db.indexArr.forEach(name => {
      if (!Object.keys(data)
        .includes(name)) {
        throw new Error(`Missing required property ${name}`)
      }
    })
    return new Promise((resolve, reject) => {
      const store = this.getStore()
      const request = store.put(data)
      request.onsuccess = ev => {
        resolve(true)
      }
      request.onerror = ev => {
        reject(ev.target.error)
      }
    })
  }

  delete(id) {
    if (!id) {
      throw new Error(`Missing required property id`)
    }

    return new Promise((resolve, reject) => {
      const store = this.getStore()
      const request = store.delete(id)
      request.onsuccess = ev => {
        resolve(true)
      }
      request.onerror = ev => {
        console.log(ev)
        reject(ev.target.error)
      }
    })
  }

  getById(id) {
    if (!id) {
      throw new Error(`Missing required property id`)
    }

    return new Promise((resolve, reject) => {
      const store = this.getStore()
      const request = store.get(id)
      request.onsuccess = ev => {
        resolve(ev.target.result)
      }
      request.onerror = ev => {
        reject(ev.target.error)
      }
    })
  }

  query(query) {
    return new Promise((resolve, reject) => {
      const store = this.getStore()
      let request
      if (!query || !(query.type || query.brand)) {
        request = store.getAll()
      } else {
        for (const name of Db.indexArr) {
          if (name in query && query[name]) {
            request = store.index(name)
              .getAll(query[name])
            break
          }
        }
      }

      if (request) {
        request.onsuccess = ev => {
          resolve(ev.target.result || [])
        }
        request.onerror = ev => {
          reject(ev.target.error)
        }
      } else {
        resolve([])
      }
    })
  }

  getEnum(name = 'type') {
    return new Promise((resolve, reject) => {
      const store = this.getStore()
      const request = store.index(name)
        .getAll()
      request.onsuccess = ev => {
        const set=new Set()
        const names=ev.target.result.map(item=>set.add(item[name]))
        resolve(Array.from(set))
      }
      request.onerror = ev => {
        reject(ev.target.error)
      }
    })
  }

  close() {
    const { db } = this
    if (db) {
      db.close()
    } else {
      throw new Error('Database not initialized.')
    }
  }
}
