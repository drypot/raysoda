import supertest, { SuperAgentTest } from 'supertest'
import { ADMIN_LOGIN, insertUserFix4, USER1_LOGIN, USER2_LOGIN } from '@server/db/user/fixture/user-fix'
import { NOT_AUTHORIZED } from '@common/type/error-const'
import { ImageFileManager } from '@server/file/_fileman'
import { omanCloseAllObjects, omanGetConfig, omanGetObject, omanNewSession } from '@server/oman/oman'
import { useImageUpdateApi } from '@server/domain/image/api/image-update-api'
import { useUserAuthApi } from '@server/domain/user/api/user-auth-api'
import { Express2 } from '@server/express/express2'
import { loginForTest } from '@server/domain/user/api/user-auth-api-fixture'
import { omanGetImageFileManager } from '@server/file/_fileman-loader'
import { ImageDB } from '@server/db/image/image-db'
import { UserDB } from '@server/db/user/user-db'
import { useImageUploadApi } from '@server/domain/image/api/image-upload-api'

describe('ImageUpdateGetApi', () => {

  let udb: UserDB
  let idb: ImageDB
  let ifm: ImageFileManager
  let web: Express2
  let sat: SuperAgentTest

  beforeAll(async () => {
    omanNewSession('config/raysoda-test.json')
    udb = await omanGetObject('UserDB') as UserDB
    idb = await omanGetObject('ImageDB') as ImageDB
    ifm = await omanGetImageFileManager(omanGetConfig().appNamel)
    web = await omanGetObject('Express2') as Express2
    await useUserAuthApi()
    await useImageUploadApi()
    await useImageUpdateApi()
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
  it('upload', async () => {
    const res = await sat.post('/api/image-upload').field('comment', 'c1')
      .attach('file', 'sample/640x360.jpg').expect(200)
    expect(res.body.id).toEqual(1)
  })
  it('get image by user1', async () => {
    const res = await sat.get('/api/image-update-get/1').expect(200)
    expect(res.body).toEqual({
      image: { comment: 'c1' }
    })
  })
  it('login as user2', async () => {
    await loginForTest(sat, USER2_LOGIN)
  })
  it('get image by user2', async () => {
    const res = await sat.get('/api/image-update-get/1').expect(200)
    expect(res.body.err).toContain(NOT_AUTHORIZED)
  })
  it('login as admin', async () => {
    await loginForTest(sat, ADMIN_LOGIN)
  })
  it('get image by admin', async () => {
    const res = await sat.get('/api/image-update-get/1').expect(200)
    expect(res.body).toEqual({
      image: { comment: 'c1' }
    })
  })

})

