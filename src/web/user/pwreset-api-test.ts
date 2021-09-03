import { Config, configFrom } from '../../config/config.js'
import { DB } from '../../db/_db/db.js'
import { PwResetDB } from '../../db/pwreset/pwreset-db.js'
import { Mailer } from '../../lib/mailer/mailer2.js'
import { UserDB } from '../../db/user/user-db.js'
import { insertUserFix4 } from '../../db/user/user-db-fixture.js'
import { NewPasswordForm } from '../../service/user/pwreset-service.js'
import { INVALID_DATA } from '../../lib/base/error2.js'
import { EMAIL_NOT_FOUND, EMAIL_PATTERN, PASSWORD_RANGE } from '../../service/user/form/user-form.js'
import { checkHash } from '../../lib/base/hash.js'
import { Express2 } from '../_express/express2.js'
import { SuperAgentTest } from 'supertest'
import { registerPwResetApi } from './pwreset-api.js'

describe('Password Reset Service', () => {

  let config: Config

  let db: DB
  let udb: UserDB
  let rdb: PwResetDB

  let mailer: Mailer

  let web: Express2
  let request: SuperAgentTest

  beforeAll(async () => {
    config = configFrom('config/app-test.json')

    db = await DB.from(config).createDatabase()
    udb = UserDB.from(db)
    rdb = PwResetDB.from(db)

    mailer = Mailer.from(config).initTransport()

    web = await Express2.from(config).start()
    registerPwResetApi(web, udb, rdb, mailer)
    request = web.spawnRequest()
  })

  afterAll(async () => {
    await web.close()
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
      const res = await request.post('/api/password-reset/send-mail').send({ email: 'userx@mail.test' }).expect(200)
      expect(res.body.err).toContain(EMAIL_NOT_FOUND)
    })
    it('send mail, email format check', async () => {
      const res = await request.post('/api/password-reset/send-mail').send({ email: 'userx.mail.test' }).expect(200)
      expect(res.body.err).toContain(EMAIL_PATTERN)
    })
    it('send mail', async () => {
      const res = await request.post('/api/password-reset/send-mail').send({ email: 'user1@mail.test' }).expect(200)
      expect(res.body.err).toBe(undefined)
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
      const res = await request.post('/api/password-reset/set-password').send(form).expect(200)
      expect(res.body.err).toContain(PASSWORD_RANGE)
    })
    it('set password, uuid check', async () => {
      const form: NewPasswordForm = { ...resetRecord, password: '1234', uuid: 'xxxx' }
      const res = await request.post('/api/password-reset/set-password').send(form).expect(200)
      expect(res.body.err).toContain(INVALID_DATA)
    })
    it('set password, token check', async () => {
      const form: NewPasswordForm = { ...resetRecord, password: '1234', token: 'xxxx' }
      const res = await request.post('/api/password-reset/set-password').send(form).expect(200)
      expect(res.body.err).toContain(INVALID_DATA)
    })
    it('set password', async () => {
      const form: NewPasswordForm = { ...resetRecord, password: '5678' }
      const res = await request.post('/api/password-reset/set-password').send(form).expect(200)
      expect(res.body.err).toBe(undefined)
    })
    it('check db', async () => {
      const user = await udb.findUserByEmail('user1@mail.test')
      if (!user) throw new Error()
      expect(await checkHash('5678', user.hash)).toBe(true)
    })
  })

})
