import { ErrorConst } from '@common/type/error'
import { ImageDB } from '@server/db/image/image-db'
import { UploadImageForm } from '@common/type/image-form'
import { UserDB } from '@server/db/user/user-db'
import { IMAGE_NO_FILE } from '@common/type/error-const'
import { Image } from '@common/type/image'
import { ImageFileManager } from '@server/fileman/_fileman'
import { getConfig } from '@server/oman/oman'
import { User } from '@common/type/user'

export async function uploadImage(
  udb: UserDB, idb: ImageDB, ifm: ImageFileManager,
  user: User, form: UploadImageForm, file: string, err: ErrorConst[]
) {
  const now = new Date()
  const uid = user.id
  const { comment } = form

  // Check file
  if (file.length === 0) {
    err.push(IMAGE_NO_FILE)
    return
  }

  // Check ticket
  // ticket 이 없을 경우 err 추가 없이 그냥 return.
  // 폼에서 한번 안내하기도 해서 현재는 이렇게 하고 있다.
  const { ticket, hour } = await getLeftTicket(idb, uid, now)
  if (!ticket) return

  // Check meta
  await ifm.beforeIdentify(file)
  const meta = await ifm.getImageMeta(file)
  ifm.checkMeta(meta, err)
  if (err.length) return

  // save
  // 파일 저장에 시간이 걸릴 경우 db insert 가 늦어져
  // 사진이 여러장 등록될 수 있다.
  const id = idb.getNextId()
  const vers = await ifm.saveImage(id, file, meta)
  const image: Image = {
    id,
    uid,
    cdate: now,
    vers: vers,
    comment,
  }
  await idb.insertImage(image)
  await udb.updateUserById(uid, { pdate: now })

  return id
}

export async function getLeftTicket(idb: ImageDB, uid: number, now: Date) {
  const config = getConfig()
  let ticket = config.ticketMax  // 한번에 받게 되는 티켓 갯수
  let hour = 0  // 새 티켓을 받을 때까지 남은 시간
  const r = await idb.getCdateListByUser(uid, ticket)
  for (const e of r) {
    hour = config.ticketGenInterval - Math.floor((now.getTime() - e.cdate.getTime()) / (60 * 60 * 1000))
    if (hour > 0) {
      ticket--
    } else {
      break
    }
  }
  return { ticket, hour }
}
