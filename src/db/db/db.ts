import mysql, { Pool, ResultSetHeader } from 'mysql2/promise'
import { getConfig, registerObjectCloser, registerObjectFactory } from '../../oman/oman.js'
import { Config } from '../../common/type/config.js'
import { inProduction } from '../../common/util/env2.js'

registerObjectFactory('DB', async () => {
  const db = DB.from(getConfig())
  await db.createDatabase()
  registerObjectCloser(async () => {
    await db.close()
  })
  return db
})

export class DB {

  readonly dbName: string
  readonly conn: Pool

  static from(config: Config) {
    return new DB(config)
  }

  private constructor(config: Config) {
    this.dbName = config.mysqlDatabase
    this.conn = mysql.createPool({
      host: config.mysqlServer,
      user: config.mysqlUser,
      password: config.mysqlPassword,
      charset: 'utf8mb4',
      multipleStatements: true,
      // 광역 typeCast 는 안 하기로 한다.
      // JSON 이 JSON 으로 오지 않고 BLOB 으로 온다.
      // 다른 정보가 BLOB 으로 오면 구분할 수가 없다.
      // typeCast: typeCast,
    })
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

  async createDatabase() {
    await this.conn.query(
      `create database if not exists ?? character set utf8mb4`,
      this.dbName,
    )
    await this.changeCurrentDatabase()
    return this
  }

  async changeCurrentDatabase() {
    await this.conn.query('use ??', this.dbName)
  }

  async dropDatabase() {
    if (inProduction()) {
      throw (new Error('only available in development mode'))
    }
    await this.conn.query('drop database if exists ??', this.dbName)
    return this
  }

  async close() {
    await this.conn.end()
  }

  private static indexPattern = /create\s+(?:unique\s+)?index\s+(\w+)\s+on\s+(\w+)/i

  async createIndexIfNotExists(query: string) {
    const match = query.match(DB.indexPattern)
    if (!match) throw new Error('create index pattern not found')
    const table = match[2]
    const index = match[1]
    if (await this.getIndex(table, index)) return
    await this.conn.query(query)
    return this
  }

  async getDatabase(name: string) {
    return this.queryOne('show databases like ?', name)
  }

  async getTable(name: string) {
    return this.queryOne('show tables like ?', name)
  }

  async getIndex(table: string, index: string) {
    const q =
      'select * from information_schema.statistics ' +
      'where table_schema=database() and table_name=? and index_name=?'
    return this.queryOne(q, [table, index])
  }

  async getMaxId(table: string): Promise<number> {
    const r = await this.queryOne('select coalesce(max(id), 0) as maxId from ??', table)
    return r.maxId
  }

}
