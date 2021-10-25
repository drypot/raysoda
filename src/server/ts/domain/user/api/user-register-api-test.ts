import supertest, { SuperAgentTest } from 'supertest'
import {
  EMAIL_DUPE,
  EMAIL_PATTERN,
  EMAIL_RANGE,
  NAME_DUPE,
  NAME_EMPTY,
  NAME_RANGE,
  PASSWORD_EMPTY,
  PASSWORD_RANGE
} from '@common/type/error-const'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '@server/oman/oman'
import { Express2 } from '@server/express/express2'
import { useUserRegisterApi } from '@server/domain/user/api/user-register-api'
import { insertUserFix4 } from '@server/db/user/fixture/user-fix'
import { UserDB } from '@server/db/user/user-db'
import { checkHash } from '@common/util/hash'

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
    await insertUserFix4(udb)
  })

  it('post new user works', async () => {
    const form = { name: 'User X', email: 'userx@mail.test', password: '1234' }
    const res = await sat.post('/api/user-register').send(form).expect(200)
    expect(res.body.user.id).toBe(5)
  })
  it('check db', async () => {
    const user = await udb.findUserByEmail('userx@mail.test')
    if (!user) throw new Error()
    expect(user.id).toBe(5)
    expect(user.name).toBe('User X')
    expect(user.home).toBe('User X')
    expect(user.email).toBe('userx@mail.test')
    expect(await checkHash('1234', user.hash)).toBe(true)
    expect(user.status).toBe('v')
    expect(user.admin).toBe(false)
  })

  it('duped name fails', async () => {
    const form = { name: 'User 2', email: 'usery@mail.test', password: '1234' }
    const res = await sat.post('/api/user-register').send(form).expect(200)
    expect(res.body.err).toContain(NAME_DUPE)
  })
  it('duped home fails', async () => {
    const form = { name: 'user2', email: 'usery@mail.test', password: '1234' }
    const res = await sat.post('/api/user-register').send(form).expect(200)
    expect(res.body.err).toContain(NAME_DUPE)
  })
  it('duped email fails', async () => {
    const form = { name: 'User Y', email: 'user2@mail.test', password: '1234' }
    const res = await sat.post('/api/user-register').send(form).expect(200)
    expect(res.body.err).toContain(EMAIL_DUPE)
  })

  it('empty name fails', async () => {
    const form = { name: '', email: 'user2@mail.test', password: '1234' }
    const res = await sat.post('/api/user-register').send(form).expect(200)
    expect(res.body.err).toContain(NAME_EMPTY)
  })
  it('length 32 name ok', async () => {
    const form = { name: 'x'.repeat(32), email: 'user2@mail.test', password: '1234' }
    const res = await sat.post('/api/user-register').send(form).expect(200)
    expect(res.body.err).not.toContain(NAME_RANGE)
  })
  it('length 33 name fails', async () => {
    const form = { name: 'x'.repeat(33), email: 'user2@mail.test', password: '1234' }
    const res = await sat.post('/api/user-register').send(form).expect(200)
    expect(res.body.err).toContain(NAME_RANGE)
  })

  // home 포멧 체크는 update 에서 한다.

  it('length 7 email fails', async () => {
    const form = { name: 'user2', email: 'x'.repeat(7), password: '1234' }
    const res = await sat.post('/api/user-register').send(form).expect(200)
    expect(res.body.err).toContain(EMAIL_RANGE)
  })
  it('length 8 email ok', async () => {
    const form = { name: 'user2', email: 'x'.repeat(8), password: '1234' }
    const res = await sat.post('/api/user-register').send(form).expect(200)
    expect(res.body.err).not.toContain(EMAIL_RANGE)
  })
  it('length 64 email ok', async () => {
    const form = { name: 'user2', email: 'x'.repeat(64), password: '1234' }
    const res = await sat.post('/api/user-register').send(form).expect(200)
    expect(res.body.err).not.toContain(EMAIL_RANGE)
  })
  it('length 65 email fails', async () => {
    const form = { name: 'user2', email: 'x'.repeat(65), password: '1234' }
    const res = await sat.post('/api/user-register').send(form).expect(200)
    expect(res.body.err).toContain(EMAIL_RANGE)
  })
  it('invalid email format fails', async () => {
    const form = { name: 'user2', email: 'x'.repeat(8), password: '1234' }
    const res = await sat.post('/api/user-register').send(form).expect(200)
    expect(res.body.err).toContain(EMAIL_PATTERN)
  })
  it('valid email format ok', async () => {
    const form = { name: 'user2', email: 'xxx@xxx.com', password: '1234' }
    const res = await sat.post('/api/user-register').send(form).expect(200)
    expect(res.body.err).not.toContain(EMAIL_PATTERN)
  })

  it('empty password fails', async () => {
    const form = { name: 'user2', email: 'user2@mail.test', password: '' }
    const res = await sat.post('/api/user-register').send(form).expect(200)
    expect(res.body.err).toContain(PASSWORD_EMPTY)
  })
  it('length 3 password fails', async () => {
    const form = { name: 'user2', email: 'user2@mail.test', password: 'x'.repeat(3) }
    const res = await sat.post('/api/user-register').send(form).expect(200)
    expect(res.body.err).toContain(PASSWORD_RANGE)
  })
  it('length 4 password ok', async () => {
    const form = { name: 'user2', email: 'user2@mail.test', password: 'x'.repeat(4) }
    const res = await sat.post('/api/user-register').send(form).expect(200)
    expect(res.body.err).not.toContain(PASSWORD_RANGE)
  })
  it('length 32 password ok', async () => {
    const form = { name: 'user2', email: 'user2@mail.test', password: 'x'.repeat(32) }
    const res = await sat.post('/api/user-register').send(form).expect(200)
    expect(res.body.err).not.toContain(PASSWORD_RANGE)
  })
  it('length 33 password ok', async () => {
    const form = { name: 'user2', email: 'user2@mail.test', password: 'x'.repeat(33) }
    const res = await sat.post('/api/user-register').send(form).expect(200)
    expect(res.body.err).toContain(PASSWORD_RANGE)
  })


})
