import { Config, configFrom } from '../../config/config.js'
import { DB } from '../../db/_db/db.js'
import { UserDB } from '../../db/user/user-db.js'
import { insertUserFix4 } from '../../db/user/user-db-fixture.js'
import { Express2 } from '../_express/express2.js'
import { SuperAgentTest } from 'supertest'
import { registerUserLoginApi } from './user-login-api.js'

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

  describe('login', () => {
    it('init table', async () => {
      await udb.dropTable()
      await udb.createTable(false)
    })
    it('fill fix', async () => {
      await insertUserFix4(udb)
    })
    it('get session script', async () => {
      const res = await request.get('/api/session-script').expect(200)
      expect(res.type).toBe('application/javascript')
      expect(res.text).toBe(
        `const _config = {}\n` +
        `_config.appName = 'RaySoda'\n` +
        `_config.appNamel = 'raysoda'\n` +
        `_config.appDesc = 'One day, one photo.'\n` +
        `_config.mainUrl = 'http://raysoda.test:8080'\n` +
        `_config.uploadUrl = 'http://file.raysoda.test:8080'\n` +
        `const _user = undefined\n`
      )
    })
    it('login as user1', async () => {
      const form = { email: 'user1@mail.test', password: '1234', remember: false }
      const res = await request.post('/api/user/login').send(form).expect(200)
      expect(res.body.user.id).toBe(1)
    })
    it('get session script after login', async () => {
      const res = await request.get('/api/session-script').expect(200)
      expect(res.type).toBe('application/javascript')
      expect(res.text).toBe(
        `const _config = {}\n` +
        `_config.appName = 'RaySoda'\n` +
        `_config.appNamel = 'raysoda'\n` +
        `_config.appDesc = 'One day, one photo.'\n` +
        `_config.mainUrl = 'http://raysoda.test:8080'\n` +
        `_config.uploadUrl = 'http://file.raysoda.test:8080'\n` +
        `const _user = {"id":1,"name":"User 1","home":"user1"}\n`
      )
    })
  })

})
