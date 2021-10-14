import { ResetDB } from '../../../db/password/reset-db'
import { Mailer } from '../../../mailer/mailer2'
import { UserDB } from '../../../db/user/user-db'
import { insertUserFix4 } from '../../../db/user/fixture/user-fix'
import { checkHash } from '../../../_util/hash'
import { Express2 } from '../../_express/express2'
import supertest, { SuperAgentTest } from 'supertest'
import { useUserPasswordApi } from './user-password-api'
import { NewPasswordForm } from '../../../_type/password'
import { EMAIL_NOT_FOUND, EMAIL_PATTERN, INVALID_DATA, PASSWORD_RANGE } from '../../../_type/error-const'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '../../../oman/oman'
import { useUserAuthApi } from './user-auth-api'

describe('UserPasswordApi', () => {

  let udb: UserDB
  let rdb: ResetDB
  let mailer: Mailer
  let web: Express2
  let sat: SuperAgentTest

  beforeAll(async () => {
    omanNewSession('config/raysoda-test.json')
    udb = await omanGetObject('UserDB') as UserDB
    rdb = await omanGetObject('ResetDB') as ResetDB
    mailer = await omanGetObject('Mailer') as Mailer
    web = await omanGetObject('Express2') as Express2
    await useUserAuthApi()
    await useUserPasswordApi()
    await web.start()
    sat = supertest.agent(web.server)
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
