import { loadConfigSync } from '../../../_util/config-loader.js'
import { DB } from '../../../db/_db/db.js'
import { UserDB } from '../../../db/user/user-db.js'
import { ImageDB } from '../../../db/image/image-db.js'
import { ImageFileManager } from '../../../file/fileman.js'
import { Express2 } from '../../_express/express2.js'
import supertest, { SuperAgentTest } from 'supertest'
import { RaySodaFileManager } from '../../../file/raysoda-fileman.js'
import { registerLoginApi } from '../user-login/login-api.js'
import { registerImageUploadApi } from './image-upload-api.js'
import { ADMIN_LOGIN, insertUserFix4, USER1_LOGIN, USER2_LOGIN } from '../../../db/user/fixture/user-fix.js'
import { registerImageDetailApi } from './image-detail-api.js'
import { loginForTest, logoutForTest } from '../user-login/login-api-fixture.js'
import { IMAGE_NOT_EXIST } from '../../../_type/error-image.js'
import { ImageDetail, unpackImageDetail } from '../../../_type/image-detail.js'
import { Config } from '../../../_type/config.js'
import { UserCache } from '../../../db/user/cache/user-cache.js'
import { newDateString } from '../../../_util/date2.js'

describe('ImageDetailApi', () => {
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
    registerLoginApi(web, uc)
    registerImageUploadApi(web, udb, idb, ifm)
    registerImageDetailApi(web, uc, idb, ifm)
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
    await idb.createTable(false)
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

  let now: Date

  it('get now', async () => {
    const image = await idb.findImage(1)
    if (!image) throw new Error()
    now = image.cdate
  })
  it('get image by user1', async () => {
    const res = await sat.get('/api/image/1').expect(200)
    const image = res.body.image as ImageDetail
    unpackImageDetail(image)
    expect(image as any).toEqual({
      id: 1,
      owner: { id: 1, name: 'User 1', home: 'user1' },
      cdate: now,
      cdateNum: now.getTime(),
      cdateStr: newDateString(now),
      vers: null,
      comment: 'c1',
      dirUrl: 'http://file.raysoda.test:8080/images/0/0',
      thumbUrl: 'http://file.raysoda.test:8080/images/0/0/1.jpg',
      updatable: true // ***
    })
  })
  it('login as user2', async () => {
    await loginForTest(sat, USER2_LOGIN)
  })
  it('get image by user2', async () => {
    const res = await sat.get('/api/image/1').expect(200)
    expect(res.body.image.updatable).toBe(false)
  })
  it('login as admin', async () => {
    await loginForTest(sat, ADMIN_LOGIN)
  })
  it('get image by admin', async () => {
    const res = await sat.get('/api/image/1').expect(200)
    expect(res.body.image.updatable).toBe(true)
  })
  it('logout', async () => {
    await logoutForTest(sat)
  })
  it('get image by guest', async () => {
    const res = await sat.get('/api/image/1').expect(200)
    expect(res.body.image.updatable).toBe(false)
  })
  it('get invalid image', async () => {
    const res = await sat.get('/api/image/99').expect(200)
    expect(res.body.err).toContain(IMAGE_NOT_EXIST)
  })

})
