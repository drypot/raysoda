import { DB } from './db.js'
import { Done } from '../base/async2.js'

export class ValueDB {

  private db: DB

  constructor(db: DB) {
    this.db = db
  }

  async createTable() {
    const q =
      'create table if not exists persist(' +
      '  id varchar(128) not null,' +
      '  v text(65535) not null,' +
      '  primary key (id)' +
      ')'
    await this.db.query(q)
  }

  async dropTable() {
    if (!this.db.droppable) throw new Error('can not drop in production mode.')
    await this.db.query('drop table if exists persist')
  }

  async findValue(id: string) {
    const r = await this.db.query('select * from persist where id = ?', id)
    return r.length ? JSON.parse(r[0].v) : undefined
  }

  async updateValue(id: string, v: any) {
    await this.db.query(
      'replace into persist values(?, ?)',
      [id, JSON.stringify(v)]
    )
  }

}
