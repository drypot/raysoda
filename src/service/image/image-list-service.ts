import { ImageDB } from '../../db/image/image-db.js'
import { ImageFileManager } from '../../file/fileman.js'
import { Image } from '../../_type/image.js'
import { User } from '../../_type/user.js'
import { dateToDateTimeString } from '../../_util/date2.js'
import { ImageDetailMin } from '../../_type/image-detail.js'
import { UserCache } from '../../db/user/user-cache.js'

async function imageListFrom(uc: UserCache, ifm: ImageFileManager, list: Image[]) {
  return await Promise.all(
    list.map(async image => {
      const owner = await uc.getCachedById(image.uid) as User
      return {
        id: image.id,
        owner: {
          id: owner.id,
          name: owner.name,
          home: owner.home
        },
        cdateStr: dateToDateTimeString(image.cdate),
        vers: image.vers,
        comment: image.comment,
        thumbUrl: ifm.getThumbUrlFor(image.id)
      } as ImageDetailMin
    })
  )
}

export async function imageListService(
  uc: UserCache, idb: ImageDB, ifm: ImageFileManager, p: number, ps: number
) {
  const il = await idb.findImageList((p - 1) * ps, ps)
  return imageListFrom(uc, ifm, il)
}

export async function imageListByCdateService(
  uc: UserCache, idb: ImageDB, ifm: ImageFileManager, d: Date, p: number, ps: number
) {
  const il = await idb.findImageListByCdate(d, (p - 1) * ps, ps)
  return imageListFrom(uc, ifm, il)
}

export async function imageListByUserService(
  uc: UserCache, idb: ImageDB, ifm: ImageFileManager, uid: number, p: number, ps: number
) {
  const il = await idb.findImageListByUser(uid, (p - 1) * ps, ps)
  return await imageListFrom(uc, ifm, il)
}
