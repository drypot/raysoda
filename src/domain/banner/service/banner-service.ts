import { BannerDB } from '../../../db/banner/banner-db.ts'
import type { Banner } from '../../../common/type/banner.ts'

export function getBannerList(bdb: BannerDB) {
  return bdb.getCachedBannerList()
}

export async function updateBannerList(bdb: BannerDB, list: Banner[]) {
  await bdb.updateBannerList(list)
}
