import { DB } from './db.js'
import { queryCallback } from 'mysql'
import { Done } from '../base/async2.js'

export class ValueDB {

  private db: DB

  constructor(db: DB) {
    this.db = db
  }

  createTable(done: queryCallback) {
    const query = `
      create table if not exists persist(
        id varchar(128) not null,
        v text(65535) not null,
        primary key (id)
      )`
    this.db.query(query, done)
  }

  dropTable(done: Done) {
    if (!this.db.droppable) return done(new Error('can not drop in production mode.'))
    this.db.query('drop table if exists persist', done)
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

