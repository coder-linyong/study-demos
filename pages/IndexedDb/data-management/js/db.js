export default class Db {
  static storeName = 'commodity'
  static indexArr = ['type', 'brand']
  static types=['家电','食品酒饮','家居厨具','手机','个护清洁','医药保健','数码','图书文娱',
    '男装','电脑办公','运动户外','鞋靴','母婴童装','家居家装','内衣配饰','女装','宠物鲜花',
    '生鲜','箱包','钟表珠宝','玩具乐器','气摩生活','美妆护肤','奢侈品','计生情趣','生活旅行',
    '教育培训','工业品',]

  dbName
  version
  db
  transaction
  store

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

        const transaction = this.transaction = db.transaction(Db.storeName, 'readwrite')
        this.store = transaction.objectStore(Db.storeName)

        resolve(ev.target.result)
      }
    })
  }

  put(data) {
    Db.indexArr.forEach(name => {
      if (!Object.keys(data)
        .includes(name)) {
        throw new Error(`Missing required property ${name}`)
      }
    })
    return new Promise((resolve, reject) => {
      const { store } = this
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
      const { store } = this
      const request = store.delete(id)
      request.onsuccess = ev => {
        resolve(true)
      }
      request.onerror = ev => {
        reject(ev.target.error)
      }
    })
  }

  getById(id) {
    if (!id) {
      throw new Error(`Missing required property id`)
    }

    return new Promise((resolve, reject) => {
      const { store } = this
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
      const { store } = this
      let request
      if (!query) {
        request = store.getAll()
      } else {
        for (const name of Db.indexArr) {
          if (name in query) {
            request = store.index(name)
              .getAll()
            break
          }
        }
      }
      if (request) {
        request.onsuccess = ev => {
          resolve(ev.target.result)
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
      const { store } = this
      const request = store.index(name)
        .getAll()
      request.onsuccess = ev => {
        resolve(ev.target.result)
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
