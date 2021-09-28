import { Config, configFrom } from '../../_config/config.js'
import { DB } from '../../db/_db/db.js'
import { UserDB } from '../../db/user/user-db.js'
import { insertUserFix4 } from '../../db/user/user-db-fixture.js'
import { Express2, toCallback } from '../_express/express2.js'
import { SuperAgentTest } from 'supertest'
import { registerUserLoginApi, sessionUserFrom } from './user-login-api.js'
import { NOT_AUTHENTICATED } from '../../_error/error-user.js'

describe('UserLoginApi', () => {

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
      await request.get('/test/private').expect(302).expect('Location', '/user-login')
    })

  })

})
