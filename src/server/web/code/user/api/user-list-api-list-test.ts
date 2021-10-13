import { UserDB } from '../../../../db/user/user-db'
import { insertUserFix4 } from '../../../../db/user/fixture/user-fix'
import { Express2 } from '../../../_express/express2'
import supertest, { SuperAgentTest } from 'supertest'
import { useUserAuthApi } from '../../user-auth/api/user-auth-api'
import { useUserListApi } from './user-list-api'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '../../../../oman/oman'

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
    await insertUserFix4(udb)
  })
  it('get list', async () => {
    const res = await sat.get('/api/user-list').expect(200)
    const list = res.body.userList
    expect(list.length).toBe(4)
    // ordered by pdate desc
    expect(list[0].home).toBe('user2')
    expect(list[1].home).toBe('user3')
    expect(list[2].home).toBe('user1')
    expect(list[3].home).toBe('admin')
  })
  it('get p 1, ps 3', async () => {
    const res = await sat.get('/api/user-list?p=1&ps=3').expect(200)
    const list = res.body.userList
    expect(list.length).toBe(3)
    // ordered by pdate desc
    expect(list[0].home).toBe('user2')
    expect(list[1].home).toBe('user3')
    expect(list[2].home).toBe('user1')
  })

})
