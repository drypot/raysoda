import { ImageFileManager } from '../../../fileman/fileman.js'
import { getUserDB, UserDB } from '../../../db/user/user-db.js'
import { getImageDB, ImageDB } from '../../../db/image/image-db.js'
import { Express2, getExpress2 } from '../../../express/express2.js'
import supertest from 'supertest'
import { closeAllObjects, getConfig, initObjectContext } from '../../../oman/oman.js'
import { getImageFileManager } from '../../../fileman/fileman-loader.js'
import { useUserAuthApi } from '../../user/api/user-auth-api.js'
import { useImageUploadApi } from './image-upload-api.js'
import { useImageDeleteApi } from './image-delete-api.js'
import { insertUserFix4, USER1_LOGIN_FORM } from '../../../db/user/fixture/user-fix.js'
import { userLoginForTest } from '../../user/api/user-auth-api-fixture.js'
import { existsSync } from 'fs'
import { IMAGE_NOT_EXIST } from '../../../common/type/error-const.js'

describe('ImageDeleteApi Osoky', () => {

  let udb: UserDB
  let idb: ImageDB
  let ifm: ImageFileManager
  let express2: Express2
  let agent: supertest.Agent

  beforeAll(async () => {
    initObjectContext('config/osoky-test.json')
    udb = await getUserDB()
    idb = await getImageDB()
    ifm = await getImageFileManager(getConfig().appNamel)
    express2 = await getExpress2()
    await useUserAuthApi()
    await useImageUploadApi()
    await useImageDeleteApi()
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
  it('remove image dir', async () => {
    await ifm.rmRoot()
  })
  it('login as user1', async () => {
    await userLoginForTest(agent, USER1_LOGIN_FORM)
  })
  it('upload 1', async () => {
    const res = await agent.post('/api/image-upload').field('comment', 'c')
      .attach('file', 'sample/1280x720.jpg').expect(200)
    expect(res.body.id).toEqual(1)
  })
  it('check file 1', async () => {
    expect(existsSync(ifm.getPathFor(1))).toBe(true)
  })
  it('delete 1', async () => {
    const res = await agent.delete('/api/image-delete/1').expect(200)
    expect(res.body.err).toBeUndefined()
  })
  it('check file 1 after delete', async () => {
    expect(existsSync(ifm.getPathFor(1))).toBe(false)
  })
  it('delete 1 again', async () => {
    const res = await agent.delete('/api/image-delete/1').expect(200)
    expect(res.body.err).toContain(IMAGE_NOT_EXIST)
  })

})
