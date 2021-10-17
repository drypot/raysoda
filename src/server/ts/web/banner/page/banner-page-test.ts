import supertest, { SuperAgentTest } from 'supertest'
import { ADMIN_LOGIN, insertUserFix4, USER1_LOGIN } from '@server/db/user/fixture/user-fix'
import { ValueDB } from '@server/db/value/value-db'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '@server/oman/oman'
import { useUserAuthApi } from '@server/web/user-auth/api/user-auth-api'
import { Express2 } from '@server/web/_express/express2'
import { loginForTest } from '@server/web/user-auth/api/user-auth-api-fixture'
import { BannerDB } from '@server/db/banner/banner-db'
import { UserDB } from '@server/db/user/user-db'
import { useBannerPage } from '@server/web/banner/page/banner-page'

describe('BannerPage', () => {

  let udb: UserDB
  let vdb: ValueDB
  let bdb: BannerDB
  let web: Express2
  let sat: SuperAgentTest

  beforeAll(async () => {
    omanNewSession('config/raysoda-test.json')
    udb = await omanGetObject('UserDB') as UserDB
    vdb = await omanGetObject('ValueDB') as ValueDB
    bdb = await omanGetObject('BannerDB') as BannerDB
    web = await omanGetObject('Express2') as Express2
    await useUserAuthApi()
    await useBannerPage()
    await web.start()
    sat = supertest.agent(web.server)
  })

  afterAll(async () => {
    await omanCloseAllObjects()
  })

  beforeAll(async () => {
    await udb.dropTable()
    await udb.createTable()
    await insertUserFix4(udb)
  })

  it('init table', async () => {
    await vdb.dropTable()
    await vdb.createTable()
    await bdb.loadCache()
  })
  it('banner-update fails if anonymous', async () => {
    await sat.get('/banner-update').expect(302).expect('Location', '/login')
  })
  it('login as user', async () => {
    await loginForTest(sat, USER1_LOGIN)
  })
  it('banner-update fails if user', async () => {
    await sat.get('/banner-update').expect(302).expect('Location', '/login')
  })
  it('login as admin', async () => {
    await loginForTest(sat, ADMIN_LOGIN)
  })
  it('banner-update', async () => {
    await sat.get('/banner-update').expect(200).expect(/<title>Update Banners/)
  })

})


