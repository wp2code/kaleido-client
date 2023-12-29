/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path: string): boolean {
  const isExternal = /^(https?:|http?:|mailto:|tel:)/.test(path)
  return isExternal
}

/**
 *
 * @param url
 */
export function getAssetsImge(imageName: string): string {
  return new URL(`../assets/images/${imageName}`, import.meta.url).href
}
/**
 *
 * @param param0
 */
export function deepClone(obj, target): any {
  target = target || {}
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (typeof obj[key] === 'object') {
        target[key] = deepClone(obj[key], target)
      } else {
        target[key] = obj[key]
      }
    }
  }
  return target
}
/**
 *
 * @param urlStr
 */
export function isValidHttpUrl(urlStr: any): Boolean {
  let url
  try {
    url = new URL(urlStr)
  } catch (_) {
    return false
  }
  return url.protocol === 'http:' || url.protocol === 'https:'
}
/**
 *
 * @param val
 */
export function isNumer(val: string): boolean {
  let re = new RegExp('^[1-9][0-9]*$')
  return re.test(val)
}

export function groupArr(
  list: Array<any>,
  field: string,
  groupNameKey?: string
) {
  let fieldList: Set<string> = new Set(),
    att = []
  list.map((e) => {
    fieldList.add(e[field])
  })
  for (let item of fieldList) {
    let arr = list.filter((e) => {
      return e[field] == item
    })
    att.push({
      [groupNameKey]: item,
      arr,
    })
  }
  return att
}
