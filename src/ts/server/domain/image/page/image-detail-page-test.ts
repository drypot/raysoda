import supertest, { SuperAgentTest } from 'supertest'
import { insertUserFix4, USER1_LOGIN_FORM } from '@server/db/user/fixture/user-fix'
import { ImageFileManager } from '@server/fileman/_fileman'
import { closeAllObjects, getConfig, getObject, initObjectContext } from '@server/oman/oman'
import { useUserAuthApi } from '@server/domain/user/api/user-auth-api'
import { Express2 } from '@server/express/express2'
import { userLoginForTest } from '@server/domain/user/api/user-auth-api-fixture'
import { getImageFileManager } from '@server/fileman/_fileman-loader'
import { ImageDB } from '@server/db/image/image-db'
import { useImageDetailPage } from '@server/domain/image/page/image-detail-page'
import { UserDB } from '@server/db/user/user-db'
import { useImageUploadApi } from '@server/domain/image/api/image-upload-api'

describe('ImageDetailPage', () => {

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
    await useImageDetailPage()
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
  it('login as user1', async () => {
    await userLoginForTest(sat, USER1_LOGIN_FORM)
  })
  it('upload image', async () => {
    const res = await sat.post('/api/image-upload')
      .field('comment', 'c1')
      .attach('file', 'sample/640x360.jpg')
      .expect(200)
    expect(res.body.id).toBe(1)
  })
  it('get image 1', async () => {
    const res = await sat.get('/image/1').expect(200).expect(/<title>Image/)
  })
  it('get image invalid', async () => {
    const res = await sat.get('/image/99').expect(200).expect(/<title>Error/)
  })
})


