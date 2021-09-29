import { ValueDB } from '../value/value-db.js'
import { Banner } from '../../_type/banner.js'

export class BannerDB {
  private vdb: ValueDB
  private banner: Banner[] | undefined

  private constructor(vdb: ValueDB) {
    this.vdb = vdb
  }

  static from(vdb: ValueDB) {
    return new BannerDB(vdb)
  }

  async setBanner(banner: Banner[]) {
    this.banner = banner
    await this.vdb.updateValue('banners', this.banner)
  }

  async getBanner() {
    if (!this.banner) {
      this.banner = await this.vdb.findValue('banners')
      // 다른 문법으로 하니 평션의 리턴값에서 undefined 가 사라지지 않았다.
      this.banner ??= []
    }
    return this.banner
  }
}
