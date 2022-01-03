import { ErrorConst } from '@common/type/error'
import { User } from '@common/type/user'
import { dateToString } from '@common/util/date2'
import { ImageDB } from '@server/db/image/image-db'
import { SITE_OPEN_DATE } from '@common/type/date-const'
import { UserDB } from '@server/db/user/user-db'
import { ImageDetail } from '@common/type/image-detail'
import { Image } from '@common/type/image'
import { ImageFileManager } from '@server/fileman/_fileman'
import { IMAGE_NOT_EXIST } from '@common/type/error-const'
import { userCanUpdateImage } from '@server/domain/image/_service/image-update'

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
