import { UserDB } from '../../db/user/user-db.js'
import { ImageDB } from '../../db/image/image-db.js'
import { ImageFileManager } from '../../file/fileman.js'
import { Error2 } from '../../_error/error2.js'
import { dateTimeStringFrom } from '../../_util/date2.js'
import { User } from '../../core/user.js'
import { Image } from '../../core/image.js'
import { IMAGE_NOT_EXIST } from '../../_error/error-image.js'
import { ImageDetail } from '../../core/image-view.js'

export function imageDetailFrom(owner: User, ifm: ImageFileManager, image: Image) {
  return {
    id: image.id,
    owner: {
      id: owner.id,
      name: owner.name,
      home: owner.home
    },
    cdate: image.cdate.getTime(),
    cdateStr: dateTimeStringFrom(image.cdate),
    vers: image.vers,
    comment: image.comment,
    dirUrl: ifm.getDirUrlFor(image.id),
    thumbUrl: ifm.getThumbUrlFor(image.id),
    updatable: false
  } as ImageDetail
}

export async function imageDetailService(
  udb: UserDB, idb: ImageDB, ifm: ImageFileManager, id: number, err: Error2[]
) {
  const image = await idb.findImage(id)
  if (!image) {
    err.push(IMAGE_NOT_EXIST)
    return
  }
  const owner = await udb.getCachedById(image.uid)
  if (!owner) {
    throw new Error()
  }
  return imageDetailFrom(owner, ifm, image)
}