import { getSessionUser, useUserAuthApi } from '@server/web/user/api/user-auth-api'
import { Express2, toCallback } from '@server/web/_express/express2'
import supertest, { SuperAgentTest } from 'supertest'
import { insertUserFix4 } from '@server/db/user/fixture/user-fix'
import { UserDB } from '@server/db/user/user-db'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '@server/oman/oman'
import { shouldBeUser } from '@server/service/user-auth/user-auth-service'

describe('UserAuthApi Redirect To Login', () => {

  let udb: UserDB
  let web: Express2
  let sat: SuperAgentTest

  beforeAll(async () => {
    omanNewSession('config/raysoda-test.json')
    udb = await omanGetObject('UserDB') as UserDB
    web = await omanGetObject('Express2') as Express2
    await useUserAuthApi()
    await web.start()
    sat = supertest.agent(web.server)
  })

  afterAll(async () => {
    await omanCloseAllObjects()
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
    await udb.createTable()
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
