import { Config, loadConfig } from '../../config/config.js'
import { DB } from '../../../lib/db/db.js'
import { UserDB } from '../db/user-db.js'
import { insertUserDBFixture4 } from '../db/user-db-fixture.js'
import { Express2, toCallback } from '../../../lib/express/express2.js'
import { SuperAgentTest } from 'supertest'
import { getSessionUser, initUserLoginApi } from './user-login-api.js'
import { Router } from 'express'
import { NOT_AUTHENTICATED } from '../form/user-form.js'

describe('UserLoginApi', () => {

  let config: Config

  let db: DB
  let udb: UserDB
  let web: Express2
  let router: Router
  let request: SuperAgentTest

  beforeAll(async () => {
    config = loadConfig('config/app-test.json')

    db = new DB(config)
    udb = new UserDB(db)
    await db.createDatabase()

    web = new Express2(config)
    initUserLoginApi(udb, web)
    await web.start()
    router = web.router
    request = web.spawnRequest()
  })

  afterAll(async () => {
    await web.close()
    await db.close()
  })

  beforeAll(async () => {
    await udb.dropTable()
    await udb.createTable(false)
    await insertUserDBFixture4(udb)
  })

  describe('story: redirect to login', () => {
    beforeAll(() => {
      router.get('/test/public', (req, res) => {
        res.send('public')
      })
      router.get('/test/private', toCallback(async (req, res) => {
        const user = await getSessionUser(res)
        if (!user) throw NOT_AUTHENTICATED
        res.send('private')
      }))
    })
    it('before login', () => {
      //
    })
    it('access public page should ok', async () => {
      await request.get('/test/public').expect(200)
    })
    it('access private page should be redirected to login', async () => {
      await request.get('/test/private').expect(302).expect('Location', '/user/login')
    })

  })

})
