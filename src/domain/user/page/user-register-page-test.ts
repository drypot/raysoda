import { getUserDB, UserDB } from '../../../db/user/user-db.js'
import { Express2, getExpress2 } from '../../../express/express2.js'
import supertest from 'supertest'
import { closeAllObjects, initObjectContext } from '../../../oman/oman.js'
import { useUserRegisterPage } from './user-register-page.js'

describe('UserRegisterPage', () => {

  let udb: UserDB
  let express2: Express2
  let agent: supertest.Agent

  beforeAll(async () => {
    initObjectContext('config/raysoda-test.json')
    udb = await getUserDB()
    express2 = await getExpress2()
    await useUserRegisterPage()
    await express2.start()
    agent = supertest.agent(express2.server)
  })

  afterAll(async () => {
    await closeAllObjects()
  })
  it('register', async () => {
    await agent.get('/user-register').expect(200).expect(/<title>Register/)
  })
  it('done', async () => {
    await agent.get('/user-register-done').expect(200).expect(/<title>Registered/)
  })

})
