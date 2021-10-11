import { ImageDB } from '../../db/image/image-db.js'
import { ImageFileManager } from '../../file/fileman.js'
import { ImageUpdateForm } from '../../_type/image-form.js'
import { Image } from '../../_type/image.js'
import { ErrorConst } from '../../_type/error.js'
import { User } from '../../_type/user.js'
import { IMAGE_NOT_EXIST } from '../../_type/error-image.js'
import { NOT_AUTHORIZED } from '../../_type/error-user.js'
import { userCanUpdateImage } from './_image-service.js'

export async function checkImageUpdatable(
  idb: ImageDB, user: User, id: number, err: ErrorConst[]
) {
  const image = await idb.findImage(id)
  if (!image) {
    err.push(IMAGE_NOT_EXIST)
    return
  }
  if (!userCanUpdateImage(user, image)) {
    err.push(NOT_AUTHORIZED)
    return
  }
  return image
}

export async function imageUpdateGetService(idb: ImageDB, user: User, id: number, err: ErrorConst[])
  : Promise<ImageUpdateForm | undefined> {
  const image = await checkImageUpdatable(idb, user, id, err)
  if (!image || err.length) {
    return
  }
  return {
    comment: image.comment
  }
}

export async function imageUpdateService(
  idb: ImageDB, ifm: ImageFileManager, user: User, id: number, form: ImageUpdateForm, err: ErrorConst[]
) {
  const image = await checkImageUpdatable(idb, user, id, err)
  if (!image || err.length) {
    return
  }
  const update: Partial<Image> = {}
  if (form.file) {
    await ifm.beforeIdentify(form.file)
    const meta = await ifm.getImageMeta(form.file)
    ifm.checkMeta(meta, err)
    if (err.length) {
      return
    }
    await ifm.deleteImage(id)
    update.vers = await ifm.saveImage(id, form.file, meta)
  }
  update.comment = form.comment
  await idb.updateImage(id, update)
}
