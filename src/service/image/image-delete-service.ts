import { ImageDB } from '../../db/image/image-db.js'
import { ImageFileManager } from '../../file/fileman.js'
import { ErrorConst } from '../../_type/error.js'
import { checkImageUpdatable } from './image-update-service.js'
import { User } from '../../_type/user.js'

export async function imageDeleteService(
  idb: ImageDB, ifm: ImageFileManager, user: User, id: number, err: ErrorConst[]
) {
  const image = await checkImageUpdatable(idb, user, id, err)
  if (!image || err.length) {
    return
  }
  await idb.deleteImage(id)
  try {
    // 파일이 없을 경우 삭제하면 ENOENT 를 던진다.
    await ifm.deleteImage(id)
  } catch {
  }
}
