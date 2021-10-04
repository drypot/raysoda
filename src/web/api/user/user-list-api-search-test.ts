import { loadConfigSync } from '../../../_util/config-loader.js'
import { DB } from '../../../db/_db/db.js'
import { UserDB } from '../../../db/user/user-db.js'
import { ADMIN_LOGIN, insertUserFix4 } from '../../../db/user/fixture/user-fix.js'
import { Express2 } from '../../_express/express2.js'
import supertest, { SuperAgentTest } from 'supertest'
import { registerLoginApi } from '../user-login/login-api.js'
import { loginForTest } from '../user-login/login-api-fixture.js'
import { registerUserListApi } from './user-list-api.js'
import { Config } from '../../../_type/config.js'
import { UserCache } from '../../../db/user/cache/user-cache.js'

describe('UserListApi Search', () => {

  let config: Config

  let db: DB
  let udb: UserDB
  let uc: UserCache

  let web: Express2
  let sat: SuperAgentTest

  beforeAll(async () => {
    config = loadConfigSync('config/app-test.json')

    db = await DB.from(config).createDatabase()
    udb = UserDB.from(db)
    uc = UserCache.from(udb)

    web = await Express2.from(config).start()
    registerLoginApi(web, uc)
    registerUserListApi(web, udb)
    sat = supertest.agent(web.server)
  })

  afterAll(async () => {
    await web.close()
    await db.close()
  })

  it('init table', async () => {
    await udb.dropTable()
    await udb.createTable(false)
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
