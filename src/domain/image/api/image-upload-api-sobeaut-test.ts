import { getUserDB, UserDB } from '../../../db/user/user-db.ts'
import { getImageDB, ImageDB } from '../../../db/image/image-db.ts'
import type { ImageFileManager } from '../../../fileman/fileman.ts'
import { Express2, getExpress2 } from '../../../express/express2.ts'
import supertest from 'supertest'
import { closeAllObjects, getConfig, initObjectContext } from '../../../oman/oman.ts'
import { getImageFileManager } from '../../../fileman/fileman-loader.ts'
import { useUserAuthApi } from '../../user/api/user-auth-api.ts'
import { useImageUploadApi } from './image-upload-api.ts'
import { insertUserFix4, USER1_LOGIN_FORM } from '../../../db/user/fixture/user-fix.ts'
import { userLoginForTest } from '../../user/api/user-auth-api-fixture.ts'
import { IMAGE_SIZE } from '../../../common/type/error-const.ts'
import { getImageMetaOfFile } from '../../../fileman/magick/magick2.ts'

describe('ImageUploadApi Sobeaut', () => {

  let udb: UserDB
  let idb: ImageDB
  let ifm: ImageFileManager
  let express2: Express2
  let agent: supertest.Agent

  beforeAll(async () => {
    initObjectContext('config/sobeaut-test.json')
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
  it('login as user1', async () => {
    await userLoginForTest(agent, USER1_LOGIN_FORM)
  })
  it('upload fails if image is too small', async () => {
    const res = await agent.post('/api/image-upload').attach('file', 'sample/640x360.jpg').expect(200)
    expect(res.body.err).toContain(IMAGE_SIZE)
  })
  it('upload 4096x2304', async () => {
    const res = await agent.post('/api/image-upload').field('comment', 'c1')
      .attach('file', 'sample/4096x2304.jpg').expect(200)
    expect(res.body.id).toBe(1)
  })
  it('check db', async () => {
    const r = await idb.getImage(1)
    if (!r) throw new Error()
    expect(r.uid).toBe(1)
    expect(Date.now() - r.cdate.getTime()).toBeLessThan(9900)
    expect(r.comment).toBe('c1')
  })
  it('check file', async () => {
    const meta = await getImageMetaOfFile(ifm.getPathFor(1))
    expect(meta.width).toBe(2160)
    expect(meta.height).toBe(2160)
  })
  it('upload 1280x720', async () => {
    const res = await agent.post('/api/image-upload').field('comment', 'c2')
      .attach('file', 'sample/1280x720.jpg').expect(200)
    expect(res.body.id).toBe(2)
  })
  it('check db', async () => {
    const r = await idb.getImage(2)
    if (!r) throw new Error()
    expect(r.uid).toBe(1)
    expect(Date.now() - r.cdate.getTime()).toBeLessThan(9900)
    expect(r.comment).toBe('c2')
  })
  it('check file', async () => {
    const meta = await getImageMetaOfFile(ifm.getPathFor(2))
    expect(meta.width).toBe(720)
    expect(meta.height).toBe(720)
  })

})


