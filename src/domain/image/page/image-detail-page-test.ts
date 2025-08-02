import { getUserDB, UserDB } from '../../../db/user/user-db.js'
import { getImageDB, ImageDB } from '../../../db/image/image-db.js'
import { ImageFileManager } from '../../../fileman/fileman.js'
import { Express2, getExpress2 } from '../../../express/express2.js'
import supertest from 'supertest'
import { closeAllObjects, getConfig, initObjectContext } from '../../../oman/oman.js'
import { getImageFileManager } from '../../../fileman/fileman-loader.js'
import { useUserAuthApi } from '../../user/api/user-auth-api.js'
import { useImageUploadApi } from '../api/image-upload-api.js'
import { useImageDetailPage } from './image-detail-page.js'
import { insertUserFix4, USER1_LOGIN_FORM } from '../../../db/user/fixture/user-fix.js'
import { userLoginForTest } from '../../user/api/user-auth-api-fixture.js'

describe('ImageDetailPage', () => {

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
    await useImageDetailPage()
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
  it('get image 1', async () => {
    const res = await agent.get('/image/1').expect(200).expect(/<title>Image/)
  })
  it('get image invalid', async () => {
    const res = await agent.get('/image/99').expect(200).expect(/<title>Error/)
  })
})


