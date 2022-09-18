/**
 * 压缩查询字符串方法
 * @param str{string} 需要压缩的查询字符串，格式如：foo=1&foo=2&blah=a&blah=b&foo=3
 * @returns {string} 压缩后的字符串，如：foo=1,2,3&blah=a,b
 */
function compress (str) {
  // 用于缓存key对应的value数组
  const keyValues = {}
  // replace方法匹配所有符合正则表达式的值并多次调用，每次调用将匹配到的key-value缓存
  str.replace(compress.reg, (str, key, value) => {
    (keyValues[key] || (keyValues[key] = [])).push(value)
    return ''
  })
  // 将key-value数组拼接成压缩后的字符串
  const result = []
  for (const key in keyValues) {
    result.push(`${key}=${keyValues[key].join(',')}`)
  }
  return result.join('&')
}

// 整个函数的关键是这个正则表达式，通过这个正则表达式匹配`key=value`的形式，其中key是一个捕获组，value是一个捕获组
// 在replace的替换函数中就能通过捕获组获取中每次捕获的key和value
compress.reg = /([^=&]+)=([^&]*)/g

/**
 * 将短横线转换成大驼峰
 * @param str{string} 短横线字符串，如：'border-bottom-width'
 * @returns {string} 转换后的字符串，如：borderBottomWidth
 */
function toHump (str) {
  // 当有捕获组时，第二个参数就会是捕获组，详情看https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/replace#%E6%8C%87%E5%AE%9A%E4%B8%80%E4%B8%AA%E5%87%BD%E6%95%B0%E4%BD%9C%E4%B8%BA%E5%8F%82%E6%95%B0
  return str.replace(toHump.reg, (str, word) => word.toUpperCase())
}

toHump.reg = /-(\w)/g

/**
 * 将自闭合标签转换成成对标签
 * @param html{string} 自闭合标签字符串
 * @returns {*} 成对标签字符串
 */
function convert (html) {
  const { reg, tags } = convert
  return html.replace(reg, (str, front, tag) => {
    return tags.test(tag) ? str : `${front}></${tag}>`
  })
}

convert.tags = /^(area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i
convert.reg = /(<(\w+)[^>]*?)\/>/g