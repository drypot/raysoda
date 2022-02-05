import { ErrorConst } from '@common/type/error'
import { PwMailDB } from '@server/db/password/pwmail-db'
import { logError } from '@common/util/error2'
import { insertUserFix4 } from '@server/db/user/fixture/user-fix'
import { mailUserPassword } from '@server/domain/user/_service/user-password'
import { closeAllObjects, getObject, initObjectContext } from '@server/oman/oman'
import { UserDB } from '@server/db/user/user-db'
import { Mailer } from '@server/mailer/mailer2'

async function main() {
  initObjectContext('config/raysoda-test.json')
  const udb = await getObject('UserDB') as UserDB
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
