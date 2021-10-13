import { Express2 } from '../../../_express/express2'
import supertest, { SuperAgentTest } from 'supertest'
import { useUserAuthPage } from './user-auth-page'
import { UserDB } from '../../../../db/user/user-db'
import { useUserAuthApi } from '../api/user-auth-api'
import { insertUserFix4, USER1_LOGIN } from '../../../../db/user/fixture/user-fix'
import { loginForTest } from '../api/user-auth-api-fixture'
import { NOT_AUTHENTICATED } from '../../../../_type/error-const'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '../../../../oman/oman'

describe('UserAuthPage', () => {

  let udb: UserDB
  let web: Express2
  let sat: SuperAgentTest

  beforeAll(async () => {
    omanNewSession('config/raysoda-test.json')
    udb = await omanGetObject('UserDB') as UserDB
    web = await omanGetObject('Express2') as Express2
    await useUserAuthApi()
    await useUserAuthPage()
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

  it('login', async () => {
    await sat.get('/login').expect(200).expect(/<title>Login/)
  })

  it('login as user1', async () => {
    await loginForTest(sat, USER1_LOGIN)
  })
  it('login-info 1', async () => {
    const res = await sat.get('/api/login-info').expect(200)
    expect(res.body.err).toBeUndefined()
  })
  it('logout', async () => {
    await sat.get('/logout').expect(302).expect('Location', '/')
  })
  it('login-info fails', async () => {
    const res = await sat.get('/api/login-info').expect(200)
    expect(res.body.err).toContain(NOT_AUTHENTICATED)
  })

})
