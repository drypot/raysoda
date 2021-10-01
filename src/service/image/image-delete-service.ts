import { ImageDB } from '../../db/image/image-db.js'
import { ImageFileManager } from '../../file/fileman.js'
import { ErrorConst } from '../../_type/error.js'

export async function imageDeleteService(
  idb: ImageDB, ifm: ImageFileManager, id: number, err: ErrorConst[]
) {
  await idb.deleteImage(id)
  try {
    // 파일이 없을 경우 삭제하면 ENOENT를 던진다.
    await ifm.deleteImage(id)
  } catch {
  }
}
