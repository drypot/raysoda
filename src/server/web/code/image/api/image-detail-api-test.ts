import { UserDB } from '../../../../db/user/user-db'
import { ImageDB } from '../../../../db/image/image-db'
import { ImageFileManager } from '../../../../file/_fileman'
import { Express2 } from '../../../_express/express2'
import supertest, { SuperAgentTest } from 'supertest'
import { useUserAuthApi } from '../../user-auth/api/user-auth-api'
import { useImageUploadApi } from './image-upload-api'
import { ADMIN_LOGIN, insertUserFix4, USER1_LOGIN, USER2_LOGIN } from '../../../../db/user/fixture/user-fix'
import { useImageDetailApi } from './image-detail-api'
import { loginForTest, logoutForTest } from '../../user-auth/api/user-auth-api-fixture'
import { ImageDetail, unpackImageDetail } from '../../../../_type/image-detail'
import { newDateString } from '../../../../_util/date2'
import { IMAGE_NOT_EXIST } from '../../../../_type/error-const'
import { omanCloseAllObjects, omanGetConfig, omanGetObject, omanNewSession } from '../../../../oman/oman'
import { omanGetImageFileManager } from '../../../../file/_fileman-loader'

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
