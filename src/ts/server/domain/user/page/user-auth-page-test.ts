import { UserDB } from '@server/db/user/user-db'
import { useUserAuthApi } from '@server/domain/user/api/user-auth-api'
import { Express2 } from '@server/express/express2'
import supertest, { SuperAgentTest } from 'supertest'
import { insertUserFix4, USER1_LOGIN_FORM } from '@server/db/user/fixture/user-fix'
import { userLoginForTest } from '@server/domain/user/api/user-auth-api-fixture'
import { useUserAuthPage } from '@server/domain/user/page/user-auth-page'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '@server/oman/oman'
import { GUEST_ID_CARD } from '@common/type/user'

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
    await sat.get('/user-login').expect(200).expect(/<title>Login/)
  })

  it('login as user1', async () => {
    await userLoginForTest(sat, USER1_LOGIN_FORM)
  })
  it('login-info 1', async () => {
    const res = await sat.get('/api/user-login-info').expect(200)
    expect(res.body.err).toBeUndefined()
  })
  it('logout', async () => {
    await sat.get('/user-logout').expect(302).expect('Location', '/')
  })
  it('login-info fails', async () => {
    const res = await sat.get('/api/user-login-info').expect(200)
    expect(res.body.user).toEqual(GUEST_ID_CARD)
  })

})
