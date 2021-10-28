import { BannerDB } from '@server/db/banner/banner-db'
import { Banner } from '@common/type/banner'

export function bannerGetList(bdb: BannerDB) {
  return bdb.getCached()
}

export async function bannerUpdate(bdb: BannerDB, bannerList: Banner[]) {
  await bdb.updateBannerList(bannerList)
}
