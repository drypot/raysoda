import { getUserDB, UserDB } from '../../../db/user/user-db.ts'
import { Express2, getExpress2 } from '../../../express/express2.ts'
import supertest from 'supertest'
import { closeAllObjects, initObjectContext } from '../../../oman/oman.ts'
import { useUserAuthApi } from './user-auth-api.ts'
import { useUserUpdateApi } from './user-update-api.ts'
import {
  ADMIN_LOGIN_FORM,
  insertUserFix4,
  USER1_LOGIN_FORM,
  USER2_LOGIN_FORM
} from '../../../db/user/fixture/user-fix.ts'
import type { UpdateUserStatusForm } from '../../../common/type/user-form.ts'
import { NOT_AUTHENTICATED, NOT_AUTHORIZED } from '../../../common/type/error-const.ts'
import { userLoginForTest } from './user-auth-api-fixture.ts'
import { GUEST_ID_CARD } from '../../../common/type/user.ts'

describe('UserDeactivateApi', () => {

  let udb: UserDB
  let express2: Express2
  let agent: supertest.Agent

  beforeAll(async () => {
    initObjectContext('config/raysoda-test.json')
    udb = await getUserDB()
    express2 = await getExpress2()
    await useUserAuthApi()
    await useUserUpdateApi()
    await express2.start()
    agent = supertest.agent(express2.server)
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
    const res = await agent.put('/api/user-update-status').send(form).expect(200)
    expect(res.body.err).toContain(NOT_AUTHENTICATED)
  })

  it('login as user1', async () => {
    await userLoginForTest(agent, USER1_LOGIN_FORM)
  })
  it('user1 status should be "v"', async () => {
    const user = await udb.getCachedById(1)
    expect(user?.status).toBe('v')
  })
  it('deactivate user1', async () => {
    const form: UpdateUserStatusForm = { id: 1, status: 'd' }
    const res = await agent.put('/api/user-update-status').send(form).expect(200)
    expect(res.body).toEqual({})
  })
  it('login-info returns guest', async () => {
    const res = await agent.get('/api/user-login-info').expect(200)
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
    await userLoginForTest(agent, USER2_LOGIN_FORM)
  })
  it('deactivating other fails', async () => {
    const form: UpdateUserStatusForm = { id: 3, status: 'd' }
    const res = await agent.put('/api/user-update-status').send(form).expect(200)
    expect(res.body.err).toContain(NOT_AUTHORIZED)
  })

  it('login as admin', async () => {
    await userLoginForTest(agent, ADMIN_LOGIN_FORM)
  })
  it('user3 status should be "v"', async () => {
    const user = await udb.getCachedById(3)
    expect(user?.status).toBe('v')
  })
  it('deactivating other by admin', async () => {
    const form = { id: 3, status: 'd' }
    const res = await agent.put('/api/user-update-status').send(form).expect(200)
    expect(res.body).toEqual({})
  })
  it('user3 status should be "d"', async () => {
    const user = await udb.getCachedById(3)
    expect(user?.status).toBe('d')
  })
  it('reactivating other by admin', async () => {
    const form = { id: 3, status: 'v' }
    const res = await agent.put('/api/user-update-status').send(form).expect(200)
    expect(res.body).toEqual({})
  })
  it('user3 status should be "v"', async () => {
    const user = await udb.getCachedById(3)
    expect(user?.status).toBe('v')
  })

})
