import { Config, configFrom } from '../../../config/config.js'
import { DB } from '../../../../lib/db/db.js'
import { UserDB } from '../../db/user-db.js'
import { Express2 } from '../../../../lib/express/express2.js'
import { SuperAgentTest } from 'supertest'
import { registerUserRegisterView } from './user-register-view.js'

describe('UserRegisterView', () => {

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
    registerUserRegisterView(web, udb)
    request = web.spawnRequest()
  })

  afterAll(async () => {
    await web.close()
    await db.close()
  })

  describe('user register pages ', () => {
    it('/user/register', async () => {
      await request.get('/user/register').expect(200).expect(/<title>Register/)
    })
    it('/user/register-done', async () => {
      await request.get('/user/register-done').expect(200).expect(/<title>Registered/)
    })
  })

})
