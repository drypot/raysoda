import { Express2 } from '../../../_express/express2'
import { UserDB } from '../../../../db/user/user-db'
import { ImageDB } from '../../../../db/image/image-db'
import { ImageUploadForm } from '../../../../_type/image-form'
import { imageUploadService } from '../../../../service/image/image-upload-service'
import { Request } from 'express'
import { ErrorConst } from '../../../../_type/error'
import { getSessionUser } from '../../user-auth/api/user-auth-api'
import { renderJson } from '../../_common/render-json'
import { shouldBeUser } from '../../../../service/user-auth/user-auth-service'
import { deleteUpload, Uploader } from '../../../_express/uploader'
import { omanGetConfig, omanGetObject } from '../../../../oman/oman'
import { omanGetImageFileManager } from '../../../../file/_fileman-loader'

function newImageUploadForm(req: Request) {
  return {
    now: new Date(),
    comment: req.body.comment || '',
    file: req.file?.path
  } as ImageUploadForm
}

export async function useImageUploadApi() {

  const web = await omanGetObject('Express2') as Express2
  const uploader = await omanGetObject('Uploader') as Uploader
  const udb = await omanGetObject('UserDB') as UserDB
  const idb = await omanGetObject('ImageDB') as ImageDB
  const ifm = await omanGetImageFileManager(omanGetConfig().appNamel)

  web.router.post('/api/image-upload', uploader.single('file'), deleteUpload(async (req, res) => {
    const user = getSessionUser(res)
    shouldBeUser(user)
    const form = newImageUploadForm(req)
    const err: ErrorConst[] = []
    const id = await imageUploadService(udb, idb, ifm, user.id, form, err)
    if (err.length) throw err
    renderJson(res, { id })
  }))

}
