import { BannerDB } from '@server/db/banner/banner-db'
import { Banner } from '@common/type/banner'

export function bannerGetList(bdb: BannerDB) {
  return bdb.getBannerListCached()
}

export async function bannerUpdateList(bdb: BannerDB, list: Banner[]) {
  await bdb.updateBannerList(list)
}
