/**
 * 获取dom完整xpath
 * - 通过循环获取父元素稷元素本身的位置进行拼接生成
 * @param dom
 * @returns {string}
 */
function getDomXPath(dom) {
  if (dom.id !== '') {
    return `//*[@id="${dom.id}"]`
  }
  if (dom === document.body) {
    return '/html/body'
  }
  let xpathStr = ''
  let {parentElement} = dom
  while (dom) {
    const {tagName: domTagName} = dom
    const children = parentElement ? Array.from(parentElement.children).filter(({tagName}) => domTagName === tagName) : []
    const {length} = children
    for (let i = 0; i < length && length > 1; i++) {
      if (dom === children[i]) {
        xpathStr = `[${i + 1}]${xpathStr}`
        break
      }
    }
    xpathStr = `/${domTagName.toLowerCase()}${xpathStr}`
    dom = parentElement
    parentElement = dom && dom.parentElement
  }
  return xpathStr
}