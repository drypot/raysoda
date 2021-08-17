import { Config, configFrom } from '../../config/config.js'
import { DB } from '../../../lib/db/db.js'
import { UserDB } from '../db/user-db.js'
import { Express2 } from '../../../lib/express/express2.js'
import { SuperAgentTest } from 'supertest'
import { registerUserRegisterApi } from './user-register-api.js'

describe('UserRegisterApi', () => {

  let config: Config

  let db: DB
  let udb: UserDB

  let web: Express2
  let request: SuperAgentTest

  beforeAll(async () => {
    config = configFrom('config/app-test.json')

    db = await DB.from(config).createDatabase()
    udb = UserDB.from(db)

    web = Express2.from(config)
    registerUserRegisterApi(web, udb)
    await web.start()
    request = web.spawnRequest()
  })

  afterAll(async () => {
    await web.close()
    await db.close()
  })

  describe('page /user/register', () => {
    it('should work', async () => {
      await request.get('/user/register').expect(200).expect(/<title>Register/)
    })
  })

  describe('page /user/register-done', () => {
    it('should work', async () => {
      await request.get('/user/register-done').expect(200).expect(/<title>Registered/)
    })
  })

})
