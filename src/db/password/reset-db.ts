import { DB } from '../_db/db.js'
import { Config } from '../../_type/config.js'
import { ResetToken } from '../../_type/password.js'

export class ResetDB {
  public config: Config
  private db: DB

  private constructor(db: DB) {
    this.config = db.config
    this.db = db
  }

  static from(db: DB) {
    return new ResetDB(db)
  }

  // Table

  async createTable(createIndex: boolean = true) {
    const q =
      'create table if not exists pwreset(' +
      '  uuid char(36) character set latin1 collate latin1_bin not null,' +
      '  email varchar(64) not null,' +
      '  token char(64) character set latin1 collate latin1_bin not null,' +
      '  primary key (uuid)' +
      ')'
    await this.db.query(q)
    if (createIndex) {
      await this.db.createIndexIfNotExists(
        'create index pwreset_email on pwreset(email)'
      )
    }
    return this
  }

  async dropTable() {
    if (!this.config.dev) {
      throw (new Error('only available in development mode'))
    }
    await this.db.query('drop table if exists pwreset')
  }

  async insert(token: ResetToken) {
    return this.db.query('insert into pwreset set ?', token)
  }

  async findByUuid(uuid: string) {
    const r = await this.db.queryOne('select * from pwreset where uuid = ?', uuid)
    return r as ResetToken | undefined
  }

  async findByEmail(email: string) {
    const r = await this.db.queryOne('select * from pwreset where email = ?', email)
    return r as ResetToken | undefined
  }

  async deleteByEmail(email: string) {
    return this.db.query('delete from pwreset where email = ?', email)
  }
}