import supertest, { SuperAgentTest } from 'supertest'
import { insertUserFix4, USER1_LOGIN_FORM } from '@server/db/user/fixture/user-fix'
import { IMAGE_NO_FILE, IMAGE_SIZE, IMAGE_TYPE, NOT_AUTHENTICATED } from '@common/type/error-const'
import { getImageMetaOfFile } from '@server/fileman/magick/magick2'
import { ImageFileManager } from '@server/fileman/_fileman'
import { closeAllObjects, getConfig, getObject, initObjectContext } from '@server/oman/oman'
import { useUserAuthApi } from '@server/domain/user/api/user-auth-api'
import { Express2 } from '@server/express/express2'
import { userLoginForTest } from '@server/domain/user/api/user-auth-api-fixture'
import { getImageFileManager } from '@server/fileman/_fileman-loader'
import { ImageDB } from '@server/db/image/image-db'
import { UserDB } from '@server/db/user/user-db'
import { useImageUploadApi } from '@server/domain/image/api/image-upload-api'

describe('ImageUploadApi RaySoda', () => {

  let udb: UserDB
  let idb: ImageDB
  let ifm: ImageFileManager
  let web: Express2
  let sat: SuperAgentTest

  beforeAll(async () => {
    initObjectContext('config/raysoda-test.json')
    udb = await getObject('UserDB') as UserDB
    idb = await getObject('ImageDB') as ImageDB
    ifm = await getImageFileManager(getConfig().appNamel)
    web = await getObject('Express2') as Express2
    await useUserAuthApi()
    await useImageUploadApi()
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
    await idb.dropTable()
    await idb.createTable()
  })
  it('remove image dir', async () => {
    await ifm.rmRoot()
  })

  it('upload fails if not logged in', async () => {
    const res = await sat.post('/api/image-upload').expect(200)
    expect(res.body.err).toContain(NOT_AUTHENTICATED)
  })
  it('login as user1', async () => {
    await userLoginForTest(sat, USER1_LOGIN_FORM)
  })
  it('upload fails if file not sent', async () => {
    const res = await sat.post('/api/image-upload').expect(200)
    expect(res.body.err).toContain(IMAGE_NO_FILE)
  })
  it('upload fails if file is not image', async () => {
    const res = await sat.post('/api/image-upload').attach('file', 'sample/text1.txt').expect(200)
    expect(res.body.err).toContain(IMAGE_TYPE)
  })
  it('upload fails if image is too small', async () => {
    const res = await sat.post('/api/image-upload').attach('file', 'sample/360x240.jpg').expect(200)
    expect(res.body.err).toContain(IMAGE_SIZE)

  })

  it('upload horizontal image', async () => {
    // resize 기능 테스트를 위해 2048 보다 큰 이미지를 업로드한다.
    const res = await sat.post('/api/image-upload')
      .field('comment', 'h')
      .attach('file', 'sample/4096x2304.jpg')
      .expect(200)
    expect(res.body.id).toBe(1)
  })
  it('check db', async () => {
    const r = await idb.getImage(1)
    if (!r) throw new Error()
    expect(r.uid).toBe(1)
    expect(Date.now() - r.cdate.getTime()).toBeLessThan(9900)
    expect(r.comment).toBe('h')
  })
  it('check file', async () => {
    const meta = await getImageMetaOfFile(ifm.getPathFor(1))
    expect(meta.width).toBe(3840)
    expect(meta.height).toBe(2160)
  })

  it('upload vertical image', async () => {
    const res = await sat.post('/api/image-upload')
      .field('comment', 'v')
      .attach('file', 'sample/1440x2560.jpg')
      .expect(200)
    expect(res.body.id).toBe(2)
  })
  it('check db', async () => {
    const r = await idb.getImage(2)
    if (!r) throw new Error()
    expect(r.uid).toBe(1)
    expect(Date.now() - r.cdate.getTime()).toBeLessThan(9900)
    expect(r.comment).toBe('v')
  })
  it('check file', async () => {
    const meta = await getImageMetaOfFile(ifm.getPathFor(2))
    expect(meta.width).toBe(1215)
    expect(meta.height).toBe(2160)
  })

  it('upload small image', async () => {
    const res = await sat.post('/api/image-upload')
      .field('comment', 'small')
      .attach('file', 'sample/640x360.jpg')
      .expect(200)
    expect(res.body.id).toBe(3)
  })
  it('check db', async () => {
    const r = await idb.getImage(3)
    if (!r) throw new Error()
    expect(r.uid).toBe(1)
    expect(Date.now() - r.cdate.getTime()).toBeLessThan(9900)
    expect(r.comment).toBe('small')
  })
  it('check file', async () => {
    const meta = await getImageMetaOfFile(ifm.getPathFor(3))
    expect(meta.width).toBe(640)
    expect(meta.height).toBe(360)
  })

  it('upload 4th image should fail', async () => {
    const res = await sat.post('/api/image-upload')
      .field('comment', 'small')
      .attach('file', 'sample/640x360.jpg')
      .expect(200)
    expect(res.body.err).toBeUndefined()
    expect(res.body.id).toBeUndefined()
  })

})


