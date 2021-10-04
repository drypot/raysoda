import { ValueDB } from '../value/value-db.js'
import { Banner } from '../../_type/banner.js'

export class BannerDB {

  private vdb: ValueDB
  private bannerList: Banner[] = []

  private constructor(vdb: ValueDB) {
    this.vdb = vdb
  }

  static from(vdb: ValueDB) {
    return new BannerDB(vdb)
  }

  async loadCache() {
    const list = await this.vdb.findValue('banners')
    if (list) {
      this.bannerList = list
    }
    return this
  }

  getCached() {
    return this.bannerList
  }

  async updateBannerList(list: Banner[]) {
    await this.vdb.updateValue('banners', list)
    this.bannerList = list
  }

}
