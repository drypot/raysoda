import { BannerDB } from '@server/db/banner/banner-db'
import { Banner } from '@common/type/banner'

export function bannerListService(bdb: BannerDB) {
  return bdb.getCached()
}

export async function bannerListUpdateService(bdb: BannerDB, bannerList: Banner[]) {
  await bdb.updateBannerList(bannerList)
}
