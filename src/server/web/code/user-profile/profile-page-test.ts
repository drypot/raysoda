import { UserDB } from '../../../db/user/user-db'
import { Express2 } from '../../_express/express2'
import supertest, { SuperAgentTest } from 'supertest'
import { insertUserFix4 } from '../../../db/user/fixture/user-fix'
import { ImageDB } from '../../../db/image/image-db'
import { useUserProfilePage } from './profile-page'
import { ImageFileManager } from '../../../file/_fileman'
import { newUser } from '../../../_type/user'
import { omanCloseAllObjects, omanGetConfig, omanGetObject, omanNewSession } from '../../../oman/oman'
import { omanGetImageFileManager } from '../../../file/_fileman-loader'

describe('UserProfilePage', () => {

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
    await useUserProfilePage()
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
    await udb.insertUser(
      newUser({ id: 5, name: 'xman/yman', home: 'xman/yman', email: 'xmanyman@mail.test' })
    )
  })

  describe('userx view', () => {
    it('/user-id/4', async () => {
      const res = await sat.get('/user-id/4').expect(200)
      // ...
    })
    it('/user/user1', async () => {
      const res = await sat.get('/user/user1').expect(200)
      // ...
    })
    it('/user/USER1', async () => {
      const res = await sat.get('/user/USER1').expect(200)
      // ...
    })
    it('/user/xman', async () => {
      const res = await sat.get('/user/xman').expect(404)
      // ...
    })
    it('/user/xman/yman encoded', async () => {
      const res = await sat.get('/user/' + encodeURIComponent('xman/yman')).expect(200)
      // ...
    })
  })

})

