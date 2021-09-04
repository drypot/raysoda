import { UserDB } from '../../db/user/user-db.js'
import { ImageDB } from '../../db/image/image-db.js'
import { ImageFileManager } from '../../file/fileman.js'
import { Image } from '../../entity/image-entity.js'
import { User } from '../../entity/user-entity.js'
import { dateTimeStringFrom } from '../../lib/base/date2.js'

export interface ImageHead {
  id: number
  owner: {
    id: number
    name: string
    home: string
  }
  cdateStr: string
  comment: string
  thumbUrl: string
}

export function imageHeadFrom(owner: User, ifm: ImageFileManager, image: Image) {
  return {
    id: image.id,
    owner: {
      id: owner.id,
      name: owner.name,
      home: owner.home
    },
    cdateStr: dateTimeStringFrom(image.cdate),
    comment: image.comment,
    thumbUrl: ifm.getThumbUrlFor(image.id)
  } as ImageHead
}

export async function imageHeadListFrom(udb: UserDB, ifm: ImageFileManager, imageL: Image[]) {
  const hl: ImageHead[] = []
  for (const image of imageL) {
    const owner = await udb.getCachedById(image.uid)
    const head = imageHeadFrom(owner as User, ifm, image)
    hl.push(head)
  }
  return hl
}

export async function imageListService(
  udb: UserDB, idb: ImageDB, ifm: ImageFileManager, p: number, ps: number
) {
  const il = await idb.findImageList((p - 1) * ps, ps)
  return imageHeadListFrom(udb, ifm, il)
}

export async function imageListByCdateService(
  udb: UserDB, idb: ImageDB, ifm: ImageFileManager, p: number, ps: number, d: Date
) {
  const il = await idb.findImageListByCdate(d, (p - 1) * ps, ps)
  return imageHeadListFrom(udb, ifm, il)
}
