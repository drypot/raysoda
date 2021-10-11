import { loadConfigSync } from '../_util/config-loader'
import { Mailer } from '../mailer/mailer2'
import { DB } from '../db/_db/db'
import { UserDB } from '../db/user/user-db'
import { ResetDB } from '../db/password/reset-db'
import { logError } from '../_util/error2'
import { userSendResetPasswordMailService } from '../service/user-auth/user-password-service'
import { insertUserFix4 } from '../db/user/fixture/user-fix'
import { ErrorConst } from '../_type/error'

let dbToClose: DB

async function main() {
  const config = loadConfigSync('config/app-test.json')
  config.mailServer = 'localhost'

  const db = await DB.from(config).createDatabase()
  dbToClose = db

  const udb = UserDB.from(db)
  await udb.dropTable()
  await udb.createTable()
  await insertUserFix4(udb)

  const rdb = ResetDB.from(db)
  await rdb.dropTable()
  await rdb.createTable()

  const mailer = Mailer.from(config).loadSync()

  const email = process.argv[2]
  const err: ErrorConst[] = []
  await userSendResetPasswordMailService(mailer, udb, rdb, email, err)
  if (err.length) throw err
}

main().then(() => {
  console.log('mail sent.')
}).catch((err) => {
  logError(err)
}).finally(async () => {
  await dbToClose.close()
})
