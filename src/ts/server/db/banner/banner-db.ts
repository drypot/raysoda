import { Banner } from '@common/type/banner'
import { omanGetObject, omanRegisterFactory } from '@server/oman/oman'
import { DB } from '@server/db/_db/db'
import { inProduction } from '@common/util/env2'

omanRegisterFactory('BannerDB', async () => {
  const bdb = BannerDB.from(await omanGetObject('DB') as DB)
  await bdb.createTable()
  await bdb.loadCache()
  return bdb
})

export class BannerDB {

  private db: DB
  private bannerList: Banner[] = []

  static from(db: DB) {
    return new BannerDB(db)
  }

  private constructor(db: DB) {
    this.db = db
  }

  async createTable() {
    const q =
      'create table if not exists banner(' +
      '  id varchar(64) not null,' +
      '  value text(65535) not null,' +
      '  primary key (id)' +
      ')'
    await this.db.query(q)
    return this
  }

  async dropTable() {
    if (inProduction()) {
      throw new Error('only available in development mode')
    }
    await this.db.query('drop table if exists banner')
    return this
  }

  private async getValue(id: string) {
    const r = await this.db.queryOne('select * from banner where id = ?', id)
    return r ? r.value : undefined
  }

  private async updateValue(id: string, value: string) {
    await this.db.query('replace into banner values(?, ?)', [id, value])
  }

  async updateBannerList(list: Banner[]) {
    await this.updateValue('default', JSON.stringify(list))
    await this.loadCache()
  }

  async loadCache() {
    const value = await this.getValue('default')
    const list: Banner[] = value ? JSON.parse(value) : []
    this.bannerList = list
  }

  getCachedBannerList() {
    return this.bannerList
  }

}
