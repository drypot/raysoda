import supertest, { SuperAgentTest } from 'supertest'
import { insertUserFix4, USER1_LOGIN_FORM } from '@server/db/user/fixture/user-fix'
import { useBannerApi } from '@server/domain/banner/api/banner-api'
import { closeAllObjects, getObject, initObjectContext } from '@server/oman/oman'
import { useUserAuthApi } from '@server/domain/user/api/user-auth-api'
import { Express2 } from '@server/express/express2'
import { userLoginForTest, userLogoutForTest } from '@server/domain/user/api/user-auth-api-fixture'
import { BannerDB } from '@server/db/banner/banner-db'
import { useSpaInitApi } from '@server/domain/spa/spa-init-api'
import { UserDB } from '@server/db/user/user-db'

describe('SpaInitScript', () => {

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
    await useBannerApi()
    await useSpaInitApi()
    await web.start()
    sat = supertest.agent(web.server)
  })

  afterAll(async () => {
    await closeAllObjects()
  })

  it('init table', async () => {
    await udb.dropTable()
    await udb.createTable()
    await bdb.dropTable()
    await bdb.createTable()
    await bdb.loadCache()
  })
  it('fill fix', async () => {
    await insertUserFix4(udb)
  })
  it('get session script', async () => {
    const res = await sat.get('/api/spa-init-script').expect(200)
    expect(res.type).toBe('application/javascript')
    expect(res.text).toBe(
      `const _config = {"appName":"RaySoda","appNamel":"raysoda","appDesc":"One day, one photo.","mainUrl":"http://raysoda.test:8080","uploadUrl":"http://file.raysoda.test:8080"}
const _user = {"id":-1,"name":"","home":"","admin":false}
const _banner = []
`
    )
  })
  it('login as user1', async () => {
    await userLoginForTest(sat, USER1_LOGIN_FORM)
  })
  it('get session script with login', async () => {
    const res = await sat.get('/api/spa-init-script').expect(200)
    expect(res.type).toBe('application/javascript')
    expect(res.text).toBe(
      `const _config = {"appName":"RaySoda","appNamel":"raysoda","appDesc":"One day, one photo.","mainUrl":"http://raysoda.test:8080","uploadUrl":"http://file.raysoda.test:8080"}
const _user = {"id":1,"name":"name1","home":"home1","admin":false}
const _banner = []
`
    )
  })
  it('logout', async () => {
    await userLogoutForTest(sat)
  })
  it('set banner', async () => {
    await bdb.updateBannerList([{ text: 'text1', url: 'url1' }])
  })
  it('get session script with banner', async () => {
    const res = await sat.get('/api/spa-init-script').expect(200)
    expect(res.type).toBe('application/javascript')
    expect(res.text).toBe(
      `const _config = {"appName":"RaySoda","appNamel":"raysoda","appDesc":"One day, one photo.","mainUrl":"http://raysoda.test:8080","uploadUrl":"http://file.raysoda.test:8080"}
const _user = {"id":-1,"name":"","home":"","admin":false}
const _banner = [{"text":"text1","url":"url1"}]
`
    )
  })

})
