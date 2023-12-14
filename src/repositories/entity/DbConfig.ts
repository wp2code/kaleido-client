import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

export enum DbType {
  MySQL = 'MySQL',
  PostgreSQL = 'PostgreSQL',
  Oracle = 'Oracle',
  TDengine = 'TDengine',
}
export function getDefault(dbType: DbType): DbConfig {
  let dbConfig: DbConfig = null
  switch (dbType) {
    case DbType.MySQL:
      dbConfig = new DbConfig(
        DbType.MySQL,
        'MySQL',
        '@localhost',
        'localhost',
        3306,
        'root'
      )
      break
    case DbType.PostgreSQL:
      dbConfig = new DbConfig(
        DbType.PostgreSQL,
        'PostgreSQL',
        '@localhost',
        'localhost',
        5432,
        'root',
        '',
        'postgres'
      )
      break
    case DbType.Oracle:
      dbConfig = new DbConfig(
        DbType.Oracle,
        'Oracle',
        '@localhost',
        'localhost',
        1521,
        'root'
      )
      break
    case DbType.TDengine:
      dbConfig = new DbConfig(
        DbType.TDengine,
        'TDengine',
        '@localhost',
        'localhost',
        6030,
        'root'
      )
      break
  }
  return dbConfig
}

@Entity()
export class DbConfig {
  constructor(...args: any)
  constructor(type: string, icon?: string)
  constructor(
    type: string,
    icon?: string,
    name?: string,
    url?: string,
    port?: number,
    userName?: string,
    password?: string,
    dbName?: string,
    extend?: string
  ) {
    this.type = type
    this.name = name
    this.url = url
    this.port = port
    this.icon = icon
    this.userName = userName
    this.password = password
    this.dbName = dbName
    this.extend = extend
  }

  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 50, nullable: true })
  icon?: string

  @Column({ type: 'varchar', length: 200 })
  name: string

  @Column('varchar')
  type: string

  @Column('varchar')
  url?: string

  @Column('int', { nullable: true })
  port?: number

  @Column('varchar', { nullable: true })
  userName?: string

  @Column('varchar', { nullable: true })
  password?: string

  @Column('varchar', { nullable: true })
  extend?: string

  dbName?: string
}
