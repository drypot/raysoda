import { getUserDB, UserDB } from '../../../db/user/user-db.ts'
import { Express2, getExpress2 } from '../../../express/express2.ts'
import supertest from 'supertest'
import { closeAllObjects, initObjectContext } from '../../../oman/oman.ts'
import { useUserPwResetPage } from './user-password-page.ts'

describe('UserPasswordPage', () => {

  let udb: UserDB
  let express2: Express2
  let agent: supertest.Agent

  beforeAll(async () => {
    initObjectContext('config/raysoda-test.json')
    udb = await getUserDB()
    express2 = await getExpress2()
    await useUserPwResetPage()
    await express2.start()
    agent = supertest.agent(express2.server)
  })

  afterAll(async () => {
    await closeAllObjects()
  })

  it('1', async () => {
    await agent.get('/user-password-mail').expect(200).expect(/<title>Password/)
  })
  it('2', async () => {
    await agent.get('/user-password-mail-done').expect(200).expect(/<title>Password/)
  })
  it('3', async () => {
    await agent.get('/user-password-reset/1/1').expect(200).expect(/<title>Password/)
  })
  it('4', async () => {
    await agent.get('/user-password-reset-done').expect(200).expect(/<title>Password/)
  })

})
