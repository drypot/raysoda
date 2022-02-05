import supertest, { SuperAgentTest } from 'supertest'
import { ADMIN_LOGIN_FORM, insertUserFix4, USER1_LOGIN_FORM, USER2_LOGIN_FORM } from '@server/db/user/fixture/user-fix'
import { NOT_AUTHENTICATED, NOT_AUTHORIZED } from '@common/type/error-const'
import { closeAllObjects, getObject, initObjectContext } from '@server/oman/oman'
import { useUserAuthApi } from '@server/domain/user/api/user-auth-api'
import { Express2 } from '@server/express/express2'
import { userLoginForTest } from '@server/domain/user/api/user-auth-api-fixture'
import { GUEST_ID_CARD } from '@common/type/user'
import { UserDB } from '@server/db/user/user-db'
import { useUserUpdateApi } from '@server/domain/user/api/user-update-api'
import { UpdateUserStatusForm } from '@common/type/user-form'

describe('UserDeactivateApi', () => {

  let udb: UserDB
  let web: Express2
  let sat: SuperAgentTest

  beforeAll(async () => {
    initObjectContext('config/raysoda-test.json')
    udb = await getObject('UserDB') as UserDB
    web = await getObject('Express2') as Express2
    await useUserAuthApi()
    await useUserUpdateApi()
    await web.start()
    sat = supertest.agent(web.server)
  })

  afterAll(async () => {
    await closeAllObjects()
  })

  it('init table', async () => {
    await udb.dropTable()
    await udb.createTable()
  })
  it('fill fix', async () => {
    await insertUserFix4(udb)
  })

  it('deactivating fails before login', async () => {
    const form: UpdateUserStatusForm = { id: 1, status: 'd' }
    const res = await sat.put('/api/user-update-status').send(form).expect(200)
    expect(res.body.err).toContain(NOT_AUTHENTICATED)
  })

  it('login as user1', async () => {
    await userLoginForTest(sat, USER1_LOGIN_FORM)
  })
  it('user1 status should be "v"', async () => {
    const user = await udb.getCachedById(1)
    expect(user?.status).toBe('v')
  })
  it('deactivate user1', async () => {
    const form: UpdateUserStatusForm = { id: 1, status: 'd' }
    const res = await sat.put('/api/user-update-status').send(form).expect(200)
    expect(res.body).toEqual({})
  })
  it('login-info returns guest', async () => {
    const res = await sat.get('/api/user-login-info').expect(200)
    expect(res.body.user).toEqual(GUEST_ID_CARD)
  })
  it('user1 status should be d', async () => {
    const user = await udb.getUserById(1)
    expect(user?.status).toBe('d')
  })
  it('user1 status should be d in cache', async () => {
    const user = await udb.getCachedById(1)
    expect(user?.status).toBe('d')
  })

  it('login as user2', async () => {
    await userLoginForTest(sat, USER2_LOGIN_FORM)
  })
  it('deactivating other fails', async () => {
    const form: UpdateUserStatusForm = { id: 3, status: 'd' }
    const res = await sat.put('/api/user-update-status').send(form).expect(200)
    expect(res.body.err).toContain(NOT_AUTHORIZED)
  })

  it('login as admin', async () => {
    await userLoginForTest(sat, ADMIN_LOGIN_FORM)
  })
  it('user3 status should be "v"', async () => {
    const user = await udb.getCachedById(3)
    expect(user?.status).toBe('v')
  })
  it('deactivating other by admin', async () => {
    const form = { id: 3, status: 'd' }
    const res = await sat.put('/api/user-update-status').send(form).expect(200)
    expect(res.body).toEqual({})
  })
  it('user3 status should be "d"', async () => {
    const user = await udb.getCachedById(3)
    expect(user?.status).toBe('d')
  })
  it('reactivating other by admin', async () => {
    const form = { id: 3, status: 'v' }
    const res = await sat.put('/api/user-update-status').send(form).expect(200)
    expect(res.body).toEqual({})
  })
  it('user3 status should be "v"', async () => {
    const user = await udb.getCachedById(3)
    expect(user?.status).toBe('v')
  })

})
