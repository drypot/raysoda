import { ValueDB } from '../value/value-db'
import { Banner } from '../../_type/banner'
import { ObjMaker, objManGetObject } from '../../objman/object-man'

export const serviceObject: ObjMaker = async () => {
  const bdb = BannerDB.from(await objManGetObject('ValueDB') as ValueDB)
  await bdb.loadCache()
  return bdb
}

export class BannerDB {

  readonly vdb: ValueDB
  private bannerList: Banner[] = []

  static from(vdb: ValueDB) {
    return new BannerDB(vdb)
  }

  private constructor(vdb: ValueDB) {
    this.vdb = vdb
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
