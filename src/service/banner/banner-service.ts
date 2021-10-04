import { BannerDB } from '../../db/banner/banner-db.js'
import { Banner } from '../../_type/banner.js'

export function bannerListService(bdb: BannerDB) {
  return bdb.getCached()
}

export async function bannerListUpdateService(bdb: BannerDB, bannerList: Banner[]) {
  await bdb.updateBannerList(bannerList)
}
