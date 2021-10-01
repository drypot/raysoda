import { ValueDB } from '../value/value-db.js'
import { Banner } from '../../_type/banner.js'

export class BannerDB {
  private vdb: ValueDB
  private bannerList: Banner[] | undefined

  private constructor(vdb: ValueDB) {
    this.vdb = vdb
  }

  static from(vdb: ValueDB) {
    return new BannerDB(vdb)
  }

  async setBannerList(bannerList: Banner[]) {
    this.bannerList = bannerList
    await this.vdb.updateValue('banners', this.bannerList)
  }

  async getBannerList() {
    if (this.bannerList) {
      return this.bannerList
    }
    this.bannerList = await this.vdb.findValue('banners')
    this.bannerList ??= []
    return this.bannerList
  }
}
