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
import {
  ADMIN_LOGIN_FORM,
  insertUserFix4,
  USER1_LOGIN_FORM,
  USER2_LOGIN_FORM
} from '../../../db/user/fixture/user-fix.js'
import { userLoginForTest } from '../../user/api/user-auth-api-fixture.js'
import { NOT_AUTHORIZED } from '../../../common/type/error-const.js'

describe('ImageUpdateGetApi', () => {

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
      .field('comment', 'c1').attach('file', 'sample/640x360.jpg').expect(200)
    expect(res.body.id).toEqual(1)
  })
  it('get image by user1', async () => {
    const res = await agent.get('/api/image-update-get/1').expect(200)
    expect(res.body).toEqual({
      image: { id: 1, comment: 'c1' }
    })
  })

  it('login as user2', async () => {
    await userLoginForTest(agent, USER2_LOGIN_FORM)
  })
  it('get image by user2', async () => {
    const res = await agent.get('/api/image-update-get/1').expect(200)
    expect(res.body.err).toContain(NOT_AUTHORIZED)
  })
  it('login as admin', async () => {
    await userLoginForTest(agent, ADMIN_LOGIN_FORM)
  })
  it('get image by admin', async () => {
    const res = await agent.get('/api/image-update-get/1').expect(200)
    expect(res.body).toEqual({
      image: { id: 1, comment: 'c1' }
    })
  })

})


