import { UserDB } from '@server/db/user/user-db'
import { Express2 } from '@server/express/express2'
import supertest, { SuperAgentTest } from 'supertest'
import { closeAllObjects, getObject, initObjectContext } from '@server/oman/oman'
import { useUserPwResetPage } from '@server/domain/user/page/user-password-page'

describe('UserPasswordPage', () => {

  let udb: UserDB
  let web: Express2
  let sat: SuperAgentTest

  beforeAll(async () => {
    initObjectContext('config/raysoda-test.json')
    udb = await getObject('UserDB') as UserDB
    web = await getObject('Express2') as Express2
    await useUserPwResetPage()
    await web.start()
    sat = supertest.agent(web.server)
  })

  afterAll(async () => {
    await closeAllObjects()
  })

  it('1', async () => {
    await sat.get('/user-password-mail').expect(200).expect(/<title>Password/)
  })
  it('2', async () => {
    await sat.get('/user-password-mail-done').expect(200).expect(/<title>Password/)
  })
  it('3', async () => {
    await sat.get('/user-password-reset/1/1').expect(200).expect(/<title>Password/)
  })
  it('4', async () => {
    await sat.get('/user-password-reset-done').expect(200).expect(/<title>Password/)
  })

})
