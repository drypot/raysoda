import supertest, { SuperAgentTest } from 'supertest'
import { ADMIN_LOGIN, insertUserFix4, USER1_LOGIN, USER2_LOGIN } from '@server/db/user/fixture/user-fix'
import { newDateString } from '@common/util/date2'
import { ImageDetail, unpackImageDetail } from '@common/type/image-detail'
import { ImageFileManager } from '@server/file/_fileman'
import { omanCloseAllObjects, omanGetConfig, omanGetObject, omanNewSession } from '@server/oman/oman'
import { IMAGE_NOT_EXIST } from '@common/type/error-const'
import { useUserAuthApi } from '@server/web/user/api/user-auth-api'
import { Express2 } from '@server/web/_express/express2'
import { useImageDetailApi } from '@server/web/image/api/image-detail-api'
import { loginForTest, logoutForTest } from '@server/web/user/api/user-auth-api-fixture'
import { omanGetImageFileManager } from '@server/file/_fileman-loader'
import { ImageDB } from '@server/db/image/image-db'
import { UserDB } from '@server/db/user/user-db'
import { useImageUploadApi } from '@server/web/image/api/image-upload-api'

describe('ImageDetailApi', () => {

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
    await useImageDetailApi()
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
  it('upload image', async () => {
    const res = await sat.post('/api/image-upload')
      .field('comment', 'c1')
      .attach('file', 'sample/640x360.jpg')
      .expect(200)
    expect(res.body.id).toBe(1)
  })

  let now: Date

  it('get now', async () => {
    const image = await idb.findImage(1)
    if (!image) throw new Error()
    now = image.cdate
  })
  it('get image by user1', async () => {
    const res = await sat.get('/api/image/1').expect(200)
    const image = res.body.image as ImageDetail
    unpackImageDetail(image)
    expect(image as any).toEqual({
      id: 1,
      owner: { id: 1, name: 'User 1', home: 'user1' },
      cdate: now,
      cdateNum: now.getTime(),
      cdateStr: newDateString(now),
      vers: null,
      comment: 'c1',
      dirUrl: 'http://file.raysoda.test:8080/images/0/0',
      thumbUrl: 'http://file.raysoda.test:8080/images/0/0/1.jpg',
      updatable: true // ***
    })
  })
  it('login as user2', async () => {
    await loginForTest(sat, USER2_LOGIN)
  })
  it('get image by user2', async () => {
    const res = await sat.get('/api/image/1').expect(200)
    expect(res.body.image.updatable).toBe(false)
  })
  it('login as admin', async () => {
    await loginForTest(sat, ADMIN_LOGIN)
  })
  it('get image by admin', async () => {
    const res = await sat.get('/api/image/1').expect(200)
    expect(res.body.image.updatable).toBe(true)
  })
  it('logout', async () => {
    await logoutForTest(sat)
  })
  it('get image by guest', async () => {
    const res = await sat.get('/api/image/1').expect(200)
    expect(res.body.image.updatable).toBe(false)
  })
  it('get invalid image', async () => {
    const res = await sat.get('/api/image/99').expect(200)
    expect(res.body.err).toContain(IMAGE_NOT_EXIST)
  })

})
