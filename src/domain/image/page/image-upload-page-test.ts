import { getUserDB, UserDB } from '../../../db/user/user-db.ts'
import { getImageDB, ImageDB } from '../../../db/image/image-db.ts'
import type { ImageFileManager } from '../../../fileman/fileman.ts'
import { Express2, getExpress2 } from '../../../express/express2.ts'
import supertest from 'supertest'
import { closeAllObjects, getConfig, initObjectContext } from '../../../oman/oman.ts'
import { getImageFileManager } from '../../../fileman/fileman-loader.ts'
import { useUserAuthApi } from '../../user/api/user-auth-api.ts'
import { useImageUploadPage } from './image-upload-page.ts'
import { insertUserFix4, USER1_LOGIN_FORM } from '../../../db/user/fixture/user-fix.ts'
import { userLoginForTest } from '../../user/api/user-auth-api-fixture.ts'

describe('ImageUploadPage', () => {

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
    await useImageUploadPage()
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
    await agent.get('/image-upload').expect(302).expect('Location', '/user-login')
  })
  it('login as user', async () => {
    await userLoginForTest(agent, USER1_LOGIN_FORM)
  })
  it('succeeds', async () => {
    await agent.get('/image-upload').expect(200)
  })

})


