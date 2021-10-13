import { Express2, toCallback } from '../../../_express/express2'
import { ImageDB } from '../../../../db/image/image-db'
import { ImageUpdateForm } from '../../../../_type/image-form'
import { Request } from 'express'
import { imageUpdateGetService, imageUpdateService } from '../../../../service/image/image-update-service'
import { newNumber, newString } from '../../../../_util/primitive'
import { ErrorConst } from '../../../../_type/error'
import { getSessionUser } from '../../user-auth/api/user-auth-api'
import { renderJson } from '../../_common/render-json'
import { shouldBeUser } from '../../../../service/user-auth/user-auth-service'
import { deleteUpload, Uploader } from '../../../_express/uploader'
import { omanGetConfig, omanGetObject } from '../../../../oman/oman'
import { omanGetImageFileManager } from '../../../../file/_fileman-loader'

export async function useImageUpdateApi() {

  const web = await omanGetObject('Express2') as Express2
  const uploader = await omanGetObject('Uploader') as Uploader
  const idb = await omanGetObject('ImageDB') as ImageDB
  const ifm = await omanGetImageFileManager(omanGetConfig().appNamel)

  web.router.get('/api/image-update-get/:id([0-9]+)', toCallback(async (req, res) => {
    const user = getSessionUser(res)
    shouldBeUser(user)
    const id = newNumber(req.params.id)
    const err: ErrorConst[] = []
    const image = await imageUpdateGetService(idb, user, id, err)
    if (err.length) throw err
    renderJson(res, { image })
  }))

  web.router.put('/api/image-update/:id([0-9]+)', uploader.single('file'), deleteUpload(async (req, res) => {
    const user = getSessionUser(res)
    shouldBeUser(user)
    const id = newNumber(req.params.id)
    const form = newUpdateForm(req)
    const err: ErrorConst[] = []
    await imageUpdateService(idb, ifm, user, id, form, err)
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

