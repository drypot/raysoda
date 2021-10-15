import { UserDB } from '../../../db/user/user-db'
import { Express2 } from '../../_express/express2'
import supertest, { SuperAgentTest } from 'supertest'
import { useUserAuthApi } from '../../user-auth/api/user-auth-api'
import { ADMIN_LOGIN, insertUserFix4, USER1_LOGIN, USER2_LOGIN } from '../../../db/user/fixture/user-fix'
import { ImageDB } from '../../../db/image/image-db'
import { ImageFileManager } from '../../../file/_fileman'
import { useImageUploadApi } from './image-upload-api'
import { loginForTest } from '../../user-auth/api/user-auth-api-fixture'
import { useImageDeleteApi } from './image-delete-api'
import { existsSync } from 'fs'
import { IMAGE_NOT_EXIST, NOT_AUTHORIZED } from '../../../_type/error-const'
import { omanCloseAllObjects, omanGetConfig, omanGetObject, omanNewSession } from '../../../oman/oman'
import { omanGetImageFileManager } from '../../../file/_fileman-loader'

describe('ImageDeleteApi RaySoda', () => {

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
    await useImageDeleteApi()
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

  describe('update image', () => {
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
      await loginForTest(sat, USER2_LOGIN)
    })
    it('delete 2 fails, owner not match', async () => {
      const res = await sat.delete('/api/image-delete/2').expect(200)
      expect(res.body.err).toContain(NOT_AUTHORIZED)
    })
    it('login as admin', async () => {
      await loginForTest(sat, ADMIN_LOGIN)
    })
    it('delete 2 by admin', async () => {
      const res = await sat.delete('/api/image-delete/2').expect(200)
      expect(res.body.err).toBeUndefined()
    })
  })

})