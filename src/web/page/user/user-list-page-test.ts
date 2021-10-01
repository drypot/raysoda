import { readConfigSync } from '../../../_util/config-loader.js'
import { DB } from '../../../db/_db/db.js'
import { UserDB } from '../../../db/user/user-db.js'
import { Express2 } from '../../_express/express2.js'
import { SuperAgentTest } from 'supertest'
import { registerLoginApi } from '../../api/user-login/login-api.js'
import { registerUserListPage } from './user-list-page.js'
import { Config } from '../../../_type/config.js'
import { UserCache } from '../../../db/user/user-cache.js'

describe('User List Page', () => {

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
    registerUserListPage(web, udb)
    request = web.spawnRequest()
  })

  afterAll(async () => {
    await web.close()
    await db.close()
  })

  describe('user list pages', () => {
    it('user-list', async () => {
      await request.get('/user-list').expect(200).expect(/<title>User List/)
    })
  })

})
