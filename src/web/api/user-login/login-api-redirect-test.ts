import { configFrom } from '../../../_util/config-loader.js'
import { DB } from '../../../db/_db/db.js'
import { UserDB } from '../../../db/user/user-db.js'
import { insertUserFix4 } from '../../../db/user/user-db-fixture.js'
import { Express2, toCallback } from '../../_express/express2.js'
import { SuperAgentTest } from 'supertest'
import { registerLoginApi, sessionUserFrom } from './login-api.js'
import { NOT_AUTHENTICATED } from '../../../_type/error-user.js'
import { Config } from '../../../_type/config.js'
import { UserCache } from '../../../db/user/user-cache.js'

describe('Login Api', () => {

  let config: Config

  let db: DB
  let udb: UserDB
  let uc: UserCache

  let web: Express2
  let request: SuperAgentTest

  beforeAll(async () => {
    config = configFrom('config/app-test.json')

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

  describe('redirect to login', () => {
    beforeAll(() => {
      web.router.get('/test/public', (req, res) => {
        res.send('public')
      })
      web.router.get('/test/private', toCallback(async (req, res) => {
        const user = await sessionUserFrom(res)
        if (!user) throw NOT_AUTHENTICATED
        res.send('private')
      }))
    })
    it('init table', async () => {
      await udb.dropTable()
      await udb.createTable(false)
    })
    it('fill fix', async () => {
      await insertUserFix4(udb)
    })
    it('access public works', async () => {
      await request.get('/test/public').expect(200)
    })
    it('access private is redirected to login', async () => {
      await request.get('/test/private').expect(302).expect('Location', '/login')
    })

  })

})
