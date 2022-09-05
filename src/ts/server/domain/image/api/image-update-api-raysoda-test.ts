import supertest, { SuperAgentTest } from 'supertest'
import { insertUserFix4, USER1_LOGIN_FORM, USER2_LOGIN_FORM } from '@server/db/user/fixture/user-fix'
import { IMAGE_NOT_EXIST, IMAGE_SIZE, NOT_AUTHENTICATED, NOT_AUTHORIZED } from '@common/type/error-const'
import { getImageMetaOfFile } from '@server/fileman/magick/magick2'
import { ImageFileManager } from '@server/fileman/_fileman'
import { closeAllObjects, getConfig, getObject, initObjectContext } from '@server/oman/oman'
import { useImageUpdateApi } from '@server/domain/image/api/image-update-api'
import { useUserAuthApi } from '@server/domain/user/api/user-auth-api'
import { Express2 } from '@server/express/express2'
import { userLoginForTest, userLogoutForTest } from '@server/domain/user/api/user-auth-api-fixture'
import { getImageFileManager } from '@server/fileman/_fileman-loader'
import { ImageDB } from '@server/db/image/image-db'
import { UserDB } from '@server/db/user/user-db'
import { useImageUploadApi } from '@server/domain/image/api/image-upload-api'

describe('ImageUpdateApi RaySoda', () => {

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
    await useImageUpdateApi()
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
  it('upload', async () => {
    const res = await sat.post('/api/image-upload')
      .field('id', 1).field('comment', 'c1').attach('file', 'sample/4096x2304.jpg').expect(200)
    expect(res.body.id).toEqual(1)
  })
  it('check file', async () => {
    const meta = await getImageMetaOfFile(ifm.getPathFor(1))
    expect(meta.width).toBe(3840)
    expect(meta.height).toBe(2160)
  })
  it('update', async () => {
    const res = await sat.put('/api/image-update')
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
    const res = await sat.put('/api/image-update')
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
    const res = await sat.put('/api/image-update')
      .field('id', 1).attach('file', 'sample/360x240.jpg').expect(200)
    expect(res.body.err).toContain(IMAGE_SIZE)
  })
  it('update fails if image not exist', async () => {
    const res = await sat.put('/api/image-update').field('id', 2).expect(200)
    expect(res.body.err).toContain(IMAGE_NOT_EXIST)
  })

  it('logout', async () => {
    await userLogoutForTest(sat)
  })
  it('update fails if not logged in', async () => {
    const res = await sat.put('/api/image-update').field('id', 1).expect(200)
    expect(res.body.err).toContain(NOT_AUTHENTICATED)
  })

  it('login as user2', async () => {
    await userLoginForTest(sat, USER2_LOGIN_FORM)
  })
  it('update fails if owner not match', async () => {
    const res = await sat.put('/api/image-update').field('id', 1).expect(200)
    expect(res.body.err).toContain(NOT_AUTHORIZED)
  })

})


