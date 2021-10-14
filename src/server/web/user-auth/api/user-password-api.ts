import { Express2, toCallback } from '../../_express/express2'
import { ResetDB } from '../../../db/password/reset-db'
import { Mailer } from '../../../mailer/mailer2'
import {
  userResetPasswordService,
  userSendResetPasswordMailService
} from '../../../service/user-auth/user-password-service'
import { newString } from '../../../_util/primitive'
import { ErrorConst } from '../../../_type/error'
import { NewPasswordForm } from '../../../_type/password'
import { renderJson } from '../../_common/render-json'
import { omanGetObject } from '../../../oman/oman'
import { UserDB } from '../../../db/user/user-db'

export async function useUserPasswordApi() {

  const web = await omanGetObject('Express2') as Express2
  const udb = await omanGetObject('UserDB') as UserDB
  const rdb = await omanGetObject('ResetDB') as ResetDB
  const mailer = await omanGetObject('Mailer') as Mailer

  web.router.post('/api/password-send-reset-mail', toCallback(async (req, res) => {
    const email = newString(req.body.email).trim()
    const err: ErrorConst[] = []
    await userSendResetPasswordMailService(mailer, udb, rdb, email, err)
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
    await userResetPasswordService(udb, rdb, form, err)
    if (err.length) throw err
    renderJson(res, {})
  }))

}
