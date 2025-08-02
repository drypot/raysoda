import { getUserDB, UserDB } from '../../../db/user/user-db.js'
import { BannerDB, getBannerDB } from '../../../db/banner/banner-db.js'
import { Express2, getExpress2 } from '../../../express/express2.js'
import supertest from 'supertest'
import { closeAllObjects, initObjectContext } from '../../../oman/oman.js'
import { useUserAuthApi } from '../../user/api/user-auth-api.js'
import { useBannerPage } from './banner-page.js'
import { ADMIN_LOGIN_FORM, insertUserFix4, USER1_LOGIN_FORM } from '../../../db/user/fixture/user-fix.js'
import { userLoginForTest } from '../../user/api/user-auth-api-fixture.js'

describe('BannerPage', () => {

  let udb: UserDB
  let bdb: BannerDB
  let express2: Express2
  let agent: supertest.Agent

  beforeAll(async () => {
    initObjectContext('config/raysoda-test.json')
    udb = await getUserDB()
    bdb = await getBannerDB()
    express2 = await getExpress2()
    await useUserAuthApi()
    await useBannerPage()
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

  it('init table', async () => {
    await bdb.dropTable()
    await bdb.createTable()
    await bdb.loadCache()
  })
  it('banner-update fails if anonymous', async () => {
    await agent.get('/banner-update').expect(302).expect('Location', '/user-login')
  })
  it('login as user', async () => {
    await userLoginForTest(agent, USER1_LOGIN_FORM)
  })
  it('banner-update fails if user', async () => {
    await agent.get('/banner-update').expect(302).expect('Location', '/user-login')
  })
  it('login as admin', async () => {
    await userLoginForTest(agent, ADMIN_LOGIN_FORM)
  })
  it('banner-update', async () => {
    await agent.get('/banner-update').expect(200).expect(/<title>Update Banner/)
  })

})


