import supertest, { SuperAgentTest } from 'supertest'
import { ADMIN_LOGIN, insertUserFix4, USER1_LOGIN, USER2_LOGIN } from '@server/db/user/fixture/user-fix'
import { NOT_AUTHENTICATED, NOT_AUTHORIZED } from '@common/type/error-const'
import { useUserDeactivateApi } from '@server/domain/user/api/user-deactivate-api'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '@server/oman/oman'
import { useUserAuthApi } from '@server/domain/user/api/user-auth-api'
import { Express2 } from '@server/express/express2'
import { loginForTest } from '@server/domain/user/api/user-auth-api-fixture'
import { GUEST_ID_CARD } from '@common/type/user'
import { UserDB } from '@server/db/user/user-db'

describe('UserDeactivateApi', () => {

  let udb: UserDB
  let web: Express2
  let sat: SuperAgentTest

  beforeAll(async () => {
    omanNewSession('config/raysoda-test.json')
    udb = await omanGetObject('UserDB') as UserDB
    web = await omanGetObject('Express2') as Express2
    await useUserAuthApi()
    await useUserDeactivateApi()
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

  it('deactivating fails before login', async () => {
    const res = await sat.put('/api/user-deactivate/1').expect(200)
    expect(res.body.err).toContain(NOT_AUTHENTICATED)
  })

  it('login', async () => {
    await loginForTest(sat, USER1_LOGIN)
  })
  it('get login works', async () => {
    const res = await sat.get('/api/user-login-info').expect(200)
    expect(res.body.user.id).toBe(1)
  })
  it('deactivate user1', async () => {
    const res = await sat.put('/api/user-deactivate/1').expect(200)
    expect(res.body).toEqual({})
  })
  it('login-info returns guest', async () => {
    const res = await sat.get('/api/user-login-info').expect(200)
    expect(res.body.user).toEqual(GUEST_ID_CARD)
  })
  it('user status must be "d"', async () => {
    const user = await udb.findUserById(1)
    expect(user?.status).toBe('d')
  })

  it('login as user2', async () => {
    await loginForTest(sat, USER2_LOGIN)
  })
  it('deactivating other fails', async () => {
    const res = await sat.put('/api/user-deactivate/3').expect(200)
    expect(res.body.err).toContain(NOT_AUTHORIZED)
  })

  it('login as admin', async () => {
    await loginForTest(sat, ADMIN_LOGIN)
  })
  it('deactivating other works', async () => {
    const res = await sat.put('/api/user-deactivate/3').expect(200)
    expect(res.body).toEqual({})
  })

})
