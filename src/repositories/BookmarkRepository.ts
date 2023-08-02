import AppDataSource from "./data-source";
import { Bookmark } from "./entity/Bookmark";
const bookmarkRepository = AppDataSource.getTreeRepository(Bookmark);
export async function save(bookmark: Bookmark) {
  await bookmarkRepository.save(bookmark);
}
export async function listAll() {
  return await bookmarkRepository.findTrees();
}
