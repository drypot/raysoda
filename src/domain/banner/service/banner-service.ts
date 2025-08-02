import { BannerDB } from '../../../db/banner/banner-db.js'
import { Banner } from '../../../common/type/banner.js'

export function getBannerList(bdb: BannerDB) {
  return bdb.getCachedBannerList()
}

export async function updateBannerList(bdb: BannerDB, list: Banner[]) {
  await bdb.updateBannerList(list)
}
