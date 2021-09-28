import { Config, configFrom } from '../../_config/config.js'
import { DB } from '../../db/_db/db.js'
import { UserDB } from '../../db/user/user-db.js'
import { Express2 } from '../_express/express2.js'
import { SuperAgentTest } from 'supertest'
import { registerUserRegisterPage } from './user-register-page.js'

describe('User Register Page', () => {

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
    registerUserRegisterPage(web, udb)
    request = web.spawnRequest()
  })

  afterAll(async () => {
    await web.close()
    await db.close()
  })

  describe('user register pages ', () => {
    it('/user-register', async () => {
      await request.get('/user-register').expect(200).expect(/<title>Register/)
    })
    it('/user-register-done', async () => {
      await request.get('/user-register-done').expect(200).expect(/<title>Registered/)
    })
  })

})
