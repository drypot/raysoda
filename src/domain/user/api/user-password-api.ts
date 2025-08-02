import { getExpress2, toCallback } from '../../../express/express2.js'
import { getUserDB } from '../../../db/user/user-db.js'
import { getPwMailDB } from '../../../db/password/pwmail-db.js'
import { getMailer } from '../../../mailer/mailer2.js'
import { newNumber, newString } from '../../../common/util/primitive.js'
import { ErrorConst } from '../../../common/type/error.js'
import { mailUserPassword, resetUserPassword } from '../service/user-password.js'
import { renderJson } from '../../../express/response.js'
import { NewPasswordForm } from '../../../common/type/password.js'

export async function useUserPasswordApi() {

  const express2 = await getExpress2()
  const udb = await getUserDB()
  const rdb = await getPwMailDB()
  const mailer = await getMailer()

  express2.router.post('/api/user-password-mail', toCallback(async (req, res) => {
    const email = newString(req.body.email).trim()
    const err: ErrorConst[] = []
    await mailUserPassword(mailer, udb, rdb, email, err)
    if (err.length) throw err
    renderJson(res, {})
  }))

  express2.router.post('/api/user-password-reset', toCallback(async (req, res) => {
    const form: NewPasswordForm = {
      id: newNumber(req.body.id),
      random: newString(req.body.random).trim(),
      password: newString(req.body.password).trim()
    }
    const err: ErrorConst[] = []
    await resetUserPassword(udb, rdb, form, err)
    if (err.length) throw err
    renderJson(res, {})
  }))

}
