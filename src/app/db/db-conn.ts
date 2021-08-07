import mysql, { Connection, Query, queryCallback, QueryOptions } from 'mysql'
import { Config } from '../config/config.js'
import { Done, waterfall } from '../../lib/base/async2.js'

export class DBConn {

  private config: Config
  private readonly conn: Connection

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
  }

  query(query: Query): Query;
  query(options: string | QueryOptions, callback?: queryCallback): Query;
  query(options: string | QueryOptions, values: any, callback?: queryCallback): Query;
  query(options: any, values?: any, callback?: any): Query {
    return this.conn.query(options, values, callback)
  }

  close(done?: (err?: mysql.MysqlError) => void) {
    if (this.conn) {
      this.conn.end(done)
    } else {
      if (done) done()
    }
  }

  createDatabase(done: queryCallback) {
    waterfall(
      (done: Done) => {
        this.query(
          'create database if not exists ?? character set utf8mb4',
          this.config.mysqlDatabase,
          done
        )
      },
      (done: Done) => {
        this.conn.changeUser(
          { database: this.config.mysqlDatabase },
          done
        )
      },
      done
    )
  }

  dropDatabase(done: queryCallback) {
    if (!this.config.dev) {
      throw new Error('Can not drop database in production mode.')
    }
    this.query('drop database if exists ??', this.config.mysqlDatabase, done)
  }

  findDatabase(name: string, done: queryCallback) {
    this.query('show databases like ?', name, done)
  }

  findTable(name: string, done: queryCallback) {
    this.query('show tables like ?', name, done)
  }

  getMaxId(table: string, done: (err: any, maxId?: number) => void) {
    this.query('select coalesce(max(id), 0) as maxId from ??', table, (err, r) => {
      if (err) return done(err)
      done(null, r[0].maxId)
    })
  }

  runQueries(qa: string[], done: Done) {
    const _this = this
    let i = 0
    let e = qa.length
    ;(function loop() {
      if (i === e) {
        return done()
      }
      const q = qa[i++]
      _this.query(q, (err) => {
        if (err) {
          return done(new Error('Query failed: ' + q))
        }
        setImmediate(loop)
      })
    })()
  }

}
