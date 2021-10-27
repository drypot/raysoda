import { omanCloseAllObjects, omanGetObject, omanNewSession } from '@server/oman/oman'
import supertest, { SuperAgentTest } from 'supertest'
import { useUserPasswordApi } from '@server/domain/user/api/user-password-api'
import { Mailer } from '@server/mailer/mailer2'
import { EMAIL_NOT_FOUND, EMAIL_PATTERN, INVALID_DATA, PASSWORD_RANGE } from '@common/type/error-const'
import { checkHash } from '@common/util/hash'
import { NewPasswordForm, PasswordMailLog } from '@common/type/password'
import { PwMailDB } from '@server/db/password/pwmail-db'
import { useUserAuthApi } from '@server/domain/user/api/user-auth-api'
import { Express2 } from '@server/express/express2'
import { insertUserFix4 } from '@server/db/user/fixture/user-fix'
import { UserDB } from '@server/db/user/user-db'

describe('UserPwResetApi', () => {

  let udb: UserDB
  let rdb: PwMailDB
  let mailer: Mailer
  let web: Express2
  let sat: SuperAgentTest

  beforeAll(async () => {
    omanNewSession('config/raysoda-test.json')
    udb = await omanGetObject('UserDB') as UserDB
    rdb = await omanGetObject('PwMailDB') as PwMailDB
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
    const res = await sat.post('/api/user-password-send-mail').send({ email: 'userx@mail.test' }).expect(200)
    expect(res.body.err).toContain(EMAIL_NOT_FOUND)
  })
  it('send mail, email format check', async () => {
    const res = await sat.post('/api/user-password-send-mail').send({ email: 'userx.mail.test' }).expect(200)
    expect(res.body.err).toContain(EMAIL_PATTERN)
  })
  it('send mail', async () => {
    const res = await sat.post('/api/user-password-send-mail').send({ email: 'user1@mail.test' }).expect(200)
    expect(res.body).toEqual({})
  })

  let rec: PasswordMailLog = { id: 0, email: '', random: '' }

  it('check db', async () => {
    const r = await rdb.findByEmail('user1@mail.test')
    if (!r) throw new Error()
    rec = r
  })
  it('set password, password format check', async () => {
    const form: NewPasswordForm = { id: rec.id, random: rec.random, password: '123' }
    const res = await sat.post('/api/user-password-reset').send(form).expect(200)
    expect(res.body.err).toContain(PASSWORD_RANGE)
  })
  it('set password, uuid check', async () => {
    const form: NewPasswordForm = { id: 999, random: rec.random,  password: '1234' }
    const res = await sat.post('/api/user-password-reset').send(form).expect(200)
    expect(res.body.err).toContain(INVALID_DATA)
  })
  it('set password, token check', async () => {
    const form: NewPasswordForm = { id: rec.id, random: 'xxx', password: '1234' }
    const res = await sat.post('/api/user-password-reset').send(form).expect(200)
    expect(res.body.err).toContain(INVALID_DATA)
  })
  it('set password', async () => {
    const form: NewPasswordForm = { id: rec.id, random: rec.random, password: '5678' }
    const res = await sat.post('/api/user-password-reset').send(form).expect(200)
    expect(res.body).toEqual({})
  })
  it('check db', async () => {
    const user = await udb.findUserByEmail('user1@mail.test')
    if (!user) throw new Error()
    expect(await checkHash('5678', user.hash)).toBe(true)
  })

})
