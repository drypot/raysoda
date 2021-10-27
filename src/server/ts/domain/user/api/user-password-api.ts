import { ErrorConst } from '@common/type/error'
import { PwMailDB } from '@server/db/password/pwmail-db'
import { Express2, toCallback } from '@server/express/express2'
import { pwReset, pwSendMail } from '@server/domain/user/_service/user-pw-service'
import { omanGetObject } from '@server/oman/oman'
import { UserDB } from '@server/db/user/user-db'
import { Mailer } from '@server/mailer/mailer2'
import { renderJson } from '@server/express/render-json'
import { NewPasswordForm } from '@common/type/password'
import { newNumber, newString } from '@common/util/primitive'

export async function useUserPasswordApi() {

  const web = await omanGetObject('Express2') as Express2
  const udb = await omanGetObject('UserDB') as UserDB
  const rdb = await omanGetObject('PwMailDB') as PwMailDB
  const mailer = await omanGetObject('Mailer') as Mailer

  web.router.post('/api/user-password-send-mail', toCallback(async (req, res) => {
    const email = newString(req.body.email).trim()
    const err: ErrorConst[] = []
    await pwSendMail(mailer, udb, rdb, email, err)
    if (err.length) throw err
    renderJson(res, {})
  }))

  web.router.post('/api/user-password-reset', toCallback(async (req, res) => {
    const form: NewPasswordForm = {
      id: newNumber(req.body.id),
      random: newString(req.body.random).trim(),
      password: newString(req.body.password).trim()
    }
    const err: ErrorConst[] = []
    await pwReset(udb, rdb, form, err)
    if (err.length) throw err
    renderJson(res, {})
  }))

}
