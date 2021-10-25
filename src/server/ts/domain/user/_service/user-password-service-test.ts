import { Mailer } from '@server/mailer/mailer2'
import { EMAIL_NOT_FOUND, EMAIL_PATTERN, INVALID_DATA, PASSWORD_RANGE } from '@common/type/error-const'
import { checkHash } from '@common/util/hash'
import { NewPasswordForm } from '@common/type/password'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '@server/oman/oman'
import { ErrorConst } from '@common/type/error'
import { ResetDB } from '@server/db/password/reset-db'
import { insertUserFix4 } from '@server/db/user/fixture/user-fix'
import {
  userResetPasswordService,
  userSendResetPasswordMailService
} from '@server/domain/user/_service/user-password-service'
import { UserDB } from '@server/db/user/user-db'

describe('Password Reset Service', () => {

  let udb: UserDB
  let rdb: ResetDB
  let mailer: Mailer

  beforeAll(async () => {
    omanNewSession('config/raysoda-test.json')
    udb = await omanGetObject('UserDB') as UserDB
    rdb = await omanGetObject('ResetDB') as ResetDB
    mailer = await omanGetObject('Mailer') as Mailer
  })

  afterAll(async () => {
    await omanCloseAllObjects()
  })

  it('init table', async () => {
    await udb.dropTable()
    await udb.createTable()
    await insertUserFix4(udb)
    await rdb.dropTable()
    await rdb.createTable()
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
    await userResetPasswordService(udb, rdb, form, err)
    expect(err).toContain(PASSWORD_RANGE)
  })
  it('set password, uuid check', async () => {
    const form: NewPasswordForm = { ...resetRecord, password: '1234', uuid: 'xxxx' }
    const err: ErrorConst[] = []
    await userResetPasswordService(udb, rdb, form, err)
    expect(err).toContain(INVALID_DATA)
  })
  it('set password, token check', async () => {
    const form: NewPasswordForm = { ...resetRecord, password: '1234', token: 'xxxx' }
    const err: ErrorConst[] = []
    await userResetPasswordService(udb, rdb, form, err)
    expect(err).toContain(INVALID_DATA)
  })
  it('set password', async () => {
    const form: NewPasswordForm = { ...resetRecord, password: '5678' }
    const err: ErrorConst[] = []
    await userResetPasswordService(udb, rdb, form, err)
    expect(err.length).toBe(0)
  })
  it('check db', async () => {
    const user = await udb.findUserByEmail('user1@mail.test')
    if (!user) throw new Error()
    expect(await checkHash('5678', user.hash)).toBe(true)
  })

})
