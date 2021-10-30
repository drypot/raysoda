import supertest, { SuperAgentTest } from 'supertest'
import {
  EMAIL_DUPE,
  EMAIL_PATTERN,
  EMAIL_RANGE,
  HOME_RANGE,
  NAME_RANGE,
  PASSWORD_EMPTY,
  PASSWORD_RANGE
} from '@common/type/error-const'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '@server/oman/oman'
import { Express2 } from '@server/express/express2'
import { useUserRegisterApi } from '@server/domain/user/api/user-register-api'
import { userFixInsert4 } from '@server/db/user/fixture/user-fix'
import { UserDB } from '@server/db/user/user-db'
import { checkHash } from '@common/util/hash'
import { UserRegisterForm } from '@common/type/user-form'

describe('UserRegisterApi', () => {

  let udb: UserDB
  let web: Express2
  let sat: SuperAgentTest

  beforeAll(async () => {
    omanNewSession('config/raysoda-test.json')
    udb = await omanGetObject('UserDB') as UserDB
    web = await omanGetObject('Express2') as Express2
    await useUserRegisterApi()
    await web.start()
    sat = supertest.agent(web.server)
  })

  afterAll(async () => {
    await omanCloseAllObjects()
  })

  it('init table', async () => {
    await udb.dropTable()
    await udb.createTable()
  })
  it('fill fix', async () => {
    await userFixInsert4(udb)
  })

  it('register new user works', async () => {
    const form: UserRegisterForm = { email: 'userx@mail.test', password: '1234' }
    const res = await sat.post('/api/user-register').send(form).expect(200)
    expect(res.body.user.id).toBeDefined()
  })
  it('check db', async () => {
    const user = await udb.findUserByEmail('userx@mail.test')
    if (!user) throw new Error()
    expect(user.id).toBe(5)
    expect(user.email).toBe('userx@mail.test')
    expect(user.name).toBe('userx')
    expect(user.home).toBe('userx')
    expect(await checkHash('1234', user.hash)).toBe(true)
    expect(user.status).toBe('v')
    expect(user.admin).toBe(false)
  })

  // name 이나 home 이 점유되어 있으면 뒤에 숫자를 계속 붙여서 시도한다.
  it('duped name should work', async () => {
    const form: UserRegisterForm = { email: 'userx@mail2.test', password: '1234' }
    const res = await sat.post('/api/user-register').send(form).expect(200)
    expect(res.body.err).toBeUndefined()
  })
  it('check db', async () => {
    const user = await udb.findUserById(6)
    if (!user) throw new Error()
    expect(user.email).toBe('userx@mail2.test')
    expect(user.name).toMatch(/userx[0-9]/)
    expect(user.home).toMatch(/userx[0-9]/)
  })

  it('register 31 length name works', async () => {
    const form: UserRegisterForm = { email: 'u'.repeat(31) + '@mail.test', password: '1234' }
    const res = await sat.post('/api/user-register').send(form).expect(200)
    expect(res.body.err).toBeUndefined()
  })
  it('register 31 length name again works', async () => {
    const form: UserRegisterForm = { email: 'u'.repeat(31) + '@mail2.test', password: '1234' }
    const res = await sat.post('/api/user-register').send(form).expect(200)
    expect(res.body.err).toBeUndefined()
  })

  it('register 32 length name works', async () => {
    const form: UserRegisterForm = { email: 'u'.repeat(32) + '@mail.test', password: '1234' }
    const res = await sat.post('/api/user-register').send(form).expect(200)
    expect(res.body.err).toBeUndefined()
  })
  it('register 32 length name again fails', async () => {
    const form: UserRegisterForm = { email: 'u'.repeat(32) + '@mail2.test', password: '1234' }
    const res = await sat.post('/api/user-register').send(form).expect(200)
    expect(res.body.err).toContain(NAME_RANGE)
    expect(res.body.err).toContain(HOME_RANGE)
  })

  it('duped email fails', async () => {
    const form: UserRegisterForm = { email: 'userx@mail.test', password: '1234' }
    const res = await sat.post('/api/user-register').send(form).expect(200)
    expect(res.body.err).toContain(EMAIL_DUPE)
  })
  it('duped case email fails', async () => {
    const form: UserRegisterForm = { email: 'USERX@MAIL.TEST', password: '1234' }
    const res = await sat.post('/api/user-register').send(form).expect(200)
    expect(res.body.err).toContain(EMAIL_DUPE)
  })

  it('length 7 email fails', async () => {
    const form: UserRegisterForm = { email: 'x'.repeat(7), password: '1234' }
    const res = await sat.post('/api/user-register').send(form).expect(200)
    expect(res.body.err).toContain(EMAIL_RANGE)
  })
  it('length 8 email ok', async () => {
    const form: UserRegisterForm = { email: 'x'.repeat(8), password: '1234' }
    const res = await sat.post('/api/user-register').send(form).expect(200)
    expect(res.body.err).not.toContain(EMAIL_RANGE)
  })
  it('length 64 email ok', async () => {
    const form: UserRegisterForm = { email: 'x'.repeat(64), password: '1234' }
    const res = await sat.post('/api/user-register').send(form).expect(200)
    expect(res.body.err).not.toContain(EMAIL_RANGE)
  })
  it('length 65 email fails', async () => {
    const form: UserRegisterForm = { email: 'x'.repeat(65), password: '1234' }
    const res = await sat.post('/api/user-register').send(form).expect(200)
    expect(res.body.err).toContain(EMAIL_RANGE)
  })
  it('invalid email format fails', async () => {
    const form: UserRegisterForm = { email: 'x'.repeat(8), password: '1234' }
    const res = await sat.post('/api/user-register').send(form).expect(200)
    expect(res.body.err).toContain(EMAIL_PATTERN)
  })

  it('empty password fails', async () => {
    const form: UserRegisterForm = { email: 'user2@mail.test', password: '' }
    const res = await sat.post('/api/user-register').send(form).expect(200)
    expect(res.body.err).toContain(PASSWORD_EMPTY)
  })
  it('length 3 password fails', async () => {
    const form: UserRegisterForm = { email: 'user2@mail.test', password: 'x'.repeat(3) }
    const res = await sat.post('/api/user-register').send(form).expect(200)
    expect(res.body.err).toContain(PASSWORD_RANGE)
  })
  it('length 4 password ok', async () => {
    const form: UserRegisterForm = { email: 'user2@mail.test', password: 'x'.repeat(4) }
    const res = await sat.post('/api/user-register').send(form).expect(200)
    expect(res.body.err).not.toContain(PASSWORD_RANGE)
  })
  it('length 32 password ok', async () => {
    const form: UserRegisterForm = { email: 'user2@mail.test', password: 'x'.repeat(32) }
    const res = await sat.post('/api/user-register').send(form).expect(200)
    expect(res.body.err).not.toContain(PASSWORD_RANGE)
  })
  it('length 33 password ok', async () => {
    const form: UserRegisterForm = { email: 'user2@mail.test', password: 'x'.repeat(33) }
    const res = await sat.post('/api/user-register').send(form).expect(200)
    expect(res.body.err).toContain(PASSWORD_RANGE)
  })

})
