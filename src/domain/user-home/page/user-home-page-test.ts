import { getUserDB, UserDB } from '../../../db/user/user-db.ts'
import { getImageDB, ImageDB } from '../../../db/image/image-db.ts'
import type { ImageFileManager } from '../../../fileman/fileman.ts'
import { Express2, getExpress2 } from '../../../express/express2.ts'
import supertest from 'supertest'
import { closeAllObjects, getConfig, initObjectContext } from '../../../oman/oman.ts'
import { getImageFileManager } from '../../../fileman/fileman-loader.ts'
import { useUserHomePage } from './user-home-page.ts'
import { insertUserFix4 } from '../../../db/user/fixture/user-fix.ts'
import { newUser } from '../../../common/type/user.ts'

describe('User Home Page', () => {

  let udb: UserDB
  let idb: ImageDB
  let ifm: ImageFileManager
  let express2: Express2
  let agent: supertest.Agent

  beforeAll(async () => {
    initObjectContext('config/drypot-test.json')
    udb = await getUserDB()
    idb = await getImageDB()
    ifm = await getImageFileManager(getConfig().appNamel)
    express2 = await getExpress2()
    await useUserHomePage()
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
    await udb.insertUser(
      newUser({ id: 5, name: 'xman/yman', home: 'xman/yman', email: 'xmanyman@mail.test' })
    )
  })

  describe('userx view', () => {
    it('/user-id/4', async () => {
      await agent.get('/user-id/4').expect(200)
      // ...
    })
    it('/user/home1', async () => {
      await agent.get('/user/home1').expect(200)
      // ...
    })
    it('/user/HOME1', async () => {
      await agent.get('/user/HOME1').expect(200)
      // ...
    })
    it('/user/xman', async () => {
      await agent.get('/user/xman').expect(404)
      // ...
    })
    it('/user/xman/yman encoded', async () => {
      await agent.get('/user/' + encodeURIComponent('xman/yman')).expect(200)
      // ...
    })
  })

})

