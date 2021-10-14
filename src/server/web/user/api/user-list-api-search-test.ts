import { UserDB } from '../../../db/user/user-db'
import { ADMIN_LOGIN, insertUserFix4 } from '../../../db/user/fixture/user-fix'
import { Express2 } from '../../_express/express2'
import supertest, { SuperAgentTest } from 'supertest'
import { useUserAuthApi } from '../../user-auth/api/user-auth-api'
import { loginForTest } from '../../user-auth/api/user-auth-api-fixture'
import { useUserListApi } from './user-list-api'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '../../../oman/oman'

describe('UserListApi Search', () => {

  let udb: UserDB
  let web: Express2
  let sat: SuperAgentTest

  beforeAll(async () => {
    omanNewSession('config/raysoda-test.json')
    udb = await omanGetObject('UserDB') as UserDB
    web = await omanGetObject('Express2') as Express2
    await useUserAuthApi()
    await useUserListApi()
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
  it('search user1', async () => {
    const res = await sat.get('/api/user-list?q=user1').expect(200)
    const list = res.body.userList
    expect(list.length).toBe(1)
    expect(list[0].home).toBe('user1')
  })
  it('search user1@mail.test as user', async () => {
    const res = await sat.get('/api/user-list?q=user1@mail.test').expect(200)
    const list = res.body.userList
    expect(list.length).toBe(0)
  })
  it('login as admin', async () => {
    await loginForTest(sat, ADMIN_LOGIN)
  })
  it('search user1@mail.test as user', async () => {
    const res = await sat.get('/api/user-list?q=user1@mail.test').expect(200)
    const list = res.body.userList
    expect(list.length).toBe(1)
    expect(list[0].home).toBe('user1')
  })
  it('search userx', async () => {
    const res = await sat.get('/api/user-list?q=userx').expect(200)
    const list = res.body.userList
    expect(list.length).toBe(0)
  })

})
