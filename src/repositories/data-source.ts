import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { Bookmark, defaultRoot } from './entity/Bookmark'
const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: 'store.db',
  statementCacheSize: 80,
  synchronize: true,
  logging: 'all',
  logger: 'simple-console',
  entities: [Bookmark],
  migrations: [],
  subscribers: [],
})
AppDataSource.initialize()
  .then(async () => {
    console.log('Data Source has been initialized!')
    const bookmarkRepository = AppDataSource.getTreeRepository(Bookmark)
    const count = await bookmarkRepository.count()
    console.log('Bookmark', count)
    if (count <= 0) {
      await bookmarkRepository.save(defaultRoot)
      console.log('init Bookmark root dir')
    }
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err)
  })
export default AppDataSource
