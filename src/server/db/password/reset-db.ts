import { DB } from '../_db/db'
import { ResetToken } from '../../_type/password'
import { inProduction } from '../../_util/env2'
import { omanGetObject, omanRegisterFactory } from '../../oman/oman'

omanRegisterFactory('ResetDB', async () => {
  const rdb = ResetDB.from(await omanGetObject('DB') as DB)
  await rdb.createTable()
  return rdb
})

export class ResetDB {

  private db: DB

  static from(db: DB) {
    return new ResetDB(db)
  }

  private constructor(db: DB) {
    this.db = db
  }

  // Table

  async createTable() {
    await this.db.query(
      'create table if not exists pwreset(' +
      '  uuid char(36) character set latin1 collate latin1_bin not null,' +
      '  email varchar(64) not null,' +
      '  token char(64) character set latin1 collate latin1_bin not null,' +
      '  primary key (uuid)' +
      ')'
    )
    await this.db.createIndexIfNotExists(
      'create index pwreset_email on pwreset(email)'
    )
    return this
  }

  async dropTable() {
    if (inProduction()) {
      throw (new Error('only available in development mode'))
    }
    await this.db.query('drop table if exists pwreset')
  }

  async insert(token: ResetToken) {
    return this.db.query('insert into pwreset set ?', token)
  }

  async deleteByEmail(email: string) {
    return this.db.query('delete from pwreset where email = ?', email)
  }

  async findByUuid(uuid: string) {
    const r = await this.db.queryOne('select * from pwreset where uuid = ?', uuid)
    return r as ResetToken | undefined
  }

  async findByEmail(email: string) {
    const r = await this.db.queryOne('select * from pwreset where email = ?', email)
    return r as ResetToken | undefined
  }

}
