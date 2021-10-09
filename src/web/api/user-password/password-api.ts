import { Express2, toCallback } from '../../_express/express2.js'
import { ResetDB } from '../../../db/password/reset-db.js'
import { Mailer } from '../../../mailer/mailer2.js'
import { passwordResetService, passwordSendResetMailService } from '../../../service/user-password/password-service.js'
import { newString } from '../../../_util/primitive.js'
import { UserCache } from '../../../db/user/cache/user-cache.js'
import { ErrorConst } from '../../../_type/error.js'
import { NewPasswordForm } from '../../../_type/password.js'
import { renderJson } from '../_common/render-json.js'

export function registerPasswordApi(web: Express2, uc: UserCache, resetDB: ResetDB, mailer: Mailer) {

  web.router.post('/api/password-send-reset-mail', toCallback(async (req, res) => {
    const email = newString(req.body.email).trim()
    const err: ErrorConst[] = []
    await passwordSendResetMailService(mailer, uc.udb, resetDB, email, err)
    if (err.length) throw err
    renderJson(res, {})
  }))

  web.router.post('/api/password-reset', toCallback(async (req, res) => {
    const form: NewPasswordForm = {
      uuid: newString(req.body.uuid).trim(),
      token: newString(req.body.token).trim(),
      password: newString(req.body.password).trim()
    }
    const err: ErrorConst[] = []
    await passwordResetService(uc, resetDB, form, err)
    if (err.length) throw err
    renderJson(res, {})
  }))

}
