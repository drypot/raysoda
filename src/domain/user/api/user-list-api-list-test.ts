import { getUserDB, UserDB } from '../../../db/user/user-db.js'
import { Express2, getExpress2 } from '../../../express/express2.js'
import supertest from 'supertest'
import { closeAllObjects, initObjectContext } from '../../../oman/oman.js'
import { useUserAuthApi } from './user-auth-api.js'
import { useUserListApi } from './user-list-api.js'
import { ADMIN, insertUserFix4, USER1, USER2, USER3 } from '../../../db/user/fixture/user-fix.js'

describe('UserListApi', () => {

  let udb: UserDB
  let express2: Express2
  let agent: supertest.Agent

  beforeAll(async () => {
    initObjectContext('config/raysoda-test.json')
    udb = await getUserDB()
    express2 = await getExpress2()
    await useUserAuthApi()
    await useUserListApi()
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
  it('default opt', async () => {
    const res = await agent.get('/api/user-list').expect(200)
    const list = res.body.userList
    expect(list.length).toBe(4)
    // ordered by pdate desc
    expect(list[0].home).toBe(USER2.home)
    expect(list[1].home).toBe(USER3.home)
    expect(list[2].home).toBe(USER1.home)
    expect(list[3].home).toBe(ADMIN.home)
  })
  it('p 1, ps 3', async () => {
    const res = await agent.get('/api/user-list?p=1&ps=3').expect(200)
    const list = res.body.userList
    expect(list.length).toBe(3)
    // ordered by pdate desc
    expect(list[0].home).toBe(USER2.home)
    expect(list[1].home).toBe(USER3.home)
    expect(list[2].home).toBe(USER1.home)
  })
  it('p 2, ps 3', async () => {
    const res = await agent.get('/api/user-list?p=2&ps=3').expect(200)
    const list = res.body.userList
    expect(list.length).toBe(1)
    // ordered by pdate desc
    expect(list[0].home).toBe(ADMIN.home)
  })
  it('p 3, ps 3', async () => {
    const res = await agent.get('/api/user-list?p=3&ps=3').expect(200)
    const list = res.body.userList
    expect(list.length).toBe(0)
  })

})
