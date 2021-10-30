import { useUserAuthApi } from '@server/domain/user/api/user-auth-api'
import { Express2 } from '@server/express/express2'
import supertest, { SuperAgentTest } from 'supertest'
import { ADMIN, USER1, USER2, USER3, userFixInsert4 } from '@server/db/user/fixture/user-fix'
import { useUserListApi } from '@server/domain/user/api/user-list-api'
import { UserDB } from '@server/db/user/user-db'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '@server/oman/oman'

describe('UserListApi', () => {

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
  it('default opt', async () => {
    const res = await sat.get('/api/user-list').expect(200)
    const list = res.body.userList
    expect(list.length).toBe(4)
    // ordered by pdate desc
    expect(list[0].home).toBe(USER2.home)
    expect(list[1].home).toBe(USER3.home)
    expect(list[2].home).toBe(USER1.home)
    expect(list[3].home).toBe(ADMIN.home)
  })
  it('p 1, ps 3', async () => {
    const res = await sat.get('/api/user-list?p=1&ps=3').expect(200)
    const list = res.body.userList
    expect(list.length).toBe(3)
    // ordered by pdate desc
    expect(list[0].home).toBe(USER2.home)
    expect(list[1].home).toBe(USER3.home)
    expect(list[2].home).toBe(USER1.home)
  })
  it('p 2, ps 3', async () => {
    const res = await sat.get('/api/user-list?p=2&ps=3').expect(200)
    const list = res.body.userList
    expect(list.length).toBe(1)
    // ordered by pdate desc
    expect(list[0].home).toBe(ADMIN.home)
  })
  it('p 3, ps 3', async () => {
    const res = await sat.get('/api/user-list?p=3&ps=3').expect(200)
    const list = res.body.userList
    expect(list.length).toBe(0)
  })

})
