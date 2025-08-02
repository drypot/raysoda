import { getUserDB } from '../db/user/user-db.js'
import { closeAllObjects, getObject, initObjectContext } from '../oman/oman.js'
import { PwMailDB } from '../db/password/pwmail-db.js'
import { insertUserFix4 } from '../db/user/fixture/user-fix.js'
import { Mailer } from '../mailer/mailer2.js'
import { ErrorConst } from '../common/type/error.js'
import { mailUserPassword } from '../domain/user/service/user-password.js'
import { logError } from '../common/util/error2.js'

async function main() {
  initObjectContext('config/raysoda-test.json')
  const udb = await getUserDB()
  const rdb = await getObject('PwMailDB') as PwMailDB

  await udb.dropTable()
  await udb.createTable()
  await insertUserFix4(udb)

  await rdb.dropTable()
  await rdb.createTable()

  const mailer = await getObject('Mailer') as Mailer
  mailer.loadConfig('config/mail-dev.json')

  const email = process.argv[2]
  const err: ErrorConst[] = []
  await mailUserPassword(mailer, udb, rdb, email, err)
  if (err.length) throw err
}

main().then(() => {
  console.log('mail sent.')
  return closeAllObjects()
}).catch((err) => {
  logError(err)
})
