import { loadConfigSync } from '../../../_util/config-loader.js'
import { DB } from '../../../db/_db/db.js'
import { UserDB } from '../../../db/user/user-db.js'
import { insertUserFix4 } from '../../../db/user/fixture/user-fix.js'
import { Express2 } from '../../_express/express2.js'
import supertest, { SuperAgentTest } from 'supertest'
import { registerLoginApi } from '../user-login/login-api.js'
import { registerUserListApi } from './user-list-api.js'
import { Config } from '../../../_type/config.js'
import { UserCache } from '../../../db/user/cache/user-cache.js'

describe('UserListApi', () => {

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
