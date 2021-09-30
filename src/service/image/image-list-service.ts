import { ImageDB } from '../../db/image/image-db.js'
import { ImageFileManager } from '../../file/fileman.js'
import { Image } from '../../_type/image.js'
import { User } from '../../_type/user.js'
import { dateTimeStringFrom } from '../../_util/date2.js'
import { ImageListItem } from '../../_type/image-view.js'
import { UserCache } from '../../db/user/user-cache.js'

export function imageListItemFrom(owner: User, ifm: ImageFileManager, image: Image) {
  return {
    id: image.id,
    owner: {
      id: owner.id,
      name: owner.name,
      home: owner.home
    },
    cdateStr: dateTimeStringFrom(image.cdate),
    vers: image.vers,
    comment: image.comment,
    thumbUrl: ifm.getThumbUrlFor(image.id)
  } as ImageListItem
}

export async function imageListFrom(uc: UserCache, ifm: ImageFileManager, imageL: Image[]) {
  return await Promise.all(imageL.map(async image => {
    const owner = await uc.getCachedById(image.uid)
    return imageListItemFrom(owner as User, ifm, image)
  }))
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
  uc: UserCache, idb: ImageDB, ifm: ImageFileManager, owner: User, p: number, ps: number
) {
  const il = await idb.findImageListByUser(owner.id, (p - 1) * ps, ps)
  return await imageListFrom(uc, ifm, il)
}
