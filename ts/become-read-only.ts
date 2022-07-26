export function becomeReadOnly<T extends Object> (target: T) {
  if (typeof target === 'object') {
    for (const key in target) {
      typeof target[key] === 'object' && (target[key] = becomeReadOnly(target[key]))
    }
  }
  return new Proxy(target, {
    set (target: T, p: string | symbol, value: any, receiver: any): boolean {
      return Reflect.set(target, p, target[p], receiver)
    }
  })
}

const arr = becomeReadOnly([{a: 1, b: 2, c: 3}])
arr[0].a = 1111
console.log(arr)