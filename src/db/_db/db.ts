import mysql, { Connection, QueryOptions } from 'mysql'
import { Config } from '../../_type/config.js'

export class DB {

  public config: Config
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

  query(options: string | QueryOptions, values?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.conn.query(options, values, (err, r) => {
        if (err) return reject(err)
        resolve(r)
      })
    })
  }

  queryOne(options: string | QueryOptions, values?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.conn.query(options, values, (err, r) => {
        if (err) return reject(err)
        resolve(r[0])
      })
    })
  }

  close(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.conn) return resolve()
      this.conn.end((err) => {
        if (err) reject(err)
        else resolve()
      })
    })
  }

  changeUser(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.conn.changeUser(
        { database: this.config.mysqlDatabase },
        (err) => err ? reject(err) : resolve()
      )
    })
  }

  async createDatabase() {
    await this.query(
      'create database if not exists ?? character set utf8mb4',
      this.config.mysqlDatabase,
    )
    await this.changeUser()
    return this
  }

  async dropDatabase() {
    if (!this.config.dev) throw (new Error('only available in development mode'))
    await this.query('drop database if exists ??', this.config.mysqlDatabase)
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

  private static indexPattern = /create\s+index\s+(\w+)\s+on\s+(\w+)/i

  async createIndexIfNotExists(query: string) {
    const a = query.match(DB.indexPattern)
    if (!a) throw new Error('create index pattern not found')
    const table = a[2]
    const index = a[1]
    if (await this.findIndex(table, index)) return
    await this.query(query)
    return this
  }

  async getMaxId(table: string): Promise<number> {
    const r = await this.queryOne('select coalesce(max(id), 0) as maxId from ??', table)
    return r.maxId
  }

}
