import { loadConfigSync } from '../../_util/config-loader'
import { DB } from '../../db/_db/db'
import { ResetDB } from '../../db/password/reset-db'
import { Mailer } from '../../mailer/mailer2'
import { UserDB } from '../../db/user/user-db'
import { insertUserFix4 } from '../../db/user/fixture/user-fix'
import { userResetPasswordService, userSendResetPasswordMailService } from './user-password-service'
import { checkHash } from '../../_util/hash'
import { ErrorConst, INVALID_DATA } from '../../_type/error'
import { EMAIL_NOT_FOUND, EMAIL_PATTERN, PASSWORD_RANGE } from '../../_type/error-user'
import { Config } from '../../_type/config'
import { UserCache } from '../../db/user/cache/user-cache'
import { NewPasswordForm } from '../../_type/password'

describe('Password Reset Service', () => {

  let config: Config
  let db: DB
  let udb: UserDB
  let uc: UserCache

  let rdb: ResetDB
  let mailer: Mailer

  beforeAll(async () => {
    config = loadConfigSync('config/app-test.json')

    db = await DB.from(config).createDatabase()
    udb = UserDB.from(db)
    uc = UserCache.from(udb)

    rdb = ResetDB.from(db)
    mailer = Mailer.from(config).loadSync()
  })

  afterAll(async () => {
    await db.close()
  })

  it('init table', async () => {
    await udb.dropTable()
    await udb.createTable(false)
    await insertUserFix4(udb)
    await rdb.dropTable()
    await rdb.createTable(false)
  })
  it('send mail, email existence check', async () => {
    const err: ErrorConst[] = []
    await userSendResetPasswordMailService(mailer, udb, rdb, 'userx@mail.test', err)
    expect(err).toContain(EMAIL_NOT_FOUND)
  })
  it('send mail, email format check', async () => {
    const err: ErrorConst[] = []
    await userSendResetPasswordMailService(mailer, udb, rdb, 'userx.mail.test', err)
    expect(err).toContain(EMAIL_PATTERN)
  })
  it('send mail', async () => {
    const err: ErrorConst[] = []
    await userSendResetPasswordMailService(mailer, udb, rdb, 'user1@mail.test', err)
    expect(err.length).toBe(0)
  })
  const resetRecord = { uuid: '', token: '' }
  it('check db', async () => {
    const r = await rdb.findByEmail('user1@mail.test')
    if (!r) throw new Error()
    resetRecord.uuid = r.uuid
    resetRecord.token = r.token
  })
  it('set password, password format check', async () => {
    const form: NewPasswordForm = { ...resetRecord, password: '123' }
    const err: ErrorConst[] = []
    await userResetPasswordService(uc, rdb, form, err)
    expect(err).toContain(PASSWORD_RANGE)
  })
  it('set password, uuid check', async () => {
    const form: NewPasswordForm = { ...resetRecord, password: '1234', uuid: 'xxxx' }
    const err: ErrorConst[] = []
    await userResetPasswordService(uc, rdb, form, err)
    expect(err).toContain(INVALID_DATA)
  })
  it('set password, token check', async () => {
    const form: NewPasswordForm = { ...resetRecord, password: '1234', token: 'xxxx' }
    const err: ErrorConst[] = []
    await userResetPasswordService(uc, rdb, form, err)
    expect(err).toContain(INVALID_DATA)
  })
  it('set password', async () => {
    const form: NewPasswordForm = { ...resetRecord, password: '5678' }
    const err: ErrorConst[] = []
    await userResetPasswordService(uc, rdb, form, err)
    expect(err.length).toBe(0)
  })
  it('check db', async () => {
    const user = await udb.findUserByEmail('user1@mail.test')
    if (!user) throw new Error()
    expect(await checkHash('5678', user.hash)).toBe(true)
  })

})