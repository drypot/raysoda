import { ImageUploadForm } from '@common/type/image-form'
import { deleteUpload, Uploader } from '@server/express/uploader'
import { ErrorConst } from '@common/type/error'
import { Express2 } from '@server/express/express2'
import { userGetSessionUser } from '@server/domain/user/api/user-auth-api'
import { omanGetImageFileManager } from '@server/file/_fileman-loader'
import { ImageDB } from '@server/db/image/image-db'
import { omanGetConfig, omanGetObject } from '@server/oman/oman'
import { UserDB } from '@server/db/user/user-db'
import { renderJson } from '@server/express/render-json'
import { imageUpload } from '@server/domain/image/_service/image-upload'
import { userAssertLogin } from '@server/domain/user/_service/user-auth'
import { Request } from 'express'

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
    const user = userGetSessionUser(res)
    userAssertLogin(user)
    const form = newImageUploadForm(req)
    const err: ErrorConst[] = []
    const id = await imageUpload(udb, idb, ifm, user.id, form, err)
    if (err.length) throw err
    renderJson(res, { id })
  }))

}
