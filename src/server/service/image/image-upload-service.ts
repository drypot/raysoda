import { ImageDB } from '../../db/image/image-db'
import { ImageUploadForm } from '../../_type/image-form'
import { ImageFileManager } from '../../file/_fileman'
import { Image } from '../../_type/image'
import { UserDB } from '../../db/user/user-db'
import { ErrorConst } from '../../_type/error'
import { omanGetConfig } from '../../oman/oman'
import { IMAGE_NO_FILE } from '../../_type/error-const'

export async function leftTicket(idb: ImageDB, uid: number, now: Date) {
  const config = omanGetConfig()
  let ticket = config.ticketMax  // 한번에 받게 되는 티켓 갯수
  let hour = 0  // 새 티켓을 받을 때까지 남은 시간
  const r = await idb.findCdateListByUser(uid, ticket)
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

export async function imageUploadService(
  udb: UserDB, idb: ImageDB, ifm: ImageFileManager, uid: number, form: ImageUploadForm, err: ErrorConst[]
) {
  // check file
  if (!form.file) {
    err.push(IMAGE_NO_FILE)
    return
  }

  // check ticket
  // ticket 이 없을 경우 err 추가 없이 그냥 return.
  // 폼에서 한번 안내하기도 해서 현재는 이렇게 하고 있다.
  const { ticket, hour } = await leftTicket(idb, uid, form.now)
  if (!ticket) return

  // check meta
  await ifm.beforeIdentify(form.file)
  const meta = await ifm.getImageMeta(form.file)
  ifm.checkMeta(meta, err)
  if (err.length) return

  // save
  // 파일 저장에 시간이 걸릴 경우 db insert 가 늦어져
  // 사진이 여러장 등록될 수 있다.
  const id = idb.getNextId()
  const vers = await ifm.saveImage(id, form.file, meta)
  const image: Image = {
    id: id,
    uid: uid,
    cdate: form.now,
    vers: vers,
    comment: form.comment,
  }
  await idb.insertImage(image)
  await udb.updatePDate(uid, form.now)
  return id
}
