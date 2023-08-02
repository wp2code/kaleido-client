/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path: string): boolean {
  const isExternal = /^(https?:|http?:|mailto:|tel:)/.test(path);
  return isExternal;
}

/**
 *
 * @param url
 */
export function getAssetsImge(imageName: string): string {
  return new URL(`../assets/images/${imageName}`, import.meta.url).href;
}
