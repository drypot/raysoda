import { UserDB } from '../../db/user/user-db.js'
import { ImageDB } from '../../db/image/image-db.js'
import { ImageFileManager } from '../../file/fileman.js'
import { IMAGE_NOT_EXIST } from './form/image-form.js'
import { Error2 } from '../../lib/base/error2.js'
import { dateTimeStringFrom } from '../../lib/base/date2.js'
import { User } from '../../entity/user.js'
import { Image } from '../../entity/image.js'

export interface ImageView {
  id: number
  owner: {
    id: number
    name: string
    home: string
  }
  cdate: number
  cdateStr: string
  vers: number[] | string | null
  comment: string
  dirUrl: string
  thumbUrl: string
  updatable: boolean
}

export function imageViewFrom(owner: User, ifm: ImageFileManager, image: Image) {
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
  } as ImageView
}

export async function imageViewService(
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
  return imageViewFrom(owner, ifm, image)
}
