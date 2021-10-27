import { ErrorConst } from '@common/type/error'
import { PwMailDB } from '@server/db/password/pwmail-db'
import { logError } from '@common/util/error2'
import { userFixInsert4 } from '@server/db/user/fixture/user-fix'
import { userSendPasswordMail } from '@server/domain/user/_service/user-password'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '@server/oman/oman'
import { UserDB } from '@server/db/user/user-db'
import { Mailer } from '@server/mailer/mailer2'

async function main() {
  omanNewSession('config/raysoda-test.json')
  const udb = await omanGetObject('UserDB') as UserDB
  const rdb = await omanGetObject('PwMailDB') as PwMailDB

  await udb.dropTable()
  await udb.createTable()
  await userFixInsert4(udb)

  await rdb.dropTable()
  await rdb.createTable()

  const mailer = await omanGetObject('Mailer') as Mailer
  mailer.loadConfig('config/mail-dev.json')

  const email = process.argv[2]
  const err: ErrorConst[] = []
  await userSendPasswordMail(mailer, udb, rdb, email, err)
  if (err.length) throw err
}

main().then(() => {
  console.log('mail sent.')
  return omanCloseAllObjects()
}).catch((err) => {
  logError(err)
})
