import { DB } from '../_db/db.js'
import { dateToDateString } from '../../_util/date2.js'
import { Config } from '../../_type/config.js'
import { Counter } from '../../_type/counter.js'

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
    if (!this.config.dev) throw new Error('only available in development mode')
    await this.db.query('drop table if exists counter')
  }

  async increaseCounter(id: string) {
    let d = dateToDateString(new Date())
    await this.db.query(
      'insert into counter values(?, ?, 1) on duplicate key update c = c + 1',
      [id, d],
    )
  }

  async replaceCounter(id: string, date: Date, count: number) {
    let d = dateToDateString(date)
    await this.db.query(
      'replace into counter values(?, ?, ?)',
      [id, d, count],
    )
  }

  async findCounter(id: string, d: string) {
    const r = await this.db.queryOne('select * from counter where id = ? and d = ?', [id, d])
    return r ? r.c as number : undefined
  }

  async findCounterList(id: string, begin: string, end: string) {
    const r = await this.db.query(
      'select d, c from counter where id = ? and d between ? and ? order by d',
      [id, begin, end]
    )
    return r as Counter[]
  }

}
