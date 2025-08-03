import { dateToStringNoTime } from '../../common/util/date2.ts'
import { type Counter } from '../../common/type/counter.ts'
import { getObject, registerObjectFactory } from '../../oman/oman.ts'
import { DB, getDatabase } from '../db/db.ts'
import { inProduction } from '../../common/util/env2.ts'

registerObjectFactory('CounterDB', async () => {
  const cdb = CounterDB.from(await getDatabase())
  await cdb.createTable()
  return cdb
})

export async function getCounterDB() {
  return await getObject('CounterDB') as CounterDB
}

export class CounterDB {

  private db: DB

  static from(db: DB) {
    return new CounterDB(db)
  }

  private constructor(db: DB) {
    this.db = db
  }

  async createTable() {
    await this.db.query(
      'create table if not exists counter(' +
      '  id varchar(64) not null,' +
      '  d char(10) not null,' +
      '  c int not null,' +
      '  primary key (id, d)' +
      ')' +
      'charset latin1 collate latin1_bin'
    )
    return this
  }

  async dropTable() {
    if (inProduction()) {
      throw new Error('only available in development mode')
    }
    await this.db.query('drop table if exists counter')
  }

  async incCounter(id: string) {
    let d = dateToStringNoTime(new Date())
    await this.db.query(
      'insert into counter values(?, ?, 1) on duplicate key update c = c + 1',
      [id, d],
    )
  }

  async replaceCounter(id: string, date: Date, count: number) {
    let d = dateToStringNoTime(date)
    await this.db.query(
      'replace into counter values(?, ?, ?)',
      [id, d, count],
    )
  }

  async getCounter(id: string, d: string) {
    const r = await this.db.queryOne('select * from counter where id = ? and d = ?', [id, d])
    return r as Counter | undefined
  }

  async getCounterList(id: string, begin: string, end: string) {
    const r = await this.db.query(
      'select id, d, c from counter where id = ? and d between ? and ? order by d',
      [id, begin, end]
    )
    return r as Counter[]
  }

}
