import { getExpress2, toCallback } from '../../../express/express2.ts'
import { getUserDB } from '../../../db/user/user-db.ts'
import { getPwMailDB } from '../../../db/password/pwmail-db.ts'
import { getMailer } from '../../../mailer/mailer2.ts'
import { newNumber, newString } from '../../../common/util/primitive.ts'
import type { ErrorConst } from '../../../common/type/error.ts'
import { mailUserPassword, resetUserPassword } from '../service/user-password.ts'
import { renderJson } from '../../../express/response.ts'
import type { NewPasswordForm } from '../../../common/type/password.ts'

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
