import { userGetSessionUser, useUserAuthApi } from '@server/domain/user/api/user-auth-api'
import { Express2, toCallback } from '@server/express/express2'
import supertest, { SuperAgentTest } from 'supertest'
import { userFixInsert4 } from '@server/db/user/fixture/user-fix'
import { UserDB } from '@server/db/user/user-db'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '@server/oman/oman'
import { userAssertLogin } from '@server/domain/user/_service/user-auth'

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
      const user = userGetSessionUser(res)
      userAssertLogin(user)
      res.send('for-user')
    }))
  })
  it('init table', async () => {
    await udb.dropTable()
    await udb.createTable()
  })
  it('fill fix', async () => {
    await userFixInsert4(udb)
  })
  it('for-guest', async () => {
    await sat.get('/for-guest').expect(200)
  })
  it('for-user', async () => {
    await sat.get('/for-user').expect(302).expect('Location', '/user-login')
  })

})
