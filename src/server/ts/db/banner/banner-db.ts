import { Banner } from '@common/type/banner'
import { omanGetObject, omanRegisterFactory } from '@server/oman/oman'
import { ValueDB } from '@server/db/value/value-db'

omanRegisterFactory('BannerDB', async () => {
  const bdb = BannerDB.from(await omanGetObject('ValueDB') as ValueDB)
  await bdb.loadCache()
  return bdb
})

export class BannerDB {

  private vdb: ValueDB
  private bannerList: Banner[] = []

  static from(vdb: ValueDB) {
    return new BannerDB(vdb)
  }

  private constructor(vdb: ValueDB) {
    this.vdb = vdb
  }

  async loadCache() {
    const list = await this.vdb.findValue('banners')
    this.bannerList = list ? list : []
  }

  getCached() {
    return this.bannerList
  }

  async updateBannerList(list: Banner[]) {
    await this.vdb.updateValue('banners', list)
    this.bannerList = list
  }

}