import { UserDB } from '../../../db/user/user-db.ts'
import { ImageDB } from '../../../db/image/image-db.ts'
import type { ImageFileManager } from '../../../fileman/fileman.ts'
import type { User } from '../../../common/type/user.ts'
import type { ErrorConst } from '../../../common/type/error.ts'
import { IMAGE_NOT_EXIST } from '../../../common/type/error-const.ts'
import type { Image } from '../../../common/type/image.ts'
import type { ImageDetail } from '../../../common/type/image-detail.ts'
import { dateToString } from '../../../common/util/date2.ts'
import { userCanUpdateImage } from './image-update.ts'
import { SITE_OPEN_DATE } from '../../../common/type/date-const.ts'

export async function getImageDetail(
  udb: UserDB, idb: ImageDB, ifm: ImageFileManager, user: User, id: number, err: ErrorConst[]
) {

  const image = await idb.getImage(id)
  if (!image) {
    err.push(IMAGE_NOT_EXIST)
    return
  }
  const owner = await udb.getCachedById(image.uid)
  if (!owner) {
    throw new Error()
  }
  return newImageDetail(ifm, user, image, owner)
}

export function newImageDetail(ifm: ImageFileManager, user: User, image: Image, owner: User): ImageDetail {
  return {
    id: image.id,
    owner: {
      id: owner.id,
      name: owner.name,
      home: owner.home
    },
    cdate: image.cdate,
    cdateNum: 0,
    cdateStr: dateToString(image.cdate),
    vers: image.vers,
    comment: image.comment,
    dirUrl: ifm.getDirUrlFor(image.id),
    thumbUrl: ifm.getThumbUrlFor(image.id),
    updatable: userCanUpdateImage(user, image)
  }
}

export async function getFirstImageCdate(idb: ImageDB) {
  const image = await idb.getFirstImage()
  return image?.cdate ?? SITE_OPEN_DATE
}
