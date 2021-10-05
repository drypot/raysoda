import { ImageDB } from '../../db/image/image-db.js'
import { ImageFileManager } from '../../file/fileman.js'
import { User } from '../../_type/user.js'
import { Image } from '../../_type/image.js'
import { IMAGE_NOT_EXIST } from '../../_type/error-image.js'
import { ImageDetail } from '../../_type/image-detail.js'
import { UserCache } from '../../db/user/cache/user-cache.js'
import { ErrorConst } from '../../_type/error.js'
import { SITE_OPEN_DATE } from '../../_type/date-const.js'
import { userCanUpdateImage } from './_image-service.js'
import { newDateString } from '../../_util/date2.js'

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
