import { ImageDB } from '../../db/image/image-db'
import { ImageFileManager } from '../../file/_fileman'
import { User } from '../../_type/user'
import { Image } from '../../_type/image'
import { IMAGE_NOT_EXIST } from '../../_type/error-image'
import { ImageDetail } from '../../_type/image-detail'
import { UserCache } from '../../db/user/cache/user-cache'
import { ErrorConst } from '../../_type/error'
import { SITE_OPEN_DATE } from '../../_type/date-const'
import { userCanUpdateImage } from './_image-service'
import { newDateString } from '../../_util/date2'

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
    cdateStr: newDateString(image.cdate),
    vers: image.vers,
    comment: image.comment,
    dirUrl: ifm.getDirUrlFor(image.id),
    thumbUrl: ifm.getThumbUrlFor(image.id),
    updatable: userCanUpdateImage(user, image)
  }
}

export async function imageDetailService(
  uc: UserCache, idb: ImageDB, ifm: ImageFileManager, user: User, id: number, err: ErrorConst[]
) {
  const image = await idb.findImage(id)
  if (!image) {
    err.push(IMAGE_NOT_EXIST)
    return
  }
  const owner = await uc.getCachedById(image.uid)
  if (!owner) {
    throw new Error()
  }
  return newImageDetail(ifm, user, image, owner)
}

export async function firstImageCdateService(idb: ImageDB) {
  const image = await idb.findFirstImage()
  return image?.cdate ?? SITE_OPEN_DATE
}
