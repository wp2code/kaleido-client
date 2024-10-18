export interface DataSource {
  id?: string
  name?: string
  type: string
  icon?: string
  url: string
  port: number
  userName: string
  password: string
  dbName?: string
  extend?: string
  connectionId?: string
  updateTime?: string
  createTime?: string
}

export interface Schema {
  schemaName: string
  tableList?: Table[]
}
export interface Table {
  tableName: string
  dataBaseName?: string
  schemaName?: string
  comment?: string
}

export interface Database {
  name: string
  supportSchema: boolean
  schemaList?: Schema[]
  tableList?: Table[]
}
export interface DataSourceMeta {
  connectionId: string
  dataSource?: DataSource
  dateBaseList?: Database[]
}

export interface DataSourceQuery {
  //TODO
}

export enum DbType {
  MySQL = 'MySQL',
  PostgreSQL = 'PostgreSQL',
  Oracle = 'Oracle',
  TDengine = 'TDengine',
}
export class SelectDataTableData {
  dataSource: DataSource
  table: Table
  constructor(dataSource: DataSource, table: Table) {
    this.dataSource = dataSource
    this.table = table
  }
}

export function initDataSource(): DataSource[] {
  return [
    getDefault(DbType.MySQL),
    getDefault(DbType.PostgreSQL),
    // getDefault(DbType.Oracle),
    // getDefault(DbType.TDengine),
  ]
}

export function getDefault(dbType: DbType): DataSource {
  let dbConfig: DataSource = null
  switch (dbType) {
    case DbType.MySQL:
      dbConfig = {
        type: DbType.MySQL,
        icon: 'MySQL',
        name: '@localhost',
        url: 'localhost',
        port: 3306,
        userName: 'root',
      } as DataSource
      break
    case DbType.PostgreSQL:
      dbConfig = {
        type: DbType.PostgreSQL,
        icon: 'PostgreSQL',
        name: '@localhost',
        url: 'localhost',
        port: 5432,
        userName: 'postgres',
        dbName: 'postgres',
      } as DataSource
      break
    case DbType.Oracle:
      dbConfig = {
        type: DbType.Oracle,
        icon: 'Oracle',
        name: '@localhost',
        url: 'localhost',
        port: 1521,
        userName: 'root',
      } as DataSource
      break
    case DbType.TDengine:
      dbConfig = {
        type: DbType.TDengine,
        icon: 'TDengine',
        name: '@localhost',
        url: 'localhost',
        port: 6030,
        userName: 'root',
      } as DataSource
      break
  }
  return dbConfig
}

export class ConnectionData {
  connectionId: string
  type: string
  databases: SimpleDatabase[]
}

export class SimpleDatabase {
  dataBaseName: string
  dataBaseComment?: string
}

export class DBTableParam {
  connectionId: string
  tableName: string
  dataBaseName?: string
  schemaName?: string
  static mack(
    connectionId: string,
    tableName: string,
    dataBaseName?: string,
    schemaName?: string
  ): DBTableParam {
    const param = new DBTableParam()
    param.connectionId = connectionId
    param.tableName = tableName
    param.dataBaseName = dataBaseName
    param.schemaName = schemaName
    return param
  }
}

export class TableFieldColumnParam extends DBTableParam {
  static mack(
    connectionId: string,
    tableName: string,
    dataBaseName?: string,
    schemaName?: string
  ): TableFieldColumnParam {
    return super.mack(
      connectionId,
      tableName,
      dataBaseName,
      schemaName
    ) as TableFieldColumnParam
  }
}

export class TableDDLParam extends DBTableParam {
  static mack(
    connectionId: string,
    tableName: string,
    dataBaseName?: string,
    schemaName?: string
  ): TableDDLParam {
    return super.mack(
      connectionId,
      tableName,
      dataBaseName,
      schemaName
    ) as TableDDLParam
  }
}
