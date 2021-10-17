import { Express2 } from '@server/web/_express/express2'
import supertest, { SuperAgentTest } from 'supertest'
import { useUserRegisterPage } from '@server/web/user/page/user-register-page'
import { UserDB } from '@server/db/user/user-db'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '@server/oman/oman'

describe('UserRegisterPage', () => {

  let udb: UserDB
  let web: Express2
  let sat: SuperAgentTest

  beforeAll(async () => {
    omanNewSession('config/raysoda-test.json')
    udb = await omanGetObject('UserDB') as UserDB
    web = await omanGetObject('Express2') as Express2
    await useUserRegisterPage()
    await web.start()
    sat = supertest.agent(web.server)
  })

  afterAll(async () => {
    await omanCloseAllObjects()
  })
  it('register', async () => {
    await sat.get('/user-register').expect(200).expect(/<title>Register/)
  })
  it('done', async () => {
    await sat.get('/user-register-done').expect(200).expect(/<title>Registered/)
  })

})
