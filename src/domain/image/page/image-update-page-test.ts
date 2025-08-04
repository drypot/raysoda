import { getUserDB, UserDB } from '../../../db/user/user-db.ts'
import { getImageDB, ImageDB } from '../../../db/image/image-db.ts'
import type { ImageFileManager } from '../../../fileman/fileman.ts'
import { Express2, getExpress2 } from '../../../express/express2.ts'
import supertest from 'supertest'
import { closeAllObjects, getConfig, initObjectContext } from '../../../oman/oman.ts'
import { getImageFileManager } from '../../../fileman/fileman-loader.ts'
import { useUserAuthApi } from '../../user/api/user-auth-api.ts'
import { useImageUploadApi } from '../api/image-upload-api.ts'
import { useImageUpdatePage } from './image-update-page.ts'
import { insertUserFix4, USER1_LOGIN_FORM, USER2_LOGIN_FORM } from '../../../db/user/fixture/user-fix.ts'
import { userLoginForTest } from '../../user/api/user-auth-api-fixture.ts'
import { newImage } from '../../../common/type/image.ts'

describe('ImageUpdatePage', () => {

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
    await useImageUpdatePage()
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
  it('fails if anonymous', async () => {
    await agent.get('/image-update/1').expect(302).expect('Location', '/user-login')
  })
  it('login as user', async () => {
    await userLoginForTest(agent, USER1_LOGIN_FORM)
  })
  it('fails if image not exist', async () => {
    const res = await agent.get('/image-update/1').expect(200).expect(/<title>Error/)
  })
  it('insert image', async () => {
    await idb.insertImage(newImage({ id: 1, uid: 1 }))
  })
  it('succeeds', async () => {
    const res = await agent.get('/image-update/1').expect(200)
    expect(res.body.err).toBeUndefined()
  })
  it('login as user2', async () => {
    await userLoginForTest(agent, USER2_LOGIN_FORM)
  })
  it('fails if owner not match', async () => {
    const res = await agent.get('/image-update/1').expect(200).expect(/<title>Error/)
  })

})


