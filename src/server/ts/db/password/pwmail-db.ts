import { PasswordMailLog } from '@common/type/password'
import { omanGetObject, omanRegisterFactory } from '@server/oman/oman'
import { DB } from '@server/db/_db/db'
import { inProduction } from '@common/util/env2'

omanRegisterFactory('PwMailDB', async () => {
  const rdb = PwMailDB.from(await omanGetObject('DB') as DB)
  await rdb.createTable()
  return rdb
})

export class PwMailDB {

  private db: DB
  private nextId: number = 0

  static from(db: DB) {
    return new PwMailDB(db)
  }

  private constructor(db: DB) {
    this.db = db
  }

  // Table

  // v1
  //
  // async createTable() {
  //   await this.db.query(
  //     'create table if not exists pwreset(' +
  //     '  uuid char(36) character set latin1 collate latin1_bin not null,' +
  //     '  email varchar(64) not null,' +
  //     '  token char(64) character set latin1 collate latin1_bin not null,' +
  //     '  primary key (uuid)' +
  //     ')'
  //   )
  //   await this.db.createIndexIfNotExists(
  //     'create index pwreset_email on pwreset(email)'
  //   )
  //   return this
  // }

  // v2
  async createTable() {
    await this.db.query(
      'create table if not exists pwmail(' +
      '  id int not null,' +
      '  email varchar(64) not null,' +
      '  random char(32) character set latin1 collate latin1_bin not null,' +
      '  cdate datetime(3) not null,' +
      '  primary key (id)' +
      ')'
    )
    await this.db.createIndexIfNotExists(
      'create index pwreset_email on pwmail(email)'
    )
    this.nextId = await this.db.getMaxId('pwmail')
    this.nextId++
    return this
  }

  async dropTable() {
    if (inProduction()) {
      throw (new Error('only available in development mode'))
    }
    await this.db.query('drop table if exists pwmail')
  }

  async insert(rec: PasswordMailLog) {
    return this.db.query('insert into pwmail set ?', rec)
  }

  async deleteByEmail(email: string) {
    return this.db.query('delete from pwmail where email = ?', email)
  }

  async findById(id: number): Promise<PasswordMailLog | undefined> {
    const r = await this.db.queryOne('select * from pwmail where id = ?', id)
    return r
  }

  async findByEmail(email: string): Promise<PasswordMailLog | undefined> {
    const r = await this.db.queryOne('select * from pwmail where email = ?', email)
    return r
  }

  setNextId(id: number) {
    this.nextId = id
  }

  getNextId() {
    return this.nextId++
  }

}
