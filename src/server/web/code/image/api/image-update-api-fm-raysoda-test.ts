import { UserDB } from '../../../../db/user/user-db'
import { Express2 } from '../../../_express/express2'
import supertest, { SuperAgentTest } from 'supertest'
import { useUserAuthApi } from '../../user-auth/api/user-auth-api'
import { insertUserFix4, USER1_LOGIN, USER2_LOGIN } from '../../../../db/user/fixture/user-fix'
import { ImageDB } from '../../../../db/image/image-db'
import { ImageFileManager } from '../../../../file/_fileman'
import { useImageUploadApi } from './image-upload-api'
import { loginForTest, logoutForTest } from '../../user-auth/api/user-auth-api-fixture'
import { getImageMetaOfFile } from '../../../../file/magick/magick2'
import { useImageUpdateApi } from './image-update-api'
import { IMAGE_NOT_EXIST, IMAGE_SIZE, NOT_AUTHENTICATED, NOT_AUTHORIZED } from '../../../../_type/error-const'
import { omanCloseAllObjects, omanGetConfig, omanGetObject, omanNewSession } from '../../../../oman/oman'
import { omanGetImageFileManager } from '../../../../file/_fileman-loader'

describe('ImageUpdateApi RaySoda', () => {

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
      .attach('file', 'sample/2560x1440.jpg').expect(200)
    expect(res.body.id).toEqual(1)
  })
  it('check file', async () => {
    const meta = await getImageMetaOfFile(ifm.getPathFor(1))
    expect(meta.width).toBe(2048)
    expect(meta.height).toBe(1152)
  })
  it('update', async () => {
    const res = await sat.put('/api/image-update/1').field('comment', 'c2')
      .attach('file', 'sample/1440x2560.jpg').expect(200)
    expect(res.body).toEqual({})
  })
  it('check db', async () => {
    const r = await idb.findImage(1)
    if (!r) throw new Error()
    expect(r.uid).toBe(1)
    expect(Date.now() - r.cdate.getTime()).toBeLessThan(3000)
    expect(r.comment).toBe('c2')
  })
  it('check file', async () => {
    const meta = await getImageMetaOfFile(ifm.getPathFor(1))
    expect(meta.width).toBe(1152)
    expect(meta.height).toBe(2048)
  })
  it('update comment', async () => {
    const res = await sat.put('/api/image-update/1').field('comment', 'only').expect(200)
    expect(res.body).toEqual({})
  })
  it('check db', async () => {
    const r = await idb.findImage(1)
    if (!r) throw new Error()
    expect(r.comment).toBe('only')
  })
  it('check file', async () => {
    const meta = await getImageMetaOfFile(ifm.getPathFor(1))
    expect(meta.width).toBe(1152)
    expect(meta.height).toBe(2048)
  })
  it('update fails if image too small', async () => {
    const res = await sat.put('/api/image-update/1').attach('file', 'sample/360x240.jpg').expect(200)
    expect(res.body.err).toContain(IMAGE_SIZE)
  })
  it('update fails if image not exist', async () => {
    const res = await sat.put('/api/image-update/2').expect(200)
    expect(res.body.err).toContain(IMAGE_NOT_EXIST)
  })
  it('logout', async () => {
    await logoutForTest(sat)
  })
  it('update fails if not logged in', async () => {
    const res = await sat.put('/api/image-update/1').expect(200)
    expect(res.body.err).toContain(NOT_AUTHENTICATED)
  })
  it('login as user2', async () => {
    await loginForTest(sat, USER2_LOGIN)
  })
  it('update fails if owner not match', async () => {
    const res = await sat.put('/api/image-update/1').expect(200)
    expect(res.body.err).toContain(NOT_AUTHORIZED)
  })

})


