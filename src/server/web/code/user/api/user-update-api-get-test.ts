import { UserDB } from '../../../../db/user/user-db'
import { ADMIN_LOGIN, insertUserFix4, USER1_LOGIN } from '../../../../db/user/fixture/user-fix'
import { Express2 } from '../../../_express/express2'
import supertest, { SuperAgentTest } from 'supertest'
import { useUserAuthApi } from '../../user-auth/api/user-auth-api'
import { loginForTest } from '../../user-auth/api/user-auth-api-fixture'
import { useUserUpdateApi } from './user-update-api'
import { NOT_AUTHENTICATED, NOT_AUTHORIZED } from '../../../../_type/error-const'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '../../../../oman/oman'

describe('UserUpdateApi Get', () => {

  let udb: UserDB
  let web: Express2
  let sat: SuperAgentTest

  beforeAll(async () => {
    omanNewSession('config/raysoda-test.json')
    udb = await omanGetObject('UserDB') as UserDB
    web = await omanGetObject('Express2') as Express2
    await useUserAuthApi()
    await useUserUpdateApi()
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
  it('get user1 without login', async () => {
    const res = await sat.get('/api/user-update-get/' + 1).expect(200)
    expect(res.body.err).toContain(NOT_AUTHENTICATED)
  })
  it('login as user1', async () => {
    await loginForTest(sat, USER1_LOGIN)
  })
  it('get user1', async () => {
    const res = await sat.get('/api/user-update-get/' + 1).expect(200)
    expect(res.body).toEqual({
      user: { name: 'User 1', home: 'user1', email: 'user1@mail.test', password: '', profile: '' }
    })
  })
  it('get user2 by user1', async () => {
    const res = await sat.get('/api/user-update-get/' + 2).expect(200)
    expect(res.body.err).toContain(NOT_AUTHORIZED)
  })
  it('login as admin', async () => {
    await loginForTest(sat, ADMIN_LOGIN)
  })
  it('get user2 by admin', async () => {
    const res = await sat.get('/api/user-update-get/' + 2).expect(200)
    expect(res.body).toEqual({
      user: { name: 'User 2', home: 'user2', email: 'user2@mail.test', password: '', profile: '' }
    })
  })

})
