import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { Bookmark } from './entity/Bookmark'
import { DbConfig } from './entity/DbConfig'
const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: 'store.db',
  statementCacheSize: 80,
  synchronize: true,
  logging: 'all',
  logger: 'simple-console',
  entities: [Bookmark, DbConfig],
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
