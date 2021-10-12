import { ImageDB } from '../../db/image/image-db'
import { ImageFileManager } from '../../file/_fileman'
import { ImageUpdateForm } from '../../_type/image-form'
import { Image } from '../../_type/image'
import { ErrorConst } from '../../_type/error'
import { User } from '../../_type/user'
import { IMAGE_NOT_EXIST } from '../../_type/error-image'
import { NOT_AUTHORIZED } from '../../_type/error-user'
import { userCanUpdateImage } from './_image-service'

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
