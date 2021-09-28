import { UserDB } from '../../db/user/user-db.js'
import { Express2, toCallback } from '../_express/express2.js'
import { PwResetDB } from '../../db/pwreset/pwreset-db.js'
import { Error2 } from '../../_error/error2.js'
import { Mailer } from '../../mailer/mailer2.js'
import {
  NewPasswordForm,
  pwResetSendMailService,
  pwResetSetPasswordService
} from '../../service/user/user-pwreset-service.js'
import { stringFrom } from '../../_util/primitive.js'

export function registerPwResetApi(web: Express2, udb: UserDB, resetDB: PwResetDB, mailer: Mailer) {

  const router = web.router

  router.post('/api/pwreset-send-mail', toCallback(async (req, res) => {
    const email = stringFrom(req.body.email).trim()
    const err: Error2[] = []
    await pwResetSendMailService(mailer, udb, resetDB, email, err)
    if (err.length) throw err
    res.json({})
  }))

  router.post('/api/pwreset-set-password', toCallback(async (req, res) => {
    const form: NewPasswordForm = {
      uuid: stringFrom(req.body.uuid).trim(),
      token: stringFrom(req.body.token).trim(),
      password: stringFrom(req.body.password).trim()
    }
    const err: Error2[] = []
    await pwResetSetPasswordService(udb, resetDB, form, err)
    if (err.length) throw err
    res.json({})
  }))

}
