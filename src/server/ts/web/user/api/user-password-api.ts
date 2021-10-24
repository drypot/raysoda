import { ErrorConst } from '@common/type/error'
import { ResetDB } from '@server/db/password/reset-db'
import { Express2, toCallback } from '@server/web/_express/express2'
import {
  userResetPasswordService,
  userSendResetPasswordMailService
} from '@server/service/user-auth/user-password-service'
import { omanGetObject } from '@server/oman/oman'
import { UserDB } from '@server/db/user/user-db'
import { Mailer } from '@server/mailer/mailer2'
import { renderJson } from '@server/web/_common/render-json'
import { NewPasswordForm } from '@common/type/password'
import { newString } from '@common/util/primitive'

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
