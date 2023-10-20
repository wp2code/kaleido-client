import AppDataSource from './data-source'
import { Bookmark } from './entity/Bookmark'
const bookmarkRepository = AppDataSource.getTreeRepository(Bookmark)

export async function save(bookmark: Bookmark) {
  return await bookmarkRepository.save(bookmark)
}
export async function listAll() {
  return await bookmarkRepository.findTrees().then((bookmarks) => {
    deepGetParent(null, bookmarks)
    return bookmarks
  })
}
export async function del(bookmark: Bookmark) {
  const result = await deepDelete(bookmark)
  return result
}

const deepDelete = async (bookmark: Bookmark) => {
  return await bookmarkRepository.delete(bookmark.id).then(async (delRes) => {
    const children = bookmark.children
    if (children && children.length > 0) {
      children.forEach(async (item) => {
        delRes = await deepDelete(item)
      })
    }
    return delRes
  })
}
const deepGetParent = (parentItem: Bookmark, children: Bookmark[]) => {
  if (children && children.length > 0) {
    children.forEach((item) => {
      item.parent = parentItem
      deepGetParent(item, item.children)
    })
  }
}
