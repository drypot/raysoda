import { UserDB } from '../../../../db/user/user-db'
import { insertUserFix4 } from '../../../../db/user/fixture/user-fix'
import { Express2 } from '../../../_express/express2'
import supertest, { SuperAgentTest } from 'supertest'
import { useUserRegisterApi } from './user-register-api'
import {
  EMAIL_DUPE,
  EMAIL_RANGE,
  HOME_DUPE,
  HOME_RANGE,
  NAME_DUPE,
  NAME_RANGE,
  PASSWORD_RANGE
} from '../../../../_type/error-const'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '../../../../oman/oman'

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
  it('post new user', async () => {
    const form = { name: 'User Y', email: 'usery@mail.test', password: '1234' }
    const res = await sat.post('/api/user-register').send(form).expect(200)
    expect(res.body.id).toBe(5)
  })
  it('check db', async () => {
    const user = await udb.findUserById(5)
    expect(user?.name).toBe('User Y')
  })
  it('format check works', async () => {
    const s33 = 'x'.repeat(33)
    const s65 = 'x'.repeat(66)
    const form = { name: s33, email: s65, password: s33 }
    const res = await sat.post('/api/user-register').send(form).expect(200)
    expect(res.body.err).toContain(NAME_RANGE)
    expect(res.body.err).toContain(HOME_RANGE)
    expect(res.body.err).toContain(EMAIL_RANGE)
    expect(res.body.err).toContain(PASSWORD_RANGE)
  })
  it('dupe check works', async () => {
    const form = { name: 'User 2', email: 'user2@mail.test', password: '1234' }
    const res = await sat.post('/api/user-register').send(form).expect(200)
    expect(res.body.err).toContain(NAME_DUPE)
    expect(res.body.err).toContain(HOME_DUPE)
    expect(res.body.err).toContain(EMAIL_DUPE)
  })

})
