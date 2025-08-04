import { Express2, getExpress2 } from '../../../express/express2.ts'
import { getUserDB, UserDB } from '../../../db/user/user-db.ts'
import { getImageDB, ImageDB } from '../../../db/image/image-db.ts'
import type { ImageFileManager } from '../../../fileman/fileman.ts'
import supertest from 'supertest'
import { closeAllObjects, getConfig, initObjectContext } from '../../../oman/oman.ts'
import { getImageFileManager } from '../../../fileman/fileman-loader.ts'
import { useUserAuthApi } from '../../user/api/user-auth-api.ts'
import { useImageUploadApi } from './image-upload-api.ts'
import { useImageDeleteApi } from './image-delete-api.ts'
import {
  ADMIN_LOGIN_FORM,
  insertUserFix4,
  USER1_LOGIN_FORM,
  USER2_LOGIN_FORM
} from '../../../db/user/fixture/user-fix.ts'
import { userLoginForTest } from '../../user/api/user-auth-api-fixture.ts'
import { existsSync } from 'fs'
import { IMAGE_NOT_EXIST, NOT_AUTHORIZED } from '../../../common/type/error-const.ts'

describe('ImageDeleteApi RaySoda', () => {

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
      .attach('file', 'sample/640x360.jpg').expect(200)
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
  it('delete 1 again, fails', async () => {
    const res = await agent.delete('/api/image-delete/1').expect(200)
    expect(res.body.err).toContain(IMAGE_NOT_EXIST)
  })
  it('upload 2', async () => {
    const res = await agent.post('/api/image-upload').field('comment', 'c')
      .attach('file', 'sample/640x360.jpg').expect(200)
    expect(res.body.id).toEqual(2)
  })
  it('login as user2', async () => {
    await userLoginForTest(agent, USER2_LOGIN_FORM)
  })
  it('delete 2 fails, owner not match', async () => {
    const res = await agent.delete('/api/image-delete/2').expect(200)
    expect(res.body.err).toContain(NOT_AUTHORIZED)
  })
  it('login as admin', async () => {
    await userLoginForTest(agent, ADMIN_LOGIN_FORM)
  })
  it('delete 2 by admin', async () => {
    const res = await agent.delete('/api/image-delete/2').expect(200)
    expect(res.body.err).toBeUndefined()
  })
})
