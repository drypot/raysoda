import { configFrom } from '../config/config.js'
import { Mailer } from '../lib/mailer/mailer2.js'
import { DB } from '../db/_db/db.js'
import { UserDB } from '../db/user/user-db.js'
import { PwResetDB } from '../db/pwreset/pwreset-db.js'
import { FormError, logError } from '../lib/base/error2.js'
import { pwResetSendMailService } from '../service/user/pwreset-service.js'
import { insertUserFix4 } from '../db/user/user-db-fixture.js'

let dbToClose: DB

async function main() {
  const config = configFrom('config/app-test.json')
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
  const errs: FormError[] = []
  await pwResetSendMailService(mailer, udb, rdb, email, errs)
  if (errs.length) throw errs
}

main().then(() => {
  console.log('mail sent.')
}).catch((err) => {
  logError(err)
}).finally(async () => {
  await dbToClose.close()
})
