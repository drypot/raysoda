import { ImageDB } from '../../db/image/image-db.js'
import { ImageFileManager } from '../../file/fileman.js'
import { ImageUpdateForm } from '../../_type/image-form.js'
import { Image } from '../../_type/image.js'
import { ErrorConst } from '../../_type/error.js'
import { User } from '../../_type/user.js'
import { IMAGE_NOT_EXIST } from '../../_type/error-image.js'
import { NOT_AUTHORIZED } from '../../_type/error-user.js'

export async function checkImageUpdatable(
  user: User, image: Image | undefined, err: ErrorConst[]
) {
  if (!image) {
    err.push(IMAGE_NOT_EXIST)
    return
  }
  if (image.uid !== user.id && !user.admin) {
    err.push(NOT_AUTHORIZED)
    return
  }
}

export async function imageUpdateService(
  idb: ImageDB, ifm: ImageFileManager, user: User, id: number, form: ImageUpdateForm, err: ErrorConst[]
) {
  const image = await idb.findImage(id)
  await checkImageUpdatable(user, image, err)
  if (err.length) {
    return
  }
  const updateField: Partial<Image> = {}
  if (form.file) {
    await ifm.beforeIdentify(form.file)
    const meta = await ifm.getImageMeta(form.file)
    ifm.checkMeta(meta, err)
    if (err.length) {
      return
    }
    await ifm.deleteImage(id)
    updateField.vers = await ifm.saveImage(id, form.file, meta)
  }
  updateField.comment = form.comment
  await idb.updateImage(id, updateField)
}
