import supertest, { SuperAgentTest } from 'supertest'
import { ImageFileManager } from '@server/fileman/_fileman'
import { closeAllObjects, getConfig, getObject, initObjectContext } from '@server/oman/oman'
import { Express2 } from '@server/express/express2'
import { getImageFileManager } from '@server/fileman/_fileman-loader'
import { ImageDB } from '@server/db/image/image-db'
import { insertUserFix4 } from '@server/db/user/fixture/user-fix'
import { UserDB } from '@server/db/user/user-db'
import { useImageListPage } from '@server/domain/image/page/image-list-page'
import { DB } from '@server/db/_db/db'
import { useUserAuthApi } from '@server/domain/user/api/user-auth-api'

describe('ImageListPage', () => {

  let db: DB
  let udb: UserDB
  let idb: ImageDB
  let ifm: ImageFileManager
  let web: Express2
  let sat: SuperAgentTest

  beforeAll(async () => {
    initObjectContext('config/raysoda-test.json')
    db = await getObject('DB') as DB
    udb = await getObject('UserDB') as UserDB
    idb = await getObject('ImageDB') as ImageDB
    ifm = await getImageFileManager(getConfig().appNamel)
    web = await getObject('Express2') as Express2
    await useUserAuthApi()
    await useImageListPage()
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
  })

  it('init table', async () => {
    await idb.dropTable()
    await idb.createTable()
  })
  // it('remove image dir', async () => {
  //   await ifm.rmRoot()
  // })
  it('insert fix', async () => {
    const list = [
      [1, 2, new Date(2003, 0, 1), '1'],
      [2, 2, new Date(2003, 1, 2), '2'],
      [3, 2, new Date(2003, 2, 3), '3'],
      [4, 2, new Date(2003, 3, 4), '4'],
      [5, 2, new Date(2003, 4, 5), '5'],
      [6, 1, new Date(2003, 5, 6), '6'],
      [7, 1, new Date(2003, 6, 7), '7'],
      [8, 1, new Date(2003, 7, 8), '8'],
      [9, 1, new Date(2003, 8, 9), '9'],
      [10, 1, new Date(2003, 9, 10), '10'],
    ]
    await db.query('insert into image(id, uid, cdate, comment) values ?', [list])
  })
  it('p 1, ps 128', async () => {
    const res = await sat.get('/image-list').expect(200)
    // supertest 에 바로 expect 연결했더니 text 가 1K 가 넘는다고 에러가 난다.
    // 따로 Jasmine Expect 하도록 한다.
    expect(res.text).toMatch(/<title>RaySoda<\/title>/)
  })
  it('d 20030607', async () => {
    const res = await sat.get('/image-list?d=2003-06-07').expect(200)
  })

})
