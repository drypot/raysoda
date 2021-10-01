import { ImageDB } from '../../db/image/image-db.js'
import { ImageFileManager } from '../../file/fileman.js'
import { dateToDateTimeString } from '../../_util/date2.js'
import { User } from '../../_type/user.js'
import { Image } from '../../_type/image.js'
import { IMAGE_NOT_EXIST } from '../../_type/error-image.js'
import { ImageDetail } from '../../_type/image-detail.js'
import { UserCache } from '../../db/user/user-cache.js'
import { ErrorConst } from '../../_type/error.js'

export function imageDetailFrom(owner: User, ifm: ImageFileManager, image: Image): ImageDetail {
  return {
    id: image.id,
    owner: {
      id: owner.id,
      name: owner.name,
      home: owner.home
    },
    cdate: image.cdate.getTime(),
    cdateStr: dateToDateTimeString(image.cdate),
    vers: image.vers,
    comment: image.comment,
    dirUrl: ifm.getDirUrlFor(image.id),
    thumbUrl: ifm.getThumbUrlFor(image.id),
    updatable: false
  }
}

export async function imageDetailService(
  uc: UserCache, idb: ImageDB, ifm: ImageFileManager, id: number, err: ErrorConst[]
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
  return imageDetailFrom(owner, ifm, image)
}
