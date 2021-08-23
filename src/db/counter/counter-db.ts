import { DB } from '../_db/db.js'
import { Config } from '../../config/config.js'
import { dateStringFrom } from '../../lib/base/date2.js'

export interface CounterRecord {
  d: string
  c: number
}

export class CounterDB {

  public config: Config
  private db: DB

  private constructor(db: DB) {
    this.config = db.config
    this.db = db
  }

  static from(db: DB) {
    return new CounterDB(db)
  }

  async createTable() {
    const q =
      'create table if not exists counter(' +
      '  id varchar(64) not null,' +
      '  d char(10) not null,' +
      '  c int not null,' +
      '  primary key (id, d)' +
      ')' +
      'charset latin1 collate latin1_bin'
    await this.db.query(q)
    return this
  }

  async dropTable() {
    if (!this.config.dev) throw new Error('can not drop in production mode.')
    await this.db.query('drop table if exists counter')
  }

  async insert(id: string, d: Date, c: number) {
    let ds = dateStringFrom(d)
    await this.db.query(
      'replace into counter values(?, ?, ?)',
      [id, ds, c],
    )
  }

  async update(id: string) {
    let ds = dateStringFrom(new Date())
    await this.db.query(
      'insert into counter values(?, ?, 1) on duplicate key update c = c + 1',
      [id, ds],
    )
  }

  async find(id: string, ds: string) {
    const r = await this.db.query('select * from counter where id = ? and d = ?', [id, ds])
    return r.length ? r[0].c as number : undefined
  }

  async findRange(id: string, b: string, e: string) {
    const r = await this.db.query(
      'select d, c from counter where id = ? and d between ? and ? order by d',
      [id, b, e]
    )
    return r as CounterRecord[]
  }

}
