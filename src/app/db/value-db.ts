import { DB } from './db.js'
import { queryCallback } from 'mysql'

export class ValueDB {

  private db: DB

  constructor(db: DB) {
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

  findValue(id: string, done: (err: any, value?: any) => void) {
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

  updateValue(id: string, v: any, done: queryCallback) {
    this.db.query(
      'replace into persist values(?, ?)',
      [id, JSON.stringify(v)],
      done
    )
  }

}

