/**
 * 返回一个指定选择器组匹配的元素，document.querySelector()的简化版
 * @param selectors 一组选择器
 * @returns {*} 第一个符合选择器的元素
 */
export function $q (selectors) {
  return document.querySelector(selectors)
}

/**
 *返回所有指定选择器组匹配的元素，document.querySelectorAll()的简化版
 * @param selectors 一组选择器
 * @returns {NodeListOf<*>} 所有符合选择器的元素
 */
export function $qa (selectors) {
  return document.querySelectorAll(selectors)
}
