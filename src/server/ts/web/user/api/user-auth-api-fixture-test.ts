import supertest, { SuperAgentTest } from 'supertest'
import { insertUserFix4, USER1_LOGIN } from '@server/db/user/fixture/user-fix'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '@server/oman/oman'
import { useUserAuthApi } from '@server/web/user/api/user-auth-api'
import { Express2 } from '@server/web/_express/express2'
import { loginForTest, logoutForTest } from '@server/web/user/api/user-auth-api-fixture'
import { GUEST_ID_CARD } from '@common/type/user'
import { UserDB } from '@server/db/user/user-db'

describe('UserAuthApi Fixture', () => {

  let udb: UserDB
  let web: Express2
  let sat: SuperAgentTest

  beforeAll(async () => {
    omanNewSession('config/raysoda-test.json')
    udb = await omanGetObject('UserDB') as UserDB
    web = await omanGetObject('Express2') as Express2
    await useUserAuthApi()
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
    await loginForTest(sat, USER1_LOGIN)
  })
  it('get login', async () => {
    const res = await sat.get('/api/login-info').expect(200)
    expect(res.body.user.id).toBe(1)
  })
  it('logout', async () => {
    await logoutForTest(sat)
  })
  it('get login fails', async () => {
    const res = await sat.get('/api/login-info').expect(200)
    expect(res.body.user).toEqual(GUEST_ID_CARD)
  })

})
