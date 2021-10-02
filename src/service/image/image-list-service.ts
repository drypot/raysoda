import { ImageDB } from '../../db/image/image-db.js'
import { ImageFileManager } from '../../file/fileman.js'
import { Image } from '../../_type/image.js'
import { User } from '../../_type/user.js'
import { dateToStringDateTime } from '../../_util/date2.js'
import { ImageForList } from '../../_type/image-view.js'
import { UserCache } from '../../db/user/cache/user-cache.js'

async function newDecoratedImageList(uc: UserCache, ifm: ImageFileManager, list: Image[]) {
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
        cdateStr: dateToStringDateTime(image.cdate),
        vers: image.vers,
        comment: image.comment,
        thumbUrl: ifm.getThumbUrlFor(image.id)
      } as ImageForList
    })
  )
}

export async function imageListService(
  uc: UserCache, idb: ImageDB, ifm: ImageFileManager, p: number, ps: number
) {
  const il = await idb.findImageList((p - 1) * ps, ps)
  return newDecoratedImageList(uc, ifm, il)
}

export async function imageListByCdateService(
  uc: UserCache, idb: ImageDB, ifm: ImageFileManager, d: Date, p: number, ps: number
) {
  const il = await idb.findImageListByCdate(d, (p - 1) * ps, ps)
  return newDecoratedImageList(uc, ifm, il)
}

export async function imageListByUserService(
  uc: UserCache, idb: ImageDB, ifm: ImageFileManager, uid: number, p: number, ps: number
) {
  const il = await idb.findImageListByUser(uid, (p - 1) * ps, ps)
  return await newDecoratedImageList(uc, ifm, il)
}
