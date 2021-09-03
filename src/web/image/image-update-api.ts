import { deleteUpload, Express2 } from '../_express/express2.js'
import { ImageDB } from '../../db/image/image-db.js'
import { ImageUpdateForm } from '../../service/image/form/image-form.js'
import { sessionUserFrom } from '../user/user-login-api.js'
import { NOT_AUTHENTICATED } from '../../service/user/form/user-form.js'
import { Request } from 'express'
import { Error2 } from '../../lib/base/error2.js'
import { ImageFileManager } from '../../file/fileman.js'
import { checkImageUpdatable, imageUpdateService } from '../../service/image/image-update-service.js'

function imageUpdateFormFrom(req: Request) {
  return {
    comment: req.body.comment || '',
    file: req.file?.path
  } as ImageUpdateForm
}

export function registerImageUpdateApi(web: Express2, idb: ImageDB, ifm: ImageFileManager) {

  web.router.put('/api/image/:id([0-9]+)', web.upload.single('file'), deleteUpload(async (req, res) => {
    const user = sessionUserFrom(res)
    if (!user) throw NOT_AUTHENTICATED
    const id = parseInt(req.params.id) || 0
    const form = imageUpdateFormFrom(req)
    const err: Error2[] = []
    const image = await idb.findImage(id)
    await checkImageUpdatable(user, image, err)
    if (err.length) throw err
    await imageUpdateService(idb, ifm, id, form, err)
    if (err.length) throw err
    res.json({})
  }))

}
