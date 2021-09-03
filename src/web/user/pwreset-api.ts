import { UserDB } from '../../db/user/user-db.js'
import { Express2, toCallback } from '../_express/express2.js'
import { PwResetDB } from '../../db/pwreset/pwreset-db.js'
import { Error2 } from '../../lib/base/error2.js'
import { Mailer } from '../../lib/mailer/mailer2.js'
import {
  NewPasswordForm,
  pwResetSendMailService,
  pwResetSetPasswordService
} from '../../service/user/pwreset-service.js'

export function registerPwResetApi(web: Express2, udb: UserDB, resetDB: PwResetDB, mailer: Mailer) {

  const router = web.router

  router.post('/api/password-reset/send-mail', toCallback(async (req, res) => {
    const email = String(req.body.email || '').trim()
    const err: Error2[] = []
    await pwResetSendMailService(mailer, udb, resetDB, email, err)
    if (err.length) throw err
    res.json({})
  }))

  router.post('/api/password-reset/set-password', toCallback(async (req, res) => {
    const form: NewPasswordForm = {
      uuid: String(req.body.uuid || '').trim(),
      token: String(req.body.token || '').trim(),
      password: String(req.body.password || '').trim()
    }
    const err: Error2[] = []
    await pwResetSetPasswordService(udb, resetDB, form, err)
    if (err.length) throw err
    res.json({})
  }))

}
