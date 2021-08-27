import { Config, configFrom } from '../../config/config.js'
import { DB } from '../../db/_db/db.js'
import { PwResetDB } from '../../db/pwreset/pwreset-db.js'
import { Mailer } from '../../lib/mailer/mailer2.js'
import { UserDB } from '../../db/user/user-db.js'
import { insertUserFix4 } from '../../db/user/user-db-fixture.js'
import { NewPasswordForm, pwResetSendMailService, pwResetSetPasswordService } from './pwreset-service.js'
import { FormError, INVALID_DATA } from '../../lib/base/error2.js'
import { EMAIL_NOT_FOUND, EMAIL_PATTERN, PASSWORD_RANGE } from './form/user-form.js'
import { checkHash } from '../../lib/base/hash.js'

describe('Password Reset Service', () => {

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
      const errs: FormError[] = []
      await pwResetSendMailService(mailer, udb, rdb, 'userx@mail.test', errs)
      expect(errs).toContain(EMAIL_NOT_FOUND)
    })
    it('send mail, email format check', async () => {
      const errs: FormError[] = []
      await pwResetSendMailService(mailer, udb, rdb, 'userx.mail.test', errs)
      expect(errs).toContain(EMAIL_PATTERN)
    })
    it('send mail', async () => {
      const errs: FormError[] = []
      await pwResetSendMailService(mailer, udb, rdb, 'user1@mail.test', errs)
      expect(errs.length).toBe(0)
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
      const errs: FormError[] = []
      await pwResetSetPasswordService(udb, rdb, form, errs)
      expect(errs.length).toBe(1)
      expect(errs).toContain(PASSWORD_RANGE)
    })
    it('set password, uuid check', async () => {
      const form: NewPasswordForm = { ...resetRecord, password: '1234', uuid: 'xxxx' }
      const errs: FormError[] = []
      await pwResetSetPasswordService(udb, rdb, form, errs)
      expect(errs.length).toBe(1)
      expect(errs).toContain(INVALID_DATA)
    })
    it('set password, token check', async () => {
      const form: NewPasswordForm = { ...resetRecord, password: '1234', token: 'xxxx' }
      const errs: FormError[] = []
      await pwResetSetPasswordService(udb, rdb, form, errs)
      expect(errs.length).toBe(1)
      expect(errs).toContain(INVALID_DATA)
    })
    it('set password', async () => {
      const form: NewPasswordForm = { ...resetRecord, password: '5678' }
      const errs: FormError[] = []
      await pwResetSetPasswordService(udb, rdb, form, errs)
      expect(errs.length).toBe(0)
    })
    it('check db', async () => {
      const user = await udb.findUserByEmail('user1@mail.test')
      if (!user) throw new Error()
      expect(await checkHash('5678', user.hash)).toBe(true)
    })
  })

})
