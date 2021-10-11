import { loadConfigSync } from '../../../../_util/config-loader.js'
import { DB } from '../../../../db/_db/db.js'
import { UserDB } from '../../../../db/user/user-db.js'
import { Express2 } from '../../../_express/express2.js'
import supertest, { SuperAgentTest } from 'supertest'
import { registerUserAuthApi } from '../../user-auth/api/user-auth-api.js'
import { insertUserFix4, USER1_LOGIN } from '../../../../db/user/fixture/user-fix.js'
import { ImageDB } from '../../../../db/image/image-db.js'
import { ImageFileManager } from '../../../../file/fileman.js'
import { registerImageUploadApi } from './image-upload-api.js'
import { loginForTest } from '../../user-auth/api/user-auth-api-fixture.js'
import { getImageMetaOfFile } from '../../../../file/magick/magick2.js'
import { RapixelFileManager } from '../../../../file/rapixel-fileman.js'
import { IMAGE_SIZE } from '../../../../_type/error-image.js'
import { Config } from '../../../../_type/config.js'
import { UserCache } from '../../../../db/user/cache/user-cache.js'

describe('ImageUploadApi Rapixel', () => {
  let config: Config

  let db: DB
  let udb: UserDB
  let uc: UserCache

  let idb: ImageDB
  let ifm: ImageFileManager

  let web: Express2
  let sat: SuperAgentTest

  beforeAll(async () => {
    config = loadConfigSync('config/rapixel-test.json')

    db = await DB.from(config).createDatabase()
    udb = UserDB.from(db)
    uc = UserCache.from(udb)

    idb = ImageDB.from(db)

    ifm = RapixelFileManager.from(config)

    web = Express2.from(config).useUpload()
    registerUserAuthApi(web, uc)
    registerImageUploadApi(web, udb, idb, ifm)
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
  it('upload fails if image is too small', async () => {
    const res = await sat.post('/api/image-upload').attach('file', 'sample/2560x1440.jpg').expect(200)
    expect(res.body.err).toContain(IMAGE_SIZE)
  })
  it('upload fails if image is vertical', async () => {
    const res = await sat.post('/api/image-upload').attach('file', 'sample/2160x3840.jpg').expect(200)
    expect(res.body.err).toContain(IMAGE_SIZE)
  })
  it('upload 5120x2880', async () => {
    const res = await sat.post('/api/image-upload').field('comment', 'c1')
      .attach('file', 'sample/5120x2880.jpg').expect(200)
    expect(res.body.id).toBe(1)
  })
  it('check db', async () => {
    const r = await idb.findImage(1)
    if (!r) throw new Error()
    expect(r.uid).toBe(1)
    expect(Date.now() - r.cdate.getTime()).toBeLessThan(4000)
    expect(r.comment).toBe('c1')
    expect(r.vers).toEqual([5120, 4096, 2560, 1280])
  })
  it('check file', async () => {
    expect((await getImageMetaOfFile(ifm.getPathFor(1, 5120))).width).toBe(5120)
    expect((await getImageMetaOfFile(ifm.getPathFor(1, 4096))).width).toBe(4096)
    expect((await getImageMetaOfFile(ifm.getPathFor(1, 2560))).width).toBe(2560)
    expect((await getImageMetaOfFile(ifm.getPathFor(1, 1280))).width).toBe(1280)
  })
  it('upload 3840x2160', async () => {
    const res = await sat.post('/api/image-upload').field('comment', 'c2')
      .attach('file', 'sample/3840x2160.jpg').expect(200)
    expect(res.body.id).toBe(2)
  })
  it('check db', async () => {
    const r = await idb.findImage(2)
    if (!r) throw new Error()
    expect(r.uid).toBe(1)
    expect(Date.now() - r.cdate.getTime()).toBeLessThan(4000)
    expect(r.comment).toBe('c2')
    expect(r.vers).toEqual([4096, 2560, 1280])
  })
  it('check file', async () => {
    expect((await getImageMetaOfFile(ifm.getPathFor(2, 4096))).width).toBe(4096)
    expect((await getImageMetaOfFile(ifm.getPathFor(2, 2560))).width).toBe(2560)
    expect((await getImageMetaOfFile(ifm.getPathFor(2, 1280))).width).toBe(1280)
  })

})


