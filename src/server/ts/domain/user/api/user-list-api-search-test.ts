import { useUserAuthApi } from '@server/domain/user/api/user-auth-api'
import { Express2 } from '@server/express/express2'
import supertest, { SuperAgentTest } from 'supertest'
import { userLoginForTest } from '@server/domain/user/api/user-auth-api-fixture'
import { ADMIN_LOGIN_FORM, userFixInsert4 } from '@server/db/user/fixture/user-fix'
import { useUserListApi } from '@server/domain/user/api/user-list-api'
import { UserDB } from '@server/db/user/user-db'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '@server/oman/oman'

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
    await userFixInsert4(udb)
  })
  it('search user1', async () => {
    const res = await sat.get('/api/user-list?q=user1').expect(200)
    const list = res.body.userList
    expect(list.length).toBe(1)
    expect(list[0].home).toBe('user1')
  })
  it('search USER1', async () => {
    const res = await sat.get('/api/user-list?q=USER1').expect(200)
    const list = res.body.userList
    expect(list.length).toBe(1)
    expect(list[0].home).toBe('user1')
  })
  it('search User 1', async () => {
    const res = await sat.get('/api/user-list?q=User 1').expect(200)
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
    await userLoginForTest(sat, ADMIN_LOGIN_FORM)
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
