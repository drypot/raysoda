import { UserDB } from '../../db/user/user-db.js'
import { ImageDB } from '../../db/image/image-db.js'
import { ImageFileManager } from '../../file/fileman.js'
import { Image } from '../../_type/image.js'
import { User } from '../../_type/user.js'
import { dateTimeStringFrom } from '../../_util/date2.js'
import { ImageListItem } from '../../_type/image-view.js'

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

export async function imageListFrom(udb: UserDB, ifm: ImageFileManager, imageL: Image[]) {
  return await Promise.all(imageL.map(async image => {
    const owner = await udb.getCachedById(image.uid)
    return imageListItemFrom(owner as User, ifm, image)
  }))
}

export async function imageListService(
  udb: UserDB, idb: ImageDB, ifm: ImageFileManager, p: number, ps: number
) {
  const il = await idb.findImageList((p - 1) * ps, ps)
  return imageListFrom(udb, ifm, il)
}

export async function imageListByCdateService(
  udb: UserDB, idb: ImageDB, ifm: ImageFileManager, p: number, ps: number, d: Date
) {
  const il = await idb.findImageListByCdate(d, (p - 1) * ps, ps)
  return imageListFrom(udb, ifm, il)
}
