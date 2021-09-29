import { Config, configFrom } from '../../_config/config.js'
import { DB } from '../../db/_db/db.js'
import { PwResetDB } from '../../db/pwreset/pwreset-db.js'
import { Mailer } from '../../mailer/mailer2.js'
import { UserDB } from '../../db/user/user-db.js'
import { insertUserFix4 } from '../../db/user/user-db-fixture.js'
import { NewPasswordForm, pwResetPasswordService, pwSendMailService } from './password-service.js'
import { Error2 } from '../../_error/error2.js'
import { checkHash } from '../../_util/hash.js'
import { INVALID_DATA } from '../../_error/error-basic.js'
import { EMAIL_NOT_FOUND, EMAIL_PATTERN, PASSWORD_RANGE } from '../../_error/error-user.js'

describe('Password Service', () => {

  let config: Config
  let db: DB
  let udb: UserDB
  let rdb: PwResetDB
  let mailer: Mailer

  beforeAll(async () => {
    config = configFrom('config/app-test.json')
    db = await DB.from(config).createDatabase()
    udb = UserDB.from(db)
    rdb = PwResetDB.from(db)
    mailer = Mailer.from(config).initTransport()
  })

  afterAll(async () => {
    await db.close()
  })

  describe('password reset', () => {
    it('init table', async () => {
      await udb.dropTable()
      await udb.createTable(false)
      await insertUserFix4(udb)
      await rdb.dropTable()
      await rdb.createTable(false)
    })
    it('send mail, email existence check', async () => {
      const err: Error2[] = []
      await pwSendMailService(mailer, udb, rdb, 'userx@mail.test', err)
      expect(err).toContain(EMAIL_NOT_FOUND)
    })
    it('send mail, email format check', async () => {
      const err: Error2[] = []
      await pwSendMailService(mailer, udb, rdb, 'userx.mail.test', err)
      expect(err).toContain(EMAIL_PATTERN)
    })
    it('send mail', async () => {
      const err: Error2[] = []
      await pwSendMailService(mailer, udb, rdb, 'user1@mail.test', err)
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
      const err: Error2[] = []
      await pwResetPasswordService(udb, rdb, form, err)
      expect(err).toContain(PASSWORD_RANGE)
    })
    it('set password, uuid check', async () => {
      const form: NewPasswordForm = { ...resetRecord, password: '1234', uuid: 'xxxx' }
      const err: Error2[] = []
      await pwResetPasswordService(udb, rdb, form, err)
      expect(err).toContain(INVALID_DATA)
    })
    it('set password, token check', async () => {
      const form: NewPasswordForm = { ...resetRecord, password: '1234', token: 'xxxx' }
      const err: Error2[] = []
      await pwResetPasswordService(udb, rdb, form, err)
      expect(err).toContain(INVALID_DATA)
    })
    it('set password', async () => {
      const form: NewPasswordForm = { ...resetRecord, password: '5678' }
      const err: Error2[] = []
      await pwResetPasswordService(udb, rdb, form, err)
      expect(err.length).toBe(0)
    })
    it('check db', async () => {
      const user = await udb.findUserByEmail('user1@mail.test')
      if (!user) throw new Error()
      expect(await checkHash('5678', user.hash)).toBe(true)
    })
  })

})
