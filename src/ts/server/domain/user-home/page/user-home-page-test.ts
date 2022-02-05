import { UserDB } from '@server/db/user/user-db'
import supertest, { SuperAgentTest } from 'supertest'
import { useUserHomePage } from '@server/domain/user-home/page/user-home-page'
import { ImageFileManager } from '@server/fileman/_fileman'
import { closeAllObjects, getConfig, getObject, initObjectContext } from '@server/oman/oman'
import { Express2 } from '@server/express/express2'
import { getImageFileManager } from '@server/fileman/_fileman-loader'
import { ImageDB } from '@server/db/image/image-db'
import { insertUserFix4 } from '@server/db/user/fixture/user-fix'
import { newUser } from '@common/type/user'

describe('User Home Page', () => {

  let udb: UserDB
  let idb: ImageDB
  let ifm: ImageFileManager
  let web: Express2
  let sat: SuperAgentTest

  beforeAll(async () => {
    initObjectContext('config/drypot-test.json')
    udb = await getObject('UserDB') as UserDB
    idb = await getObject('ImageDB') as ImageDB
    ifm = await getImageFileManager(getConfig().appNamel)
    web = await getObject('Express2') as Express2
    await useUserHomePage()
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
    await udb.insertUser(
      newUser({ id: 5, name: 'xman/yman', home: 'xman/yman', email: 'xmanyman@mail.test' })
    )
  })

  describe('userx view', () => {
    it('/user-id/4', async () => {
      await sat.get('/user-id/4').expect(200)
      // ...
    })
    it('/user/home1', async () => {
      await sat.get('/user/home1').expect(200)
      // ...
    })
    it('/user/HOME1', async () => {
      await sat.get('/user/HOME1').expect(200)
      // ...
    })
    it('/user/xman', async () => {
      await sat.get('/user/xman').expect(404)
      // ...
    })
    it('/user/xman/yman encoded', async () => {
      await sat.get('/user/' + encodeURIComponent('xman/yman')).expect(200)
      // ...
    })
  })

})

