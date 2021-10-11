import { Express2, toCallback } from '../../../_express/express2'
import { ResetDB } from '../../../../db/password/reset-db'
import { Mailer } from '../../../../mailer/mailer2'
import {
  userResetPasswordService,
  userSendResetPasswordMailService
} from '../../../../service/user-auth/user-password-service'
import { newString } from '../../../../_util/primitive'
import { UserCache } from '../../../../db/user/cache/user-cache'
import { ErrorConst } from '../../../../_type/error'
import { NewPasswordForm } from '../../../../_type/password'
import { renderJson } from '../../_common/render-json'

export function registerUserPasswordApi(web: Express2, uc: UserCache, resetDB: ResetDB, mailer: Mailer) {

  web.router.post('/api/password-send-reset-mail', toCallback(async (req, res) => {
    const email = newString(req.body.email).trim()
    const err: ErrorConst[] = []
    await userSendResetPasswordMailService(mailer, uc.udb, resetDB, email, err)
    if (err.length) throw err
    renderJson(res, {})
  }))

  web.router.post('/api/user-password-reset', toCallback(async (req, res) => {
    const form: NewPasswordForm = {
      uuid: newString(req.body.uuid).trim(),
      token: newString(req.body.token).trim(),
      password: newString(req.body.password).trim()
    }
    const err: ErrorConst[] = []
    await userResetPasswordService(uc, resetDB, form, err)
    if (err.length) throw err
    renderJson(res, {})
  }))

}
