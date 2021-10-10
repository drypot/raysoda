import { loadConfigSync } from '../_util/config-loader.js'
import { Mailer } from '../mailer/mailer2.js'
import { DB } from '../db/_db/db.js'
import { UserDB } from '../db/user/user-db.js'
import { ResetDB } from '../db/password/reset-db.js'
import { logError } from '../_util/error2.js'
import { userSendResetPasswordMailService } from '../service/user-auth/user-password-service.js'
import { insertUserFix4 } from '../db/user/fixture/user-fix.js'
import { ErrorConst } from '../_type/error.js'

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
