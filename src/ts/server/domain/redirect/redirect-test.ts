import { Express2 } from '@server/express/express2'
import supertest, { SuperAgentTest } from 'supertest'
import { insertUserFix4 } from '@server/db/user/fixture/user-fix'
import { UserDB } from '@server/db/user/user-db'
import { closeAllObjects, getObject, initObjectContext } from '@server/oman/oman'
import { useRedirect } from '@server/domain/redirect/redirect'

describe('Redirect', () => {

  let udb: UserDB
  let web: Express2
  let sat: SuperAgentTest

  beforeAll(async () => {
    initObjectContext('config/raysoda-test.json')
    udb = await getObject('UserDB') as UserDB
    web = await getObject('Express2') as Express2
    await useRedirect()
    await web.start()
    sat = supertest.agent(web.server)
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
    await sat.get('/Com/Photo/View.aspx?f=A&pg=3&p=937928')
      .expect(301).expect('Location', '/image/937928')
  })
  it('/Com/Photo/List.aspx', async () => {
    await sat.get('/Com/Photo/List.aspx?f=A&s=DD&pg=3')
      .expect(301).expect('Location', '/')
  })

  it('/Com/Photo/CList.aspx', async () => {
    await sat.get('/Com/Photo/CList.aspx?f=C')
      .expect(301).expect('Location', '/')
  })
  it('/users', async () => {
    await sat.get('/users/1')
      .expect(301).expect('Location', '/user/1')
  })
  it('/images', async () => {
    await sat.get('/images/1')
      .expect(301).expect('Location', '/image/1')
  })

  it('/user1', async () => {
    const res = await sat.get('/home1').expect(301).expect('Location', '/user/home1')
  })
  it('/USER1', async () => {
    const res = await sat.get('/HOME1').expect(301).expect('Location', '/user/HOME1')
  })
  it('/xman', async () => {
    const res = await sat.get('/xman').expect(404)
  })
  it('/xman/yman', async () => {
    const res = await sat.get('/xman/yman').expect(404)
  })

})
