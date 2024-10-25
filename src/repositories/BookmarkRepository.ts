// import AppDataSource from './data-source'
// import { Bookmark } from './entity/Bookmark'
// const bookmarkRepository = AppDataSource.getRepository(Bookmark)
// /**
//  *
//  * @param bookmark
//  */
// export async function save(bookmark: Bookmark): Promise<Bookmark> {
//   return await bookmarkRepository.save(bookmark)
// }
// /**
//  *
//  * @param _param
//  */
// export async function queryList(_param: any) {
//   return await bookmarkRepository
//     .createQueryBuilder('bk')
//     .addCommonTableExpression(
//       `SELECT id FROM bookmark WHERE type = 1 UNION ALL SELECT id FROM bookmark WHERE type = 0 AND (parentId = 0 or parentId is null)`,
//       'bk_tp'
//     )
//     .where(`bk.id in (SELECT "id" FROM 'bk_tp')`)
//     .getMany()
//     .then(async (bookmarks) => {
//       for (const v of bookmarks) {
//         v.subList = await getSubList(v.id)
//       }
//       return bookmarks
//     })
// }
// /**
//  *
//  * @param id
//  */
// export async function getSubList(id: number): Promise<Bookmark[]> {
//   return await bookmarkRepository
//     .createQueryBuilder('bk')
//     .where('bk.parentId=:id', { id })
//     .getMany()
//     .then((res) => {
//       return res
//     })
// }
// /**
//  *
//  * @param name
//  */
// export async function getCatalogList(name: string) {
//   return await bookmarkRepository.findBy({ type: 1, label: name })
// }
// /**
//  *
//  * @param id
//  */
// export async function del(id: number, subList: Bookmark[]): Promise<Object> {
//   return await bookmarkRepository.delete(id).then(async (r) => {
//     if (subList) {
//       for (const sub of subList) {
//         await updateBy(sub.id, { parentId: 0 })
//         sub.parentId = 0
//       }
//     }
//     return { success: r !== null, subList }
//   })
// }
// /**
//  *
//  * @param id
//  * @param obj
//  */
// export async function updateBy(id: number, setOptions: {}) {
//   return await bookmarkRepository
//     .createQueryBuilder()
//     .update(Bookmark)
//     .set(setOptions)
//     .where('id=:id', { id })
//     .printSql()
//     .execute()
// }
// /**
//  *
//  * @param id
//  * @param bookmark
//  */
// export async function update(id: number, bookmark: Bookmark): Promise<Boolean> {
//   return await bookmarkRepository.update(id, bookmark).then((r) => {
//     return r != null
//   })
// }
