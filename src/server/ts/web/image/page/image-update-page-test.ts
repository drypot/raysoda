import { useImageUpdatePage } from '@server/web/image/page/image-update-page'
import supertest, { SuperAgentTest } from 'supertest'
import { insertUserFix4, USER1_LOGIN, USER2_LOGIN } from '@server/db/user/fixture/user-fix'
import { newImage } from '@common/type/image'
import { ImageFileManager } from '@server/file/_fileman'
import { omanCloseAllObjects, omanGetConfig, omanGetObject, omanNewSession } from '@server/oman/oman'
import { useUserAuthApi } from '@server/web/user/api/user-auth-api'
import { Express2 } from '@server/web/_express/express2'
import { loginForTest } from '@server/web/user/api/user-auth-api-fixture'
import { omanGetImageFileManager } from '@server/file/_fileman-loader'
import { ImageDB } from '@server/db/image/image-db'
import { UserDB } from '@server/db/user/user-db'
import { useImageUploadApi } from '@server/web/image/api/image-upload-api'

describe('ImageUpdatePage', () => {

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
    await useImageUpdatePage()
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
  it('fails if anonymous', async () => {
    await sat.get('/image-update/1').expect(302).expect('Location', '/user-login')
  })
  it('login as user', async () => {
    await loginForTest(sat, USER1_LOGIN)
  })
  it('fails if image not exist', async () => {
    const res = await sat.get('/image-update/1').expect(200).expect(/<title>Error/)
  })
  it('insert image', async () => {
    await idb.insertImage(newImage({ id: 1, uid: 1 }))
  })
  it('succeeds', async () => {
    const res = await sat.get('/image-update/1').expect(200)
    expect(res.body.err).toBeUndefined()
  })
  it('login as user2', async () => {
    await loginForTest(sat, USER2_LOGIN)
  })
  it('fails if owner not match', async () => {
    const res = await sat.get('/image-update/1').expect(200).expect(/<title>Error/)
  })

})


