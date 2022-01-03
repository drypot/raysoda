import { BannerDB } from '@server/db/banner/banner-db'
import { Banner } from '@common/type/banner'

export function getBannerList(bdb: BannerDB) {
  return bdb.getCachedBannerList()
}

export async function updateBannerList(bdb: BannerDB, list: Banner[]) {
  await bdb.updateBannerList(list)
}
