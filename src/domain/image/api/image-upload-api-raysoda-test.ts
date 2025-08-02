import { getUserDB, UserDB } from '../../../db/user/user-db.js'
import { getImageDB, ImageDB } from '../../../db/image/image-db.js'
import { ImageFileManager } from '../../../fileman/fileman.js'
import { Express2, getExpress2 } from '../../../express/express2.js'
import supertest from 'supertest'
import { closeAllObjects, getConfig, initObjectContext } from '../../../oman/oman.js'
import { getImageFileManager } from '../../../fileman/fileman-loader.js'
import { useUserAuthApi } from '../../user/api/user-auth-api.js'
import { useImageUploadApi } from './image-upload-api.js'
import { insertUserFix4, USER1_LOGIN_FORM } from '../../../db/user/fixture/user-fix.js'
import { IMAGE_NO_FILE, IMAGE_SIZE, IMAGE_TYPE, NOT_AUTHENTICATED } from '../../../common/type/error-const.js'
import { userLoginForTest } from '../../user/api/user-auth-api-fixture.js'
import { getImageMetaOfFile } from '../../../fileman/magick/magick2.js'

describe('ImageUploadApi RaySoda', () => {

  let udb: UserDB
  let idb: ImageDB
  let ifm: ImageFileManager
  let express2: Express2
  let agent: supertest.Agent

  beforeAll(async () => {
    initObjectContext('config/raysoda-test.json')
    udb = await getUserDB()
    idb = await getImageDB()
    ifm = await getImageFileManager(getConfig().appNamel)
    express2 = await getExpress2()
    await useUserAuthApi()
    await useImageUploadApi()
    await express2.start()
    agent = supertest.agent(express2.server)
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
    const res = await agent.post('/api/image-upload').expect(200)
    expect(res.body.err).toContain(NOT_AUTHENTICATED)
  })
  it('login as user1', async () => {
    await userLoginForTest(agent, USER1_LOGIN_FORM)
  })
  it('upload fails if file not sent', async () => {
    const res = await agent.post('/api/image-upload').expect(200)
    expect(res.body.err).toContain(IMAGE_NO_FILE)
  })
  it('upload fails if file is not image', async () => {
    const res = await agent.post('/api/image-upload').attach('file', 'sample/text1.txt').expect(200)
    expect(res.body.err).toContain(IMAGE_TYPE)
  })
  it('upload fails if image is too small', async () => {
    const res = await agent.post('/api/image-upload').attach('file', 'sample/360x240.jpg').expect(200)
    expect(res.body.err).toContain(IMAGE_SIZE)

  })

  it('upload horizontal image', async () => {
    // resize 기능 테스트를 위해 2048 보다 큰 이미지를 업로드한다.
    const res = await agent.post('/api/image-upload')
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
    const res = await agent.post('/api/image-upload')
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
    const res = await agent.post('/api/image-upload')
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
    const res = await agent.post('/api/image-upload')
      .field('comment', 'small')
      .attach('file', 'sample/640x360.jpg')
      .expect(200)
    expect(res.body.err).toBeUndefined()
    expect(res.body.id).toBeUndefined()
  })

})


