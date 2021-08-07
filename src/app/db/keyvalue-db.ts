import { DBConn } from './db-conn.js'
import { queryCallback } from 'mysql'

export class KeyValueDB {

  private db: DBConn

  constructor(db: DBConn) {
    this.db = db
  }

  createTable(done: (err: any) => void) {
    const query = `
      create table if not exists persist(
        id varchar(128) not null,
        v text(65535) not null,
        primary key (id)
      )`
    this.db.query(query, done)
  }

  findKeyValue(id: string, done: (err: any, value?: any) => void) {
    this.db.query(
      'select * from persist where id = ?', id,
      (err, r) => {
        if (err) return done(err)
        if (r[0] !== undefined)
          done(null, JSON.parse(r[0].v))
        else
          done(null, undefined)
      }
    )
  }

  updateKeyValue(id: string, v: any, done: queryCallback) {
    this.db.query(
      'replace into persist values(?, ?)',
      [id, JSON.stringify(v)],
      done
    )
  }

}

