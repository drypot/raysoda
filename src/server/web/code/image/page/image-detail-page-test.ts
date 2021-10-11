import { loadConfigSync } from '../../../../_util/config-loader'
import { DB } from '../../../../db/_db/db'
import { UserDB } from '../../../../db/user/user-db'
import { Express2 } from '../../../_express/express2'
import supertest, { SuperAgentTest } from 'supertest'
import { insertUserFix4, USER1_LOGIN } from '../../../../db/user/fixture/user-fix'
import { ImageDB } from '../../../../db/image/image-db'
import { registerUserAuthApi } from '../../user-auth/api/user-auth-api'
import { loginForTest } from '../../user-auth/api/user-auth-api-fixture'
import { Config } from '../../../../_type/config'
import { UserCache } from '../../../../db/user/cache/user-cache'
import { registerImageDetailPage } from './image-detail-page'
import { ImageFileManager } from '../../../../file/fileman'
import { RaySodaFileManager } from '../../../../file/raysoda-fileman'
import { registerImageUploadApi } from '../api/image-upload-api'

describe('ImageDetailPage', () => {

  let config: Config

  let db: DB
  let udb: UserDB
  let uc: UserCache

  let idb: ImageDB
  let ifm: ImageFileManager

  let web: Express2
  let sat: SuperAgentTest

  beforeAll(async () => {
    config = loadConfigSync('config/raysoda-test.json')

    db = await DB.from(config).createDatabase()
    udb = UserDB.from(db)
    uc = UserCache.from(udb)

    idb = ImageDB.from(db)
    ifm = RaySodaFileManager.from(config)

    web = Express2.from(config).useUpload()
    registerUserAuthApi(web, uc)
    registerImageUploadApi(web, udb, idb, ifm)
    registerImageDetailPage(web, uc, idb, ifm)
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

  it('init table', async () => {
    await idb.dropTable()
    await idb.createTable()
  })
  it('remove image dir', async () => {
    await ifm.rmRoot()
  })
  it('login as user1', async () => {
    await loginForTest(sat, USER1_LOGIN)
  })
  it('upload image', async () => {
    const res = await sat.post('/api/image-upload')
      .field('comment', 'c1')
      .attach('file', 'sample/640x360.jpg')
      .expect(200)
    expect(res.body.id).toBe(1)
  })
  it('get image 1', async () => {
    const res = await sat.get('/image/1').expect(200).expect(/<title>Image/)
  })
  it('get image invalid', async () => {
    const res = await sat.get('/image/99').expect(200).expect(/<title>Error/)
  })
})


