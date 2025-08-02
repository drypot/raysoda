import { getUserDB, UserDB } from '../../../db/user/user-db.js'
import { getImageDB, ImageDB } from '../../../db/image/image-db.js'
import { ImageFileManager } from '../../../fileman/fileman.js'
import { Express2, getExpress2 } from '../../../express/express2.js'
import supertest from 'supertest'
import { closeAllObjects, getConfig, initObjectContext } from '../../../oman/oman.js'
import { getImageFileManager } from '../../../fileman/fileman-loader.js'
import { useUserAuthApi } from '../../user/api/user-auth-api.js'
import { useImageUploadApi } from './image-upload-api.js'
import { useImageUpdateApi } from './image-update-api.js'
import { insertUserFix4, USER1_LOGIN_FORM, USER2_LOGIN_FORM } from '../../../db/user/fixture/user-fix.js'
import { userLoginForTest, userLogoutForTest } from '../../user/api/user-auth-api-fixture.js'
import { getImageMetaOfFile } from '../../../fileman/magick/magick2.js'
import { IMAGE_NOT_EXIST, IMAGE_SIZE, NOT_AUTHENTICATED, NOT_AUTHORIZED } from '../../../common/type/error-const.js'

describe('ImageUpdateApi RaySoda', () => {

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
    await useImageUpdateApi()
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
  it('upload', async () => {
    const res = await agent.post('/api/image-upload')
      .field('id', 1).field('comment', 'c1').attach('file', 'sample/4096x2304.jpg').expect(200)
    expect(res.body.id).toEqual(1)
  })
  it('check file', async () => {
    const meta = await getImageMetaOfFile(ifm.getPathFor(1))
    expect(meta.width).toBe(3840)
    expect(meta.height).toBe(2160)
  })
  it('update', async () => {
    const res = await agent.put('/api/image-update')
      .field('id', 1).field('comment', 'c2').attach('file', 'sample/1440x2560.jpg').expect(200)
    expect(res.body).toEqual({})
  })
  it('check db', async () => {
    const r = await idb.getImage(1)
    if (!r) throw new Error()
    expect(r.uid).toBe(1)
    expect(Date.now() - r.cdate.getTime()).toBeLessThan(9900)
    expect(r.comment).toBe('c2')
  })
  it('check file', async () => {
    const meta = await getImageMetaOfFile(ifm.getPathFor(1))
    expect(meta.width).toBe(1215)
    expect(meta.height).toBe(2160)
  })

  it('update comment only', async () => {
    const res = await agent.put('/api/image-update')
      .field('id', 1).field('comment', 'only').expect(200)
    expect(res.body).toEqual({})
  })
  it('check db', async () => {
    const r = await idb.getImage(1)
    if (!r) throw new Error()
    expect(r.comment).toBe('only')
  })
  it('check file', async () => {
    const meta = await getImageMetaOfFile(ifm.getPathFor(1))
    expect(meta.width).toBe(1215)
    expect(meta.height).toBe(2160)
  })

  it('update fails if image too small', async () => {
    const res = await agent.put('/api/image-update')
      .field('id', 1).attach('file', 'sample/360x240.jpg').expect(200)
    expect(res.body.err).toContain(IMAGE_SIZE)
  })
  it('update fails if image not exist', async () => {
    const res = await agent.put('/api/image-update').field('id', 2).expect(200)
    expect(res.body.err).toContain(IMAGE_NOT_EXIST)
  })

  it('logout', async () => {
    await userLogoutForTest(agent)
  })
  it('update fails if not logged in', async () => {
    const res = await agent.put('/api/image-update').field('id', 1).expect(200)
    expect(res.body.err).toContain(NOT_AUTHENTICATED)
  })

  it('login as user2', async () => {
    await userLoginForTest(agent, USER2_LOGIN_FORM)
  })
  it('update fails if owner not match', async () => {
    const res = await agent.put('/api/image-update').field('id', 1).expect(200)
    expect(res.body.err).toContain(NOT_AUTHORIZED)
  })

})


