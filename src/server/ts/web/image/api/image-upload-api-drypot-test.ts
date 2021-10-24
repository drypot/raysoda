import supertest, { SuperAgentTest } from 'supertest'
import { insertUserFix4, USER1_LOGIN } from '@server/db/user/fixture/user-fix'
import { getImageMetaOfFile } from '@server/file/magick/magick2'
import { ImageFileManager } from '@server/file/_fileman'
import { omanCloseAllObjects, omanGetConfig, omanGetObject, omanNewSession } from '@server/oman/oman'
import { IMAGE_TYPE } from '@common/type/error-const'
import { useUserAuthApi } from '@server/web/user/api/user-auth-api'
import { Express2 } from '@server/web/_express/express2'
import { loginForTest } from '@server/web/user/api/user-auth-api-fixture'
import { omanGetImageFileManager } from '@server/file/_fileman-loader'
import { ImageDB } from '@server/db/image/image-db'
import { UserDB } from '@server/db/user/user-db'
import { useImageUploadApi } from '@server/web/image/api/image-upload-api'

describe('ImageUploadApi Drypot', () => {

  let udb: UserDB
  let idb: ImageDB
  let ifm: ImageFileManager
  let web: Express2
  let sat: SuperAgentTest

  beforeAll(async () => {
    omanNewSession('config/drypot-test.json')
    udb = await omanGetObject('UserDB') as UserDB
    idb = await omanGetObject('ImageDB') as ImageDB
    ifm = await omanGetImageFileManager(omanGetConfig().appNamel)
    web = await omanGetObject('Express2') as Express2
    await useUserAuthApi()
    await useImageUploadApi()
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
  it('upload fails if jpeg', async () => {
    const res = await sat.post('/api/image-upload').attach('file', 'sample/640x360.jpg').expect(200)
    expect(res.body.err).toContain(IMAGE_TYPE)
  })
  it('upload svg-sample.svg', async () => {
    const res = await sat.post('/api/image-upload').field('comment', 'c1')
      .attach('file', 'sample/svg-sample.svg').expect(200)
    expect(res.body.id).toBe(1)
  })
  it('check db', async () => {
    const r = await idb.findImage(1)
    if (!r) throw new Error()
    expect(r.uid).toBe(1)
    expect(Date.now() - r.cdate.getTime()).toBeLessThan(4000)
    expect(r.comment).toBe('c1')
  })
  it('check file', async () => {
    const meta = await getImageMetaOfFile(ifm.getPathFor(1))
    expect(meta.format).toBe('svg')
  })

})


