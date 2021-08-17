import { Config, configFrom } from '../../../config/config.js'
import { DB } from '../../../../lib/db/db.js'
import { UserDB } from '../../db/user-db.js'
import { insertUserFix4 } from '../../db/user-db-fixture.js'
import { Express2, toCallback } from '../../../../lib/express/express2.js'
import { SuperAgentTest } from 'supertest'
import { registerUserLoginApi, sessionUserFrom } from './user-login-api.js'
import { Router } from 'express'
import { NOT_AUTHENTICATED } from '../register-form/user-form.js'

describe('UserLoginApi', () => {

  let config: Config

  let db: DB
  let udb: UserDB
  let web: Express2
  let router: Router
  let request: SuperAgentTest

  beforeAll(async () => {
    config = configFrom('config/app-test.json')

    db = await DB.from(config).createDatabase()
    udb = UserDB.from(db)

    web = await Express2.from(config).start()
    registerUserLoginApi(web, udb)
    router = web.router
    request = web.spawnRequest()
  })

  afterAll(async () => {
    await web.close()
    await db.close()
  })

  describe('redirect to login', () => {
    beforeAll(() => {
      router.get('/test/public', (req, res) => {
        res.send('public')
      })
      router.get('/test/private', toCallback(async (req, res) => {
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
    it('access public should work', async () => {
      await request.get('/test/public').expect(200)
    })
    it('access private should be redirected to login', async () => {
      await request.get('/test/private').expect(302).expect('Location', '/user/login')
    })

  })

})
