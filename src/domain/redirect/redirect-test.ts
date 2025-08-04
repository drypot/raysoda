import supertest from 'supertest'
import { getUserDB, UserDB } from '../../db/user/user-db.ts'
import { Express2, getExpress2 } from '../../express/express2.ts'
import { closeAllObjects, initObjectContext } from '../../oman/oman.ts'
import { useRedirect } from './redirect.ts'
import { insertUserFix4 } from '../../db/user/fixture/user-fix.ts'

describe('Redirect', () => {

  let udb: UserDB
  let express2: Express2
  let agent: supertest.Agent

  beforeAll(async () => {
    initObjectContext('config/raysoda-test.json')
    udb = await getUserDB()
    express2 = await getExpress2()
    await useRedirect()
    await express2.start()
    agent = supertest.agent(express2.server)
  })

  afterAll(async () => {
    await closeAllObjects()
  })

  beforeAll(async () => {
    await udb.dropTable()
    await udb.createTable()
    await insertUserFix4(udb)
  })

  it('/Com/Photo/View.aspx', async () => {
    await agent.get('/Com/Photo/View.aspx?f=A&pg=3&p=937928')
      .expect(301).expect('Location', '/image/937928')
  })
  it('/Com/Photo/List.aspx', async () => {
    await agent.get('/Com/Photo/List.aspx?f=A&s=DD&pg=3')
      .expect(301).expect('Location', '/')
  })

  it('/Com/Photo/CList.aspx', async () => {
    await agent.get('/Com/Photo/CList.aspx?f=C')
      .expect(301).expect('Location', '/')
  })
  it('/users', async () => {
    await agent.get('/users/1')
      .expect(301).expect('Location', '/user-id/1')
  })
  it('/images', async () => {
    await agent.get('/images/1')
      .expect(301).expect('Location', '/image/1')
  })

  it('/user1', async () => {
    const res = await agent.get('/home1').expect(301).expect('Location', '/user/home1')
  })
  it('/USER1', async () => {
    const res = await agent.get('/HOME1').expect(301).expect('Location', '/user/HOME1')
  })
  it('/xman', async () => {
    const res = await agent.get('/xman').expect(404)
  })
  it('/xman/yman', async () => {
    const res = await agent.get('/xman/yman').expect(404)
  })

})
