import { ValueDB } from '../value/value-db.js'

export interface Banner {
  text: string
  url: string
}

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
      this.banner ??= []
    }
    return this.banner
  }
}
