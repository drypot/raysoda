import { loadConfigSync } from '../../../../_util/config-loader'
import { DB } from '../../../../db/_db/db'
import { UserDB } from '../../../../db/user/user-db'
import { insertUserFix4 } from '../../../../db/user/fixture/user-fix'
import { Express2, toCallback } from '../../../_express/express2'
import supertest, { SuperAgentTest } from 'supertest'
import { getSessionUser, registerUserAuthApi } from './user-auth-api'
import { Config } from '../../../../_type/config'
import { UserCache } from '../../../../db/user/cache/user-cache'
import { shouldBeUser } from '../../../../service/user-auth/user-auth-service'

describe('UserAuthApi Redirect To Login', () => {

  let config: Config

  let db: DB
  let udb: UserDB
  let uc: UserCache

  let web: Express2
  let sat: SuperAgentTest

  beforeAll(async () => {
    config = loadConfigSync('config/app-test.json')

    db = await DB.from(config).createDatabase()
    udb = UserDB.from(db)
    uc = UserCache.from(udb)

    web = Express2.from(config)
    registerUserAuthApi(web, uc)
    await web.start()
    sat = supertest.agent(web.server)
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
      const user = getSessionUser(res)
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
    await sat.get('/for-guest').expect(200)
  })
  it('for-user', async () => {
    await sat.get('/for-user').expect(302).expect('Location', '/login')
  })

})
