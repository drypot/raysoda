import { loadConfigSync } from '../../../../_util/config-loader'
import { DB } from '../../../../db/_db/db'
import { UserDB } from '../../../../db/user/user-db'
import { Express2 } from '../../../_express/express2'
import supertest, { SuperAgentTest } from 'supertest'
import { registerUserAuthApi } from '../../user-auth/api/user-auth-api'
import { insertUserFix4, USER1_LOGIN } from '../../../../db/user/fixture/user-fix'
import { ImageDB } from '../../../../db/image/image-db'
import { ImageFileManager } from '../../../../file/fileman'
import { registerImageUploadApi } from './image-upload-api'
import { loginForTest } from '../../user-auth/api/user-auth-api-fixture'
import { getImageMetaOfFile } from '../../../../file/magick/magick2'
import { registerImageUpdateApi } from './image-update-api'
import { OsokyFileManager } from '../../../../file/osoky-fileman'
import { IMAGE_SIZE } from '../../../../_type/error-image'
import { Config } from '../../../../_type/config'
import { UserCache } from '../../../../db/user/cache/user-cache'

describe('ImageUpdateApi Osoky', () => {

  let config: Config

  let db: DB
  let udb: UserDB
  let uc: UserCache

  let idb: ImageDB
  let ifm: ImageFileManager

  let web: Express2
  let sat: SuperAgentTest

  beforeAll(async () => {
    config = loadConfigSync('config/osoky-test.json')

    db = await DB.from(config).createDatabase()
    udb = UserDB.from(db)
    uc = UserCache.from(udb)

    idb = ImageDB.from(db)
    ifm = OsokyFileManager.from(config)

    web = Express2.from(config).useUpload()
    registerUserAuthApi(web, uc)
    registerImageUploadApi(web, udb, idb, ifm)
    registerImageUpdateApi(web, idb, ifm)
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
  it('upload', async () => {
    const res = await sat.post('/api/image-upload').field('comment', 'c1')
      .attach('file', 'sample/1280x720.jpg').expect(200)
    expect(res.body.id).toEqual(1)
  })
  it('check db', async () => {
    const r = await idb.findImage(1)
    if (!r) throw new Error()
    expect(r.uid).toBe(1)
    expect(Date.now() - r.cdate.getTime()).toBeLessThan(4000)
    expect(r.comment).toBe('c1')
  })
  it('check file', async () => {
    const meta = await getImageMetaOfFile(ifm.getPathFor(1))
    expect(meta.width).toBe(720)
    expect(meta.height).toBe(720)
  })
  it('update', async () => {
    const res = await sat.put('/api/image-update/1').field('comment', 'c2')
      .attach('file', 'sample/4096x2304.jpg').expect(200)
    expect(res.body).toEqual({})
  })
  it('check db', async () => {
    const r = await idb.findImage(1)
    if (!r) throw new Error()
    expect(r.uid).toBe(1)
    expect(Date.now() - r.cdate.getTime()).toBeLessThan(3000)
    expect(r.comment).toBe('c2')
  })
  it('check file', async () => {
    const meta = await getImageMetaOfFile(ifm.getPathFor(1))
    expect(meta.width).toBe(2048)
    expect(meta.height).toBe(2048)
  })
  it('update fails if image too small', async () => {
    const res = await sat.put('/api/image-update/1').attach('file', 'sample/640x360.jpg').expect(200)
    expect(res.body.err).toContain(IMAGE_SIZE)
  })

})
