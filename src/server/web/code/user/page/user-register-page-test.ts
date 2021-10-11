import { loadConfigSync } from '../../../../_util/config-loader'
import { DB } from '../../../../db/_db/db'
import { UserDB } from '../../../../db/user/user-db'
import { Express2 } from '../../../_express/express2'
import supertest, { SuperAgentTest } from 'supertest'
import { registerUserRegisterPage } from './user-register-page'
import { Config } from '../../../../_type/config'

describe('UserRegisterPage', () => {

  let config: Config

  let db: DB
  let udb: UserDB

  let web: Express2
  let sat: SuperAgentTest

  beforeAll(async () => {
    config = loadConfigSync('config/app-test.json')

    db = await DB.from(config).createDatabase()
    udb = UserDB.from(db)

    web = Express2.from(config)
    registerUserRegisterPage(web)
    await web.start()
    sat = supertest.agent(web.server)
  })

  afterAll(async () => {
    await web.close()
    await db.close()
  })

  it('register', async () => {
    await sat.get('/user-register').expect(200).expect(/<title>Register/)
  })
  it('done', async () => {
    await sat.get('/user-register-done').expect(200).expect(/<title>Registered/)
  })

})