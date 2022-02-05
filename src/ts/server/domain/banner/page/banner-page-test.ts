import supertest, { SuperAgentTest } from 'supertest'
import { ADMIN_LOGIN_FORM, insertUserFix4, USER1_LOGIN_FORM } from '@server/db/user/fixture/user-fix'
import { closeAllObjects, getObject, initObjectContext } from '@server/oman/oman'
import { useUserAuthApi } from '@server/domain/user/api/user-auth-api'
import { Express2 } from '@server/express/express2'
import { userLoginForTest } from '@server/domain/user/api/user-auth-api-fixture'
import { BannerDB } from '@server/db/banner/banner-db'
import { UserDB } from '@server/db/user/user-db'
import { useBannerPage } from '@server/domain/banner/page/banner-page'

describe('BannerPage', () => {

  let udb: UserDB
  let bdb: BannerDB
  let web: Express2
  let sat: SuperAgentTest

  beforeAll(async () => {
    initObjectContext('config/raysoda-test.json')
    udb = await getObject('UserDB') as UserDB
    bdb = await getObject('BannerDB') as BannerDB
    web = await getObject('Express2') as Express2
    await useUserAuthApi()
    await useBannerPage()
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

  it('init table', async () => {
    await bdb.dropTable()
    await bdb.createTable()
    await bdb.loadCache()
  })
  it('banner-update fails if anonymous', async () => {
    await sat.get('/banner-update').expect(302).expect('Location', '/user-login')
  })
  it('login as user', async () => {
    await userLoginForTest(sat, USER1_LOGIN_FORM)
  })
  it('banner-update fails if user', async () => {
    await sat.get('/banner-update').expect(302).expect('Location', '/user-login')
  })
  it('login as admin', async () => {
    await userLoginForTest(sat, ADMIN_LOGIN_FORM)
  })
  it('banner-update', async () => {
    await sat.get('/banner-update').expect(200).expect(/<title>Update Banner/)
  })

})


