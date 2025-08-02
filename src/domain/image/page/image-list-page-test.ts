import { DB, getDatabase } from '../../../db/db/db.js'
import { getUserDB, UserDB } from '../../../db/user/user-db.js'
import { getImageDB, ImageDB } from '../../../db/image/image-db.js'
import { ImageFileManager } from '../../../fileman/fileman.js'
import { Express2, getExpress2 } from '../../../express/express2.js'
import supertest from 'supertest'
import { closeAllObjects, getConfig, initObjectContext } from '../../../oman/oman.js'
import { getImageFileManager } from '../../../fileman/fileman-loader.js'
import { useUserAuthApi } from '../../user/api/user-auth-api.js'
import { useImageListPage } from './image-list-page.js'
import { insertUserFix4 } from '../../../db/user/fixture/user-fix.js'
import { BannerDB, getBannerDB } from '../../../db/banner/banner-db.js'

describe('ImageListPage', () => {

  let db: DB
  let udb: UserDB
  let idb: ImageDB
  let bdb: BannerDB
  let ifm: ImageFileManager
  let express2: Express2
  let agent: supertest.Agent

  beforeAll(async () => {
    initObjectContext('config/raysoda-test.json')
    db = await getDatabase()
    udb = await getUserDB()
    idb = await getImageDB()
    bdb = await getBannerDB()
    ifm = await getImageFileManager(getConfig().appNamel)
    express2 = await getExpress2()
    await useUserAuthApi()
    await useImageListPage()
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
    const res = await agent.get('/image-list').expect(200)
    // supertest 에 바로 expect 연결했더니 text 가 1K 가 넘는다고 에러가 난다.
    // 따로 Jasmine Expect 하도록 한다.
    expect(res.text).toMatch(/<title>RaySoda<\/title>/)
  })
  it('d 20030607', async () => {
    const res = await agent.get('/image-list?d=2003-06-07').expect(200)
  })

})
