import { getUserDB, UserDB } from '../../../db/user/user-db.ts'
import { getImageDB, ImageDB } from '../../../db/image/image-db.ts'
import type { ImageFileManager } from '../../../fileman/fileman.ts'
import { Express2, getExpress2 } from '../../../express/express2.ts'
import supertest from 'supertest'
import { closeAllObjects, getConfig, initObjectContext } from '../../../oman/oman.ts'
import { getImageFileManager } from '../../../fileman/fileman-loader.ts'
import { useUserAuthApi } from '../../user/api/user-auth-api.ts'
import { useImageUploadApi } from './image-upload-api.ts'
import { useImageDetailApi } from './image-detail-api.ts'
import {
  ADMIN_LOGIN_FORM,
  insertUserFix4,
  USER1_LOGIN_FORM,
  USER2_LOGIN_FORM
} from '../../../db/user/fixture/user-fix.ts'
import { userLoginForTest, userLogoutForTest } from '../../user/api/user-auth-api-fixture.ts'
import { type ImageDetail, unpackImageDetail } from '../../../common/type/image-detail.ts'
import { dateToString } from '../../../common/util/date2.ts'
import { IMAGE_NOT_EXIST } from '../../../common/type/error-const.ts'

describe('ImageDetailApi', () => {

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
    await useImageDetailApi()
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
  it('upload image', async () => {
    const res = await agent.post('/api/image-upload')
      .field('comment', 'c1')
      .attach('file', 'sample/640x360.jpg')
      .expect(200)
    expect(res.body.id).toBe(1)
  })

  let now: Date

  it('get now', async () => {
    const image = await idb.getImage(1)
    if (!image) throw new Error()
    now = image.cdate
  })
  it('get image by user1', async () => {
    const res = await agent.get('/api/image/1').expect(200)
    const image = res.body.image as ImageDetail
    unpackImageDetail(image)
    expect(image as any).toEqual({
      id: 1,
      owner: { id: 1, name: 'name1', home: 'home1' },
      cdate: now,
      cdateNum: now.getTime(),
      cdateStr: dateToString(now),
      vers: null,
      comment: 'c1',
      dirUrl: 'http://file.raysoda.test:8080/images/0/0',
      thumbUrl: 'http://file.raysoda.test:8080/images/0/0/1.jpg',
      updatable: true // ***
    })
  })
  it('login as user2', async () => {
    await userLoginForTest(agent, USER2_LOGIN_FORM)
  })
  it('get image by user2', async () => {
    const res = await agent.get('/api/image/1').expect(200)
    expect(res.body.image.updatable).toBe(false)
  })
  it('login as admin', async () => {
    await userLoginForTest(agent, ADMIN_LOGIN_FORM)
  })
  it('get image by admin', async () => {
    const res = await agent.get('/api/image/1').expect(200)
    expect(res.body.image.updatable).toBe(true)
  })
  it('logout', async () => {
    await userLogoutForTest(agent)
  })
  it('get image by guest', async () => {
    const res = await agent.get('/api/image/1').expect(200)
    expect(res.body.image.updatable).toBe(false)
  })
  it('get invalid image', async () => {
    const res = await agent.get('/api/image/99').expect(200)
    expect(res.body.err).toContain(IMAGE_NOT_EXIST)
  })

})
