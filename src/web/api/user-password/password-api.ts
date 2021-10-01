import { Express2, toCallback } from '../../_express/express2.js'
import { PwResetDB } from '../../../db/pwreset/pwreset-db.js'
import { Mailer } from '../../../mailer/mailer2.js'
import {
  NewPasswordForm,
  pwResetPasswordService,
  pwSendMailService
} from '../../../service/user-password/password-service.js'
import { paramToString } from '../../../_util/param.js'
import { UserCache } from '../../../db/user/user-cache.js'
import { ErrorConst } from '../../../_type/error.js'

export function registerPasswordApi(web: Express2, uc: UserCache, resetDB: PwResetDB, mailer: Mailer) {

  const router = web.router

  router.post('/api/pwreset-send-mail', toCallback(async (req, res) => {
    const email = paramToString(req.body.email).trim()
    const err: ErrorConst[] = []
    await pwSendMailService(mailer, uc.udb, resetDB, email, err)
    if (err.length) throw err
    res.json({})
  }))

  router.post('/api/pwreset-set-password', toCallback(async (req, res) => {
    const form: NewPasswordForm = {
      uuid: paramToString(req.body.uuid).trim(),
      token: paramToString(req.body.token).trim(),
      password: paramToString(req.body.password).trim()
    }
    const err: ErrorConst[] = []
    await pwResetPasswordService(uc, resetDB, form, err)
    if (err.length) throw err
    res.json({})
  }))

}
