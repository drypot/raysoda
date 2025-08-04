import { getUserDB, UserDB } from '../../../db/user/user-db.ts'
import { Express2, getExpress2 } from '../../../express/express2.ts'
import supertest from 'supertest'
import { closeAllObjects, initObjectContext } from '../../../oman/oman.ts'
import { useUserAuthApi } from './user-auth-api.ts'
import { useUserListApi } from './user-list-api.ts'
import { ADMIN_LOGIN_FORM, insertUserFix4, USER1 } from '../../../db/user/fixture/user-fix.ts'
import { userLoginForTest } from './user-auth-api-fixture.ts'

describe('UserListApi Search', () => {

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
  it('search name1', async () => {
    const res = await agent.get('/api/user-list?q=name1').expect(200)
    const list = res.body.userList
    expect(list.length).toBe(1)
    expect(list[0].home).toBe(USER1.home)
  })
  it('search NAME1', async () => {
    const res = await agent.get('/api/user-list?q=NAME1').expect(200)
    const list = res.body.userList
    expect(list.length).toBe(1)
    expect(list[0].home).toBe(USER1.home)
  })
  it('search home1', async () => {
    const res = await agent.get('/api/user-list?q=home1').expect(200)
    const list = res.body.userList
    expect(list.length).toBe(1)
    expect(list[0].home).toBe(USER1.home)
  })
  it('search HOME1', async () => {
    const res = await agent.get('/api/user-list?q=HOME1').expect(200)
    const list = res.body.userList
    expect(list.length).toBe(1)
    expect(list[0].home).toBe(USER1.home)
  })
  it('search mail1@mail.test as user', async () => {
    const res = await agent.get('/api/user-list?q=mail1@mail.test').expect(200)
    const list = res.body.userList
    expect(list.length).toBe(0)
  })
  it('login as admin', async () => {
    await userLoginForTest(agent, ADMIN_LOGIN_FORM)
  })
  it('search mail1@mail.test as user', async () => {
    const res = await agent.get('/api/user-list?q=mail1@mail.test').expect(200)
    const list = res.body.userList
    expect(list.length).toBe(1)
    expect(list[0].home).toBe(USER1.home)
  })
  it('search userx', async () => {
    const res = await agent.get('/api/user-list?q=userx').expect(200)
    const list = res.body.userList
    expect(list.length).toBe(0)
  })

})
