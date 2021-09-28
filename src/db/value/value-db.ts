import { DB } from '../_db/db.js'
import { Config } from '../../_config/config.js'

export class ValueDB {

  public config: Config
  private db: DB

  private constructor(db: DB) {
    this.config = db.config
    this.db = db
  }

  static from(db: DB) {
    return new ValueDB(db)
  }

  async createTable() {
    const q =
      'create table if not exists persist(' +
      '  id varchar(128) not null,' +
      '  v text(65535) not null,' +
      '  primary key (id)' +
      ')'
    await this.db.query(q)
    return this
  }

  async dropTable() {
    if (!this.config.dev) throw new Error('only available in development mode')
    await this.db.query('drop table if exists persist')
    return this
  }

  async findValue(id: string) {
    const r = await this.db.queryOne('select * from persist where id = ?', id)
    return r ? JSON.parse(r.v) : undefined
  }

  async updateValue(id: string, v: any) {
    if (v === undefined) {
      await this.db.query('delete from persist where id = ?', id)
    } else {
      await this.db.query('replace into persist values(?, ?)', [id, JSON.stringify(v)])
    }
  }

}
