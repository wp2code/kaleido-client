import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { BookmarkInfo } from './entity/Bookmark'
// import * as sq from "better-sqlite3"
// import {driver} from "sqlite3"
//BetterSqlite3ConnectionOptions
const AppDataSource = new DataSource({
  type: 'sqlite',
  synchronize: true,
  logging: true,
  logger: 'simple-console',
  database: 'devBox.db',
  entities: [BookmarkInfo],
})
AppDataSource.initialize()
  .then(() => {
    console.log('EEEEEE')
    // here you can start to work with your database
  })
  .catch((error) => console.log(error))
export default AppDataSource
