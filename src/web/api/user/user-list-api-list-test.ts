import { readConfigSync } from '../../../_util/config-loader.js'
import { DB } from '../../../db/_db/db.js'
import { UserDB } from '../../../db/user/user-db.js'
import { insertUserFix4 } from '../../../db/user/user-db-fixture.js'
import { Express2 } from '../../_express/express2.js'
import { SuperAgentTest } from 'supertest'
import { registerLoginApi } from '../user-login/login-api.js'
import { registerUserListApi } from './user-list-api.js'
import { Config } from '../../../_type/config.js'
import { UserCache } from '../../../db/user/user-cache.js'

describe('User List Api', () => {

  let config: Config

  let db: DB
  let udb: UserDB
  let uc: UserCache

  let web: Express2
  let request: SuperAgentTest

  beforeAll(async () => {
    config = readConfigSync('config/app-test.json')

    db = await DB.from(config).createDatabase()
    udb = UserDB.from(db)
    uc = UserCache.from(udb)

    web = await Express2.from(config).start()
    registerLoginApi(web, uc)
    registerUserListApi(web, udb)
    request = web.spawnRequest()
  })

  afterAll(async () => {
    await web.close()
    await db.close()
  })

  describe('user list', () => {
    it('init table', async () => {
      await udb.dropTable()
      await udb.createTable(false)
    })
    it('fill fix', async () => {
      await insertUserFix4(udb)
    })
    it('get list', async () => {
      const res = await request.get('/api/user-list').expect(200)
      const l = res.body.user
      expect(l.length).toBe(4)
      // ordered by pdate desc
      expect(l[0].home).toBe('user2')
      expect(l[1].home).toBe('user3')
      expect(l[2].home).toBe('user1')
      expect(l[3].home).toBe('admin')
    })
    it('get p 1, ps 3', async () => {
      const res = await request.get('/api/user-list?p=1&ps=3').expect(200)
      const l = res.body.user
      expect(l.length).toBe(3)
      // ordered by pdate desc
      expect(l[0].home).toBe('user2')
      expect(l[1].home).toBe('user3')
      expect(l[2].home).toBe('user1')
    })
  })

})
