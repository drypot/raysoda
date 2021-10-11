import { loadConfigSync } from '../../../_util/config-loader'
import { Express2 } from '../../_express/express2'
import supertest, { SuperAgentTest } from 'supertest'
import { registerRedirect } from './redirect'
import { Config } from '../../../_type/config'
import { DB } from '../../../db/_db/db'
import { UserDB } from '../../../db/user/user-db'
import { UserCache } from '../../../db/user/cache/user-cache'
import { insertUserFix4 } from '../../../db/user/fixture/user-fix'

describe('Redirect', () => {

  let config: Config

  let db: DB
  let udb: UserDB
  let uc: UserCache

  let web: Express2
  let sat: SuperAgentTest

  beforeAll(async () => {
    config = loadConfigSync('config/app-test.json')

    db = await DB.from(config).createDatabase()
    udb = UserDB.from(db)
    uc = UserCache.from(udb)

    web = Express2.from(config)
    registerRedirect(web, uc)
    await web.start()
    sat = supertest.agent(web.server)
  })

  afterAll(async () => {
    await web.close()
    await db.close()
  })

  beforeAll(async () => {
    await udb.dropTable()
    await udb.createTable(false)
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
    const res = await sat.get('/user1').expect(301).expect('Location', '/user/user1')
  })
  it('/USER1', async () => {
    const res = await sat.get('/USER1').expect(301).expect('Location', '/user/USER1')
  })
  it('/xman', async () => {
    const res = await sat.get('/xman').expect(404)
  })
  it('/xman/yman', async () => {
    const res = await sat.get('/xman/yman').expect(404)
  })

})