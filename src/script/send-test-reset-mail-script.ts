import { readConfigSync } from '../_util/config-loader.js'
import { Mailer } from '../mailer/mailer2.js'
import { DB } from '../db/_db/db.js'
import { UserDB } from '../db/user/user-db.js'
import { PwResetDB } from '../db/pwreset/pwreset-db.js'
import { logError } from '../_util/error2.js'
import { pwSendMailService } from '../service/user-password/password-service.js'
import { insertUserFix4 } from '../db/user/user-db-fixture.js'
import { ErrorConst } from '../_type/error.js'

let dbToClose: DB

async function main() {
  const config = readConfigSync('config/app-test.json')
  config.mailServer = 'localhost'

  const db = await DB.from(config).createDatabase()
  dbToClose = db

  const udb = UserDB.from(db)
  await udb.dropTable()
  await udb.createTable()
  await insertUserFix4(udb)

  const rdb = PwResetDB.from(db)
  await rdb.dropTable()
  await rdb.createTable()

  const mailer = Mailer.from(config).initTransport()

  const email = process.argv[2]
  const err: ErrorConst[] = []
  await pwSendMailService(mailer, udb, rdb, email, err)
  if (err.length) throw err
}

main().then(() => {
  console.log('mail sent.')
}).catch((err) => {
  logError(err)
}).finally(async () => {
  await dbToClose.close()
})
