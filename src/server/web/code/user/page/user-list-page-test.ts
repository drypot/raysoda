import { loadConfigSync } from '../../../../_util/config-loader.js'
import { DB } from '../../../../db/_db/db.js'
import { UserDB } from '../../../../db/user/user-db.js'
import { Express2 } from '../../../_express/express2.js'
import supertest, { SuperAgentTest } from 'supertest'
import { registerUserAuthApi } from '../../user-auth/api/user-auth-api.js'
import { registerUserListPage } from './user-list-page.js'
import { Config } from '../../../../_type/config.js'
import { UserCache } from '../../../../db/user/cache/user-cache.js'

describe('UserListPage', () => {

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

    web = Express2.from(config)
    registerUserAuthApi(web, uc)
    registerUserListPage(web, udb)
    await web.start()
    sat = supertest.agent(web.server)
  })

  afterAll(async () => {
    await web.close()
    await db.close()
  })

  it('user list', async () => {
    await sat.get('/user-list').expect(200).expect(/<title>User List/)
  })

})
