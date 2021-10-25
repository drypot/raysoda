import { UserDB } from '@server/db/user/user-db'
import { Express2 } from '@server/express/express2'
import supertest, { SuperAgentTest } from 'supertest'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '@server/oman/oman'
import { useUserPasswordPage } from '@server/domain/user/page/user-password-page'

describe('UserPasswordPage', () => {

  let udb: UserDB
  let web: Express2
  let sat: SuperAgentTest

  beforeAll(async () => {
    omanNewSession('config/raysoda-test.json')
    udb = await omanGetObject('UserDB') as UserDB
    web = await omanGetObject('Express2') as Express2
    await useUserPasswordPage()
    await web.start()
    sat = supertest.agent(web.server)
  })

  afterAll(async () => {
    await omanCloseAllObjects()
  })

  it('1', async () => {
    await sat.get('/user-password-reset').expect(200).expect(/<title>Password/)
  })
  it('2', async () => {
    await sat.get('/user-password-reset-2').expect(200).expect(/<title>Password/)
  })
  it('3', async () => {
    await sat.get('/user-password-reset-3').expect(200).expect(/<title>Password/)
  })

})
