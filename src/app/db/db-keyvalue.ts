import { DBConn } from './db-conn.js'
import { queryCallback } from 'mysql'

export class DBKeyValue {
  private conn: DBConn

  constructor(conn: DBConn) {
    this.conn = conn
  }

  createTable(done: (err:any) => void) {
    const query = `
      create table if not exists persist(
        id varchar(128) not null,
        v text(65535) not null,
        primary key (id)
      )`
    this.conn.query(query, done)
  }

  findKeyValue(id: string, done: queryCallback) {
    this.conn.queryOne(
      'select * from persist where id = ?', id,
      (err, r) => {
        if (err) return done(err)
        done(null, r ? JSON.parse(r.v) : null)
      }
    )
  }

  updateKeyValue(id: string, v: any, done: queryCallback) {
    this.conn.query(
      'replace into persist values(?, ?)',
      [id, JSON.stringify(v)],
      done
    )
  }
}

