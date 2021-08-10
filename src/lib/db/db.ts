import mysql, { Connection, Query, queryCallback, QueryOptions } from 'mysql'
import { Config } from '../../app/config/config.js'
import { Done } from '../base/async2.js'

export class DB {

  private config: Config
  private readonly conn: Connection
  public droppable

  constructor(config: Config) {
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
    this.droppable = this.config.dev
  }

  query(query: Query): Promise<any>;
  query(options: string | QueryOptions, callback?: queryCallback): Promise<any>;
  query(options: string | QueryOptions, values: any, callback?: queryCallback): Promise<any>;
  query(options: any, values?: any, callback?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.conn.query(
        options, values,
        (err, r) => err ? reject(err) : resolve(r)
      )
    })
  }

  close(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.conn) return resolve()
      this.conn.end(
        (err) => err ? reject(err) : resolve()
      )
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
  }

  async dropDatabase() {
    if (!this.droppable) throw (new Error('can not drop in production mode.'))
    await this.query('drop database if exists ??', this.config.mysqlDatabase)
  }

  async findDatabase(name: string) {
    return this.query('show databases like ?', name)
  }

  async findTable(name: string) {
    return this.query('show tables like ?', name)
  }

  async findIndex(table: string, index: string) {
    const q =
      'select * from information_schema.statistics ' +
      'where table_schema=database() and table_name=? and index_name=?'
    return this.query(q, [table, index])
  }

  private static indexPattern = /create\s+index\s+(\w+)\s+on\s+(\w+)/i

  async createIndexIfNotExists(query: string) {
    const a = query.match(DB.indexPattern)
    if (!a) throw new Error('create index pattern not found')
    const table = a[2]
    const index = a[1]
    const r = await this.findIndex(table, index)
    if (r.length > 0) return
    await this.query(query)
  }

  async getMaxId(table: string) {
    const r = await this.query('select coalesce(max(id), 0) as maxId from ??', table)
    return r[0].maxId
  }

  async runQueries(qa: string[]) {
    for (const q of qa) {
      await this.query(q)
    }
  }

  async insertObjects(table: string, objs: Object[]) {
    for (const obj of objs) {
      await this.query('insert into ' + table + ' set ?', obj)
    }
  }

  insertObjectsOld(table: string, objs: Object[], done: Done) {
    const _this = this
    let i = 0
    let e = objs.length
    ;(function loop() {
      if (i === e) {
        return done()
      }
      const obj = objs[i++]
      _this.query('insert into ' + table + ' set ?', obj, (err) => {
        if (err) {
          return done(new Error('Insert failed: ' + JSON.stringify(obj)))
        }
        setImmediate(loop)
      })
    })()
  }
}
