import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { Bookmark } from './entity/Bookmark'
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
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err)
  })
export default AppDataSource
