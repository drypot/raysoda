import { ErrorConst } from '@common/type/error'
import { User } from '@common/type/user'
import { IMAGE_NOT_EXIST, NOT_AUTHORIZED } from '@common/type/error-const'
import { ImageDB } from '@server/db/image/image-db'
import { userCanUpdateImage } from '@server/domain/image/_service/_image-service'
import { ImageUpdateForm } from '@common/type/image-form'
import { ImageFileManager } from '@server/fileman/_fileman'

export async function imageGetForUpdate(idb: ImageDB, user: User, id: number, err: ErrorConst[]) {
  const image = await imageFindAndCheckUpdatable(idb, user, id, err)
  if (!image || err.length) return

  const form: ImageUpdateForm = {
    id,
    comment: image.comment
  }
  return form
}

export async function imageUpdate(
  idb: ImageDB, ifm: ImageFileManager, user: User, form: ImageUpdateForm, file: string, err: ErrorConst[]
) {
  const { id, comment } = form

  const image = await imageFindAndCheckUpdatable(idb, user, id, err)
  if (!image || err.length) return

  if (!file) {
    await idb.updateImage(id, { comment })
  } else {
    await ifm.beforeIdentify(file)
    const meta = await ifm.getImageMeta(file)
    ifm.checkMeta(meta, err)
    if (err.length) return

    await ifm.deleteImage(id)
    const vers = await ifm.saveImage(id, file, meta)

    await idb.updateImage(id, { comment, vers })
  }
}

export async function imageFindAndCheckUpdatable(
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
