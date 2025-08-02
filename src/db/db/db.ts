import mysql, { ResultSetHeader } from 'mysql2/promise'
import { getConfig, getObject, registerObjectCloser, registerObjectFactory } from '../../oman/oman.js'
import { Config } from '../../common/type/config.js'
import { inProduction } from '../../common/util/env2.js'

registerObjectFactory('DB', async () => {
  const config = getConfig()
  const db = DB.from(config)
  await db.connect0()
  await db.createDatabase()
  await db.connect()
  registerObjectCloser(async () => {
    await db.close()
  })
  return db
})

export async function getDatabase() {
  return await getObject('DB') as DB
}

export class DB {

  readonly config: Config
  conn0!: mysql.Connection
  conn!: mysql.Pool

  static from(config: Config) {
    return new DB(config)
  }

  private constructor(config: Config) {
    this.config = config
  }

  // Pool 은 초기화할 때 database 를 넣어줘야 한다.
  // 넣지 않으면 연결이 다중으로 만들어질 때 db 를 못찾는다고 나온다;
  // 근데 아직 db 가 없는 상황에서 database 를 지정하면 오류가 나는 것 같다;

  // conn1 을 별도로 만들어서 디비 생성과 드롭에만 따로 써보기로 한다;

  async connect0() {
    const config = this.config
    this.conn0 = await mysql.createConnection({
      host: config.mysqlServer,
      user: config.mysqlUser,
      password: config.mysqlPassword,
      charset: 'utf8mb4',
      multipleStatements: true,
    })
  }

  async connect() {
    const config = this.config
    this.conn = mysql.createPool({
      host: config.mysqlServer,
      user: config.mysqlUser,
      password: config.mysqlPassword,
      database: config.mysqlDatabase,
      charset: 'utf8mb4',
      multipleStatements: true,
    })
  }

  async createDatabase() {
    await this.conn0.query(
      'create database if not exists ?? character set utf8mb4',
      this.config.mysqlDatabase
    )
  }

  async dropDatabase() {
    if (inProduction()) {
      throw (new Error('only available in development mode'))
    }
    await this.conn0.query(
      'drop database if exists ??',
      this.config.mysqlDatabase
    )
  }

  async close() {
    await this.conn0.end()
    await this.conn.end()
  }

  async query(sql: string, values?: any) {
    const [rows] = await this.conn.query(sql, values);
    return rows as any[]
  }

  async queryOne(sql: string, values?: any) {
    const [rows] = await this.conn.query(sql, values);
    return (rows as any[])[0]
  }

  async update(sql: string, values?: any) {
    const [rows] = await this.conn.query(sql, values);
    return rows as ResultSetHeader
  }

  async getMaxId(table: string): Promise<number> {
    const row = await this.queryOne(
      'select coalesce(max(id), 0) as maxId from ??',
      table
    )
    return row.maxId
  }

  private static indexPattern = /create\s+(?:unique\s+)?index\s+(\w+)\s+on\s+(\w+)/i

  async createIndexIfNotExists(query: string) {
    const match = query.match(DB.indexPattern)
    if (!match) throw new Error('create index pattern not found')
    const table = match[2]
    const index = match[1]
    if (await this.indexExists(table, index)) return
    await this.conn.query(query)
    return this
  }

  async databaseExists(name: string) {
    const [rows] = await this.conn0.query('show databases like ?', name)
    return (rows as any[]).length > 0
  }

  async tableExists(name: string) {
    const [rows] = await this.conn.query('show tables like ?', name)
    return (rows as any[]).length > 0
  }

  async indexExists(table: string, index: string) {
    const q = `
      select * from information_schema.statistics
      where table_schema=database() and table_name=? and index_name=?
    `
    const [rows] = await this.conn.query(q, [table, index])
    return (rows as any[]).length > 0
  }

}
