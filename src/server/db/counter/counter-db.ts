import { DB } from '../_db/db'
import { newDateStringNoTime } from '../../_util/date2'
import { Config } from '../../_type/config'
import { Counter } from '../../_type/counter'
import { inProduction } from '../../_util/env2'

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
    if (inProduction()) {
      throw new Error('only available in development mode')
    }
    await this.db.query('drop table if exists counter')
  }

  async increaseCounter(id: string) {
    let d = newDateStringNoTime(new Date())
    await this.db.query(
      'insert into counter values(?, ?, 1) on duplicate key update c = c + 1',
      [id, d],
    )
  }

  async replaceCounter(id: string, date: Date, count: number) {
    let d = newDateStringNoTime(date)
    await this.db.query(
      'replace into counter values(?, ?, ?)',
      [id, d, count],
    )
  }

  async findCounter(id: string, d: string) {
    const r = await this.db.queryOne('select * from counter where id = ? and d = ?', [id, d])
    return r as Counter | undefined
  }

  async findCounterList(id: string, begin: string, end: string) {
    const r = await this.db.query(
      'select id, d, c from counter where id = ? and d between ? and ? order by d',
      [id, begin, end]
    )
    return r as Counter[]
  }

}
