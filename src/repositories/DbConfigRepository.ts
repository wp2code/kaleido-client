import AppDataSource from './data-source'
import { DbConfig } from './entity/DbConfig'
const dbConfigRepository = AppDataSource.getRepository(DbConfig)
/**
 * @param params
 */
export async function queryList(_params: any) {
  return await dbConfigRepository.find()
}
/**
 *
 * @param dbConfig
 */
export async function save(dbConfig: DbConfig) {
  if (dbConfig.dbName) {
    dbConfig.extend = `{ dbName: ${dbConfig.dbName} }`
  }
  return await dbConfigRepository.save(dbConfig)
}
/**
 *
 * @param id
 */
export async function getById(id: number) {
  return await dbConfigRepository.findOneBy({ id })
}
/**
 *
 * @param id
 * @param dbConfig
 */
export async function update(id: number, dbConfig: DbConfig): Promise<Boolean> {
  if (dbConfig.dbName) {
    dbConfig.extend = `{ dbName: ${dbConfig.dbName} }`
  }
  return await dbConfigRepository.update(id, dbConfig).then((r) => {
    return r != null
  })
}
/**
 *
 * @param id
 */
export async function del(id: number): Promise<Boolean> {
  return await dbConfigRepository.delete(id).then((r) => {
    return r != null
  })
}
