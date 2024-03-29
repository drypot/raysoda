import supertest, { SuperAgentTest } from 'supertest'
import { ADMIN_LOGIN_FORM, insertUserFix4, USER1_LOGIN_FORM, USER2_LOGIN_FORM } from '@server/db/user/fixture/user-fix'
import { useImageDeleteApi } from '@server/domain/image/api/image-delete-api'
import { IMAGE_NOT_EXIST, NOT_AUTHORIZED } from '@common/type/error-const'
import { ImageFileManager } from '@server/fileman/_fileman'
import { closeAllObjects, getConfig, getObject, initObjectContext } from '@server/oman/oman'
import { useUserAuthApi } from '@server/domain/user/api/user-auth-api'
import { Express2 } from '@server/express/express2'
import { userLoginForTest } from '@server/domain/user/api/user-auth-api-fixture'
import { existsSync } from 'fs'
import { getImageFileManager } from '@server/fileman/_fileman-loader'
import { ImageDB } from '@server/db/image/image-db'
import { UserDB } from '@server/db/user/user-db'
import { useImageUploadApi } from '@server/domain/image/api/image-upload-api'

describe('ImageDeleteApi RaySoda', () => {

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
    await useImageDeleteApi()
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
  it('upload 1', async () => {
    const res = await sat.post('/api/image-upload').field('comment', 'c')
      .attach('file', 'sample/640x360.jpg').expect(200)
    expect(res.body.id).toEqual(1)
  })
  it('check file 1', async () => {
    expect(existsSync(ifm.getPathFor(1))).toBe(true)
  })
  it('delete 1', async () => {
    const res = await sat.delete('/api/image-delete/1').expect(200)
    expect(res.body.err).toBeUndefined()
  })
  it('check file 1 after delete', async () => {
    expect(existsSync(ifm.getPathFor(1))).toBe(false)
  })
  it('delete 1 again, fails', async () => {
    const res = await sat.delete('/api/image-delete/1').expect(200)
    expect(res.body.err).toContain(IMAGE_NOT_EXIST)
  })
  it('upload 2', async () => {
    const res = await sat.post('/api/image-upload').field('comment', 'c')
      .attach('file', 'sample/640x360.jpg').expect(200)
    expect(res.body.id).toEqual(2)
  })
  it('login as user2', async () => {
    await userLoginForTest(sat, USER2_LOGIN_FORM)
  })
  it('delete 2 fails, owner not match', async () => {
    const res = await sat.delete('/api/image-delete/2').expect(200)
    expect(res.body.err).toContain(NOT_AUTHORIZED)
  })
  it('login as admin', async () => {
    await userLoginForTest(sat, ADMIN_LOGIN_FORM)
  })
  it('delete 2 by admin', async () => {
    const res = await sat.delete('/api/image-delete/2').expect(200)
    expect(res.body.err).toBeUndefined()
  })
})
