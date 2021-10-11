import { loadConfigSync } from '../../../../_util/config-loader'
import { DB } from '../../../../db/_db/db'
import { ResetDB } from '../../../../db/password/reset-db'
import { Mailer } from '../../../../mailer/mailer2'
import { UserDB } from '../../../../db/user/user-db'
import { insertUserFix4 } from '../../../../db/user/fixture/user-fix'
import { checkHash } from '../../../../_util/hash'
import { Express2 } from '../../../_express/express2'
import supertest, { SuperAgentTest } from 'supertest'
import { registerUserPasswordApi } from './user-password-api'
import { INVALID_DATA } from '../../../../_type/error'
import { EMAIL_NOT_FOUND, EMAIL_PATTERN, PASSWORD_RANGE } from '../../../../_type/error-user'
import { Config } from '../../../../_type/config'
import { UserCache } from '../../../../db/user/cache/user-cache'
import { NewPasswordForm } from '../../../../_type/password'

describe('UserPasswordApi', () => {

  let config: Config

  let db: DB
  let udb: UserDB
  let uc: UserCache

  let rdb: ResetDB
  let mailer: Mailer

  let web: Express2
  let sat: SuperAgentTest

  beforeAll(async () => {
    config = loadConfigSync('config/app-test.json')

    db = await DB.from(config).createDatabase()
    udb = UserDB.from(db)
    uc = UserCache.from(udb)

    rdb = ResetDB.from(db)
    mailer = Mailer.from(config).loadSync()

    web = Express2.from(config)
    registerUserPasswordApi(web, uc, rdb, mailer)
    await web.start()
    sat = supertest.agent(web.server)
  })

  afterAll(async () => {
    await web.close()
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
    const res = await sat.post('/api/password-send-reset-mail').send({ email: 'userx@mail.test' }).expect(200)
    expect(res.body.err).toContain(EMAIL_NOT_FOUND)
  })
  it('send mail, email format check', async () => {
    const res = await sat.post('/api/password-send-reset-mail').send({ email: 'userx.mail.test' }).expect(200)
    expect(res.body.err).toContain(EMAIL_PATTERN)
  })
  it('send mail', async () => {
    const res = await sat.post('/api/password-send-reset-mail').send({ email: 'user1@mail.test' }).expect(200)
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
    const res = await sat.post('/api/user-password-reset').send(form).expect(200)
    expect(res.body.err).toContain(PASSWORD_RANGE)
  })
  it('set password, uuid check', async () => {
    const form: NewPasswordForm = { ...resetRecord, password: '1234', uuid: 'xxxx' }
    const res = await sat.post('/api/user-password-reset').send(form).expect(200)
    expect(res.body.err).toContain(INVALID_DATA)
  })
  it('set password, token check', async () => {
    const form: NewPasswordForm = { ...resetRecord, password: '1234', token: 'xxxx' }
    const res = await sat.post('/api/user-password-reset').send(form).expect(200)
    expect(res.body.err).toContain(INVALID_DATA)
  })
  it('set password', async () => {
    const form: NewPasswordForm = { ...resetRecord, password: '5678' }
    const res = await sat.post('/api/user-password-reset').send(form).expect(200)
    expect(res.body.err).toBe(undefined)
  })
  it('check db', async () => {
    const user = await udb.findUserByEmail('user1@mail.test')
    if (!user) throw new Error()
    expect(await checkHash('5678', user.hash)).toBe(true)
  })

})