import supertest, { SuperAgentTest } from 'supertest'
import { insertUserFix4, USER1_LOGIN } from '@server/db/user/fixture/user-fix'
import { useBannerApi } from '@server/web/banner/api/banner-api'
import { ValueDB } from '@server/db/value/value-db'
import { omanCloseAllObjects, omanGetObject, omanNewSession } from '@server/oman/oman'
import { useUserAuthApi } from '@server/web/user-auth/api/user-auth-api'
import { Express2 } from '@server/web/_express/express2'
import { loginForTest, logoutForTest } from '@server/web/user-auth/api/user-auth-api-fixture'
import { BannerDB } from '@server/db/banner/banner-db'
import { useSpaInitApi } from '@server/web/_common/spa-init-api'
import { UserDB } from '@server/db/user/user-db'

describe('SpaInitScript', () => {

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
    await useBannerApi()
    await useSpaInitApi()
    await web.start()
    sat = supertest.agent(web.server)
  })

  afterAll(async () => {
    await omanCloseAllObjects()
  })

  it('init table', async () => {
    await udb.dropTable()
    await udb.createTable()
    await vdb.dropTable()
    await vdb.createTable()
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
    await loginForTest(sat, USER1_LOGIN)
  })
  it('get session script with login', async () => {
    const res = await sat.get('/api/spa-init-script').expect(200)
    expect(res.type).toBe('application/javascript')
    expect(res.text).toBe(
      `const _config = {"appName":"RaySoda","appNamel":"raysoda","appDesc":"One day, one photo.","mainUrl":"http://raysoda.test:8080","uploadUrl":"http://file.raysoda.test:8080"}
const _user = {"id":1,"name":"User 1","home":"user1","admin":false}
const _banner = []
`
    )
  })
  it('logout', async () => {
    await logoutForTest(sat)
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
