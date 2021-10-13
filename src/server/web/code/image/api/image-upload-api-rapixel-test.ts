import { UserDB } from '../../../../db/user/user-db'
import { Express2 } from '../../../_express/express2'
import supertest, { SuperAgentTest } from 'supertest'
import { useUserAuthApi } from '../../user-auth/api/user-auth-api'
import { insertUserFix4, USER1_LOGIN } from '../../../../db/user/fixture/user-fix'
import { ImageDB } from '../../../../db/image/image-db'
import { ImageFileManager } from '../../../../file/_fileman'
import { useImageUploadApi } from './image-upload-api'
import { loginForTest } from '../../user-auth/api/user-auth-api-fixture'
import { getImageMetaOfFile } from '../../../../file/magick/magick2'
import { IMAGE_SIZE } from '../../../../_type/error-const'
import { omanCloseAllObjects, omanGetConfig, omanGetObject, omanNewSession } from '../../../../oman/oman'
import { omanGetImageFileManager } from '../../../../file/_fileman-loader'

jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000

describe('ImageUploadApi Rapixel', () => {

  let udb: UserDB
  let idb: ImageDB
  let ifm: ImageFileManager
  let web: Express2
  let sat: SuperAgentTest

  beforeAll(async () => {
    omanNewSession('config/rapixel-test.json')
    udb = await omanGetObject('UserDB') as UserDB
    idb = await omanGetObject('ImageDB') as ImageDB
    ifm = await omanGetImageFileManager(omanGetConfig().appNamel)
    web = await omanGetObject('Express2') as Express2
    await useUserAuthApi()
    await useImageUploadApi()
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
    await idb.dropTable()
    await idb.createTable()
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


