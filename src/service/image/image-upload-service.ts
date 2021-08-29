import { ImageDB } from '../../db/image/image-db.js'
import { Error2 } from '../../lib/base/error2.js'
import { IMAGE_NO_FILE, ImageUploadForm } from './form/image-form.js'
import { ImageFileManager } from '../../file/fileman.js'
import { Image } from '../../entity/image-entity.js'
import { UserDB } from '../../db/user/user-db.js'

export async function leftTicket(idb: ImageDB, uid: number, now: Date) {
  const config = idb.config
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
  udb: UserDB, idb: ImageDB, ifm: ImageFileManager, uid: number, form: ImageUploadForm, err: Error2[]
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
  const meta = await ifm.identify(form.file)
  ifm.checkMeta(meta, err)
  if (err.length) return

  // save
  // 파일 저장에 시간이 걸릴 경우 db insert 가 늦어져
  // 사진이 여러장 등록될 수 있다.
  const id = idb.getNextImageId()
  const vers = await ifm.saveImage(id, form.file, meta)
  const image = {
    id: id,
    uid: uid,
    cdate: form.now,
    vers: vers,
    comment: form.comment,
  } as Image
  await idb.insertImage(image)
  await udb.updateUserPDate(uid, form.now)
  return id
}
