import mysql, { Connection, QueryOptions } from 'mysql'
import { Config } from '../../_type/config'
import { inProduction } from '../../_util/env2'
import { ObjMaker, objManGetConfig, objManRegisterCloseHandler } from '../../objman/object-man'

export const serviceObject: ObjMaker = async () => {
  let db = DB.from(objManGetConfig())
  await db.createDatabase()
  objManRegisterCloseHandler(async () => {
    await db.close()
  })
  return db
}

export class DB {

  readonly config: Config
  private readonly conn: Connection

  private constructor(config: Config) {
    this.config = config
    this.conn = mysql.createConnection({
      host: this.config.mysqlServer,
      user: this.config.mysqlUser,
      password: this.config.mysqlPassword,
      charset: 'utf8mb4',
      multipleStatements: true,
      // 광역 typeCast 는 안 하기로 한다.
      // JSON 이 JSON 으로 오지 않고 BLOB 으로 온다.
      // 다른 정보가 BLOB 으로 오면 구분할 수가 없다.
      // typeCast: typeCast,
    })
  }

  static from(config: Config) {
    return new DB(config)
  }

  async createDatabase() {
    await this.query(
      'create database if not exists ?? character set utf8mb4',
      this.config.mysqlDatabase,
    )
    await this.changeCurrentDatabase()
    return this
  }

  async changeCurrentDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.conn.changeUser(
        { database: this.config.mysqlDatabase },
        err => err ? reject(err) : resolve()
      )
    })
  }

  async dropDatabase() {
    if (inProduction()) {
      throw (new Error('only available in development mode'))
    }
    await this.query('drop database if exists ??', this.config.mysqlDatabase)
    return this
  }

  async close(): Promise<void> {
    if (!this.conn) {
      return Promise.resolve()
    }
    return new Promise((resolve, reject) => {
      this.conn.end(
        err => err ? reject(err) : resolve()
      )
    })
  }

  private static indexPattern = /create\s+index\s+(\w+)\s+on\s+(\w+)/i

  async createIndexIfNotExists(query: string) {
    const match = query.match(DB.indexPattern)
    if (!match) throw new Error('create index pattern not found')
    const table = match[2]
    const index = match[1]
    if (await this.findIndex(table, index)) return
    await this.query(query)
    return this
  }

  async findDatabase(name: string) {
    return this.queryOne('show databases like ?', name)
  }

  async findTable(name: string) {
    return this.queryOne('show tables like ?', name)
  }

  async findIndex(table: string, index: string) {
    const q =
      'select * from information_schema.statistics ' +
      'where table_schema=database() and table_name=? and index_name=?'
    return this.queryOne(q, [table, index])
  }

  async getMaxId(table: string): Promise<number> {
    const r = await this.queryOne('select coalesce(max(id), 0) as maxId from ??', table)
    return r.maxId
  }

  query(options: string | QueryOptions, values?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.conn.query(options, values, (err, r) => {
        if (err)
          reject(err)
        else
          resolve(r)
      })
    })
  }

  queryOne(options: string | QueryOptions, values?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.conn.query(options, values, (err, r) => {
        if (err)
          reject(err)
        else
          resolve(r[0])
      })
    })
  }

}
