import mysql, { Connection, Query, QueryOptions } from 'mysql'
import { Config } from '../../config/config.js'

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

  query(query: Query): Promise<any>;
  query(options: string | QueryOptions): Promise<any>;
  query(options: string | QueryOptions, values: any): Promise<any>;
  query(options: any, values?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.conn.query(options, values, (err, r) => {
        if (err) return reject(err)
        resolve(r)
      })
    })
  }

  // 어떨 때는 결과가 어레이이고 어떨 때는 단일 오브젝티인지 헷갈린다.
  // 쓰지 않기로 한다.
  //
  // queryOne(query: Query): Promise<any>;
  // queryOne(options: string | QueryOptions): Promise<any>;
  // queryOne(options: string | QueryOptions, values: any): Promise<any>;
  // queryOne(options: any, values?: any): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     this.conn.query(options, values, (err, r) => {
  //       if (err) return reject(err)
  //       resolve(r[0])
  //     })
  //   })
  // }

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

  async selectDatabase(name: string) {
    return this.query('show databases like ?', name)
  }

  async databaseExists(name: string) {
    const r = await this.selectDatabase(name)
    return r.length > 0
  }

  async selectTable(name: string) {
    return this.query('show tables like ?', name)
  }

  async tableExists(name: string) {
    const r = await this.selectTable(name)
    return r.length > 0
  }

  async selectIndex(table: string, index: string) {
    const q =
      'select * from information_schema.statistics ' +
      'where table_schema=database() and table_name=? and index_name=?'
    return this.query(q, [table, index])
  }

  async indexExists(table: string, index: string) {
    const r = await this.selectIndex(table, index)
    return r.length > 0
  }

  private static indexPattern = /create\s+index\s+(\w+)\s+on\s+(\w+)/i

  async createIndexIfNotExists(query: string) {
    const a = query.match(DB.indexPattern)
    if (!a) throw new Error('create index pattern not found')
    const table = a[2]
    const index = a[1]
    if (await this.indexExists(table, index)) return
    await this.query(query)
    return this
  }

  async getMaxId(table: string): Promise<number> {
    const r = await this.query('select coalesce(max(id), 0) as maxId from ??', table)
    return r[0].maxId
  }

  async insertObjects(table: string, objs: Object[]) {
    for (const obj of objs) {
      await this.query('insert into ' + table + ' set ?', obj)
    }
  }

}
