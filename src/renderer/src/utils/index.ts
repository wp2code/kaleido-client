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
