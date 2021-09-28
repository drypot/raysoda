import { Config, configFrom } from '../../_config/config.js'
import { DB } from '../../db/_db/db.js'
import { UserDB } from '../../db/user/user-db.js'
import { insertUserFix4 } from '../../db/user/user-db-fixture.js'
import { Express2 } from '../_express/express2.js'
import { SuperAgentTest } from 'supertest'
import { registerUserLoginApi } from './user-login-api.js'
import { AdminLogin, loginForTest } from './user-login-api-fixture.js'
import { registerUserListApi } from './user-list-api.js'

describe('User List Api', () => {

  let config: Config

  let db: DB
  let udb: UserDB
  let web: Express2
  let request: SuperAgentTest

  beforeAll(async () => {
    config = configFrom('config/app-test.json')

    db = await DB.from(config).createDatabase()
    udb = UserDB.from(db)

    web = await Express2.from(config).start()
    registerUserLoginApi(web, udb)
    registerUserListApi(web, udb)
    request = web.spawnRequest()
  })

  afterAll(async () => {
    await web.close()
    await db.close()
  })

  describe('user search', () => {
    it('init table', async () => {
      await udb.dropTable()
      await udb.createTable(false)
    })
    it('fill fix', async () => {
      await insertUserFix4(udb)
    })
    it('search user1', async () => {
      const res = await request.get('/api/user-list?q=user1').expect(200)
      const l = res.body.user
      expect(l.length).toBe(1)
      expect(l[0].home).toBe('user1')
    })
    it('search user1@mail.test as user', async () => {
      const res = await request.get('/api/user-list?q=user1@mail.test').expect(200)
      const l = res.body.user
      expect(l.length).toBe(0)
    })
    it('login as admin', async () => {
      await loginForTest(request, AdminLogin)
    })
    it('search user1@mail.test as user', async () => {
      const res = await request.get('/api/user-list?q=user1@mail.test').expect(200)
      const l = res.body.user
      expect(l.length).toBe(1)
      expect(l[0].home).toBe('user1')
    })
    it('search userx', async () => {
      const res = await request.get('/api/user-list?q=userx').expect(200)
      const l = res.body.user
      expect(l.length).toBe(0)
    })
  })

})
