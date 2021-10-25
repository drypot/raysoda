import supertest, { SuperAgentTest } from 'supertest'
import { EMAIL_DUPE, EMAIL_RANGE, NAME_DUPE, NAME_RANGE, PASSWORD_RANGE } from '@common/type/error-const'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '@server/oman/oman'
import { Express2 } from '@server/express/express2'
import { useUserRegisterApi } from '@server/domain/user/api/user-register-api'
import { insertUserFix4 } from '@server/db/user/fixture/user-fix'
import { UserDB } from '@server/db/user/user-db'
import { checkHash } from '@common/util/hash'
import { newUserRegisterForm } from '@common/type/user-form'

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
  it('format check works', async () => {
    const s33 = 'x'.repeat(33)
    const s65 = 'x'.repeat(66)
    const form = newUserRegisterForm({
      name: s33, email: s65, password: s33
    })
    const res = await sat.post('/api/user-register').send(form).expect(200)
    const err = res.body.err
    expect(err).toContain(NAME_RANGE)
    expect(err).toContain(EMAIL_RANGE)
    expect(err).toContain(PASSWORD_RANGE)
  })
  it('dupe name check works', async () => {
    const form = { name: 'User 2', email: 'usery@mail.test', password: '1234' }
    const res = await sat.post('/api/user-register').send(form).expect(200)
    const err = res.body.err
    expect(err).toContain(NAME_DUPE)
  })
  it('dupe home check works', async () => {
    const form = { name: 'user2', email: 'usery@mail.test', password: '1234' }
    const res = await sat.post('/api/user-register').send(form).expect(200)
    const err = res.body.err
    expect(err).toContain(NAME_DUPE)
  })
  it('dupe email check works', async () => {
    const form = { name: 'User Y', email: 'user2@mail.test', password: '1234' }
    const res = await sat.post('/api/user-register').send(form).expect(200)
    const err = res.body.err
    expect(err).toContain(EMAIL_DUPE)
  })

})
