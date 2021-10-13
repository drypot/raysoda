import { Mailer } from '../mailer/mailer2'
import { UserDB } from '../db/user/user-db'
import { ResetDB } from '../db/password/reset-db'
import { logError } from '../_util/error2'
import { userSendResetPasswordMailService } from '../service/user-auth/user-password-service'
import { insertUserFix4 } from '../db/user/fixture/user-fix'
import { ErrorConst } from '../_type/error'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '../oman/oman'

async function main() {
  omanNewSession('config/raysoda-test.json')
  const udb = await omanGetObject('UserDB') as UserDB
  const rdb = await omanGetObject('ResetDB') as ResetDB

  await udb.dropTable()
  await udb.createTable()
  await insertUserFix4(udb)

  await rdb.dropTable()
  await rdb.createTable()

  const mailer = await omanGetObject('Mailer') as Mailer
  mailer.loadConfig('config/mail-dev.json')

  const email = process.argv[2]
  const err: ErrorConst[] = []
  await userSendResetPasswordMailService(mailer, udb, rdb, email, err)
  if (err.length) throw err
}

main().then(() => {
  console.log('mail sent.')
  return omanCloseAllObjects()
}).catch((err) => {
  logError(err)
})
