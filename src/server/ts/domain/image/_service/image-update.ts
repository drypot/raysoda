import { ErrorConst } from '@common/type/error'
import { User } from '@common/type/user'
import { IMAGE_NOT_EXIST, NOT_AUTHORIZED } from '@common/type/error-const'
import { ImageDB } from '@server/db/image/image-db'
import { userCanUpdateImage } from '@server/domain/image/_service/_image-service'
import { ImageUpdateForm } from '@common/type/image-form'
import { Image } from '@common/type/image'
import { ImageFileManager } from '@server/file/_fileman'

export async function imageCheckUpdatable(
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

export async function imageGetForUpdate(idb: ImageDB, user: User, id: number, err: ErrorConst[])
  : Promise<ImageUpdateForm | undefined> {
  const image = await imageCheckUpdatable(idb, user, id, err)
  if (!image || err.length) {
    return
  }
  return {
    comment: image.comment
  }
}

export async function imageUpdate(
  idb: ImageDB, ifm: ImageFileManager, user: User, id: number, form: ImageUpdateForm, err: ErrorConst[]
) {
  const image = await imageCheckUpdatable(idb, user, id, err)
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
