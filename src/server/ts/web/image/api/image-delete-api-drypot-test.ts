import supertest, { SuperAgentTest } from 'supertest'
import { insertUserFix4, USER1_LOGIN } from '@server/db/user/fixture/user-fix'
import { useImageDeleteApi } from '@server/web/image/api/image-delete-api'
import { ImageFileManager } from '@server/file/_fileman'
import { omanCloseAllObjects, omanGetConfig, omanGetObject, omanNewSession } from '@server/oman/oman'
import { useUserAuthApi } from '@server/web/user/api/user-auth-api'
import { Express2 } from '@server/web/_express/express2'
import { loginForTest } from '@server/web/user/api/user-auth-api-fixture'
import { existsSync } from 'fs'
import { omanGetImageFileManager } from '@server/file/_fileman-loader'
import { ImageDB } from '@server/db/image/image-db'
import { UserDB } from '@server/db/user/user-db'
import { useImageUploadApi } from '@server/web/image/api/image-upload-api'

describe('ImageDeleteApi Drypot', () => {

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
        .attach('file', 'sample/svg-sample.svg').expect(200)
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
  })

})
