import { loadConfigSync } from '../../../_util/config-loader.js'
import { DB } from '../../../db/_db/db.js'
import { UserDB } from '../../../db/user/user-db.js'
import { insertUserFix4 } from '../../../db/user/fixture/user-fix.js'
import { Express2, toCallback } from '../../_express/express2.js'
import { SuperAgentTest } from 'supertest'
import { getUser, registerLoginApi, shouldBeUser } from './login-api.js'
import { Config } from '../../../_type/config.js'
import { UserCache } from '../../../db/user/cache/user-cache.js'

describe('Login Api Redirect To Login', () => {
  let config: Config

  let db: DB
  let udb: UserDB
  let uc: UserCache

  let web: Express2
  let request: SuperAgentTest

  beforeAll(async () => {
    config = loadConfigSync('config/app-test.json')

    db = await DB.from(config).createDatabase()
    udb = UserDB.from(db)
    uc = UserCache.from(udb)

    web = await Express2.from(config).start()
    registerLoginApi(web, uc)
    request = web.spawnRequest()
  })

  afterAll(async () => {
    await web.close()
    await db.close()
  })

  it('setup', () => {
    web.router.get('/for-guest', (req, res) => {
      res.send('for-guest')
    })
    web.router.get('/for-user', toCallback(async (req, res) => {
      const user = getUser(res)
      shouldBeUser(user)
      res.send('for-user')
    }))
  })
  it('init table', async () => {
    await udb.dropTable()
    await udb.createTable(false)
  })
  it('fill fix', async () => {
    await insertUserFix4(udb)
  })
  it('for-guest', async () => {
    await request.get('/for-guest').expect(200)
  })
  it('for-user', async () => {
    await request.get('/for-user').expect(302).expect('Location', '/login')
  })
})
