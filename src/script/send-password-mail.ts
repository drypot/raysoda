import { getUserDB } from '../db/user/user-db.ts'
import { closeAllObjects, initObjectContext } from '../oman/oman.ts'
import { getPwMailDB } from '../db/password/pwmail-db.ts'
import { insertUserFix4 } from '../db/user/fixture/user-fix.ts'
import { getMailer } from '../mailer/mailer2.ts'
import type { ErrorConst } from '../common/type/error.ts'
import { mailUserPassword } from '../domain/user/service/user-password.ts'
import { logError } from '../common/util/error2.ts'

async function main() {
  initObjectContext('config/raysoda-test.json')
  const udb = await getUserDB()
  const rdb = await getPwMailDB()

  await udb.dropTable()
  await udb.createTable()
  await insertUserFix4(udb)

  await rdb.dropTable()
  await rdb.createTable()

  const mailer = await getMailer()
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
