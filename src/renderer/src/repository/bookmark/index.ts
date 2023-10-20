import AppDataSource from '../data-source'
import { BookmarkInfo } from '../entity/Bookmark'
const BookmarkRepository = AppDataSource.getRepository(BookmarkInfo)

class BookmarController {
  list() {
    return BookmarkRepository.find()
  }
  add(info) {
    const bk = new BookmarkInfo()
    return BookmarkRepository.save(bk)
  }
  delete(id: number) {
    return BookmarkRepository.delete(id)
  }
}
const BookmarkApi = new BookmarController()
export default BookmarkApi
