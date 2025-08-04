import supertest from 'supertest'
import { getUserDB, UserDB } from '../../../db/user/user-db.ts'
import { Express2, getExpress2, toCallback } from '../../../express/express2.ts'
import { closeAllObjects, initObjectContext } from '../../../oman/oman.ts'
import { userGetSessionUser, useUserAuthApi } from './user-auth-api.ts'
import { assertLoggedIn } from '../service/user-auth.ts'
import { insertUserFix4 } from '../../../db/user/fixture/user-fix.ts'

describe('UserAuthApi Redirect To Login', () => {

  let udb: UserDB
  let express2: Express2
  let agent: supertest.Agent

  beforeAll(async () => {
    initObjectContext('config/raysoda-test.json')
    udb = await getUserDB()
    express2 = await getExpress2()
    await useUserAuthApi()
    await express2.start()
    agent = supertest.agent(express2.server)
  })

  afterAll(async () => {
    await closeAllObjects()
  })

  it('setup', () => {
    express2.router.get('/for-guest', (req, res) => {
      res.send('for-guest')
    })
    express2.router.get('/for-user', toCallback(async (req, res) => {
      const user = userGetSessionUser(res)
      assertLoggedIn(user)
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
    await agent.get('/for-guest').expect(200)
  })
  it('for-user', async () => {
    await agent.get('/for-user').expect(302).expect('Location', '/user-login')
  })

})
