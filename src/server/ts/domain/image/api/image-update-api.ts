import { newNumber, newString } from '@common/util/primitive'
import { Express2, toCallback } from '@server/express/express2'
import { ImageUpdateForm } from '@common/type/image-form'
import { deleteUpload, Uploader } from '@server/express/uploader'
import { ErrorConst } from '@common/type/error'
import { userGetSessionUser } from '@server/domain/user/api/user-auth-api'
import { omanGetImageFileManager } from '@server/file/_fileman-loader'
import { ImageDB } from '@server/db/image/image-db'
import { omanGetConfig, omanGetObject } from '@server/oman/oman'
import { renderJson } from '@server/express/render-json'
import { userAssertLogin } from '@server/domain/user/_service/user-auth'
import { imageGetForUpdate, imageUpdate } from '@server/domain/image/_service/image-update'
import { Request } from 'express'

export async function useImageUpdateApi() {

  const web = await omanGetObject('Express2') as Express2
  const uploader = await omanGetObject('Uploader') as Uploader
  const idb = await omanGetObject('ImageDB') as ImageDB
  const ifm = await omanGetImageFileManager(omanGetConfig().appNamel)

  web.router.get('/api/image-update-get/:id([0-9]+)', toCallback(async (req, res) => {
    const user = userGetSessionUser(res)
    userAssertLogin(user)
    const id = newNumber(req.params.id)
    const err: ErrorConst[] = []
    const image = await imageGetForUpdate(idb, user, id, err)
    if (err.length) throw err
    renderJson(res, { image })
  }))

  web.router.put('/api/image-update/:id([0-9]+)', uploader.single('file'), deleteUpload(async (req, res) => {
    const user = userGetSessionUser(res)
    userAssertLogin(user)
    const id = newNumber(req.params.id)
    const form = newUpdateForm(req)
    const err: ErrorConst[] = []
    await imageUpdate(idb, ifm, user, id, form, err)
    if (err.length) throw err
    renderJson(res, {})
  }))

}

function newUpdateForm(req: Request): ImageUpdateForm {
  return {
    comment: newString(req.body.comment),
    file: req.file?.path
  }
}

