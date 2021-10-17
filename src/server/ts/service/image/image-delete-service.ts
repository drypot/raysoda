import { ErrorConst } from '@common/type/error'
import { checkImageUpdatable } from '@server/service/image/image-update-service'
import { User } from '@common/type/user'
import { ImageDB } from '@server/db/image/image-db'
import { ImageFileManager } from '@server/file/_fileman'

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
